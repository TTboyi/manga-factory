import React, { useState } from "react";
import { saveProject } from "../../services/api";

interface Props {
  onPrev: () => void;
  projectId: number | null;
  setProjectId: (v: number | null) => void;
  novelText: string;
  scenes: any[];
  visualSpec: any;
  generatedImages: string[];
}

export default function Step4Export({
  onPrev,
  projectId,
  setProjectId,
  novelText,
  scenes,
  visualSpec,
  generatedImages,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("未命名作品");

  async function handleSave() {
    if (!novelText || generatedImages.length === 0) {
      alert("缺少必要内容，无法保存。");
      return;
    }
    try {
      setLoading(true);
      const res = await saveProject({
        name: projectName,
        novel_text: novelText,
        scenes,
        visual_spec: visualSpec,
        images: generatedImages,
      });
      if (res.success) {
        setProjectId(res.project_id);
      } else {
        alert("保存失败");
      }
    } catch (err) {
      console.error("保存失败:", err);
      alert("保存失败，请查看后端日志");
    } finally {
      setLoading(false);
    }
  }

  function handleExportJSON() {
    const data = {
      novel_text: novelText,
      scenes,
      visual_spec: visualSpec,
      images: generatedImages,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}.json`;
    a.click();
  }

  return (
    <div className="text-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          导出与保存
        </h2>
        <p className="text-sm text-gray-500">
          你可以将生成结果保存到数据库，或导出为 JSON 文件。
        </p>
      </div>

      {/* 保存项目 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          保存到项目数据库
        </h3>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="请输入项目名称"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "保存中..." : "保存项目"}
        </button>

        {projectId && (
          <div className="mt-4 text-sm text-gray-700">
            ✅ 已保存，项目 ID：
            <span className="font-semibold text-indigo-600">
              {projectId}
            </span>
          </div>
        )}
      </div>

      {/* 导出 JSON */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          导出为 JSON 文件
        </h3>
        <button
          onClick={handleExportJSON}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          导出 JSON
        </button>
      </div>

      <div className="flex justify-start mt-6">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          ← 上一步
        </button>
      </div>
    </div>
  );
}
