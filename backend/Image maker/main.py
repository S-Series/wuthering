
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw, ImageFont

import os, json, uvicorn

app = FastAPI()
EN_FONT_PATH = "./fonts/en.ttf"

# --------------------------------------------------------

def image_process(img_path, x, y, a, w, h):
    target_img = Image.open(img_path)
    cropped = target_img.crop((x, y, x + (w / a), y + (h / a)))
    resized = cropped.resize((w, h), Image.LANCZOS)
    return resized

# --------------------------------------------------------

def draw_rect_topleft_round(base, xy1, xy2, radius, fill, border=None, img_path=None):
    x1, y1, w, h = xy1
    x_off, y_off, a = xy2

    rounded = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(rounded)

    draw.rectangle((0, radius, w, h), fill=fill)
    draw.rectangle((radius, 0, w, radius), fill=fill)
    draw.pieslice((0, 0, radius * 2, radius * 2), 180, 270, fill=fill)
    # --------------------------------------------------------
    if img_path:
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

def draw_text(base, text, xy, font_path, font_size = 16, color = (255,255,255,255)):
    draw = ImageDraw.Draw(base)
    # --------------------------------------------------------
    try:
        font = ImageFont.truetype(font_path, font_size)
    except OSError:
        print("*Text Load Failed*: ", OSError)
        font = ImageFont.load_default()
    # --------------------------------------------------------
    try:
        draw.text(xy, text, fill=color, font=font)
    except OSError:
        print("*Text Draw Failed*: ", OSError)

# -----------------------------
# Creating Profile Card
# -----------------------------
@app.post("/generate_card/")
async def create_profile_card(
    image_character: UploadFile = None,
    image_sub: UploadFile = None,
    image_data: str = Form(...),
    stat_data: str = Form(...),
):
    os.makedirs("./temp", exist_ok=True)
    os.makedirs("./assets", exist_ok=True)

    data_image = json.loads(image_data)
    data_stat = json.loads(stat_data)
    #font_path = "./fonts/{lang}.ttf"
    font_path = "./fonts/kr.ttf"

    # --------------------------------------------------------

    if image_character and image_character.filename:
        input_main = f"./temp/{image_character.filename}"
        with open(input_main, "wb") as f:
            f.write(await image_character.read())
    else:
        char_name = data_stat.get("characterName", "default")
        input_main = f"./assets/{char_name}.png"
        if not os.path.exists(input_main):
            input_main = "./assets/default.png"

    # --------------------------------------------------------

    if image_sub and image_sub.filename:
        input_sub = f"./temp/{image_sub.filename}"
        with open(input_sub, "wb") as f:
            f.write(await image_sub.read())
    else:
        input_sub = "./assets/default_sub.png" if os.path.exists("./assets/default_sub.png") else None

    # --------------------------------------------------------

    base = Image.open("./assets/BG.jpg").convert("RGBA")
    img_main = Image.open(input_main).convert("RGBA")

    if input_sub and os.path.exists(input_sub):
        img_sub = Image.open(input_sub).convert("RGBA")
        base.paste(img_sub, (25, 25), img_sub)

    draw = ImageDraw.Draw(base)

    draw.rectangle([(25, 25), (25 + 650, 25 + 800)], fill=(0, 0, 0, 255))
    temp_path = "./assets/character/camellya/art.png"
    """draw_rect_topleft_round(
        base, 
        xy1=(20, 20, 650, 800), 
        xy2=(0, 0, 1.25), 
        radius=40, 
        fill=(255, 255, 255, round(255 * 0.4)), 
        border=((200, 200, 200), 5), 
        img_path=temp_path
    )"""

    draw_text(base, "test", (100, 100), EN_FONT_PATH, 32)

    base.save("result.png", "PNG")
    print("✅ result.jpg 저장 완료")
    return {"status": "ok", "message": "result.jpg created"}

# ---------------------------
# local testing
# ---------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
