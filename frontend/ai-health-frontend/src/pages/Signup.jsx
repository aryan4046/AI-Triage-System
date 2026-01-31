import { useState } from "react";
import "../styles/signup.css";

export default function Signup({ onSuccess }) {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleNext = () => {
    if (!name || !contact || !email) {
      setError("Please fill all details");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          email,
          password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      onSuccess(name);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="glass-card">

        <h2>🩺 Patient Signup</h2>
        <p className="subtitle">AI-powered healthcare assistance</p>

        {error && <div className="error">{error}</div>}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="field">
              <input value={name} onChange={e => setName(e.target.value)} required />
              <label>👤 Full Name</label>
            </div>

            <div className="field">
              <input value={contact} onChange={e => setContact(e.target.value)} required />
              <label>📞 Contact Number</label>
            </div>

            <div className="field">
              <input value={email} onChange={e => setEmail(e.target.value)} required />
              <label>📧 Email Address</label>
            </div>

            <button onClick={handleNext}>Next →</button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="field">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <label>🔒 Password</label>
            </div>

            <button onClick={handleSubmit}>❤️ Create Account</button>

            <p className="back" onClick={() => setStep(1)}>← Back</p>
          </>
        )}
      </div>
    </div>
  );
}
