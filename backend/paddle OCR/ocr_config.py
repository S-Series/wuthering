import os

DEFAULT_LANG = "kr"

LANG_MAP = {
    "kr": "korean",
    "en": "en",
    "jp": "japan",
    "zh": "ch",
}

MODEL_DIR = os.getenv("PPOCR_HOME", "/tmp/.paddleocr")
MAX_LOADED_LANGS = int(os.getenv("OCR_MAX_LOADED_LANGS", "2"))
PRELOAD_LANG = os.getenv("OCR_PRELOAD_LANG", "").strip()


def normalize_lang(raw: str | None):
    if raw in LANG_MAP:
        return raw
    return DEFAULT_LANG


def configure_model_environment():
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.environ["HOME"] = os.getenv("HOME", "/tmp")
    os.environ["PPOCR_HOME"] = MODEL_DIR
