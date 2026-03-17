from fastapi import APIRouter
from fastapi.responses import Response

from app.services.render_service import prepare_render_data

router = APIRouter(prefix="/render", tags=["render"])


@router.get("/test")
def render_test():
    return {"message": "render router ok"}


@router.post("/card")
async def render_card(payload: dict):
    image_bytes = prepare_render_data(payload)
    return Response(content=image_bytes, media_type="image/png")