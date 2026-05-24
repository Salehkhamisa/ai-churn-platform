from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, predict, metrics
from app.ml.predictor import load_model
from app.database.connection import metrics_collection
from app.ml.train_model import train_and_save
import os

app = FastAPI(title="AI Churn Prediction Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    if not os.path.exists("model/churn_model.pkl"):
        print("Training model for first time...")
        metrics = train_and_save()
        await metrics_collection.insert_one(metrics)
    load_model()
    print("App ready!")

app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(predict.router, prefix="/api", tags=["Predict"])
app.include_router(metrics.router, prefix="/api", tags=["Metrics"])

@app.get("/")
async def root():
    return {"message": "AI Platform API is running!"}