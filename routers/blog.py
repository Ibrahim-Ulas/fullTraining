from fastapi import APIRouter, Depends
import aiosqlite
from database import get_db
from crud.blogs import get_all_blog_posts, get_single_blog_post, create_blog_post, update_blog_post, delete_blog_post
from crud.users import get_current_user
from schemas import PostCreate

router = APIRouter(
    prefix="/blog-",
    tags=["blog"]
)

@router.get("tumugoruntule")
async def blogları_goruntule(db:aiosqlite.Connection = Depends(get_db), current_user: dict = Depends(get_current_user)):
    current_user_id = current_user.get("user_id")
    posts = await get_all_blog_posts(db, current_user_id)
    if posts:
        return posts
    return []

@router.get("goruntule")
async def blog_goruntule(post_id: int, db:aiosqlite.Connection = Depends(get_db), current_user: dict = Depends(get_current_user)):
    current_user_id = current_user.get("user_id")
    post = await get_single_blog_post(db, post_id, current_user_id)
    if post:
        return post
    return []

@router.post("olustur")
async def blog_olustur(blog: PostCreate ,db: aiosqlite.Connection = Depends(get_db), current_user: dict = Depends(get_current_user)):
    current_user_id = current_user.get("user_id")
    response = await create_blog_post(db, current_user_id, blog.title, blog.body)
    if response:
        return {"status": "success", "message": "Blog başarıyla oluşturuldu"}
    return {"status": "failed", "message": "Blog oluşturulamadı"}

@router.put("guncelle")
async def blog_guncelle(post_id: int, blog: PostCreate, db: aiosqlite.Connection = Depends(get_db)):
    response = await update_blog_post(db, post_id, blog.title, blog.body)
    if response:
        return {"status": "success", "message": "Blog başarıyla oluşturuldu"}
    return {"status": "failed", "message": "Blog oluşturulamadı"}

@router.delete("sil")
async def blog_sil(post_id: int, db: aiosqlite.Connection = Depends(get_db)):
    response = await delete_blog_post(db, post_id)
    if response:
        return {"status": "success", "message": "Blog başarıyla oluşturuldu"}
    return {"status": "failed", "message": "Blog oluşturulamadı"}
