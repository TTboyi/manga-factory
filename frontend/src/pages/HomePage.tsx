import React, { useState } from "react";
import {
  uploadNovel,
  uploadNovelFile,
  analyzeVisualSpec,
  generateStoryboard,
  saveProject,
} from "../services/api";
import type { Scene, VisualSpec, ImageGenResponse } from "../types";

const HomePage: React.FC = () => {
  // =============== 状态管理 ===============
  const [novelText, setNovelText] = useState("");
  const [novelFile, setNovelFile] = useState<File | null>(null);
  const [roleText, setRoleText] = useState("");
  const [styleText, setStyleText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const [roleImageFile, setRoleImageFile] = useState<File | null>(null);
  const [styleImageFile, setStyleImageFile] = useState<File | null>(null);

  // =============== 上传小说阶段 ===============
  const handleUploadNovel = async (): Promise<{ novel_text: string; scenes: Scene[] }> => {
    let res;
    if (novelFile) {
      res = await uploadNovelFile(novelFile);
    } else {
      res = await uploadNovel(novelText);
    }
    return res;
  };

  // =============== 生成视觉规范阶段 ===============
  const handleAnalyzeVisual = async (
    novelText: string
  ): Promise<VisualSpec> => {
    const visualSpec = await analyzeVisualSpec(
      roleText,
      styleText,
      novelText,
      roleImageFile || undefined,
      styleImageFile || undefined
    );
    return visualSpec;
  };

  // =============== 生成漫画主流程 ===============
  const handleGenerateStoryboard = async () => {
    try {
      setLoading(true);
      setProgress("📖 上传或生成小说中...");
      setImages([]);

      // 第1步：上传小说或生成分镜
      const novelRes = await handleUploadNovel();
      const { novel_text, scenes } = novelRes;
      setProgress("🎨 正在分析视觉风格...");

      // 第2步：生成视觉规范
      const visualSpec = await handleAnalyzeVisual(novel_text);

      setProgress("🖼️ 正在生成分镜图像（请稍等）...");

      // 第3步：出图
      const imageRes: ImageGenResponse = await generateStoryboard(
        novel_text,
        scenes,
        visualSpec
      );

      setImages(imageRes.images || []);
      setProgress("✅ 生成完成！");

      // 保存项目（可选）
      await saveProject({
        name: "AI漫画项目",
        novel_text,
        scenes,
        visual_spec: visualSpec,
        images: imageRes.images,
      });
    } catch (error: any) {
      console.error(error);
      setProgress("❌ 生成失败：" + (error.message || "未知错误"));
    } finally {
      setLoading(false);
    }
  };

  // =============== 渲染 ===============
  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen text-gray-800">
      {/* 左：小说输入 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3">小说输入</h2>
        <textarea
          placeholder="在这里输入小说文本"
          value={novelText}
          onChange={(e) => setNovelText(e.target.value)}
          className="w-full h-[150px] border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-400"
        />

        <div className="mt-4">
          <label className="block text-gray-700 text-sm mb-1">
            或上传小说文件
          </label>
          <input
            type="file"
            accept=".txt,.doc,.docx"
            onChange={(e) => setNovelFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
          />
          {novelFile && (
            <p className="text-xs text-gray-500 mt-1">
              已选择文件：{novelFile.name}
            </p>
          )}
        </div>
      </div>

      {/* 中：视觉设定 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3">视觉设定</h2>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm mb-1">角色特征</label>
          <textarea
            placeholder="例如：黑发少年，蓝色外套，冷静坚毅"
            value={roleText}
            onChange={(e) => setRoleText(e.target.value)}
            className="w-full h-[80px] border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setRoleImageFile(e.target.files?.[0] || null)}
            className="block mt-2 text-sm text-gray-700 border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm mb-1">画面风格</label>
          <textarea
            placeholder="例如：吉卜力风格，明亮柔光，日系写实"
            value={styleText}
            onChange={(e) => setStyleText(e.target.value)}
            className="w-full h-[80px] border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setStyleImageFile(e.target.files?.[0] || null)}
            className="block mt-2 text-sm text-gray-700 border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* 右：结果展示 */}
      <div className="w-[280px] bg-white rounded-lg shadow-md p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-3">生成结果</h2>

        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md p-2">
          {images.length === 0 ? (
            <p className="text-gray-500 text-center text-sm mt-5">
              尚未生成图像
            </p>
          ) : (
            images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`scene-${idx}`}
                className="rounded-md mb-2 w-full object-cover"
              />
            ))
          )}
        </div>

        <button
          onClick={handleGenerateStoryboard}
          disabled={loading}
          className={`mt-4 py-2 rounded-md font-semibold transition ${
            loading
              ? "bg-yellow-300 text-gray-700"
              : "bg-yellow-400 hover:bg-yellow-500 text-black"
          }`}
        >
          {loading ? "⏳ 正在生成..." : "🚀 一键生成漫画"}
        </button>

        {progress && (
          <p className="text-sm text-gray-700 text-center mt-2 whitespace-pre-line">
            {progress}
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
