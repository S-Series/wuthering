from PIL import Image
from app.utils.draw import draw_rect
from app.utils.image import draw_image, draw_icon
from app.utils.text import draw_text, get_text_size


def _truncate_text_from_right(text, lang, font_size, is_bold, max_width):
    if get_text_size(lang, text, font_size, is_bold)[0] <= max_width:
        return text

    ellipsis = "…"
    for end in range(len(text), 0, -1):
        candidate = text[:end] + ellipsis
        if get_text_size(lang, candidate, font_size, is_bold)[0] <= max_width:
            return candidate

    return ellipsis


def _draw_harmony_item(
    base,
    item,
    center_x,
    center_y,
    font_lang,
    font_size,
    is_bold,
    *,
    box_h,
    box_pad_x,
    icon_size,
    icon_offset_x,
    text_gap_x,
    text_half_gap,
    max_width=None,
    align="center",
):
    name = item.get("name")
    count = item.get("count")
    text = item.get("text", "")
    icon_path = item.get("icon_path")

    if name is None or count is None:
        name = text
        count_text = ""
    else:
        count_text = f"[{count}]"

    count_w = get_text_size("num", count_text, font_size, is_bold)[0] if count_text else 0
    full_name_w = get_text_size(font_lang, name, font_size, is_bold)[0]
    content_w = icon_size + text_half_gap + full_name_w + count_w
    box_w = content_w + box_pad_x * 2

    if max_width is not None and box_w > max_width:
        max_name_w = max(1, max_width - box_pad_x * 2 - icon_size - text_half_gap - count_w)
        name = _truncate_text_from_right(name, font_lang, font_size, is_bold, max_name_w)
        full_name_w = get_text_size(font_lang, name, font_size, is_bold)[0]
        content_w = icon_size + text_half_gap + full_name_w + count_w
        box_w = min(max_width, content_w + box_pad_x * 2)

    if align == "left":
        box_x = int(center_x)
    elif align == "right":
        box_x = int(center_x - box_w)
    else:
        box_x = int(center_x - box_w / 2)

    box_y = int(center_y - box_h / 2)
    icon_x = int(box_x + box_pad_x + icon_offset_x)
    icon_y = int(center_y - icon_size / 2)
    text_x = int(icon_x + icon_size + text_half_gap + text_gap_x)
    count_x = int(text_x + full_name_w + text_gap_x)
    text_y = int(center_y)

    draw_rect(
        base,
        (box_x, box_y, int(box_w), int(box_h)),
        (255, 255, 255, 30)
    )
    draw_image(base, icon_path, (icon_x, icon_y, icon_size, icon_size))

    draw_text(
        base,
        name,
        (text_x, text_y),
        font_lang,
        font_size,
        anchor="lm",
        is_bold=is_bold
    )

    if count_text:
        draw_text(
            base,
            count_text,
            (count_x, text_y),
            "num",
            font_size,
            anchor="lm",
            is_bold=is_bold
        )


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

    text_gap_x = 3
    text_half_gap = 18

    font_lang = stat.get("lang")
    font_size = 28
    is_bold = True

    if len(harmony_items) >= 3:
        sorted_items = sorted(
            harmony_items[:3],
            key=lambda item: 0 if item.get("id") == "Adam" else 1
        )
        primary = sorted_items[0]
        sub_items = sorted_items[1:3]

        _draw_harmony_item(
            base,
            primary,
            center_x,
            start_y,
            font_lang,
            font_size,
            is_bold,
            box_h=box_h,
            box_pad_x=box_pad_x,
            icon_size=icon_size,
            icon_offset_x=icon_offset_x,
            text_gap_x=text_gap_x,
            text_half_gap=text_half_gap,
            max_width=522,
            align="center",
        )

        sub_row_w = 522
        sub_item_max_w = 258
        sub_y = start_y + row_gap
        sub_left = center_x - sub_row_w / 2
        sub_right = center_x + sub_row_w / 2

        _draw_harmony_item(
            base,
            sub_items[0],
            sub_left,
            sub_y,
            font_lang,
            font_size,
            is_bold,
            box_h=box_h,
            box_pad_x=box_pad_x,
            icon_size=icon_size,
            icon_offset_x=icon_offset_x,
            text_gap_x=text_gap_x,
            text_half_gap=text_half_gap,
            max_width=sub_item_max_w,
            align="left",
        )
        _draw_harmony_item(
            base,
            sub_items[1],
            sub_right,
            sub_y,
            font_lang,
            font_size,
            is_bold,
            box_h=box_h,
            box_pad_x=box_pad_x,
            icon_size=icon_size,
            icon_offset_x=icon_offset_x,
            text_gap_x=text_gap_x,
            text_half_gap=text_half_gap,
            max_width=sub_item_max_w,
            align="right",
        )

    elif len(harmony_items) == 1:
        item = harmony_items[0]
        start_y = start_y + int(row_gap / 2)
        _draw_harmony_item(
            base,
            item,
            center_x,
            start_y,
            font_lang,
            font_size,
            is_bold,
            box_h=box_h,
            box_pad_x=box_pad_x,
            icon_size=icon_size,
            icon_offset_x=icon_offset_x,
            text_gap_x=text_gap_x,
            text_half_gap=text_half_gap,
            align="center",
        )
        
    elif len(harmony_items) == 2:
        for idx, item in enumerate(harmony_items[:2]):
            cy = start_y + row_gap * idx
            _draw_harmony_item(
                base,
                item,
                center_x,
                cy,
                font_lang,
                font_size,
                is_bold,
                box_h=box_h,
                box_pad_x=box_pad_x,
                icon_size=icon_size,
                icon_offset_x=icon_offset_x,
                text_gap_x=text_gap_x,
                text_half_gap=text_half_gap,
                align="center",
            )

    cv, av = stat.get("score")
    draw_text(base, f"Cv. {cv}pt", (870, 865), "en", 36, anchor="ma", is_bold=True)
    draw_text(base, f"Tv. {av}pt", (1130, 865), "en", 36, anchor="ma", is_bold=True)
