import base64
import io

import numpy as np
from PIL import Image, ImageEnhance


def load_rgb_image(contents: bytes):
    return Image.open(io.BytesIO(contents)).convert("RGB")


def preprocess_image(image: Image.Image):
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(0)

    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)

    return crop_echo_panel(image)


def crop_echo_panel(image: Image.Image):
    w, h = image.size

    if w <= 640:
        return image

    target_ratio = 16 / 9
    current_ratio = w / h

    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        crop_width = w - new_w
        right_cut = round(80 * (h / 1080))
        left_cut = crop_width - right_cut
        image = image.crop((left_cut, 0, w - right_cut, h))
        w, h = image.size

    left = w * (2 / 3)
    upper = 90 * (w / 1920)
    right = w
    lower = 540 * (w / 1920)

    upper = max(0, min(upper, h))
    lower = max(0, min(lower, h))

    return image.crop((left, upper, right, lower))


def encode_jpeg_base64(image: Image.Image):
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


def to_ocr_array(image: Image.Image):
    return np.array(image)
