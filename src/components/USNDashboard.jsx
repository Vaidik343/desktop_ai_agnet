// USNDashboard.jsx
import React, { useState, useEffect } from "react";
import USNList from "./USNList";
import USNDetail from "./USNDetail";
import AgentsTable from "./AgentsTable";
import ActionSummary from "./ActionSummary"; // optional component
import { socket } from "../services/socket";
import semver from "semver";

export default function USNDashboard() {
  const [usns, setUsns] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedUSN, setSelectedUSN] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [actionsLog, setActionsLog] = useState([]);

  // Fetch USNs
  useEffect(() => {
    fetch("http://localhost:7000/api/usn")
      .then((res) => res.json())
      .then((data) => setUsns(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch USNs:", err));
  }, []);

  // Fetch agents
  useEffect(() => {
    fetch("http://localhost:7000/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch agents:", err));
  }, []);

  // Listen for real-time agent actions
  useEffect(() => {
    const handleAgentAction = (data) => {
      setActionsLog((prev) => [...prev, data]);

      // If the action concerns the currently selected agent, update UI
      if (selectedAgent?.id === data.agentId) {
        alert(`Action executed: ${data.action} on ${data.filePath || "package"}`);
      }
    };

    socket.on("agentAction", handleAgentAction);
    return () => socket.off("agentAction", handleAgentAction);
  }, [selectedAgent]);

  // Helper to check vulnerability for a specific agent version
  const isVersionVulnerable = (agentVersion, affectedRanges) => {
    if (!agentVersion || !Array.isArray(affectedRanges)) return false;
    return affectedRanges.some((range) => semver.satisfies(agentVersion, range));
  };

  // Compute per-agent vulnerability summary
  const agentVulnerabilities = agents.map((agent) => {
    const vulnerableUSNs = usns.filter((usn) =>
      isVersionVulnerable(agent.version || agent.nodeVersion || "", usn.affectedVersions)
    );
    return { agent, vulnerableUSNs };
  });

  return (
    <div className="container mt-4">
      <div className="row">
        {/* USN list */}
        <div className="col">
          <USNList usns={usns} selected={selectedUSN} onSelect={setSelectedUSN} />
        </div>

        {/* Agents table */}
        <div className="">
          <AgentsTable
            agents={agents}
            selected={selectedAgent}
            onSelect={setSelectedAgent}
            mode="select"
            vulnerabilities={agentVulnerabilities}
          />
        </div>

        {/* USN details & actions */}
        <div className="col-md-4">
          <USNDetail notice={selectedUSN} agent={selectedAgent} />
        </div>
      </div>

      {/* Optional: action log / summary */}
      <div className="mt-4">
        <ActionSummary actions={actionsLog} />
      </div>
    </div>
  );
}
