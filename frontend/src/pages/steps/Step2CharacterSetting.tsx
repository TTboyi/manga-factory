import React, { useState } from "react";
import { analyzeVisualSpec } from "../../services/api";

interface Props {
  onNext: () => void;
  onPrev: () => void;

  roleFeature: string;
  setRoleFeature: (v: string) => void;

  styleFeature: string;
  setStyleFeature: (v: string) => void;

  roleImageFile: File | null;
  setRoleImageFile: (f: File | null) => void;

  styleImageFile: File | null;
  setStyleImageFile: (f: File | null) => void;

  novelText: string; // 用来给后端提供上下文
  visualSpec: any;
visualAnalysisRaw: string;
setVisualAnalysisRaw: React.Dispatch<React.SetStateAction<string>>;
  setVisualSpec: (v: any) => void;
}

export default function Step2CharacterSetting({
  onNext,
  onPrev,
  roleFeature,
  setRoleFeature,
  styleFeature,
  setStyleFeature,
  visualAnalysisRaw,
  roleImageFile,
  setRoleImageFile,
  styleImageFile,
  setStyleImageFile,
  novelText,
  visualSpec,
  setVisualSpec,
}: Props) {
  const [loading, setLoading] = useState(false);

  function handleRoleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setRoleImageFile(e.target.files[0]);
    }
  }

  function handleStyleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setStyleImageFile(e.target.files[0]);
    }
  }

  async function handleExecute() {
    if (!novelText || novelText.trim() === "") {
      alert("缺少小说文本。请先完成上一步。");
      return;
    }

    // 这里严格匹配你后端 visual_routes.py 的需要：
    //   form fields:
    //     role_text
    //     style_text
    //     novel_text
    //     role_image (file)
    //     style_image (file)
    const fd = new FormData();
    fd.append("role_text", roleFeature);
    fd.append("style_text", styleFeature);
    fd.append("novel_text", novelText);
    if (roleImageFile) fd.append("role_image", roleImageFile);
    if (styleImageFile) fd.append("style_image", styleImageFile);

    try {
      setLoading(true);
      const res = await analyzeVisualSpec(fd);
      // res 结构（按你后端逻辑）：
      // {
      //   role_features: string,
      //   art_style: string,
      //   reference_images: string[],
      //   prompt_tags: string[],
      //   notes: string
      // }
      setVisualSpec(res || {});
    } catch (err) {
      console.error("视觉规范分析失败:", err);
      alert("视觉规范分析失败，请看后端日志");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-gray-700">
      {/* Section Header */}
      {/* <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          角色与画风设定
        </h2>
        <p className="text-sm text-gray-500">
          定义主角的外观特征、服装、气质，以及整体漫画的视觉风格
        </p>
      </div> */}

      {/* 两列卡片：左 = 角色特征，右 = 画面风格 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* 角色特征卡 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              角色特征
            </h3>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <textarea
              className="w-full flex-1 min-h-[140px] text-sm leading-relaxed p-3 bg-white border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              placeholder="描述角色的外观、性格、服装、标志性道具等..."
              value={roleFeature}
              onChange={(e) => setRoleFeature(e.target.value)}
            />

            {/* 上传角色参考图片 */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                上传角色参考图片（可选）
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition block">
                <div className="text-gray-600 text-sm flex flex-col items-center">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[11px] font-semibold mb-2">
                    IMG
                  </div>
                  <div>点击上传角色参考图</div>
                  <div className="text-xs text-gray-400 mt-1">
                    支持 JPG / PNG
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleRoleFileChange}
                />
              </label>

              <div className="mt-2 flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-700">
                <div className="truncate max-w-[140px]">
                  {roleImageFile ? roleImageFile.name : "未选择文件"}
                </div>
                {roleImageFile && (
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => setRoleImageFile(null)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 画面风格卡 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              画面风格
            </h3>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <textarea
              className="w-full flex-1 min-h-[140px] text-sm leading-relaxed p-3 bg-white border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              placeholder="描述你想要的画面风格：日式/厚涂/电影感写实、镜头语言、光影氛围..."
              value={styleFeature}
              onChange={(e) => setStyleFeature(e.target.value)}
            />

            {/* 上传风格参考图 */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                上传风格参考图片（可选）
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition block">
                <div className="text-gray-600 text-sm flex flex-col items-center">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[11px] font-semibold mb-2">
                    REF
                  </div>
                  <div>点击上传风格参考图</div>
                  <div className="text-xs text-gray-400 mt-1">
                    支持 JPG / PNG
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleStyleFileChange}
                />
              </label>

              <div className="mt-2 flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-700">
                <div className="truncate max-w-[140px]">
                  {styleImageFile ? styleImageFile.name : "未选择文件"}
                </div>
                {styleImageFile && (
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => setStyleImageFile(null)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          ← 上一步
        </button>

        <button
          onClick={handleExecute}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "分析中..." : "执行视觉分析"}
        </button>

        <button
          onClick={onNext}
          disabled={!visualSpec || !visualSpec.role_features}
          className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一步：生成预览 →
        </button>
      </div>

      {/* 分析结果展示 */}
      {visualSpec && visualSpec.role_features && (
        <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">
              当前生效的视觉规范
            </h3>
            <p className="text-xs text-gray-500">
              后续分镜识别、图像生成都会使用这个统一规范
            </p>
          </div>

          <div className="p-4 text-sm leading-relaxed text-gray-800 overflow-x-auto">
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                角色特征 role_features
              </div>
              <pre className="text-[13px] whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded p-3">
                {visualSpec.role_features}
              </pre>
            </div>

            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                画面风格 art_style
              </div>
              <pre className="text-[13px] whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded p-3">
                {visualSpec.art_style}
              </pre>
            </div>

            {visualSpec.reference_images && visualSpec.reference_images.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  参考图 reference_images
                </div>
                <ul className="text-[13px] leading-relaxed bg-gray-50 border border-gray-200 rounded p-3 space-y-1">
                  {visualSpec.reference_images.map((img: string, idx: number) => (
                    <li key={idx} className="break-all text-indigo-600 underline underline-offset-2">
                      {img}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {visualSpec.prompt_tags && visualSpec.prompt_tags.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  prompt_tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {visualSpec.prompt_tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-[11px] border border-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {visualSpec.notes && (
              <div className="mb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  备注 notes
                </div>
                <pre className="text-[13px] whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded p-3">
                  {visualSpec.notes}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
