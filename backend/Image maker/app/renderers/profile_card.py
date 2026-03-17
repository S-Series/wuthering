from io import BytesIO
from PIL import Image

from app.core.constants import CANVAS_WIDTH, CANVAS_HEIGHT, BG_IMAGE_PATH


def render_profile_card(payload: dict) -> bytes:
    base = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), (0, 0, 0, 0))

    bg = Image.open(BG_IMAGE_PATH).convert("RGBA")
    bg = bg.resize((CANVAS_WIDTH, CANVAS_HEIGHT))

    base.alpha_composite(bg, (0, 0))

    buffer = BytesIO()
    base.save(buffer, format="PNG")

    return buffer.getvalue()