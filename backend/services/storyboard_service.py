import time
import requests
from typing import List, Dict, Any
from config import Config
from services.doubao_client import call_doubao
import json


# ================== 文本安全过滤 ==================
def sanitize_text(text: str) -> str:
    """
    基础敏感词过滤，防止触发 DataInspectionFailed
    """
    banned = [
        "血", "枪", "死亡", "裸", "杀", "暴力", "尸", "宗教", "战争",
        "性", "吻", "毒", "酒", "吸烟", "恐怖", "爆炸", "暗杀"
    ]
    for word in banned:
        text = text.replace(word, "＊")
    return text


def refine_scene_for_image(scene_text: str) -> str:
    """
    当 prompt 被审核拒绝时调用，使用豆包模型自动改写安全描述
    """
    prompt = (
        "请将以下场景描述改写为安全、积极、健康的画面提示，"
        "去除血腥、暴力、裸露、宗教或政治内容，只保留叙事性画面与情感氛围：\n\n"
        f"{scene_text}"
    )
    try:
        refined = call_doubao(
            model="doubao-seed-1-6-thinking-250715",   # ✅ 你想用的豆包模型名称
            messages=[
                {"role": "system", "content": "你是一个负责任的安全改写助手，擅长将可能违规的文本改写为健康安全的描述。"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1024
        )
        print("[豆包改写成功]")
        return refined.strip()
    except Exception as e:
        print(f"[豆包改写失败，使用原文本]: {e}")
        return scene_text




# ================== 构建单个分镜 Prompt ==================
def build_image_prompt_for_scene(scene: Dict[str, Any], visual_spec: Dict[str, Any]) -> str:
    role_part = visual_spec.get("role_features", "")
    style_part = visual_spec.get("art_style", "")

    # 🔸 统一风格锚：建议使用一种风格标签（比如“电影写实风格”或“日系动画风格”）
    global_style_anchor = (
        "画风统一要求：保持相同的镜头语言、色调、光影与人物造型风格。"
        "所有分镜画面应属于同一作品世界观，不要在写实、动画、插画之间切换。"
        "建议维持为：电影感写实风格，带有柔和光影、自然色调。"
    )

    scene_desc = sanitize_text(scene.get("description", ""))
    title = sanitize_text(scene.get("title", ""))

    prompt = (
        f"分镜标题：{title}\n"
        f"分镜内容描述：{scene_desc}\n\n"
        f"角色设定（必须遵守）：{role_part}\n\n"
        f"画面风格（必须遵守）：{style_part}\n\n"
        f"{global_style_anchor}\n\n"
        "请生成单帧关键画面，中景/半身或全景由你判断最能叙事的构图，"
        "要求清晰、细节丰富、主体完整，不要裁掉主要角色的头部或脸。"
    )
    return prompt



# ================== 创建 DashScope 图像生成任务 ==================
def qwen_create_task(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {Config.QWEN_API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable"
    }

    payload = {
        "model": Config.QWEN_MODEL,  # 推荐 "wan2.2-t2i-plus"
        "input": {"prompt": prompt},
        "parameters": {
            "size": Config.STORYBOARD_IMAGE_SIZE,
            "n": Config.STORYBOARD_IMAGE_N,
        }
    }

    resp = requests.post(Config.QWEN_CREATE_URL, headers=headers, json=payload, timeout=180)
    print(f"[创建任务] 状态码: {resp.status_code}, 返回: {resp.text[:300]}")

    if resp.status_code == 400 and "DataInspectionFailed" in resp.text:
        raise RuntimeError("DataInspectionFailed")

    resp.raise_for_status()
    data = resp.json()
    task_id = data.get("output", {}).get("task_id")

    if not task_id:
        raise RuntimeError(f"创建任务失败，返回数据异常: {data}")

    return task_id


# ================== 轮询任务结果 ==================
def qwen_poll_task(task_id: str, timeout_sec: int) -> List[str]:
    headers = {
        "Authorization": f"Bearer {Config.QWEN_API_KEY}",
        "Content-Type": "application/json",
    }
    url = f"{Config.QWEN_FETCH_URL}/{task_id}"

    start_time = time.time()
    while time.time() - start_time < timeout_sec:
        resp = requests.get(url, headers=headers, timeout=60)
        print(f"[轮询] 状态码: {resp.status_code}, 返回: {resp.text[:300]}")

        if resp.status_code == 400:
            print(f"[DashScope] 任务 {task_id} 返回400，可能已过期或失败: {resp.text}")
            time.sleep(5)
            continue

        resp.raise_for_status()
        data = resp.json()
        output = data.get("output", {})
        status = output.get("task_status") or data.get("task_status")

        if status == "SUCCEEDED":
            results = output.get("results", [])
            urls = [r.get("url") for r in results if r.get("url")]
            if not urls:
                print(f"[DashScope] 成功但无URL: {data}")
            return urls

        elif status == "FAILED":
            print(f"[DashScope] 任务失败: {data}")
            raise RuntimeError(f"任务 {task_id} 执行失败")

        elif status in ["PENDING", "RUNNING"]:
            print(f"[DashScope] {task_id} 状态: {status}，继续轮询...")
            time.sleep(5)
            continue

        else:
            print(f"[DashScope] 未知状态 {status}，原始返回: {data}")
            time.sleep(5)

    raise TimeoutError(f"任务 {task_id} 超时未完成。")


# ================== 主入口：生成所有分镜 ==================
def generate_storyboard_images(
    novel_text: str,
    scenes: List[Dict[str, Any]],
    visual_spec: Dict[str, Any],
) -> Dict[str, Any]:
    images_all: List[str] = []
    prompts_all: List[str] = []

    for i, scene in enumerate(scenes, start=1):
        print(f"\n========== 开始生成第 {i}/{len(scenes)} 张图 ==========")
        scene_prompt = build_image_prompt_for_scene(scene, visual_spec)
        prompts_all.append(scene_prompt)

        try:
            task_id = qwen_create_task(scene_prompt)
            urls = qwen_poll_task(task_id, timeout_sec=Config.STORYBOARD_POLL_TIMEOUT_SEC)
            images_all.extend(urls)
            print(f"[成功] 第 {i} 张生成完成: {urls}")

        except RuntimeError as e:
            if "DataInspectionFailed" in str(e):
                print(f"[安全审查] 第 {i} 张触发审核，自动改写并重试生成...")
                safe_prompt = refine_scene_for_image(scene_prompt)
                try:
                    task_id = qwen_create_task(safe_prompt)
                    urls = qwen_poll_task(task_id, timeout_sec=Config.STORYBOARD_POLL_TIMEOUT_SEC)
                    images_all.extend(urls)
                    print(f"[重试成功] 第 {i} 张生成完成: {urls}")
                except Exception as inner_e:
                    print(f"[重试失败] 第 {i} 张依然出错: {inner_e}")
                    images_all.append("")
            else:
                print(f"[错误] 第 {i} 张生成失败: {e}")
                images_all.append("")

    return {"images": images_all, "prompts": prompts_all}
