import chokidar from "chokidar";
import path from "path";
import { sendBaseline } from "./agent.js";
import fetch from "node-fetch";

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


export function watchFolders(agentId, folders, allowedExtensions, forbiddenExtensions) {
  folders.forEach(folder => {
    console.log("Watching folder:", folder);
    const watcher = chokidar.watch(folder, { ignoreInitial: true });

    watcher.on("add", async filePath => {
      console.log("File detected:", filePath);

      if (!isExtensionAllowed(filePath, allowedExtensions, forbiddenExtensions)) {
        console.log("⚠️ Forbidden file detected:", filePath);

        try {
          const res = await fetch("http://localhost:7000/api/violations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              agentId,
              filePath,
              reason: "Forbidden extension detected"
            })
          });
          const result = await res.json();
          console.log("🚨 Violation sent to backend:", result);

           if (window?.agentAPI?.notify) {
      window.agentAPI.notify(
        "Violation Detected",
        `${filePath} → Forbidden extension`
      );
    }
        } catch (err) {
          console.error("❌ Failed to send violation:", err);
        }
        return;
      }

      console.log("📄 File added:", filePath);
      await sendBaseline(agentId, [filePath]);
    });

    watcher.on("change", async filePath => {
      console.log("✏️ File modified:", filePath);
      await sendBaseline(agentId, [filePath]);
    });

    watcher.on("unlink", async filePath => {
      console.log("🗑️ File deleted:", filePath);
    });

    watcher.on("add", filePath => sendActivity(agentId, filePath, "created"));
watcher.on("change", filePath => sendActivity(agentId, filePath, "modified"));
watcher.on("unlink", filePath => sendActivity(agentId, filePath, "deleted"));

  });
}
