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
    
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-this")
    JSON_AS_ASCII = False  # 允许中文
    JSON_SORT_KEYS = False

    # DB
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///./project_data.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Doubao LLM (火山方舟)
    DOUBAO_API_KEY = os.getenv("ARK_API_KEY", "")
    DOUBAO_API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
    # 我们会在调用时指定具体model，比如：
    #   doubao-seed-1-6-thinking-250715
    #   doubao-1-5-thinking-pro-250415

    # Qwen Image (通义万相)
    QWEN_API_KEY = os.getenv("DASHSCOPE_API_KEY", "")
    QWEN_CREATE_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
    QWEN_FETCH_URL = "https://dashscope.aliyuncs.com/api/v1/tasks"
    QWEN_MODEL = "qwen-image"  # 你指定的模型

    # 出图分辨率
    STORYBOARD_IMAGE_SIZE = "1472*1140"
    STORYBOARD_IMAGE_N = 1

    # 允许我们后续做异步轮询时的最大等待秒数等（这里先留）
    STORYBOARD_POLL_TIMEOUT_SEC = int(os.getenv("STORYBOARD_POLL_TIMEOUT_SEC", "300"))

    # CORS
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

