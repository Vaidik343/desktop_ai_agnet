import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
import AgentsTable from "./components/AgentsTable";
import PoliciesForm from "./components/PoliciesForm";
import RulesTable from "./components/RulesTable";
import BaselineTableWrapper from "./components/BaselineTableWrapper";
import ViolationsTable from "./components/ViolationsTable";
import ActivityLogsPage from "./components/ActivityLogsPage";
import Navbar from "./components/Navbar";
import USNDashboard from "./components/USNDashboard";
import AppsTable from "./components/AppsTable";

function App() {
  return (
    <Router>
          <Navbar />
           <div className="container mt-4">
          <h1>Desktop Agent</h1>
          <Routes>
            <Route path="/agents" element={<AgentsTable />} />
            <Route path="/policies" element={<PoliciesForm />} />
            <Route path="/rules" element={<RulesTable />} />
            <Route path="/violations" element={<ViolationsTable />} />
            <Route path="/baseline/:agentId" element={<BaselineTableWrapper />} />
            <Route path="/activity" element={<ActivityLogsPage />} /> {/* ✅ no :id */}
            <Route path="/usn" element={<USNDashboard />} />
         <Route path="/apps/:agentId" element={<AppsTable />} />

            <Route path="/" element={<p>Welcome! Select a page from the Navbar.</p>} />
          </Routes>
       
      </div>
    </Router>
  );
}


export default App;
