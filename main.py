from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import blog, auth
from contextlib import asynccontextmanager
from database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(blog.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "you are healthy"}
