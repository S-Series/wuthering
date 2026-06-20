import logging

from fastapi import UploadFile

from image_processing import (
    encode_jpeg_base64,
    load_rgb_image,
    preprocess_image,
    to_ocr_array,
)
from ocr_config import normalize_lang
from ocr_engine import get_ocr

logger = logging.getLogger(__name__)


async def run_ocr(file: UploadFile, lang: str | None):
    safe_lang = normalize_lang(lang)
    ocr_engine = get_ocr(safe_lang)

    contents = await file.read()
    image = load_rgb_image(contents)
    processed = preprocess_image(image)
    encoded_image = encode_jpeg_base64(processed)
    np_img = to_ocr_array(processed)

    logger.info("Running OCR for lang=%s...", safe_lang)
    results = ocr_engine.ocr(np_img, cls=True)
    texts = extract_texts(results)

    logger.info("Found %s text regions for lang=%s.", len(texts), safe_lang)
    logger.info("OCR raw result: %s", results)

    return {
        "success": True,
        "lang": safe_lang,
        "texts": texts,
        "full_text": "\n".join(texts),
        "image_base64": encoded_image,
    }


def extract_texts(results):
    texts = []

    if results and results[0]:
        for line in results[0]:
            if line and len(line) > 1:
                texts.append(line[1][0])

    return texts
