# Browser preprocessing for echo OCR

## Current flow

1. `OcrImageInput` starts `prepareOcrImage` before making an OCR request.
2. A disposable classic Web Worker loads pinned OpenCV.js 4.11 on demand. It searches
   a bounded grayscale region for COST using the supplied screenshot templates.
3. Aspect ratio selects the reference geometry, and detected COST position/scale
   restores original-image coordinates. Full screenshots and cropped panels are supported.
4. The browser extracts the header, two main rows and five substat rows. It arranges
   those regions with gaps in a PNG and sends that image plus versioned band metadata.
5. The Railway gateway forwards the metadata and includes it in its OCR cache key.
6. The Python service validates dimensions/bands, performs OCR on the image as received,
   and assigns text/confidence to the supplied row numbers. It does not locate or crop
   a panel. Small band/icon reads for image comparison do not change the OCR input.
7. The frontend combines image/text evidence, validates possible substat values and
   echo/harmony compatibility, and populates the editable result. Missing rows keep
   their positions. Conflicting evidence stays unresolved.

No full screenshot is sent if preprocessing fails. The UI requests a cropped panel
or displays a processing error. Worker termination handles success, error, timeout,
new uploads and component unmount; OpenCV matrices and image bitmaps are released.
Unknown browsers lacking workers/OffscreenCanvas receive an explicit error.

## Assets and cost

`frontend/public/ocr` contains the worker and small COST templates. OpenCV is a
separate emitted asset, loaded only when OCR is requested, not parsed on the UI
thread. Its uncompressed size is about 11.4 MB; first-use network latency and actual
mobile memory/performance still need device testing. See the library's
[usage documentation](https://github.com/TechStark/opencv-js).

`backend/paddle OCR/vision_assets` supplies label/harmony comparison templates.
`build_vision_assets.py` regenerates the templates from the supplied local sources.
The Python COST detector is retained only as an offline reference for geometry
tests; it is not called by the server request path. No full screenshots or UIDs are
included in the generated runtime assets.

## Validation and deployment

- `node scripts/test-ocr-browser.mjs` in the frontend runs 12 real screenshots through
  a headless Edge worker and tests cancellation. It needs Playwright and the local
  reference files. Results are written to the OS temp directory.
- `node scripts/test-ocr-vision.mjs` verifies Korean/English parsing, percentages,
  missing rows, numeric confidence, invalid values and conflicting evidence.
- `python -m unittest test_echo_vision test_ocr_service_contract -v` in the OCR
  directory validates geometry, missing-row response assembly and metadata rejection.
  The service contract test uses a fake predictor, not a real OCR model.

Observed on the development PC: about 0.5-1.3 seconds per browser preprocessing
operation. Full screenshots produced roughly 0.5-0.65 MB PNGs. The tiny 205x190 panel
grows due to upscaling for recognition. These are local measurements, not mobile or
network performance guarantees. Some templates use the same references being tested;
this is geometry validation, not held-out recognition accuracy.

Deploy the Python OCR service and Railway gateway before the frontend. All three
have changes. Existing legacy requests remain accepted but are no longer auto-cropped
server-side. No remote deployment has been performed. PaddleOCR is not installed in
the local environment, so real model accuracy still needs end-to-end validation.
