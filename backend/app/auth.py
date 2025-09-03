import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

try:
    from clerk_backend_sdk import Clerk
except Exception:  # pragma: no cover - fallback for missing SDK
    class Clerk:  # type: ignore
        """Fallback Clerk client for environments without the SDK."""
        def __init__(self, api_key: str) -> None:
            self.api_key = api_key

        def verify_token(self, token: str) -> dict:  # pragma: no cover - placeholder
            if not token:
                raise ValueError("Empty token")
            # In limited environments we simply accept any non-empty token.
            return {"sub": "anonymous"}

clerk_client = Clerk(api_key=os.environ.get("CLERK_SECRET_KEY", ""))
security = HTTPBearer()

def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Validate an Authorization header using Clerk.

    This function acts as a FastAPI dependency. Any endpoint depending on it
    will require a valid bearer token issued by Clerk. In environments where the
    Clerk SDK is unavailable, any non-empty token is accepted.
    """
    token = credentials.credentials
    try:
        return clerk_client.verify_token(token)
    except Exception as exc:  # pragma: no cover - fail closed
        raise HTTPException(status_code=401, detail="Invalid or missing token") from exc
