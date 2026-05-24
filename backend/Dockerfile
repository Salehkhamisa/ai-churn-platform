# 1. Use the version that worked locally
FROM python:3.11-slim

# 2. Work from the /app folder inside the container
WORKDIR /app

# 3. Copy from the backend folder specifically
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy all files from the backend folder into the container
COPY backend/ .

# 5. Start the server
# Note: Railway often assigns a dynamic port, but 8000 is fine as long as 
# the Railway dashboard "Port" setting matches this.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]