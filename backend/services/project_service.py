# services/project_service.py
from typing import Optional, Dict, Any
from extensions import db
from models import Project
from services.utils import safe_json_dumps, safe_json_loads
from datetime import datetime

def save_project(data: Dict[str, Any], user_id: int) -> Project:
    """
    data 示例：
    {
      "id": optional,
      "name": "AI漫画项目",
      "novel_text": "...",
      "scenes": [...],
      "visual_spec": {...},
      "images": [...]
    }
    - 如果传了 id 就更新对应的项目（必须是该用户的）
    - 否则创建新的项目并绑定 user_id
    """

    project_id = data.get("id")
    if project_id:
        # 只能更新自己的项目
        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            # 没权限或不存在 -> 新建一个新的（更安全的选择是直接报错，你按需求决定）
            project = Project(user_id=user_id, name=data.get("name", "未命名项目"))
    else:
        project = Project(user_id=user_id, name=data.get("name", "未命名项目"))

    # 字段更新
    if "name" in data and data["name"]:
        project.name = data["name"]

    if "novel_text" in data:
        project.novel_text = data["novel_text"]

    if "scenes" in data:
        project.scenes_json = safe_json_dumps(data["scenes"])

    if "visual_spec" in data:
        project.visual_spec_json = safe_json_dumps(data["visual_spec"])

    if "images" in data:
        project.images_json = safe_json_dumps(data["images"])

    project.updated_at = datetime.utcnow()

    db.session.add(project)
    db.session.commit()
    return project


def get_project_full(project_id: int, user_id: int) -> Optional[Dict[str, Any]]:
    """
    确保只能查到属于当前用户的项目
    """
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return None

    return {
        "id": project.id,
        "name": project.name,
        "novel_text": project.novel_text,
        "scenes": safe_json_loads(project.scenes_json) or [],
        "visual_spec": safe_json_loads(project.visual_spec_json) or {},
        "images": safe_json_loads(project.images_json) or [],
        "created_at": project.created_at.isoformat() if project.created_at else None,
        "updated_at": project.updated_at.isoformat() if project.updated_at else None,
    }


def list_projects_by_user(user_id: int):
    """
    返回该用户的所有项目，按更新时间倒序
    """
    projects = (
        Project.query
        .filter_by(user_id=user_id)
        .order_by(Project.updated_at.desc())
        .all()
    )

    result = []
    for p in projects:
        result.append({
            "id": p.id,
            "name": p.name,
            "updated_at": p.updated_at.strftime("%Y-%m-%d %H:%M") if p.updated_at else "",
            "preview_text": (p.novel_text or "")[:100],  # 给前端卡片展示的摘要
            "image_cover": (safe_json_loads(p.images_json) or [None])[0],  # 第一张图当封面
        })
    return result
