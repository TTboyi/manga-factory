from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify
from utils.jwt_utils import is_token_blacklisted

def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            jti = claims.get("jti")
            if is_token_blacklisted(jti):
                return jsonify({"code": 40003, "message": "Token 已失效"}), 401
        except Exception as e:
            return jsonify({"code": 40002, "message": "未授权: " + str(e)}), 401
        return fn(*args, **kwargs)
    return wrapper
