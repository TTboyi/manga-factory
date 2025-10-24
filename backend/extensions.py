from flask_sqlalchemy import SQLAlchemy
from redis import Redis
from datetime import timedelta
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
redis_client = Redis.from_url("redis://localhost:6379/0", decode_responses=True)
jwt = JWTManager()
