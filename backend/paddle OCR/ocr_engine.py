from collections import OrderedDict
import gc
import logging
import threading

from paddleocr import PaddleOCR

from ocr_config import (
    LANG_MAP,
    MAX_LOADED_LANGS,
    configure_model_environment,
    normalize_lang,
)

logger = logging.getLogger(__name__)

_ocr_engines = OrderedDict()
_ocr_lock = threading.Lock()


def get_ocr(raw_lang: str | None = "kr"):
    lang = normalize_lang(raw_lang)

    with _ocr_lock:
        if lang in _ocr_engines:
            _ocr_engines.move_to_end(lang)
            return _ocr_engines[lang]

        try:
            logger.info("Initializing PaddleOCR for lang=%s...", lang)
            configure_model_environment()

            ocr_engine = PaddleOCR(
                lang=LANG_MAP[lang],
                use_angle_cls=True,
                use_gpu=False,
                show_log=False,
                use_mp=False,
                enable_mkldnn=False,
            )
            _ocr_engines[lang] = ocr_engine
            _ocr_engines.move_to_end(lang)
            _evict_old_engines()

            logger.info("PaddleOCR initialized successfully for lang=%s.", lang)
            return _ocr_engines[lang]
        except Exception:
            logger.exception("PaddleOCR initialization failed for lang=%s.", lang)
            raise


def _evict_old_engines():
    while MAX_LOADED_LANGS > 0 and len(_ocr_engines) > MAX_LOADED_LANGS:
        removed_lang, _ = _ocr_engines.popitem(last=False)
        logger.info("Unloaded PaddleOCR lang=%s by LRU policy.", removed_lang)
        gc.collect()


def loaded_langs():
    return list(_ocr_engines.keys())


def supported_langs():
    return list(LANG_MAP.keys())


def is_lang_loaded(raw_lang: str | None):
    return normalize_lang(raw_lang) in _ocr_engines
