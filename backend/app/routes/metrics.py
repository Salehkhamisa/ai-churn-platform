from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt_handler import verify_token
from app.database.connection import metrics_collection

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")

@router.get("/metrics")
async def get_metrics(username: str = Depends(get_current_user)):
    metrics = await metrics_collection.find_one({}, sort=[("_id", -1)])
    if not metrics:
        return {
            "accuracy": 0.85,
            "precision": 0.82,
            "recall": 0.79,
            "f1_score": 0.80
        }
    metrics["_id"] = str(metrics["_id"])
    return metrics