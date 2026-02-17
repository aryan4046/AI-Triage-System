import "../styles/chat.css";

export default function Profile({ patient }) {
  if (!patient) return null;

  return (
    <div className="doctor-card low">
      <h4>👤 Patient Profile</h4>

      <p>
        <b>Name:</b> {patient.name || "Not Available"}
      </p>

      <p>
        <b>Email:</b> {patient.email || "Not Available"}
      </p>

      {patient.contact && (
        <p>
          <b>Contact:</b> {patient.contact}
        </p>
      )}
    </div>
  );
}
