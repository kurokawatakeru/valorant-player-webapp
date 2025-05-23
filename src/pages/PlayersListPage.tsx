import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Users, 
  Trophy, 
  TrendingUp, 
  Star,
  ArrowUpDown,
  Eye,
  ChevronDown,
  X
} from 'lucide-react';
import { getJapanesePlayers, Player } from '../api/apiService';

// Loading Skeleton Component
const PlayerCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// Enhanced Player Card Component
interface EnhancedPlayerCardProps {
  player: Player;
  viewMode: 'grid' | 'list';
}

const EnhancedPlayerCard: React.FC<EnhancedPlayerCardProps> = ({ player, viewMode }) => {
  const [imageError, setImageError] = useState(false);
  
  if (viewMode === 'list') {
    return (
      <Link 
        to={`/players/${player.id}`}
        className="group"
      >
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex items-center space-x-6 hover:bg-gray-50">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-500 transition-colors duration-200 truncate">
                {player.name}
              </h3>
              {player.teamTag && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  {player.teamTag}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{player.country}</span>
              <span>•</span>
              <span>Active Player</span>
            </div>
          </div>
          
          {/* Action */}
          <div className="flex items-center text-gray-400 group-hover:text-red-500 transition-colors duration-200">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/players/${player.id}`}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Player Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          
          {/* Country Badge */}
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
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-500 transition-colors duration-200 truncate">
              {player.name}
            </h3>
            {player.teamTag && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {player.teamTag}
              </span>
            )}
          </div>
          
          {/* Action Button */}
          <div className="flex items-center justify-center py-2 text-gray-600 group-hover:text-red-500 transition-colors duration-200">
            <Eye className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">成長ストーリーを見る</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Filter Component
interface FilterComponentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  teamFilter: string;
  setTeamFilter: (team: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  teams: string[];
  totalCount: number;
  filteredCount: number;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  searchTerm,
  setSearchTerm,
  teamFilter,
  setTeamFilter,
  sortBy,
  setSortBy,
  teams,
  totalCount,
  filteredCount
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="選手名やチーム名で検索..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-all duration-200 ${
              showFilters ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredCount}件中{totalCount}件の選手を表示
          </span>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTeamFilter('');
              }}
              className="flex items-center text-red-500 hover:text-red-600 font-medium"
            >
              <X className="w-4 h-4 mr-1" />
              クリア
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Team Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                チーム
              </label>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">すべてのチーム</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                並び替え
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="name">名前順</option>
                <option value="team">チーム順</option>
                <option value="country">国順</option>
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地域
              </label>
              <select
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">すべての地域</option>
                <option value="jp">日本</option>
                <option value="kr">韓国</option>
                <option value="apac">APAC</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main PlayersListPage Component
const PlayersListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [teams, setTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 日本人プレイヤーを取得
        const japanesePlayersData = await getJapanesePlayers();
        setPlayers(japanesePlayersData);
        
        // チームリストを抽出
        const uniqueTeams = Array.from(new Set(japanesePlayersData.map(player => player.teamTag)))
          .filter(Boolean)
          .sort();
        setTeams(uniqueTeams);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('プレイヤーデータの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayers();
  }, []);

  // フィルタリングとソート
  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...players];
    
    // 検索語でフィルタリング
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(player => 
        player.name.toLowerCase().includes(searchLower) || 
        player.teamTag.toLowerCase().includes(searchLower)
      );
    }
    
    // チームでフィルタリング
    if (teamFilter) {
      result = result.filter(player => player.teamTag === teamFilter);
    }

    // ソート
    result.sort((a, b) => {
      switch (sortBy) {
        case 'team':
          return a.teamTag.localeCompare(b.teamTag);
        case 'country':
          return a.country.localeCompare(b.country);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return result;
  }, [players, searchTerm, teamFilter, sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
            日本人VALORANTプロプレイヤー一覧
          </h1>
          <p className="text-gray-600">読み込み中...</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <PlayerCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
          <div className="flex items-center mb-2">
            <X className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">エラーが発生しました</h3>
          </div>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
            日本人VALORANTプロプレイヤー一覧
          </h1>
          <p className="text-xl text-gray-600">
            {players.length}人の日本人プロプレイヤーの成長ストーリーを発見しよう
          </p>
        </div>
        
        {/* Filter Section */}
        <FilterComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          teamFilter={teamFilter}
          setTeamFilter={setTeamFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          teams={teams}
          totalCount={players.length}
          filteredCount={filteredAndSortedPlayers.length}
        />

        {/* View Toggle and Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">表示形式:</span>
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {filteredAndSortedPlayers.length} 選手
            </div>
            <div className="flex items-center text-gray-600">
              <Trophy className="w-4 h-4 mr-1" />
              {teams.length} チーム
            </div>
          </div>
        </div>
        
        {/* Players Grid/List */}
        {filteredAndSortedPlayers.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredAndSortedPlayers.map((player) => (
              <EnhancedPlayerCard
                key={player.id}
                player={player}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                条件に一致する選手が見つかりませんでした
              </h3>
              <p className="text-gray-600 mb-6">
                検索条件を変更するか、フィルターをリセットしてください
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTeamFilter('');
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                <X className="w-4 h-4 mr-2" />
                フィルターをリセット
              </button>
            </div>
          </div>
        )}

        {/* Pagination (for future implementation) */}
        {filteredAndSortedPlayers.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50" disabled>
                前へ
              </button>
              <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">1</span>
              <button className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50" disabled>
                次へ
              </button>
            </div>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">お気に入りの選手が見つかりませんか？</h2>
          <p className="text-lg mb-6 opacity-90">
            リクエスト機能を使って、追加してほしい選手を教えてください
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-white text-red-500 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
            <Star className="w-5 h-5 mr-2" />
            選手をリクエスト
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayersListPage;