import joblib
import numpy as np

model = None
scaler = None

def load_model():
    global model, scaler
    model = joblib.load("model/churn_model.pkl")
    scaler = joblib.load("model/scaler.pkl")
    print("Model loaded successfully!")

def predict_churn(input_data: dict) -> dict:
    features = np.array([[
        input_data["age"],
        input_data["tenure"],
        input_data["monthly_charges"],
        input_data["total_charges"],
        input_data["num_products"],
        input_data["has_internet"],
        input_data["is_senior"]
    ]])

    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0]

    return {
        "prediction": int(prediction),
        "label": "Will Churn" if prediction == 1 else "Will Stay",
        "churn_probability": round(float(probability[1]) * 100, 2),
        "stay_probability": round(float(probability[0]) * 100, 2)
    }