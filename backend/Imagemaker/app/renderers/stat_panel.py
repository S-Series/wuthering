from PIL import Image, ImageFont
from app.utils.draw import draw_rect, draw_rounded_rect
from app.utils.image import draw_image, draw_icon
from app.utils.text import draw_text, get_text_size


def draw_stat_panel(
    base: Image.Image,
    stat: dict,
    layout: dict
):
    paths = stat.get("stat_icon_paths")
    names = stat.get("statName")
    values = stat.get("statValue")
    adds = stat.get("additionalValue")

    for i in [0,1,2,3,4,5,6,7]:
        draw_rect(base, (710, 230 + 64 * i, 580 , 50), (255,255,255,25))
        draw_icon(base, paths[i], (720,233 + 64 * i, 44, 44))
        draw_text(base, names[i], (775, 256 + 64 * i), stat.get("lang"), 28, anchor="lm", is_bold=True)
        draw_text(base, values[i], (1160, 256 + 64 * i), "num", 28, anchor="rm")
        draw_text(base, "+" + adds[i], (1180, 258 + 64 * i), "num", 20, anchor="lm", color=(255, 170, 0))

    harmony_items = stat.get("harmony_items", [])
    center_x = 1000
    start_y = 765
    row_gap = 60

    box_h = 44
    box_pad_x = 9

    icon_size = 36
    icon_offset_x = -3
    icon_half = 18

    text_gap_x = 3
    text_half_gap = 18

    font_lang = stat.get("lang")
    font_size = 28
    is_bold = True

    if len(harmony_items) == 1:
        item = harmony_items[0]
        start_y = start_y + int(row_gap / 2)
        text = item.get("text", "")
        icon_path = item.get("icon_path")

        text_w, text_h = get_text_size(font_lang, text, font_size, is_bold)

        box_x = int(center_x - text_w / 2 - text_half_gap - box_pad_x)
        box_y = int(start_y - box_h / 2)
        box_w = int(text_w + icon_size + text_half_gap)
        box_h_int = int(box_h)

        icon_x = int(center_x - text_w / 2 - icon_half) + icon_offset_x
        icon_y = int(start_y - icon_size / 2)

        text_x = int(center_x + text_w / 2 + text_half_gap + text_gap_x)
        text_y = int(start_y)

        draw_rect(
            base,
            (box_x, box_y, box_w, box_h_int),
            (255, 255, 255, 30)
        )

        draw_image(
            base,
            icon_path,
            (icon_x, icon_y, icon_size, icon_size)
        )

        draw_text(
            base,
            text,
            (text_x, text_y),
            font_lang,
            font_size,
            anchor="rm",
            is_bold=is_bold
        )
        
    elif len(harmony_items) == 2:
        for idx, item in enumerate(harmony_items[:2]):
            text = item.get("text", "")
            icon_path = item.get("icon_path")

            text_w, text_h = get_text_size(font_lang, text, font_size, is_bold)
            cy = start_y + row_gap * idx

            box_x = int(center_x - text_w / 2 - text_half_gap - box_pad_x)
            box_y = int(cy - box_h / 2)
            box_w = int(text_w + icon_size + text_half_gap)
            box_h_int = int(box_h)

            icon_x = int(center_x - text_w / 2 - icon_half) + icon_offset_x
            icon_y = int(cy - icon_size / 2)

            text_x = int(center_x + text_w / 2 + text_half_gap + text_gap_x)
            text_y = int(cy)

            draw_rect(
                base,
                (box_x, box_y, box_w, box_h_int),
                (255, 255, 255, 30)
            )

            draw_image(
                base,
                icon_path,
                (icon_x, icon_y, icon_size, icon_size)
            )

            draw_text(
                base,
                text,
                (text_x, text_y),
                font_lang,
                font_size,
                anchor="rm",
                is_bold=is_bold
            )

    draw_text(base, "Cv. 168.0pt", (870, 865), "en", 36, anchor="ma", is_bold=True)
    draw_text(base, "Tv. 273.9pt", (1130, 865), "en", 36, anchor="ma", is_bold=True)
