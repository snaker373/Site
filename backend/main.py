"""
Contact form backend for andrii-ryndia.de
Run: uvicorn main:app --host 0.0.0.0 --port 8000
"""

import logging
from dotenv import load_dotenv
load_dotenv()  # loads .env file when running locally

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from models import ContactRequest, ContactResponse
from email_sender import send_contact_email


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# Rate limiter: max 5 requests per minute per IP
limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])

app = FastAPI(title="Andrii Ryndia — Contact API", docs_url=None, redoc_url=None)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow requests from the production domain and localhost for development
ALLOWED_ORIGINS = [
    "https://andrii-ryndia.de",
    "https://www.andrii-ryndia.de",
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:5500",   # VS Code Live Server
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


@app.post("/api/contact", response_model=ContactResponse)
@limiter.limit("5/minute")
async def contact(request: Request, data: ContactRequest):
    try:
        send_contact_email(data)
        logger.info("Email sent: name=%s phone=%s", data.name, data.phone)
        return ContactResponse(success=True, message="Nachricht erfolgreich gesendet")
    except Exception as exc:
        logger.error("Failed to send email: %s", exc)
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut."},
        )


@app.exception_handler(422)
async def validation_error_handler(request: Request, exc):
    errors = exc.errors()
    # Return the first validation error message in a friendly format
    first = errors[0] if errors else {}
    field = first.get("loc", [""])[-1]
    msg = first.get("msg", "Ungültige Eingabe")
    return JSONResponse(
        status_code=400,
        content={"success": False, "message": f"{field}: {msg}"},
    )
