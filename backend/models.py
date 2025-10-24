from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

from extensions import db


#db = SQLAlchemy()

class Novel(db.Model):
    """小说表，存储上传的小说文件或直接输入的文本"""
    __tablename__ = 'novels'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    file_path = db.Column(db.String(500), nullable=True)  # 如果是上传的文件，存储文件路径
    file_type = db.Column(db.String(50), nullable=True)  # 文件类型，如txt, docx等
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 与场景的一对多关系
    scenes = db.relationship('Scene', backref='novel', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'file_path': self.file_path,
            'file_type': self.file_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Scene(db.Model):
    """场景表，存储从小说中提取的场景"""
    __tablename__ = 'scenes'
    
    id = db.Column(db.Integer, primary_key=True)
    novel_id = db.Column(db.Integer, db.ForeignKey('novels.id'), nullable=False)
    scene_number = db.Column(db.Integer, nullable=False)  # 场景序号
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    characters = db.Column(db.Text, nullable=True)  # JSON格式存储角色列表
    setting = db.Column(db.String(255), nullable=True)  # 场景设置
    time = db.Column(db.String(100), nullable=True)  # 时间
    mood = db.Column(db.String(100), nullable=True)  # 情绪/氛围
    raw_json = db.Column(db.Text, nullable=True)  # 原始JSON格式数据
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 与图像的一对多关系
    images = db.relationship('SceneImage', backref='scene', lazy=True, cascade='all, delete-orphan')
    
    def set_characters(self, characters_list):
        """设置角色列表"""
        self.characters = json.dumps(characters_list)
    
    def get_characters(self):
        """获取角色列表"""
        return json.loads(self.characters) if self.characters else []
    
    def set_raw_json(self, json_data):
        """设置原始JSON数据"""
        self.raw_json = json.dumps(json_data)
    
    def get_raw_json(self):
        """获取原始JSON数据"""
        return json.loads(self.raw_json) if self.raw_json else {}
    
    def to_dict(self):
        return {
            'id': self.id,
            'novel_id': self.novel_id,
            'scene_number': self.scene_number,
            'title': self.title,
            'description': self.description,
            'characters': self.get_characters(),
            'setting': self.setting,
            'time': self.time,
            'mood': self.mood,
            'raw_json': self.get_raw_json(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class SceneImage(db.Model):
    """场景图像表，存储生成的漫画图像"""
    __tablename__ = 'scene_images'
    
    id = db.Column(db.Integer, primary_key=True)
    scene_id = db.Column(db.Integer, db.ForeignKey('scenes.id'), nullable=False)
    image_path = db.Column(db.String(500), nullable=False)
    image_type = db.Column(db.String(50), nullable=False)  # 图像类型，如panel, background等
    prompt = db.Column(db.Text, nullable=True)  # 生成图像的提示词
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'scene_id': self.scene_id,
            'image_path': self.image_path,
            'image_type': self.image_type,
            'prompt': self.prompt,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Project(db.Model):
    """项目表，存储漫画项目信息"""
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    novel_id = db.Column(db.Integer, db.ForeignKey('novels.id'), nullable=False)
    style = db.Column(db.String(100), nullable=True)  # 漫画风格
    status = db.Column(db.String(50), default='created')  # 项目状态：created, processing, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 与小说的关系
    novel = db.relationship('Novel', backref='projects', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'novel_id': self.novel_id,
            'style': self.style,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)
