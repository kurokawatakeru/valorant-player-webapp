import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const Footer: React.FC = memo(() => {
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
            <h4 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
              クイックリンク
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'ホーム' },
                { to: '/players', label: '選手一覧' },
                { to: '/teams', label: 'チーム一覧' },
                { to: '/features', label: '特集記事' },
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
            <h4 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
              サポート
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 hover:underline"
                >
                  お問い合わせ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 hover:underline"
                >
                  利用規約
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 hover:underline"
                >
                  プライバシーポリシー
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm">
              &copy; {currentYear} VALORANT Player Stories. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs text-center md:text-right max-w-md">
              このサイトはRiot
              Gamesの公式サイトではなく、Riot Gamesが承認または支援するものではありません。
              VALORANT is a trademark or registered trademark of Riot Games, Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
