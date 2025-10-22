// 小说相关类型
export interface Novel {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// src/types/index.ts

export interface Scene {
  id: number;
  novel_id: number;
  title: string;
  description: string;
  characters: string[];
  setting: string;
  mood: string;
  scene_number: number;
  created_at: string;
  type: string;  // 添加这个属性
  time_of_day: string;  // 添加这个属性
  image_url?: string;  // 添加这个属性，且是可选的
}


// 场景图像相关类型
export interface SceneImage {
  id: number;
  scene_id: number;
  image_url: string;
  style: string;
  created_at: string;
}

// 项目相关类型
export interface Project {
  id: number;
  novel_id: number;
  name: string;
  description?: string;
  style: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 上传文件响应类型
export interface UploadResponse {
  novel: Novel;
  message: string;
}

// 文本提交响应类型
export interface TextSubmissionResponse {
  novel: Novel;
  message: string;
}

// 场景提取响应类型
export interface SceneExtractionResponse {
  novel: Novel;
  scenes: Scene[];
  message: string;
}

// 场景提取请求类型
export interface SceneExtractionRequest {
  novel_id: number;
  max_scenes?: number;
}

// 文本提交请求类型
export interface TextSubmissionRequest {
  title: string;
  text: string;
}

// 项目创建请求类型
export interface ProjectCreationRequest {
  novel_id: number;
  name: string;
  description?: string;
  style: string;
}

// 项目创建响应类型
export interface ProjectCreationResponse {
  project_id: number;
  message: string;
}

// 漫画风格枚举
export enum MangaStyle {
  MANGA = "manga",
  COMIC = "comic",
  REALISTIC = "realistic",
  CHIBI = "chibi",
  SKETCH = "sketch"
}

// 项目状态枚举
export enum ProjectStatus {
  CREATED = "created",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed"
}