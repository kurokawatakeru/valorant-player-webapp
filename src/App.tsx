import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayersListPage from './pages/PlayersListPage';
import PlayerDetailPage from './pages/PlayerDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                VALORANT Player Stories
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  ホーム
                </Link>
                <Link to="/players" className="text-gray-700 hover:text-blue-600">
                  選手一覧
                </Link>
                <Link to="/teams" className="text-gray-700 hover:text-blue-600">
                  チーム一覧
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-blue-600">
                  大会情報
                </Link>
                <Link to="/features" className="text-gray-700 hover:text-blue-600">
                  特集記事
                </Link>
              </nav>
              <div className="md:hidden">
                {/* モバイルメニューボタン（実際の実装ではハンバーガーメニュー） */}
                <button className="text-gray-700">
                  メニュー
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* メインコンテンツ */}
        <main className="pb-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<PlayersListPage />} />
            <Route path="/players/:playerId" element={<PlayerDetailPage />} />
            <Route path="*" element={
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">ページが見つかりません</h1>
                <p className="mb-8">お探しのページは存在しないか、移動した可能性があります。</p>
                <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md">
                  ホームに戻る
                </Link>
              </div>
            } />
          </Routes>
        </main>
        
        {/* フッター */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">VALORANT Player Stories</h3>
                <p className="text-gray-300">
                  VALORANTプロプレイヤーの成長過程をデータで可視化し、
                  「物語」として伝えるプラットフォーム
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">リンク</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-300 hover:text-white">
                      ホーム
                    </Link>
                  </li>
                  <li>
                    <Link to="/players" className="text-gray-300 hover:text-white">
                      選手一覧
                    </Link>
                  </li>
                  <li>
                    <Link to="/teams" className="text-gray-300 hover:text-white">
                      チーム一覧
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-gray-300 hover:text-white">
                      サイトについて
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
                <p className="text-gray-300 mb-2">
                  ご質問やフィードバックがありましたら、お気軽にお問い合わせください。
                </p>
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  お問い合わせフォーム
                </a>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
              <p>&copy; 2025 VALORANT Player Stories. All rights reserved.</p>
              <p className="mt-1 text-sm">
                このサイトはRiot Gamesの公式サイトではなく、Riot Gamesが承認または支援するものではありません。
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
