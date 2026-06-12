import aiosqlite
import jwt
from fastapi import Cookie, HTTPException, status
from security import SECRET_KEY, ALGORITHM


async def create_user(db: aiosqlite.Connection, email: str, hashed_password:str):
    cursor = await db.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_password))
    await db.commit()
    return cursor.rowcount > 0

async def get_user(db:aiosqlite.Connection, email: str):
    cursor = await db.execute("SELECT id, email, password FROM users WHERE email=?", (email,))
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı")
    return dict(row)

async def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Tekrardan giriş yapın.")
    
    try:
        payload= jwt.decode(access_token, SECRET_KEY, ALGORITHM)
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Oturum süresi dolmuş")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Geçersiz oturum.")
