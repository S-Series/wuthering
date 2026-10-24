"""Reject untrusted traffic before JSON parsing or rendering."""
import hmac
import os

from starlette.responses import JSONResponse


class InternalAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or (
            scope["method"] in ("GET", "HEAD") and scope["path"] in ("/", "/health")
        ):
            return await self.app(scope, receive, send)
        secret = os.environ.get("INTERNAL_API_SECRET", "")
        valid = len(secret) >= 32 and all(33 <= ord(char) <= 126 for char in secret)
        if not valid:
            return await JSONResponse({"detail": "Internal authentication is not configured"}, status_code=503)(scope, receive, send)
        values = [value for key, value in scope["headers"] if key.lower() == b"x-internal-secret"]
        if len(values) != 1 or not hmac.compare_digest(values[0], secret.encode("ascii")):
            return await JSONResponse({"detail": "Unauthorized"}, status_code=401)(scope, receive, send)
        return await self.app(scope, receive, send)
