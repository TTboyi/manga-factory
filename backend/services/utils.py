import os
import json
import re
from typing import Any, List, Dict

PROMPT_DIR = "./prompts"

def load_prompt(filename: str) -> str:
    """
    从 prompts 目录读取指定的 .md 文件并返回完整内容。
    不做任何简化或过滤。
    """
    path = os.path.join(PROMPT_DIR, filename)
    print(path)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Prompt file not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def safe_json_dumps(obj: Any) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)


def safe_json_loads(s: str) -> Any:
    if not s:
        return None
    try:
        return json.loads(s)
    except json.JSONDecodeError:
        return None


def parse_scenes_from_llm(text: str) -> List[Dict[str, Any]]:
    """
    解析豆包返回的场景识别结果：
    1. 若为JSON数组，直接解析；
    2. 若为编号文本或半结构化格式，用正则拆分；
    """
    # 优先尝试 JSON
    try:
        data = json.loads(text)
        if isinstance(data, list):
            normalized = []
            for idx, item in enumerate(data):
                normalized.append({
                    "id": str(item.get("shot_id", idx + 1)),
                    "title": item.get("title") or f"场景{idx+1}",
                    "description": json.dumps(item.get("description"), ensure_ascii=False, indent=2)
                    if isinstance(item.get("description"), dict)
                    else (item.get("description") or "")
                })
            return normalized
    except Exception:
        pass

    # Fallback：纯文本编号模式
    blocks = re.split(r"\n\s*(?=\d+\s*[\.、])", text.strip())
    scenes = []
    for i, block in enumerate(blocks, start=1):
        block = re.sub(r"^\d+\s*[\.、]\s*", "", block.strip())
        if not block:
            continue
        lines = block.splitlines()
        title = lines[0].strip() if lines else f"场景{i}"
        desc = "\n".join(lines[1:]).strip() if len(lines) > 1 else ""
        scenes.append({
            "id": str(i),
            "title": title,
            "description": desc,
        })
    return scenes


def merge_visual_spec(role_part: str, style_part: str, role_images: List[str], style_images: List[str]) -> Dict[str, Any]:
    """
    合并视觉规范对象。
    """
    return {
        "role_features": role_part,
        "art_style": style_part,
        "reference_images": list(filter(None, role_images + style_images)),
        "prompt_tags": [],
        "notes": ""
    }
