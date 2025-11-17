import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [intent, setIntent] = useState("");
  const [args, setArgs] = useState([]);
  const [history, setHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const [devices, setDevices] = useState([]);


  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onend = () => setListening(false);
      recognition.onerror = (e) => console.error("Voice error:", e);

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

const handleSend = async (cmd = input) => {
  const result = await window.agentAPI.parseCommand(cmd);

  setResponse(result.status);

  if (result.parsed) {
    setIntent(result.parsed.intent || "");
    setArgs(result.parsed.args || []);
  } else {
    setIntent("");
    setArgs([]);
  }

  if (result.devices) setDevices(result.devices);

  setHistory(prev => [...prev, { input: cmd, response: result.status }]);
};


  return (
    <div style={{ padding: 20 }}>
      <h1>AI Desktop Agent</h1>

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

      <div style={{ marginTop: 20 }}>
        <p><strong>AI Response:</strong> {response}</p>
        <p><strong>Intent:</strong> {intent}</p>
        <p><strong>Args:</strong> {args.join(", ")}</p>
      </div>

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

      <div style={{ marginTop: 30 }}>
  <h3>Network Devices</h3>
  {devices.length > 0 ? (
    <ul>
      {devices.map((d, i) => (
        <li key={i}>{d.ip} → {d.mac}</li>
      ))}
    </ul>
  ) : (
    <p>No devices scanned yet.</p>
  )}
</div>

    </div>
  );
}

export default App;
