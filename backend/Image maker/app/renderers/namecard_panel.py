from PIL import Image
from app.utils.draw import draw_rect
from app.utils.image import draw_image, draw_rect_topleft_round
from app.utils.text import draw_text


def draw_namecard_panel(
    base: Image.Image,
    namecard: dict,
    layout: dict
):
    draw_image(base, namecard.get("image_path"), layout["namecard_box"])
    draw_rect(base, layout["namecard_box"], (0,0,0,0), (255,255,255), 2)

    #draw_rect(base, layout["rank_icon"], (0,0,0,0), (255,255,255), 2)
    draw_image(base, namecard.get("rank_icon_path"), layout["rank_icon"])
    draw_text(base, namecard.get("score_text"), layout["rank_text"], namecard.get("lang"), 34, anchor="mb", is_bold=True)