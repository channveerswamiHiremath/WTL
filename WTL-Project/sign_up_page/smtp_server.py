import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.message import EmailMessage
import random

app = Flask(__name__)
CORS(app)

BREVO_SERVER = os.getenv("BREVO_SMTP_SERVER")
BREVO_PORT = int(os.getenv("BREVO_SMTP_PORT"))
BREVO_USER = os.getenv("BREVO_SMTP_USERNAME")
BREVO_PASS = os.getenv("BREVO_SMTP_PASSWORD")

def generate_otp():
    return str(random.randint(100000, 999999))

@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data['email']
    username = data['username']
    otp = generate_otp()

    msg = EmailMessage()
    msg['Subject'] = 'Your OTP'
    msg['From'] = BREVO_USER
    msg['To'] = email
    msg.set_content(f"Your OTP is {otp}")

    try:
        with smtplib.SMTP(BREVO_SERVER, BREVO_PORT) as server:
            server.starttls()
            server.login(BREVO_USER, BREVO_PASS)
            server.send_message(msg)

        return jsonify({"success": True, "otp": otp})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run()
