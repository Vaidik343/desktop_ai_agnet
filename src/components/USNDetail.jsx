import React, { useEffect, useState } from "react";
import { socket } from "../services/socket";

const isVersionVulnerable = (agentVersion, affectedRanges) => {
  if (!agentVersion || !Array.isArray(affectedRanges)) return false;
  return affectedRanges.some(range => {
    const match = range.match(/>=([\d.]+)\s*<([\d.]+)/);
    if (!match) return false;
    const [_, min, max] = match;
    return agentVersion >= min && agentVersion < max;
  });
};

export default function USNDetail({ notice, agent }) {
  const [actionStatus, setActionStatus] = useState(null);

  // Always call useEffect, guard inside
  useEffect(() => {
    if (!notice) return; // guard here
    socket.on("actionCompleted", (data) => {
      if (data.usnId === notice.usnId) {
        setActionStatus(data);
      }
    });
    return () => socket.off("actionCompleted");
  }, [notice]);

  if (!notice) {
    return <p className="text-muted">Select a USN to view details.</p>;
  }

  const agentVersion = agent?.version || agent?.nodeVersion || "";
  const affectedRanges = notice.affectedVersions || [];
  const vulnerable = agent && isVersionVulnerable(agentVersion, affectedRanges);

  async function executeAction(action) {
    try {
      const res = await fetch("http://localhost:7000/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usnId: notice.usnId, agentId: agent.id, action })
      });
      const data = await res.json();
      setActionStatus({ success: true, action, message: data.message || "Executed successfully" });
    } catch (err) {
      setActionStatus({ success: false, action, message: err.message });
    }
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-3">USN Detail</h4>
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <strong>{notice.usnId}</strong> — {notice.package}
        </div>
        <div className="card-body">
          <p><strong>Published:</strong> {new Date(notice.publishedAt).toLocaleDateString()}</p>
          <p><strong>CVEs:</strong> {notice.cves?.join(", ") || "—"}</p>
          <p><strong>Risk Level:</strong> {notice.riskLevel || "—"}</p>
          <p><strong>Recommended Actions:</strong> {notice.recommendedActions?.join(", ") || "—"}</p>
          <p><strong>Compliance:</strong> {notice.complianceFrameworks?.join(", ") || "—"}</p>
          <hr />
          {agent ? (
            <>
              <h5>Agent: {agent.name}</h5>
              <p><strong>Version:</strong> {agentVersion}</p>
              {vulnerable ? (
                <div className="alert alert-danger mt-3">
                  ⚠️ <strong>Vulnerable</strong> to {notice.usnId}<br />
                  Reason: Agent version {agentVersion} falls within affected range.
                </div>
              ) : (
                <div className="alert alert-success mt-3">
                  ✅ <strong>Safe</strong> — Agent version {agentVersion} is not affected.
                </div>
              )}
              {vulnerable && (
                <div className="mt-3">
                  <h6>Recommended Action: <strong>{notice.actionRecommended || "monitor"}</strong></h6>
                  <div className="btn-group">
                    <button className="btn btn-danger" onClick={() => executeAction("block")}>Block</button>
                    <button className="btn btn-warning" onClick={() => executeAction("quarantine")}>Quarantine</button>
                    <button className="btn btn-primary" onClick={() => executeAction("update")}>Update</button>
                    <button className="btn btn-info" onClick={() => executeAction("monitor")}>Monitor</button>
                  </div>
                </div>
              )}
              {actionStatus && (
                <div className={`alert mt-3 ${actionStatus.success ? "alert-success" : "alert-danger"}`}>
                  Action {actionStatus.action}: {actionStatus.message}
                </div>
              )}
            </>
          ) : (
            <p className="text-muted">No agent selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
