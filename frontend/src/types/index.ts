/**
 * ===============================
 * 📘 全局类型定义
 * 文件位置: /src/types/index.ts
 * 用途: 定义小说分析、视觉规范、分镜生成等接口结构
 * ===============================
 */

/**
 * 🌈 场景信息
 * 用于描述小说中提取出的每个分镜或剧情段落
 */
export interface Scene {
  /** 场景唯一标识符 */
  id: string;

  /** 场景标题（如：第一章 遇见） */
  title: string;

  /** 场景内容或简要描述 */
  description: string;
}

/**
 * 🎨 视觉规范对象 (VisualSpec)
 * 由角色特征 + 画风特征 组成
 * 后端由文字+图片分析得到，统一生成的视觉基调
 */
export interface VisualSpec {
  /** 角色特征总结文本 */
  role_features: string;

  /** 风格特征描述文本 */
  art_style: string;

  /** 参考图像的URL或本地路径 */
  reference_images?: string[];

  /** 模型推荐的关键词提示（可选） */
  prompt_tags?: string[];

  /** 附加备注或AI分析结果 */
  notes?: string;
}

/**
 * 📖 小说生成结果
 * 从用户上传的文本或文件生成结构化小说内容
 */
export interface NovelResponse {
  /** 小说全文 */
  novel_text: string;

  /** 小说拆分得到的场景数组 */
  scenes: Scene[];

  /** 小说标题（可选） */
  title?: string;

  /** 作者名称（可选） */
  author?: string;
}

/**
 * 🧠 场景识别结果
 * 用于从小说中提取分镜段落（简化版）
 */
export interface SceneRecognitionResponse {
  scenes: Scene[];
}

/**
 * 🖼️ 分镜图像生成结果
 * 每个元素对应一个生成的图片URL
 */
export interface ImageGenResponse {
  /** 成功生成的图片URL数组 */
  images: string[];

  /** 可选任务ID（用于异步轮询） */
  task_id?: string;

  /** 每张图片的生成prompt */
  prompts?: string[];

  /** 模型使用统计（如token数） */
  usage?: {
    image_count?: number;
    model?: string;
  };
}

/**
 * 💾 项目信息结构
 * 表示一个完整的“小说→视觉→分镜”生成任务
 */
export interface ProjectData {
  /** 唯一ID（数据库或内存中） */
  id?: string;

  /** 用户输入的项目名称（前端输入） */
  name: string;

  /** 小说原文内容 */
  novel_text?: string;

  /** 拆分后的场景数组 */
  scenes?: Scene[];

  /** AI生成的视觉规范 */
  visual_spec?: VisualSpec;

  /** 生成的分镜图像数组 */
  images?: string[];

  /** 创建时间（后端返回） */
  created_at?: string;

  /** 最后更新时间 */
  updated_at?: string;
}

/**
 * 📤 后端统一响应包装
 * 若后端返回 data + success + msg 结构，可使用该类型
 */
export interface ApiResponse<T> {
  /** 是否成功 */
  success: boolean;

  /** 消息文本（错误/提示） */
  message?: string;

  /** 实际数据内容 */
  data?: T;
}

/**
 * ⚙️ 文件上传结果
 * 用于上传 txt/doc/image 后返回的路径或内容
 */
export interface UploadResult {
  file_name: string;
  file_size: number;
  file_url?: string;
  parsed_text?: string;
}

/**
 * 🧩 阶段状态枚举（可用于前端进度条 / 流程控制）
 */
export type WorkflowStage =
  | "INIT"
  | "NOVEL_UPLOADED"
  | "SCENE_EXTRACTED"
  | "VISUAL_ANALYZED"
  | "IMAGE_GENERATED"
  | "COMPLETED";


  