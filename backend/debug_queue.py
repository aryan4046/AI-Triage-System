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
    
    query = """
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
    
    print("Executing JOIN query...")
    cursor.execute(query)
    rows = cursor.fetchall()
    
    print(f"Rows found: {len(rows)}")
    for row in rows[:5]:
        print(row)
        
    if len(rows) == 0:
        print("\nChecking raw history user_ids:")
        cursor.execute("SELECT DISTINCT user_id FROM history")
        history_user_ids = [r[0] for r in cursor.fetchall()]
        print(f"History user_ids: {history_user_ids}")
        
        cursor.execute("SELECT id FROM users")
        user_ids = [r[0] for r in cursor.fetchall()]
        print(f"Users user_ids: {user_ids}")

    conn.close()
    
except mysql.connector.Error as err:
    print(f"Error: {err}")
