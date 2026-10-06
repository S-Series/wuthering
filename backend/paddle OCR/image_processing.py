import base64
import io

import numpy as np
from PIL import Image, ImageEnhance, ImageOps


def load_rgb_image(contents: bytes):
    with Image.open(io.BytesIO(contents)) as image:
        if image.width * image.height > 32_000_000:
            raise ValueError("Image exceeds 32 megapixels")
        return ImageOps.exif_transpose(image).convert("RGB")


def preprocess_image(image: Image.Image):
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(0)

    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)

    return image


def preprocess_ocr_region(image: Image.Image):
    # Thin row crops need enough pixels and border for the text detector.
    scale = min(3.0, max(1.0, 64 / image.height))
    width = max(1, round(image.width * scale))
    height = max(1, round(image.height * scale))
    with image.resize((width, height), Image.Resampling.LANCZOS) as resized:
        with preprocess_image(resized) as processed:
            return ImageOps.expand(processed, border=16, fill=processed.getpixel((0, 0)))


def encode_jpeg_base64(image: Image.Image):
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


def encode_png_base64(image: Image.Image):
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("ascii")


def to_ocr_array(image: Image.Image):
    return np.array(image)
