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
import { PlayerGrowthStory } from '../api/apiService';

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MapStatsChartProps {
  growthStory: PlayerGrowthStory;
}

// VALORANTマップのカラーマップ
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
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions<'bar'>>({});

  useEffect(() => {
    if (!growthStory?.map_stats || growthStory.map_stats.length === 0) return;

    // マップ名のデータ準備
    const labels = growthStory.map_stats.map(map => map.map_name);
    
    // 勝率データ
    const winRateData = growthStory.map_stats.map(map => map.win_rate * 100);
    
    // ACSデータ（スケールを調整）
    const acsData = growthStory.map_stats.map(map => map.acs / 3);
    
    // マップごとの色を設定
    const backgroundColor = labels.map(map => 
      mapColors[map] || `#${Math.floor(Math.random()*16777215).toString(16)}`
    );

    // チャートデータの設定
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

    // チャートオプションの設定
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
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
              const map = growthStory.map_stats?.[context.dataIndex];
              if (!map) return '';
              
              if (context.dataset.label === '勝率 (%)') {
                return `勝率: ${map.win_rate * 100}% (${Math.round(map.win_rate * map.matches_played)}/${map.matches_played}試合)`;
              } else {
                return `ACS: ${map.acs} / K/D: ${map.kd_ratio.toFixed(2)}`;
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
          position: 'left',
          max: 100
        },
        y1: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'ACS (スケール調整済)'
          },
          position: 'right',
          grid: {
            drawOnChartArea: false
          }
        }
      }
    });
  }, [growthStory]);

  if (!chartData) {
    return <div className="flex items-center justify-center h-64">データ読み込み中...</div>;
  }

  return (
    <div className="w-full h-64 md:h-80">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MapStatsChart;
