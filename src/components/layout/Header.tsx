import React, { useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, Trophy, Search, Shield, BarChart3 } from 'lucide-react';

const Header: React.FC = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'ホーム', icon: Home },
    { path: '/players', label: '選手一覧', icon: Users },
    { path: '/teams', label: 'チーム一覧', icon: Shield },
    { path: '/compare', label: '比較', icon: BarChart3 },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/teams' && location.pathname.startsWith('/teams/')) return true;
    if (path === '/players' && location.pathname.startsWith('/players/')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-[#161B22] border-b-4 border-[#FF0040] sticky top-0 z-50 shadow-[0_4px_0_0_#000]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 text-lg sm:text-xl font-pixel text-[#FF0040] hover:text-[#00FFFF] transition-colors duration-200"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF0040] flex items-center justify-center border-2 border-[#FFFF00] shadow-[4px_4px_0_0_#000]">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="hidden sm:block text-shadow">VPA</span>
            <span className="sm:hidden">VPA</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 lg:px-4 font-pixel-jp text-xs lg:text-sm transition-all duration-200 border-2 ${
                    isActivePath(item.path)
                      ? 'text-[#0D1117] bg-[#00FFFF] border-[#00FFFF] shadow-[4px_4px_0_0_#000]'
                      : 'text-[#F0F6FC] border-transparent hover:border-[#FF0040] hover:text-[#FF0040]'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <button className="hidden md:flex p-2 text-[#F0F6FC] hover:text-[#00FFFF] border-2 border-transparent hover:border-[#00FFFF] transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#F0F6FC] hover:text-[#00FFFF] border-2 border-[#FF0040] hover:border-[#00FFFF] transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-[#FF0040] bg-[#161B22]">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 font-pixel-jp text-sm transition-all duration-200 border-2 ${
                      isActivePath(item.path)
                        ? 'text-[#0D1117] bg-[#00FFFF] border-[#00FFFF]'
                        : 'text-[#F0F6FC] border-transparent hover:border-[#FF0040] hover:text-[#FF0040]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="px-4 py-2">
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-[#0D1117] border-2 border-[#FF0040] text-[#F0F6FC] hover:bg-[#FF0040] hover:text-white transition-all duration-200 font-pixel-jp text-sm">
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
});

Header.displayName = 'Header';

export default Header;
