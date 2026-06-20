---
title: Wuthering OCR API
emoji: 🔎
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
short_description: OCR API for wuwa.dev
---

# Wuthering OCR Space

FastAPI + PaddleOCR server for the unified Hugging Face Docker Space.

## Runtime Endpoints

- `GET /health?lang=kr`
- `GET /wake?lang=kr`
- `POST /ocr` with form-data `file` and `lang`

Supported `lang` values: `kr`, `en`, `jp`, `zh`.

## CI/CD

The repository workflow `.github/workflows/deploy-hf-ocr.yml` runs lightweight
tests for this folder, then uploads this directory to Hugging Face when `main`
passes. Deployment uses Hugging Face Trusted Publishers with GitHub OIDC.

Required GitHub settings:

- Actions variable `HF_SPACE_REPO_ID`: target Space repo id, for example `sharp/wuwa-ocr`.

The workflow deploys only this subdirectory:

```text
backend/paddle OCR
```

## Local Checks

```bash
python -m pip install -r requirements-ci.txt
python -m py_compile main.py ocr_config.py ocr_engine.py image_processing.py ocr_service.py
pytest
```
