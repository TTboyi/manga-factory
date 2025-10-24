from flask import Blueprint, request
from extensions import redis_client, db
from utils.email_utils import generate_email_code, send_email
from utils.jwt_utils import generate_tokens
from utils.response_utils import success, error
from models import User
from datetime import timedelta
from utils.crypto_utils import hash_password

captcha_bp = Blueprint("captcha", __name__)
EMAIL_CAPTCHA_PREFIX = "email_captcha:"
RATE_LIMIT_PREFIX = "email_rate:"

# 发送验证码
@captcha_bp.route("/send_email", methods=["POST"])
def send_email_captcha():
    data = request.get_json()
    print("收到请求体:", request.get_json())

    email = data.get("email") or request.form.get("email")
    if not email:
        return error("缺少 email 参数",400)

    # 1️⃣ 频率限制：同邮箱/同IP一分钟内只能发一次
    ip = request.remote_addr
    if redis_client.exists(RATE_LIMIT_PREFIX + ip):
        return error("发送频率过高，请稍后再试")

    # 2️⃣ 生成验证码
    code = generate_email_code()
    redis_client.setex(EMAIL_CAPTCHA_PREFIX + email, timedelta(minutes=5), code)
    redis_client.setex(RATE_LIMIT_PREFIX + ip, timedelta(seconds=60), "1")

    # 3️⃣ 发送邮件
    if not send_email(email, code):
        return error("验证码发送失败，请检查邮箱配置")
    print("success 函数引用:", success)
    
    result = success(message="验证码已发送")
    print("result 类型:", result)
    return result
    return success(message="验证码已发送")

# 邮箱验证码登录
@captcha_bp.route("/login_email", methods=["POST"])
def email_captcha_login():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return error("缺少参数")

    stored = redis_client.get(EMAIL_CAPTCHA_PREFIX + email)
    if not stored:
        return error("验证码已过期或不存在")
    if stored != code:
        return error("验证码错误")

    # 删除验证码
    redis_client.delete(EMAIL_CAPTCHA_PREFIX + email)

    # 查找或自动注册用户
    user = User.query.filter_by(nickname=email).first()
    if not user:
        user = User(nickname=email, password=hash_password("default_password"))
        db.session.add(user)
        db.session.commit()

    # 发 token
    access, refresh = generate_tokens(user.id)
    return success({
        "access_token": access,
        "refresh_token": refresh
    }, "登录成功")
