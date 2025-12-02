import React from "react";

export default function AIResponse({ response, intent, args }) {
  return (
    <div style={{ marginTop: 20 }}>
      <p><strong>AI Response:</strong> {response}</p>
      <p><strong>Intent:</strong> {intent}</p>
      <p><strong>Args:</strong> {args.join(", ")}</p>
    </div>
  );
}
