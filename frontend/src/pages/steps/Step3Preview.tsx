import React, { useState } from "react";
import { recognizeScenes, generateStoryboard } from "../../services/api";

interface Props {
  onNext: () => void;
  onPrev: () => void;
  novelText: string;
  visualSpec: any;
  scenes: any[];
   numShots: number;
    setNumShots: React.Dispatch<React.SetStateAction<number>>;
  setScenes: (v: any[]) => void;
  generatedImages: string[];
  setGeneratedImages: (v: string[]) => void;
  imagePrompts: string[];
  setImagePrompts: (v: string[]) => void;
  isRecognizing: boolean; // ✅ 新增
  setIsRecognizing: React.Dispatch<React.SetStateAction<boolean>>; // ✅ 新增
   isGenerating: boolean; // ✅ 新增
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>; // ✅ 新增

}

export default function Step3Preview({
  onNext,
  onPrev,
  novelText,
  visualSpec,
  scenes,
  
  setScenes,
  generatedImages,
  setGeneratedImages,
  imagePrompts,
  setImagePrompts,
  isRecognizing,
  setIsRecognizing,
  isGenerating,
  setIsGenerating,
}: Props) {
  const [loadingScene, setLoadingScene] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [numShots, setNumShots] = useState<number>(4);

  async function handleRecognizeScenes() {
    if (!novelText.trim()) {
      alert("请先完成小说生成步骤。");
      return;
    }
    setLoadingScene(true);
    try {
      const res = await recognizeScenes({
        novel_text: novelText,
        visual_spec: visualSpec,
        num_shots: numShots,
      });
      setScenes(res.scenes || []);
    } catch (err) {
      console.error("场景识别失败:", err);
      alert("场景识别失败");
    } finally {
      setLoadingScene(false);
    }
  }

  async function handleGenerateStoryboard() {
    if (scenes.length === 0) {
      alert("请先完成场景识别");
      return;
    }
    setLoadingImage(true);
    try {
      const res = await generateStoryboard({
        novel_text: novelText,
        scenes,
        visual_spec: visualSpec,
      });
      setGeneratedImages(res.images || []);
      setImagePrompts(res.prompts || []);
    } catch (err) {
      console.error("分镜出图失败:", err);
      alert("分镜出图失败");
    } finally {
      setLoadingImage(false);
    }
  }

  return (
    <div className="text-gray-700">
      {/* <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          场景识别与出图生成
        </h2>
        <p className="text-sm text-gray-500">
          系统会自动识别场景分镜，并生成漫画图像。
        </p>
      </div> */}

      {/* 场景识别卡片 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            场景识别
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-16 border rounded px-2 py-1 text-sm"
              value={numShots}
              onChange={(e) => setNumShots(Number(e.target.value))}
            />
            <span className="text-sm text-gray-600">分镜数量</span>
          </div>
        </div>

        <button
          onClick={handleRecognizeScenes}
          disabled={loadingScene}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-50"
        >
          {loadingScene ? "识别中..." : "执行识别"}
        </button>

        {scenes.length > 0 && (
          <div className="mt-4 max-h-[200px] overflow-y-auto border-t pt-3 text-sm">
            <h4 className="font-semibold mb-2">识别结果：</h4>
            <pre className="whitespace-pre-wrap break-words text-gray-800">
              {JSON.stringify(scenes, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* 出图生成卡片 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          分镜出图生成
        </h3>

        <button
          onClick={handleGenerateStoryboard}
          disabled={loadingImage}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50"
        >
          {loadingImage ? "生成中..." : "执行生成"}
        </button>

        {generatedImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedImages.map((img, idx) => (
              <div key={idx} className="border rounded overflow-hidden">
                <img
                  src={img}
                  alt={`scene-${idx}`}
                  className="w-full h-40 object-cover"
                />
                <div className="text-xs p-2 bg-gray-50 border-t text-gray-600 truncate">
                  {imagePrompts[idx] || "无提示词"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          ← 上一步
        </button>

        <button
          onClick={onNext}
          disabled={generatedImages.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
        >
          下一步：导出作品 →
        </button>
      </div>
    </div>
  );
}
