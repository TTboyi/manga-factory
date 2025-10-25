import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

/**
 * 通用 Toast 组件
 */
const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000); // 3 秒后自动关闭
    return () => clearTimeout(timer);
  }, [onClose]);

  const colorMap = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition-opacity animate-fadeIn z-[9999] ${colorMap[type]}`}
    >
      {message}
    </div>
  );
};

export default Toast;
