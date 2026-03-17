from PIL import Image
from app.utils.image import paste_image


def draw_character_panel(
    base: Image.Image,
    character_data: dict,
    layout: dict
):
    image_path = character_data.get("image_path")
    if not image_path:
        return

    paste_image(base, image_path, layout["image"])