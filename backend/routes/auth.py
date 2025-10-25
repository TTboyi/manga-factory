from flask import Blueprint, request
from extensions import db, jwt, redis_client
from utils.crypto_utils import hash_password, verify_password
from utils.jwt_utils import generate_tokens, blacklist_token
from utils.response_utils import success, error
from models import User
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt


auth_bp = Blueprint("auth", __name__)

# 注册
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nickname = data.get("nickname")
    password = data.get("password")

    if not nickname or not password:
        return error("缺少参数")

    if User.query.filter_by(nickname=nickname).first():
        return error("用户已存在")

    new_user = User(nickname=nickname, password=hash_password(password))
    db.session.add(new_user)
    db.session.commit()
    return success(message="注册成功")

# 登录
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    nickname = data.get("nickname")
    password = data.get("password")

    user = User.query.filter_by(nickname=nickname).first()
    if not user or not verify_password(password, user.password):
        return error("账号或密码错误", 401)

    access_token, refresh_token = generate_tokens(user.id)
    return success({
        "access_token": access_token,
        "refresh_token": refresh_token
    }, "登录成功")

# # 用户信息（用于 Chat 页面）
# @auth_bp.route("/user/info", methods=["GET"])
# @jwt_required()
# def user_info():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)
#     if not user:
#         return error("用户不存在", 404)
#     return success({
#         "id": user.id,
#         "nickname": user.nickname
#     }, "获取成功")

# 刷新 Token
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    user_id = get_jwt_identity()
    new_access, new_refresh = generate_tokens(user_id)
    return success({
        "access_token": new_access,
        "refresh_token": new_refresh
    }, "刷新成功")

# 登出
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    blacklist_token(jti)
    return success(message="已登出")

@auth_bp.route("/user/info", methods=["GET"])
@jwt_required()
def user_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return error("用户不存在", 404)
    return success({
        "id": user.id,
        "nickname": user.nickname
    }, "获取成功")