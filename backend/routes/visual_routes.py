import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from services.visual_service import analyze_visual_spec_full
from config import Config

visual_bp = Blueprint("visual_bp", __name__, url_prefix="/visual")

VISUAL_UPLOAD_DIR = "./uploads/visual"
os.makedirs(VISUAL_UPLOAD_DIR, exist_ok=True)


@visual_bp.route("/analyze", methods=["POST"])
def analyze_visual():
    """
    接收:
      role_text
      style_text
      novel_text (可选：为了更好的分析，如果前端有全书就传)
      role_image (file 可选)
      style_image (file 可选)

    返回:
      visual_spec 对象:
      {
        "role_features": "...",
        "art_style": "...",
        "reference_images": [...],
        "prompt_tags": [...],
        "notes": ""
      }
    """
    # multipart/form-data
    role_text = request.form.get("role_text", "")
    style_text = request.form.get("style_text", "")
    novel_text = request.form.get("novel_text", "")  # 前端后面可以传整本小说给它加上下文

    role_img_urls = []
    style_img_urls = []

    if "role_image" in request.files:
        rf = request.files["role_image"]
        if rf and rf.filename:
            fn = secure_filename(rf.filename)
            fp = os.path.join(VISUAL_UPLOAD_DIR, fn)
            rf.save(fp)
            # 这里简单用本地相对路径，实际生产建议你换成OSS/云存储
            role_img_urls.append(fp)

    if "style_image" in request.files:
        sf = request.files["style_image"]
        if sf and sf.filename:
            fn = secure_filename(sf.filename)
            fp = os.path.join(VISUAL_UPLOAD_DIR, fn)
            sf.save(fp)
            style_img_urls.append(fp)

    visual_spec = analyze_visual_spec_full(
        novel_text=novel_text,
        user_role_hint=role_text,
        user_style_hint=style_text,
        role_image_urls=role_img_urls,
        style_image_urls=style_img_urls,
    )

    return jsonify(visual_spec)
