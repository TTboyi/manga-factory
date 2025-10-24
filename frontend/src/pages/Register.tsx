import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {authApi} from "../services/api"; // ✅ 调用后端接口

type RegisterForm = {
  username: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      // 调用后端注册接口
      const res = await authApi.register({
        nickname: data.username,
        password: data.password,
      });

      // 判断返回值
      if (res.data?.code === 0 || res.data?.message === "注册成功") {
        alert("注册成功！");
        navigate("/"); // 返回登录页
      } else {
        alert(res.data?.message || "注册失败");
      }
    } catch (err) {
      alert("注册请求失败，请检查网络或后端服务");
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/apex.png')" }}
    >
      <div className="absolute inset-0 bg-black/5 z-0"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-white/40 rounded-xl shadow-xl p-8">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">注册</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <input
                {...register("username", { required: "请输入账号" })}
                placeholder="账号"
                className="w-full rounded-lg border placeholder-black/40 text-black border-gray-300 bg-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <input
                type="password"
                {...register("password", { required: "请输入密码", minLength: { value: 6, message: "密码至少6位" } })}
                placeholder="密码"
                className="w-full rounded-lg border placeholder-black/40 text-black border-gray-300 bg-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "请再次输入密码",
                  validate: value => value === password || "两次密码输入不一致",
                })}
                placeholder="确认密码"
                className="w-full rounded-lg border placeholder-black/40 text-black border-gray-300 bg-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
            >
              注册
            </button>
          </form>

          <div className="mt-6 flex justify-end space-x-4">
            <Link to="/login" className="text-blue-600 text-sm hover:underline">密码登录</Link>
            <Link to="/captcha-login" className="text-blue-600 text-sm hover:underline">验证码登录</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;