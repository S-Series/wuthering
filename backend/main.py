from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import easyocr
from PIL import Image
import io
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

loaded_langs = {
    "en": None,
    "kr": None,
    "ja": None,
    "cn": None
}

def get_reader(lang: str):
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
    lang: str = Query("en", enum=["en", "kr", "ja", "cn"])
):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        np_image = np.array(image)
    except Exception as e:
        return {"error": f"Image processing failed: {str(e)}"}

    try:
        reader = get_reader(lang)
        result = reader.readtext(np_image, detail=0)
    except Exception as e:
        return {"error": f"OCR failed: {str(e)}"}

    return {"text": result}
