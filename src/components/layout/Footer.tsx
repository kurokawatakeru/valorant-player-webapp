import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const Footer: React.FC = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D1117] text-[#F0F6FC] border-t-4 border-[#FF0040]">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#FF0040] flex items-center justify-center border-2 border-[#FFFF00] shadow-[4px_4px_0_0_#000]">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-pixel text-sm sm:text-base text-[#00FFFF]">
                VPA
              </h3>
            </div>
            <p className="text-[#F0F6FC] text-sm leading-relaxed mb-4 font-pixel-jp border-l-4 border-[#00FFFF] pl-4">
              VALORANTプロプレイヤーのパフォーマンスデータを可視化し、
              統計分析を提供するプラットフォーム。
            </p>
          </div>

          <div>
            <h4 className="font-pixel text-xs sm:text-sm mb-3 sm:mb-4 text-[#FFFF00]">
              LINKS
            </h4>
            <ul className="space-y-2 text-sm font-pixel-jp">
              {[
                { to: '/', label: '> ホーム' },
                { to: '/players', label: '> 選手一覧' },
                { to: '/teams', label: '> チーム一覧' },
                { to: '/compare', label: '> 選手比較' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[#F0F6FC] hover:text-[#00FFFF] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-pixel text-xs sm:text-sm mb-3 sm:mb-4 text-[#FFFF00]">
              SUPPORT
            </h4>
            <ul className="space-y-2 text-sm text-[#F0F6FC] font-pixel-jp">
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FFFF] transition-colors duration-200"
                >
                  {'>'} お問い合わせ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FFFF] transition-colors duration-200"
                >
                  {'>'} 利用規約
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FFFF] transition-colors duration-200"
                >
                  {'>'} プライバシー
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-[#FF0040] mt-6 sm:mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-[#00FFFF] text-xs font-pixel">
              &copy; {currentYear} VPA
            </p>
            <p className="text-[#F0F6FC]/60 text-xs text-center md:text-right max-w-md font-pixel-jp">
              Riot Gamesの公式サイトではありません。
              VALORANT is a trademark of Riot Games, Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
