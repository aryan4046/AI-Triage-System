import requests
import json
import random

BASE_URL = "http://127.0.0.1:5000"

def test_age_gender():
    # 1. Signup with Age and Gender
    rand_val = random.randint(1000, 9999)
    email = f"user_{rand_val}@example.com"
    password = "password123"
    age = 25
    gender = "Male"
    
    print(f"1. Registering user: {email}, Age: {age}, Gender: {gender}")
    session = requests.Session()
    
    resp = session.post(f"{BASE_URL}/signup", json={
        "name": f"User {rand_val}",
        "email": email,
        "password": password,
        "contact": "555-0199",
        "age": age,
        "gender": gender
    })
    
    if resp.status_code != 200:
        print(f"Signup failed: {resp.text}")
        return

    # 2. Login and check returned fields
    print("2. Logging in to verify fields...")
    resp = session.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password
    })
    
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return
        
    user_data = resp.json()
    print(f"Login Response: {user_data}")
    
    if str(user_data.get("age")) == str(age) and user_data.get("gender") == gender:
        print("✅ SUCCESS: Age and Gender returned correctly on login.")
    else:
        print(f"❌ FAILURE: Expected Age: {age}, Gender: {gender}. Got Age: {user_data.get('age')}, Gender: {user_data.get('gender')}")
        return

    user_id = user_data.get("user_id")

    # 3. Create Triage Entry
    print("3. Creating Triage Entry...")
    triage_resp = session.post(f"{BASE_URL}/triage", json={
        "message": "headache",
        "user_id": user_id
    }, stream=True)
    
    # Consume stream
    for _ in triage_resp.iter_lines(): pass

    # 4. Check Queue
    print("4. Checking Queue...")
    queue_resp = session.get(f"{BASE_URL}/queue")
    
    if queue_resp.status_code != 200:
        print(f"Queue fetch failed: {queue_resp.status_code}")
        return
        
    queue = queue_resp.json()
    found = False
    for entry in queue:
        if str(entry.get("id")) == str(user_id) or entry.get("name") == f"User {rand_val}": # Queue might not have user_id directly, check name
             # The queue ID returned is history ID, not user ID. Map by name.
            print(f"Found Entry: {entry}")
            if str(entry.get("age")) == str(age) and entry.get("gender") == gender:
                found = True
                print("✅ SUCCESS: Age and Gender correct in Queue.")
            else:
                print(f"❌ FAILURE in Queue: Expected Age: {age}, Gender: {gender}. Got Age: {entry.get('age')}, Gender: {entry.get('gender')}")
            break
            
    if not found:
        print("⚠️ Warning: Created entry not found in top 50 queue (might be queue delay/ordering).")

if __name__ == "__main__":
    test_age_gender()
