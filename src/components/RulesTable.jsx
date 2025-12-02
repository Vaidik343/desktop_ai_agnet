// components/RulesTable.jsx
import React, { useEffect, useState } from "react";

export default function RulesTable() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7000/api/rules")
      .then(res => res.json())
      .then(data => setRules(data));
  }, []);

  return (
    <div>
      <h2>Rules</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Condition</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(rule => (
            <tr key={rule.id}>
              <td>{rule.name}</td>
              <td>{JSON.stringify(rule.condition)}</td>
              <td>{rule.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
