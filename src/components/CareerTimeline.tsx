import React, { useState, useEffect } from 'react';
import { PlayerGrowthStory } from '../api/apiService';

interface CareerTimelineProps {
  growthStory: PlayerGrowthStory;
}

const CareerTimeline: React.FC<CareerTimelineProps> = ({ growthStory }) => {
  const [phases, setPhases] = useState<any[]>([]);

  useEffect(() => {
    if (!growthStory?.career_phases || growthStory.career_phases.length === 0) return;

    setPhases(growthStory.career_phases);
  }, [growthStory]);

  if (phases.length === 0) {
    return <div className="flex items-center justify-center h-32">データ読み込み中...</div>;
  }

  return (
    <div className="w-full py-4">
      <h3 className="text-xl font-bold mb-4">キャリアフェーズ</h3>
      
      {/* タイムラインの線 */}
      <div className="relative">
        <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-300 transform -translate-x-1/2"></div>
        
        {/* フェーズアイテム */}
        {phases.map((phase, index) => (
          <div 
            key={index} 
            className={`relative flex flex-col md:flex-row items-start mb-8 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* 日付表示 */}
            <div className={`w-full md:w-1/2 px-4 mb-4 md:mb-0 ${
              index % 2 === 0 ? 'md:text-left' : 'md:text-right'
            }`}>
              <div className="text-sm text-gray-500">
                {formatDate(phase.start_date)} - {formatDate(phase.end_date)}
              </div>
            </div>
            
            {/* 中央のドット */}
            <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 mt-1.5"></div>
            
            {/* フェーズ内容 */}
            <div className={`w-full md:w-1/2 px-4 ${
              index % 2 === 0 ? 'md:text-right' : 'md:text-left'
            }`}>
              <h4 className="text-lg font-semibold text-blue-600">{phase.phase_name}</h4>
              <p className="mt-1 text-gray-700">{phase.description}</p>
              
              {/* 主要統計 */}
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(phase.key_stats).map(([key, value], i) => (
                  <div key={i} className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                    {formatStatKey(key)}: {formatStatValue(key, value)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 日付のフォーマット
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

// 統計キーのフォーマット
const formatStatKey = (key: string): string => {
  switch (key) {
    case 'average_acs':
      return 'ACS';
    case 'average_kd':
      return 'K/D';
    case 'win_rate':
      return '勝率';
    default:
      return key;
  }
};

// 統計値のフォーマット
const formatStatValue = (key: string, value: number): string => {
  if (key === 'win_rate') {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (key === 'average_kd') {
    return value.toFixed(2);
  }
  return value.toString();
};

export default CareerTimeline;
