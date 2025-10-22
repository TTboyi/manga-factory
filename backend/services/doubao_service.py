import os
import json
import requests
from volcengine.maas import MaasService, MaasException, ChatRole
from typing import List, Dict, Any
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DoubaoService:
    """火山引擎豆包大模型服务类"""
    
    def __init__(self):
        """初始化豆包服务"""
        self.access_key = os.getenv('VOLCENGINE_ACCESS_KEY')
        self.secret_key = os.getenv('VOLCENGINE_SECRET_KEY')
        self.region = os.getenv('VOLCENGINE_REGION', 'cn-beijing')
        self.service_id = os.getenv('VOLCENGINE_SERVICE_ID')
        
        if not all([self.access_key, self.secret_key, self.service_id]):
            logger.error("火山引擎配置不完整，请检查环境变量")
            raise ValueError("火山引擎配置不完整")
        
        # 初始化MaasService
        self.maas = MaasService(self.access_key, self.secret_key, self.region)
    
    def extract_scenes_from_novel(self, novel_text: str, max_scenes: int = 10) -> List[Dict[str, Any]]:
        """
        从小说文本中提取场景
        
        Args:
            novel_text: 小说文本
            max_scenes: 最大提取场景数
            
        Returns:
            场景列表，每个场景包含标题、描述、角色、设置、时间、情绪等信息
        """
        # 构建提示词
        prompt = f"""
        请从以下小说文本中提取最多{max_scenes}个关键场景，并以JSON格式返回。
        每个场景应包含以下信息：
        - scene_id: 场景编号（从1开始）
        - title: 场景标题
        - description: 场景描述（100字以内）
        - characters: 场景中的角色列表
        - setting: 场景设置（地点）
        - time: 场景时间
        - mood: 场景情绪/氛围
        
        请确保返回的是有效的JSON格式，格式如下：
        ```json
        {{
            "scenes": [
                {{
                    "scene_id": 1,
                    "title": "场景标题",
                    "description": "场景描述",
                    "characters": ["角色1", "角色2"],
                    "setting": "场景设置",
                    "time": "时间",
                    "mood": "情绪/氛围"
                }}
            ]
        }}
        ```
        
        小说文本：
        {novel_text}
        """
        
        try:
            # 调用豆包大模型API
            req = {
                "model": self.service_id,
                "messages": [
                    {
                        "role": ChatRole.USER,
                        "content": prompt
                    }
                ],
                "parameters": {
                    "max_tokens": 2000,
                    "temperature": 0.7
                }
            }
            
            resp = self.maas.chat(req)
            
            if resp and "choices" in resp and len(resp["choices"]) > 0:
                content = resp["choices"][0]["message"]["content"]
                
                # 尝试解析JSON
                try:
                    # 提取JSON部分（可能包含在```json```中）
                    json_start = content.find('{')
                    json_end = content.rfind('}') + 1
                    
                    if json_start >= 0 and json_end > json_start:
                        json_str = content[json_start:json_end]
                        result = json.loads(json_str)
                        
                        if "scenes" in result and isinstance(result["scenes"], list):
                            logger.info(f"成功提取{len(result['scenes'])}个场景")
                            return result["scenes"]
                        else:
                            logger.error("返回的JSON格式不正确，缺少scenes字段或scenes不是数组")
                            return []
                    else:
                        logger.error("无法从响应中提取有效的JSON")
                        return []
                except json.JSONDecodeError as e:
                    logger.error(f"JSON解析错误: {str(e)}")
                    logger.error(f"原始响应: {content}")
                    return []
            else:
                logger.error("豆包API响应格式不正确")
                return []
                
        except MaasException as e:
            logger.error(f"豆包API调用错误: {str(e)}")
            return []
        except Exception as e:
            logger.error(f"场景提取过程中发生错误: {str(e)}")
            return []
    
    def validate_and_fix_scene_json(self, scene_data: Any) -> List[Dict[str, Any]]:
        """
        验证和修正场景JSON数据
        
        Args:
            scene_data: 待验证的场景数据
            
        Returns:
            验证和修正后的场景列表
        """
        if not isinstance(scene_data, list):
            logger.error("场景数据不是数组格式")
            return []
        
        valid_scenes = []
        
        for i, scene in enumerate(scene_data):
            if not isinstance(scene, dict):
                logger.warning(f"场景{i+1}不是对象格式，跳过")
                continue
            
            # 验证必需字段
            required_fields = ["scene_id", "title", "description"]
            missing_fields = [field for field in required_fields if field not in scene]
            
            if missing_fields:
                logger.warning(f"场景{i+1}缺少必需字段: {', '.join(missing_fields)}")
                # 尝试修正
                if "scene_id" not in scene:
                    scene["scene_id"] = i + 1
                if "title" not in scene:
                    scene["title"] = f"场景{i+1}"
                if "description" not in scene:
                    scene["description"] = "暂无描述"
            
            # 确保可选字段存在
            optional_fields = {
                "characters": [],
                "setting": "未知",
                "time": "未知",
                "mood": "未知"
            }
            
            for field, default_value in optional_fields.items():
                if field not in scene:
                    scene[field] = default_value
                elif field == "characters" and not isinstance(scene[field], list):
                    logger.warning(f"场景{i+1}的characters字段不是数组格式，修正为空数组")
                    scene[field] = []
            
            valid_scenes.append(scene)
        
        logger.info(f"验证完成，有效场景数: {len(valid_scenes)}")
        return valid_scenes