from fastapi import FastAPI, UploadFile, File, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image
from typing import List, Optional

import easyocr
import io
import numpy as np

origins = [
    "http://localhost:3000",
    "https://www.wwaves.dev"
]

app = FastAPI()
app.mount("/static", StaticFiles(directory="assets"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

loaded_langs = {
    "en": None,
    "kr": None,
    "ja": None,
    "cn": None
}

def get_reader(lang: str):
    if loaded_langs[lang] is None:
        if lang == "kr":
            loaded_langs[lang] = easyocr.Reader(['ko', 'en'], gpu=False)
        elif lang == "ja":
            loaded_langs[lang] = easyocr.Reader(['ja', 'en'], gpu=False)
        elif lang == "cn":
            loaded_langs[lang] = easyocr.Reader(['ch_tra', 'en'], gpu=False)
        else:
            loaded_langs[lang] = easyocr.Reader(['en'], gpu=False)
    return loaded_langs[lang]

@app.get("/")
async def root():
    return {"message": "FastAPI OCR server is running"}

@app.post("/ocr")
async def perform_ocr(
    file: UploadFile = File(...),
    lang: str = Query("en", enum=["en", "kr", "ja", "cn"])
):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        np_image = np.array(image)
    except Exception as e:
        return {"error": f"Image processing failed: {str(e)}"}

    try:
        reader = get_reader(lang)
        result = reader.readtext(np_image, detail=0)
    except Exception as e:
        return {"error": f"OCR failed: {str(e)}"}

    return {"text": result}

@app.post("/profile")
async def profile_img(
    key: str = Query(default="NaN"),
    lang: str = Query("en", enum=["en", "kr", "ja", "cn"]),

    weapon_value: List[str] = Query(default=["","","","",""]),
    exho_value: List[str] = Query(default=["","","","",""]),
    stats: List[float] = Query(default=[[],[],[],[],[],[]]),
    stats_icon: List[float] = Query(default=[[],[],[],[],[],[]]),
    score_value: List[float] = Query(default=[0.0, 0.0]),

    img: Optional[UploadFile] = File(None),
    value: Optional[List[float]] = Query(default=[0, 0, 1]),
):
    # 고정변수 설정
    image_pos = [] 
    image_paths = []
    canvas_width, canvas_height = 2520 + 32, 1080 + 32
    canvas = Image.new("RGBA", (canvas_width, canvas_height), (0, 0, 0, 0))

    if True: #key is Available:
    # 받은 이미지가 있는지 확인
        if img is not None:
            base_img = Image.open(img.file).convert("RGBA")
        else:
            base_img = Image.open("default.png").convert("RGBA")  # 기본 이미지
    else:
        base_img = Image.open("default.png").convert("RGBA")  # 기본 이미지
    
    # 스케일 값 확인 (유저설정값 * 컨테이너 사이즈 보정)
    scale = value[2]
    if scale != 1:
        new_size = (int(base_img.width * scale), int(base_img.height * scale))
        base_img = base_img.resize(new_size)

    # 배경 이미지 중첩그리기
    paste_x, paste_y = int(value[0]), int(value[1])
    temp_layer = Image.new("RGBA", (canvas_width, canvas_height), (0, 0, 0, 0))
    temp_layer.paste(base_img, (paste_x, paste_y))

    # 고정 이미지들 그려넣기
    for i, img_path in enumerate(image_paths):
        img_layer = Image.open(img_path).convert("RGBA")
        pos = image_pos[i]

        temp_layer = Image.new("RGBA", (canvas_width, canvas_height), (0, 0, 0, 0))
        temp_layer.paste(img_layer, pos)
        canvas = Image.alpha_composite(canvas, temp_layer)

    # 장비 이미지 붙여넣기
    img_layer = Image.open("https://www.wwaves.dev/weapon/{weapon_value[0]}.png").convert("RGBA")
    temp_layer = Image.new("RGBA", (canvas_width, canvas_height), (0, 0, 0, 0))
    temp_layer.paste(img_layer, pos)
    canvas = Image.alpha_composite(canvas, temp_layer)

    buf = io.BytesIO()
    canvas.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")