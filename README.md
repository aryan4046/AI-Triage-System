# AI Triage System 🏥🤖

Welcome to the **AI Triage System**, an intelligent health assessment and patient triage application. This system allows patients to input their symptoms and leverages a Machine Learning model to evaluate risk levels, provide medical advice, and recommend suitable specialist doctors based on the user's condition.

## 🌟 Key Features

- **AI-Powered Triage Chat:** Patients describe their symptoms, and the backend NLP/ML model processes the text to determine the severity, risk level, and medical advice.
- **Smart Doctor Recommendation:** Based on the predicted medical specialization (e.g., Cardiologist, Neurologist, General Physician), the system matches the patient with the best available doctors from a local database (e.g., Ahmedabad doctors).
- **Secure Authentication:** User signup and login functionality with password hashing for data security.
- **Patient History & Queue Management:** Saves patient triage histories and maintains a realtime queue for medical staff to track recent triage assessments.
- **Modern Interface:** A sleek, responsive frontend built with React, Tailwind CSS, Radix UI primitives, and animated visualizations (like ECG monitors).

---

## 🏗️ Technology Stack

### Frontend

- **Framework:** React 18 / Vite
- **Styling:** Tailwind CSS (v4)
- **Components:** Radix UI, framer-motion, Lucide React (icons)
- **Visualizations:** Recharts (for vital stats and charts)

### Backend

- **Framework:** Python / Flask
- **Machine Learning:** Scikit-Learn (`joblib` for model loading), Pandas
- **Database:** MySQL (`flask_mysqldb`)
- **Core ML Files:** `risk_model.pkl`, `vectorizer.pkl`, `training_data.csv`

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Database Setup

1. Ensure you have **MySQL** installed and running on your device.
2. Open your MySQL client and run the SQL script located in `database/schema.sql` to create the `ai_health` database and required tables:
   ```sql
   CREATE DATABASE IF NOT EXISTS ai_health;
   USE ai_health;
   -- (See schema.sql for full table creation)
   ```
3. Update your MySQL credentials (if needed) in `backend/app.py`:
   ```python
   app.config["MYSQL_HOST"] = "localhost"
   app.config["MYSQL_USER"] = "root"
   app.config["MYSQL_PASSWORD"] = ""
   ```

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```
3. Install the required Python dependencies (Flask, Pandas, scikit-learn, etc.):
   ```bash
   pip install -r requirements.txt
   ```
   _(Note: Ensure `flask-cors`, `flask-mysqldb`, `pandas`, `scikit-learn`, `werkzeug` are installed)._
4. Run the Flask backend server:
   ```bash
   python app.py
   ```
   The backend will start running on `http://localhost:5000`.

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary Node.js dependencies using `npm` or `pnpm`:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
4. The frontend will be accessible at `http://localhost:5173`.

---

## 📂 Project Structure

```
AI_Triage/
├── backend/
│   ├── app.py                  # Main Flask application and API routes
│   ├── risk_model.pkl          # Pre-trained ML model for risk assessment
│   ├── vectorizer.pkl          # TF-IDF vectorizer for text processing
│   ├── training_data.csv       # Symptom mapping & advice dataset
│   └── doctors_ahmedabad.csv   # Database of local doctors for recommendations
├── frontend/
│   ├── src/
│   │   ├── app/components/     # Reusable React components (AIChat, VitalStats, etc.)
│   │   ├── app/pages/          # Main application pages (Login, Dashboard, etc.)
│   │   ├── context/            # React Context (AuthContext)
│   │   └── styles/             # Global CSS and Tailwind configurations
│   ├── package.json            # Node dependencies
│   └── vite.config.ts          # Vite configuration
└── database/
    └── schema.sql              # MySQL database schema (users, history)
```

## 🤝 How It Works

1. **User Registers/Logs In**: A user creates an account. Data is saved in the `users` table via `/signup` and `/login` endpoints.
2. **Symptom Input**: The user types out their symptoms in the AI Chat window.
3. **ML Triage Engine**: The text is sent to the `/triage` endpoint. It matches the text contextually against `training_data.csv`.
4. **Assessment & Recommendation**: The API streams back the medical advice, risk severity, and recommends specific doctors filtered from `doctors_ahmedabad.csv`.
5. **History Tracked**: The session is stored in the `history` MySQL table, populating the queue and historical records.
