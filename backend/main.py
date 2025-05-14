from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import numpy as np
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

readers = {
    "en": easyocr.Reader(['en'], gpu=False),
    "kr": easyocr.Reader(['ko', 'en'], gpu=False),
    "ja": easyocr.Reader(['ja', 'en'], gpu=False),
    "cn": easyocr.Reader(['ch_sim', 'en'], gpu=False),
}

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
    lang: str = Query("en", enum=["en", "kr", "ja", "cn"])
):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    image = upscale_if_needed(image)

    reader = readers[lang]
    result = reader.readtext(np.array(image), detail=0)

    return {"text": result}
