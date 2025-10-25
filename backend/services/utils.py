import json
from typing import List, Dict, Any
import re


def safe_json_dumps(obj: Any) -> str:
    return json.dumps(obj, ensure_ascii=False)


def safe_json_loads(s: str) -> Any:
    if not s:
        return None
    try:
        return json.loads(s)
    except json.JSONDecodeError:
        return None


def parse_scenes_from_llm(text: str) -> List[Dict[str, Any]]:
    """
    场景识别模型的输出我们会引导它按结构列出分镜。
    为了稳，我们这里做一个宽松解析：
    - 支持形如:
      1. 场景标题: XXX
         场景描述: YYY
    - 或者JSON片段（如果LLM已经输出成JSON我们就直接load）

    这里不做简化：我们实现两种fallback。
    """
    # 先尝试直接json解析
    try:
        data = json.loads(text)
        # 期望 data 是 list[ {id,title,description,...} ]
        if isinstance(data, list):
            # 强化字段
            normalized = []
            for idx, item in enumerate(data):
                normalized.append({
                    "id": str(item.get("id", idx+1)),
                    "title": item.get("title") or item.get("场景标题") or f"场景{idx+1}",
                    "description": item.get("description") or item.get("场景描述") or "",
                })
            return normalized
    except Exception:
        pass

    # fallback: 基于正则的分段解析
    blocks = re.split(r"\n\s*(?=\d+\s*[\.、])", text.strip())
    scenes = []
    for i, block in enumerate(blocks, start=1):
        block = block.strip()
        if not block:
            continue
        # 把第一行可能的 "1." / "2、" 之类去掉
        block = re.sub(r"^\d+\s*[\.、]\s*", "", block)
        # 拆title/desc
        # 简单策略：第一行做title，其余拼成desc
        lines = block.splitlines()
        title = lines[0].strip()
        desc = "\n".join(lines[1:]).strip()
        scenes.append({
            "id": str(i),
            "title": title,
            "description": desc,
        })
    return scenes


def merge_visual_spec(
    role_part: str,
    style_part: str,
    role_images: List[str],
    style_images: List[str],
) -> Dict[str, Any]:
    """
    视觉规范对象：
    - role_features (角色特征总结文本)
    - art_style (画风特征总结文本)
    - reference_images: 全部参考图url
    - notes / prompt_tags 先预留字段
    不做简化，全部打包返回。
    """
    return {
        "role_features": role_part,
        "art_style": style_part,
        "reference_images": list(filter(None, role_images + style_images)),
        "prompt_tags": [],
        "notes": ""
    }
