from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re


class ContactRequest(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    message: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name darf nicht leer sein")
        if len(v) > 100:
            raise ValueError("Name ist zu lang")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Telefonnummer darf nicht leer sein")
        # Allow digits, spaces, +, -, (, )
        if not re.match(r"^[\d\s\+\-\(\)]{6,20}$", v):
            raise ValueError("Ungültige Telefonnummer")
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v.strip() == "":
            return None
        v = v.strip()
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", v):
            raise ValueError("Ungültige E-Mail-Adresse")
        if len(v) > 254:
            raise ValueError("E-Mail-Adresse ist zu lang")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Nachricht darf nicht leer sein")
        if len(v) > 3000:
            raise ValueError("Nachricht ist zu lang (max. 3000 Zeichen)")
        return v


class ContactResponse(BaseModel):
    success: bool
    message: str
