import axios from "axios";
import type { Scene, VisualSpec, ImageGenResponse } from "../types";
// =====================
// 🔧 基础 Axios 实例
// =====================
const API_BASE = "http://localhost:5000/";
export const apiClient = axios.create({
  baseURL: API_BASE, // ✅ Flask 后端端口（原为 5000）
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// =====================
// 🧩 文件与项目相关接口（AI 漫画逻辑）
// =====================



// =====================
// 🔐 用户认证相关接口
// =====================
export const authApi = {
  register: (data: { nickname: string; password: string }) =>
    apiClient.post("/auth/register", data),

  login: (data: { nickname: string; password: string }) =>
    apiClient.post("/auth/login", data),

  refreshToken: () => apiClient.post("/auth/refresh"),

  logout: () => apiClient.post("/auth/logout"),

  sendEmailCaptcha: (data: { email: string }) =>
    apiClient.post("/captcha/send_email", data),

  emailCaptchaLogin: (data: { email: string; code: string }) =>
    apiClient.post("/captcha/login_email", data),
};


// ========== 小说与场景 ==========

/**
 * 上传小说文本 → 调用豆包生成规范小说 + 场景识别
 * 对应后端 POST /api/text/generate_novel
 */
const api = axios.create({
  baseURL: "http://localhost:5000", // 后端 Flask 根地址，无 /api 前缀
  timeout: 600000, // 10分钟，避免生成图像之类的长任务直接超时
});

// ========== STEP1: 小说生成 ==========
// 传入：用户输入的小说全文/大纲
// 返回：{ novel_text: string }
export async function generateNovel(text: string): Promise<{
  novel_text: string;
}> {
  const res = await api.post("/text/generate_novel", { text });
  return res.data;
}

// ========== STEP2: 视觉分析 ==========
// 上传角色描述、风格描述、可选图片和小说全文
// 返回：visual_spec 对象（role_features、art_style等）
export async function analyzeVisualSpec(formData: FormData): Promise<any> {
  const res = await api.post("/visual/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ========== STEP3: 场景识别（会在第3步组件里用到，先导出） ==========
export async function recognizeScenes(payload: {
  novel_text: string;
  visual_spec: any;
  num_shots?: number;
}): Promise<{ scenes: any[] }> {
  const res = await api.post("/scene/recognize", payload);
  return res.data;
}

// ========== STEP3.5: 出图（第3步用） ==========
export async function generateStoryboard(payload: {
  novel_text: string;
  scenes: any[];
  visual_spec: any;
}): Promise<{ images: string[]; prompts?: string[] }> {
  const res = await api.post("/image/generate_storyboard", payload);
  return res.data;
}

// ========== STEP4: 保存（第4步用） ==========
export async function saveProject(payload: {
  id?: number;
  name: string;
  novel_text?: string;
  scenes?: any[];
  visual_spec?: any;
  images?: string[];
}): Promise<{ success: boolean; project_id: number }> {
  const res = await api.post("/project/save", payload);
  return res.data;
}

export async function getProjectFull(id: number) {
  const res = await api.get(`/project/get_full/${id}`);
  return res.data;
}










// // =====================
// // 📦 默认导出
// // =====================
// export default api;
