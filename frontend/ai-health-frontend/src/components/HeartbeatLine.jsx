import "./heartbeat.css";

export default function HeartbeatLine({ severity }) {
  const bpm =
    severity === "high" ? 120 :
    severity === "medium" ? 95 :
    severity === "low" ? 72 : "--";

  const isActive = !!severity;

  return (
    <div className={`heartbeat-container ${severity || "idle"}`}>
      
      {/* ❤️ HEART RATE NUMBER */}
      <div className="heart-rate">
        ❤️ {bpm} bpm
      </div>

      <svg viewBox="0 0 1000 120" preserveAspectRatio="none">
        <path
          d="
            M 0 60
            L 80 60
            L 100 60
            L 120 40
            L 140 60
            L 160 60
            L 180 20
            L 200 100
            L 220 60
            L 260 60
            L 300 60
            L 320 45
            L 340 60
            L 360 60
            L 380 25
            L 400 100
            L 420 60
            L 460 60
            L 500 60
            L 520 40
            L 540 60
            L 560 60
            L 580 20
            L 600 100
            L 620 60
            L 660 60
            L 700 60
            L 720 45
            L 740 60
            L 760 60
            L 780 25
            L 800 100
            L 820 60
            L 900 60
            L 1000 60
          "
          className={`heartbeat-line ${isActive ? "active" : "paused"}`}
        />
      </svg>
    </div>
  );
}
