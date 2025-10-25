from typing import Optional, Dict, Any, List
from services.doubao_client import call_doubao
from services.utils import merge_visual_spec

def build_role_analysis_prompt(novel_text: str, user_role_hint: str) -> list:
    """
    构造发送给豆包的 messages，用于角色特征汇总。
    我们严格按照豆包文档格式: system / user。
    """
    system_msg = {
        "role": "system",
        "content": (
            "你是视觉设定分析助手。"
            "你需要根据小说全文和用户的额外描述，总结主要角色的外貌、性格、服饰、年龄、体态、标志性特征。"
            "请输出一段清晰可执行的美术指导文本，面向画师/图像模型。"
        )
    }
    user_msg = {
        "role": "user",
        "content": (
            f"【小说全文片段】:\n{novel_text}\n\n"
            f"【用户额外角色设定补充】:\n{user_role_hint}\n\n"
            "请给出整合后的统一角色设定（不要重复啰嗦，把冲突的描述裁剪成一个一致版本）："
        )
    }
    return [system_msg, user_msg]


def build_style_analysis_prompt(novel_text: str, user_style_hint: str) -> list:
    """
    构造发送给豆包的 messages，用于画面风格汇总。
    """
    system_msg = {
        "role": "system",
        "content": (
            "你是画面/画风分析助手。"
            "请基于小说整体氛围 + 用户给的画风描述，输出最终统一画风规范。"
            "需要涵盖：画风类型(如厚涂/日漫/写实/国漫等)、色调、镜头语言、质感。"
            "请用一段连续文字说明，面向AI出图模型。"
        )
    }
    user_msg = {
        "role": "user",
        "content": (
            f"【小说全文片段】:\n{novel_text}\n\n"
            f"【用户希望的画风/镜头气质补充】:\n{user_style_hint}\n\n"
            "请给出统一的画面风格设定，不要只列点，而是完整陈述："
        )
    }
    return [system_msg, user_msg]


def analyze_visual_spec_full(
    novel_text: str,
    user_role_hint: str,
    user_style_hint: str,
    role_image_urls: Optional[List[str]] = None,
    style_image_urls: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    返回视觉规范对象 visual_spec。
    """

    if role_image_urls is None:
        role_image_urls = []
    if style_image_urls is None:
        style_image_urls = []

    # 角色特征
    role_messages = build_role_analysis_prompt(novel_text, user_role_hint)
    role_desc = call_doubao(
        model="doubao-seed-1-6-thinking-250715",
        messages=role_messages,
        max_tokens=2048,
    )

    # 风格特征
    style_messages = build_style_analysis_prompt(novel_text, user_style_hint)
    style_desc = call_doubao(
        model="doubao-1-5-thinking-pro-250415",
        messages=style_messages,
        max_tokens=2048,
    )

    visual_spec = merge_visual_spec(
        role_part=role_desc,
        style_part=style_desc,
        role_images=role_image_urls,
        style_images=style_image_urls,
    )

    return visual_spec
