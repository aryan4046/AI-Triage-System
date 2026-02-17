import mysql.connector

DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "ai_health"
}

try:
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM history")
    history_count = cursor.fetchone()[0]
    
    print(f"Users count: {user_count}")
    print(f"History count: {history_count}")
    
    if user_count > 0:
        cursor.execute("SELECT id, name, email FROM users LIMIT 5")
        print("\nRecent Users:")
        for r in cursor.fetchall():
            print(r)

    conn.close()
    
except mysql.connector.Error as err:
    print(f"Error: {err}")
