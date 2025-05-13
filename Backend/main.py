from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import numpy as np
from PIL import Image
import io

app = FastAPI()

# CORS 설정 (React 등 클라이언트와 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포 시엔 특정 도메인으로 제한 추천
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# EasyOCR 리더 사전 생성 (GPU 사용 안 함)
readers = {
    "en": easyocr.Reader(['en'], gpu=False),
    "kr": easyocr.Reader(['ko', 'en'], gpu=False),
    "ja": easyocr.Reader(['ja', 'en'], gpu=False),
    "cn": easyocr.Reader(['ch_sim', 'en'], gpu=False),
}

# 이미지 업스케일 함수 (가로/세로 1000 미만이면 2배 확대)
def upscale_if_needed(image: Image.Image) -> Image.Image:
    width, height = image.size
    if width < 1000 or height < 1000:
        return image.resize((width * 2, height * 2), Image.LANCZOS)
    return image

@app.get("/")
async def root():
    return {"message": "FastAPI OCR server is running"}

@app.post("/ocr")
async def perform_ocr(
    file: UploadFile = File(...),
    lang: str = Query("kr", enum=["en", "kr", "ja", "cn"])  # 기본값: 한국어 + 영어
):
    # 업로드된 파일을 메모리에서 읽고 PIL 이미지로 변환
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    # 해상도 낮으면 업스케일
    image = upscale_if_needed(image)

    # OCR 수행
    reader = readers[lang]
    result = reader.readtext(np.array(image), detail=0)

    return {"text": result}
