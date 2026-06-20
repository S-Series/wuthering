from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, File, Form, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from ocr_config import PRELOAD_LANG, normalize_lang
from ocr_engine import get_ocr, is_lang_loaded, loaded_langs, supported_langs
from ocr_service import run_ocr

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        if PRELOAD_LANG:
            logger.info("Server startup: preloading PaddleOCR lang=%s...", PRELOAD_LANG)
            get_ocr(PRELOAD_LANG)
            logger.info("Server startup: PaddleOCR preload completed.")
    except Exception:
        logger.exception("Startup preload failed.")

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "OCR API Running (PaddleOCR)",
        "loaded_langs": loaded_langs(),
        "supported_langs": supported_langs(),
    }


@app.get("/health")
def health(lang: str | None = Query(None)):
    safe_lang = normalize_lang(lang)

    return {
        "ok": True,
        "lang": safe_lang,
        "loaded": is_lang_loaded(safe_lang),
        "loaded_langs": loaded_langs(),
        "supported_langs": supported_langs(),
    }


@app.get("/wake")
def wake(lang: str = Query("kr")):
    safe_lang = normalize_lang(lang)
    get_ocr(safe_lang)

    return {
        "ok": True,
        "lang": safe_lang,
        "loaded": is_lang_loaded(safe_lang),
        "loaded_langs": loaded_langs(),
    }


@app.post("/ocr")
async def ocr_process(
    file: UploadFile = File(...),
    lang: str = Form("kr"),
):
    try:
        return await run_ocr(file, lang)
    except Exception as e:
        logger.exception("OCR error.")
        return {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__,
        }


# local testing
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=7860)
