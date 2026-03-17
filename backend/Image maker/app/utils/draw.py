from PIL import Image, ImageDraw


def draw_rect(base: Image.Image, rect: tuple[int, int, int, int], fill):
    x, y, w, h = rect

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rectangle((x, y, x + w, y + h), fill=fill)

    base.alpha_composite(overlay)


def draw_rounded_rect(
    base: Image.Image,
    rect: tuple[int, int, int, int],
    radius: int,
    fill
):
    x, y, w, h = rect

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=radius, fill=fill)

    base.alpha_composite(overlay)


def draw_line(
    base: Image.Image,
    start: tuple[int, int],
    end: tuple[int, int],
    fill,
    width: int = 1
):
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.line([start, end], fill=fill, width=width)

    base.alpha_composite(overlay)