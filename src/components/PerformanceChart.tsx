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
  ChartOptions,
  Filler 
} from 'chart.js';
import { PerformanceTrendPoint } from '../api/apiService'; 
import { LoadingStates } from './ui/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler 
);

interface PerformanceChartProps {
  performanceTrends: PerformanceTrendPoint[];
  metric: keyof Pick<PerformanceTrendPoint, 'acs' | 'kd_ratio' | 'hs_percentage'>; 
  title: string;
  color: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  performanceTrends, 
  metric, 
  title,
  color
}) => {
  const [chartData, setChartData] = useState<any>(null); 
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});

  useEffect(() => {
    if (!performanceTrends || performanceTrends.length === 0) {
      setChartData(null); 
      return;
    }

    const labels = performanceTrends.map(point => {
      const date = new Date(point.date);
      return `${date.getFullYear().toString().slice(-2)}/${date.getMonth() + 1}`;
    });

    const metricData = performanceTrends.map(point => point[metric] || 0);

    const movingAverage = metricData.map((_, index, array) => {
      const windowSize = 5;
      const start = Math.max(0, index - Math.floor(windowSize / 2));
      const end = Math.min(array.length, index + Math.ceil(windowSize / 2));
      const windowSlice = array.slice(start, end);
      if (windowSlice.length === 0) return 0;
      return windowSlice.reduce((acc, val) => acc + (val || 0), 0) / windowSlice.length;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: title,
          data: metricData,
          borderColor: color,
          backgroundColor: `${color}33`, 
          pointRadius: 3,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          tension: 0.4, 
          fill: true, 
        },
        {
          label: `${title} (移動平均)`,
          data: movingAverage,
          borderColor: `${color}99`, 
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.4,
          fill: false,
        }
      ]
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            font: { size: 10 }, 
            boxWidth: 12,
            padding: 10,
          }
        },
        title: {
          display: true,
          text: `${title}の推移`,
          font: {
            size: 14, 
            weight: 'bold',
          },
          padding: { top: 5, bottom: 15 }
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (metric === 'hs_percentage' && context.datasetIndex === 0) { 
                    label += (context.parsed.y * 100).toFixed(1) + '%';
                } else if (metric === 'kd_ratio') {
                    label += context.parsed.y.toFixed(2);
                }
                 else {
                    label += context.parsed.y.toFixed(1);
                }
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          // 'win_rate' との比較を削除
          beginAtZero: metric === 'hs_percentage' ? false : (metric === 'kd_ratio' ? false : undefined),
          min: metric === 'kd_ratio' ? 0.5 : undefined, 
          title: {
            display: true,
            text: getYAxisLabel(metric),
            font: { size: 10 },
          },
          ticks: {
            font: { size: 9 },
            callback: function(value) {
                if (metric === 'hs_percentage') {
                    return (Number(value) * 100).toFixed(0) + '%';
                }
                return Number(value).toFixed(metric === 'kd_ratio' ? 2 : (metric === 'acs' ? 0 : 1) );
            }
          }
        },
        x: {
          title: {
            display: false, 
          },
          ticks: {
            font: { size: 9 },
            maxRotation: 45, 
            minRotation: 0,
          }
        }
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false
      },
      elements: {
        line: {
          borderWidth: 2, 
        }
      }
    });
  }, [performanceTrends, metric, title, color]);

  const getYAxisLabel = (metricKey: keyof Pick<PerformanceTrendPoint, 'acs' | 'kd_ratio' | 'hs_percentage'>): string => {
    switch (metricKey) {
      case 'acs': return 'ACS';
      case 'kd_ratio': return 'K/D比';
      case 'hs_percentage': return 'HS%';
      default: return '';
    }
  };

  if (!performanceTrends || performanceTrends.length === 0) {
    return <div className="flex items-center justify-center h-full text-sm text-gray-500">パフォーマンスデータがありません。</div>;
  }
  if (!chartData) {
    return <LoadingStates.Chart />;
  }

  return (
    <div className="w-full h-64 md:h-72"> 
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PerformanceChart;
