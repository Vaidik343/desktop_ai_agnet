import React, { useState, useEffect } from "react";

export default function PoliciesForm() {
  const [policies, setPolicies] = useState([]);
  const [agents, setAgents] = useState([]); // 🟢 store agents for dropdown
  const [form, setForm] = useState({
    agentId: "",
    folders: [],
    allowedExtensions: [],
    forbiddenExtensions: []
  });

  // Fetch policies
  useEffect(() => {
    fetch("http://localhost:7000/api/policies")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setPolicies(data) : setPolicies([]))
      .catch(err => console.error("Failed to fetch policies:", err));
  }, []);

  // Fetch agents for dropdown
  useEffect(() => {
    fetch("http://localhost:7000/api/agents")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setAgents(data) : setAgents([]))
      .catch(err => console.error("Failed to fetch agents:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:7000/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Policy created");
  };

  return (
    <div>
      <h2>Policies</h2>
      <form onSubmit={handleSubmit}>
        {/* Dropdown for Agent ID */}
        <label>Agent:</label>
        <select
          value={form.agentId}
          onChange={e => setForm({ ...form, agentId: e.target.value })}
        >
          <option value="">Global (all agents)</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>
              {agent.name} ({agent.os})
            </option>
          ))}
        </select>

        <input
          placeholder="Folders (comma separated)"
          onChange={e => setForm({ ...form, folders: e.target.value.split(",") })}
        />
        <input
          placeholder="Allowed Extensions"
          onChange={e => setForm({ ...form, allowedExtensions: e.target.value.split(",") })}
        />
        <input
          placeholder="Forbidden Extensions"
          onChange={e => setForm({ ...form, forbiddenExtensions: e.target.value.split(",") })}
        />
        <button type="submit">Create Policy</button>
      </form>

      <ul>
        {policies.map(p => (
          <li key={p.id}>
            Agent: {p.agentId || "Global"} | Folders: {p.folders?.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
