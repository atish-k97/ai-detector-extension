from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# THIS IS THE KEY: It tells Python to allow the Extension to talk to it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze(request: ScanRequest):
    # Logic: If text contains "AI", return detected
    is_ai = "AI" in request.text.upper()
    return {"status": "detected" if is_ai else "safe"}