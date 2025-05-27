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
import { MapStatSummary } from '../api/apiService'; 
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
  'Lotus': '#B86DB1', 'Sunset': '#F7941D', 'Abyss': '#4B0082', 
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
    
    const sortedMapStats = [...mapStats].sort((a,b) => (b.matches_played || 0) - (a.matches_played || 0));

    const labels = sortedMapStats.map(map => map.map_name);
    const winRateData = sortedMapStats.map(map => (map.win_rate || 0) * 100); 

    const backgroundColors = labels.map(map => 
      mapColors[map] || `#${Math.floor(Math.random()*16777215).toString(16)}`
    );

    setChartData({
      labels,
      datasets: [
        {
          label: '勝率 (%)',
          data: winRateData,
          backgroundColor: backgroundColors.map(color => `${color}B3`), 
          borderColor: backgroundColors,
          borderWidth: 1,
        },
        // ★ matchesPlayedData の参照を削除
      ]
    });

    setChartOptions({
      indexAxis: 'y' as const, 
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, 
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
              return `${context.dataset.label}: ${context.formattedValue}`;
            }
          }
        }
      },
      scales: {
        x: { 
          beginAtZero: true,
          max: 100, 
          title: {
            display: true,
            text: '勝率 (%)',
            font: { size: 10 }
          },
          ticks: {
            font: {size: 9},
            callback: (value) => `${value}%` 
          }
        },
        y: { 
          ticks: { font: {size: 9} }
        }
      },
       elements: {
        bar: {
          borderRadius: 3, 
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
    <div className="w-full h-72 md:h-80"> 
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MapStatsChart;
