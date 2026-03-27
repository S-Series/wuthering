from PIL import Image, ImageDraw, ImageFont

KR_FONT_PATH = "./fonts/PretendardVariable.ttf"
EN_FONT_PATH = "./fonts/Roboto-Medium.ttf"
JP_FONT_PATH = "./fonts/NotoSansJP-Regular.ttf"
ZH_FONT_PATH = "./fonts/NotoSansTC-Regular.ttf"
NUM_FONT_PATH = "./fonts/WantedSans-Medium.ttf"

KR_FONT_BOLD_PATH = "./fonts/Pretendard-Bold.ttf"
EN_FONT_BOLD_PATH = "./fonts/Roboto-Bold.ttf"
JP_FONT_BOLD_PATH = "./fonts/NotoSansJP-Bold.ttf"
ZH_FONT_BOLD_PATH = "./fonts/NotoSansTC-Bold.ttf"
NUM_FONT_BOLD_PATH = "./fonts/WantedSans-Bold.ttf"

SYMBOL_FONT_PATH = "./fonts/Symbola.ttf"

FONT_MAP = {
    "kr": KR_FONT_PATH,
    "kr_bold": KR_FONT_BOLD_PATH,
    "en": EN_FONT_PATH,
    "en_bold": EN_FONT_BOLD_PATH,
    "jp": JP_FONT_PATH,
    "jp_bold": JP_FONT_BOLD_PATH,
    "zh": ZH_FONT_PATH,
    "zh_bold": ZH_FONT_BOLD_PATH,
    "num": NUM_FONT_PATH,
    "num_bold": NUM_FONT_BOLD_PATH,

    "symbol": SYMBOL_FONT_PATH,
}


def get_text_size(lang:str, text:str, size:int, is_bold:bool):
    font_code = f"{lang}{"_bold" if is_bold else ""}"
    font = ImageFont.truetype(FONT_MAP[font_code] or FONT_MAP["kr"], size)
    bbox = font.getbbox(text)
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    return width, height


def load_font(lang, font_size: int, is_bold: bool):
    try:
        key = key = lang.lower() + ("_bold" if is_bold else "")
        font_path = FONT_MAP.get(key, NUM_FONT_PATH)
        return ImageFont.truetype(font_path, font_size)
    except OSError:
        return ImageFont.load_default()


def draw_text(base, text, xy, lang, font_size = 16, color = (255,255,255,255), anchor="lt", is_bold=False):
    draw = ImageDraw.Draw(base)
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
    # --------------------------------------------------------
    try:
        font = load_font(lang, font_size, is_bold)
    except OSError:
        print("*Text Load Failed*: ", OSError)
        font = ImageFont.load_default()
    # --------------------------------------------------------
    try:
        draw.text(xy, text, fill=color, font=font, anchor=anchor)
    except OSError:
        print("*Text Draw Failed*: ", OSError)