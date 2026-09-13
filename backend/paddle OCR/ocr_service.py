import logging
import threading
import json

from fastapi import UploadFile

from image_processing import (
    encode_jpeg_base64,
    load_rgb_image,
    preprocess_image,
    to_ocr_array,
)
from ocr_config import normalize_lang
from ocr_engine import get_ocr
from echo_vision import match_harmony, match_label

logger = logging.getLogger(__name__)
_inference_lock = threading.Lock()
REGION_IDS = ("name", "cost", "main_1", "main_2", "sub_1", "sub_2", "sub_3", "sub_4", "sub_5")


async def run_ocr_batch(files, lang):
    from starlette.concurrency import run_in_threadpool
    if len(files) != len(REGION_IDS):
        raise ValueError("Expected nine OCR regions")
    contents = {}
    total = 0
    for file in files:
        region_id = (file.filename or "").removesuffix(".png")
        if region_id not in REGION_IDS or region_id in contents:
            raise ValueError("Invalid or duplicate OCR region")
        data = await file.read(15 * 1024 * 1024 + 1)
        total += len(data)
        if not data or total > 15 * 1024 * 1024:
            raise ValueError("Invalid batch size")
        contents[region_id] = data
    return await run_in_threadpool(analyze_batch, contents, lang)


def analyze_batch(contents, lang):
    if set(contents) != set(REGION_IDS):
        raise ValueError("Expected nine unique OCR regions")
    safe_lang = normalize_lang(lang)
    regions = []
    # Keep the predictor loaded and serialize all nine inferences as one job.
    with _inference_lock:
        engine = get_ocr(safe_lang)
        for region_id in REGION_IDS:
            try:
                with load_rgb_image(contents[region_id]) as image:
                    with preprocess_image(image) as processed:
                        result = engine.ocr(to_ocr_array(processed), cls=True)
                tokens = sorted(extract_regions(result), key=lambda token: (round(token["cy"] / 12), token["x"]))
                regions.append({"id": region_id, "success": True, "texts": [token["text"] for token in tokens], "tokens": tokens})
            except Exception:
                logger.exception("OCR failed for region %s", region_id)
                regions.append({"id": region_id, "success": False, "texts": [], "tokens": [], "error": "Region OCR failed"})
    return {"success": True, "lang": safe_lang, "regions": regions}


async def run_ocr(file: UploadFile, lang: str | None, preprocessing=None):
    from starlette.concurrency import run_in_threadpool
    contents = await file.read()
    return await run_in_threadpool(analyze_image, contents, lang, preprocessing)


def analyze_image(contents, lang, preprocessing=None):
    safe_lang = normalize_lang(lang)
    image = load_rgb_image(contents)
    metadata = validate_preprocessing(preprocessing, image.size)
    bands = metadata["bands"] if metadata else []
    # The browser owns geometry. Never search for or crop a panel on the server.
    processed = preprocess_image(image)
    encoded_image = encode_jpeg_base64(image)

    logger.info("Running OCR for lang=%s...", safe_lang)
    # Paddle predictors and language eviction must not race concurrent requests.
    with _inference_lock:
        ocr_engine = get_ocr(safe_lang)
        results = ocr_engine.ocr(to_ocr_array(processed), cls=True)
    texts = extract_texts(results)
    regions = extract_regions(results)
    vision = None
    if metadata:
        rows = []
        header = []
        for band in bands:
            tokens = [r for r in regions if band["top"] <= r["cy"] < band["bottom"]]
            tokens.sort(key=lambda r: r["x"])
            if band["index"] == -1:
                header = [r["text"] for r in sorted(tokens, key=lambda r: (round(r["cy"] / 12), r["x"]))]
                continue
            index = band["index"]
            rows.append({"index": index, "tokens": tokens,
                         "imageMatch": match_label(image.crop((16, band["top"], image.width-16, band["bottom"])), safe_lang) if index >= 2 else None})
        vision = {"version": 1, "header": header, "rows": rows,
                  "harmony": match_harmony(image.crop(tuple(metadata["icon"]))) }

    logger.info("Found %s text regions for lang=%s.", len(texts), safe_lang)

    return {
        "success": True,
        "lang": safe_lang,
        "texts": texts,
        "full_text": "\n".join(texts),
        "image_base64": encoded_image,
        "vision": vision,
    }


def extract_texts(results):
    texts = []

    if results and results[0]:
        for line in results[0]:
            if line and len(line) > 1:
                texts.append(line[1][0])

    return texts


def extract_regions(results):
    regions = []
    for line in (results[0] if results and results[0] else []):
        if not line or len(line) < 2:
            continue
        points, recognition = line[0], line[1]
        regions.append({"text": str(recognition[0]), "confidence": float(recognition[1]),
                        "x": float(min(p[0] for p in points)),
                        "cy": float(sum(p[1] for p in points) / len(points))})
    return regions


def validate_preprocessing(raw, size):
    if raw is None:
        return None
    if not isinstance(raw, str) or len(raw) > 16_384:
        raise ValueError("Invalid preprocessing metadata")
    data = json.loads(raw)
    if not isinstance(data, dict) or data.get("version") != 1:
        raise ValueError("Unsupported preprocessing version")
    w, h = size
    if data.get("width") != w or data.get("height") != h or w < 33:
        raise ValueError("Preprocessing dimensions do not match the image")
    bands = data.get("bands")
    if not isinstance(bands, list) or len(bands) != 8:
        raise ValueError("Expected header and seven row bands")
    previous = 0
    for index, band in enumerate(bands):
        if not isinstance(band, dict) or band.get("index") != index-1:
            raise ValueError("Invalid row index")
        top, bottom = band.get("top"), band.get("bottom")
        if type(top) is not int or type(bottom) is not int or not previous <= top < bottom <= h:
            raise ValueError("Invalid row bounds")
        previous = bottom
    icon = data.get("icon")
    if not isinstance(icon, list) or len(icon) != 4 or not all(type(v) is int for v in icon):
        raise ValueError("Invalid icon bounds")
    x1, y1, x2, y2 = icon
    if not (0 <= x1 < x2 <= w and 0 <= y1 < y2 <= bands[0]["bottom"]):
        raise ValueError("Icon outside header")
    return data
