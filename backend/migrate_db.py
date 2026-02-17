import mysql.connector

def migrate_db():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="ai_health"
        )
        cursor = conn.cursor()
        
        print("Adding 'age' column...")
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN age INT")
            print("✅ Added 'age' column.")
        except mysql.connector.Error as err:
            if "Duplicate column name" in str(err):
                print("⚠️ 'age' column already exists.")
            else:
                print(f"❌ Failed to add 'age': {err}")

        print("Adding 'gender' column...")
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN gender VARCHAR(20)")
            print("✅ Added 'gender' column.")
        except mysql.connector.Error as err:
            if "Duplicate column name" in str(err):
                print("⚠️ 'gender' column already exists.")
            else:
                print(f"❌ Failed to add 'gender': {err}")

        conn.commit()
        cursor.close()
        conn.close()
        print("Migration complete.")

    except mysql.connector.Error as err:
        print(f"Database connection failed: {err}")

if __name__ == "__main__":
    migrate_db()
