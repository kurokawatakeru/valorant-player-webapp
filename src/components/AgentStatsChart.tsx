import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { PlayerGrowthStory } from '../api/apiService';

// Chart.jsの登録
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface AgentStatsChartProps {
  growthStory: PlayerGrowthStory;
}

// VALORANTエージェントのカラーマップ
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
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions<'doughnut'>>({});

  useEffect(() => {
    if (!growthStory?.agent_stats || growthStory.agent_stats.length === 0) return;

    // エージェント使用率のデータ準備
    const labels = growthStory.agent_stats.map(agent => agent.agent_name);
    const data = growthStory.agent_stats.map(agent => agent.usage_percentage * 100);
    
    // エージェントごとの色を設定
    const backgroundColor = labels.map(agent => 
      agentColors[agent] || `#${Math.floor(Math.random()*16777215).toString(16)}`
    );

    // チャートデータの設定
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

    // チャートオプションの設定
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 15,
            padding: 15
          }
        },
        title: {
          display: true,
          text: 'エージェント使用率',
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const agent = growthStory.agent_stats?.[context.dataIndex];
              if (!agent) return '';
              
              const lines = [
                `${agent.agent_name}: ${agent.usage_percentage * 100}%`,
                `勝率: ${(agent.win_rate * 100).toFixed(1)}%`,
                `ACS: ${agent.acs}`,
                `K/D: ${agent.kd_ratio.toFixed(2)}`,
                `試合数: ${agent.matches_played}`
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
    return <div className="flex items-center justify-center h-64">データ読み込み中...</div>;
  }

  return (
    <div className="w-full h-64 md:h-80">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default AgentStatsChart;
