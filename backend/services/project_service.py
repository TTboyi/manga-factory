from typing import Optional, Dict, Any
from extensions import db
from models import Project
from services.utils import safe_json_dumps, safe_json_loads


def save_project(data: Dict[str, Any]) -> Project:
    """
    data示例：
    {
      "id": optional,
      "name": "AI漫画项目",
      "novel_text": "...",
      "scenes": [...],
      "visual_spec": {...},
      "images": [...]
    }
    我们不偷懒：如给了id则更新，否则创建。
    """
    project_id = data.get("id")
    if project_id:
        project = Project.query.get(project_id)
        if not project:
            project = Project(name=data.get("name", "未命名项目"))
    else:
        project = Project(name=data.get("name", "未命名项目"))

    # 更新字段
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

    db.session.add(project)
    db.session.commit()
    return project


def get_project_full(project_id: int) -> Optional[Dict[str, Any]]:
    project = Project.query.get(project_id)
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
