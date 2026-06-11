from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    body: str

class UserCreate(BaseModel):
    email: str
    password: str