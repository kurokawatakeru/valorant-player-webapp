import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  Heart, 
  Star,
  Trophy,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Calendar,
  Flag,
  Twitter,
  Twitch
} from 'lucide-react';
import { generatePlayerGrowthStory, PlayerGrowthStory } from '../api/apiService';
import PerformanceChart from '../components/PerformanceChart';
import AgentStatsChart from '../components/AgentStatsChart';
import MapStatsChart from '../components/MapStatsChart';
import CareerTimeline from '../components/CareerTimeline';

// Loading Component
const PlayerDetailSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-64 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Tab Navigation Component
interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'growth-story', label: '成長ストーリー', icon: TrendingUp },
    { id: 'detailed-stats', label: '詳細統計', icon: BarChart3 },
    { id: 'match-history', label: '試合履歴', icon: Trophy },
    { id: 'compare', label: '選手比較', icon: Users },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-2 mb-8 sticky top-20 z-40">
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
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
  playerGrowthStory: PlayerGrowthStory;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ playerGrowthStory }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${playerGrowthStory.info.name}の成長ストーリー`,
          text: `${playerGrowthStory.info.name}のVALORANT成長ストーリーをチェック！`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('URLをクリップボードにコピーしました！');
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl overflow-hidden mb-8">
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5"></div>
        {/* 修正点: インラインSVG URLをTailwindクラス名に置き換え */}
        <div className="absolute inset-0 bg-detail-pattern"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {playerGrowthStory.info.image_url && !imageError ? (
                  <img 
                    src={playerGrowthStory.info.image_url} 
                    alt={playerGrowthStory.info.name} 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Online Status */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Player Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {playerGrowthStory.info.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  {playerGrowthStory.info.team && (
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span className="font-medium">{playerGrowthStory.info.team}</span>
                    </div>
                  )}
                  {playerGrowthStory.info.country && (
                    <div className="flex items-center">
                      <Flag className="w-4 h-4 mr-2" />
                      <span>{playerGrowthStory.info.country}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>プロデビュー: 2020年</span>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4 mb-6">
                {playerGrowthStory.info.social_links.twitter && (
                  <a 
                    href={`https://twitter.com/${playerGrowthStory.info.social_links.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                )}
                {playerGrowthStory.info.social_links.twitch && (
                  <a 
                    href={`https://twitch.tv/${playerGrowthStory.info.social_links.twitch}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
                  >
                    <Twitch className="w-4 h-4" />
                    <span>Twitch</span>
                  </a>
                )}
                {playerGrowthStory.info.url && (
                  <a 
                    href={playerGrowthStory.info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>VLR.gg</span>
                  </a>
                )}
              </div>
              
              {/* Action Buttons */}
              {/* 修正点: ClassName を className に修正 */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isFavorited
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? 'お気に入り済み' : 'お気に入り'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
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

// Quick Stats Component
interface QuickStatsProps {
  playerGrowthStory: PlayerGrowthStory;
}

const QuickStats: React.FC<QuickStatsProps> = ({ playerGrowthStory }) => {
  const stats = [
    {
      label: '総試合数',
      value: playerGrowthStory.matches?.length || 0,
      icon: Trophy,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'キャリア期間',
      value: '5年', // サンプルデータ
      icon: Calendar,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50'
    },
    {
      label: '使用エージェント',
      value: playerGrowthStory.agent_stats?.length || 0,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      label: '獲得タイトル',
      value: '12', // サンプルデータ
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} ${stat.color} rounded-xl mb-3`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// Main PlayerDetailPage Component
const PlayerDetailPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playerGrowthStory, setPlayerGrowthStory] = useState<PlayerGrowthStory | null>(null);
  const [activeTab, setActiveTab] = useState<string>('growth-story');

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
    return <PlayerDetailSkeleton />;
  }

  if (error || !playerGrowthStory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">データが見つかりません</h2>
            <p className="text-gray-600 mb-6">
              {error || 'プレイヤーデータが見つかりませんでした。'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/players" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                選手一覧に戻る
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                再読み込み
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'growth-story':
        return (
          <div className="space-y-8">
            {/* Career Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <CareerTimeline growthStory={playerGrowthStory} />
            </div>
            
            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <PerformanceChart 
                  growthStory={playerGrowthStory} 
                  metric="acs" 
                  title="ACS" 
                  color="#4C51BF" 
                />
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <PerformanceChart 
                  growthStory={playerGrowthStory} 
                  metric="kd_ratio" 
                  title="K/D比" 
                  color="#38A169" 
                />
              </div>
            </div>
            
            {/* Agent and Map Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <AgentStatsChart growthStory={playerGrowthStory} />
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <MapStatsChart growthStory={playerGrowthStory} />
              </div>
            </div>
          </div>
        );
      
      case 'detailed-stats':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">詳細統計</h3>
              <p className="text-gray-600">
                詳細統計機能は開発中です。今後のアップデートをお待ちください。
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-sm text-gray-500">
                実装予定の機能：
                <br />• 月別パフォーマンス分析
                <br />• エージェント別詳細統計  
                <br />• 対戦相手別成績
                <br />• ラウンド別分析
              </p>
            </div>
          </div>
        );
      
      case 'match-history':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">試合履歴</h3>
              <p className="text-gray-600">
                試合履歴機能は開発中です。今後のアップデートをお待ちください。
              </p>
            </div>
          </div>
        );
      
      case 'compare':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">選手比較</h3>
              <p className="text-gray-600">
                選手比較機能は開発中です。今後のアップデートをお待ちください。
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/players" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          選手一覧に戻る
        </Link>
        
        {/* Player Header */}
        <PlayerHeader playerGrowthStory={playerGrowthStory} />
        
        {/* Quick Stats */}
        <QuickStats playerGrowthStory={playerGrowthStory} />
        
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Tab Content */}
        <div className="mb-12">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;
