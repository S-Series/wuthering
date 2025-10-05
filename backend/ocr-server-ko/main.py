from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from paddleocr import PaddleOCR
from PIL import Image
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
# PaddleOCR Lazy Loading
# ---------------------------
ocr = None

def get_ocr():
    """첫 요청 시에만 OCR 초기화 (메모리 절약)"""
    global ocr
    if ocr is None:
        try:
            logger.info("🔄 Initializing PaddleOCR (Korean)...")
            
            # ⭐ /tmp 사용 (항상 쓰기 권한 있음)
            model_dir = '/tmp/.paddleocr'
            os.makedirs(model_dir, exist_ok=True)
            
            # 환경 변수 설정
            os.environ['HOME'] = '/tmp'
            os.environ['PPOCR_HOME'] = model_dir
            
            logger.info(f"Model directory: {model_dir}")
            logger.info(f"HOME: {os.environ.get('HOME')}")
            logger.info(f"PPOCR_HOME: {os.environ.get('PPOCR_HOME')}")
            
            ocr = PaddleOCR(
                lang='korean',
                use_angle_cls=True,
                use_gpu=False,
                show_log=False,
                use_mp=False,  # 멀티프로세싱 비활성화
                enable_mkldnn=False  # 안정성 향상
            )
            logger.info("✅ PaddleOCR initialized successfully!")
        except Exception as e:
            logger.error(f"❌ PaddleOCR initialization failed: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            raise
    return ocr

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
    status = "initialized" if ocr is not None else "not_loaded"
    return {
        "message": "OCR API Running (PaddleOCR)",
        "ocr_status": status,
        "language": "korean",
        "note": "Model loads on first request"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "ocr_initialized": ocr is not None,
        "language": "korean"
    }

# ---------------------------
# OCR endpoint
# ---------------------------
@app.post("/ocr")
async def ocr_process(file: UploadFile = File(...)):
    try:
        # 첫 요청 시 OCR 초기화
        ocr_engine = get_ocr()
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        processed = process_and_crop_image(image)

        buffered = io.BytesIO()
        processed.save(buffered, format="JPEG")
        encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # PaddleOCR 실행
        np_img = np.array(processed)

        logger.info("🔍 Running OCR...")
        results = ocr_engine.ocr(np_img, cls=True)
        
        # 결과 파싱
        texts = []
        if results and results[0]:
            for line in results[0]:
                if line and len(line) > 1:
                    text = line[1][0]
                    texts.append(text)
        
        full_text = "\n".join(texts)
        logger.info(f"✅ Found {len(texts)} text regions")
        
        return {
            "success": True,
            "texts": texts,
            "full_text": full_text,
            "image_base64": encoded_image
        }

    except Exception as e:
        logger.error(f"❌ OCR error: {str(e)}")
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