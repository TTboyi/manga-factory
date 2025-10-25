# services/image_service.py
import requests, time, os
from config import DASHSCOPE_API_KEY, DASHSCOPE_URL

class WanxiangClient:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
            "Content-Type": "application/json",
            "X-DashScope-Async": "enable"
        }

    def create_task(self, prompt: str, size="1024*1024"):
        """
        创建异步生成任务，返回 task_id
        """
        body = {
            "model": "wan2.2-t2i-plus",
            "input": {"prompt": prompt},
            "parameters": {"size": size, "n": 1}
        }

        resp = requests.post(DASHSCOPE_URL, headers=self.headers, json=body)
        resp.raise_for_status()
        data = resp.json()
        task_id = data["output"]["task_id"]
        print(f"[Wanxiang] Created task {task_id}")
        return task_id

    def wait_for_result(self, task_id, interval=10, max_attempts=30):
        """
        轮询查询任务结果。成功返回 image_url
        """
        query_url = f"https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}"
        headers = {"Authorization": f"Bearer {DASHSCOPE_API_KEY}"}

        for attempt in range(max_attempts):
            resp = requests.get(query_url, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            status = data["output"]["task_status"]
            if status == "SUCCEEDED":
                results = data["output"]["results"]
                if results and "url" in results[0]:
                    return results[0]["url"]
                break
            elif status == "FAILED":
                raise RuntimeError(f"Task {task_id} failed.")
            else:
                print(f"[Wanxiang] Task {task_id} status = {status}, retrying...")
                time.sleep(interval)

        raise TimeoutError(f"Task {task_id} did not finish in time.")
