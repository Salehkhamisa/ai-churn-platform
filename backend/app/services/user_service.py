from app.database.connection import users_collection
from app.auth.jwt_handler import hash_password, verify_password, create_access_token
from datetime import datetime

async def register_user(username: str, email: str, password: str):
    existing = await users_collection.find_one({"username": username})
    if existing:
        return None, "Username already exists"
    
    existing_email = await users_collection.find_one({"email": email})
    if existing_email:
        return None, "Email already registered"
    
    hashed = hash_password(password)
    user_doc = {
        "username": username,
        "email": email,
        "hashed_password": hashed,
        "created_at": datetime.utcnow()
    }
    await users_collection.insert_one(user_doc)
    return user_doc, None

async def login_user(username: str, password: str):
    user = await users_collection.find_one({"username": username})
    if not user:
        return None, "User not found"
    if not verify_password(password, user["hashed_password"]):
        return None, "Incorrect password"
    token = create_access_token({"sub": username})
    return token, None