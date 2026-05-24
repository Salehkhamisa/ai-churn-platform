from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.models.user import UserRegister, Token
from app.services.user_service import register_user, login_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register")
async def register(user: UserRegister):
    user_doc, error = await register_user(user.username, user.email, user.password)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return {"message": "User registered successfully", "username": user_doc["username"]}

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    token, error = await login_user(form_data.username, form_data.password)
    if error:
        raise HTTPException(status_code=401, detail=error)
    return {"access_token": token, "token_type": "bearer"}