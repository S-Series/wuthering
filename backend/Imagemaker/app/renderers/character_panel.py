from PIL import Image
from app.utils.draw import draw_rect
from app.utils.image import draw_icon, draw_rect_topleft_round
from app.utils.text import draw_text


def adjust_rect(rect, dx=0, dy=0, dw=0, dh=0):
    x, y, w, h = rect
    return (x + dx, y + dy, w + dw, h + dh)


def draw_character_panel(
    base: Image.Image,
    character_data: dict,
    layout: dict
):
    stand_image_url = character_data.get("stand_image_url")
    overlay_image_url = character_data.get("overlay_image_url")
    
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

    draw_rect_topleft_round(
        base, 
        xy1=layout["constell_image"], 
        xy2=layout["image_anchor"], 
        radius=layout["radius"], 
        img_path=overlay_image_url
    )


    constell = character_data.get("constell", 0)
    constell_icon_paths = character_data.get("constell_icon_urls")
    constell_icon_rects = layout["constell_icons"]
    for i, path in enumerate(constell_icon_paths):
        rect = constell_icon_rects[i]
        opacity = 0.4

        if i + 1 <= constell:
            rect = adjust_rect(rect, -8, -8, +16, +16)
            opacity = 1

        draw_icon(base, path, rect, opacity=opacity)


    icon_paths =  character_data.get("icon_image_urls")
    icon_rects = [layout["icon1"], layout["icon2"], layout["icon3"], layout["icon4"]]

    for i, path in enumerate(icon_paths):
        draw_icon(base, path, icon_rects[i])

    draw_text(base,character_data.get("name"), layout["characer_name_text"], character_data.get("lang"), 51, anchor="rb", is_bold=True)