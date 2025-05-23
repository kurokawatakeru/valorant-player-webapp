import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Trophy,
  Star,
  ArrowRight,
  Play,
  Heart,
  Eye,
  BarChart3,
  Zap,
  Target,
  Award
} from 'lucide-react';

// Hero Section Component
const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "データで紡ぐVALORANTプロの成長物語",
      subtitle: "選手の軌跡をデータで可視化し、単なる統計ではなく「物語」として伝える",
      gradient: "from-red-500 via-pink-500 to-purple-600"
    },
    {
      title: "感動的な成長ストーリーを発見",
      subtitle: "推し選手の知られざる過去や、成長の転機となった瞬間を体験",
      gradient: "from-teal-500 via-cyan-500 to-blue-600"
    },
    {
      title: "比較分析で新たな発見を",
      subtitle: "異なる選手間の成長パターンを比較し、戦略的インサイトを獲得",
      gradient: "from-purple-500 via-indigo-500 to-blue-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className={`bg-gradient-to-br ${heroSlides[currentSlide].gradient} text-white transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <svg
            className="w-full h-full"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fillRule="evenodd">
              <g fill="#ffffff" fillOpacity="0.05">
                <circle cx="30" cy="30" r="2" />
              </g>
            </g>
          </svg>
        </div>

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
                特集ストーリーを見る
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
};

// Stats Overview Component
const StatsOverview: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: "1,247",
      label: "登録プレイヤー数",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Trophy,
      value: "156",
      label: "アクティブチーム",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: BarChart3,
      value: "12.5k",
      label: "分析済み試合数",
      color: "text-teal-500",
      bgColor: "bg-teal-50"
    },
    {
      icon: Award,
      value: "89",
      label: "カバー大会数",
      color: "text-red-500",
      bgColor: "bg-red-50"
    }
  ];

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
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} ${stat.color} rounded-2xl mb-4 group-hover:shadow-lg transition-shadow duration-200`}>
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
};

// Featured Players Component
const FeaturedPlayers: React.FC = () => {
  const featuredPlayers = [
    {
      id: '24210',
      name: 'Dep',
      team: 'ZETA DIVISION',
      country: 'JP',
      image: '/api/placeholder/300/400',
      stats: { acs: 245, kd: 1.32, winRate: 67 },
      achievement: 'Masters優勝',
      trending: true
    },
    {
      id: '8329',
      name: 'Laz',
      team: 'ZETA DIVISION',
      country: 'JP',
      image: '/api/placeholder/300/400',
      stats: { acs: 228, kd: 1.28, winRate: 65 },
      achievement: 'IGL of the Year',
      trending: false
    },
    {
      id: '36560',
      name: 'crow',
      team: 'DetonationFocusMe',
      country: 'JP',
      image: '/api/placeholder/300/400',
      stats: { acs: 232, kd: 1.25, winRate: 63 },
      achievement: 'Rising Star',
      trending: true
    },
    {
      id: '29547',
      name: 'SugarZ3ro',
      team: 'ZETA DIVISION',
      country: 'JP',
      image: '/api/placeholder/300/400',
      stats: { acs: 198, kd: 1.15, winRate: 69 },
      achievement: 'Support MVP',
      trending: false
    }
  ];

  return (
    <section className="py-20">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPlayers.map((player) => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Player Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

                  {/* Trending Badge */}
                  {player.trending && (
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

                  {/* Placeholder for player image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                {/* Player Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-500 transition-colors duration-200">
                      {player.name}
                    </h3>
                    <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                      {player.team}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {player.achievement}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">ACS</div>
                      <div className="font-bold text-red-500">{player.stats.acs}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">K/D</div>
                      <div className="font-bold text-teal-500">{player.stats.kd}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">勝率</div>
                      <div className="font-bold text-blue-500">{player.stats.winRate}%</div>
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
          ))}
        </div>

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
};

// Growth Stories Section
const GrowthStoriesSection: React.FC = () => {
  const stories = [
    {
      id: 1,
      title: "Depの7年間の軌跡 - CS:GOからVALORANTへ",
      description: "日本VALORANTシーンを代表するプレイヤーの一人、Depの成長ストーリー。CS:GO時代の下積み期から、VALORANTでの国際的な活躍まで、データで見るキャリアの変遷。",
      readTime: "8分",
      views: "12.5k",
      likes: "1.2k",
      category: "Player Story",
      thumbnail: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "ZETA DIVISIONの奇跡 - Masters優勝への道のり",
      description: "誰も予想しなかった快進撃。チーム結成から世界制覇まで、データが語るZETA DIVISIONの成長軌跡と、各メンバーの個人的な成長を詳細に分析。",
      readTime: "12分",
      views: "8.7k",
      likes: "980",
      category: "Team Analysis",
      thumbnail: "/api/placeholder/400/250",
      featured: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white" id="featured">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">最新の成長ストーリー</h2>
            <p className="text-gray-600">データから読み解く、感動的な成長の軌跡</p>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center text-red-500 hover:text-red-600 font-medium group"
          >
            すべて見る
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {stories.map((story) => (
            <article
              key={story.id}
              className={`group cursor-pointer ${story.featured ? 'lg:col-span-2' : ''}`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`${story.featured ? 'lg:flex' : ''}`}>
                  {/* Thumbnail */}
                  <div className={`relative overflow-hidden ${story.featured ? 'lg:w-1/2' : ''} h-64 ${story.featured ? 'lg:h-auto' : ''} bg-gradient-to-br from-gray-800 to-gray-900`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {story.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {story.featured && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          特集
                        </span>
                      </div>
                    )}

                    {/* Placeholder for thumbnail */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400">
                        <BarChart3 className="w-16 h-16" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${story.featured ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-500 transition-colors duration-200 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {story.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {story.views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {story.likes}
                      </div>
                      <div className="flex items-center">
                        <span>{story.readTime}の読み物</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="flex items-center text-red-500 group-hover:text-red-600 font-medium">
                      続きを読む
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center lg:hidden">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
          >
            すべてのストーリーを見る
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: "感情的価値",
      description: "ファンにとって推し選手の成長が見える、共感できるストーリー体験を提供します。データの裏にある人間ドラマを発見しましょう。",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: Eye,
      title: "発見価値",
      description: "知らなかった選手の過去や、成長の転機となった試合を発見できます。隠された才能や努力の軌跡を明らかにします。",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: BarChart3,
      title: "比較価値",
      description: "似たような軌跡の選手を発見し、異なる選手間の成長パターンを比較できます。戦略的インサイトを獲得しましょう。",
      color: "text-teal-500",
      bgColor: "bg-teal-50"
    },
    {
      icon: Target,
      title: "予測価値",
      description: "過去のデータから未来のパフォーマンスを予測し、選手の潜在能力や成長可能性を分析します。",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

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
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200`}>
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
};

// CTA Section
const CTASection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <svg
            className="absolute inset-0"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fillRule="evenodd">
              <g fill="#ffffff" fillOpacity="0.1">
                <circle cx="30" cy="30" r="2" />
              </g>
            </g>
          </svg>

          <div className="relative z-10 text-center py-16 px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              あなたの推し選手の<br />成長ストーリーを発見しよう
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              1,000人以上のプロプレイヤーのデータから、感動的な成長の軌跡を追体験。
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
                to="/features"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                詳細を見る
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main HomePage Component
const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <StatsOverview />
      <FeaturedPlayers />
      <GrowthStoriesSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
};

export default HomePage;