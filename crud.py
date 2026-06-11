import aiosqlite

async def create_blog_post(db: aiosqlite.Connection, title: str, body: str):
    await db.execute(
        "INSERT INTO posts (title, body) VALUES (?, ?)",
        (title, body)
    )
    await db.commit()

async def update_blog_post(db: aiosqlite.Connection, post_id: int, title:str, body: str):
    await db.execute(
        "UPDATE posts SET title = ?, body = ? WHERE id = ?", 
        (title, body, post_id)
    )
    await db.commit()

async def get_all_blog_posts(db: aiosqlite.Connection):
    posts = await db.execute("SELECT * FROM posts")
    rows = await posts.fetchall()
    return [dict(row) for row in rows]

async def get_single_blog_post(db: aiosqlite.Connection, post_id: int):
    post = await db.execute("SELECT * FROM posts WHERE id=?", (post_id,))
    row = await post.fetchone()
    if row is None:
        return None
    return dict(row)

async def delete_blog_post(db:aiosqlite.Connection, post_id: int):
    await db.execute("DELETE FROM posts where id=?", (post_id,))
    await db.commit()