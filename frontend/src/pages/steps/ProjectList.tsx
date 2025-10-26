// src/pages/steps/ProjectList.tsx
import React, { useEffect, useState } from "react";
import { getMyProjects, getProjectFull } from "../../services/api";

interface ProjectListProps {
  onSelectProject: (fullProject: {
    id: number;
    name: string;
    novel_text: string;
    scenes: any[];
    visual_spec: any;
    images: string[];
  }) => void;
}

export default function ProjectList({ onSelectProject }: ProjectListProps) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<
    {
      id: number;
      name: string;
      updated_at: string;
      preview_text: string;
      image_cover?: string | null;
    }[]
  >([]);

  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await getMyProjects();
        if (res.success === false) {
          setErrorMsg(res.message || "加载失败");
        } else {
          setProjects(res.projects || []);
        }
      } catch (err) {
        console.error("加载项目失败:", err);
        setErrorMsg("加载项目失败");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 点击卡片：获取完整项目并回调给父组件
  async function handleOpenProject(projectId: number) {
    try {
      const full = await getProjectFull(projectId);
      if (full.success === false) {
        alert(full.message || "加载项目失败");
        return;
      }

      // full.data 如果你封装了 success(); 如果不是就直接 full
      const data = full.data ? full.data : full;

      onSelectProject({
        id: data.id,
        name: data.name,
        novel_text: data.novel_text || "",
        scenes: data.scenes || [],
        visual_spec: data.visual_spec || {},
        images: data.images || [],
      });
    } catch (err) {
      console.error("读取项目失败:", err);
      alert("读取项目失败");
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full text-gray-800">
      <div className="mb-4">
        <div className="text-xl font-semibold text-gray-900">我的项目</div>
        <div className="text-sm text-gray-500">
          点击已有项目可继续编辑 / 出图 / 导出
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">加载中...</div>
      )}

      {!loading && errorMsg && (
        <div className="text-sm text-red-500">{errorMsg}</div>
      )}

      {!loading && !errorMsg && projects.length === 0 && (
        <div className="text-sm text-gray-400">
          还没有保存过项目，可以先去“输入文本”开始创作～
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-md transition cursor-pointer flex flex-col"
            onClick={() => handleOpenProject(p.id)}
          >
            {/* 封面区域 */}
            <div className="w-full h-32 bg-gray-200 border-b border-gray-100 flex items-center justify-center overflow-hidden">
              {p.image_cover ? (
                <img
                  src={p.image_cover}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-xs text-center px-4 leading-snug">
                  （暂无封面图）
                </div>
              )}
            </div>

            {/* 文本信息 */}
            <div className="flex-1 p-4 flex flex-col text-sm">
              <div className="text-gray-900 font-semibold text-[14px] mb-1">
                {p.name || "未命名项目"}
              </div>
              <div className="text-[11px] text-gray-500 mb-2">
                {p.updated_at || ""}
              </div>
              <div className="text-[12px] text-gray-600 line-clamp-3 leading-snug flex-1">
                {p.preview_text || "（无简介）"}
              </div>
              <div className="mt-3 text-indigo-600 text-[12px] font-medium">
                继续编辑 →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
