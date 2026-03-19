from PIL import Image
from app.utils.draw import draw_rect
from app.utils.image import draw_image, draw_rect_topleft_round
from app.utils.text import draw_text


def draw_character_panel(
    base: Image.Image,
    character_data: dict,
    layout: dict
):
    stand_image_url = character_data.get("stand_image_url")
    
    draw_rect(
        base,
        rect=layout["image_shadow_1"],
        fill=(0,0,0)
    )

    draw_rect(
        base,
        rect=layout["image_shadow_2"],
        fill=(0,0,0)
    )

    draw_rect_topleft_round(
        base, 
        xy1=layout["image"], 
        xy2=layout["image_anchor"], 
        radius=layout["radius"], 
        border=((200, 200, 200), 5), 
        img_path=stand_image_url
    )

    icon_paths =  character_data.get("icon_image_urls")
    icon_rects = [layout["icon1"], layout["icon2"], layout["icon3"], layout["icon4"]]

    for i, path in enumerate(icon_paths):
        draw_image(base, path, icon_rects[i])

    draw_text(base,character_data.get("name"), layout["characer_name_text"], "kr", 51, anchor="rb", is_bold=True)