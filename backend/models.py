from datetime import datetime
from extensions import db
from sqlalchemy import func
from sqlalchemy.dialects.sqlite import TEXT


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # 用户自定义项目名称
    name = db.Column(db.String(255), nullable=False)

    # 小说原文
    novel_text = db.Column(db.Text, nullable=True)

    # 序列化后的场景数组(JSON字符串)
    scenes_json = db.Column(db.Text, nullable=True)

    # 序列化后的视觉规范(JSON字符串)
    visual_spec_json = db.Column(db.Text, nullable=True)

    # 序列化后的生成图片URL列表(JSON字符串)
    images_json = db.Column(db.Text, nullable=True)

    # 时间戳
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        server_onupdate=func.now()
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "novel_text": self.novel_text,
            "scenes_json": self.scenes_json,
            "visual_spec_json": self.visual_spec_json,
            "images_json": self.images_json,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)
