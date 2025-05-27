import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, Trophy, FileText, Search, Shield } from 'lucide-react';
import HomePage from './pages/HomePage';
import PlayersListPage from './pages/PlayersListPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import TeamsListPage from './pages/TeamsListPage';
import TeamDetailPage from './pages/TeamDetailPage'; // 新しくインポート

// Header Component (変更なし - 前回と同じ)
const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'ホーム', icon: Home },
    { path: '/players', label: '選手一覧', icon: Users },
    { path: '/teams', label: 'チーム一覧', icon: Shield },
    { path: '/features', label: '特集記事', icon: FileText }, 
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    // チーム詳細ページでもチーム一覧タブがアクティブになるように調整
    if (path === '/teams' && location.pathname.startsWith('/teams/')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent hover:from-red-600 hover:to-pink-600 transition-all duration-300"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="hidden sm:block">VALORANT Player Stories</span>
            <span className="sm:hidden">VPS</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 lg:px-4 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base hover:bg-gray-100 ${
                    isActivePath(item.path)
                      ? 'text-red-600 bg-red-50 shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <button className="hidden md:flex p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? 'text-red-600 bg-red-50 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="px-4 py-2">
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 text-gray-700">
                  <Search className="w-5 h-5" />
                  <span>検索</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Footer Component (変更なし - 前回と同じ)
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                VALORANT Player Stories
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              VALORANTプロプレイヤーの成長過程をデータで可視化し、
              「物語」として伝えるプラットフォーム。選手の軌跡を追い、
              感動的な成長ストーリーを発見しよう。
            </p>
          </div>

          <div>
            <h4 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4 text-white">クイックリンク</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'ホーム' },
                { to: '/players', label: '選手一覧' },
                { to: '/teams', label: 'チーム一覧' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4 text-white">サポート</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors duration-200 hover:underline">お問い合わせ</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200 hover:underline">利用規約</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200 hover:underline">プライバシーポリシー</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm">
              &copy; {currentYear} VALORANT Player Stories. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs text-center md:text-right max-w-md">
              このサイトはRiot Gamesの公式サイトではなく、Riot Gamesが承認または支援するものではありません。
              VALORANT is a trademark or registered trademark of Riot Games, Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// NotFoundPage Component (変更なし - 前回と同じ)
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl sm:text-4xl font-bold text-white">404</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">ページが見つかりません</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
            お探しのページは存在しないか、移動した可能性があります。
            URLを確認するか、ホームページに戻ってください。
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            ホームに戻る
          </Link>
          <Link 
            to="/players" 
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            選手一覧を見る
          </Link>
        </div>
      </div>
    </div>
  );
};


// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<PlayersListPage />} />
            <Route path="/players/:playerId" element={<PlayerDetailPage />} />
            <Route path="/teams" element={<TeamsListPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailPage />} /> {/* 新しいルートを追加 */}
            {/* <Route path="/features" element={<FeaturesPage />} /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
