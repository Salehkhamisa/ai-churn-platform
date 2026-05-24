import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler
import joblib
import os

def generate_dataset():
    np.random.seed(42)
    n = 1000
    data = {
        "age": np.random.randint(18, 70, n),
        "tenure": np.random.randint(0, 72, n),
        "monthly_charges": np.random.uniform(20, 120, n),
        "total_charges": np.random.uniform(100, 8000, n),
        "num_products": np.random.randint(1, 5, n),
        "has_internet": np.random.randint(0, 2, n),
        "is_senior": np.random.randint(0, 2, n),
    }
    df = pd.DataFrame(data)
    df["churn"] = ((df["tenure"] < 12) & (df["monthly_charges"] > 70)).astype(int)
    df["churn"] = df["churn"] | (np.random.random(n) < 0.15).astype(int)
    df["churn"] = df["churn"].clip(0, 1)
    return df

def train_and_save():
    print("Generating dataset...")
    df = generate_dataset()

    # Save dataset
    os.makedirs("dataset", exist_ok=True)
    df.to_csv("dataset/churn_data.csv", index=False)
    print("Dataset saved.")

    X = df.drop("churn", axis=1)
    y = df["churn"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("Training model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)

    metrics = {
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred), 4),
        "recall": round(recall_score(y_test, y_pred), 4),
        "f1_score": round(f1_score(y_test, y_pred), 4),
    }

    print("Metrics:", metrics)

    # Save model and scaler
    os.makedirs("model", exist_ok=True)
    joblib.dump(model, "model/churn_model.pkl")
    joblib.dump(scaler, "model/scaler.pkl")
    print("Model and scaler saved!")

    return metrics

if __name__ == "__main__":
    train_and_save()