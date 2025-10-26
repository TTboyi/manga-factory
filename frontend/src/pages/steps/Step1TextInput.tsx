import React, { useState } from "react";
import { generateNovel } from "../../services/api";

interface Props {
  onNext: () => void;
  novelText: string;
  setNovelText: (v: string) => void;
   outline: string;
  setOutline: React.Dispatch<React.SetStateAction<string>>;
  novelTextProcessed: string;
  setNovelTextProcessed: (v: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
}

export default function Step1TextInput({
  onNext,
  novelText,
  setNovelText,
  outline,
  setOutline,
  novelTextProcessed,
  setNovelTextProcessed,
  file,
  setFile,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExecute() {
    if (!novelText || novelText.trim() === "") {
      alert("请先输入内容（可以是大纲或整篇小说）");
      return;
    }
    try {
      setLoading(true);
      const res = await generateNovel(novelText);
      setNovelTextProcessed(res.novel_text || "");
    } catch (err) {
      console.error("生成失败:", err);
      alert("生成失败，请查看后端日志");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <div className="text-gray-700">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          输入小说文本
        </h2>
        <p className="text-sm text-gray-500">
          上传文本文件或直接粘贴内容，我们将基于此生成漫画
        </p>
      </div>

      {/* 两列卡片：左=文本输入，右=文件上传 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* 文本输入卡片 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              文本输入
            </h3>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <textarea
              className="w-full flex-1 min-h-[180px] text-sm leading-relaxed p-3 bg-white border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              placeholder="直接粘贴小说内容或大纲到这里..."
              value={novelText}
              onChange={(e) => setNovelText(e.target.value)}
            />
          </div>
        </div>

        {/* 文件上传卡片 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              文件上传
            </h3>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <label className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition">
              <div className="flex flex-col items-center justify-center text-gray-600 text-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg font-bold flex items-center justify-center mb-2">
                  ↑
                </div>
                <p>点击或拖拽文件到此处上传</p>
                <p className="text-xs text-gray-400 mt-1">
                  支持格式: TXT, DOC, DOCX
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".txt,.doc,.docx"
                onChange={handleFileChange}
              />
            </label>

            {/* 文件信息 */}
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-7 h-7 bg-indigo-100 text-indigo-600 text-[10px] font-semibold rounded flex items-center justify-center mr-2">
                  文
                </div>
                <div className="truncate max-w-[140px]">
                  {file ? file.name : "未选择文件"}
                </div>
              </div>
              {file && (
                <button
                  className="text-gray-400 hover:text-red-500 text-xs"
                  onClick={() => setFile(null)}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 生成后的“小说正文”展示 */}
      {novelTextProcessed && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">
              整理后小说全文
            </h3>
            <p className="text-xs text-gray-500">
              这是已经润色/补全过的文本，后续步骤会用到
            </p>
          </div>
          <div className="p-4 max-h-[260px] overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
            {novelTextProcessed}
          </div>
        </div>
      )}

      {/* 按钮区：执行 + 下一步 */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleExecute}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "生成中..." : "执行"}
        </button>

        <button
          onClick={onNext}
          disabled={!novelTextProcessed}
          className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一步：角色设定 →
        </button>
      </div>
    </div>
  );
}
