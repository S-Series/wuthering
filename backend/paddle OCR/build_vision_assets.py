"""Build small, UID-free templates from explicitly supplied local screenshots."""
import json
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).parent
TEMP = Path("C:/Users/inwea/AppData/Local/Temp")
RECORD = Path("D:/_Record/Wuthering Waves")

# Coordinates use the displayed reference size and are restored to source pixels.
PROFILES = [
    ("wide", RECORD / "Wuthering Waves Screenshot 2026.09.12 - 21.54.42.32.png", (2048, 864), (1718, 154, 1763, 169), 1997, [199, 228, 258, 286, 314, 342, 370], (1985, 130, 10)),
    ("fold", TEMP / "codex-clipboard-0d40687c-e45e-4703-88a0-4bdc79959a30.png", (1822, 1376), (1327, 193, 1395, 214), 1738, [259, 301, 346, 388, 428, 469, 511], (1721, 157, 15)),
    ("phone", TEMP / "codex-clipboard-41703f31-e0b6-4b6c-b1c5-fc6338080040.png", (2048, 945), (1535, 178, 1598, 198), 1919, [240, 280, 320, 358, 396, 435, 474], (1900, 145, 14)),
    ("desktop-en", TEMP / "codex-clipboard-4ab2563e-f89b-4be5-b962-c3fb72c4f5a3.png", (1920, 1080), (1438, 184, 1499, 204), 1829, [254, 290, 330, 363, 396, 429, 462], (1811, 167, 17)),
    ("tablet", TEMP / "codex-clipboard-19c68921-4f1c-4ce5-b615-a15877143956.png", (1904, 1312), (1389, 203, 1454, 224), 1819, [272, 317, 362, 407, 450, 493, 537], (1798, 164, 16)),
    ("panel", TEMP / "codex-clipboard-360fdcfa-1bf2-4340-9a31-1fe283e25c67.png", (205, 190), (8, 28, 37, 37), 200, [58, 77, 98, 117, 136, 155, 175], (188, 11, 7)),
]


def build():
    target = ROOT / "vision_assets"
    target.mkdir(exist_ok=True)
    profiles = []
    for name, path, display, anchor, right, rows, icon in PROFILES:
        with Image.open(path) as source:
            sx, sy = source.width / display[0], source.height / display[1]
            x, y, r, b = anchor
            source.crop(tuple(round(v * (sx if i % 2 == 0 else sy)) for i, v in enumerate(anchor))).convert("RGB").save(target / f"{name}.png")
        unit = r - x
        profiles.append({
            "id": name, "template": f"{name}.png",
            "left": -0.15, "right": (right - x) / unit,
            "top": -2.0 if name == "panel" else -1.0,
            "rows": [(v - y) / unit for v in rows],
            "half_row": (rows[-1] - rows[-2]) * 0.46 / unit,
            "icon": [(icon[0] - x) / unit, (icon[1] - y) / unit, icon[2] / unit],
            "language": "en" if name == "desktop-en" else "kr",
        })
    (target / "profiles.json").write_text(json.dumps(profiles, indent=2), encoding="utf-8")

    # Label templates omit the leading bullet and the numeric column.
    labels = []
    examples = [
        ("21.54.42.32", ["critRate", "liberationBns", "critDmg", "resonanceBns", "def"]),
        ("21.52.55.92", ["atk", "critRate", "resonanceBns", "basicBns", "liberationBns"]),
        ("21.52.28.00", ["resonanceBns", "atk", "hp", "atk", "def"]),
        ("21.52.03.23", ["critDmg", "atk", "skillBns", "critRate", "def"]),
        ("21.51.54.78", ["critRate", "critDmg", "skillBns", "heavyBns", "resonanceBns"]),
    ]
    for stamp, ids in examples:
        with Image.open(RECORD / f"Wuthering Waves Screenshot 2026.09.12 - {stamp}.png") as source:
            for index, stat in enumerate(ids):
                cy = [258, 286, 314, 342, 370][index]
                box = (1744, cy - 11, 1919, cy + 11)
                box = tuple(round(v * 1.25) for v in box)
                filename = f"label-{len(labels)}.png"
                source.crop(box).convert("RGB").save(target / filename)
                labels.append({"statId": stat, "template": filename, "language": "kr"})
    extra_labels = {
        "fold": ["skillBns", "atk", "critDmg", "critRate", "def"],
        "desktop-en": ["atk", "critDmg", "critRate", "atk", "skillBns"],
    }
    for name, path, display, anchor, right, rows, _ in PROFILES:
        if name not in extra_labels:
            continue
        with Image.open(path) as source:
            sx, sy = source.width / display[0], source.height / display[1]
            left = anchor[0] - (anchor[2] - anchor[0]) * 0.15
            width = right - left
            half = (rows[-1] - rows[-2]) * 0.46
            for index, stat in enumerate(extra_labels[name]):
                cy = rows[index + 2]
                box = (round((left + width * 0.10) * sx), round((cy-half) * sy),
                       round((left + width * 0.72) * sx), round((cy+half) * sy))
                filename = f"label-{len(labels)}.png"
                source.crop(box).convert("RGB").save(target / filename)
                labels.append({"statId": stat, "template": filename, "language": "en" if name == "desktop-en" else "kr"})
    (target / "labels.json").write_text(json.dumps(labels, indent=2), encoding="utf-8")
    # Copy the existing harmony images; the OCR container is deployed separately.
    harmony_dir = target / "harmony"
    harmony_dir.mkdir(exist_ok=True)
    for path in (ROOT.parents[1] / "frontend/public/ico/harmony").glob("*.png"):
        with Image.open(path) as source:
            source.save(harmony_dir / path.name)
    for name, path, display, _, _, _, icon in PROFILES:
        if name not in ("wide", "fold"):
            continue
        with Image.open(path) as source:
            sx, sy = source.width / display[0], source.height / display[1]
            x, y, r = icon
            source.crop((round((x-r)*sx), round((y-r)*sy), round((x+r)*sx), round((y+r)*sy))).save(
                harmony_dir / ("Dream-reference.png" if name == "wide" else "Memories-reference.png"))
    browser = ROOT.parents[1] / "frontend/public/ocr"
    browser.mkdir(exist_ok=True)
    for filename in ["profiles.json"] + [p["template"] for p in profiles]:
        shutil.copyfile(target / filename, browser / filename)


if __name__ == "__main__":
    build()
