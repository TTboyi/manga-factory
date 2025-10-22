import requests
import json
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# API基础URL
BASE_URL = "http://localhost:5000/api"

def test_health():
    """测试健康检查接口"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"健康检查: {response.status_code} - {response.json()}")
    return response.status_code == 200

def test_text_submission():
    """测试文本提交接口"""
    data = {
        "title": "测试小说",
        "text": "这是一个测试小说。第一章：主角在雨夜的小巷中遇到了一个神秘人物。第二章：他们进行了简短但意味深长的对话。第三章：神秘人物给了主角一个神秘的信物。"
    }
    
    response = requests.post(f"{BASE_URL}/text", json=data)
    print(f"文本提交: {response.status_code} - {response.json()}")
    
    if response.status_code == 200:
        return response.json().get("novel_id")
    return None

def test_scene_extraction(novel_id):
    """测试场景提取接口"""
    if not novel_id:
        print("无法测试场景提取，缺少novel_id")
        return False
    
    data = {
        "novel_id": novel_id,
        "max_scenes": 3
    }
    
    response = requests.post(f"{BASE_URL}/extract-scenes", json=data)
    print(f"场景提取: {response.status_code} - {response.json()}")
    
    if response.status_code == 200:
        scenes = response.json().get("scenes", [])
        print(f"提取到 {len(scenes)} 个场景")
        for scene in scenes:
            print(f"- {scene['title']}: {scene['description']}")
        return True
    return False

def test_get_novels():
    """测试获取小说列表接口"""
    response = requests.get(f"{BASE_URL}/novels")
    print(f"获取小说列表: {response.status_code} - {response.json()}")
    return response.status_code == 200

def test_get_scenes(novel_id):
    """测试获取场景列表接口"""
    if not novel_id:
        print("无法测试获取场景，缺少novel_id")
        return False
    
    response = requests.get(f"{BASE_URL}/novels/{novel_id}/scenes")
    print(f"获取场景列表: {response.status_code} - {response.json()}")
    return response.status_code == 200

def test_create_project(novel_id):
    """测试创建项目接口"""
    if not novel_id:
        print("无法测试创建项目，缺少novel_id")
        return False
    
    data = {
        "novel_id": novel_id,
        "name": "测试漫画项目",
        "description": "这是一个测试项目",
        "style": "manga"
    }
    
    response = requests.post(f"{BASE_URL}/projects", json=data)
    print(f"创建项目: {response.status_code} - {response.json()}")
    return response.status_code == 200

def run_tests():
    """运行所有测试"""
    print("开始API测试...")
    
    # 测试健康检查
    if not test_health():
        print("健康检查失败，停止测试")
        return
    
    # 测试文本提交
    novel_id = test_text_submission()
    
    # 测试获取小说列表
    test_get_novels()
    
    # 测试场景提取
    if novel_id:
        test_scene_extraction(novel_id)
        test_get_scenes(novel_id)
        test_create_project(novel_id)
    
    print("API测试完成")

if __name__ == '__main__':
    run_tests()