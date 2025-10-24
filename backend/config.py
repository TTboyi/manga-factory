import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"  # 也可以换成 MySQL
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")
    ACCESS_TOKEN_EXPIRES = 60 * 15         # 15分钟
    REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 7  # 7天

    # Redis
    REDIS_URL = "redis://localhost:6379/0"
