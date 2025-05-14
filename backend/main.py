from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import easyocr
from PIL import Image
import io
import os

app = FastAPI()

# CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 메모리 절약을 위해 가장 필요한 언어만 선택
# ex) 'ko' or 'ja' or 'ch_tra' depending on query
loaded_langs = {
    "en": None,
    "kr": None,
    "ja": None,
    "cn": None
}

def get_reader(lang: str):
    # 필요한 경우만 Reader 생성 (1회만)
    if loaded_langs[lang] is None:
        if lang == "kr":
            loaded_langs[lang] = easyocr.Reader(['ko', 'en'], gpu=False)
        elif lang == "ja":
            loaded_langs[lang] = easyocr.Reader(['ja', 'en'], gpu=False)
        elif lang == "cn":
            loaded_langs[lang] = easyocr.Reader(['ch_tra', 'en'], gpu=False)
        else:
            loaded_langs[lang] = easyocr.Reader(['en'], gpu=False)
    return loaded_langs[lang]

@app.get("/")
async def root():
    return {"message": "FastAPI OCR server is running"}

@app.post("/ocr")
async def perform_ocr(
    file: UploadFile = File(...),
    lang: str = Query("kr", enum=["en", "kr", "ja", "cn"])
):
    image_bytes = await file.read()

    # 이미지 전처리: 흑백으로 변환
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("L")  # "L" = grayscale
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        buf.seek(0)
    except Exception as e:
        return {"error": f"Image processing failed: {str(e)}"}

    # OCR 수행
    try:
        reader = get_reader(lang)
        result = reader.readtext(buf, detail=0)
    except Exception as e:
        return {"error": f"OCR failed: {str(e)}"}

    return {"text": result}
