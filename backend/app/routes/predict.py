from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from app.models.user import PredictionInput
from app.ml.predictor import predict_churn
from app.auth.jwt_handler import verify_token
from app.database.connection import predictions_collection, logs_collection
from datetime import datetime

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")

@router.post("/predict")
async def predict(data: PredictionInput, username: str = Depends(get_current_user)):
    try:
        result = predict_churn(data.dict())

        await predictions_collection.insert_one({
            "username": username,
            "input": data.dict(),
            "result": result,
            "timestamp": datetime.utcnow()
        })

        await logs_collection.insert_one({
            "username": username,
            "action": "prediction",
            "timestamp": datetime.utcnow()
        })

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(username: str = Depends(get_current_user)):
    cursor = predictions_collection.find({"username": username}).sort("timestamp", -1).limit(10)
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return history