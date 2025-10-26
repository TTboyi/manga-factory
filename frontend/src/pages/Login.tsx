import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { setToken } from "../utils/session";

type LoginForm = { nickname: string; password: string };

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await authApi.login(data);

      // ✅ axios返回结构是 {data, status, ...}，token在 res.data.data 中
      const tokenData = res.data?.data || res.data;

      if (tokenData?.access_token) {
        // 存储 token
        setToken(tokenData.access_token);
        localStorage.setItem("refresh_token", tokenData.refresh_token);

        alert("✅ 登录成功！");
        navigate("/center");
      } else {
        console.warn("⚠️ 登录成功但未返回 token，完整返回为：", res.data);
        alert("登录失败：未返回 Token");
      }
    } catch (error) {
      console.error("登录请求出错:", error);
      alert("登录失败，请检查账号或密码");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">登录</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("nickname", { required: "请输入账号" })}
            placeholder="账号"
            className="w-full border rounded-lg p-2"
          />
          <input
            type="password"
            {...register("password", { required: "请输入密码" })}
            placeholder="密码"
            className="w-full border rounded-lg p-2"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600"
          >
            登录
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <Link to="/captcha-login" className="text-blue-500 hover:underline">
            邮箱验证码登录
          </Link>
          <Link to="/register" className="text-blue-500 hover:underline">
            注册
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
