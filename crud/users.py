import aiosqlite
import bcrypt


async def create_user(db: aiosqlite.Connection, email: str, hashed_password:str):
    cursor = await db.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_password))
    await db.commit()
    return cursor.rowcount > 0

def hash_password(password: str):
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    return hashed_password.decode('utf-8')
