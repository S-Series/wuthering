from io import BytesIO
from PIL import Image

from app.core.constants import CANVAS_WIDTH, CANVAS_HEIGHT, BG_IMAGE_PATH
from app.core.layout import DEFAULT_LAYOUT
from app.utils.draw import draw_rect
from app.utils.text import draw_text
from app.utils.image import draw_image, paste_image

from app.renderers.character_panel import draw_character_panel
from app.renderers.user_panel import draw_user_panel
from app.renderers.weapon_panel import draw_weapon_panel
from app.renderers.stat_panel import draw_stat_panel
from app.renderers.namecard_panel import draw_namecard_panel
from app.renderers.echo_panel import draw_echo_panel


def render_profile_card(payload: dict) -> bytes:
    base = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), (0, 0, 0, 0))
    paste_image(base, BG_IMAGE_PATH, (0, 0, CANVAS_WIDTH, CANVAS_HEIGHT))

    layout = DEFAULT_LAYOUT

    draw_rect(base, (700, 75, 600, 140), (255, 255, 255, 40))
    draw_rect(base, (700, 215, 600, 710), (0, 0, 0, 70))
    draw_rect(base, (1320, 75, 800, 216), (255, 255, 255, 40))

    draw_text(base, "Unofficial Fan Project: All assets © Kuro Games", (1321, 44), "en", 22.5, color=(255, 255, 255, 180))
    draw_text(base, "WuWa.dev © 2025", (2120, 44), "en", 22.5, anchor="rt", color=(255, 255, 255, 180))
    draw_text(base, "Powered by. SSeries", (2120, 15), "en", 18.5, anchor="rt", color=(255, 255, 255, 180))
    
    draw_image(base, f"./assets/link.png", (1905, 44, 20, 20))
    draw_rect(base, (1930, 63, 105, 1.5), (255, 255, 255, 100))


    # print("[profile_card] character payload:", payload.get("character"))

    draw_character_panel(
        base,
        payload.get("character", {}),
        layout["character"]
    )

    draw_user_panel(
        base,
        payload.get("user", {}),
        layout["user"]
    )

    draw_weapon_panel(
        base,
        payload.get("weapon", {}),
        layout["weapon"]
    )

    draw_stat_panel(
        base,
        payload.get("stats", {}),
        layout["stats"]
    )

    draw_namecard_panel(
        base,
        payload.get("namecard", {}),
        layout["namecard"]
    )

    draw_echo_panel(
        base,
        payload.get("echoes", []),
        layout["echoes"]
    )

    buffer = BytesIO()
    base.save(buffer, format="PNG")
    return buffer.getvalue()