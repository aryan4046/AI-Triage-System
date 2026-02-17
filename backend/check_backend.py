import requests
try:
    response = requests.get("http://127.0.0.1:5000/queue")
    print(f"Status: {response.status_code}")
    print(response.text[:200]) # First 200 chars
except Exception as e:
    print(f"Error: {e}")
