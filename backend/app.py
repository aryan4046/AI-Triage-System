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

# ================= PATH =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ================= ML LOAD =================
model = joblib.load(os.path.join(BASE_DIR, "risk_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer.pkl"))
print("✅ ML model loaded")

# ================= TRAINING DATA =================
training_data = pd.read_csv(
    os.path.join(BASE_DIR, "training_data.csv"),
    encoding="latin1"
)
training_data["text"] = training_data["text"].str.lower().str.strip()
training_data["doctor"] = training_data["doctor"].str.lower().str.strip()

# ================= DOCTORS DATA =================
doctors_data = pd.read_csv(
    os.path.join(BASE_DIR, "doctors_ahmedabad.csv"),
    encoding="latin1"
)
doctors_data["specialization"] = doctors_data["specialization"].str.lower().str.strip()

# ================= SPECIALIZATION MAP =================
SPECIALIZATION_MAP = {
    "general physician": "general physician",
    "self care": "general physician",
    "cardiologist": "cardiologist",
    "emergency / cardiologist": "cardiologist",
    "emergency": "emergency",
    "neurologist": "neurologist",
    "orthopedic": "orthopedic",
    "gynecologist": "gynecologist",
    "pulmonologist": "pulmonologist",
    "gastroenterologist": "gastroenterologist",
    "dermatologist": "dermatologist",
    "ent": "ent",
    "ent specialist": "ent",
    "pediatrician": "pediatrician",
    "psychiatrist": "psychiatrist",
    "nephrologist": "nephrologist",
    "dentist": "dentist"
}

# ================= DOCTOR MATCH HELPER =================
def get_doctors_by_specialization(doctor_text):
    doctor_text = doctor_text.lower().strip()

    specialization = "general physician"
    for key, value in SPECIALIZATION_MAP.items():
        if key in doctor_text:
            specialization = value
            break

    matched = doctors_data[
        doctors_data["specialization"].str.contains(specialization, na=False)
    ]

    doctors = []
    for _, row in matched.head(5).iterrows():
        doctors.append({
            "name": row["doctor_name"],
            "hospital": row["hospital"],
            "area": row["area"],
            "contact": str(row["contact"]),
            "experience": int(row["experience_years"]),
            "specialization": row["specialization"].title()
        })

    return doctors

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
    return "AI Health Backend Running"

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
    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
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

    # ================= STREAMING RESPONSE =================
    from flask import Response, stream_with_context
    import json
    import time

    def generate_error(message):
        metadata = {"mode": "chat"}
        yield json.dumps({"type": "metadata", "data": metadata}) + "\n"
        yield json.dumps({"type": "chunk", "content": message}) + "\n"

    def generate_medical(row, recommended_doctors):
        # 1. Send metadata
        metadata = {
            "mode": "medical",
            "symptoms": [row["text"]],
            "risk": row["risk"],
            "doctor": row["doctor"].title(),
            "severity": int(row["severity_score"]),
            "recommended_doctors": recommended_doctors
        }
        yield json.dumps({"type": "metadata", "data": metadata}) + "\n"

        # 2. Stream the advice text
        full_advice = row["advice"]
        chunk_size = 5
        
        for i in range(0, len(full_advice), chunk_size):
            chunk = full_advice[i:i+chunk_size]
            yield json.dumps({"type": "chunk", "content": chunk}) + "\n"
            time.sleep(0.05)

    if not text:
        return Response(stream_with_context(generate_error("Please enter symptoms.")), content_type='application/x-ndjson')

    # 🔍 EXACT MATCH ONLY
    matches = training_data[training_data["text"] == text]

    if matches.empty:
         return Response(stream_with_context(generate_error("I could not find this symptom in my database.")), content_type='application/x-ndjson')

    row = matches.iloc[0]
    recommended_doctors = get_doctors_by_specialization(row["doctor"])

    # ================= SAVE HISTORY =================
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

    return Response(stream_with_context(generate_medical(row, recommended_doctors)), content_type='application/x-ndjson')

# ================= HISTORY =================
@app.route("/history/<int:user_id>")
def history(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """
        SELECT symptoms, severity, risk, doctor, advice, created_at
        FROM history
        WHERE user_id=%s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

# ================= RECOMMEND =================
    return jsonify(data)

# ================= RECOMMEND =================
@app.route("/recommend", methods=["POST"])
def recommend_doctors():
    data = request.get_json(silent=True) or {}
    symptoms = data.get("symptoms", "")
    
    if isinstance(symptoms, list):
        symptoms = " ".join(symptoms)
        
    symptoms = symptoms.lower().strip()
    
    if not symptoms:
        return jsonify([])

    # 1. Try to find exact match in training data
    matches = training_data[training_data["text"] == symptoms]
    
    doctor_type = None
    
    if not matches.empty:
        doctor_type = matches.iloc[0]["doctor"]
    else:
        # 2. Key-word based mapping (Simple NLP)
        # We define a fallback map for common symptoms -> specialists
        SYMPTOM_KEYWORD_MAP = {
            "heart": "cardiologist", "chest": "cardiologist", "breath": "cardiologist", "palpitation": "cardiologist",
            "head": "neurologist", "dizzy": "neurologist", "faint": "neurologist", "seizure": "neurologist", "stroke": "neurologist",
            "bone": "orthopedic", "joint": "orthopedic", "fracture": "orthopedic", "knee": "orthopedic", "back": "orthopedic",
            "skin": "dermatologist", "rash": "dermatologist", "itch": "dermatologist", "acne": "dermatologist",
            "stomach": "gastroenterologist", "abdominal": "gastroenterologist", "vomit": "gastroenterologist", "diarrhea": "gastroenterologist",
            "throat": "ent", "ear": "ent", "nose": "ent", "cold": "general physician", "flu": "general physician", "fever": "general physician",
            "lung": "pulmonologist", "cough": "pulmonologist", "asthma": "pulmonologist",
            "tooth": "dentist", "gum": "dentist",
            "child": "pediatrician", "baby": "pediatrician",
            "mood": "psychiatrist", "anxiety": "psychiatrist", "depression": "psychiatrist",
            "kidney": "nephrologist", "urine": "nephrologist"
        }
        
        for keyword, specialist in SYMPTOM_KEYWORD_MAP.items():
            if keyword in symptoms:
                doctor_type = specialist
                break
        
        # 3. If still no match, check if the symptom string itself contains a specialist name
        if not doctor_type:
            for key, value in SPECIALIZATION_MAP.items():
                if key in symptoms:
                    doctor_type = value
                    break

    # Default if nothing found: General Physician
    if not doctor_type:
        doctor_type = "general physician"

    # 4. Get doctors by specialization
    recommended = get_doctors_by_specialization(doctor_type)
    
    # 5. If specific specialization yielded no results, return some random doctors instead of empty
    # so the frontend shows *some* real data instead of static mocks
    if not recommended:
        # Fallback to general physicians or just any top doctors
        recommended = get_doctors_by_specialization("general physician")
        if not recommended: # If even that fails, specific hardcoded fallback or random sample from DB
             # Just sample 3 random rows from doctors_data
            sample = doctors_data.sample(3)
            for _, row in sample.iterrows():
                recommended.append({
                    "name": row["doctor_name"],
                    "hospital": row["hospital"],
                    "area": row["area"],
                    "contact": str(row["contact"]),
                    "experience": int(row["experience_years"]),
                    "specialization": row["specialization"].title()
                })

    # 6. Enhance with mock live data (availability, score)
    import random
    for doc in recommended:
        doc["matchScore"] = random.randint(85, 99)
        doc["availability"] = random.choice(["Available Now", "In Surgery (1h)", "On Call", "Available in 30m"])
        doc["rating"] = round(random.uniform(4.5, 5.0), 1)
        doc["id"] = str(random.randint(1000, 9999))

    return jsonify(recommended)

# ================= QUEUE =================
@app.route("/queue", methods=["GET"])
def get_queue():
    cursor = mysql.connection.cursor()
    cursor.execute(
        """
        SELECT 
            h.id, 
            u.name, 
            u.contact, 
            h.symptoms, 
            h.severity, 
            h.risk, 
            h.doctor, 
            h.created_at
        FROM history h
        JOIN users u ON h.user_id = u.id
        ORDER BY h.created_at DESC
        LIMIT 50
        """
    )
    rows = cursor.fetchall()
    cursor.close()

    queue_data = []
    for row in rows:
        # Parse symptoms string if it looks like a list or keep as is
        # The history table might store symptoms as raw string from user input
        symptoms_list = [s.strip() for s in row["symptoms"].split(',')] if row["symptoms"] else []

        queue_data.append({
            "id": str(row["id"]),
            "name": row["name"],
            # Calculate mock age/gender or store in DB? 
            # For now, we don't have age/gender in users table based on signup, so we might mock or leave empty
            "age": 30, # Mock default
            "gender": "Unknown", # Mock default
            "severity": row["risk"].lower() if row["risk"] else "medium",
            "symptoms": symptoms_list,
            "vitals": { # Mock vitals for now as we don't track them yet
                "heartRate": 80,
                "temperature": 98.6,
                "bloodPressure": "120/80",
                "oxygenLevel": 98,
            },
            "timestamp": row["created_at"]
        })

    return jsonify(queue_data)

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
