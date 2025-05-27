import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Star, Users, Shield, TrendingUp, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // CardTitleはCardHeaderのpropとして渡す

// ダミーの特集記事データ
const featuredArticles = [
  {
    id: 'feature-1',
    title: 'VALORANT Player Storiesへようこそ！',
    category: 'サイト紹介',
    Icon: Lightbulb,
    excerpt: '当サイトは、VALORANTプロプレイヤーたちの成長の軌跡をデータとストーリーで深掘りするプラットフォームです。お気に入りの選手やチームの新たな一面を発見しましょう。',
    imageUrl: 'https://placehold.co/600x400/ef4444/ffffff?text=Welcome!',
    link: '#', // 将来的に記事詳細ページへのリンク
  },
  {
    id: 'feature-2',
    title: '注目プレイヤー深掘り: Dep選手の軌跡',
    category: 'プレイヤー特集',
    Icon: Users,
    excerpt: 'ZETA DIVISION所属、Dep選手のキャリア初期から現在までのパフォーマンス変遷と、記憶に残る名場面を振り返ります。彼の強さの秘密に迫る。',
    imageUrl: 'https://placehold.co/600x400/22c55e/ffffff?text=Dep+Feature',
    link: '/players/24210', // Dep選手の詳細ページへの仮リンク
  },
  {
    id: 'feature-3',
    title: 'チーム分析: Paper Rex 強さの源泉',
    category: 'チーム分析',
    Icon: Shield,
    excerpt: 'APACを代表する強豪チーム Paper Rex。彼らのユニークな戦術とチームワーク、そして国際大会での活躍を分析します。',
    imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=PRX+Analysis',
    link: '#', // 将来的に記事詳細ページへのリンク
  },
  {
    id: 'feature-4',
    title: '最新メタレポート: 新エージェント「クローヴ」の影響は？',
    category: 'メタ分析',
    Icon: TrendingUp,
    excerpt: '新たに登場したコントローラー「クローヴ」。プロシーンでの採用状況や、既存のメタにどのような変化をもたらしているのかを考察します。',
    imageUrl: 'https://placehold.co/600x400/a855f7/ffffff?text=Clove+Meta',
    link: '#',
  },
];

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-valorant-red to-pink-500 bg-clip-text text-transparent mb-3 sm:mb-4">
            <Newspaper className="inline-block w-8 h-8 sm:w-10 sm:h-10 mr-2 -mt-1" />
            特集記事
          </h1>
          <p className="text-md sm:text-lg text-gray-600 max-w-2xl mx-auto">
            VALORANTのプロシーンに関する深掘り分析、プレイヤーやチームのストーリー、最新メタ情報などをお届けします。
          </p>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredArticles.map((article) => {
            const ArticleIcon = article.Icon || Star;
            return (
              <Link key={article.id} to={article.link} className="group block">
                <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // prevent infinite loop
                        target.src = 'https://placehold.co/600x400/cccccc/999999?text=Image+Error';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <span className="absolute top-3 right-3 bg-valorant-red text-white px-2.5 py-1 text-xs font-semibold rounded-full shadow">
                      {article.category}
                    </span>
                  </div>
                  <CardHeader className="p-5 sm:p-6 flex-grow">
                    {/* CardHeaderのtitle propを使用 */}
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-valorant-red transition-colors mb-2 leading-tight">
                      <ArticleIcon className="inline-block w-5 h-5 mr-2 text-valorant-red/80 group-hover:text-valorant-red transition-colors" />
                      {article.title}
                    </h2>
                  </CardHeader>
                  <CardContent className="p-5 sm:p-6 pt-0">
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="mt-4 text-right">
                      <span className="text-xs sm:text-sm text-valorant-blue group-hover:underline font-medium">
                        続きを読む &rarr;
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* More features placeholder */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-500">
            今後、さらに多くの特集記事や分析コンテンツを追加予定です。ご期待ください！
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
