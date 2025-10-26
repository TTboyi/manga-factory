
from flask import Flask
from config import Config
from extensions import db, jwt
from routes.auth import auth_bp
#from routes.scene import scene_bp
from routes.captcha import captcha_bp
from routes.text_routes import text_bp
from routes.scene_routes import scene_bp
from routes.visual_routes import visual_bp
from routes.image_routes import image_bp
from routes.project_routes import project_bp
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask import jsonify
from dotenv import load_dotenv
load_dotenv()





jwt = JWTManager()

@jwt.invalid_token_loader
def invalid_token_callback(reason):
    print("❌ Invalid token:", reason)
    return jsonify({"code": 401, "message": f"Token 无效: {reason}"}), 401

@jwt.unauthorized_loader
def missing_token_callback(reason):
    print("❌ Missing token:", reason)
    return jsonify({"code": 401, "message": f"未提供 Token: {reason}"}), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print("⚠️ Token 已过期:", jwt_payload)
    return jsonify({"code": 401, "message": "登录状态已过期"}), 401






def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    # CORS
    CORS(
        app,
        resources={r"*": {"origins": [Config.FRONTEND_ORIGIN, "http://localhost:5173"]}},
        supports_credentials=True,
    )

    # 注册扩展
    db.init_app(app)
    with app.app_context():
        db.create_all()
    jwt.init_app(app)

    # 注册蓝图（✅ 加前缀）
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(captcha_bp, url_prefix="/captcha")
    #app.register_blueprint(scene_bp, url_prefix="/api/scene")
    # 蓝图
    app.register_blueprint(text_bp)
    app.register_blueprint(visual_bp)
    app.register_blueprint(image_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(scene_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return {"ok": True}


    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)

    
