"""Write local visual QA outside the repository, without copying full screenshots."""
from pathlib import Path
import tempfile

from PIL import Image, ImageDraw
from build_vision_assets import PROFILES
from echo_vision import locate_panel, make_atlas


if __name__ == "__main__":
    canvas = Image.new("RGB", (1800, 1200), "#11151b")
    draw = ImageDraw.Draw(canvas)
    for index, (name, path, *_) in enumerate(PROFILES):
        with Image.open(path) as source:
            layout = locate_panel(source)
            atlas, _ = make_atlas(source, layout)
            atlas.thumbnail((570, 545))
        x, y = (index % 3) * 600, (index // 3) * 600
        draw.text((x + 15, y + 10), name, fill="white")
        canvas.paste(atlas, (x + 15, y + 40))
    output = Path(tempfile.gettempdir()) / "wuthering-ocr-regions.jpg"
    canvas.save(output)
    print(output)
