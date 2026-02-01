import { useState, useRef, useEffect } from "react";
import "../styles/chat.css";
import HeartbeatLine from "../components/HeartbeatLine";
import API_BASE_URL from "../config/api";

export default function Chatbot({
  patientName,
  patientEmail,
  patientContact,
  userId // ✅ REQUIRED FOR HISTORY
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
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);

  const chatEndRef = useRef(null);

  /* AUTO SCROLL */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* SEND MESSAGE */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    // show user message
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    // reset medical UI
    setSeverity(null);
    setDoctor("");
    setDoctorAdvice("");
    setSymptoms([]);
    setRecommendedDoctors([]);

    try {
      // 🔎 DEBUG (REMOVE LATER)
      console.log("Sending user_id:", userId);

      const res = await fetch(`${API_BASE_URL}/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          user_id: userId || null // ✅ SAFE
        })
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      /* MEDICAL MODE */
      if (data.mode === "medical") {
        setSeverity(data.risk?.toLowerCase() || null);
        setDoctor(data.doctor || "");
        setDoctorAdvice(data.advice || "");
        setSymptoms(data.symptoms || []);
        setRecommendedDoctors(data.recommended_doctors || []);

        setMessages(prev => [
          ...prev,
          { role: "ai", text: data.advice }
        ]);

        // 🔔 HIGH risk alert
        if (data.risk?.toLowerCase() === "high") {
          const alertSound = new Audio("/sounds/audio.mp3");
          alertSound.play().catch(() => {});
        }
      }
      /* CHAT MODE */
      else {
        setMessages(prev => [
          ...prev,
          { role: "ai", text: data.reply || "Please consult a doctor." }
        ]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "❌ Unable to contact server. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* CLEAR */
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
    setRecommendedDoctors([]);
    setInput("");
  };

  return (
    <div className="dashboard">

      {/* LEFT PANEL */}
      <div className="dashboard-left">
        <h2>AI Health Console</h2>
        <p>Status: <span className="online">Online</span></p>

        {/* PATIENT PROFILE */}
        <div className="patient-profile">
          <h4>👤 Patient Profile</h4>
          <p><b>Name:</b> {patientName || "—"}</p>
          <p><b>Email:</b> {patientEmail || "—"}</p>
          <p><b>Contact:</b> {patientContact || "—"}</p>
        </div>

        {/* DOCTOR LIST */}
        {recommendedDoctors.length > 0 && (
          <div className="doctor-list-box">
            <h4>🏥 Recommended Doctors</h4>

            <div className="doctor-scroll">
              {recommendedDoctors.map((doc, index) => (
                <div key={index} className="doctor-item">
                  <p className="doc-name">👨‍⚕️ {doc.name}</p>
                  <p className="doc-specialization">
                    🩺 <b>{doc.specialization}</b>
                  </p>
                  <p>🏥 {doc.hospital}</p>
                  <p>📍 {doc.area}</p>
                  <p>📞 {doc.contact}</p>
                  <p>🧠 {doc.experience} yrs experience</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="dashboard-right">

        <HeartbeatLine severity={severity} />

        {/* CHAT AREA */}
        <div className="chat-area">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="chat-bubble ai">Analyzing…</div>}
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
            <p><b>Detected Symptoms:</b> {symptoms.join(", ")}</p>
            <p><b>Specialist:</b> {doctor}</p>
            <p><b>Advice:</b> {doctorAdvice}</p>

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
