from fastapi import APIRouter, Depends, HTTPException, Response, status
import aiosqlite
from database import get_db
from crud.users import create_user, get_user, get_current_user
from security import hash_password, match_password, generate_token
from schemas import UserCreate, EmailCheck
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
    raise HTTPException(status_code=400, detail="Kullanıcı oluşturulamadı")

@router.post("giris")
async def giris_yap(credentials: UserCreate, response:Response, db:aiosqlite.Connection=Depends(get_db)):
    user = await get_user(db, credentials.email);
    if not user or not match_password(credentials.password, user.get('password')):
        raise HTTPException(status_code = 400, detail="E-posta veya şifre hatalı")
    
    token = generate_token(user.get('id'), credentials.email)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=3600
    )

    return {"status": "success", "message": "Başarıyla giriş yapıldı"}
    

@router.post('cikis')
async def cikis_yap(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="None"
    )
    return {"status": "success", "message": "Başarıyla çıkış yapıldı"}

@router.get("check-auth")
async def check_auth(current_user: dict = Depends(get_current_user)):
    return {"status": "success"}


@router.post("e-posta-kontrol")
async def e_posta_kontrol_et(userEmail: EmailCheck, db = Depends(get_db)):
    user = await get_user(db, userEmail.email)
    if user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email kayıtlı")
    return {"status": "success"}