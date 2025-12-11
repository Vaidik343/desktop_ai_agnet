import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AppsTable() {
  const { agentId } = useParams(); // ✅ read agentId from route param
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) {
      setApps([]);
      setLoading(false);
      return;
    }

    setApps([]);        // clear old data when agent changes
    setLoading(true);   // show loader

    let cancelled = false;

    async function fetchApps() {
      try {
        const res = await fetch(`http://localhost:7000/api/apps/${agentId}`);
        console.log("🚀 ~ fetchApps ~ res:", res)
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setApps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch apps:", err);
        if (!cancelled) setApps([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchApps();
    const interval = setInterval(fetchApps, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [agentId]);

  if (!agentId) return <p className="text-center mt-4">No agent selected.</p>;
  if (loading) return <p className="text-center mt-4">Loading apps...</p>;

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Application List</h2>

      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Version</th>
            <th>Status</th>
            {/* <th>Severity</th> */}
            <th>Recommended Action</th>
            <th>Installed At</th>
            <th>Removed At</th>
          </tr>
        </thead>

        <tbody>
          {apps.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted py-3">
                No applications found.
              </td>
            </tr>
          ) : (
            apps.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td className="fw-bold">{app.name}</td>
                <td>{app.version}</td>
                <td>
                  <span
                    className={`badge px-3 py-2 ${
                      app.status === "installed"
                        ? "text-bg-success"
                        : "text-bg-danger"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                {/* <td>
                  <span
                    className={`badge px-2 py-1 ${
                      app.severity === "critical"
                        ? "text-bg-danger"
                        : app.severity === "high"
                        ? "text-bg-warning"
                        : app.severity === "medium"
                        ? "text-bg-info"
                        : "text-bg-secondary"
                    }`}
                  >
                    {app.severity || "—"}
                  </span>
                </td> */}
                <td>{app.actionRecommended || "—"}</td>
                <td>
                  {app.installedAt
                    ? new Date(app.installedAt).toLocaleString()
                    : "—"}
                </td>
                <td>
                  {app.removedAt
                    ? new Date(app.removedAt).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
