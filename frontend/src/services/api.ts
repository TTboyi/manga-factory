import axios from "axios";
import type { Scene, VisualSpec } from "../types";

// =====================
// 🔧 基础配置
// =====================
const API_BASE = "http://localhost:5000";

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 600000, // 支持长任务
  headers: { "Content-Type": "application/json" },
});

// =====================
// 🔐 JWT 请求拦截器
// =====================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================
// 🧩 小说与漫画项目接口
// =====================

// STEP1: 小说生成
export async function generateNovel(text: string): Promise<{ novel_text: string }> {
  const res = await apiClient.post("/text/generate_novel", { text });
  return res.data;
}

// STEP2: 视觉分析（上传文件）
export async function analyzeVisualSpec(formData: FormData): Promise<any> {
  const token = localStorage.getItem("access_token");
  const res = await axios.post(`${API_BASE}/visual/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 600000,
  });
  return res.data;
}

// STEP3: 场景识别
export async function recognizeScenes(payload: {
  novel_text: string;
  visual_spec: any;
  num_shots?: number;
}): Promise<{ scenes: Scene[] }> {
  const res = await apiClient.post("/scene/recognize", payload);
  return res.data;
}

// STEP3.5: 出图生成
export async function generateStoryboard(payload: {
  novel_text: string;
  scenes: Scene[];
  visual_spec: VisualSpec;
}): Promise<{ images: string[]; prompts?: string[] }> {
  const res = await apiClient.post("/image/generate_storyboard", payload);
  return res.data;
}

// STEP4: 保存项目
export async function saveProject(payload: {
  id?: number;
  name: string;
  novel_text?: string;
  scenes?: any[];
  visual_spec?: any;
  images?: string[];
}): Promise<{ success: boolean; project_id: number }> {
  const res = await apiClient.post("/project/save", payload);
  return res.data;
}

// 读取完整项目
export async function getProjectFull(id: number) {
  const res = await apiClient.get(`/project/get_full/${id}`);
  return res.data;
}

// 获取当前用户的所有项目（用于卡片展示）
export async function getMyProjects(): Promise<{
  success: boolean;
  message?: string;
  projects?: {
    id: number;
    name: string;
    updated_at: string;
    preview_text: string;
    image_cover?: string | null;
  }[];
}> {
  const res = await apiClient.get("/project/my_list");
  return res.data;
}

// =====================
// 🔐 用户认证接口
// =====================
export const authApi = {
  // 注册
  register: (data: { nickname: string; password: string }) =>
    apiClient.post("/auth/register", data),

  // 登录
  login: async (data: { nickname: string; password: string }) => {
  const res = await apiClient.post("/auth/login", data);

  // ✅ 兼容 code=0 或 code=200 两种情况
  const tokenData = res.data?.data || res.data;

  if (tokenData?.access_token) {
    localStorage.setItem("access_token", tokenData.access_token);
    localStorage.setItem("refresh_token", tokenData.refresh_token);
    console.log("✅ 登录成功，已保存 Token");
  } else {
    console.warn("⚠️ 登录接口未返回 token，返回内容：", res.data);
  }

  return res.data;
},

  // 获取当前登录用户信息
  getUserInfo: async () => {
    const res = await apiClient.get("/auth/user/info");
    return res.data;
  },

  // 刷新 Token
  refreshToken: () => apiClient.post("/auth/refresh"),

  // 登出
  logout: async () => {
    const res = await apiClient.post("/auth/logout");
    if (res.data.success) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    return res.data;
  },
};
