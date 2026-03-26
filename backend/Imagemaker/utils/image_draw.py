from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw, ImageFont, ImageChops
from io import BytesIO

import os, math, json, uvicorn, secrets, requests
import numpy as np


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

def draw_rect_topleft_round(base, xy1, xy2, radius, fill = None, color_filter=(255,255,255), border=None, img_path=None):
    x1, y1, w, h = xy1
    x_off, y_off, a = xy2

    rounded = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(rounded)

    if img_path:
        if img_path.startswith("http"):
            response = requests.get(img_path)
            img = Image.open(BytesIO(response.content)).convert("RGBA")
        else:
            img = Image.open(img_path).convert("RGBA")

        iw, ih = img.size
        cx, cy = w / 2, h / 2
        scale = (h / ih) * a
        new_w, new_h = int(iw * scale), int(ih * scale)
        img = img.resize((new_w, new_h), Image.LANCZOS)

        paste_x = int(cx + x_off - new_w / 2)
        paste_y = int(cy + y_off - new_h / 2)

        mask = Image.new("L", (w, h), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.rectangle((0, radius, w, h), fill=255)
        mdraw.rectangle((radius, 0, w, radius), fill=255)
        mdraw.pieslice((0, 0, radius * 2, radius * 2), 180, 270, fill=255)

        if fill is None:
            temp_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            temp_layer.paste(img, (paste_x, paste_y), mask=img.split()[-1])
            rounded.alpha_composite(temp_layer)

        else:
            temp_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            temp_layer.paste(img, (paste_x, paste_y), mask=img.split()[-1])
            temp_layer.putalpha(mask)
            rounded.alpha_composite(temp_layer)
    # --------------------------------------------------------
    if color_filter != (255, 255, 255):
        r, g, b = color_filter
        color_layer = Image.new("RGBA", rounded.size, (r, g, b, 255))
        rounded = ImageChops.multiply(rounded, color_layer)
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

        if color_filter != (255, 255, 255):
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
