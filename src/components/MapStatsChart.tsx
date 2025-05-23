import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { PlayerGrowthStory } from '../api/apiService'; // PlayerGrowthStory をインポート

// Chart.jsの登録 (既存のまま)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MapStatsChartProps {
  growthStory: PlayerGrowthStory; // 型を適用
}

// VALORANTマップのカラーマップ (既存のまま)
const mapColors: Record<string, string> = {
  'Ascent': '#7BAF6F',
  'Bind': '#D8973C',
  'Haven': '#6B81C5',
  'Split': '#A35A8A',
  'Icebox': '#88CFDE',
  'Breeze': '#59A9A9',
  'Fracture': '#D16A6A',
  'Pearl': '#5E7B99',
  'Lotus': '#B86DB1',
  'Sunset': '#F7941D',
  'その他': '#888888'
};

const MapStatsChart: React.FC<MapStatsChartProps> = ({ growthStory }) => {
  const [chartData, setChartData] = useState<any>(null); // Chart.js のデータ型に合わせる
  const [chartOptions, setChartOptions] = useState<ChartOptions<'bar'>>({});

  useEffect(() => {
    // 修正: map_stats -> mapStats
    if (!growthStory?.mapStats || growthStory.mapStats.length === 0) {
      setChartData(null); // データがない場合はnullを設定
      return;
    }

    const labels = growthStory.mapStats.map(map => map.mapName); // 修正: map_name -> mapName
    
    // Liquipediaから取得できるデータに合わせて調整
    const winRateData = growthStory.mapStats.map(map => (map.winRate || 0) * 100); // 修正: win_rate -> winRate
    const acsData = growthStory.mapStats.map(map => (map.acs || 0) / 3); // スケール調整は残す
    
    const backgroundColor = labels.map(mapName => // map -> mapName
      mapColors[mapName] || `#${Math.floor(Math.random()*16777215).toString(16)}`
    );

    setChartData({
      labels,
      datasets: [
        {
          label: '勝率 (%)',
          data: winRateData,
          backgroundColor: backgroundColor.map(color => `${color}99`),
          borderColor: backgroundColor,
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'ACS (スケール調整済)',
          data: acsData,
          backgroundColor: backgroundColor.map(color => `${color}55`),
          borderColor: backgroundColor.map(color => `${color}dd`),
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'マップ別パフォーマンス',
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              // 修正: map_stats -> mapStats
              const map = growthStory.mapStats?.[context.dataIndex];
              if (!map) return '';
              
              // Liquipediaから取得できるデータに合わせて調整
              if (context.dataset.label === '勝率 (%)') {
                return `勝率: ${(map.winRate || 0) * 100}% (${Math.round((map.winRate || 0) * (map.matchesPlayed || 0))}/${map.matchesPlayed || 'N/A'}試合)`;
              } else {
                return `ACS: ${map.acs || 'N/A'} / K/D: ${map.kdRatio ? map.kdRatio.toFixed(2) : 'N/A'}`; // kd_ratio -> kdRatio
              }
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '勝率 (%)'
          },
          position: 'left' as const,
          max: 100
        },
        y1: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'ACS (スケール調整済)'
          },
          position: 'right' as const,
          grid: {
            drawOnChartArea: false
          }
        }
      }
    });
  }, [growthStory]);

  if (!chartData) {
    return <div className="flex items-center justify-center h-64 text-gray-500">マップ統計データがありません。</div>;
  }

  return (
    <div className="w-full h-64 md:h-80">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MapStatsChart;
