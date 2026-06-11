from fastapi import APIRouter, Depends
import aiosqlite
from database import get_db
from crud.users import create_user, hash_password
from schemas import UserCreate
import json

router = APIRouter(
    prefix="/user-",
    tags=["user"]
)

@router.post("olustur")
async def kullanici_olustur(credentials: UserCreate, db:aiosqlite.Connection=Depends(get_db)):
    hashed_password = hash_password(credentials.password)
    response = await create_user(db, credentials.email, hashed_password)

    if response:
        return {"status": "success", "message": "Kullanıcı başarıyla oluşturuldu"}
    return {"status": "failed", "message": "Kullanıcı oluşturulamadı"}