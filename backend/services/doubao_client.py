import requests
from typing import List, Dict, Any
from config import Config

def call_doubao(model: str, messages: List[Dict[str, Any]], max_tokens: int = 4096) -> str:
    """
    调用火山方舟豆包 Chat Completions API
    - 支持完整的 system / user / assistant 多轮
    - 自动启用 thinking.enabled
    - 全量返回文本（非流式）
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

    try:
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"Doubao response parse error: {e}, raw={data}")
