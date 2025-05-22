import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generatePlayerGrowthStory, PlayerGrowthStory } from '../api/apiService';
import PerformanceChart from '../components/PerformanceChart';
import AgentStatsChart from '../components/AgentStatsChart';
import MapStatsChart from '../components/MapStatsChart';
import CareerTimeline from '../components/CareerTimeline';

const PlayerDetailPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playerGrowthStory, setPlayerGrowthStory] = useState<PlayerGrowthStory | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!playerId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // 成長ストーリーデータを取得
        const growthStory = await generatePlayerGrowthStory(playerId);
        setPlayerGrowthStory(growthStory);
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('プレイヤーデータの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [playerId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !playerGrowthStory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error || 'プレイヤーデータが見つかりませんでした。'}</p>
          <Link to="/players" className="text-blue-500 hover:underline mt-2 inline-block">
            選手一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 戻るリンク */}
      <Link to="/players" className="text-blue-500 hover:underline mb-4 inline-block">
        &lt; 選手一覧に戻る
      </Link>
      
      {/* プレイヤーヘッダー */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mr-6 flex-shrink-0">
          {playerGrowthStory.info.image_url ? (
            <img 
              src={playerGrowthStory.info.image_url} 
              alt={playerGrowthStory.info.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
              No Image
            </div>
          )}
        </div>
        
        <div className="mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{playerGrowthStory.info.name}</h1>
          <div className="text-gray-600 mb-2">
            {playerGrowthStory.info.team && (
              <span className="mr-4">{playerGrowthStory.info.team}</span>
            )}
            {playerGrowthStory.info.country && (
              <span>{playerGrowthStory.info.country}</span>
            )}
          </div>
          
          <div className="flex space-x-3 mt-2">
            {playerGrowthStory.info.social_links.twitter && (
              <a 
                href={`https://twitter.com/${playerGrowthStory.info.social_links.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                Twitter
              </a>
            )}
            {playerGrowthStory.info.social_links.twitch && (
              <a 
                href={`https://twitch.tv/${playerGrowthStory.info.social_links.twitch}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-700"
              >
                Twitch
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <a href="#growth-story" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
            成長ストーリー
          </a>
          <a href="#detailed-stats" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            詳細統計
          </a>
          <a href="#compare" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            選手比較
          </a>
        </nav>
      </div>
      
      {/* 成長ストーリーセクション */}
      <section id="growth-story" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{playerGrowthStory.info.name}の成長ストーリー</h2>
        
        {/* キャリアタイムライン */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <CareerTimeline growthStory={playerGrowthStory} />
        </div>
        
        {/* パフォーマンスチャート */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <PerformanceChart 
              growthStory={playerGrowthStory} 
              metric="acs" 
              title="ACS" 
              color="#4C51BF" 
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <PerformanceChart 
              growthStory={playerGrowthStory} 
              metric="kd_ratio" 
              title="K/D比" 
              color="#38A169" 
            />
          </div>
        </div>
        
        {/* エージェント・マップ統計 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <AgentStatsChart growthStory={playerGrowthStory} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <MapStatsChart growthStory={playerGrowthStory} />
          </div>
        </div>
      </section>
      
      {/* 詳細統計セクション（プレースホルダー） */}
      <section id="detailed-stats" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">詳細統計</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">詳細統計は開発中です。今後のアップデートをお待ちください。</p>
        </div>
      </section>
      
      {/* 選手比較セクション（プレースホルダー） */}
      <section id="compare">
        <h2 className="text-2xl font-bold mb-6">選手比較</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">選手比較機能は開発中です。今後のアップデートをお待ちください。</p>
        </div>
      </section>
    </div>
  );
};

export default PlayerDetailPage;