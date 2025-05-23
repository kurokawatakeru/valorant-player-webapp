import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Users,
  Trophy,
  Star,
  Eye,
  X
} from 'lucide-react';
// 修正: getPlayersFromLiquipedia をインポート
import { getPlayersFromLiquipedia, Player } from '../api/apiService';

// Loading Skeleton Component
const PlayerCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

// Enhanced Player Card Component
interface EnhancedPlayerCardProps {
  player: Player;
  viewMode: 'grid' | 'list';
}

const EnhancedPlayerCard: React.FC<EnhancedPlayerCardProps> = ({ player, viewMode }) => {
  // プレイヤー画像は詳細ページで取得するため、ここではプレースホルダー
  const placeholderImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random&color=fff&size=128`;

  if (viewMode === 'list') {
    return (
      <Link
        to={`/players/${encodeURIComponent(player.id)}`} // id (ページ名) をエンコード
        className="group"
      >
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex items-center space-x-6 hover:bg-gray-50">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {/* 簡易的なアバター表示 */}
            <img src={placeholderImageUrl} alt={player.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-500 transition-colors duration-200 truncate">
                {player.name}
              </h3>
              {player.teamTag && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {player.teamTag}
                </span>
              )}
            </div>
            {player.country && (
                 <p className="text-sm text-gray-500 truncate">
                    {player.country}
                 </p>
            )}
          </div>
          <div className="flex items-center text-gray-400 group-hover:text-red-500 transition-colors duration-200">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/players/${encodeURIComponent(player.id)}`} // id (ページ名) をエンコード
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-40 bg-gray-200 overflow-hidden">
          {/* 簡易的なアバター表示 */}
          <img src={placeholderImageUrl} alt={player.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
          {player.country && (
            <div className="absolute top-2 left-2 z-20">
              <div className="bg-black/30 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium">
                {player.country}
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-md font-bold text-gray-900 group-hover:text-red-500 transition-colors duration-200 truncate mb-1">
            {player.name}
          </h3>
          {player.teamTag && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">
              {player.teamTag}
            </span>
          )}
           <div className="flex items-center justify-center py-1.5 mt-2 text-xs text-gray-600 group-hover:text-red-500 border-t border-gray-100 transition-colors duration-200">
            <Eye className="w-3 h-3 mr-1.5" />
            <span>詳細を見る</span>
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
  // teamFilter: string; // Liquipediaからのチーム情報取得が複雑なため一旦コメントアウト
  // setTeamFilter: (team: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  // teams: string[]; // 同上
  totalCount: number;
  filteredCount: number;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  searchTerm,
  setSearchTerm,
  // teamFilter,
  // setTeamFilter,
  sortBy,
  setSortBy,
  // teams,
  totalCount,
  filteredCount
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="選手名で検索..." // チーム名検索は一旦保留
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
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredCount}件中{totalCount}件の選手を表示
          </span>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                // setTeamFilter('');
              }}
              className="flex items-center text-red-500 hover:text-red-600 font-medium"
            >
              <X className="w-4 h-4 mr-1" />
              クリア
            </button>
          )}
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {/* チームフィルターは一旦非表示
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
            */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                並び替え
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="name_asc">名前順 (昇順)</option>
                <option value="name_desc">名前順 (降順)</option>
                {/* 国籍ソートは国籍情報取得後に実装 */}
              </select>
            </div>
            {/* 地域フィルターも一旦保留
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地域
              </label>
              <select
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">すべての地域</option>
              </select>
            </div>
             */}
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
  // const [teamFilter, setTeamFilter] = useState<string>(''); // 一旦コメントアウト
  const [sortBy, setSortBy] = useState<string>('name_asc'); // デフォルトソート
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // const [teams, setTeams] = useState<string[]>([]); // 一旦コメントアウト

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        // 修正: getPlayersFromLiquipedia を使用
        const playersData = await getPlayersFromLiquipedia(200); // まず200件取得してみる
        setPlayers(playersData);

        // チームリストの抽出は、Player型にteamTagが含まれるようになってから
        // const uniqueTeams = Array.from(new Set(playersData.map(player => player.teamTag).filter(Boolean)))
        //   .sort();
        // setTeams(uniqueTeams as string[]);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('プレイヤーデータの取得中にエラーが発生しました。しばらくしてから再試行してください。');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...players];
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(player =>
        player.name.toLowerCase().includes(searchLower)
        // || (player.teamTag && player.teamTag.toLowerCase().includes(searchLower)) // teamTagでの検索は保留
      );
    }
    // if (teamFilter) { // teamFilterは保留
    //   result = result.filter(player => player.teamTag === teamFilter);
    // }
    result.sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name_desc') {
        return b.name.localeCompare(a.name);
      }
      // 他のソート条件は後で追加
      return 0;
    });
    return result;
  }, [players, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* 修正: タイトル変更 */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
            VALORANTプロプレイヤー一覧
          </h1>
          <p className="text-gray-600">プレイヤーデータを読み込んでいます...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <PlayerCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl inline-block">
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
        <div className="mb-12">
          {/* 修正: タイトル変更 */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
            VALORANTプロプレイヤー一覧
          </h1>
          <p className="text-xl text-gray-600">
            {/* 修正: メッセージ変更 */}
            世界中のVALORANTプロプレイヤーの成長ストーリーを発見しよう
          </p>
        </div>
        <FilterComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          // teamFilter={teamFilter}
          // setTeamFilter={setTeamFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          // teams={teams}
          totalCount={players.length}
          filteredCount={filteredAndSortedPlayers.length}
        />
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
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {filteredAndSortedPlayers.length} 選手
            </div>
            {/* チーム数の表示はチーム情報取得後に再検討
            <div className="flex items-center text-gray-600">
              <Trophy className="w-4 h-4 mr-1" />
              {teams.length} チーム
            </div>
            */}
          </div>
        </div>
        {filteredAndSortedPlayers.length > 0 ? (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
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
                  // setTeamFilter('');
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                <X className="w-4 h-4 mr-2" />
                フィルターをリセット
              </button>
            </div>
          </div>
        )}
        {/* TODO: ページネーションの実装 (APIからの総件数とページング対応が必要) */}
        <div className="mt-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">お気に入りの選手が見つかりませんか？</h2>
          <p className="text-lg mb-6 opacity-90">
            Liquipediaに情報が掲載されていれば、検索で見つかるかもしれません。
          </p>
          <a
            href="https://liquipedia.net/valorant/Players"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-white text-red-500 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
          >
            <Star className="w-5 h-5 mr-2" />
            Liquipediaで選手を探す
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlayersListPage;
