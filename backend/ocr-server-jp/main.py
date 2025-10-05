from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import easyocr
from PIL import Image
import numpy as np
import uvicorn
import io
import base64

app = FastAPI()

# ---------------------------
# CORS Init
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# FastOCR (EasyOCR) Init
# ---------------------------
try:
    reader = easyocr.Reader(['jp', 'en'], gpu=False)
except Exception as e:
    reader = None

# ---------------------------
# Img crop func
# ---------------------------
def process_and_crop_image(image: Image.Image):
    w, h = image.size

    if w <= 640:
        return image

    left = w * (2 / 3)
    upper = 90
    right = w
    lower = 540

    upper = max(0, min(upper, h))
    lower = max(0, min(lower, h))

    cropped = image.crop((left, upper, right, lower))
    return cropped

@app.get("/")
def home():
    return {"message": "OCR API Running"}
# ---------------------------
# OCR endpoint
# ---------------------------
@app.post("/ocr")
async def ocr_process(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        processed = process_and_crop_image(image)

        buffered = io.BytesIO()
        processed.save(buffered, format="JPEG")
        encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

        np_img = np.array(processed)

        results = reader.readtext(np_img, detail=1, paragraph=False)

        texts = [text for (_, text, conf) in results]
        full_text = "\n".join(texts)
        return {
            "success": True,
            "texts": texts,
            "full_text": full_text,
            "image_base64": encoded_image
        }

    except Exception as e:
        return {"success": False, "error": str(e)}

# ---------------------------
# local testing
# ---------------------------
#if __name__ == "__main__":
#    uvicorn.run(app, host="0.0.0.0", port=8000)
