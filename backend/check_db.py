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
    
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    
    print("Tables in 'ai_health':")
    for (table_name,) in tables:
        print(f"- {table_name}")
        
    cursor.close()
    conn.close()
    
except mysql.connector.Error as err:
    print(f"Error: {err}")
