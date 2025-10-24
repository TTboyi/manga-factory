import React, { useEffect } from "react";
import "../App.css";
import FlowChart from "../FlowChart";
import { Icon } from "@iconify/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import HomePage from './HomePage'; // 这里导入你的 HomePage
import { Link } from 'react-router-dom';


const FeatureCards: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* 功能卡片1 */}
    <div className="card p-8">
      <div className="feature-icon flex items-center justify-center mb-6">
        <Icon icon="mdi:view-grid-outline" className="text-4xl text-white" />
      </div>
      <h3 className="text-2xl font-semibold mb-4">智能分镜</h3>
      <p className="text-gray-600 mb-4">
        AI自动分析小说情节，拆分为连贯的漫画分镜布局，智能分配对话气泡位置
      </p>
      <div className="mt-4">
        <img
          alt="AI comic panel layout example"
          className="rounded-lg"
          id="1"
          src="/agent-py/workspace/68f5e7a9d18e7716f437bfc9/generated_images/f027b36491ee44b6a5e1b8aebf8499a3.jpg"
        />
      </div>
    </div>

    {/* 功能卡片2 */}
    <div className="card p-8">
      <div className="feature-icon flex items-center justify-center mb-6">
        <Icon icon="mdi:account-supervisor" className="text-4xl text-white" />
      </div>
      <h3 className="text-2xl font-semibold mb-4">角色生成</h3>
      <p className="text-gray-600 mb-4">
        根据文字描述创建个性化角色形象，支持多种外观特征和服装风格定制
      </p>
      <div className="mt-4">
        <img
          alt="AI generated comic character design"
          className="rounded-lg"
          id="2"
          src="/agent-py/workspace/68f5e7a9d18e7716f437bfc9/generated_images/340bf06e31c14660a40806c3ac8a1ee8.jpg"
        />
      </div>
    </div>

    {/* 功能卡片3 */}
    <div className="card p-8">
      <div className="feature-icon flex items-center justify-center mb-6">
        <Icon icon="mdi:palette-outline" className="text-4xl text-white" />
      </div>
      <h3 className="text-2xl font-semibold mb-4">风格定制</h3>
      <p className="text-gray-600 mb-4">
        日系、美式、国风等多种漫画风格任选，一键切换视觉表现效果
      </p>
      <div className="mt-4">
        <img
          alt="Different comic style examples"
          className="rounded-lg"
          id="3"
          src="/agent-py/workspace/68f5e7a9d18e7716f437bfc9/generated_images/e7a59c2b52d3452fa6b0c24236409879.jpg"
        />
      </div>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  useEffect(() => {
    // 平滑滚动（箭头函数 + 不用 this）
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      const target = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (target) document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    };
    anchors.forEach((a) => a.addEventListener("click", handleClick));
    return () => anchors.forEach((a) => a.removeEventListener("click", handleClick));
  }, []);

  return (
    
    <div className="App">
      {/* 导航栏 */}
      <header className="nav-bar fixed w-full z-50">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center">
            <Icon icon="mdi:comic" className="text-3xl text-[#3EBBF5]" />
            <span className="ml-2 text-2xl font-bold text-[#3EBBF5]">漫画工厂</span>
          </div>
          <nav className="flex space-x-8">
            <a className="text-lg font-medium hover:text-[#3EBBF5]" href="#features">功能介绍</a>
            <a className="text-lg font-medium hover:text-[#3EBBF5]" href="#about">关于我们</a>
          </nav>
          <div>
            <Link to="/login">
            <button className="px-6 py-2 rounded-full border border-[#3EBBF5] text-[#3EBBF5] font-medium hover:bg-[#3EBBF5]/10">
              登录/注册
            </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero 区域 */}
      <section className="hero-section pt-20 flex items-center">
        <div className="container text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">漫画工厂</h1>
          <p className="text-3xl md:text-4xl text-white mb-12">AI赋能，让小说秒变精彩漫画</p>

          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex justify-center">
              <Icon icon="mdi:book-open-variant" className="text-6xl text-white" />
            </div>
            <div className="flex justify-center">
              <Icon icon="mdi:arrow-right-thick" className="text-6xl text-white" />
            </div>
            <div className="flex justify-center">
              <Icon icon="mdi:image-multiple" className="text-6xl text-white" />
            </div>
          </div>

          <div className="mt-16 mb-12">
            <Link to = "/home">
            <button className="hero-cta-btn mx-auto">
              <span className="flex items-center justify-center">
                立即使用
                <Icon icon="mdi:arrow-right-circle" className="ml-2 text-2xl" />
              </span>
            </button>
            </Link>
          </div>

          <div className="mt-8 animate-bounce">
            <Icon icon="mdi:chevron-down" className="text-4xl text-white scroll-down-arrow" />
          </div>
        </div>
      </section>

      {/* 产品说明区域 */}
      <section className="py-20" id="features">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">AI小说生成漫画，创作从未如此简单</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6">
                漫画工厂采用先进的AI技术，能够智能分析小说文本内容，自动识别场景、角色和情节发展，将它们转化为精致的漫画分镜。
              </p>
              <p className="text-lg mb-6">
                我们的深度学习模型理解文学描写，提取关键视觉元素，生成符合故事氛围的画面构图和角色表情，让作者零基础也能创作专业级漫画作品。
              </p>
              <p className="text-lg">
                无需任何绘画技能，只需输入文字，AI就能在10秒内输出完整漫画分镜，支持多种风格自定义，满足不同题材需求。
              </p>
            </div>
            <FlowChart />
          </div>

          {/* 统计数据卡片 */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="data-card p-6 text-center border-2 border-transparent border-image-[linear-gradient(45deg,_#3EBBF5,_#A78BFA)] border-image-slice-1">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FFB86C]">
                10秒
              </div>
              <p className="text-gray-600 mt-2">快速生成</p>
            </div>

            <div className="data-card p-6 text-center border-2 border-transparent border-image-[linear-gradient(45deg,_#3EBBF5,_#A78BFA)] border-image-slice-1">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3EBBF5] to-[#A78BFA]">
                100万+
              </div>
              <p className="text-gray-600 mt-2">创作者</p>
            </div>

            <div className="data-card p-6 text-center border-2 border-transparent border-image-[linear-gradient(45deg,_#3EBBF5,_#A78BFA)] border-image-slice-1">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#06D6A0] to-[#3EBBF5]">
                500+
              </div>
              <p className="text-gray-600 mt-2">漫画风格</p>
            </div>
          </div>
        </div>
      </section>

      {/* 功能介绍区域 */}
      <section className="py-20 bg-white/50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">核心功能</h2>
          <FeatureCards />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <button className="primary-btn text-white mx-auto mb-6">立即使用</button>
          <p className="text-gray-600">无需下载，即刻体验AI创作魔力</p>
        </div>
      </section>

    

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-white" id="about">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">漫画工厂</h3>
              <p className="text-gray-400">用AI技术重新定义漫画创作流程</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">联系我们</h3>
              <p className="text-gray-400">contact@manhua.com</p>
              <p className="text-gray-400">400-888-9999</p>
              <div className="flex space-x-4 mt-4">
                <Icon icon="mdi:wechat" className="text-2xl" />
                <Icon icon="mdi:weibo" className="text-2xl" />
                <Icon icon="mdi:twitter" className="text-2xl" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">友情链接</h3>
              <ul className="space-y-2">
                <li><a className="text-gray-400 hover:text-white" href="#">小说创作平台</a></li>
                <li><a className="text-gray-400 hover:text-white" href="#">AI艺术社区</a></li>
                <li><a className="text-gray-400 hover:text-white" href="#">数字出版服务</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
            <p>© 2023 漫画工厂 版权所有 | 京ICP备12345678号</p>
          </div>
        </div>
      </footer>
    </div>
    
  );
};

export default LandingPage;
