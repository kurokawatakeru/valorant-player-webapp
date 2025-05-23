import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  Heart,
  Trophy,
  Users,
  TrendingUp,
  BarChart3,
  Award,
  Calendar,
  Flag,
  Twitter,
  Twitch,
  Globe // 国籍表示用
} from 'lucide-react';
// 修正: getPlayerGrowthStoryFromLiquipedia をインポート
import { getPlayerGrowthStoryFromLiquipedia, PlayerGrowthStory } from '../api/apiService';
// サンプルデータのチャートコンポーネントは、Liquipediaから同等のデータが取得できるか不確かなため、
// 一旦コメントアウトするか、取得できるデータに合わせて修正が必要
// import PerformanceChart from '../components/PerformanceChart';
// import AgentStatsChart from '../components/AgentStatsChart';
// import MapStatsChart from '../components/MapStatsChart';
// import CareerTimeline from '../components/CareerTimeline';
import { PageLoading, Skeleton } from '../components/ui/LoadingSpinner'; // ローディングコンポーネントをインポート

// Loading Component (既存のものを流用または調整)
const PlayerDetailSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-64 mb-3" />
            <Skeleton className="h-4 w-48 mb-4" />
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);


// Tab Navigation Component (内容はLiquipediaから取得できるデータに合わせて調整)
interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  availableTabs: { id: string; label: string; icon: React.ElementType }[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab, availableTabs }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-2 mb-8 sticky top-20 z-40">
      <nav className="flex space-x-1 overflow-x-auto">
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base sm:px-6 sm:py-3 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// Player Header Component
interface PlayerHeaderProps {
  playerInfo: PlayerGrowthStory['info'];
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ playerInfo }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  // const [imageError, setImageError] = useState(false); // 画像エラー処理は一旦簡略化

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${playerInfo.name}のプレイヤー情報`,
          text: `${playerInfo.name}のLiquipedia情報をチェック！`,
          url: playerInfo.url,
        });
      } catch (err) {
        console.log('Share failed:', err);
        // 共有失敗時のフォールバック（例：URLコピー）
        navigator.clipboard.writeText(playerInfo.url).then(() => {
            alert('プレイヤーページのURLをクリップボードにコピーしました！');
        }).catch(clipErr => {
            console.error('Failed to copy URL: ', clipErr);
            alert('URLのコピーに失敗しました。');
        });
      }
    } else {
      navigator.clipboard.writeText(playerInfo.url).then(() => {
        alert('プレイヤーページのURLをクリップボードにコピーしました！');
      }).catch(clipErr => {
          console.error('Failed to copy URL: ', clipErr);
          alert('URLのコピーに失敗しました。');
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl overflow-hidden mb-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-detail-pattern opacity-50"></div> {/* detail-pattern を適用 */}
        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                {playerInfo.imageUrl ? (
                  <img
                    src={playerInfo.imageUrl}
                    alt={playerInfo.name}
                    className="w-full h-full object-cover"
                    // onError={() => setImageError(true)} // 画像エラー処理は一旦簡略化
                  />
                ) : (
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {playerInfo.name}
                </h1>
                {playerInfo.realName && playerInfo.realName !== playerInfo.name && (
                    <p className="text-sm text-gray-500 mb-2">({playerInfo.realName})</p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-sm sm:text-base">
                  {playerInfo.team && (
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1.5 text-yellow-500" />
                      <span className="font-medium">{playerInfo.team}</span>
                    </div>
                  )}
                  {playerInfo.country && (
                    <div className="flex items-center">
                      <Flag className="w-4 h-4 mr-1.5 text-blue-500" />
                      <span>{playerInfo.country}</span>
                    </div>
                  )}
                  {playerInfo.role && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1.5 text-green-500" />
                      <span>{playerInfo.role}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                {playerInfo.socialLinks.twitter && (
                  <a
                    href={`https://twitter.com/${playerInfo.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Twitter</span>
                  </a>
                )}
                {playerInfo.socialLinks.twitch && (
                  <a
                    href={`https://twitch.tv/${playerInfo.socialLinks.twitch}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <Twitch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Twitch</span>
                  </a>
                )}
                <a
                  href={playerInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Liquipedia</span>
                </a>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center space-x-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm ${
                    isFavorited
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? 'お気に入り' : 'お気に入り'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>シェア</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// チーム履歴表示コンポーネント
const TeamHistoryDisplay: React.FC<{ teamHistory?: PlayerGrowthStory['teamHistory'] }> = ({ teamHistory }) => {
    if (!teamHistory || teamHistory.length === 0) {
        return <p className="text-gray-500">チーム履歴情報はありません。</p>;
    }
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">チーム履歴</h3>
            <div className="space-y-4">
                {teamHistory.map((team, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-700">{team.teamName}</p>
                        <p className="text-sm text-gray-500">
                            {team.joinDate || 'N/A'} - {team.leaveDate || (team.isActive ? '現在' : 'N/A')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Main PlayerDetailPage Component
const PlayerDetailPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playerGrowthStory, setPlayerGrowthStory] = useState<PlayerGrowthStory | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview'); // 初期タブ

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!playerId) {
        setError('プレイヤーIDが指定されていません。');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const decodedPlayerId = decodeURIComponent(playerId); // URLデコード
        const growthStory = await getPlayerGrowthStoryFromLiquipedia(decodedPlayerId);
        setPlayerGrowthStory(growthStory);
        if (!growthStory) {
            setError('プレイヤーデータが見つかりませんでした。Liquipediaにページが存在しないか、情報の取得に失敗しました。');
        }
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('プレイヤーデータの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [playerId]);

  // Liquipediaから取得できる情報に基づいてタブを定義
  const availableTabs = [
    { id: 'overview', label: '概要', icon: Users },
    // { id: 'stats', label: '統計', icon: BarChart3 }, // 詳細な統計が取得できれば有効化
    // { id: 'matches', label: '試合履歴', icon: Trophy }, // 試合履歴が取得できれば有効化
  ];


  const renderTabContent = () => {
    if (!playerGrowthStory) return <p className="text-center text-gray-500">表示できる情報がありません。</p>;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 sm:space-y-8">
            <TeamHistoryDisplay teamHistory={playerGrowthStory.teamHistory} />
            {/* Liquipediaから取得できる他の概要情報をここに追加 */}
            {/*
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">エージェント統計 (仮)</h3>
              {playerGrowthStory.agentStats && playerGrowthStory.agentStats.length > 0 ? (
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">{JSON.stringify(playerGrowthStory.agentStats, null, 2)}</pre>
              ) : <p className="text-gray-500">エージェント統計情報はありません。</p>}
            </div>
            */}
          </div>
        );
      // 他のタブのコンテンツも同様に定義
      default:
        return <p className="text-center text-gray-500">コンテンツを選択してください。</p>;
    }
  };

  if (loading) {
    return <PlayerDetailSkeleton />;
  }

  if (error || !playerGrowthStory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">情報取得エラー</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              {error || 'プレイヤーデータが見つかりませんでした。'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/players"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                選手一覧へ
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
              >
                再読み込み
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/players"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-6 sm:mb-8 group text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          選手一覧に戻る
        </Link>
        <PlayerHeader playerInfo={playerGrowthStory.info} />
        {/* QuickStatsはLiquipediaから取得できる情報が限られるため、一旦コメントアウトか内容変更
        <QuickStats playerGrowthStory={playerGrowthStory} />
        */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} availableTabs={availableTabs} />
        <div className="mb-12">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;
