import axios from "axios";

// ========== Token 存取封装 ==========
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export const getToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setToken = (access: string, refresh?: string) => {
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearToken = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

// ========== Axios 实例封装 ==========
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Flask 后端地址
  headers: { "Content-Type": "application/json" },
});

// 自动附加 Token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 自动刷新 Token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 如果 token 过期，尝试刷新
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("无刷新令牌");

        const res = await axios.post("http://127.0.0.1:8000/auth/refresh", {}, {
          headers: { Authorization: `Bearer ${refresh}` },
        });

        const newAccess = res.data?.data?.access_token;
        const newRefresh = res.data?.data?.refresh_token;

        if (newAccess) setToken(newAccess, newRefresh);

        // 重新请求原接口
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        console.warn("刷新 Token 失败", e);
        clearToken();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ========== 额外工具函数 ==========
export const isLoggedIn = (): boolean => {
  return !!getToken();
};

export const logout = async () => {
  try {
    const token = getToken();
    if (token) {
      await api.post("/auth/logout");
    }
  } catch {
    console.warn("后端登出失败，执行本地清除");
  } finally {
    clearToken();
    window.location.href = "/";
  }
};
