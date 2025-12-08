import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          Desktop Agent
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/agents">Agents</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/policies">Policies</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/rules">Rules</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/violations">Violations</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/activity">Activity Logs</Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/usn">USN</Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/apps">Apps</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
