import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from services.doubao_client import call_doubao
from services.utils import parse_scenes_from_llm
from config import Config

text_bp = Blueprint("text_bp", __name__, url_prefix="/text")

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _extract_scenes(novel_text: str):
    """
    调用豆包做【场景识别.md】提示词。
    返回Scene[].
    """
    system_msg = {
        "role": "system",
        "content": (
            "你是分镜场景拆解助手。请把长篇小说内容拆成一个个‘分镜场景片段’，"
            "每个片段描述发生的时间/地点/主要人物/关键动作画面。"
            "请用JSON数组输出，每个元素形如："
            "{ \"id\": \"1\", \"title\": \"场景标题\", \"description\": \"画面描述\" }"
        )
    }
    user_msg = {
        "role": "user",
        "content": (
            f"下面是小说内容，请进行分镜拆分：\n{novel_text}\n"
            "请直接给我JSON数组，不要多余解释。"
        )
    }

    raw = call_doubao(
        model="doubao-seed-1-6-thinking-250715",
        messages=[system_msg, user_msg],
        max_tokens=4096,
    )
    scenes = parse_scenes_from_llm(raw)
    return scenes


@text_bp.route("/generate_novel", methods=["POST"])
def generate_novel():
    """
    输入：{ "text": "...(用户贴的原始文本)" }
    处理：
      1. 用豆包(高质量模型)做清洗/续写/整合成规范小说文本（调用 小说生成.md 思路）
      2. 调用 _extract_scenes 得到场景数组
    输出：
      { "novel_text": "...", "scenes": [ ... ] }
    """
    data = request.get_json(force=True)
    user_raw_text = data.get("text", "")

    # 1. 用豆包整理小说全文
    sys_msg = {
        "role": "system",
        "content": (
            "你是小说润色和补全助手。"
            "把用户提供的文本整理成一段连贯的小说内容，纠正口语、补充缺失代词、"
            "保持叙事风格，勿跳脱原设定。输出成连贯中文小说正文。"
        ),
    }
    usr_msg = {
        "role": "user",
        "content": f"用户原始文本：\n{user_raw_text}\n\n请整理成正式小说文本：",
    }

    novel_text = call_doubao(
        model="doubao-1-5-thinking-pro-250415",
        messages=[sys_msg, usr_msg],
        max_tokens=8192,
    )

    # 2. 场景识别
    scenes = _extract_scenes(novel_text)

    return jsonify({
        "novel_text": novel_text,
        "scenes": scenes
    })


@text_bp.route("/upload", methods=["POST"])
def upload_file():
    """
    上传文档文件(txt/doc/docx)，后端读取成文本，再走 generate_novel 的流程。
    """
    if "file" not in request.files:
        return jsonify({"error": "no file"}), 400

    f = request.files["file"]
    filename = secure_filename(f.filename)
    filepath = os.path.join(UPLOAD_DIR, filename)
    f.save(filepath)

    # 简单读取txt/docx内容:
    # 这里我们不偷偷跳过doc/docx解析。我们先处理txt，
    # 对于doc/docx你后面可以接python-docx等库，这里先留TODO。
    text_content = ""
    if filename.lower().endswith(".txt"):
        with open(filepath, "r", encoding="utf-8", errors="ignore") as rf:
            text_content = rf.read()
    else:
        # TODO: .doc/.docx解析，后续接python-docx等
        with open(filepath, "rb") as rf:
            text_content = rf.read().decode("utf-8", errors="ignore")

    # 直接复用 generate_novel 的逻辑
    sys_msg = {
        "role": "system",
        "content": (
            "你是小说润色和补全助手。"
            "把用户提供的文本整理成一段连贯的小说内容，纠正口语、补充缺失代词、"
            "保持叙事风格，勿跳脱原设定。输出成连贯中文小说正文。"
        ),
    }
    usr_msg = {
        "role": "user",
        "content": f"用户原始文本：\n{text_content}\n\n请整理成正式小说文本：",
    }

    novel_text = call_doubao(
        model="doubao-1-5-thinking-pro-250415",
        messages=[sys_msg, usr_msg],
        max_tokens=8192,
    )

    scenes = _extract_scenes(novel_text)

    return jsonify({
        "novel_text": novel_text,
        "scenes": scenes
    })


@text_bp.route("/scene_recognition", methods=["POST"])
def scene_recognition():
    """
    输入：{ "text": "小说全文" }
    输出：{ "scenes": [...] }
    """
    data = request.get_json(force=True)
    novel_text = data.get("text", "")
    scenes = _extract_scenes(novel_text)
    return jsonify({"scenes": scenes})
