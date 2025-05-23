import React from 'react';
import { PlayerGrowthStory } from '../api/apiService'; // PlayerGrowthStory をインポート

interface CareerTimelineProps {
  growthStory: PlayerGrowthStory; // 型を適用
}

const CareerTimeline: React.FC<CareerTimelineProps> = ({ growthStory }) => {
  // 修正: career_phases -> teamHistory を使用
  const teamHistory = growthStory.teamHistory;

  if (!teamHistory || teamHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">チーム履歴</h3>
        <p className="text-gray-500">チーム履歴情報はありません。</p>
      </div>
    );
  }

  // 日付のフォーマット関数 (必要に応じて調整)
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'N/A';
    // YYYY-MM-DD 形式を想定
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // 無効な日付の場合は元の文字列を返す
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    } catch (e) {
      return dateStr; // パースエラー時も元の文字列
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">チーム履歴</h3>
      <div className="relative pl-4">
        {/* タイムラインの縦線 */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 transform translate-x-[7px]"></div>

        {teamHistory.map((team, index) => (
          <div
            key={index}
            className="relative mb-6 pl-6" // 左のドットと線のためのパディング
          >
            {/* タイムラインのドット */}
            <div className="absolute left-0 top-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2"></div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">
                {formatDate(team.joinDate)} - {team.leaveDate ? formatDate(team.leaveDate) : (team.isActive ? '現在' : 'N/A')}
              </p>
              <h4 className="text-md sm:text-lg font-semibold text-red-600 mb-1">{team.teamName}</h4>
              {/* Liquipediaから取得できる他のチーム関連情報があればここに追加 */}
              {team.teamPageName && team.teamPageName !== team.teamName && (
                <p className="text-xs text-gray-400">(Page: {team.teamPageName})</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerTimeline;
