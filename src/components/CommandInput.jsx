import React from "react";

export default function CommandInput({ input, setInput, handleSend, startListening, listening }) {
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or speak a command..."
        style={{ width: "60%", marginRight: 10 }}
      />
      <button onClick={() => handleSend()}>Send</button>
      <button onClick={startListening} disabled={listening}>
        🎤 {listening ? "Listening..." : "Speak"}
      </button>
    </div>
  );
}
