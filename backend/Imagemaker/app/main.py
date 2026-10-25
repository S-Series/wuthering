from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.render import router as render_router
from app.internal_auth import InternalAuthMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(InternalAuthMiddleware)

app.include_router(render_router)

@app.get("/")
def root():
    return {"message": "server is running"}
