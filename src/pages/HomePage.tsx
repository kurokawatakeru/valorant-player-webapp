import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Trophy,
  ArrowRight,
  Play,
  Heart,
  Eye,
  BarChart3,
  Zap,
  Target,
  Award,
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
        title: 'データで紡ぐVALORANTプロの成長物語',
        subtitle: '選手の軌跡をデータで可視化し、単なる統計ではなく「物語」として伝える',
        gradient: 'from-red-500 via-pink-500 to-purple-600',
      },
      {
        title: '感動的な成長ストーリーを発見',
        subtitle: '推し選手の知られざる過去や、成長の転機となった瞬間を体験',
        gradient: 'from-teal-500 via-cyan-500 to-blue-600',
      },
      {
        title: '比較分析で新たな発見を',
        subtitle: '異なる選手間の成長パターンを比較し、戦略的インサイトを獲得',
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
              <a
                href="#featured"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                注目の選手を見る
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
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

// Stats Overview Component - APIからデータ取得
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
        label: '日本人プレイヤー数',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      },
      {
        icon: Trophy,
        value: teamCount > 0 ? teamCount.toLocaleString() : '-',
        label: 'アクティブチーム',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      },
      {
        icon: BarChart3,
        value: '成長分析',
        label: 'データ可視化',
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
      },
      {
        icon: Award,
        value: 'リアルタイム',
        label: 'API連携',
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

  // 成績データを取得
  const stats = useMemo(() => {
    if (!growthStory || !growthStory.performance_trends.length) {
      return { acs: '-', kd: '-', matches: 0 };
    }

    const trends = growthStory.performance_trends;
    const recentTrends = trends.slice(-10); // 直近10試合

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
        {/* Player Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

          {/* Trending Badge */}
          {isTrending && (
            <div className="absolute top-3 right-3 z-20">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                注目
              </div>
            </div>
          )}

          {/* Country Flag */}
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
              {player.country}
            </div>
          </div>

          {/* Player Image or Placeholder */}
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

        {/* Player Info */}
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

          {/* Stats */}
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

          {/* View Story Button */}
          <div className="flex items-center justify-center py-2 text-gray-600 group-hover:text-red-500 transition-colors duration-200">
            <Eye className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">成長ストーリーを見る</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

FeaturedPlayerCard.displayName = 'FeaturedPlayerCard';

// Featured Players Component - APIからデータ取得
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
            <p className="text-gray-600">日本を代表するVALORANTプロプレイヤーたち</p>
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

        {/* Mobile View All Button */}
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
        icon: Heart,
        title: '感情的価値',
        description:
          'ファンにとって推し選手の成長が見える、共感できるストーリー体験を提供します。データの裏にある人間ドラマを発見しましょう。',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
      },
      {
        icon: Eye,
        title: '発見価値',
        description:
          '知らなかった選手の過去や、成長の転機となった試合を発見できます。隠された才能や努力の軌跡を明らかにします。',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      },
      {
        icon: BarChart3,
        title: '比較価値',
        description:
          '似たような軌跡の選手を発見し、異なる選手間の成長パターンを比較できます。戦略的インサイトを獲得しましょう。',
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
      },
      {
        icon: Target,
        title: '予測価値',
        description:
          '過去のデータから未来のパフォーマンスを予測し、選手の潜在能力や成長可能性を分析します。',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      },
    ],
    []
  );

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              VALORANTプレイヤー成長ストーリーサイトについて
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              当サイトは、VALORANTプロプレイヤーの成長過程をデータで可視化し、
              単なる統計ではなく「物語」として伝えることを目指しています。
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
              あなたの推し選手の
              <br />
              成長ストーリーを発見しよう
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              日本人プロプレイヤーのデータから、感動的な成長の軌跡を追体験。
              今すぐ始めて、新たな発見を楽しみましょう。
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/players"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                今すぐ始める
              </Link>
              <Link
                to="/teams"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                チームを見る
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

// 注目選手のIDリスト（vlr.ggで人気の日本人選手）
const FEATURED_PLAYER_IDS = [
  '24210', // Dep
  '8329', // Laz
  '36560', // crow
  '29547', // SugarZ3ro
];

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
        // 日本人プレイヤー数を取得
        const players = await getJapanesePlayers(100);
        setPlayerCount(players.length);

        // チーム数を取得
        const teamsResponse = await getTeams(100, 1);
        if (teamsResponse?.pagination) {
          setTeamCount(teamsResponse.pagination.totalElements);
        }

        // 注目選手のデータを取得
        const featuredPromises = FEATURED_PLAYER_IDS.map(async (id) => {
          const player = players.find((p) => p.id === id);
          if (!player) {
            // プレイヤーリストに無い場合はプレースホルダー
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
