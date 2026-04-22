import smtplib
import os
from email.message import EmailMessage
from email.utils import formataddr
from models import ContactRequest


SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
MAIL_USERNAME = os.environ["MAIL_USERNAME"]
MAIL_PASSWORD = os.environ["MAIL_PASSWORD"]
RECIPIENT_EMAIL = "7007779@gmail.com"


def build_email_body(data: ContactRequest) -> str:
    email_display = data.email if data.email else "-"
    return f"""\
Neue Kontaktanfrage von der Website
====================================

Name:     {data.name}
Telefon:  {data.phone}
E-Mail:   {email_display}

Nachricht:
----------
{data.message}

====================================
Diese Nachricht wurde automatisch über das Kontaktformular auf andrii-ryndia.de gesendet.
"""


def send_contact_email(data: ContactRequest) -> None:
    msg = EmailMessage()
    msg["Subject"] = "Neue Anfrage von der Website"
    msg["From"] = formataddr(("Andrii Ryndia Website", MAIL_USERNAME))
    msg["To"] = RECIPIENT_EMAIL

    if data.email:
        msg["Reply-To"] = data.email

    msg.set_content(build_email_body(data), charset="utf-8")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.login(MAIL_USERNAME, MAIL_PASSWORD)
        smtp.send_message(msg)
