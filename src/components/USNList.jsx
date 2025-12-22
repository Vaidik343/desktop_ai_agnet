import React from "react";

export default function USNList({ onSelect, selected, usns }) {
  return (
    <div className="container mt-4">
      <h3 className="mb-3">USN Updates</h3>

      {usns.length === 0 && (
        <div className="card text-center text-muted p-4 shadow-sm">
          No USN records found.
        </div>
      )}

      <div className="row g-3">
        {usns.map((usn) => (
          <div className="col-12 col-md-6 col-lg-4" key={usn.usnId}>
            <div
              className={
                "card shadow-sm h-100 " +
                (selected?.usnId === usn.usnId ? "border-primary" : "")
              }
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(usn)}
            >
              <div className="card-body">
                <h5 className="card-title">{usn.usnId}</h5>

                <p className="card-text mb-1">
                  <strong>Package:</strong> {usn.package}
                </p>

                {/* <p className="card-text mb-1">
                  <strong>CVEs:</strong>{" "}
                  {Array.isArray(usn.cves) ? usn.cves.join(", ") : "—"}
                </p> */}

                <p className="card-text mb-1">
                  <strong>Published:</strong>{" "}
                  {new Date(usn.publishedAt).toLocaleDateString()}
                </p>

                <p className="card-text">
                  <strong>Risk:</strong> {usn.riskLevel || "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
