from flask import Flask, request, jsonify
import random
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
BREVO_API_KEY = os.getenv("BREVO_API_KEY")

def generate_otp():
    return str(random.randint(100000, 999999))

def send_email_brevo(to_email, username, otp):
    url = "https://api.brevo.com/v3/smtp/email"
    payload = {
        "sender": {"name": "NEO-LEDGER X", "email": SMTP_EMAIL},
        "to": [{"email": to_email}],
        "subject": "[NEO-LEDGER X] Your OTP Code",
        "htmlContent": f"""
        <h2>Hi {username},</h2>
        <p>Your OTP is: <strong>{otp}</strong></p>
        <p>This OTP expires in 10 minutes. Do not share with anyone.</p>
        """
    }
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }
    return requests.post(url, json=payload, headers=headers)

@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json() or {}
    email = data.get('email')
    username = data.get('username')

    if not email or not username:
        return jsonify({"success": False, "error": "missing email or username"}), 400

    otp = generate_otp()
    response = send_email_brevo(email, username, otp)

    if response.status_code in (200, 201):
        return jsonify({"success": True, "otp": otp})
    else:
        # include Brevo response body for debugging (safe in logs)
        return jsonify({"success": False, "error": response.text}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
