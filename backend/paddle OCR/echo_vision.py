"""Bounded COST anchor search and conservative image evidence for echo panels."""
import json
from functools import lru_cache
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ASSETS = Path(__file__).parent / "vision_assets"


@lru_cache(maxsize=1)
def profiles():
    return json.loads((ASSETS / "profiles.json").read_text(encoding="utf-8"))


@lru_cache(maxsize=96)
def template(filename):
    return cv2.imread(str(ASSETS / filename), cv2.IMREAD_GRAYSCALE)


def locate_panel(image):
    w, h = image.size
    if min(w, h) < 60:
        return None
    # Full screens have the detail panel on the right; narrow crops are searched whole.
    compact = w / h < 1.22
    left, top = (0, 0) if compact else (int(w * 0.65), int(h * 0.07))
    bottom = h if compact else int(h * 0.55)
    roi = np.asarray(image.convert("L"))[top:bottom, left:w]
    scale = min(1.0, 720 / max(roi.shape))
    search = cv2.resize(roi, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    sx, sy = search.shape[1] / roi.shape[1], search.shape[0] / roi.shape[0]
    hits = []
    ratio = w / h
    expected = "panel" if compact else "fold" if ratio < 1.4 else "tablet" if ratio < 1.65 else "desktop-en" if ratio < 1.95 else "phone" if ratio < 2.25 else "wide"
    for profile in profiles():
        if profile["id"] != expected:
            continue
        base = template(profile["template"])
        for width in range(18, min(100, search.shape[1] // 3)):
            height = max(5, round(base.shape[0] * width / base.shape[1]))
            if height >= search.shape[0]:
                continue
            needle = cv2.resize(base, (width, height), interpolation=cv2.INTER_AREA)
            result = cv2.matchTemplate(search, needle, cv2.TM_CCOEFF_NORMED)
            _, score, _, point = cv2.minMaxLoc(result)
            if score < 0.64:
                continue
            x, y = left + point[0] / sx, top + point[1] / sy
            unit = width / sx
            row_y = [y + offset * unit for offset in profile["rows"]]
            x1, x2 = x + profile["left"] * unit, x + profile["right"] * unit
            if x2 > w + unit * 0.5 or row_y[-1] > h + unit * 0.15:
                continue
            hits.append((score, profile, x, y, unit, row_y, x1, x2))
    if not hits:
        return None
    hits.sort(key=lambda hit: hit[0], reverse=True)
    best = hits[0]
    # Multiple strong, spatially different anchors are ambiguous.
    if any(hit[0] > best[0] - 0.025 and abs(hit[3] - best[3]) > best[4] for hit in hits[1:]):
        return None
    score, profile, x, y, unit, row_y, x1, x2 = best
    half = profile["half_row"] * unit
    rows = [clamp_box((x1, cy - half, x2, cy + half), w, h) for cy in row_y]
    box = clamp_box((x1, y + profile["top"] * unit, x2, row_y[-1] + half), w, h)
    ix, iy, radius = profile["icon"]
    icon = clamp_box((x + (ix-radius)*unit, y + (iy-radius)*unit,
                      x + (ix+radius)*unit, y + (iy+radius)*unit), w, h)
    return {"profile": profile["id"], "language": profile["language"],
            "score": round(score, 4), "box": box, "rows": rows,
            "icon": icon, "anchor": [x, y, unit]}


def clamp_box(box, w, h):
    x1, y1, x2, y2 = box
    return [max(0, min(w - 1, int(x1))), max(0, min(h - 1, int(y1))),
            max(1, min(w, int(np.ceil(x2)))), max(1, min(h, int(np.ceil(y2))))]


def label_mask(image):
    rgb = np.asarray(image.convert("RGB"))
    low, high = rgb.min(axis=2), rgb.max(axis=2)
    mask = ((low > 130) & ((high.astype(int) - low) < 65)).astype(np.uint8) * 255
    ys, xs = np.where(mask > 0)
    if len(xs) < 12:
        return None
    mask = mask[ys.min():ys.max()+1, xs.min():xs.max()+1]
    return cv2.resize(mask, (160, 24), interpolation=cv2.INTER_AREA)


@lru_cache(maxsize=1)
def label_templates():
    entries = json.loads((ASSETS / "labels.json").read_text(encoding="utf-8"))
    output = []
    for entry in entries:
        with Image.open(ASSETS / entry["template"]) as image:
            mask = label_mask(image)
        if mask is not None:
            output.append((entry, mask))
    return output


def match_label(row, lang):
    # Exclude bullet/icon and the value column, matching the supplied label crops.
    w, h = row.size
    query = label_mask(row.crop((round(w * 0.10), 0, round(w * 0.72), h)))
    if query is None:
        return None
    scores = {}
    for entry, needle in label_templates():
        if entry["language"] != lang:
            continue
        score = float(cv2.matchTemplate(query, needle, cv2.TM_CCOEFF_NORMED)[0, 0])
        key = entry["statId"]
        scores[key] = max(scores.get(key, -1), score)
    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    if len(ranked) < 2 or ranked[0][1] < 0.75 or ranked[0][1] - ranked[1][1] < 0.08:
        return None
    return {"statId": ranked[0][0], "similarity": round(ranked[0][1], 4)}


@lru_cache(maxsize=1)
def harmony_templates():
    output = []
    for path in sorted((ASSETS / "harmony").glob("*.png")):
        with Image.open(path) as image:
            output.append((path.stem.split("-")[0], icon_mask(image)))
    return output


def icon_mask(image):
    rgba = np.asarray(image.convert("RGBA").resize((64, 64)))
    rgb = rgba[:, :, :3].astype(int)
    return ((rgb.min(axis=2) > 150) & (rgb.max(axis=2) - rgb.min(axis=2) < 65)
            & (rgba[:, :, 3] > 128)).astype(np.uint8) * 255


def match_harmony(image):
    if min(image.size) < 8:
        return None
    query = cv2.copyMakeBorder(icon_mask(image), 16, 16, 16, 16, cv2.BORDER_CONSTANT)
    scores = {}
    for key, base in harmony_templates():
        score = -1
        for size in range(44, 81, 4):
            needle = cv2.resize(base, (size, size), interpolation=cv2.INTER_AREA)
            if np.std(needle) < 1:
                continue
            score = max(score, float(cv2.minMaxLoc(cv2.matchTemplate(query, needle, cv2.TM_CCOEFF_NORMED))[1]))
        scores[key] = max(scores.get(key, -1), score)
    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    if len(ranked) < 2 or ranked[0][1] < 0.80 or ranked[0][1] - ranked[1][1] < 0.10:
        return None
    return {"setId": ranked[0][0], "similarity": round(ranked[0][1], 4)}


def make_atlas(image, layout):
    """Separate rows spatially so missing OCR lines cannot shift subsequent slots."""
    box = layout["box"]
    first = layout["rows"][0]
    header = image.crop((box[0], box[1], box[2], first[1]))
    crops = [header] + [image.crop(tuple(row)) for row in layout["rows"]]
    factor = min(4.0, max(1.0, 800 / max(crop.width for crop in crops)))
    scaled = [crop.resize((max(1, round(crop.width*factor)), max(1, round(crop.height*factor))), Image.Resampling.LANCZOS) for crop in crops]
    width = max(crop.width for crop in scaled) + 32
    atlas = Image.new("RGB", (width, sum(crop.height + 32 for crop in scaled)), (20, 24, 30))
    bands, y = [], 16
    for index, crop in enumerate(scaled):
        atlas.paste(crop, (16, y))
        bands.append({"index": index - 1, "top": y, "bottom": y + crop.height})
        y += crop.height + 32
    return atlas, bands
