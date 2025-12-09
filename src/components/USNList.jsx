import React, { useEffect, useState } from "react";

export default function USNList({ onSelect ,selected }) {
  const [usns, setUsns] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7000/api/usn")
      .then(res => res.json())
      .then(data => setUsns(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch USNs:", err));
  }, []);
 
  return (
    <div className="container mt-4">
      <h3 className="mb-3">USN Updates</h3>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>USN ID</th>
              <th>Package</th>
              <th>CVEs</th>
              <th>Published</th>
            </tr>
          </thead>
 
          <tbody>
            {usns.map(usn => (
              <tr
                key={usn.usnId}
                style={{ cursor: "pointer" ,
                   backgroundColor: selected?.usnId === usn.usnId ? "#f0f8ff" : "inherit"
                }}
                onClick={() => onSelect(usn)}
                 
              >
                <td>{usn.usnId}</td>
                <td>{usn.package}</td>
                <td>{Array.isArray(usn.cves) ? usn.cves.join(", ") : "—"}</td>
                <td>{new Date(usn.publishedAt).toLocaleDateString()}</td>
              </tr>
            ))}

            {usns.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted py-3">
                  No USN records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
