import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { PlayerGrowthStory } from '../api/apiService'; // PlayerGrowthStory をインポート

// Chart.jsの登録
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface AgentStatsChartProps {
  growthStory: PlayerGrowthStory; // 型を適用
}

// VALORANTエージェントのカラーマップ (既存のまま)
const agentColors: Record<string, string> = {
  'Jett': '#9BDDFF',
  'Raze': '#D97F4A',
  'Reyna': '#9D4EDD',
  'Phoenix': '#F7941D',
  'Sage': '#1EAAA0',
  'Omen': '#5A5D9D',
  'Brimstone': '#A52F1A',
  'Sova': '#124F9E',
  'Viper': '#46A973',
  'Cypher': '#DCDCDC',
  'Killjoy': '#FFCD00',
  'Breach': '#C26D53',
  'Skye': '#94C661',
  'Yoru': '#1B4AEF',
  'Astra': '#9F4AFF',
  'KAY/O': '#5B8CD7',
  'Chamber': '#C9A66A',
  'Neon': '#00FFFF',
  'Fade': '#5E5159',
  'Harbor': '#0A7263',
  'Gekko': '#A7F04F',
  'Deadlock': '#B3B6B5',
  'Clove': '#FF69B4',
  'Iso': '#FF6B00',
  'その他': '#888888'
};

const AgentStatsChart: React.FC<AgentStatsChartProps> = ({ growthStory }) => {
  const [chartData, setChartData] = useState<any>(null); // Chart.js のデータ型に合わせる
  const [chartOptions, setChartOptions] = useState<ChartOptions<'doughnut'>>({});

  useEffect(() => {
    // 修正: agent_stats -> agentStats
    if (!growthStory?.agentStats || growthStory.agentStats.length === 0) {
      setChartData(null); // データがない場合はnullを設定
      return;
    }

    // エージェント使用率のデータ準備
    const labels = growthStory.agentStats.map(agent => agent.agentName); // 修正: agent_name -> agentName
    // usage_percentage があると仮定、なければ別の値（例: matches_played）を使用
    const data = growthStory.agentStats.map(agent => (agent.usagePercentage || agent.matches_played || 0) * 100);

    // エージェントごとの色を設定
    const backgroundColor = labels.map(agentName => // agent -> agentName
      agentColors[agentName] || `#${Math.floor(Math.random()*16777215).toString(16)}`
    );

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: backgroundColor.map(color => `${color}99`),
          borderWidth: 1,
          hoverOffset: 15
        }
      ]
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            boxWidth: 15,
            padding: 15
          }
        },
        title: {
          display: true,
          text: 'エージェント使用統計', // タイトル変更
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              // 修正: agent_stats -> agentStats
              const agent = growthStory.agentStats?.[context.dataIndex];
              if (!agent) return '';
              
              // 表示する情報はLiquipediaから取得できる内容に合わせる
              const lines = [
                `${agent.agentName}: ${context.parsed.toFixed(1)}%`, // 修正: agent.agent_name -> agent.agentName
                // 以下はサンプル、実際のデータ構造に合わせて調整
                `試合数: ${agent.matches_played || 'N/A'}`,
                `勝率: ${agent.win_rate ? (agent.win_rate * 100).toFixed(1) + '%' : 'N/A'}`,
                `ACS: ${agent.acs || 'N/A'}`,
                `K/D: ${agent.kd_ratio ? agent.kd_ratio.toFixed(2) : 'N/A'}`,
              ];
              
              return lines;
            }
          }
        }
      },
      cutout: '50%'
    });
  }, [growthStory]);

  if (!chartData) {
    return <div className="flex items-center justify-center h-64 text-gray-500">エージェント統計データがありません。</div>;
  }

  return (
    <div className="w-full h-64 md:h-80">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default AgentStatsChart;
