import smtplib
from email.mime.text import MIMEText
from email.header import Header
import random, string

SMTP_HOST = "smtp.qq.com"
SMTP_PORT = 587
SENDER_EMAIL = "2872994847@qq.com"
SENDER_PASS = "btbyrvrwcbgudeje"  # ⚠️ 不是QQ密码，是授权码

def generate_email_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_email(receiver, code):
    msg = MIMEText(f"您的验证码是：{code}", "plain", "utf-8")
    msg["Subject"] = "漫画工厂验证码"
    msg["From"] = SENDER_EMAIL
    msg["To"] = receiver

    try:
        print("1️⃣ 正在连接 SMTP 服务器...")
        smtp = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
        print("2️⃣ 连接成功，开始 TLS 握手...")
        smtp.starttls()  # ✅ 启用 TLS
        print("3️⃣ 握手成功，准备登录...")
        smtp.login(SENDER_EMAIL, SENDER_PASS)
        print("4️⃣ 登录成功，发送邮件中...")
        smtp.sendmail(SENDER_EMAIL, [receiver], msg.as_string())
        smtp.quit()
        print("✅ 邮件发送成功！")
        return True
    except Exception as e:
        print("❌ 邮件发送失败:", e)
