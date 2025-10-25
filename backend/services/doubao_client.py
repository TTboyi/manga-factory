import requests
from typing import List, Dict, Any
from config import Config


def call_doubao(model: str, messages: List[Dict[str, Any]], max_tokens: int = 4096) -> str:
    """
    直接调用火山方舟 Chat Completions API，返回 assistant 的content字符串。
    不做偷偷简化：
    - 支持system / user / assistant多轮
    - 传thinking.enabled
    - 我们强制要求文本输出（不做流式）
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {Config.DOUBAO_API_KEY}",
    }

    payload = {
        "model": model,
        "messages": messages,
        "thinking": {"type": "enabled"},
        "stream": False,
        "max_tokens": max_tokens,
        "response_format": {"type": "text"},
    }

    resp = requests.post(Config.DOUBAO_API_URL, json=payload, headers=headers, timeout=300)
    resp.raise_for_status()
    data = resp.json()

    # data["choices"][0]["message"]["content"]
    try:
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"Doubao response parse error: {e}, raw={data}")
