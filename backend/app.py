from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import os
import joblib
import pandas as pd

# ================= APP =================
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ================= ML LOAD =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "risk_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer.pkl"))
print("✅ ML model loaded")

# ================= DATA =================
training_data = pd.read_csv(
    os.path.join(BASE_DIR, "training_data.csv"),
    encoding="latin1"
)

training_data["text"] = training_data["text"].str.lower().str.strip()

# ================= MYSQL =================
app.config["MYSQL_HOST"] = "127.0.0.1"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = ""
app.config["MYSQL_DB"] = "ai_health"
app.config["MYSQL_CURSORCLASS"] = "DictCursor"

mysql = MySQL(app)

# ================= HOME =================
@app.route("/")
def home():
    return "AI Health Backend Running (ML Mode)"

# ================= SIGNUP =================
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    contact = data.get("contact")
    email = data.get("email")
    password = data.get("password")

    if not all([name, contact, email, password]):
        return jsonify({"message": "All fields required"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({"message": "Email already exists"}), 400

    password_hash = generate_password_hash(password)
    cursor.execute(
        "INSERT INTO users (name, contact, email, password_hash) VALUES (%s,%s,%s,%s)",
        (name, contact, email, password_hash)
    )
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Signup successful"})

# ================= LOGIN =================
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not check_password_hash(user["password_hash"], password):
        return jsonify({"message": "Invalid password"}), 401

    return jsonify({
        "message": "Login successful",
        "name": user["name"],
        "email": user["email"],
        "contact": user["contact"],
        "user_id": user["id"]
    })

# ================= TRIAGE =================
@app.route("/triage", methods=["POST"])
def triage():
    data = request.get_json(silent=True) or {}
    text = data.get("message", "").lower().strip()
    user_id = data.get("user_id")

    if not text:
        return jsonify({
            "mode": "chat",
            "reply": "Please enter symptoms."
        })

    # 🔍 EXACT MATCH ONLY (NO EXTRA SYMPTOMS)
    matches = training_data[
        training_data["text"] == text
    ]

    # ✅ MEDICAL MODE
    if not matches.empty:
        row = matches.iloc[0]

        response = {
            "mode": "medical",
            "symptoms": [row["text"]],   # ✅ ONLY ENTERED SYMPTOM
            "risk": row["risk"],
            "doctor": row["doctor"],
            "advice": row["advice"],
            "severity": int(row["severity_score"])
        }

        # 📝 SAVE HISTORY
        if user_id:
            cursor = mysql.connection.cursor()
            cursor.execute(
                """
                INSERT INTO history
                (user_id, symptoms, severity, risk, doctor, advice)
                VALUES (%s,%s,%s,%s,%s,%s)
                """,
                (
                    user_id,
                    row["text"],
                    row["severity_score"],
                    row["risk"],
                    row["doctor"],
                    row["advice"]
                )
            )
            mysql.connection.commit()
            cursor.close()

        return jsonify(response)

    # 🤖 FALLBACK CHAT
    return jsonify({
        "mode": "chat",
        "reply": "I could not find this symptom in my database. Please consult a doctor if symptoms persist."
    })

# ================= HISTORY =================
@app.route("/history/<int:user_id>")
def history(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """
        SELECT symptoms, risk, doctor, advice, created_at
        FROM history
        WHERE user_id=%s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
