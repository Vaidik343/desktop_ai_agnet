import chokidar from "chokidar";
import path from "path";
import { sendBaseline } from "./agent.js";
import fetch from "node-fetch";
import notifier from "node-notifier";
import fs from "fs";

function waitForFileUnlock(filePath, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      fs.access(filePath, fs.constants.W_OK, (err) => {
        if (!err) return resolve(true);

        if (Date.now() - start >= timeout) {
          return reject(new Error("File stayed locked too long"));
        }

        setTimeout(check, 100);
      });
    };

    check();
  });
}


function deleteFileWithRetry(filePath, retries = 10, delay = 200) {
  return new Promise((resolve, reject) => {
    const attempt = (count) => {
      try {
        fs.unlinkSync(filePath);
        return resolve(true);
      } catch (err) {
        if (err.code === "EBUSY" && count < retries) {
          console.log(`⏳ File locked... retrying delete (${count}/${retries})`);
          return setTimeout(() => attempt(count + 1), delay);
        }
        return reject(err);
      }
    };
    attempt(1);
  });
}

function isExtensionAllowed(filePath, allowed = [], forbidden = []) {
  const ext = path.extname(filePath).toLowerCase();
  console.log("Extension check:", ext, { allowed, forbidden });
  if (forbidden.includes(ext)) return false;
  if (allowed.length > 0 && !allowed.includes(ext)) return false;
  return true;
} 

async function sendActivity(agentId, filePath, action) {
  try {
    const res = await fetch("http://localhost:7000/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId,
        filePath,
        action, // "created", "modified", "deleted"
        timestamp: new Date().toISOString()
      })
    });
    const result = await res.json();
    console.log("📜 Activity log sent:", result);
  } catch (err) {
    console.error("❌ Failed to send activity:", err);
  }
}


async function getAgentName(agentId) {
  try {
    const res = await fetch(`http://localhost:7000/api/agents/${agentId}`);
    const agent = await res.json();
    return agent.name || agentId;
  } catch (err) {
    console.error("❌ Failed to fetch agent name:", err);
    return agentId; // fallback
  }
}

export async function watchFolders(agentId, folders, allowedExtensions, forbiddenExtensions, blockedExtensions) {
  const agentName = await getAgentName(agentId);

  folders.forEach(folder => {
    console.log("Watching folder:", folder);

    const watcher = chokidar.watch(folder, { ignoreInitial: true });

    // FILE ADDED
    watcher.on("add", async filePath => {
      console.log("File detected:", filePath);
      const ext = path.extname(filePath).toLowerCase();

      // 1️⃣ BLOCKED EXTENSIONS → DELETE IMMEDIATELY
     if (blockedExtensions.includes(ext)) {
  console.log("⛔ BLOCKED EXTENSION → Deleting:", filePath);

  try {
     await waitForFileUnlock(filePath); 
    await deleteFileWithRetry(filePath); // <— FIXED HERE
    console.log("🗑️ File deleted:", filePath);

    await fetch("http://localhost:7000/api/violations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId,
        filePath,
        reason: `Blocked extension ${ext} — file deleted`
      })
    });

    notifier.notify({
      title: `Blocked File - ${agentName}`,
      message: `${filePath} → Deleted (blocked extension)`,
      sound: true
    });

  } catch (err) {
    console.error("❌ Failed to delete blocked file even after retries:", err);
  }

  return;
}


      // 2️⃣ FORBIDDEN EXTENSIONS → VIOLATION ONLY
      if (!isExtensionAllowed(filePath, allowedExtensions, forbiddenExtensions)) {
        console.log("⚠️ Forbidden extension:", filePath);

        try {
          await fetch("http://localhost:7000/api/violations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              agentId,
              filePath,
              reason: `Forbidden extension ${ext}`
            })
          });

          notifier.notify({
            title: `Violation - ${agentName}`,
            message: `${filePath} → Forbidden extension`,
            sound: true
          });

        } catch (err) {
          console.error("❌ Failed to send violation:", err);
        }

        return; // STOP — no baseline scan
      }

      // 3️⃣ ALLOWED FILE → BASELINE SCAN
      console.log("📄 Allowed file:", filePath);
      await sendBaseline(agentId, [filePath]);

      // Activity log
      sendActivity(agentId, filePath, "created");
    });

    // FILE MODIFIED
    watcher.on("change", async filePath => {
      console.log("✏️ File modified:", filePath);
      await sendBaseline(agentId, [filePath]);
      sendActivity(agentId, filePath, "modified");
    });

    // FILE DELETED
    watcher.on("unlink", filePath => {
      console.log("🗑️ File deleted:", filePath);
      sendActivity(agentId, filePath, "deleted");
    });

  });
}
