import React, { useState, useEffect } from "react";
import {
  FaPalette,
  FaHome,
  FaFolder,
  FaImages,
  FaCog,
  FaChevronDown,
  FaHistory,
  FaThLarge,
  FaQuestionCircle,
  FaPlus,
} from "react-icons/fa";

import Step1TextInput from "./steps/Step1TextInput";
import Step2CharacterSetting from "./steps/Step2CharacterSetting";
import Step3Preview from "./steps/Step3Preview";
import Step4Export from "./steps/Step4Export";
import type { Scene, VisualSpec } from "../types";

export default function CenterPage() {
  const [step, setStep] = useState<number>(1);

  // ===== Step 1 =====
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [novelText, setNovelText] = useState<string>("");
  const [outline, setOutline] = useState<string>("");
  const [novelTextProcessed, setNovelTextProcessed] = useState<string>("");

  // ===== Step 2 =====
  const [roleFeature, setRoleFeature] = useState<string>("");
  const [styleFeature, setStyleFeature] = useState<string>("");
  const [roleImageFile, setRoleImageFile] = useState<File | null>(null);
  const [styleImageFile, setStyleImageFile] = useState<File | null>(null);
  const [visualSpec, setVisualSpec] = useState<VisualSpec | any>({});
  const [visualAnalysisRaw, setVisualAnalysisRaw] = useState<string>("");

  // ===== Step 3 =====
  const [numShots, setNumShots] = useState<number>(4);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imagePrompts, setImagePrompts] = useState<string[]>([]);
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // ===== Step 4 =====
  const [projectId, setProjectId] = useState<number | null>(null);

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));
  const gotoStep = (n: number) => setStep(n);

  // ============ Header ============
  const Header = () => (
    <header className="flex items-center justify-between px-5 h-[60px] bg-white shadow-sm">
      <div className="flex items-center font-bold text-[18px] text-indigo-600">
        <FaPalette className="mr-2 text-[22px]" />
        <span>Manga Factory</span>
      </div>
      <nav className="hidden md:block">
        <ul className="flex list-none">
          <li className="mx-1">
            <button className="flex items-center px-4 py-2 rounded text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-sm font-medium">
              <FaHome className="mr-2" />
              工作台
            </button>
          </li>
          <li className="mx-1">
            <button className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-gray-100 text-sm font-medium">
              <FaFolder className="mr-2" />
              项目
            </button>
          </li>
          <li className="mx-1">
            <button className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-gray-100 text-sm font-medium">
              <FaImages className="mr-2" />
              作品库
            </button>
          </li>
          <li className="mx-1">
            <button className="flex items-center px-4 py-2 rounded text-gray-600 hover:bg-gray-100 text-sm font-medium">
              <FaCog className="mr-2" />
              设置
            </button>
          </li>
        </ul>
      </nav>
      <div className="flex items-center cursor-pointer">
        <div className="w-8 h-8 rounded-full mr-2 bg-gray-200 bg-center bg-no-repeat bg-[length:60%]
        bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22999%22 viewBox=%220 0 24 24%22><path d=%22M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z%22/></svg>')]"/>
        <span className="mr-1 text-[14px] text-gray-700">用户</span>
        <FaChevronDown className="text-gray-500 text-[12px]" />
      </div>
    </header>
  );

  // ============ Sidebar ============
  const Sidebar = () => (
    <aside className="w-[220px] bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
      <div className="px-4 py-4 border-b border-gray-100">
        <h3 className="text-[16px] text-gray-800 font-medium">创作流程</h3>
      </div>
      <div className="py-3">
        {[
          { id: 1, title: "输入文本", desc: "上传或输入小说内容" },
          { id: 2, title: "角色设定", desc: "定义角色特征和风格" },
          { id: 3, title: "生成预览", desc: "查看生成的漫画效果" },
          { id: 4, title: "导出作品", desc: "保存或分享你的创作" },
        ].map((item) => {
          const active = step === item.id;
          return (
            <div
              key={item.id}
              className={`flex items-start px-4 py-3 cursor-pointer transition-colors ${
                active ? "bg-indigo-50" : "hover:bg-gray-50"
              }`}
              onClick={() => gotoStep(item.id)}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full font-bold mr-3 ${
                  active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {item.id}
              </div>
              <div>
                <h4 className="text-[14px] font-medium text-gray-800 mb-1">
                  {item.title}
                </h4>
                <p className="text-[12px] text-gray-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );

  // ============ Right Panel ============
  const [rightTab, setRightTab] = useState<"history" | "templates" | "help">("history");
  const RightPanel = () => (
    <aside className="w-[280px] bg-white border-l border-gray-200 flex-shrink-0 flex flex-col">
      <div className="flex border-b border-gray-100">
        {[
          { key: "history", label: "历史记录", icon: <FaHistory /> },
          { key: "templates", label: "模板", icon: <FaThLarge /> },
          { key: "help", label: "帮助", icon: <FaQuestionCircle /> },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-3 text-[13px] flex items-center justify-center transition-colors ${
              rightTab === tab.key
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setRightTab(tab.key as any)}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 text-gray-800 text-[14px] overflow-y-auto">
        {rightTab === "help" && (
          <p className="text-[13px] leading-relaxed text-gray-600">
            - 第1步：输入或上传小说，由AI生成润色文本。<br />
            - 第2步：设定角色特征与画面风格。<br />
            - 第3步：识别分镜并生成图像。<br />
            - 第4步：保存与导出项目。
          </p>
        )}
      </div>
    </aside>
  );

  // ============ Main ============
  const MainContent = () => (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto p-5">
      {/* 顶部标题 */}
      <div className="mb-5">
        <h2 className="text-[20px] font-semibold text-gray-800">
          {step === 1 && "输入小说文本"}
          {step === 2 && "角色与画面风格设定"}
          {step === 3 && "场景识别与漫画生成"}
          {step === 4 && "导出项目"}
        </h2>
        <p className="text-[14px] text-gray-600">
          {step === 1 && "上传小说或输入大纲，AI 将生成完整小说"}
          {step === 2 && "定义主要角色与风格语言，AI 将统一视觉规范"}
          {step === 3 && "识别分镜并自动生成漫画画面"}
          {step === 4 && "保存你的项目或导出漫画"}
        </p>
      </div>

      {/* 渲染步骤内容 */}
      {step === 1 && (
        <Step1TextInput
          onNext={handleNext}
          novelText={novelText}
          setNovelText={setNovelText}
          outline={outline}
          setOutline={setOutline}
          file={uploadedFile}
          setFile={setUploadedFile}
          novelTextProcessed={novelTextProcessed}
          setNovelTextProcessed={setNovelTextProcessed}
        />
      )}
      {step === 2 && (
        <Step2CharacterSetting
          onNext={handleNext}
          onPrev={handlePrev}
          roleFeature={roleFeature}
          setRoleFeature={setRoleFeature}
          styleFeature={styleFeature}
          setStyleFeature={setStyleFeature}
          roleImageFile={roleImageFile}
          setRoleImageFile={setRoleImageFile}
          styleImageFile={styleImageFile}
          setStyleImageFile={setStyleImageFile}
          novelText={novelTextProcessed || novelText}
          visualSpec={visualSpec}
          setVisualSpec={setVisualSpec}
          visualAnalysisRaw={visualAnalysisRaw}
          setVisualAnalysisRaw={setVisualAnalysisRaw}
        />
      )}
      {step === 3 && (
        <Step3Preview
          onPrev={handlePrev}
          onNext={handleNext}
          novelText={novelTextProcessed || novelText}
          visualSpec={visualSpec}
          scenes={scenes}
          setScenes={setScenes}
          numShots={numShots}
          setNumShots={setNumShots}
          generatedImages={generatedImages}
          setGeneratedImages={setGeneratedImages}
          imagePrompts={imagePrompts}
          setImagePrompts={setImagePrompts}
          isRecognizing={isRecognizing}
          setIsRecognizing={setIsRecognizing}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      )}
      {step === 4 && (
        <Step4Export
          onPrev={handlePrev}
          projectId={projectId}
          setProjectId={setProjectId}
          novelText={novelTextProcessed || novelText}
          scenes={scenes}
          visualSpec={visualSpec}
          generatedImages={generatedImages}
        />
      )}

      {/* 底部操作栏 */}
      <div className="flex justify-between items-center mt-5">
        <span className="text-[13px] text-gray-500">
          {step === 1 && "当前步骤：输入小说 / 上传文本"}
          {step === 2 && "当前步骤：角色设定 / 风格规范"}
          {step === 3 && "当前步骤：识别分镜 / 出图"}
          {step === 4 && "当前步骤：导出作品"}
        </span>
        
      </div>
    </div>
  );

  // ============ FAB ============
  const FloatingFAB = () => (
    <button
      className="fixed right-[30px] bottom-[30px] w-[56px] h-[56px] rounded-full bg-indigo-600 shadow-lg text-white flex items-center justify-center hover:bg-indigo-500 transition-transform z-50"
      onClick={() => console.log("➕ 新建项目")}
    >
      <FaPlus className="text-[24px]" />
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 overflow-hidden">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
        <RightPanel />
      </main>
      <FloatingFAB />
    </div>
  );
}
