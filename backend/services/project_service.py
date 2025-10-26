from typing import Optional, Dict, Any
from extensions import db
from models import Project
from services.utils import safe_json_dumps, safe_json_loads

def save_project(data: Dict[str, Any]) -> Project:
    project_id = data.get("id")
    if project_id:
        project = Project.query.get(project_id)
        if not project:
            project = Project(name=data.get("name", "未命名项目"))
    else:
        project = Project(name=data.get("name", "未命名项目"))

    project.name = data.get("name", "AI漫画项目")
    project.novel_text = data.get("novel_text", "")
    project.scenes_json = safe_json_dumps(data.get("scenes", []))
    project.visual_spec_json = safe_json_dumps(data.get("visual_spec", {}))
    project.images_json = safe_json_dumps(data.get("images", []))

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
