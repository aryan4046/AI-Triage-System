import { useState } from "react";
import "../styles/auth.css";

export default function Auth({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  /* ================= VALIDATION ================= */

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidContact = (contact) =>
    /^[0-9]{10}$/.test(contact);

  /* ================= PASSWORD STRENGTH ================= */

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;

    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);

    if (pwd.length < 6) return "weak";
    if (pwd.length >= 6 && !(hasUpper && hasLower && hasNumber)) return "medium";
    if (pwd.length >= 8 && hasUpper && hasLower && hasNumber) return "strong";

    return "medium";
  };

  const passwordStrength = getPasswordStrength(password);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    setError("");

    if (isSignup) {
      if (!name.trim()) return setError("Name is required");
      if (!isValidContact(contact))
        return setError("Enter valid 10-digit contact number");
    }

    if (!isValidEmail(email))
      return setError("Enter a valid email address");

    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    const url = isSignup
      ? "http://127.0.0.1:5000/signup"
      : "http://127.0.0.1:5000/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Auth failed");

      onSuccess({
        name: data.name || name,
        email: data.email || email,
        contact: data.contact || contact,
      });

    } catch (err) {
      setError(err.message);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="auth-page">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <h1>AI HealthCare System</h1>
        <p>Smart symptom analysis & medical guidance powered by AI.</p>
        <ul>
          <li>AI-based symptom triage</li>
          <li>Emergency detection</li>
          <li>Secure patient system</li>
          <li>24/7 virtual assistant</li>
        </ul>
      </div>

      {/* RIGHT CARD */}
      <div className="auth-right">
        <div className={`auth-card animated ${isSignup ? "signup" : "login"}`}>
          <h2>{isSignup ? "Patient Signup" : "Patient Login"}</h2>

          {error && <div className="auth-error">{error}</div>}

          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD FIELD */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "44px" }}
            />

            {/* 👁️ / 🙈 ICON — only when text exists */}
            {password.length > 0 && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  userSelect: "none",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            )}
          </div>

          {/* 🔴🟠🟢 THREE DOT PASSWORD STRENGTH */}
          {passwordStrength && (
            <div className="pwd-strength-inline">
              <span className={`on weak`}></span>
              <span
                className={
                  passwordStrength === "medium" || passwordStrength === "strong"
                    ? "on medium"
                    : ""
                }
              ></span>
              <span
                className={passwordStrength === "strong" ? "on strong" : ""}
              ></span>
            </div>
          )}

          <button onClick={handleSubmit}>
            {isSignup ? "Create Account" : "Login"}
          </button>

          <div className="auth-toggle">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsSignup(false)}>Login</span>
              </>
            ) : (
              <>
                New patient?{" "}
                <span onClick={() => setIsSignup(true)}>Signup</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
