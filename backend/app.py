from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from models import db, Novel, Scene, Project
from services.doubao_service import DoubaoService

# 加载环境变量
load_dotenv()

# 创建Flask应用
app = Flask(__name__)
CORS(app)  # 启用CORS以支持前端跨域请求

# 配置
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# 数据库配置
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER', 'root')}:{os.getenv('DB_PASSWORD', '')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME', 'manga_factory')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化数据库
db.init_app(app)

# 初始化豆包服务
doubao_service = DoubaoService()

# 确保上传文件夹存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 允许的文件扩展名
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'epub', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 基础路由
@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({"status": "healthy", "message": "Manga Factory API is running"})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """处理文件上传"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # 生成唯一文件名
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # 保存文件
        file.save(file_path)
        
        # 读取文件内容（这里简化处理，实际应根据文件类型进行解析）
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='gbk') as f:
                    content = f.read()
            except Exception as e:
                return jsonify({"error": f"无法读取文件内容: {str(e)}"}), 400
        
        # 创建小说记录
        novel = Novel(
            title=filename,
            content=content,
            file_path=file_path,
            file_type=filename.rsplit('.', 1)[1].lower()
        )
        
        db.session.add(novel)
        db.session.commit()
        
        return jsonify({
            "message": "File uploaded successfully", 
            "novel_id": novel.id,
            "title": novel.title
        })
    else:
        return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/text', methods=['POST'])
def submit_text():
    """处理文本输入"""
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    title = data.get('title', 'Untitled Novel')
    content = data['text']
    
    # 创建小说记录
    novel = Novel(
        title=title,
        content=content,
        file_path=None,
        file_type=None
    )
    
    db.session.add(novel)
    db.session.commit()
    
    return jsonify({
        "message": "Text submitted successfully", 
        "novel_id": novel.id,
        "title": novel.title
    })

@app.route('/api/extract-scenes', methods=['POST'])
def extract_scenes():
    """从小说文本中提取场景"""
    data = request.get_json()
    
    if not data or 'novel_id' not in data:
        return jsonify({"error": "No novel_id provided"}), 400
    
    novel_id = data['novel_id']
    max_scenes = data.get('max_scenes', 10)
    
    # 查询小说
    novel = Novel.query.get(novel_id)
    if not novel:
        return jsonify({"error": "Novel not found"}), 404
    
    # 调用豆包服务提取场景
    try:
        scenes_data = doubao_service.extract_scenes_from_novel(novel.content, max_scenes)
        
        if not scenes_data:
            return jsonify({"error": "Failed to extract scenes"}), 500
        
        # 验证和修正场景数据
        validated_scenes = doubao_service.validate_and_fix_scene_json(scenes_data)
        
        # 保存场景到数据库
        saved_scenes = []
        for scene_data in validated_scenes:
            scene = Scene(
                novel_id=novel.id,
                scene_number=scene_data.get('scene_id', len(saved_scenes) + 1),
                title=scene_data.get('title', f"场景{len(saved_scenes) + 1}"),
                description=scene_data.get('description', ''),
                setting=scene_data.get('setting', ''),
                time=scene_data.get('time', ''),
                mood=scene_data.get('mood', '')
            )
            
            # 设置角色和原始JSON数据
            scene.set_characters(scene_data.get('characters', []))
            scene.set_raw_json(scene_data)
            
            db.session.add(scene)
            db.session.commit()
            
            saved_scenes.append(scene.to_dict())
        
        return jsonify({
            "message": f"Successfully extracted {len(saved_scenes)} scenes",
            "scenes": saved_scenes
        })
        
    except Exception as e:
        return jsonify({"error": f"Scene extraction failed: {str(e)}"}), 500

@app.route('/api/novels/<int:novel_id>/scenes', methods=['GET'])
def get_scenes(novel_id):
    """获取小说的所有场景"""
    novel = Novel.query.get(novel_id)
    if not novel:
        return jsonify({"error": "Novel not found"}), 404
    
    scenes = Scene.query.filter_by(novel_id=novel_id).order_by(Scene.scene_number).all()
    
    return jsonify({
        "novel": novel.to_dict(),
        "scenes": [scene.to_dict() for scene in scenes]
    })

@app.route('/api/novels', methods=['GET'])
def get_novels():
    """获取所有小说列表"""
    novels = Novel.query.all()
    return jsonify({
        "novels": [novel.to_dict() for novel in novels]
    })

@app.route('/api/projects', methods=['POST'])
def create_project():
    """创建新项目"""
    data = request.get_json()
    
    if not data or 'novel_id' not in data or 'name' not in data:
        return jsonify({"error": "Missing required fields: novel_id, name"}), 400
    
    novel_id = data['novel_id']
    name = data['name']
    description = data.get('description', '')
    style = data.get('style', 'manga')
    
    # 检查小说是否存在
    novel = Novel.query.get(novel_id)
    if not novel:
        return jsonify({"error": "Novel not found"}), 404
    
    # 创建项目
    project = Project(
        name=name,
        description=description,
        novel_id=novel_id,
        style=style,
        status='created'
    )
    
    db.session.add(project)
    db.session.commit()
    
    return jsonify({
        "message": "Project created successfully",
        "project": project.to_dict()
    })

# 初始化数据库
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)