import os
import mysql.connector

# Database config (matching app.py)
DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "ai_health" # We'll check/create this
}

def init_db():
    print("🚀 Initializing Database...")
    
    # 1. Connect to MySQL Server (no DB selected yet)
    try:
        conn = mysql.connector.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"]
        )
        cursor = conn.cursor()
        
        # 2. Read Schema File
        schema_path = os.path.join(os.path.dirname(__file__), "../database/schema.sql")
        with open(schema_path, "r") as f:
            schema_sql = f.read()
            
        # 3. Execute Schema Statements
        # Split by ';' to execute one by one
        statements = schema_sql.split(';')
        
        for statement in statements:
            if statement.strip():
                try:
                    cursor.execute(statement)
                    print(f"✅ Executed: {statement[:50].strip()}...")
                except mysql.connector.Error as err:
                    print(f"❌ Error executing: {statement[:50]}... -> {err}")

        conn.commit()
        cursor.close()
        conn.close()
        print("\n✨ Database initialized successfully!")
        
    except mysql.connector.Error as err:
        print(f"❌ Critical Error: {err}")

if __name__ == "__main__":
    init_db()
