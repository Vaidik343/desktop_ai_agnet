import React from "react";

export default function NetworkDevices({ devices }) {
  return (
    <div style={{ marginTop: 30 }}>
      <h3>Network Devices</h3>
      {Array.isArray(devices) && devices.length > 0 ? (
        <ul>
          {devices.map((d, i) => (
            <li key={i}>{d.ip} → {d.mac}</li>
          ))}
        </ul>
      ) : (
        <p>No devices scanned yet.</p>
      )}
    </div>
  );
}
