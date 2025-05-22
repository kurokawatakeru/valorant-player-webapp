import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  growthStory: PlayerGrowthStory;
  metric: 'acs' | 'kd_ratio' | 'win_rate' | 'headshot_percentage';
  title: string;
  color: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  growthStory, 
  metric, 
  title,
  color
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});

  useEffect(() => {
    if (!growthStory?.performance_trends) return;

    // フェーズの境界を取得
    const phaseMarkers = growthStory.career_phases?.map(phase => {
      return {
        date: phase.start_date,
        label: phase.phase_name
      };
    }) || [];

    // データの準備
    const labels = growthStory.performance_trends.map(point => {
      const date = new Date(point.date);
      return `${date.getFullYear()}/${date.getMonth() + 1}`;
    });

    const metricData = growthStory.performance_trends.map(point => point[metric] || 0);

    // 移動平均の計算（3ポイント）
    const movingAverage = metricData.map((value, index, array) => {
      if (index < 1 || index >= array.length - 1) return value;
      return (array[index - 1] + value + array[index + 1]) / 3;
    });

    // フェーズ境界の垂直線を追加するためのアノテーション設定
    const annotations: any = {};
    phaseMarkers.forEach((marker, index) => {
      const markerIndex = labels.findIndex(label => {
        const date = new Date(marker.date);
        return label === `${date.getFullYear()}/${date.getMonth() + 1}`;
      });

      if (markerIndex !== -1) {
        annotations[`phase${index}`] = {
          type: 'line',
          scaleID: 'x',
          value: markerIndex,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          borderWidth: 2,
          label: {
            content: marker.label,
            enabled: true,
            position: 'top'
          }
        };
      }
    });

    // チャートデータの設定
    setChartData({
      labels,
      datasets: [
        {
          label: title,
          data: metricData,
          borderColor: color,
          backgroundColor: `${color}33`,
          pointRadius: 3,
          tension: 0.3,
          fill: false
        },
        {
          label: `${title} (移動平均)`,
          data: movingAverage,
          borderColor: `${color}99`,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.4,
          fill: false
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
          text: `${title}の推移`,
          font: {
            size: 16
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        annotation: {
          annotations
        }
      },
      scales: {
        y: {
          beginAtZero: metric === 'win_rate' || metric === 'headshot_percentage',
          title: {
            display: true,
            text: getYAxisLabel(metric)
          }
        },
        x: {
          title: {
            display: true,
            text: '時期'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    });
  }, [growthStory, metric, title, color]);

  // Y軸のラベルを取得
  const getYAxisLabel = (metric: string): string => {
    switch (metric) {
      case 'acs':
        return 'ACS (Average Combat Score)';
      case 'kd_ratio':
        return 'K/D比';
      case 'win_rate':
        return '勝率';
      case 'headshot_percentage':
        return 'ヘッドショット率';
      default:
        return '';
    }
  };

  if (!chartData) {
    return <div className="flex items-center justify-center h-64">データ読み込み中...</div>;
  }

  return (
    <div className="w-full h-64 md:h-80">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PerformanceChart;
