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
import { MapStatSummary } from '../api/apiService'; // 更新された型をインポート
import { LoadingStates } from './ui/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MapStatsChartProps {
  mapStats: MapStatSummary[];
}

const mapColors: Record<string, string> = {
  'Ascent': '#7BAF6F', 'Bind': '#D8973C', 'Haven': '#6B81C5', 'Split': '#A35A8A',
  'Icebox': '#88CFDE', 'Breeze': '#59A9A9', 'Fracture': '#D16A6A', 'Pearl': '#5E7B99',
  'Lotus': '#B86DB1', 'Sunset': '#F7941D', 'Abyss': '#4B0082', // 新マップ仮色
  'その他': '#A9A9A9'
};

const MapStatsChart: React.FC<MapStatsChartProps> = ({ mapStats }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions<'bar'>>({});

  useEffect(() => {
    if (!mapStats || mapStats.length === 0) {
      setChartData(null);
      return;
    }
    
    // 試合数でソートし、上位N件などを表示することも検討 (今回は全マップ表示)
    const sortedMapStats = [...mapStats].sort((a,b) => (b.matches_played || 0) - (a.matches_played || 0));

    const labels = sortedMapStats.map(map => map.map_name);
    const winRateData = sortedMapStats.map(map => (map.win_rate || 0) * 100); // %表示
    // const matchesPlayedData = sortedMapStats.map(map => map.matches_played); // 試合数も表示する場合

    const backgroundColors = labels.map(map => 
      mapColors[map] || `#${Math.floor(Math.random()*16777215).toString(16)}`
    );

    setChartData({
      labels,
      datasets: [
        {
          label: '勝率 (%)',
          data: winRateData,
          backgroundColor: backgroundColors.map(color => `${color}B3`), // 少し透明度を上げる
          borderColor: backgroundColors,
          borderWidth: 1,
          yAxisID: 'y_win_rate' // 複数のY軸を使う場合
        },
         { // 試合数も表示する場合の例
          label: '試合数',
          data: matchesPlayedData,
          backgroundColor: backgroundColors.map(color => `${color}66`),
          borderColor: backgroundColors.map(color => `${color}AA`),
          borderWidth: 1,
          yAxisID: 'y_matches_played'
        }
      ]
    });

    setChartOptions({
      indexAxis: 'y' as const, // 横棒グラフに変更
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // データセットが1つの場合は凡例を非表示にすることも検討
          position: 'top' as const,
          labels: { font: {size: 10}, boxWidth: 12, padding: 10 }
        },
        title: {
          display: true,
          text: 'マップ別 勝率',
          font: { size: 14, weight: 'bold' },
          padding: { top: 5, bottom: 15 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const mapStat = sortedMapStats[context.dataIndex];
              if (!mapStat) return '';
              
              if (context.dataset.label === '勝率 (%)') {
                return `勝率: ${(mapStat.win_rate * 100).toFixed(1)}% (${mapStat.wins}勝 ${mapStat.losses}敗 / 計${mapStat.matches_played}試合)`;
              }
              // 他のデータセット用のツールチップ (例: 試合数)
              // if (context.dataset.label === '試合数') {
              //   return `試合数: ${mapStat.matches_played}`;
              // }
              return `${context.dataset.label}: ${context.formattedValue}`;
            }
          }
        }
      },
      scales: {
        x: { // 横棒グラフなのでX軸が値になる
          beginAtZero: true,
          max: 100, // 勝率は100%が最大
          title: {
            display: true,
            text: '勝率 (%)',
            font: { size: 10 }
          },
          ticks: {
            font: {size: 9},
            callback: (value) => `${value}%` // X軸の目盛りに%を付与
          }
        },
        y: { // 横棒グラフなのでY軸がマップ名になる
          ticks: { font: {size: 9} }
        }
        // 複数のY軸を使う場合の例
        // y_win_rate: { position: 'left', title: { display: true, text: '勝率 (%)' }, max: 100, beginAtZero: true },
        // y_matches_played: { position: 'right', title: { display: true, text: '試合数' }, grid: { drawOnChartArea: false }, beginAtZero: true }
      },
       elements: {
        bar: {
          borderRadius: 3, // バーの角を少し丸める
        }
      }
    });
  }, [mapStats]);

  if (!mapStats || mapStats.length === 0) {
    return <div className="flex items-center justify-center h-full text-sm text-gray-500">マップデータがありません。</div>;
  }
  if (!chartData) {
    return <LoadingStates.Chart />;
  }

  return (
    <div className="w-full h-72 md:h-80"> {/* 横棒グラフなので高さを確保 */}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MapStatsChart;