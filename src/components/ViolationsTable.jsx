import React, { useEffect, useState } from "react";
import { fetchViolations } from "../api/api";
import { io } from "socket.io-client";
export default function ViolationsTable() {
  const [violations, setViolations] = useState([]);
  const [agents, setAgents] = useState([]);   // Load agents for name lookup
  const [loading, setLoading] = useState(true);

  // Fetch violations
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchViolations();
        setViolations(data.violations || []);

        // Show notification for latest violation
        if (data.violations && data.violations.length > 0) {
          const latest = data.violations[data.violations.length - 1];
          window.agentAPI.notify(
            "Violation Detected",
            `${latest.filePath} → ${latest.reason}`
          );
        }
      } catch (err) {
        console.error("Error loading violations:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Fetch agents to map agentId → name
  useEffect(() => {
    fetch("http://localhost:7000/api/agents")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setAgents(data) : setAgents([]))
      .catch(err => console.error("Failed to load agents:", err));
  }, []);

  const getAgentName = (id) => {
    const agent = agents.find(a => a.id === id);
    return agent ? `${agent.name} (${agent.os})` : id;
  };

  useEffect(() => {
  const socket = io("http://localhost:7000");
  socket.on("violation", (v) => {
    setViolations(prev => [...prev, v]);
    window.agentAPI.notify(
      "Violation Detected",
      `${v.agentId} → ${v.reason}`
    );
  });
  return () => socket.disconnect();
}, []);


  if (loading) return <p className="text-center mt-4">Loading violations...</p>;

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Violations</h2>

      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-secondary">
          <tr>
            <th>Agent</th>
            <th>File Path</th>
            <th>Reason</th>
            <th>Timestamp</th>
                <th>Severity</th> {/* NEW */}
    <th>Recommended Action</th> {/* NEW */}
          </tr>
        </thead>

        <tbody>
          {violations.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No violations found.
              </td>
            </tr>
          ) : (
            violations.map(v => (
              <tr key={v.id}>
                <td><strong>{getAgentName(v.agentId)}</strong></td>

                <td className="text-break">{v.filePath}</td>

                <td>
                  <span className="badge text-bg-danger px-3 py-2">
                    {v.reason}
                  </span>
                </td>
                      <td>
        <span className={`badge px-2 py-1 ${
          v.severity === "critical" ? "text-bg-danger" :
          v.severity === "high" ? "text-bg-warning" :
          "text-bg-secondary"
        }`}>
          {v.severity || "—"}
        </span>
      </td>
      <td>{v.actionRecommended || "monitor"}</td>

                <td>{new Date(v.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}
