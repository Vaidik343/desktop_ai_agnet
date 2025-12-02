// components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{ width: "200px", background: "#f4f4f4", padding: "10px" }}>
      <h3>Navigation</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/agents">Agents</Link></li>
        <li><Link to="/policies">Policies</Link></li>
        <li><Link to="/rules">Rules</Link></li>
      </ul>
    </div>
  );
}
