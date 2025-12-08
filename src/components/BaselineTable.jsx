import React, { useState, useEffect } from "react";

const BaselineTable = ({ agentId }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function loadFiles() {
      const res = await fetch(`/api/files/${agentId}`);
      const data = await res.json();
      setFiles(data);
    }
    if (agentId) {
      loadFiles();
    }
  }, [agentId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Path</th>
          <th>Hash</th>
          <th>Size</th>
          <th>Modified At</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.id}>
            <td>{file.path}</td>
            <td>{file.hash}</td>
            <td>{file.size}</td>
            <td>{file.modifiedAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BaselineTable;
