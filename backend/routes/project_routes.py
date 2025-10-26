# routes/project_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.project_service import (
    save_project,
    get_project_full,
    list_projects_by_user,
)
from utils.response_utils import success, error  # 你现有的封装: success(data?, msg?), error(msg, code?)

project_bp = Blueprint("project_bp", __name__, url_prefix="/project")


@project_bp.route("/save", methods=["POST"])
@jwt_required()
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
    user_id = get_jwt_identity()
    data = request.get_json(force=True)

    proj = save_project(data, user_id=int(user_id))
    return success({
        "project_id": proj.id
    }, "保存成功")


@project_bp.route("/get_full/<int:pid>", methods=["GET"])
@jwt_required()
def get_full_project_route(pid: int):
    """
    只能拿到属于当前登录用户的项目
    """
    user_id = get_jwt_identity()
    full = get_project_full(pid, user_id=int(user_id))
    if not full:
        return error("not found or no permission", 404)
    return success(full, "获取成功")


@project_bp.route("/my_list", methods=["GET"])
@jwt_required()
def my_list_route():
    """
    返回当前用户的项目列表（用于前端“我的项目”卡片网格）
    """
    user_id = get_jwt_identity()
    rows = list_projects_by_user(int(user_id))
    return success({
        "projects": rows
    }, "获取成功")
