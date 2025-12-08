import { useEffect, useState } from "react";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("http://localhost:7000/api/activity");
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setLogs([]);
      }
    }

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch agent names
  useEffect(() => {
    fetch("http://localhost:7000/api/agents")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setAgents(data) : setAgents([]))
      .catch(err => console.error("Failed to fetch agents:", err));
  }, []);

  const getAgentName = (id) => {
    const agent = agents.find(a => a.id === id);
    return agent ? `${agent.name} (${agent.os})` : id;
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-4">All Activity Logs</h2>

      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-secondary">
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>File Path</th>
            <th>Agent</th>
             {/* <th>Disposition</th>  */}
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted py-3">
                No logs found.
              </td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>

                <td>
                  <span className="badge text-bg-info text-uppercase px-3 py-2">
                    {log.action || "unknown"}
                  </span>
                </td>

                <td className="text-break">{log.filePath}</td>

                <td><strong>{getAgentName(log.agentId)}</strong></td>
                 {/* <td>{log.disposition || "pending"}</td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
