
# manga-factory

![Manga Factory](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Python](https://img.shields.io/badge/Python-3.8%2B-brightgreen.svg)

一个基于AIGC技术的智能漫画生成系统，能够将小说文本自动转换为高质量的漫画作品。本项目融合了大型语言模型(LLM)和文生图(Text-to-Image)技术，为创作者提供高效、便捷的漫画创作工具。

## 🌟 项目特点

- 📚 **智能文本理解**：基于大型语言模型深度解析小说内容，理解情节、人物、情感和场景
- 🎬 **自动分镜生成**：智能将文本转换为漫画分镜设计，包括画面构图、角色动作和镜头语言
- 🎨 **风格一致性**：支持多种漫画风格选择，并确保整部作品的画风和角色形象保持统一
- 🖼️ **高质量图像生成**：利用先进的文生图模型生成精美漫画画面
- 💬 **智能文本气泡**：自动识别画面留白区域，合理放置对话和旁白文本
- 📖 **多样化排版**：支持多种漫画页面布局模板，如四格、六格等
- 🚀 **高效异步处理**：采用任务队列技术，处理大型文本时不阻塞用户界面
- 🌐 **前后端分离**：采用现代Web架构，提供友好的用户界面和强大的后端服务

## 🏗️ 技术架构

本项目采用前后端分离的架构设计，主要包含以下组件：

| 组件 | 技术选型 | 主要职责 |
| :--- | :--- | :--- |
| **前端 (Frontend)** | React / Vue.js | 提供用户交互界面，包括文本输入、风格选择、漫画预览与下载 |
| **后端 (Backend)** | Python (FastAPI) | 处理核心业务逻辑，包括文本处理、与AIGC服务交互、任务管理 |
| **AIGC服务** | 火山引擎AIGC | 提供底层的LLM（Doubao）、文生图（seedream 4.0）和TTS能力 |
| **数据库** | PostgreSQL | 存储用户信息、项目文件、生成的漫画数据、角色设定等 |
| **任务队列** | Celery & Redis | 管理耗时的AIGC生成任务，实现异步处理，避免请求超时 |

### 系统工作流程

1. **文本输入与预处理**：用户输入小说文本，系统进行预处理和场景切分
2. **角色与风格设定**：用户定义角色特征和选择漫画风格
3. **分镜脚本生成**：LLM将场景细化为详细的漫画分镜描述
4. **图像生成**：文生图模型根据分镜描述生成漫画图像
5. **文本气泡处理**：智能识别画面留白区域，放置对话和旁白
6. **页面合成**：按照预设布局将分镜组合成完整漫画页面
7. **输出与分享**：提供在线预览和多种格式的导出功能

## 📦 安装指南

### 环境要求

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- Redis 6+

### 快速安装

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/manga-factory.git
   cd manga-factory
   ```

2. **后端安装**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **前端安装**
   ```bash
   cd frontend
   npm install
   ```

4. **环境配置**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入必要的API密钥和数据库配置
   ```

5. **数据库初始化**
   ```bash
   # 使用PostgreSQL创建数据库
   createdb manga_factory
   
   # 运行数据库迁移
   python backend/database/migrations.py
   ```

### Docker部署

```bash
# 构建并启动所有服务
docker-compose up -d
```

## 🚀 快速开始

### 基本使用

1. **启动后端服务**
   ```bash
   cd backend
   python main.py
   ```

2. **启动前端服务**
   ```bash
   cd frontend
   npm start
   ```

3. **访问应用**
   打开浏览器访问 `http://localhost:3000`

### 命令行使用

```bash
# 使用命令行工具快速生成漫画
python backend/cli.py --input examples/sample_novel.txt --style anime --output ./my_manga/
```

## 📖 使用指南

### Web界面使用

1. **文本输入**：在主界面输入或上传小说文本
2. **参数设置**：选择漫画风格、定义角色特征、设置页面布局
3. **生成漫画**：点击生成按钮，系统将自动处理并生成漫画
4. **预览与编辑**：查看生成的漫画，可对分镜进行微调
5. **导出分享**：选择导出格式（PDF、图片集等）保存或分享作品

### API使用

```python
import requests

# 提交生成任务
response = requests.post('http://localhost:8000/api/generate', json={
    'text': '你的小说文本',
    'style': 'anime',
    'character_descriptions': {
        '主角': '黑发蓝眼，白色T恤，牛仔裤'
    }
})

task_id = response.json()['task_id']

# 查询任务状态
status = requests.get(f'http://localhost:8000/api/status/{task_id}')
```

## 🎨 漫画风格示例

| 风格名称 | 示例图片 | 描述 |
| :--- | :--- | :--- |
| **日漫风格** | ![Anime Style](docs/images/anime_style.jpg) | 经典日本动漫风格，线条简洁，色彩鲜明 |
| **美漫风格** | ![American Style](docs/images/american_style.jpg) | 美式漫画风格，线条粗犷，色彩浓郁 |
| **写实风格** | ![Realistic Style](docs/images/realistic_style.jpg) | 接近真实世界的绘画风格，细节丰富 |
| **Q版风格** | ![Chibi Style](docs/images/chibi_style.jpg) | 可爱Q版风格，角色比例夸张，表情丰富 |

## 📚 项目文档

- [需求文档](doc/小说生成漫画应用_-_需求文档.md) - 详细的产品需求和用户分析
- [实现方案](doc/小说生成漫画应用_-_产品实现方案.md) - 技术架构和实现细节
- [API文档](docs/api.md) - 完整的API接口说明
- [开发指南](docs/development.md) - 开发环境搭建和贡献指南
- [常见问题](docs/faq.md) - 常见问题解答

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是代码、文档、设计还是想法建议。

### 如何贡献

1. **Fork 本仓库**
2. **创建你的特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交你的更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **开启一个 Pull Request**

### 开发规范

- 遵循PEP 8 Python代码规范
- 提交信息采用[约定式提交](https://www.conventionalcommits.org/zh-hans/)格式
- 为新功能添加适当的测试
- 更新相关文档

## 🐛 问题反馈

如果你发现了任何问题或有功能建议，请通过以下方式反馈：

- [提交Issue](https://github.com/your-username/manga-factory/issues)
- [讨论区](https://github.com/your-username/manga-factory/discussions)

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 查看LICENSE文件了解详情

## 🙏 致谢

- 感谢所有为本项目做出贡献的开发者
- 感谢火山引擎AIGC提供的技术支持
- 感谢开源社区提供的优秀工具和框架

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/manga-factory&type=Date)](https://star-history.com/#your-username/manga-factory&Date)

## 📧 联系我们

- 项目主页: https://github.com/your-username/manga-factory
- 邮箱: your-email@example.com
- 官方网站: https://manga-factory.example.com
<<<<<<< HEAD
=======
>>>>>>> 848992664752b919b0ae99a31ab4f1490ba92f98
>>>>>>> 6cda5130388c11f863af8045f74f92db850569be
