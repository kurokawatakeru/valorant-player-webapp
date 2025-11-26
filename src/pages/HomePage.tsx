import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Trophy,
  ArrowRight,
  BarChart3,
  Zap,
  Target,
  Activity,
  PieChart,
  LineChart,
} from 'lucide-react';
import {
  getJapanesePlayers,
  getTeams,
  generatePlayerGrowthStory,
  Player,
  PlayerGrowthStory,
} from '../api/apiService';

// Hero Section Component
const HeroSection: React.FC = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = useMemo(
    () => [
      {
        title: 'VALORANT選手データ分析',
        subtitle: '日本人プロ選手のパフォーマンスをデータで可視化',
        gradient: 'from-red-500 via-pink-500 to-purple-600',
      },
      {
        title: '詳細な統計情報',
        subtitle: 'ACS、K/D、エージェント使用率などを一覧で確認',
        gradient: 'from-teal-500 via-cyan-500 to-blue-600',
      },
      {
        title: 'キャリア推移を追跡',
        subtitle: 'チーム移籍履歴とパフォーマンスの変化を分析',
        gradient: 'from-purple-500 via-indigo-500 to-blue-600',
      },
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className="relative overflow-hidden">
      <div
        className={`bg-gradient-to-br ${heroSlides[currentSlide].gradient} text-white transition-all duration-1000`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-hero-pattern-1"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to="/players"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Users className="w-5 h-5 mr-2" />
                選手を探す
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/teams"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <Trophy className="w-5 h-5 mr-2" />
                チーム一覧
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// Stats Overview Component
interface StatsOverviewProps {
  playerCount: number;
  teamCount: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = memo(({ playerCount, teamCount }) => {
  const stats = useMemo(
    () => [
      {
        icon: Users,
        value: playerCount > 0 ? playerCount.toLocaleString() : '-',
        label: '日本人プレイヤー',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      },
      {
        icon: Trophy,
        value: teamCount > 0 ? teamCount.toLocaleString() : '-',
        label: 'チーム数',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      },
      {
        icon: BarChart3,
        value: 'ACS / K/D',
        label: '統計分析',
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
      },
      {
        icon: Activity,
        value: 'リアルタイム',
        label: 'VLR.gg連携',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
      },
    ],
    [playerCount, teamCount]
  );

  return (
    <section className="py-16 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-200"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} ${stat.color} rounded-2xl mb-4 group-hover:shadow-lg transition-shadow duration-200`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

StatsOverview.displayName = 'StatsOverview';

// Featured Player Card Component
interface FeaturedPlayerData {
  player: Player;
  growthStory: PlayerGrowthStory | null;
}

interface FeaturedPlayerCardProps {
  data: FeaturedPlayerData;
  index: number;
}

const FeaturedPlayerCard: React.FC<FeaturedPlayerCardProps> = memo(({ data, index }) => {
  const { player, growthStory } = data;
  const [imageError, setImageError] = useState(false);

  const stats = useMemo(() => {
    if (!growthStory || !growthStory.performance_trends.length) {
      return { acs: '-', kd: '-', matches: 0 };
    }

    const trends = growthStory.performance_trends;
    const recentTrends = trends.slice(-10);

    const avgAcs =
      recentTrends.reduce((sum, t) => sum + (t.acs || 0), 0) / recentTrends.length || 0;
    const avgKd =
      recentTrends.reduce((sum, t) => sum + (t.kd_ratio || 0), 0) / recentTrends.length || 0;

    return {
      acs: avgAcs > 0 ? avgAcs.toFixed(0) : '-',
      kd: avgKd > 0 ? avgKd.toFixed(2) : '-',
      matches: growthStory.processed_matches.length,
    };
  }, [growthStory]);

  const isTrending = index < 2;

  return (
    <Link to={`/players/${player.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

          {isTrending && (
            <div className="absolute top-3 right-3 z-20">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                注目
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 z-20">
            <div className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
              {player.country}
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center">
            {growthStory?.info.image_url && !imageError ? (
              <img
                src={growthStory.info.image_url}
                alt={player.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <Users className="w-16 h-16 text-gray-400" />
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-500 transition-colors duration-200">
              {player.name}
            </h3>
            {player.teamTag && (
              <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                {player.teamTag}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">ACS</div>
              <div className="font-bold text-red-500">{stats.acs}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">K/D</div>
              <div className="font-bold text-teal-500">{stats.kd}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">試合数</div>
              <div className="font-bold text-blue-500">{stats.matches}</div>
            </div>
          </div>

          <div className="flex items-center justify-center py-2 text-gray-600 group-hover:text-red-500 transition-colors duration-200">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">詳細を見る</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

FeaturedPlayerCard.displayName = 'FeaturedPlayerCard';

// Featured Players Component
interface FeaturedPlayersProps {
  featuredData: FeaturedPlayerData[];
  loading: boolean;
}

const FeaturedPlayers: React.FC<FeaturedPlayersProps> = memo(({ featuredData, loading }) => {
  return (
    <section className="py-20" id="featured">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">注目の選手</h2>
            <p className="text-gray-600">日本を代表するVALORANTプロプレイヤー</p>
          </div>
          <Link
            to="/players"
            className="hidden md:inline-flex items-center text-red-500 hover:text-red-600 font-medium group"
          >
            すべて見る
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredData.map((data, index) => (
              <FeaturedPlayerCard key={data.player.id} data={data} index={index} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/players"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
          >
            すべての選手を見る
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
});

FeaturedPlayers.displayName = 'FeaturedPlayers';

// Features Section
const FeaturesSection: React.FC = memo(() => {
  const features = useMemo(
    () => [
      {
        icon: LineChart,
        title: 'パフォーマンス推移',
        description:
          'ACS、K/D、HS%などの統計値を時系列でグラフ化。選手のコンディション変化を把握できます。',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
      },
      {
        icon: PieChart,
        title: 'エージェント分析',
        description:
          '使用エージェントの分布と各エージェントでの成績を可視化。得意キャラクターが一目でわかります。',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      },
      {
        icon: BarChart3,
        title: 'マップ別統計',
        description:
          'マップごとの勝率や成績を表示。選手の得意マップ・苦手マップを分析できます。',
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
      },
      {
        icon: Target,
        title: 'キャリア履歴',
        description:
          'チーム移籍履歴と各チームでの成績を時系列で表示。キャリアの軌跡を追跡できます。',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      },
    ],
    []
  );

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">分析機能</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              VLR.ggのデータをもとに、選手のパフォーマンスを多角的に分析
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

// CTA Section
const CTASection: React.FC = memo(() => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-hero-pattern-2"></div>

          <div className="relative z-10 text-center py-16 px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              選手データを分析しよう
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              日本人プロプレイヤーの詳細な統計情報をチェック。
              パフォーマンスの推移やエージェント使用率を確認できます。
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/players"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                選手を探す
              </Link>
              <Link
                to="/teams"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                チーム一覧
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';

// 注目選手のIDリスト
const FEATURED_PLAYER_IDS = ['24210', '8329', '36560', '29547'];

// Main HomePage Component
const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [playerCount, setPlayerCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [featuredData, setFeaturedData] = useState<FeaturedPlayerData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const players = await getJapanesePlayers(100);
        setPlayerCount(players.length);

        const teamsResponse = await getTeams(100, 1);
        if (teamsResponse?.pagination) {
          setTeamCount(teamsResponse.pagination.totalElements);
        }

        const featuredPromises = FEATURED_PLAYER_IDS.map(async (id) => {
          const player = players.find((p) => p.id === id);
          if (!player) {
            return {
              player: { id, name: 'Unknown', teamTag: '', country: 'JP', url: '' },
              growthStory: null,
            };
          }

          try {
            const growthStory = await generatePlayerGrowthStory(id);
            return { player, growthStory };
          } catch {
            return { player, growthStory: null };
          }
        });

        const featured = await Promise.all(featuredPromises);
        setFeaturedData(featured.filter((f) => f.player.name !== 'Unknown'));
      } catch (error) {
        console.error('Failed to fetch home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HeroSection />
      <StatsOverview playerCount={playerCount} teamCount={teamCount} />
      <FeaturedPlayers featuredData={featuredData} loading={loading} />
      <FeaturesSection />
      <CTASection />
    </>
  );
};

export default HomePage;
