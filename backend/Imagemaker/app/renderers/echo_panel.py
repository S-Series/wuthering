from PIL import Image
from app.utils.draw import draw_rect, draw_line
from app.utils.image import draw_contain_image, draw_image, draw_icon
from app.utils.text import draw_text

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")

    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)

    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def draw_echo_panel(
    base: Image.Image,
    echoes: list[dict],
    layout: dict
):
    for i in [0,1,2,3,4]:
        echo_data = echoes[i]

        i_gap = 162
        draw_rect(base, (1320 + i_gap * i, 305, 152, 620), (0,0,0,0), (255,255,255), 1)

        draw_rect(base, (1330 + i_gap * i, 315, 132, 132), (255,255,255,50), (255,255,255), 1)
        draw_image(base, echo_data.get("image"), (1331 + i_gap * i, 316, 130, 130))

        draw_line(base, (1320 + i_gap * i, 457), (1472 + i_gap * i, 457), (255,255,255))
        draw_image(base, echo_data.get("harmony_image"), (1376 + i_gap * i, 437, 40, 40))

        draw_line(base, (1330 + i_gap * i, 564), (1462 + i_gap * i, 564), (255,255,255), 2)

        j_gap = 45
        for j, stat in enumerate(echo_data["stats"]):
            draw_icon(base, stat.get("path"), (1330 + i_gap * i, 477 + j_gap * j + (13 if j > 1 else 0), 30, 30))
            draw_text(
                base, 
                stat.get("value"), 
                (1462 + i_gap * i, 477 + 15 + j_gap * j + (13 if j > 1 else 0)), 
                "num", 
                font_size=28,
                color=hex_to_rgb(stat.get("color")),
                anchor="rm"
            )

        draw_line(base, (1330 + i_gap * i, 795), (1462 + i_gap * i, 795), (255,255,255), 2)

        #draw_rect(base, (1320 + i_gap * i, 810, 152, 60), (0,0,0,0), (255,0,0))
        draw_contain_image(
            base,
            echo_data.get("rank_image"),
            (1354 + i_gap * i, 795, 84, 84),
            glow_color=(255, 225, 120),
            glow_radius=4,
            glow_opacity=0.2,
        )

        draw_text(base, "Cv.", (1335 + i_gap * i, 873), "en", 21, anchor="la")
        draw_text(base, echo_data.get("scores")[0], (1462 + i_gap * i, 873), "en", 21, anchor="ra")

        draw_text(base, "Tv.", (1335 + i_gap * i, 895), "en", 21, anchor="la")
        draw_text(base, echo_data.get("scores")[1], (1462 + i_gap * i, 895), "en", 21, anchor="ra")
