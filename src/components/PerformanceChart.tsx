import React from 'react';
// import { Line } from 'react-chartjs-2'; // 一旦コメントアウト
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartOptions
// } from 'chart.js'; // 一旦コメントアウト
// import { PlayerGrowthStory } from '../api/apiService'; // PlayerGrowthStoryは現在このコンポーネントでは直接使わない

// Chart.jsの登録 (一旦コメントアウト)
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

interface PerformanceChartProps {
  // growthStory: PlayerGrowthStory; // 未使用のため削除
  // metric: 'acs' | 'kd_ratio' | 'win_rate' | 'headshot_percentage'; // 未使用のため削除
  title: string;
  // color: string; // 未使用のため削除
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title,
}) => {
  // 修正: performance_trends が存在しないため、チャート描画ロジックは一旦無効化
  // const [chartData, setChartData] = useState<any>(null);
  // const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});

  // useEffect(() => {
    // if (!growthStory?.performance_trends) { // このプロパティは現在ない
    //   setChartData(null);
    //   return;
    // }
    // ... (既存のチャートデータ生成ロジックは一旦コメントアウト) ...
  // }, [growthStory, metric, title, color]);

  // if (!growthStory?.performance_trends) { // このプロパティは現在ない
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex items-center justify-center h-48 md:h-64 text-gray-500">
        パフォーマンス推移データは現在利用できません。
      </div>
    </div>
  );
  // }

  // return (
  //   <div className="w-full h-64 md:h-80">
  //     <Line data={chartData} options={chartOptions} />
  //   </div>
  // );
};

export default PerformanceChart;
