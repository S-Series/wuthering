from io import BytesIO
from PIL import Image


def open_image(image_source) -> Image.Image:
    if isinstance(image_source, bytes):
        return Image.open(BytesIO(image_source)).convert("RGBA")

    if isinstance(image_source, str):
        return Image.open(image_source).convert("RGBA")

    if isinstance(image_source, Image.Image):
        return image_source.convert("RGBA")

    raise TypeError("Unsupported image source type")


def open_image_from_path(image_path: str) -> Image.Image:
    return Image.open(image_path).convert("RGBA")


def paste_image(
    base: Image.Image,
    image_source,
    rect: tuple[int, int, int, int]
):
    x, y, w, h = rect

    image = open_image(image_source)
    image = image.resize((w, h))

    base.alpha_composite(image, (x, y))