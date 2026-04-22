"""Quick smoke-test: python test_email.py"""
import smtplib, os
from dotenv import load_dotenv
from email.message import EmailMessage

load_dotenv()

user = os.environ["MAIL_USERNAME"]
pwd  = os.environ["MAIL_PASSWORD"]

msg = EmailMessage()
msg["Subject"] = "Test – Backend Kontaktformular"
msg["From"]    = user
msg["To"]      = "7007779@gmail.com"
msg.set_content("Backend funktioniert! E-Mail-Versand ist eingerichtet.", charset="utf-8")

with smtplib.SMTP("smtp.gmail.com", 587) as s:
    s.starttls()
    s.login(user, pwd)
    s.send_message(msg)

print("OK – E-Mail gesendet!")
