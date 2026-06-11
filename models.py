from typing import Optional
from pydantic import BaseModel , Field

class Blog(BaseModel):
    id: int = Field(primary_key = True)
    title: str
    body : str