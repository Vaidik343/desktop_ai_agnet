import React from "react";

export default function CommandHistory({ history }) {
  return (
    <div style={{ marginTop: 30 }}>
      <h3>Command History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            <strong>{entry.input}</strong> → {entry.response}
          </li>
        ))}
      </ul>
    </div>
  );
}
