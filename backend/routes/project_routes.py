from flask import Blueprint, request, jsonify
from services.project_service import save_project, get_project_full

project_bp = Blueprint("project_bp", __name__, url_prefix="/project")


@project_bp.route("/save", methods=["POST"])
def save_project_route():
    """
    Body:
    {
      "id": optional,
      "name": "AI漫画项目",
      "novel_text": "...",
      "scenes": [...],
      "visual_spec": {...},
      "images": [...]
    }
    Return:
    { "success": true, "project_id": 123 }
    """
    data = request.get_json(force=True)
    proj = save_project(data)
    return jsonify({
        "success": True,
        "project_id": proj.id
    })


@project_bp.route("/get_full/<int:pid>", methods=["GET"])
def get_full_project_route(pid: int):
    full = get_project_full(pid)
    if not full:
        return jsonify({"error": "not found"}), 404
    return jsonify(full)
