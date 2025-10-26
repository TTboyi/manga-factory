from flask import Blueprint, request, jsonify
from services.utils import load_prompt, parse_scenes_from_llm
from services.doubao_client import call_doubao

scene_bp = Blueprint("scene_bp", __name__, url_prefix="/scene")

@scene_bp.route("/recognize", methods=["POST"])
def recognize_scenes():
    """
    Step3 第一阶段：场景识别
    输入:
    {
      "novel_text": "...",
      "visual_spec": {...},
      "num_shots": optional int
    }
    输出:
    { "scenes": [ {id,title,description}, ... ] }
    """
    data = request.get_json(force=True)
    novel_text = data.get("novel_text", "")
    visual_spec = data.get("visual_spec", {})
    num_shots = data.get("num_shots")

    if not novel_text.strip():
        return jsonify({"error": "Empty novel_text"}), 400

    system_prompt = load_prompt("场景识别.md")

    limit_clause = f"请将全书划分为 {num_shots} 个分镜。" if num_shots else "请根据情节自行决定分镜数量。"

    user_content = (
        f"{limit_clause}\n\n"
        "【角色描述】\n"
        f"{visual_spec.get('role_features','')}\n\n"
        "【画风描述】\n"
        f"{visual_spec.get('art_style','')}\n\n"
        "【小说正文】\n"
        f"{novel_text}"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_content}
    ]

    raw = call_doubao(
        model="doubao-seed-1-6-thinking-250715",
        messages=messages,
        max_tokens=8192
    )

    scenes = parse_scenes_from_llm(raw)
    return jsonify({"scenes": scenes})
