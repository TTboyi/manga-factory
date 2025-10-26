import React from "react";

const Center: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-start font-sans text-[#333]">
      {/* 顶部标题栏 */}
      <header className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide text-gray-800">
          文字转漫画生成器
        </h1>
        <nav className="flex gap-6">
          <a href="#" className="text-gray-600 hover:text-blue-500">
            首页
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-500">
            作品库
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-500">
            关于
          </a>
        </nav>
      </header>

      {/* 中心内容区 */}
      <main className="flex flex-col items-center justify-center w-full max-w-5xl mt-16 px-6">
        <section className="w-full bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-center border-b border-gray-200 pb-4">
            创作你的专属漫画
          </h2>

          {/* 输入区 */}
          <div className="flex flex-col gap-6">
            {/* 小说输入框 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                小说文本（或上传文件）：
              </label>
              <textarea
                placeholder="请输入或粘贴你的小说文本……"
                className="w-full min-h-[200px] border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="mt-2 flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                  上传文件
                </button>
              </div>
            </div>

            {/* 风格与角色区 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  画风描述：
                </label>
                <textarea
                  placeholder="请输入你想要的画风描述（例如：日系手绘、写实风格、二次元）"
                  className="w-full h-[150px] border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  角色设定：
                </label>
                <textarea
                  placeholder="请输入角色外貌与性格特征，例如：黑色短发、坚毅的目光、穿风衣"
                  className="w-full h-[150px] border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* 按钮区 */}
            <div className="flex justify-center gap-8 mt-6">
              <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium">
                重置
              </button>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 shadow font-medium transition">
                生成漫画
              </button>
            </div>
          </div>
        </section>

        {/* 底部提示 */}
        <div className="text-gray-500 text-sm mt-8 text-center">
          <p>提示：输入越详细，生成的漫画效果越好。</p>
          <p>系统支持多场景自动分镜、角色风格分析与千问文生图生成。</p>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-20 w-full bg-white py-6 text-center text-gray-500 text-sm border-t">
        <p>© 2025 漫画生成系统 · All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Center;
