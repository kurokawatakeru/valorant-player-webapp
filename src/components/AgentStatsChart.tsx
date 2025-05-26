import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title, // Titleを追加
  ChartOptions
} from 'chart.js';
import { AgentStatSummary } from '../api/apiService'; // 更新された型をインポート
import { LoadingStates } from './ui/LoadingSpinner';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title // Titleを登録
);

interface AgentStatsChartProps {
  agentStats: AgentStatSummary[];
}

// VALORANTエージェントのカラーマップ (既存のものを流用)
const agentColors: Record<string, string> = {
  'Jett': '#9BDDFF', 'Raze': '#D97F4A', 'Reyna': '#9D4EDD', 'Phoenix': '#F7941D',
  'Sage': '#1EAAA0', 'Omen': '#5A5D9D', 'Brimstone': '#A52F1A', 'Sova': '#124F9E',
  'Viper': '#46A973', 'Cypher': '#DCDCDC', 'Killjoy': '#FFCD00', 'Breach': '#C26D53',
  'Skye': '#94C661', 'Yoru': '#1B4AEF', 'Astra': '#9F4AFF', 'KAY/O': '#5B8CD7',
  'Chamber': '#C9A66A', 'Neon': '#00FFFF', 'Fade': '#5E5159', 'Harbor': '#0A7263',
  'Gekko': '#A7F04F', 'Deadlock': '#B3B6B5', 'Clove': '#FF69B4', 'Iso': '#FF6B00',
  'Vyse': '#708090', // 新しいエージェントの仮色
  'その他': '#A9A9A9' // ダークグレー
};

const AgentStatsChart: React.FC<AgentStatsChartProps> = ({ agentStats }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions<'doughnut'>>({});

  useEffect(() => {
    if (!agentStats || agentStats.length === 0) {
      setChartData(null);
      return;
    }

    // 上位N件のエージェントと「その他」に集約 (例: 上位5件)
    const topN = 5;
    const sortedAgents = [...agentStats].sort((a, b) => (b.matches_played || 0) - (a.matches_played || 0));
    const topAgents = sortedAgents.slice(0, topN);
    const otherAgents = sortedAgents.slice(topN);

    const labels = topAgents.map(agent => agent.agent_name);
    const data = topAgents.map(agent => agent.matches_played); // 使用試合数で表示

    if (otherAgents.length > 0) {
      labels.push('その他');
      data.push(otherAgents.reduce((sum, agent) => sum + (agent.matches_played || 0), 0));
    }
    
    const backgroundColor = labels.map(agent => 
      agentColors[agent] || `#${Math.floor(Math.random()*16777215).toString(16)}`
    );

    setChartData({
      labels,
      datasets: [
        {
          label: '試合数', // データセットのラベル
          data,
          backgroundColor,
          borderColor: backgroundColor.map(color => `${color}CC`), // 少し濃いボーダー
          borderWidth: 1,
          hoverOffset: 8, // ホバー時のオフセットを調整
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
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
            font: { size: 10 },
            boxWidth: 12,
            padding: 12,
          }
        },
        title: {
          display: true,
          text: 'エージェント別 試合数',
          font: {
            size: 14,
            weight: 'bold',
          },
           padding: { top: 5, bottom: 15 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw as number;
              let tooltipText = `${label}: ${value}試合`;

              const originalAgentStat = agentStats.find(s => s.agent_name === label);
              if (originalAgentStat) {
                tooltipText += ` (勝率: ${(originalAgentStat.win_rate * 100).toFixed(1)}%, ACS: ${originalAgentStat.acs_avg?.toFixed(1)}, K/D: ${originalAgentStat.kd_ratio_avg?.toFixed(2)})`;
              } else if (label === 'その他' && otherAgents.length > 0) {
                // 「その他」の内訳を表示することも検討可能だが、ツールチップが長くなりすぎる可能性あり
                const totalMatchesOther = otherAgents.reduce((sum, agent) => sum + (agent.matches_played || 0), 0);
                 if (totalMatchesOther > 0) {
                    const avgWinRateOther = otherAgents.reduce((sum, agent) => sum + (agent.win_rate * (agent.matches_played || 0)), 0) / totalMatchesOther;
                    tooltipText += ` (平均勝率: ${(avgWinRateOther * 100).toFixed(1)}%)`;
                 }
              }
              return tooltipText;
            }
          }
        }
      },
      cutout: '60%' // ドーナツの穴のサイズ
    });
  }, [agentStats]);

  if (!agentStats || agentStats.length === 0) {
    return <div className="flex items-center justify-center h-full text-sm text-gray-500">エージェントデータがありません。</div>;
  }
  if (!chartData) {
    return <LoadingStates.Chart />;
  }

  return (
    <div className="w-full h-64 md:h-72 relative"> {/* 中央にテキストを表示するため relative を追加 */}
      <Doughnut data={chartData} options={chartOptions} />
       {/* チャートの中央に総試合数を表示する例 (オプション) */}
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-xs text-gray-500">総試合</p>
        <p className="text-xl font-bold text-gray-700">
          {agentStats.reduce((sum, stat) => sum + (stat.matches_played || 0), 0)}
        </p>
      </div> */}
    </div>
  );
};

export default AgentStatsChart;
