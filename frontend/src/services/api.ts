import axios from "axios";
import type {
  Novel,
  Scene,
  Project,
  ApiResponse,
  UploadResponse,
  TextSubmissionResponse,
  SceneExtractionResponse,
  SceneExtractionRequest,
  TextSubmissionRequest,
  ProjectCreationRequest,
  ProjectCreationResponse
} from "../types";

// =====================
// 🔧 基础 Axios 实例
// =====================
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // ✅ Flask 后端端口（原为 5000）
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// =====================
// 🧩 文件与项目相关接口（AI 漫画逻辑）
// =====================

export const uploadFile = (file: File): Promise<ApiResponse<UploadResponse>> => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const submitText = (
  data: TextSubmissionRequest
): Promise<ApiResponse<TextSubmissionResponse>> => {
  return api.post("/text", data).then((res) => res.data);
};

export const extractScenes = (
  data: SceneExtractionRequest
): Promise<ApiResponse<SceneExtractionResponse>> => {
  return api.post("/extract-scenes", data).then((res) => res.data);
};

export const getScenes = (
  novelId: number
): Promise<ApiResponse<Scene[]>> => {
  return api.get(`/novels/${novelId}/scenes`).then((res) => res.data);
};

export const getNovels = (): Promise<ApiResponse<Novel[]>> => {
  return api.get("/novels").then((res) => res.data);
};

export const createProject = (
  data: ProjectCreationRequest
): Promise<ApiResponse<ProjectCreationResponse>> => {
  return api.post("/projects", data).then((res) => res.data);
};

export const getProjects = (): Promise<ApiResponse<Project[]>> => {
  return api.get("/projects").then((res) => res.data);
};

// =====================
// 🔐 用户认证相关接口
// =====================
export const authApi = {
  register: (data: { nickname: string; password: string }) =>
    api.post("/auth/register", data),

  login: (data: { nickname: string; password: string }) =>
    api.post("/auth/login", data),

  refreshToken: () => api.post("/auth/refresh"),

  logout: () => api.post("/auth/logout"),

  sendEmailCaptcha: (data: { email: string }) =>
    api.post("/captcha/send_email", data),

  emailCaptchaLogin: (data: { email: string; code: string }) =>
    api.post("/captcha/login_email", data),
};

// =====================
// 📦 默认导出
// =====================
export default api;
