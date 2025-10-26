
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw, ImageFont, ImageChops
from io import BytesIO

import os, math, json, uvicorn, requests
import numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

KR_FONT_PATH = "./fonts/SUITE-Medium.ttf"
EN_FONT_PATH = "./fonts/en.ttf"
JP_FONT_PATH = "./fonts/en.ttf"
ZH_FONT_PATH = "./fonts/en.ttf"
NUM_FONT_PATH = "./fonts/Roboto-Medium.ttf"

UI_COLOR = [
    (51,51,102,255),
    (11,11,68,255),
    (102,102,153,255),
    (11,11,136,255),
]

# --------------------------------------------------------

def image_process(img_path, x, y, a, w, h):
    target_img = Image.open(img_path)
    cropped = target_img.crop((x, y, x + (w / a), y + (h / a)))
    resized = cropped.resize((w, h), Image.LANCZOS)
    return resized

# --------------------------------------------------------

def draw_rect(base, xy, color):
    x, y, w, h = xy
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rectangle((x, y, x + w, y + h), fill=color)
    base.alpha_composite(overlay)

# --------------------------------------------------------

def draw_rect_topleft_round(base, xy1, xy2, radius, fill, color_filter=(255,255,255), border=None, img_path=None):
    x1, y1, w, h = xy1
    x_off, y_off, a = xy2

    rounded = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(rounded)

    draw.rectangle((0, radius, w, h), fill=fill)
    draw.rectangle((radius, 0, w, radius), fill=fill)
    draw.pieslice((0, 0, radius * 2, radius * 2), 180, 270, fill=fill)
    # --------------------------------------------------------
    if img_path:
        if img_path:
            if img_path.startswith("http"):
                response = requests.get(img_path)
                img = Image.open(BytesIO(response.content)).convert("RGBA")
            else:
                img = Image.open(img_path).convert("RGBA")
        iw, ih = img.size

        cx = w / 2
        cy = h / 2

        scale = (h / ih) * a
        new_w = int(iw * scale)
        new_h = int(ih * scale)
        img = img.resize((new_w, new_h), Image.LANCZOS)

        paste_x = int(cx + x_off - new_w / 2)
        paste_y = int(cy + y_off - new_h / 2)

        mask = Image.new("L", (w, h), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.rectangle((0, radius, w, h), fill=255)
        mdraw.rectangle((radius, 0, w, radius), fill=255)
        mdraw.pieslice((0, 0, radius * 2, radius * 2), 180, 270, fill=255)

        temp_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        temp_layer.paste(img, (paste_x, paste_y), mask=img)
        temp_layer.putalpha(mask)

        rounded.alpha_composite(temp_layer)
    # --------------------------------------------------------
    if color_filter is not (255, 255, 255):
        r, g, b = color_filter
        color_layer = Image.new("RGBA", overlay.size, (r, g, b, 255))
        overlay = ImageChops.multiply(overlay, color_layer)
    # --------------------------------------------------------
    if border:
        if isinstance(border[0], (tuple, list)):
            color = tuple(int(round(v)) for v in border[0])
            width = border[1] if len(border) > 1 else 2
        else:
            color = tuple(int(round(v)) for v in border[:4])
            width = border[4] if len(border) > 4 else 2

        draw.line([(radius, 0), (w, 0)], fill=color, width=width)  # 상단
        draw.line([(w, 0), (w, h)], fill=color, width=width)        # 우측
        draw.line([(w, h), (0, h)], fill=color, width=width)        # 하단
        draw.line([(0, h), (0, radius)], fill=color, width=width)   # 좌측
        draw.arc((0, 0, radius * 2, radius * 2), 180, 270, fill=color, width=round(width/1.5))
    # --------------------------------------------------------
    base.alpha_composite(rounded, dest=(x1, y1))

# --------------------------------------------------------

def draw_text(base, text, xy, font_path, font_size = 16, color = (255,255,255,255), anchor="lt"):
    draw = ImageDraw.Draw(base)
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
    # --------------------------------------------------------
    try:
        font = ImageFont.truetype(font_path, font_size)
    except OSError:
        print("*Text Load Failed*: ", OSError)
        font = ImageFont.load_default()
    # --------------------------------------------------------
    try:
        draw.text(xy, text, fill=color, font=font, anchor=anchor)
    except OSError:
        print("*Text Draw Failed*: ", OSError)

def draw_image(base, path, xy, color_filter = (255, 255, 255), opacity=1.0):
    x, y, w, h = xy
    try:
        if path:
            if path.startswith("http"):
                response = requests.get(path)
                overlay = Image.open(BytesIO(response.content)).convert("RGBA")
            else:
                overlay = Image.open(path).convert("RGBA")
        overlay = overlay.resize((w, h), Image.LANCZOS)

        if opacity < 1:
            alpha = overlay.split()[3]
            alpha = alpha.point(lambda p: int(p * opacity))
            overlay.putalpha(alpha)

        if color_filter is not (255, 255, 255):
            r, g, b = color_filter
            color_layer = Image.new("RGBA", overlay.size, (r, g, b, 255))
            overlay = ImageChops.multiply(overlay, color_layer)

        base.paste(overlay, (x, y), overlay)

    except Exception as err:
        print("*Image Load Failed*: ", err)

def draw_gradient(base, xy, color, angle_deg=0):
    x, y, w, h = xy
    c1, c2 = [np.array(c, dtype=float) for c in color]

    xv, yv = np.meshgrid(np.linspace(0, 1, w), np.linspace(0, 1, h))
    angle = math.radians(angle_deg)
    dir_x, dir_y = math.cos(angle), math.sin(angle)

    t = (xv * dir_x + yv * dir_y)
    t = (t - t.min()) / (t.max() - t.min())

    gradient = (c1[None, None, :] * (1 - t[:, :, None]) + c2[None, None, :] * t[:, :, None]).astype(np.uint8)
    gradient_img = Image.fromarray(gradient, mode="RGBA")

    base.alpha_composite(gradient_img, dest=(x, y))

# -----------------------------
# Creating Profile Card
# -----------------------------
@app.post("/generate_card")
async def create_profile_card(
    image_character: UploadFile = None,
    image_sub: UploadFile = None,
    image_data: str = Form(...),
    stat_data: str = Form(...),
):
    """ const statData = {
    lang: "kr",
    server: "Asia",
    lever: 80,
    player_name: "SSeries",
    uid: 700695460,
    c_id: "camellya",
    c_name: "카멜리아",
    c_type: ["havoc", "atk", "normalBns", "sword"],
    w_imgkey: "ico003",
    w_name: "날카로운 봄",
    w_stat: [587, 24.3],
    w_type: "CritRate",
    constel: [0, 0],
    stats: [
        [15665, 5340],
        [2283, 998],
        [1309, 149],
        [136.0, 36],
        [66.8, 37.5],
        [270.0, 104.0],
        [75.0, 60.0],
        [25.9, 10.9],
    ],
    set_option: [["Eclipse", true]],
    echo_id: ["", "", "", "", ""],
    echo_stat: [ [], [], [], [], [] ],
    echo_score: [
        [28.8, 45.5],
        [18.6, 50.7],
        [26.4, 26.4],
        [28.8, 28.8],
        [32.4, 32.4],
    ]};
    """
    os.makedirs("./temp", exist_ok=True)
    os.makedirs("./assets", exist_ok=True)

    stat_data = json.loads(stat_data)
    data_image = json.loads(image_data)
    font_use = KR_FONT_PATH

    # --------------------------------------------------------

    if image_character:
        input_main = f"./temp/{image_character.filename}"
        with open(input_main, "wb") as f:
            f.write(await image_character.read())
    else:
        input_main = "./assets/default.png" 

    if image_sub:
        input_sub = f"./temp/{image_sub.filename}"
        with open(input_sub, "wb") as f:
            f.write(await image_sub.read())
    else:
        input_sub = "./assets/default_sub.png"
        
    # --------------------------------------------------------

    base = Image.open("./assets/BG.jpg").convert("RGBA")
    img_main = Image.open(input_main).convert("RGBA")

    if input_sub and os.path.exists(input_sub):
        img_sub = Image.open(input_sub).convert("RGBA")
        base.paste(img_sub, (25, 25), img_sub)

    #$ Portarit Init.
    draw = ImageDraw.Draw(base)
    draw.rectangle([(27, 27), (27 + 650, 27 + 800)], fill=(0, 0, 0, 255))
    draw_rect(base, (700, 210, 600, 710), (0, 0, 0, 70))
    draw_rect(base, (700, 70, 600, 140), (255, 255, 255, 40))
    draw_rect(base, (1320, 70, 800, 216), (255, 255, 255, 40))

    # --------------------------------------------------------

    #$ Character Image
    character_img_path = f"https://pub-9fd284d1a89c4bee9e0a92c921c2b28d.r2.dev/character/{stat_data.get("c_id")}/art.png"
    draw_rect_topleft_round(
        base, 
        xy1=(20, 20, 650, 800), 
        xy2=(0, 0, 1.04), 
        radius=40, 
        fill=(255, 255, 255, round(255 * 0.4)), 
        border=((200, 200, 200), 5), 
        img_path=character_img_path
    )
    
    #$ Weapon Image
    weapon_img_path = f"https://pub-9fd284d1a89c4bee9e0a92c921c2b28d.r2.dev/weapon/{stat_data.get("c_type")[3]}/{stat_data.get("w_imgkey")}.png"
    draw_gradient(base, (710, 20, 150, 150), (UI_COLOR[0], UI_COLOR[1]), 210)
    draw_image(base, weapon_img_path, (710, 20, 150, 150))
    draw.rectangle((710, 20, 710 + 150, 20 + 150), outline=(100, 100, 100), width=2)
    
    #$ Character Data
    c_type_data = stat_data.get("c_type")
    icon_paths = [
        f"./assets/ico/stats/{c_type_data[1]}.webp",
        f"./assets/ico/stats/{c_type_data[2]}Bns.webp",
        f"./assets/ico/weapon_type/{c_type_data[3]}.webp",
    ]
    draw_text(base, f"{stat_data.get("server")}", (35, 845), EN_FONT_PATH, 24)
    draw_text(base, f"Lv.{stat_data.get("level")} {stat_data.get("player_name")}", (35, 875), EN_FONT_PATH, 24)
    draw_text(base, f"Uid. {stat_data.get("uid")}", (35, 905), EN_FONT_PATH, 24)
    draw_text(base, f"{stat_data.get("c_name")}", (665, 875), font_use, 55, anchor="rt")
    draw_text(base, "Image © Kuro Games 2024", (662, 800), EN_FONT_PATH, 14, anchor="rt", color=(255, 255, 255, 180))
    
    draw_image(base,f"./assets/ico/element/{c_type_data[0]}.png", (510-5, 833-5, 45, 45))
    for i, path in enumerate(icon_paths):
        draw_image(base, path, (550 + 40 * i, 833, 35, 35))
    
    #$ Wapon Data
    draw_text(base, stat_data.get("w_name"), (875, 95), font_use, 36)
    draw_text(base, stat_data.get("w_stat")[0], (1030, 160), NUM_FONT_PATH, 44, anchor="rt")
    draw_text(base, f"{stat_data.get("w_stat")[1]}%", (1275, 160), NUM_FONT_PATH, 44, anchor="rt")
    draw_image(base, f"./assets/ico/stats/atk.webp", (877, 151, 46, 46))
    draw_image(base, f"./assets/ico/stats/{stat_data.get("w_type")}.webp", (1085, 149, 50, 50))

    #$ Dev Mark
    draw_text(base, "Unofficial Fan Project: All assets © Kuro Games", (1325, 41), EN_FONT_PATH, 24, color=(255, 255, 255, 180))
    draw_rect(base, (1917, 62, 118, 1), (255, 255, 255, 100))
    draw_image(base, f"./assets/link.png", (1892, 40, 21, 21))
    draw_text(base, "WuWa.dev © 2025", (2120, 41), EN_FONT_PATH, 24, anchor="rt", color=(255, 255, 255, 180))
    draw_text(base, "powered by. SSeries", (2120, 13), EN_FONT_PATH, 20, anchor="rt", color=(255, 255, 255, 180))

    #$  Stat Field
    stats = stat_data.get("stats")
    stat_name = stat_data.get("stat_name")
    for i in range(8):
        draw_rect(base, (720, 235 + 70 * i, 560, 45), (255, 255, 255, 40))
        draw_text(base, f"{stat_name[i]}", (772, 244 + 70 * i), font_use, 32)
        if i < 3:
            draw_text(base, f"{stats[i][0]}", (1205, 247 + 70 * i), NUM_FONT_PATH, 31, anchor="rt")
            draw_text(base, f"+{stats[i][1]}", (1275, 255 + 70 * i), NUM_FONT_PATH, 17, anchor="rt", color=(221, 170, 0, 255))
        else :
            draw_text(base, f"{stats[i][0]:.1f}%", (1205, 247 + 70 * i), NUM_FONT_PATH, 31, anchor="rt")
            draw_text(base, f"+{stats[i][1]:.1f}%", (1275, 255 + 70 * i), NUM_FONT_PATH, 17, anchor="rt", color=(221, 170, 0, 255))
    

    #// c_type_data = stat_data.get("c_type")
    icon_paths = [
        "./assets/ico/stats/hp.webp",
        "./assets/ico/stats/atk.webp",
        "./assets/ico/stats/def.webp",
        "./assets/ico/stats/ResonanceBns.webp",
        "./assets/ico/stats/CritRate.webp",
        "./assets/ico/stats/CritDmg.webp",
        f"./assets/ico/stats/{c_type_data[0]}Bns.webp",
        f"./assets/ico/stats/{c_type_data[2]}Bns.webp",
    ]
    for i, path in enumerate(icon_paths):
        draw_image(base, path, (725, 238 + 70 * i, 40, 40))

    #$ Stat Score
    echo_score = {
        "total": [0, 0],
        "echo_datas": stat_data.get("echo_score")
    }
    echo_score["total"] = [sum(col) for col in zip(*echo_score["echo_datas"])]
    draw_text(base, f"Cv.", (770, 870), EN_FONT_PATH, 36)
    draw_text(base, f"Av.", (1035, 870), EN_FONT_PATH, 36)
    draw_text(base, f"{echo_score["total"][0]:.1f} pt", (965, 870), EN_FONT_PATH, 36, anchor="rt")
    draw_text(base, f"{echo_score["total"][1]:.1f} pt", (1230, 870), EN_FONT_PATH, 36, anchor="rt")

    #$ User Plate
    #draw_rect(base, (1320 + 10, 70 + 10, 260, 136), (255, 255, 255, 40))
    draw_image(base, f"./assets/ico/rank/{4}.png", (1435 - 132, 155 - 78, 262, 156))
    draw_text(base, "Av.", (1340, 245), EN_FONT_PATH, 36)
    draw_text(base, f"{echo_score["total"][1]:.1f} pt", (1530, 245), EN_FONT_PATH, 36, anchor="rt")
    draw_rect(base, (1550, 70 + 10, 560, 196), (255, 255, 255, 40)) 

    #$ Echo Slots
    for i in range(5):
        echo_img_path= f"https://pub-9fd284d1a89c4bee9e0a92c921c2b28d.r2.dev/ico/echos/{stat_data.get("echo_id")[i]}.webp"
        draw_rect(base, (1320 + 163 * i, 300, 148, 620), (255, 255, 255, 40))
        draw_rect(base, (1325 + 163 * i, 305, 138, 138), (0, 0, 0, 80))
        draw_rect(base, (1330 + 163 * i, 551, 128, 1), (255, 255, 255, 180))
        draw_rect(base, (1330 + 163 * i, 791, 128, 1), (255, 255, 255, 180))
        draw_image(base, echo_img_path, (1325 + 163 * i, 305, 138, 138))
        draw.rectangle((1325 + 163 * i, 305, 1325 + 163 * i + 138, 305 + 138), outline=(0, 0, 0), width=1)

        echo_data = stat_data.get("echo_stat")[i]
        icon_paths=[
            f"./assets/ico/stats/{echo_data[0][0]}.webp",
            f"./assets/ico/stats/{echo_data[1][0]}.webp",
            f"./assets/ico/stats/{echo_data[2][0]}.webp",
            f"./assets/ico/stats/{echo_data[3][0]}.webp",
            f"./assets/ico/stats/{echo_data[4][0]}.webp",
            f"./assets/ico/stats/{echo_data[5][0]}.webp",
            f"./assets/ico/stats/{echo_data[6][0]}.webp",
        ]
        stat_value=[
            echo_data[0][1],
            echo_data[1][1],
            echo_data[2][1],
            echo_data[3][1],
            echo_data[4][1],
            echo_data[5][1],
            echo_data[6][1],
        ]
        #// echo_score = {
        #//     "total": [0, 0],
        #//     "echo_datas": stat_data.get("echo_score")
        #// }
        for j, (path, value) in enumerate(zip(icon_paths, stat_value)):
            draw_image(base, "./assets/accent.png", (1320 + 163 * i, 453 + j * 45 + (15 if j > 1 else 0), 148, 50), color_filter=(255, 255, 0), opacity=0.5)
            draw_image(base, icon_paths[j], (1330 + 163 * i, 460 + j * 45 + (15 if j > 1 else 0), 36, 36))
            draw_text(
                base,
                f"{value}{'%' if any(x in path for x in ['Bns', 'Crit', 'Pct']) else ''}",
                (1330 + 128 + 163 * i, 467 + j * 45 + (15 if j > 1 else 0)),
                NUM_FONT_PATH,
                29,
                anchor="rt"
            )
        
        icon_paths=[
            f"./assets/ico/rank/{0}.png",
            f"./assets/ico/rank/{1}.png",
            f"./assets/ico/rank/{2}.png",
            f"./assets/ico/rank/{3}.png",
            f"./assets/ico/rank/{4}.png",
        ]
        draw_image(base, icon_paths[4], (1344 + 163 * i, 798, 100, 60))
        draw_text(base, "Cv.", (1330 + 163 * i, 863), EN_FONT_PATH, 25)
        draw_text(base, f"{echo_score["echo_datas"][i][0]:.1f} pt", (1330 + 128 + 163 * i, 863), EN_FONT_PATH, 25, anchor="rt")
        draw_text(base, "Av.", (1330 + 163 * i, 893), EN_FONT_PATH, 25)
        draw_text(base, f"{echo_score["echo_datas"][i][1]:.1f} pt", (1330 + 128 + 163 * i, 893), EN_FONT_PATH, 25, anchor="rt")
        draw.rectangle((1320 + 163 * i, 300, 1320 + 163 * i + 148, 300 + 620), outline=(0, 0, 0), width=2)

    #@ Return Image Generate
    base.save("result.png", "PNG")
    return FileResponse(
        path="./result.png",
        media_type="image/png",
        filename="result.png"
    )

# ---------------------------
# local testing
# ---------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
