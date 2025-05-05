from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import shutil
import os

app = FastAPI()

# CORS 설정 (React와 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 배포 시엔 도메인으로 제한 추천
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# EasyOCR 리더 (영어 + 한국어)
reader = easyocr.Reader(['en', 'ko'], gpu=False)

@app.get("/")
async def root():
    return {"message": "FastAPI OCR server is running"}

@app.post("/ocr")
async def perform_ocr(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = reader.readtext(temp_path, detail=0)
    finally:
        os.remove(temp_path)

    return {"text": result}
