import importlib.util
import importlib
import sys
import types
from pathlib import Path

import pytest
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient


@pytest.mark.parametrize("relative,path", [
    ("paddle OCR/internal_auth.py", "/ocr/batch"),
    ("Imagemaker/app/internal_auth.py", "/render/card"),
])
def test_service_boundary(monkeypatch, relative, path):
    root = Path(__file__).resolve().parents[2]
    spec = importlib.util.spec_from_file_location("tested_auth", root / relative)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    app = FastAPI()
    app.add_middleware(module.InternalAuthMiddleware)
    calls = []

    @app.post(path)
    async def work(request: Request):
        calls.append(True)
        return {"ok": True}

    @app.get("/health")
    async def health():
        return {"ok": True}

    client = TestClient(app)
    monkeypatch.delenv("INTERNAL_API_SECRET", raising=False)
    assert client.post(path, content=b"malformed").status_code == 503
    assert client.get("/health").status_code == 200
    secret = "test-internal-secret-0123456789012345"
    monkeypatch.setenv("INTERNAL_API_SECRET", secret)
    assert client.post(path, content=b"malformed").status_code == 401
    assert client.post(path, headers={"X-Internal-Secret": "wrong"}).status_code == 401
    assert client.post(path, headers=[("X-Internal-Secret", secret), ("X-Internal-Secret", secret)]).status_code == 401
    assert not calls
    assert client.post(path, headers={"X-Internal-Secret": secret}).status_code == 200
    assert len(calls) == 1
    assert client.get("/wake").status_code == 401
    assert client.get("/docs").status_code == 401


def test_actual_render_app_requires_secret(monkeypatch):
    root = Path(__file__).resolve().parents[2] / "Imagemaker"
    monkeypatch.syspath_prepend(str(root))
    service = types.ModuleType("app.services.render_service")
    calls = []

    def render(payload):
        calls.append(payload)
        return b"test-png"

    service.prepare_render_data = render
    monkeypatch.setitem(sys.modules, "app.services.render_service", service)
    monkeypatch.setenv("INTERNAL_API_SECRET", "test-render-secret-01234567890123456789")
    main = importlib.import_module("app.main")
    client = TestClient(main.app)
    assert client.get("/").status_code == 200
    assert client.post("/render/card", content=b"malformed").status_code == 401
    assert not calls
    response = client.post("/render/card", json={}, headers={"X-Internal-Secret": "test-render-secret-01234567890123456789"})
    assert response.status_code == 200
    assert response.content == b"test-png"
    assert len(calls) == 1
