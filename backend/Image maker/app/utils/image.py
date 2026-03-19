from pathlib import Path
from io import BytesIO
from PIL import Image, ImageDraw, ImageChops
import requests


def resize_and_crop_cover(img, target_size):
    target_w, target_h = target_size
    src_w, src_h = img.size

    src_ratio = src_w / src_h
    target_ratio = target_w / target_h

    if src_ratio > target_ratio:
        new_h = target_h
        new_w = int(src_w * (target_h / src_h))
    else:
        new_w = target_w
        new_h = int(src_h * (target_w / src_w))

    img = img.resize((new_w, new_h), Image.LANCZOS)

    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    right = left + target_w
    bottom = top + target_h

    return img.crop((left, top, right, bottom))


def open_image(image_source: str) -> Image.Image:
    if image_source.startswith("http://") or image_source.startswith("https://"):
        response = requests.get(image_source, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content)).convert("RGBA")

    return Image.open(image_source).convert("RGBA")


def paste_image(base, img_path, layout):
    x, y, w, h = layout

    if isinstance(img_path, Path):
        img_path = str(img_path)

    if isinstance(img_path, str) and img_path.startswith("http"):
        response = requests.get(img_path, timeout=10)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content)).convert("RGBA")
    else:
        img = Image.open(img_path).convert("RGBA")

    img = img.resize((w, h))
    base.paste(img, (x, y), img)


def draw_image(base, path, xy1, xy2=(0, 0, 1), color_filter=(255, 255, 255), opacity=1.0):
    x, y, w, h = xy1
    x_off, y_off, scale = xy2

    try:
        if not path:
            return

        if path.startswith("http"):
            response = requests.get(path)
            overlay = Image.open(BytesIO(response.content)).convert("RGBA")
        else:
            overlay = Image.open(path).convert("RGBA")

        src_w, src_h = overlay.size
        src_ratio = src_w / src_h
        target_ratio = w / h

        if src_ratio > target_ratio:
            base_h = h
            base_w = int(src_w * (h / src_h))
        else:
            base_w = w
            base_h = int(src_h * (w / src_w))

        new_w = max(1, int(base_w * scale))
        new_h = max(1, int(base_h * scale))
        overlay = overlay.resize((new_w, new_h), Image.LANCZOS)

        cx = w / 2
        cy = h / 2

        paste_x = int(cx + x_off - new_w / 2)
        paste_y = int(cy + y_off - new_h / 2)

        frame = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        frame.paste(overlay, (paste_x, paste_y), overlay)

        if opacity < 1:
            alpha = frame.split()[3]
            alpha = alpha.point(lambda p: int(p * opacity))
            frame.putalpha(alpha)

        if color_filter != (255, 255, 255):
            r, g, b = color_filter
            color_layer = Image.new("RGBA", frame.size, (r, g, b, 255))
            frame = ImageChops.multiply(frame, color_layer)

        base.paste(frame, (x, y), frame)

    except Exception as err:
        print("*Image Load Failed*: ", err)


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