// components/AgentsTable.jsx
import React, { useEffect, useState } from "react";

export default function AgentsTable() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7000/api/agents")
      .then(res => res.json())
      .then(data => setAgents(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch agents:", err));
  }, []);

  // Manual heartbeat trigger (for testing)
  const sendHeartbeat = async (agentId) => {
    await fetch("http://localhost:7000/api/agents/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, status: "active" })
    });
    alert("Heartbeat sent!");
  };

  return (
    <div>
      <h2>Agents</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>OS</th><th>IP</th><th>Status</th><th>Last Seen</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr key={agent.id}>
              <td>{agent.name}</td>
              <td>{agent.os}</td>
              <td>{agent.ip}</td>
              <td>{agent.status}</td>
            <td>
  {agent.lastSeen ? new Date(agent.lastSeen).toLocaleString() : "—"}
</td>

              <td>
                <button onClick={() => sendHeartbeat(agent.id)}>Ping</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
