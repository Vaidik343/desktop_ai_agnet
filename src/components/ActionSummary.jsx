import React from "react";

export default function ActionSummary({ usns }) {
  // Count how many USNs recommend each action
  const actionCounts = usns.reduce((acc, usn) => {
    if (usn.actionRecommended) {
      acc[usn.actionRecommended] = (acc[usn.actionRecommended] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="action-summary card p-3 shadow-sm">
      <h5 className="mb-3">Action Summary</h5>
      {Object.entries(actionCounts).map(([action, count]) => (
        <div key={action} className="action-item mb-1">
          <span
            className={`badge px-3 py-2 ${
              action === "block"
                ? "bg-danger"
                : action === "quarantine"
                ? "bg-warning text-dark"
                : action === "update"
                ? "bg-primary"
                : action === "monitor"
                ? "bg-info text-dark"
                : "bg-secondary"
            }`}
          >
            {action}: {count}
          </span>
        </div>
      ))}
      {Object.keys(actionCounts).length === 0 && (
        <p className="text-muted">No recommended actions yet.</p>
      )}
    </div>
  );
}
