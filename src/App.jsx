import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AgentsTable from "./components/AgentsTable";
import PoliciesForm from "./components/PoliciesForm";
import RulesTable from "./components/RulesTable";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <h1>AI Desktop Agent</h1>
          <Routes>
            <Route path="/agents" element={<AgentsTable />} />
            <Route path="/policies" element={<PoliciesForm />} />
            <Route path="/rules" element={<RulesTable />} />
            <Route path="/" element={<p>Welcome! Select a page from the sidebar.</p>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
