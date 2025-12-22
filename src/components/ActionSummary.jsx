import React, { useEffect, useState } from "react";
import { socket } from "../services/socket";

export default function ActionSummary({ usns }) {
  const [actionCounts, setActionCounts] = useState({});

  useEffect(() => {
    // Count actions from backend USNs
const counts = (usns || []).reduce((acc, usn) => {

      if (usn.actionRecommended) {
        acc[usn.actionRecommended] = (acc[usn.actionRecommended] || 0) + 1;
      }
      return acc;
    }, {});
    setActionCounts(counts);

    // Update in real-time via socket
    socket.on("usnAction", ({ action }) => {
      setActionCounts(prev => ({
        ...prev,
        [action]: (prev[action] || 0) + 1
      }));
    });

    return () => socket.off("usnAction");
  }, [usns]);

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
