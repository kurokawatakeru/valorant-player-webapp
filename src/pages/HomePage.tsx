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
  getAllPlayers,
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
        title: 'VALORANT',
        subtitle: 'PLAYER ANALYTICS',
        description: 'プロ選手のパフォーマンスをデータで可視化',
      },
      {
        title: 'STATS',
        subtitle: 'TRACKING',
        description: 'ACS、K/D、エージェント使用率などを一覧で確認',
      },
      {
        title: 'CAREER',
        subtitle: 'HISTORY',
        description: 'チーム移籍履歴とパフォーマンスの変化を分析',
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
    <section className="relative overflow-hidden bg-[#0D1117] border-b-4 border-[#FF0040]">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(#FF0040 1px, transparent 1px),
            linear-gradient(90deg, #FF0040 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pixel Title */}
          <div className="mb-8">
            <h1 className="font-pixel text-3xl sm:text-4xl md:text-5xl text-[#FF0040] mb-2 animate-pulse">
              {heroSlides[currentSlide].title}
            </h1>
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-[#00FFFF]">
              {heroSlides[currentSlide].subtitle}
            </h2>
          </div>

          <p className="font-pixel-jp text-base sm:text-lg mb-10 text-[#F0F6FC] leading-relaxed">
            {heroSlides[currentSlide].description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="/players"
              className="group inline-flex items-center justify-center px-6 py-4 bg-[#FF0040] text-white font-pixel-jp text-sm border-4 border-[#FFFF00] shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              SELECT PLAYER
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/teams"
              className="group inline-flex items-center justify-center px-6 py-4 bg-transparent text-[#00FFFF] font-pixel-jp text-sm border-4 border-[#00FFFF] shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:bg-[#00FFFF] hover:text-[#0D1117] transition-all duration-200"
            >
              <Trophy className="w-5 h-5 mr-2" />
              TEAM LIST
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Pixel Slide Indicators */}
          <div className="flex justify-center space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 border-2 transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#FF0040] border-[#FFFF00]'
                    : 'bg-transparent border-[#F0F6FC]/30 hover:border-[#00FFFF]'
                }`}
              />
            ))}
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
        label: 'PLAYERS',
        color: '#00FFFF',
        borderColor: '#00FFFF',
      },
      {
        icon: Trophy,
        value: teamCount > 0 ? teamCount.toLocaleString() : '-',
        label: 'TEAMS',
        color: '#FF00FF',
        borderColor: '#FF00FF',
      },
      {
        icon: BarChart3,
        value: 'ACS/KD',
        label: 'STATS',
        color: '#00FF00',
        borderColor: '#00FF00',
      },
      {
        icon: Activity,
        value: 'LIVE',
        label: 'VLR.gg',
        color: '#FF0040',
        borderColor: '#FF0040',
      },
    ],
    [playerCount, teamCount]
  );

  return (
    <section className="py-12 bg-[#161B22] border-y-4 border-[#00FFFF]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-4 border-4 bg-[#0D1117] shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
                style={{ borderColor: stat.borderColor }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3" style={{ color: stat.color }}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="font-pixel text-lg sm:text-xl mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="font-pixel text-xs text-[#F0F6FC]/60">{stat.label}</div>
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
    <Link to={`/players/${player.id}`} className="group block">
      <div className="bg-[#161B22] border-4 border-[#FF0040] shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 overflow-hidden">
        <div className="relative h-40 bg-[#0D1117] overflow-hidden border-b-4 border-[#FF0040]">
          {isTrending && (
            <div className="absolute top-2 right-2 z-20">
              <div className="bg-[#FFFF00] text-[#0D1117] px-2 py-1 font-pixel text-xs flex items-center border-2 border-[#000]">
                <TrendingUp className="w-3 h-3 mr-1" />
                HOT
              </div>
            </div>
          )}

          <div className="absolute top-2 left-2 z-20">
            <div className="bg-[#00FFFF] text-[#0D1117] px-2 py-1 font-pixel text-xs border-2 border-[#000]">
              {player.country}
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center">
            {growthStory?.info.image_url && !imageError ? (
              <img
                src={growthStory.info.image_url}
                alt={player.name}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <Users className="w-16 h-16 text-[#FF0040]/50" />
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-pixel text-xs sm:text-sm text-[#00FFFF] group-hover:text-[#FFFF00] transition-colors duration-200 truncate">
              {player.name}
            </h3>
            {player.teamTag && (
              <div className="font-pixel text-xs bg-[#FF0040] text-white px-2 py-0.5 border-2 border-[#000]">
                {player.teamTag}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center bg-[#0D1117] p-2 border-2 border-[#FF0040]">
              <div className="font-pixel text-xs text-[#F0F6FC]/60">ACS</div>
              <div className="font-pixel text-sm text-[#FF0040]">{stats.acs}</div>
            </div>
            <div className="text-center bg-[#0D1117] p-2 border-2 border-[#00FFFF]">
              <div className="font-pixel text-xs text-[#F0F6FC]/60">K/D</div>
              <div className="font-pixel text-sm text-[#00FFFF]">{stats.kd}</div>
            </div>
            <div className="text-center bg-[#0D1117] p-2 border-2 border-[#00FF00]">
              <div className="font-pixel text-xs text-[#F0F6FC]/60">試合</div>
              <div className="font-pixel text-sm text-[#00FF00]">{stats.matches}</div>
            </div>
          </div>

          <div className="flex items-center justify-center py-2 text-[#F0F6FC] group-hover:text-[#FFFF00] transition-colors duration-200 border-t-2 border-[#FF0040]/30">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="font-pixel-jp text-xs">VIEW STATS</span>
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
    <section className="py-16 bg-[#0D1117]" id="featured">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#FF0040] mb-2">FEATURED</h2>
            <p className="font-pixel-jp text-sm text-[#F0F6FC]/60">注目の選手</p>
          </div>
          <Link
            to="/players"
            className="hidden md:inline-flex items-center font-pixel text-xs text-[#00FFFF] hover:text-[#FFFF00] transition-colors duration-200"
          >
            VIEW ALL
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-[#161B22] border-4 border-[#FF0040]/30 shadow-[8px_8px_0_0_#000] animate-pulse"
              >
                <div className="h-40 bg-[#0D1117]"></div>
                <div className="p-4">
                  <div className="h-4 bg-[#0D1117] mb-3"></div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="h-12 bg-[#0D1117]"></div>
                    <div className="h-12 bg-[#0D1117]"></div>
                    <div className="h-12 bg-[#0D1117]"></div>
                  </div>
                  <div className="h-8 bg-[#0D1117]"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredData.map((data, index) => (
              <FeaturedPlayerCard key={data.player.id} data={data} index={index} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/players"
            className="inline-flex items-center px-6 py-3 bg-[#FF0040] text-white font-pixel-jp text-sm border-4 border-[#FFFF00] shadow-[4px_4px_0_0_#000]"
          >
            VIEW ALL PLAYERS
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
        title: 'PERFORMANCE',
        description: 'ACS、K/D、HS%などの統計値を時系列でグラフ化',
        color: '#FF0040',
      },
      {
        icon: PieChart,
        title: 'AGENT STATS',
        description: '使用エージェントの分布と各エージェントでの成績',
        color: '#00FFFF',
      },
      {
        icon: BarChart3,
        title: 'MAP ANALYSIS',
        description: 'マップごとの勝率や成績を表示',
        color: '#00FF00',
      },
      {
        icon: Target,
        title: 'CAREER',
        description: 'チーム移籍履歴と各チームでの成績を時系列表示',
        color: '#FF00FF',
      },
    ],
    []
  );

  return (
    <section className="py-16 bg-[#161B22] border-y-4 border-[#FF0040]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-xl sm:text-2xl text-[#FFFF00] mb-2">FEATURES</h2>
            <p className="font-pixel-jp text-sm text-[#F0F6FC]/60">
              VLR.ggのデータをもとに多角的な分析
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-[#0D1117] border-4 p-6 shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
                  style={{ borderColor: feature.color }}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center border-2 border-current"
                      style={{ color: feature.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-pixel text-sm mb-2" style={{ color: feature.color }}>
                        {feature.title}
                      </h3>
                      <p className="font-pixel-jp text-xs text-[#F0F6FC]/80 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
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
    <section className="py-16 bg-[#0D1117]">
      <div className="container mx-auto px-4">
        <div className="bg-[#161B22] border-4 border-[#FF0040] shadow-[12px_12px_0_0_#000] overflow-hidden relative p-8 sm:p-12">
          {/* Pixel Grid Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(#FF0040 1px, transparent 1px),
                linear-gradient(90deg, #FF0040 1px, transparent 1px)
              `,
              backgroundSize: '10px 10px'
            }}></div>
          </div>

          <div className="relative z-10 text-center">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-[#FF0040] mb-2">
              START
            </h2>
            <h3 className="font-pixel text-lg sm:text-xl text-[#00FFFF] mb-6">
              ANALYZING
            </h3>
            <p className="font-pixel-jp text-sm text-[#F0F6FC]/80 mb-8 max-w-xl mx-auto leading-relaxed">
              プロプレイヤーの詳細な統計情報をチェック。
              パフォーマンスの推移やエージェント使用率を確認できます。
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/players"
                className="inline-flex items-center justify-center px-6 py-4 bg-[#FF0040] text-white font-pixel-jp text-sm border-4 border-[#FFFF00] shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
              >
                <Zap className="w-5 h-5 mr-2" />
                SELECT PLAYER
              </Link>
              <Link
                to="/compare"
                className="inline-flex items-center justify-center px-6 py-4 bg-transparent text-[#00FFFF] font-pixel-jp text-sm border-4 border-[#00FFFF] shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#00FFFF] hover:text-[#0D1117] transition-all duration-200"
              >
                COMPARE
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
        const players = await getAllPlayers(100);
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
