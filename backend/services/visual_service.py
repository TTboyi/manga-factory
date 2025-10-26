from typing import Optional, Dict, Any, List
from services.utils import merge_visual_spec, load_prompt
from services.doubao_client import call_doubao

def analyze_visual_spec_full(
    novel_text: str,
    user_role_hint: str,
    user_style_hint: str,
    role_image_urls: Optional[List[str]] = None,
    style_image_urls: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Step2：
    视觉规范分析：
      1️⃣ 角色特征（全文分析 + 用户提示 → 合并）
      2️⃣ 风格特征（全文分析 + 用户提示 → 合并）
    """

    role_image_urls = role_image_urls or []
    style_image_urls = style_image_urls or []

    # ==== 角色分析 ====
    full_role_prompt = load_prompt("基于全文的角色分析.md")
    user_role_prompt = load_prompt("基于用户提示的角色分析.md")

    role_full = call_doubao(
        model="doubao-seed-1-6-flash-250828",
        messages=[
            {"role": "system", "content": full_role_prompt},
            {"role": "user", "content": f"小说文本：\n{novel_text}"}
        ],
        max_tokens=4096
    )

    role_user = call_doubao(
        model="doubao-seed-1-6-flash-250828",
        messages=[
            {"role": "system", "content": user_role_prompt},
            {"role": "user", "content": f"用户角色设定：\n{user_role_hint}"}
        ],
        max_tokens=4096
    )

    role_merge = call_doubao(
        model="doubao-seed-1-6-flash-250828",
        messages=[
            {"role": "system", "content": "你是角色特征整合专家，请将以下两份角色设定融合为统一一致版本，消除矛盾并补全遗漏。"},
            {"role": "user", "content": f"【全文分析】\n{role_full}\n\n【用户分析】\n{role_user}"}
        ],
        max_tokens=4096
    )

    # ==== 风格分析 ====
    full_style_prompt = load_prompt("基于全文的风格分析.md")
    user_style_prompt = load_prompt("基于用户提示的风格分析.md")

    style_full = call_doubao(
        model="doubao-seed-1-6-flash-250828",
        messages=[
            {"role": "system", "content": full_style_prompt},
            {"role": "user", "content": f"小说文本：\n{novel_text}"}
        ],
        max_tokens=4096
    )

    style_user = call_doubao(
        model="doubao-seed-1-6-flash-250828",
        messages=[
            {"role": "system", "content": user_style_prompt},
            {"role": "user", "content": f"用户风格设定：\n{user_style_hint}"}
        ],
        max_tokens=4096
    )

    style_merge = call_doubao(
        model="doubao-seed-1-6-flash-250828",
        messages=[
            {"role": "system", "content": "你是风格整合专家，请将两份风格设定合并为统一连贯版本，整合关键词、镜头语言和氛围表达。"},
            {"role": "user", "content": f"【全文风格分析】\n{style_full}\n\n【用户风格分析】\n{style_user}"}
        ],
        max_tokens=4096
    )

    return merge_visual_spec(role_merge, style_merge, role_image_urls, style_image_urls)
