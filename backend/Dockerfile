FROM python:3.11-slim

WORKDIR /app

# We must include the "backend/" folder name here!
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy everything from inside the backend folder
COPY backend/ .

# We use the list format for CMD to be safer
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]