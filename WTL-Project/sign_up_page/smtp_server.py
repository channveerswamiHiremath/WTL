from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random
import os

app = Flask(__name__)
CORS(app)

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

def generate_otp():
    return str(random.randint(100000, 999999))

@app.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        email = data.get('email')
        username = data.get('username')

        otp = generate_otp()

        url = "https://api.brevo.com/v3/smtp/email"

        payload = {
            "sender": {"name": "NEO LEDGER X", "email": "noreply@neo-ledgerx.com"},
            "to": [{"email": email}],
            "subject": "Your OTP Code",
            "htmlContent": f"""
                <h2>Hello {username}</h2>
                <p>Your OTP is:</p>
                <h1>{otp}</h1>
                <p>Do not share this with anyone.</p>
            """
        }

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": BREVO_API_KEY
        }

        brevo_res = requests.post(url, json=payload, headers=headers)

        if brevo_res.status_code == 201:
            return jsonify({"success": True, "otp": otp})
        else:
            return jsonify({"success": False, "error": brevo_res.text}), 500

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run()
