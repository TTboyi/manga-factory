import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 数据库配置
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'manga_factory')

def create_database():
    """创建数据库（如果不存在）"""
    # 连接到MySQL服务器（不指定数据库）
    engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}")
    
    with engine.connect() as conn:
        # 检查数据库是否存在
        result = conn.execute(text(f"SHOW DATABASES LIKE '{DB_NAME}'"))
        if result.fetchone() is None:
            # 创建数据库
            conn.execute(text(f"CREATE DATABASE {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
            print(f"数据库 '{DB_NAME}' 创建成功")
        else:
            print(f"数据库 '{DB_NAME}' 已存在")
    
    engine.dispose()

def init_tables():
    """初始化表结构"""
    # 导入模型
    from models import db, Novel, Scene, SceneImage, Project
    from app import app
    
    with app.app_context():
        # 创建所有表
        db.create_all()
        print("数据库表创建成功")

if __name__ == '__main__':
    try:
        # 创建数据库
        create_database()
        
        # 初始化表
        init_tables()
        
        print("数据库初始化完成")
    except Exception as e:
        print(f"数据库初始化失败: {str(e)}")
        sys.exit(1)