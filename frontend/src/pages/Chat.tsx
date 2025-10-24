import React, { useEffect, useState } from "react";
import api, { logout } from "../utils/session";

type UserInfo = {
  nickname: string;
  id?: string;
  email?: string;
  avatar?: string;
};

const Chat: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 尝试从后端获取用户信息（需要 JWT）
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/user/info");
        setUser(res.data?.data);
      } catch (err) {
        alert("登录状态已失效，请重新登录");
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        加载中...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        未登录
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">欢迎回来，{user.nickname}</h1>
        <button
          onClick={logout}
          className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          退出登录
        </button>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <img
            src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
            alt="avatar"
            className="w-20 h-20 mx-auto mb-4 rounded-full"
          />
          <h2 className="text-2xl font-semibold mb-2">{user.nickname}</h2>
          <p className="text-gray-500">你已成功登录系统 🎉</p>
        </div>
      </main>

      {/* 底部栏 */}
      <footer className="text-center text-gray-400 text-sm py-4">
        Manga Factory Chat · Powered by Flask + React + JWT
      </footer>
    </div>
  );
};

export default Chat;
