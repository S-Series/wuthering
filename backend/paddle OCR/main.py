from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from paddleocr import PaddleOCR
from PIL import Image, ImageEnhance
import numpy as np
import uvicorn
import io
import base64
import logging
import os

# ---------------------------
# Logging Setup
# ---------------------------
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ---------------------------
# PaddleOCR Lazy Loading
# ---------------------------
setLang = 'korean'  # korean en japan ch ch_tra
ocr = None

def get_ocr():
    global ocr
    if ocr is None:
        try:
            logger.info("Initializing PaddleOCR...")

            model_dir = '/tmp/.paddleocr'
            os.makedirs(model_dir, exist_ok=True)

            os.environ['HOME'] = '/tmp'
            os.environ['PPOCR_HOME'] = model_dir

            logger.info(f"Model directory: {model_dir}")
            logger.info(f"HOME: {os.environ.get('HOME')}")
            logger.info(f"PPOCR_HOME: {os.environ.get('PPOCR_HOME')}")

            ocr = PaddleOCR(
                lang=setLang,
                use_angle_cls=True,
                use_gpu=False,
                show_log=False,
                use_mp=False,
                enable_mkldnn=False
            )

            logger.info("PaddleOCR initialized successfully!")

        except Exception as e:
            logger.error(f"PaddleOCR initialization failed: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            raise

    return ocr

# ---------------------------
# FastAPI lifespan
# ---------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("Server startup: preloading PaddleOCR...")
        get_ocr()
        logger.info("Server startup: PaddleOCR preload completed.")
    except Exception as e:
        logger.error(f"Startup preload failed: {e}")
    yield

app = FastAPI(lifespan=lifespan)

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
# Img crop func
# ---------------------------
def process_and_crop_image(image: Image.Image):
    w, h = image.size

    if w <= 640:
        return image

    target_ratio = 16 / 9
    current_ratio = w / h

    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        cw = w - new_w
        right_cut = round(80 * (h / 1080))
        left_cut = cw - right_cut
        image = image.crop((left_cut, 0, w - right_cut, h))
        w, h = image.size

    left = w * (2 / 3)
    upper = 90 * (w / 1920)
    right = w
    lower = 540 * (w / 1920)

    upper = max(0, min(upper, h))
    lower = max(0, min(lower, h))

    cropped = image.crop((left, upper, right, lower))
    return cropped

# ---------------------------
# Home / Health
# ---------------------------
@app.get("/")
def home():
    status = "initialized" if ocr is not None else "not_loaded"
    return {
        "message": "OCR API Running (PaddleOCR)",
        "ocr_status": status
    }

@app.get("/health")
def health():
    return {
        "ok": True,
        "ocr_loaded": ocr is not None
    }

# ---------------------------
# OCR endpoint
# ---------------------------
@app.post("/ocr")
async def ocr_process(file: UploadFile = File(...)):
    try:
        ocr_engine = get_ocr()

        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(0)

        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2)

        processed = process_and_crop_image(image)

        buffered = io.BytesIO()
        processed.save(buffered, format="JPEG")
        encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

        np_img = np.array(processed)

        logger.info("Running OCR...")
        results = ocr_engine.ocr(np_img, cls=True)

        texts = []
        if results and results[0]:
            for line in results[0]:
                if line and len(line) > 1:
                    text = line[1][0]
                    texts.append(text)

        full_text = "\n".join(texts)
        logger.info(f"Found {len(texts)} text regions")
        logger.info(f"OCR raw result: {results}")

        return {
            "success": True,
            "texts": texts,
            "full_text": full_text,
            "image_base64": encoded_image
        }

    except Exception as e:
        logger.error(f"OCR error: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__
        }

# ---------------------------
# local testing
# ---------------------------
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=7860)