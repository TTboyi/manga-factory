import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {authApi} from "../services/api";
import { setToken } from "../utils/session";

type EmailLoginForm = { email: string; code: string };

const CaptchaLogin: React.FC = () => {
  const { register, handleSubmit } = useForm<EmailLoginForm>();
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const sendCode = async (email: string) => {
    try {
      setSending(true);
      await authApi.sendEmailCaptcha({ email });
      alert("验证码已发送，请查收邮件！");
    } catch {
      alert("验证码发送失败");
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (data: EmailLoginForm) => {
    try {
      const res = await authApi.emailCaptchaLogin(data);
      const token = res.data?.data?.access_token;
      if (token) {
        setToken(token);
        alert("登录成功！");
        navigate("/chat");
      } else {
        alert("登录失败");
      }
    } catch {
      alert("登录失败，请重试");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">邮箱验证码登录</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <input
              {...register("email", { required: "请输入邮箱" })}
              placeholder="邮箱地址"
              className="w-full border rounded-lg p-2"
            />
            <button
              type="button"
              disabled={sending}
              onClick={() => {
                const email = (document.querySelector("input[name='email']") as HTMLInputElement).value;
                if (email) sendCode(email);
                else alert("请输入邮箱");
              }}
              className="bg-blue-500 text-white px-3 rounded-lg hover:bg-blue-600"
            >
              {sending ? "发送中..." : "发送"}
            </button>
          </div>
          <input
            {...register("code", { required: "请输入验证码" })}
            placeholder="验证码"
            className="w-full border rounded-lg p-2"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white rounded-lg py-2 hover:bg-green-600"
          >
            登录
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-500 hover:underline">
            返回密码登录
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptchaLogin;
