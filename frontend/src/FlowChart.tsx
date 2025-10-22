import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const FlowChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    // 如果之前有实例，先销毁，防止重复初始化
    if (echarts.getInstanceByDom(chartDom)) {
      echarts.dispose(chartDom);
    }

    const chart = echarts.init(chartDom);

    const option = {
      tooltip: { show: false },
      animation: true,
      series: [
        {
          type: "graph",
          layout: "none",
          symbolSize: 60,
          roam: true,
          label: { show: true, fontSize: 14 },
          edgeSymbol: ["circle", "arrow"],
          edgeSymbolSize: [0, 10],
          data: [
            { name: "小说文本", x: 50, y: 100 },
            { name: "AI分析", x: 250, y: 100 },
            { name: "角色生成", x: 150, y: 230 },
            { name: "分镜布局", x: 350, y: 230 },
            { name: "漫画输出", x: 450, y: 100 },
          ],
          links: [
            { source: "小说文本", target: "AI分析" },
            { source: "AI分析", target: "角色生成" },
            { source: "AI分析", target: "分镜布局" },
            { source: "角色生成", target: "分镜布局" },
            { source: "分镜布局", target: "漫画输出" },
          ],
          lineStyle: { color: "#3EBBF5", width: 2, curveness: 0.2 },
        },
      ],
    };

    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());

    return () => {
      window.removeEventListener("resize", () => chart.resize());
      chart.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className="flow-chart"
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    ></div>
  );
};

export default FlowChart;
