import React from "react";

// Simple version comparison helper
const isVersionVulnerable = (agentVersion, affectedRanges) => {
  if (!agentVersion || !Array.isArray(affectedRanges)) return false;

  // Example: affectedRanges contains strings like ">=18.0.0 <18.18.0"
  return affectedRanges.some(range => {
    const match = range.match(/>=([\d.]+)\s*<([\d.]+)/);
    if (!match) return false; 

    const [_, min, max] = match;
    return agentVersion >= min && agentVersion < max;
  });
}; 

export default function USNDetail({ notice, agent }) {
  if (!notice) return <p className="text-muted">Select a USN to view details.</p>;

  const agentVersion = agent?.version || agent?.nodeVersion || "";
  const affectedRanges = notice.affectedVersions || [];

  const vulnerable = agent && isVersionVulnerable(agentVersion, affectedRanges);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">USN Detail</h4>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <strong>{notice.usnId}</strong> — {notice.package}
        </div>

        <div className="card-body">
          <p><strong>Published:</strong> {new Date(notice.publishedAt).toLocaleDateString()}</p>
          <p><strong>CVEs:</strong> {notice.cves.join(", ")}</p>
          {/* <p><strong>Affected Versions:</strong> {affectedRanges.join(", ")}</p> */}

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
            </>
          ) : (
            <p className="text-muted">No agent selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
