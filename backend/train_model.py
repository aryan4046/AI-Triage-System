import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# =============================
# LOAD DATASET
# =============================
training_data = pd.read_csv(
    os.path.join(BASE_DIR, "training_data.csv"),
    encoding="utf-8"
)
training_data.columns = training_data.columns.str.strip().str.lower()



X = data["text"]
y = data["risk"]   # LOW / MEDIUM / HIGH

# =============================
# TEXT VECTORIZATION
# =============================
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1,2)
)

X_vectorized = vectorizer.fit_transform(X)

# =============================
# TRAIN MODEL
# =============================
model = LogisticRegression(max_iter=1000)
model.fit(X_vectorized, y)

# =============================
# SAVE MODEL
# =============================
joblib.dump(model, "risk_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("✅ ML Model trained successfully")
print("📦 Files created: risk_model.pkl, vectorizer.pkl")
