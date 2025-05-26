import React from 'react';
import { CareerPhase } from '../api/apiService'; // 更新された型をインポート
import { Briefcase, TrendingUp, Users, BarChart, CalendarDays, ShieldCheck } from 'lucide-react'; // アイコン追加

interface CareerTimelineProps {
  careerPhases: CareerPhase[];
}

const CareerTimeline: React.FC<CareerTimelineProps> = ({ careerPhases }) => {
  if (!careerPhases || careerPhases.length === 0) {
    return <div className="flex items-center justify-center h-32 text-sm text-gray-500">キャリアフェーズデータがありません。</div>;
  }

  // 日付のフォーマット関数
  const formatDateRange = (startDateStr: string, endDateStr: string): string => {
    const formatDate = (dateStr: string) => {
      if (!dateStr || dateStr === 'N/A' || dateStr === '不明') return '不明';
      if (dateStr === '現在') return '現在';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '日付不明';
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
      } catch (e) {
        return dateStr; // パースできない場合は元の文字列
      }
    };
    return `${formatDate(startDateStr)} - ${formatDate(endDateStr)}`;
  };

  return (
    <div className="w-full py-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Briefcase className="w-5 h-5 mr-2 text-indigo-600"/>
        キャリアタイムライン
      </h3>
      
      <div className="relative pl-6 border-l-2 border-indigo-200 dark:border-indigo-700">
        {careerPhases.map((phase, index) => (
          <div 
            key={index} 
            className="mb-10 ml-4" // マージン調整
          >
            {/* タイムラインドット */}
            <div 
              className={`absolute w-4 h-4 bg-indigo-500 rounded-full -left-[9px] border-2 border-white dark:border-gray-900 dark:bg-indigo-400`}
            ></div>
            
            {/* 日付とチーム名 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                <time className="text-xs font-normal text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">
                    <CalendarDays className="inline w-3.5 h-3.5 mr-1 opacity-70"/>
                    {formatDateRange(phase.start_date, phase.end_date)}
                </time>
                {phase.team_name && (
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-2 py-0.5 rounded-full self-start sm:self-center">
                        {phase.team_name}
                    </span>
                )}
            </div>

            {/* フェーズ名 */}
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              {phase.phase_name}
            </h4>
            
            {/* 説明 */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
              {phase.description || 'この期間に関する詳細な説明はありません。'}
            </p>
            
            {/* 主要統計 (存在する場合) */}
            {phase.key_stats && Object.keys(phase.key_stats).length > 0 && (
              <div className="mt-2 text-xs space-y-1">
                <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">主な成績:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {phase.key_stats.matches_played !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <BarChart className="w-3.5 h-3.5 mr-1.5 opacity-70"/>
                            試合数: {phase.key_stats.matches_played}
                        </div>
                    )}
                    {phase.key_stats.win_rate && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 opacity-70"/>
                            勝率: {phase.key_stats.win_rate}
                        </div>
                    )}
                    {phase.key_stats.average_acs !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <TrendingUp className="w-3.5 h-3.5 mr-1.5 opacity-70"/>
                            平均ACS: {phase.key_stats.average_acs}
                        </div>
                    )}
                    {phase.key_stats.average_kd_ratio !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Users className="w-3.5 h-3.5 mr-1.5 opacity-70"/>
                            平均K/D: {phase.key_stats.average_kd_ratio}
                        </div>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerTimeline;
