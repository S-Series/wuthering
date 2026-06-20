import importlib
import sys
import types
from pathlib import Path

from fastapi.testclient import TestClient


SPACE_DIR = Path(__file__).resolve().parents[1]


class FakePaddleOCR:
    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def ocr(self, *args, **kwargs):
        return [[
            [None, ("Cost 4", 0.99)],
            [None, ("Crit Rate", 0.98)],
            [None, ("10.5%", 0.97)],
        ]]


def load_app(monkeypatch):
    if str(SPACE_DIR) not in sys.path:
        sys.path.insert(0, str(SPACE_DIR))

    fake_paddleocr = types.ModuleType("paddleocr")
    fake_paddleocr.PaddleOCR = FakePaddleOCR
    monkeypatch.setitem(sys.modules, "paddleocr", fake_paddleocr)

    for module_name in (
        "main",
        "ocr_config",
        "ocr_engine",
        "ocr_service",
        "image_processing",
    ):
        sys.modules.pop(module_name, None)

    return importlib.import_module("main")


def test_health_returns_supported_languages(monkeypatch):
    main = load_app(monkeypatch)
    client = TestClient(main.app)

    response = client.get("/health?lang=jp")

    assert response.status_code == 200
    assert response.json()["ok"] is True
    assert response.json()["lang"] == "jp"
    assert set(response.json()["supported_langs"]) == {"kr", "en", "jp", "zh"}


def test_wake_loads_requested_language(monkeypatch):
    main = load_app(monkeypatch)
    client = TestClient(main.app)

    response = client.get("/wake?lang=en")

    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert body["lang"] == "en"
    assert body["loaded"] is True
    assert "en" in body["loaded_langs"]
