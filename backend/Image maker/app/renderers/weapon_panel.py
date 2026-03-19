from PIL import Image
from app.utils.draw import draw_rect
from app.utils.image import draw_image
from app.utils.text import draw_text


def draw_weapon_panel(
    base: Image.Image,
    weapon: dict,
    layout: dict
):
    draw_rect(base, layout["weapon_img"], (11, 11, 68), (255, 255, 255))

    draw_text(base, weapon.get("name"), layout["weapon_name_text"], "kr", 30, is_bold=True)

    draw_image(base, weapon.get("weapon_image_path"),layout["weapon_img"])

    draw_image(base, weapon.get("stat_icon_paths")[0],layout["weapon_icon"][0])
    draw_image(base, weapon.get("stat_icon_paths")[1],layout["weapon_icon"][1])

    draw_text(base, weapon.get("stat_values")[0], layout["weapon_texts"][0], "num", 36, is_bold=True, anchor="rm")
    draw_text(base, weapon.get("stat_values")[1], layout["weapon_texts"][1], "num", 36, is_bold=True, anchor="rm")
