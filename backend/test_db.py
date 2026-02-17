import MySQLdb

print("Testing connection to 127.0.0.1...")
try:
    db = MySQLdb.connect(host="127.0.0.1", user="root", passwd="", db="ai_health")
    print("SUCCESS: Connected to 127.0.0.1")
    db.close()
except Exception as e:
    print(f"FAILED: 127.0.0.1 - {e}")

print("\nTesting connection to localhost...")
try:
    db = MySQLdb.connect(host="localhost", user="root", passwd="", db="ai_health")
    print("SUCCESS: Connected to localhost")
    db.close()
except Exception as e:
    print(f"FAILED: localhost - {e}")
