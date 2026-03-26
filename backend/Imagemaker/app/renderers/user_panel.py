from PIL import Image
from app.utils.image import draw_image
from app.utils.text import draw_text


def draw_user_panel(
    base: Image.Image,
    user: dict,
    layout: dict
):
    font_size = 22

    draw_text(
        base=base, 
        text=user.get("server_text"),
        xy=layout["server_text"], 
        lang="en", 
        font_size=font_size,
        is_bold=True,
    )
    draw_text(
        base=base,
        text=user.get("name_text"),
        xy=layout["name_text"], 
        lang="en", 
        font_size=font_size,
        is_bold=True,
    )
    draw_text(
        base=base,
        text=user.get("uid_text"),
        xy=layout["uid_text"],
        lang="en",
        font_size=font_size,
        is_bold=True,
    )
    