// src/services/api.ts
import axios from 'axios';
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
} from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 分别导出方法
export const uploadFile = (file: File): Promise<ApiResponse<UploadResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res.data);
};

export const submitText = (data: TextSubmissionRequest): Promise<ApiResponse<TextSubmissionResponse>> => {
  return api.post('/text', data).then(res => res.data);
};

export const extractScenes = (data: SceneExtractionRequest): Promise<ApiResponse<SceneExtractionResponse>> => {
  return api.post('/extract-scenes', data).then(res => res.data);
};

export const getScenes = (novelId: number): Promise<ApiResponse<Scene[]>> => {
  return api.get(`/novels/${novelId}/scenes`).then(res => res.data);
};

// 其他 API 方法
export const getNovels = (): Promise<ApiResponse<Novel[]>> => {
  return api.get('/novels').then(res => res.data);
};

export const createProject = (data: ProjectCreationRequest): Promise<ApiResponse<ProjectCreationResponse>> => {
  return api.post('/projects', data).then(res => res.data);
};

export const getProjects = (): Promise<ApiResponse<Project[]>> => {
  return api.get('/projects').then(res => res.data);
};

export default api;
