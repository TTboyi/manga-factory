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
export const uploadNovel = async (
  text: string
): Promise<{ novel_text: string; scenes: Scene[] }> => {
  const res = await apiClient.post("/text/generate_novel", { text });
  return res.data;
};


/**
 * 上传小说文件(txt/doc/docx) → 调用豆包生成小说 + 场景识别
 * 对应后端 POST /api/text/upload
 */
export const uploadNovelFile = async (file: File): Promise<{ novel_text: string; scenes: Scene[] }> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_BASE}/text/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/**
 * 场景识别接口（独立使用）
 * 对应后端 POST /api/text/scene_recognition
 */
export const extractScenes = async (novelText: string): Promise<{ scenes: Scene[] }> => {
  const res = await apiClient.post("/text/scene_recognition", { text: novelText });
  return res.data;
};

// ========== 视觉规范 ==========

/**
 * 分析视觉规范（角色特征 + 画面风格）
 * 对应后端 POST /api/visual/analyze
 */
export const analyzeVisualSpec = async (
  roleText: string,
  styleText: string,
  novelText?: string,
  roleFile?: File,
  styleFile?: File
): Promise<VisualSpec> => {
  const formData = new FormData();
  formData.append("role_text", roleText);
  formData.append("style_text", styleText);
  if (novelText) formData.append("novel_text", novelText);
  if (roleFile) formData.append("role_image", roleFile);
  if (styleFile) formData.append("style_image", styleFile);

  const res = await axios.post(`${API_BASE}/visual/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ========== 分镜生成（出图） ==========

/**
 * 根据小说+场景+视觉规范生成分镜图像
 * 对应后端 POST /api/image/generate_storyboard
 */
export const generateStoryboard = async (
  novelText: string,
  scenes: Scene[],
  visualSpec: VisualSpec
): Promise<ImageGenResponse> => {
  const res = await apiClient.post("/image/generate_storyboard", {
    novel_text: novelText,
    scenes,
    visual_spec: visualSpec,
  });
  return res.data;
};

// ========== 项目管理 ==========

/**
 * 保存项目进度（任意阶段）
 * 对应后端 POST /api/project/save
 */
export const saveProject = async (data: {
  id?: number;
  name: string;
  novel_text?: string;
  scenes?: Scene[];
  visual_spec?: VisualSpec;
  images?: string[];
}): Promise<{ success: boolean; project_id: number }> => {
  const res = await apiClient.post("/project/save", data);
  return res.data;
};

/**
 * 获取完整项目详情
 * 对应后端 GET /api/project/get_full/<id>
 */
export const getFullProject = async (id: number) => {
  const res = await apiClient.get(`/project/get_full/${id}`);
  return res.data;
};

// ========== 系统健康检查 ==========

/**
 * 检查后端是否在线
 * 对应后端 GET /api/health
 */
export const checkHealth = async (): Promise<{ ok: boolean }> => {
  const res = await apiClient.get("/health");
  return res.data;
};















// // =====================
// // 📦 默认导出
// // =====================
// export default api;
