# Hybrid OCR implementation handoff

Status: historical proposal and superseded server prototype.
Current implementation: [Browser preprocessing](ocr-client-pipeline.md).
The browser now owns cropping; the server does not detect or recrop panels.
Reference: ChatGPT conversation 6aa38077-a484-83e9-b605-3ea59964ba8e.
Templates were extracted from the supplied desktop, Fold, phone, tablet and panel screenshots.

## Implemented on 2026-09-13

- `echo_vision.py` searches for COST in a bounded image, restoring original coordinates and scale. Aspect ratio selects a reference layout; unknown layouts retain whole-image OCR fallback.
- The header and seven original-resolution rows are placed into one OCR atlas with gaps. Row indexes survive missing detections, preventing subsequent options from shifting.
- `ocr_service.py` returns optional versioned image evidence and OCR confidence, retaining legacy response fields. It runs CPU work in a thread pool and serializes inference.
- `ocr.vision.ts` resolves text/image evidence against known stats and permitted substat values. Conflicting evidence and uncertain numeric text remain empty. Percent markers distinguish flat and percentage stats.
- Harmony suggestions use existing icons plus two screenshot variants, and are checked against recognized echo compatibility. Ambiguous icons remain unselected.
- The old parser no longer discards every string containing `25`, and numeric parsing preserves decimal points.

Matching currently runs in the existing Python/OpenCV service, not a browser worker.
Original images are still uploaded; client-side bandwidth reduction is not implemented.
PaddleOCR still runs detection and recognition, not recognition-only inference.

Deploy both the frontend and `backend/paddle OCR`, including `vision_assets`, to activate
the complete flow. The gateway forwards these optional fields unchanged; existing cached
responses remain compatible. No remote deployment was performed.

Validation: run `python -m unittest test_echo_vision -v` in the OCR directory and
`node scripts/test-ocr-vision.mjs` in the frontend. Geometry checks cover all 12 supplied
images plus an enlarged panel. Local screenshot checks skip explicitly if files are absent.
`python preview_vision.py` writes a montage to the OS temp directory. Asset generation
uses `build_vision_assets.py`; runtime does not require the original screenshots.
Only small templates are bundled, not full screenshots or UIDs.

PaddleOCR is not installed locally, so end-to-end OCR accuracy has not been measured.
Some references also supply templates: their scores are not held-out accuracy.
The thresholds are conservative initial values, and small/background-obscured labels
and some harmony icons can remain unresolved. Unknown UI versions and other languages
need separate samples and validation.

The sections below preserve the original proposal and pre-implementation observations.

## Current integration points

- `frontend/src/components/features/Card/OcrImageInput.tsx` submits the image and applies parsed results.
- `frontend/src/api/ocr.api.ts` sends a file and language; its response currently has text strings but no region coordinates or confidence.
- `frontend/src/api/ocr.api.helper.ts` corrects text, groups rows, fuzzy-matches labels, and parses values.
- `backend/paddle OCR/ocr_service.py` receives PaddleOCR regions but `extract_texts` discards coordinates and confidence.

## Proposed pipeline

1. Decode the uploaded image and select a normalized search region using a sample-validated layout profile. Keep a fallback for cropped or unknown layouts.
2. Downscale only that region for anchor search. A 600-pixel longest edge is an initial benchmark parameter, not a validated accuracy threshold.
3. Find a stable UI anchor at bounded candidate scales, then refine its location in a small original-resolution neighborhood.
4. Restore coordinates using `originalX = cropX + searchX / scaleX` and the equivalent Y formula. Use actual resized dimensions to account for rounding. Clamp all crops to image bounds.
5. Extract text, numeric values, and harmony icons from original-resolution regions. Match icons locally and send the required text regions to OCR with stable row identifiers.
6. Combine matching candidates, OCR text and confidence, valid stat/value pairs, echo cost, and allowed harmony sets. Preserve uncertainty and allow manual correction.

## Decisions requiring real samples

- Search bounds and anchor-relative offsets for full screenshots, cropped panels, UI scales, and aspect ratios.
- Templates for anchors, harmony icons, and localized stat labels. Website icons alone are not validated game screenshot templates.
- Acceptance thresholds and the margin between the first and second candidates.
- OCR-only versus matching-assisted accuracy on the same held-out samples.

Do not treat template similarity and OCR confidence as calibrated probabilities.
The conversation's 0.65/0.35 weighted average is an illustrative formula, not a production setting.
Disagreeing or weak evidence should leave a field unresolved instead of forcing a candidate.
Flat and percentage stats must also use the numeric percent marker and allowed value ranges.

## Implementation order after assets arrive

1. Assemble labeled fixtures including first/fifth-row failures, dark backgrounds, different resolutions, UI scales, languages, and cropped inputs.
2. Add optional OCR regions with coordinates and confidence while retaining existing response fields. Document coordinates relative to server preprocessing and preserve stable row IDs.
3. Validate anchor detection and crop geometry offline against fixtures before connecting the upload flow.
4. Run matching in a worker with bounded work and cancellation. Close image bitmaps, revoke object URLs, bound template caches, and ignore stale results.
5. Add conservative evidence resolution and preserve the existing OCR/manual workflow when templates, browser support, or confident anchors are unavailable.
6. Measure end-to-end latency, UI responsiveness, peak memory, and per-field accuracy on desktop and mobile before enabling it by default.

Cropping alone does not make the current server recognition-only: it still calls `ocr(..., cls=True)` with detection enabled. Any recognition-only or batch-region API must be implemented and measured separately.
Downscaling bounds matching work, but does not remove full-image decoding and memory costs.

## Existing parsing risks to cover with fixtures

- The substring filter removes every text containing `+` or `25`, including potential legitimate values.
- Percent parsing strips punctuation then divides by ten, so integer percentages and multiple decimal places can be misread.
- Fuzzy matching currently takes the first candidate without exposing ambiguity to the caller.

These require representative input/output fixtures before a broader parsing change.
