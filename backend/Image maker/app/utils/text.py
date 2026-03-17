from PIL import Image, ImageDraw, ImageFont


def load_font(font_path: str, font_size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        return ImageFont.truetype(font_path, font_size)
    except OSError:
        return ImageFont.load_default()


def draw_text(
    base: Image.Image,
    text: str,
    position: tuple[int, int],
    font_path: str,
    font_size: int,
    fill=(255, 255, 255, 255),
    anchor: str = "lt"
):
    draw = ImageDraw.Draw(base)
    font = load_font(font_path, font_size)

    draw.text(
        position,
        str(text),
        font=font,
        fill=fill,
        anchor=anchor
    )