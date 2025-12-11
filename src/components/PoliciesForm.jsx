import React, { useState, useEffect } from "react";

export default function PoliciesForm() {
  const [policies, setPolicies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    agentId: "",
    folders: [],
    allowedExtensions: [],
    forbiddenExtensions: [],
    blockedExtensions: []
  });
  console.log("🚀 ~ PoliciesForm ~ form:", form)

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await fetch("http://localhost:7000/api/policies");
      const data = await res.json();
      setPolicies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch policies:", err);
    }
  };

  // Fetch agents
  useEffect(() => {
    fetch("http://localhost:7000/api/agents")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setAgents(data) : setAgents([]))
      .catch(err => console.error("Failed to fetch agents:", err));
  }, []);

  const getAgentName = (id) => {
    if (!id) return "Global";
    const agent = agents.find(a => a.id === id);
    return agent ? `${agent.name} (${agent.os})` : id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:7000/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Policy created");
    fetchPolicies();
  };

  const handleDelete = async (policyId) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    try {
      await fetch(`http://localhost:7000/api/policies/${policyId}`, {
        method: "DELETE"
      });
      setPolicies(prev => prev.filter(p => p.id !== policyId));
    } catch (err) {
      console.error("Failed to delete policy:", err);
      alert("Failed to delete policy");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Policies</h2>

      {/* Policy Form */}
      <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">

        {/* Agent dropdown */}
        <div className="mb-3">
          <label className="form-label fw-bold">Agent</label>
          <select
            className="form-select"
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
        </div>

        {/* Folder picker */}
        <div className="mb-3">
          <label className="form-label fw-bold">Choose Folder(s)</label>
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                const folders = await window.agentAPI.chooseFolder();
                setForm({ ...form, folders });
              }}
            >
              Choose Folder
            </button>
          </div>

          {form.folders.length > 0 && (
            <small className="text-muted d-block mt-2">
              Selected: {form.folders.join(", ")}
            </small>
          )}
        </div>

        {/* Allowed Extensions */}
        <div className="mb-3">
          <label className="form-label fw-bold">Allowed Extensions</label>
          <input
            className="form-control"
            placeholder="e.g., txt, js, json"
            onChange={e =>
              setForm({ ...form, allowedExtensions: e.target.value.split(",") })
            }
          />
        </div>

        {/* Forbidden Extensions */}
        <div className="mb-3">
          <label className="form-label fw-bold">Forbidden Extensions</label>
          <input
            className="form-control"
            placeholder="e.g., exe, bat"
            onChange={e =>
              setForm({
                ...form,
                forbiddenExtensions: e.target.value.split(","),
              })
            }
          />
        </div>

           {/* Blocked Extensions ✅ */}
        <div className="mb-3">
          <label className="form-label fw-bold">Blocked Extensions</label>
          <input
            className="form-control"
            placeholder="e.g., webp, dll"
            onChange={e =>
              setForm({
                ...form,
                blockedExtensions: e.target.value.split(","),
              })
            }
          />
        </div>

        {/* Submit Button */}
        <button className="btn btn-primary" type="submit">
          Create Policy
        </button>
      </form>

      {/* Policies List */}
      <h4>Existing Policies</h4>

      <ul className="list-group">
        {policies.map(p => (
          <li key={p.id} className="list-group-item mb-2 shadow-sm">
            <div><strong>Agent:</strong> {getAgentName(p.agentId)}</div>
            <div><strong>Folders:</strong> {p.folders?.join(", ")}</div>
            <div><strong>Allowed Ext:</strong> {p.allowedExtensions?.join(", ") || "None"}</div>
            <div><strong>Forbidden Ext:</strong> {p.forbiddenExtensions?.join(", ") || "None"}</div>
            <div><strong>blocked Ext:</strong> {p.blockedExtensions?.join(", ") || "None"}</div>

            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
