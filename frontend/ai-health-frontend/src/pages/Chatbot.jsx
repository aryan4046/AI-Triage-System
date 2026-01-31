import { useState, useRef, useEffect } from "react";
import "../styles/chat.css";
import HeartbeatLine from "../components/HeartbeatLine";

export default function Chatbot({
  patientName,
  patientEmail,
  patientContact
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello 👋 I’m your AI Health Assistant. Please describe your symptoms."
    }
  ]);
  const [loading, setLoading] = useState(false);

  // medical states
  const [severity, setSeverity] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [doctorAdvice, setDoctorAdvice] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [confidence, setConfidence] = useState("");

  const chatEndRef = useRef(null);

  /* ✅ AUTO SCROLL – CORRECT PLACE */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    // show user message
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    // reset medical UI
    setSeverity(null);
    setDoctor("");
    setDoctorAdvice("");
    setSymptoms([]);
    setConfidence("");

    try {
      const res = await fetch("http://127.0.0.1:5000/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      /* 🩺 MEDICAL MODE */
      if (data.mode === "medical") {
        setDoctor(data.doctor);
        setDoctorAdvice(data.advice);
        setSeverity(data.risk?.toLowerCase() || null);
        setSymptoms(data.symptoms || []);
        setConfidence(data.confidence || "");

        // show advice as chat response
        setMessages(prev => [
          ...prev,
          { role: "ai", text: data.advice }
        ]);

        // 🔔 alert for HIGH risk
        if (data.risk?.toLowerCase() === "high") {
          const alertSound = new Audio("/sounds/audio.mp3");
          alertSound.play().catch(() => {});
        }
      }

      /* 🤖 NORMAL CHAT MODE */
      else {
        setMessages(prev => [
          ...prev,
          { role: "ai", text: data.reply }
        ]);
      }

    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "❌ Unable to contact server. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLEAR CHAT ================= */
  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        text: "Hello 👋 I’m your AI Health Assistant. Please describe your symptoms."
      }
    ]);
    setSeverity(null);
    setDoctor("");
    setDoctorAdvice("");
    setSymptoms([]);
    setConfidence("");
    setInput("");
  };

  /* ================= UI ================= */
  return (
    <div className="dashboard">

      {/* LEFT PANEL */}
      <div className="dashboard-left">
        <h2>AI Health Console</h2>

        {patientName && (
          <p>Welcome, <b>{patientName}</b> 👋</p>
        )}

        <p>Status: <span className="online">Online</span></p>

        <div className="tips">
          <h4>How to use</h4>
          <ul>
            <li>Describe symptoms clearly</li>
            <li>Mention duration & pain level</li>
            <li>AI will assess urgency</li>
          </ul>
        </div>

        {/* PATIENT PROFILE */}
        <div className="patient-profile">
          <h4>👤 Patient Profile</h4>
          <p><b>Name:</b> {patientName || "—"}</p>
          <p><b>Email:</b> {patientEmail || "—"}</p>
          <p><b>Contact:</b> {patientContact || "—"}</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="dashboard-right">

        {/* HEARTBEAT */}
        <HeartbeatLine severity={severity} />

        {/* CHAT AREA */}
        <div className="chat-area">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble ai">Analyzing symptoms…</div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* SEVERITY */}
        {severity && (
          <div className={`severity-meter ${severity}`}>
            Severity Level: <b>{severity.toUpperCase()}</b>
          </div>
        )}

        {/* DOCTOR CARD */}
        {severity && (
          <div className={`doctor-card ${severity}`}>
            <h4>🩺 Doctor Recommendation</h4>

            {symptoms.length > 0 && (
              <p><b>Detected Symptoms:</b> {symptoms.join(", ")}</p>
            )}

            <p><b>Specialist:</b> {doctor}</p>
            <p><b>Advice:</b> {doctorAdvice}</p>

            {confidence && (
              <p className="confidence-text">
                <b>Confidence:</b> {confidence}%
              </p>
            )}

            {severity === "high" && (
              <p className="emergency-text">
                🚨 This may be an emergency. Seek medical help immediately.
              </p>
            )}
          </div>
        )}

        {/* INPUT */}
        <div className="chat-input-area">
          <input
            placeholder="Type your symptoms here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
          <button className="clear-btn" onClick={clearChat}>Clear</button>
        </div>

      </div>
    </div>
  );
}
