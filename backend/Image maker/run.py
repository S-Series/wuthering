import uvicorn
import os

HOST = "0.0.0.0"
PORT = int(os.getenv("PORT", 8080))
RELOAD = os.getenv("ENV", "dev") == "dev"

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=RELOAD
    )