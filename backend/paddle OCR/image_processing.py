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


def encode_jpeg_base64(image: Image.Image):
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


def to_ocr_array(image: Image.Image):
    return np.array(image)
