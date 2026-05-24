from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str
    created_at: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class PredictionInput(BaseModel):
    age: int
    tenure: int
    monthly_charges: float
    total_charges: float
    num_products: int
    has_internet: int
    is_senior: int