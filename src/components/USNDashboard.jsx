import React, { useState } from "react";
import USNList from "./USNList";
import USNDetail from "./USNDetail";
import AgentsTable from "./AgentsTable";
 
export default function USNDashboard() {
  const [selectedUSN, setSelectedUSN] = useState(null);
  console.log("🚀 ~ USNDashboard ~ selectedUSN:", selectedUSN);

  const [selectedAgent, setSelectedAgent] = useState(null);
  console.log("🚀 ~ USNDashboard ~ selectedAgent:", selectedAgent);

  return (
    <div className="d-flex gap-4">
      <USNList onSelect={setSelectedUSN} selected={selectedUSN} />

      {/* ✅ Pass props here */}
      <AgentsTable onSelect={setSelectedAgent} selected={selectedAgent} />

      <USNDetail notice={selectedUSN} agent={selectedAgent} />
    </div>
  );
}
 