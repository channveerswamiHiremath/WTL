from flask import Flask, request, jsonify
import smtplib
from email.message import EmailMessage
import random
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  

SMTP_EMAIL = 'channveerhiremath735@gmail.com'
SMTP_PASSWORD = 'cbtz htjp wkim cilo'

def generate_otp():
    return str(random.randint(100000, 999999))

@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')

    otp = generate_otp()

    msg = EmailMessage()
    msg['Subject'] = '[NEO-LEDGER X] Your One-Time Password (OTP)'
    msg['From'] = SMTP_EMAIL
    msg['To'] = email

    # Plain text fallback
    msg.set_content(f"Hello {username},\n\nYour OTP is: {otp}\n\nDo not share this with anyone.\n- NEO-LEDGER X Team")

    # Professional HTML content
    msg.add_alternative(f"""
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#121417;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 15px;">
          <!-- CARD -->
          <table role="presentation" width="600" cellpadding="0" cellspacing="0"
                 style="background-color:#1e1e1e;border-radius:12px;overflow:hidden;
                        color:#ffffff;font-family:'Segoe UI','Roboto',Arial,sans-serif;">
            <!-- HEADER -->
            <tr>
              <td style="padding:40px 40px 20px;">
                <h2 style="margin:0 0 12px;font-size:24px;color:#38ef7d;">
                 NEO‑LEDGER X OTP Verification
                </h2>
                <p style="margin:0;font-size:16px;line-height:1.5;">
                  Hi <strong>{username}</strong>,
                </p>
                <p style="margin:16px 0;font-size:16px;line-height:1.5;">
                  Use the code below to complete your sign‑up:
                </p>

                <!-- OTP -->
                <div style="margin:32px 0;text-align:center;">
                  <span style="display:inline-block;padding:18px 32px;font-size:28px;
                               font-weight:700;letter-spacing:4px;
                               background:linear-gradient(90deg,#11998e,#38ef7d);
                               border-radius:8px;color:#ffffff;">
                    {otp}
                  </span>
                </div>

                <p style="margin:0 0 6px;font-size:14px;color:#ff6b6b;">
                  ⚠ Do not share this code with anyone.
                </p>
                <p style="margin:0 0 24px;font-size:14px;">
                  This OTP expires in 10 minutes. If you didn’t request it, ignore this email.
                </p>
              </td>
            </tr>

            <!-- CTA BUTTON -->
            <tr>
              <td align="center" style="padding:0 40px 40px;">
                <a href="html2.html"
                   style="background-color:#3b82f6;color:#ffffff;text-decoration:none;
                          font-size:16px;padding:12px 30px;border-radius:6px;
                          display:inline-block;font-weight:600;">
                  Go to dashboard
                </a>
              </td>
            </tr>

            
            <tr>
              <td align="center" style="padding:0 40px 6px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0 4px;">
                      <a href="https://x.com/neoledgerx">
                        <img src="https://cdn-icons-png.flaticon.com/128/3670/3670151.png"
                             alt="X" width="28" style="display:block;border-radius:50%;">
                      </a>
                    </td>
                    <td style="padding:0 4px;">
                      <a href="https://facebook.com/neoledgerx">
                        <img src="https://cdn-icons-png.flaticon.com/128/145/145802.png"
                             alt="Facebook" width="28" style="display:block;border-radius:50%;">
                      </a>
                    </td>
                    <td style="padding:0 4px;">
                      <a href="https://www.linkedin.com/in/channveer-hiremath-98a059309">
                        <img src="https://cdn-icons-png.flaticon.com/128/145/145807.png"
                             alt="LinkedIn" width="28" style="display:block;border-radius:50%;">
                      </a>
                    </td>
                    <td style="padding:0 4px;">
                      <a href="https://neo-ledgerx.com">
                        <img src="https://cdn-icons-png.flaticon.com/128/545/545680.png"
                             alt="Website" width="28" style="display:block;border-radius:50%;">
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:24px 40px;font-size:12px;color:#9e9e9e;
                         border-top:1px solid #333;">
                <p style="margin:0;">&copy; 2025 NEO‑LEDGER X. All rights reserved.</p>

                <p style="margin:8px 0 0;">
                  Our mailing address:<br>
                  Gokul  Road, opp Airport<br>
                  KLE Institute of Technology  580024
                </p>

                <p style="margin:8px 0 0;">
                  Prefer not to receive these emails?
                  <a href="#" style="color:#38ef7d;text-decoration:none;">Unsubscribe here</a>.
                </p>
              </td>
            </tr>
          </table><!-- /CARD -->
        </td>
      </tr>
    </table>
  </body>
</html>
""", subtype='html')

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        return jsonify({"success": True, "otp": otp})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
