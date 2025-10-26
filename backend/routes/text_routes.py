import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from services.utils import load_prompt
from services.doubao_client import call_doubao

text_bp = Blueprint("text_bp", __name__, url_prefix="/text")
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@text_bp.route("/generate_novel", methods=["POST"])
def generate_novel():
    """
    Step1:
    输入: { "text": "小说全文或大纲" }
    使用: prompts/小说生成.md
    自动判断输入内容类型:
      - 若为大纲 => 扩写成小说全文；
      - 若为小说 => 润色补全。
    输出: { "novel_text": "..." }
    """
    data = request.get_json(force=True)
    user_text = data.get("text", "").strip()
    if not user_text:
        return jsonify({"error": "Empty input text"}), 400

    system_prompt = load_prompt("小说生成.md")

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"请根据以下文本执行任务（自动判断是大纲或小说）：\n\n{user_text}"}
    ]

    novel_text = call_doubao(
        model="doubao-1-5-thinking-pro-250415",
        messages=messages,
        max_tokens=8192
    )

    return jsonify({"novel_text": novel_text})


@text_bp.route("/upload", methods=["POST"])
def upload_file():
    """
    上传文档文件(txt/doc/docx)，后端读取成文本，再走 generate_novel 的逻辑。
    """
    if "file" not in request.files:
        return jsonify({"error": "no file"}), 400

    f = request.files["file"]
    filename = secure_filename(f.filename)
    filepath = os.path.join(UPLOAD_DIR, filename)
    f.save(filepath)

    text_content = ""
    if filename.lower().endswith(".txt"):
        with open(filepath, "r", encoding="utf-8", errors="ignore") as rf:
            text_content = rf.read()
    else:
        with open(filepath, "rb") as rf:
            text_content = rf.read().decode("utf-8", errors="ignore")

    system_prompt = load_prompt("小说生成.md")
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"请根据以下文本执行任务（自动判断是大纲或小说）：\n\n{text_content}"}
    ]

    novel_text = call_doubao(
        model="doubao-1-5-thinking-pro-250415",
        messages=messages,
        max_tokens=8192
    )

    return jsonify({"novel_text": novel_text})
