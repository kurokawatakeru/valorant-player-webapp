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
  AlertTriangle, // エラー表示用
} from 'lucide-react';
import { generatePlayerGrowthStory, PlayerGrowthStory, PlayerOverallAgentStat, PlayerOverallMapStat, CareerPhase, PerformanceTrendPoint, ProcessedMatch } from '../api/apiService'; // 更新された型をインポート
import PerformanceChart from '../components/PerformanceChart';
import AgentStatsChart from '../components/AgentStatsChart';
import MapStatsChart from '../components/MapStatsChart';
import CareerTimeline from '../components/CareerTimeline';
import { LoadingStates } from '../components/ui/LoadingSpinner'; // ローディングコンポーネントをインポート

// Loading Component (既存のものを流用、またはLoadingStates.Pageを使用)
const PlayerDetailSkeleton: React.FC = () => (
  // LoadingStates.Page を使用するか、既存のスケルトンを維持
  <LoadingStates.Page title="プレイヤーデータを読み込み中..." description="詳細情報を取得しています。少々お待ちください。" />
);

// Tab Navigation Component (変更なし)
interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'growth-story', label: '成長ストーリー', icon: TrendingUp },
    { id: 'detailed-stats', label: '詳細統計', icon: BarChart3 },
    { id: 'match-history', label: '試合履歴', icon: Trophy },
    // { id: 'compare', label: '選手比較', icon: Users }, // 比較機能は将来的に
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-2 mb-8 sticky top-4 z-40 md:top-20"> {/* モバイルでのsticky位置調整 */}
      <nav className="flex space-x-1 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 sm:px-6 rounded-xl font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// Player Header Component (変更なし)
interface PlayerHeaderProps {
  playerInfo: PlayerGrowthStory['info']; // info部分だけを型として使用
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ playerInfo }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${playerInfo.name}の成長ストーリー`,
          text: `${playerInfo.name}のVALORANT成長ストーリーをチェック！`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
        // ユーザーにフィードバック（例: トースト通知）
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          // ユーザーにフィードバック（例: トースト通知「URLをコピーしました！」）
          alert('URLをクリップボードにコピーしました！'); // alertは避けるべきだが、一時的な代替
        })
        .catch(err => {
          console.error('Failed to copy URL: ', err);
          // ユーザーにフィードバック
        });
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl overflow-hidden mb-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-detail-pattern opacity-50"></div> {/* Tailwind configの 'detail-pattern' を参照 */}
        
        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="relative self-center md:self-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {playerInfo.image_url && !imageError ? (
                  <img 
                    src={playerInfo.image_url} 
                    alt={playerInfo.name} 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                  </div>
                )}
              </div>
              {/* Online Status (ダミー、必要なら実際のステータス連携) */}
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center shadow-md">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="mb-3 sm:mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {playerInfo.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-sm sm:text-base">
                  {playerInfo.team && playerInfo.team !== 'N/A' && (
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
                  {/* プロデビュー年はキャリアフェーズから取得するか、別途データが必要 */}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                {playerInfo.social_links.twitter && (
                  <a 
                    href={playerInfo.social_links.twitter.startsWith('http') ? playerInfo.social_links.twitter : `https://twitter.com/${playerInfo.social_links.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200 text-xs sm:text-sm shadow hover:shadow-md"
                  >
                    <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Twitter</span>
                  </a>
                )}
                {playerInfo.social_links.twitch && (
                  <a 
                    href={playerInfo.social_links.twitch.startsWith('http') ? playerInfo.social_links.twitch : `https://twitch.tv/${playerInfo.social_links.twitch}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-xs sm:text-sm shadow hover:shadow-md"
                  >
                    <Twitch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Twitch</span>
                  </a>
                )}
                {playerInfo.url && (
                  <a 
                    href={playerInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm shadow hover:shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>VLR.gg</span>
                  </a>
                )}
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base shadow hover:shadow-md ${
                    isFavorited
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? 'お気に入り' : 'お気に入り'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base shadow hover:shadow-md"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
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

// Quick Stats Component (修正: APIからのデータで動的に)
interface QuickStatsProps {
  careerPhases: CareerPhase[];
  agentStats: PlayerOverallAgentStat[] | AgentStatSummary[]; // AgentStatSummary を使用するように変更
  matchCount: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({ careerPhases, agentStats, matchCount }) => {
  const totalCareerYears = () => {
    if (!careerPhases || careerPhases.length === 0) return 'N/A';
    const firstPhase = careerPhases[0];
    const lastPhase = careerPhases[careerPhases.length - 1];
    if (!firstPhase?.start_date) return 'N/A';

    const startDate = new Date(firstPhase.start_date);
    const endDate = lastPhase?.end_date === '現在' ? new Date() : new Date(lastPhase?.end_date || new Date());
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'N/A';

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return years > 0 ? `${years}年${months > 0 ? `${months}ヶ月` : ''}` : `${months}ヶ月`;
  };

  const uniqueAgentCount = agentStats?.length || 0;
  
  // 獲得タイトル数はAPIから直接取得できないため、ダミーまたは別途データが必要
  const titlesWon = careerPhases?.reduce((acc, phase) => acc + (phase.key_stats.titles_won || 0), 0) || 0; // 仮のキー

  const stats = [
    { label: '総試合数', value: matchCount, icon: Trophy, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'キャリア期間', value: totalCareerYears(), icon: Calendar, color: 'text-teal-500', bgColor: 'bg-teal-50' },
    { label: '使用エージェント数', value: uniqueAgentCount, icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { label: '獲得タイトル', value: titlesWon > 0 ? titlesWon : 'N/A', icon: Award, color: 'text-yellow-500', bgColor: 'bg-yellow-50' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} ${stat.color} rounded-xl mb-2 sm:mb-3`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">{stat.value}</div>
            <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
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
      if (!playerId) {
        setError('プレイヤーIDが指定されていません。');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const growthStoryData = await generatePlayerGrowthStory(playerId);
        if (growthStoryData) {
          setPlayerGrowthStory(growthStoryData);
        } else {
          setError('プレイヤーデータの生成に失敗しました。情報が見つからない可能性があります。');
        }
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('プレイヤーデータの取得中にエラーが発生しました。しばらくしてから再試行してください。');
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
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">データ表示エラー</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              {error || 'プレイヤーデータが見つかりませんでした。'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                to="/players" 
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                選手一覧へ
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
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
    if (!playerGrowthStory) return null;

    switch (activeTab) {
      case 'growth-story':
        return (
          <div className="space-y-6 sm:space-y-8">
            {playerGrowthStory.career_phases && playerGrowthStory.career_phases.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <CareerTimeline careerPhases={playerGrowthStory.career_phases} />
              </div>
            )}
            
            {playerGrowthStory.performance_trends && playerGrowthStory.performance_trends.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  <PerformanceChart 
                    performanceTrends={playerGrowthStory.performance_trends} 
                    metric="acs" 
                    title="ACS (平均コンバットスコア)" 
                    color="#EF4444" // red-500
                  />
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  <PerformanceChart 
                    performanceTrends={playerGrowthStory.performance_trends} 
                    metric="kd_ratio" 
                    title="K/D比" 
                    color="#10B981" // emerald-500
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {playerGrowthStory.agent_stats && playerGrowthStory.agent_stats.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  <AgentStatsChart agentStats={playerGrowthStory.agent_stats} />
                </div>
              )}
              {playerGrowthStory.map_stats && playerGrowthStory.map_stats.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  <MapStatsChart mapStats={playerGrowthStory.map_stats} />
                </div>
              )}
            </div>
          </div>
        );
      
      case 'detailed-stats': // 詳細統計タブ (開発中)
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <div className="mb-6">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">詳細統計</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                この機能は現在開発中です。今後のアップデートにご期待ください。
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-left text-xs sm:text-sm text-gray-500">
              <p className="font-medium mb-2 text-gray-700">実装予定の分析項目：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>月別・大会別パフォーマンス変動</li>
                <li>エージェントごとの詳細な役割遂行度</li>
                <li>マップごとの攻守別成績・特定エリアでのアクション分析</li>
                <li>武器使用傾向と経済管理分析</li>
                <li>クラッチ成功率・重要な局面でのパフォーマンス</li>
              </ul>
            </div>
          </div>
        );
      
      case 'match-history': // 試合履歴タブ
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">試合履歴</h3>
            {playerGrowthStory.processed_matches && playerGrowthStory.processed_matches.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {playerGrowthStory.processed_matches.slice().reverse().map(match => ( // 新しい順に表示
                  <div key={match.match_id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                        {match.event_logo && <img src={match.event_logo} alt={match.event} className="w-5 h-5 object-contain"/>}
                        <span className="font-semibold text-gray-700 text-sm">{match.event}</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(match.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center space-x-2">
                            <span className={`font-bold text-lg ${match.result === 'W' ? 'text-green-500' : match.result === 'L' ? 'text-red-500' : 'text-gray-500'}`}>
                                {match.result}
                            </span>
                            <span className="text-gray-800">{match.score}</span>
                            <span className="text-gray-600">vs</span>
                            {match.opponent_logo && <img src={match.opponent_logo} alt={match.opponent_tag} className="w-5 h-5 object-contain"/>}
                            <span className="text-gray-800">{match.opponent_tag || match.opponent}</span>
                        </div>
                        <a 
                            href={match.match_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-blue-500 hover:underline mt-2 sm:mt-0"
                        >
                            試合詳細 (VLR.gg) <ExternalLink className="inline w-3 h-3"/>
                        </a>
                    </div>
                    {match.player_match_stats && (
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs grid grid-cols-2 sm:grid-cols-4 gap-1 text-gray-600">
                            <span>ACS: {match.player_match_stats.acs ?? 'N/A'}</span>
                            <span>K/D: {match.player_match_stats.kd_ratio?.toFixed(2) ?? 'N/A'}</span>
                            <span>ADR: {match.player_match_stats.adr ?? 'N/A'}</span>
                            <span>HS%: {match.player_match_stats.hs_percentage ? `${(match.player_match_stats.hs_percentage * 100).toFixed(0)}%` : 'N/A'}</span>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">試合履歴データがありません。</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Link 
          to="/players" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-6 sm:mb-8 group text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          選手一覧に戻る
        </Link>
        
        <PlayerHeader playerInfo={playerGrowthStory.info} />
        
        <QuickStats 
            careerPhases={playerGrowthStory.career_phases || []} 
            agentStats={playerGrowthStory.agent_stats || []}
            matchCount={playerGrowthStory.processed_matches?.length || 0}
        />
        
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mb-12">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;
