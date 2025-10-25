import React from "react";

interface ProgressBarProps {
  stage: number; // 当前阶段 1/2/3
}

const steps = [
  { id: 1, title: "上传小说" },
  { id: 2, title: "视觉规范" },
  { id: 3, title: "生成分镜" },
];

const ProgressBar: React.FC<ProgressBarProps> = ({ stage }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-40 px-10 py-3">
      <div className="flex items-center justify-center gap-10">
        {steps.map((step, index) => {
          const isActive = stage === step.id;
          const isDone = stage > step.id;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-green-400 border-green-400 text-white"
                    : isActive
                    ? "bg-blue-400 border-blue-400 text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {step.id}
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive || isDone ? "text-black" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>

              {/* 连线 */}
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-[2px] ${
                    isDone ? "bg-green-400" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
