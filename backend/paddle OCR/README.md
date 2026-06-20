# Wuthering OCR Space

FastAPI + PaddleOCR server for the unified Hugging Face Docker Space.

## Runtime Endpoints

- `GET /health?lang=kr`
- `GET /wake?lang=kr`
- `POST /ocr` with form-data `file` and `lang`

Supported `lang` values: `kr`, `en`, `jp`, `zh`.

## CI/CD

The repository workflow `.github/workflows/deploy-hf-ocr.yml` runs lightweight
tests for this folder, then syncs this directory to Hugging Face when `main`
passes.

Required GitHub settings:

- Actions secret `HF_TOKEN`: Hugging Face token with write access to the target Space.
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
