from fastapi import APIRouter, Depends
import aiosqlite
from database import get_db
import crud
from schemas import PostCreate

router = APIRouter(
    prefix="/blog",
    tags=["blog"]
)

@router.get("-tumugoruntule")
async def blogları_goruntule(db:aiosqlite.Connection = Depends(get_db)):
    posts = await crud.get_all_blog_posts(db)
    return posts

@router.get("-goruntule")
async def blog_goruntule(post_id: int, db:aiosqlite.Connection = Depends(get_db)):
    post = await crud.get_single_blog_post(db, post_id)
    return post

@router.post("-olustur")
async def blog_olustur(blog: PostCreate ,db: aiosqlite.Connection = Depends(get_db)):
    await crud.create_blog_post(db, blog.title, blog.body)
    return {"status": "success", "message": "Blog başarıyla oluşturuldu"}

@router.put("-guncelle")
async def blog_guncelle(post_id: int, blog: PostCreate, db: aiosqlite.Connection = Depends(get_db)):
    await crud.update_blog_post(db, post_id, blog.title, blog.body)
    return {"status": "success", "message": "Blog başarıyla güncellendi."}

@router.delete("-sil")
async def blog_sil(post_id: int, db: aiosqlite.Connection = Depends(get_db)):
    await crud.delete_blog_post(db, post_id)
    return {"status": "success", "message": "Blog başarıyla silindi."}