import React, { useState, useEffect } from "react";
import USNList from "./USNList";
import USNDetail from "./USNDetail";
import AgentsTable from "./AgentsTable";
import ActionSummary from "./ActionSummary"; // ✅ import your summary component

export default function USNDashboard() {
  const [selectedUSN, setSelectedUSN] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [usns, setUsns] = useState([]);

  // Fetch USNs here so both USNList and ActionSummary can use them
  useEffect(() => {
    fetch("http://localhost:7000/api/usn")
      .then(res => res.json())
      .then(data => setUsns(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch USNs:", err));
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex gap-4">
        <USNList onSelect={setSelectedUSN} selected={selectedUSN} usns={usns} />
       <AgentsTable onSelect={setSelectedAgent} selected={selectedAgent} mode="select" />

        <USNDetail notice={selectedUSN} agent={selectedAgent} />
      </div>

      {/* ✅ Add action summary below or to the side */}
      <div className="mt-4">
        <ActionSummary usns={usns} />
      </div>
    </div>
  );
}
