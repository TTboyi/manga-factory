import time
import requests
from typing import List, Dict, Any
from config import Config
from services.utils import load_prompt
from services.doubao_client import call_doubao
import os

def sanitize_text(text: str) -> str:
    banned = [
        "血","枪","死亡","裸","杀","暴力","尸","宗教","战争",
        "性","吻","毒","酒","吸烟","恐怖","爆炸","暗杀"
    ]
    for w in banned:
        text = text.replace(w, "＊")
    return text


def refine_scene_for_image(scene_text: str) -> str:
    """
    安全改写，当被DashScope拒绝时。
    """
    prompt = (
        "请将以下场景描述改写为安全、积极、健康的画面提示：\n\n"
        f"{scene_text}"
    )
    refined = call_doubao(
        model="doubao-seed-1-6-flash-250828",
        messages=[
            {"role": "system", "content": "你是安全文本改写助手，负责将可能违规内容改写为健康、积极的AI绘画提示。"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=3000
    )
    return refined.strip()


def build_image_prompt_for_scene(scene: Dict[str, Any], visual_spec: Dict[str, Any]) -> str:
    base_prompt = load_prompt("绘画提示词.md")
    scene_desc = sanitize_text(scene.get("description", ""))
    title = sanitize_text(scene.get("title", ""))
    role_part = visual_spec.get("role_features", "")
    style_part = visual_spec.get("art_style", "")

    prompt = (
        f"{base_prompt}\n\n"
        f"【分镜标题】{title}\n"
        f"【画面描述】{scene_desc}\n\n"
        f"【角色设定】{role_part}\n\n"
        f"【风格设定】{style_part}\n"
    )
    return prompt


def qwen_generate_image(prompt: str) -> List[str]:
    """
    使用 qwen-image-plus 模型同步生成图片
    """
    headers = {
        "Authorization": f"Bearer {Config.QWEN_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "qwen-image-plus",
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"text": prompt}
                    ]
                }
            ]
        },
        "parameters": {
            "negative_prompt": "",
            "prompt_extend": True,
            "watermark": True,
            "size": Config.STORYBOARD_IMAGE_SIZE or "1472×1140"
        }
    }

    resp = requests.post(
        "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
        headers=headers,
        json=payload,
        timeout=180
    )

    print(f"[DashScope] 状态码: {resp.status_code}")
    print(f"[DashScope] 返回: {resp.text[:500]}")

    if resp.status_code == 400 and "DataInspectionFailed" in resp.text:
        raise RuntimeError("DataInspectionFailed")

    resp.raise_for_status()
    data = resp.json()

    # 有些版本返回 base64，有些返回 url
    urls = []
    try:
        # ✅ 新接口结构（choices → message → content → image）
        if "output" in data and "choices" in data["output"]:
            for choice in data["output"]["choices"]:
                msg = choice.get("message", {})
                contents = msg.get("content", [])
                for c in contents:
                    if "image" in c:
                        urls.append(c["image"])

        # ✅ 兼容旧结构（results → url / b64_json）
        elif "output" in data and "results" in data["output"]:
            for item in data["output"]["results"]:
                if "url" in item:
                    urls.append(item["url"])
                elif "b64_json" in item:
                    import base64, uuid, os
                    img_path = f"./outputs/{uuid.uuid4().hex}.png"
                    os.makedirs("./outputs", exist_ok=True)
                    with open(img_path, "wb") as f:
                        f.write(base64.b64decode(item["b64_json"]))
                    urls.append(img_path)

    except Exception as e:
        print(f"[解析返回异常] {e}")

    print(f"[解析得到图片URL数量] {len(urls)}")
    return urls




def qwen_poll_task(task_id: str, timeout_sec: int) -> List[str]:
    headers = {"Authorization": f"Bearer {Config.QWEN_API_KEY}"}
    url = f"{Config.QWEN_FETCH_URL}/{task_id}"

    start = time.time()
    while time.time() - start < timeout_sec:
        resp = requests.get(url, headers=headers, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        status = data.get("output", {}).get("task_status")
        if status == "SUCCEEDED":
            results = data["output"]["results"]
            return [r["url"] for r in results if "url" in r]
        elif status == "FAILED":
            raise RuntimeError("Task failed")
        time.sleep(5)
    raise TimeoutError(f"Task {task_id} timeout")


def generate_storyboard_images(
    novel_text: str,
    scenes: List[Dict[str, Any]],
    visual_spec: Dict[str, Any],
) -> Dict[str, Any]:
    images_all: List[str] = []
    prompts_all: List[str] = []

    for i, scene in enumerate(scenes, start=1):
        print(f"\n========== 开始生成第 {i}/{len(scenes)} 张图 ==========")
        try:
            # 构造完整 prompt
            scene_prompt = build_image_prompt_for_scene(scene, visual_spec)
            prompts_all.append(scene_prompt)

            urls = qwen_generate_image(scene_prompt)
            images_all.append(urls)
            print(f"[成功] 第 {i} 张生成完成: {urls}")

        except RuntimeError as e:
            print(f"[警告] {e}")
            if "DataInspectionFailed" in str(e):
                print(f"[安全改写重试] 第 {i} 张...")
                safe_prompt = refine_scene_for_image(scene_prompt)
                try:
                    urls = qwen_generate_image(safe_prompt)
                    images_all.extend(urls)
                    print(f"[重试成功] 第 {i} 张生成完成: {urls}")
                except Exception as inner_e:
                    print(f"[重试失败] {inner_e}")
                    images_all.append("")
            else:
                images_all.append("")

    return {"images": images_all, "prompts": prompts_all}

