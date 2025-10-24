from flask_jwt_extended import (
    create_access_token, create_refresh_token, decode_token
)
from datetime import timedelta
from extensions import redis_client
from config import Config

def generate_tokens(identity):
    """生成 Access 与 Refresh token"""
    identity_str = str(identity)
    access_token = create_access_token(identity=identity_str , expires_delta=timedelta(seconds=Config.ACCESS_TOKEN_EXPIRES))
    refresh_token = create_refresh_token(identity=identity_str , expires_delta=timedelta(seconds=Config.REFRESH_TOKEN_EXPIRES))
    return access_token, refresh_token

def blacklist_token(token: str):
    """将 token 加入黑名单"""
    redis_client.setex(f"jwt:blacklist:{token}", Config.REFRESH_TOKEN_EXPIRES, "1")

def is_token_blacklisted(token: str) -> bool:
    """判断 token 是否失效"""
    return redis_client.exists(f"jwt:blacklist:{token}") == 1
