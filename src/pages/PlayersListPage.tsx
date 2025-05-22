import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJapanesePlayers, Player } from '../api/apiService';

const PlayersListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
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
        
        setFilteredPlayers(japanesePlayersData);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('プレイヤーデータの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayers();
  }, []);

  // 検索とフィルタリングを適用
  useEffect(() => {
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
    
    setFilteredPlayers(result);
  }, [players, searchTerm, teamFilter]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">日本人VALORANTプロプレイヤー一覧</h1>
      
      {/* 検索・フィルターセクション */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 検索ボックス */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              選手名・チーム名で検索
            </label>
            <input
              type="text"
              id="search"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* チームフィルター */}
          <div>
            <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 mb-1">
              チームでフィルター
            </label>
            <select
              id="team-filter"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              <option value="">すべてのチーム</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* プレイヤーリスト */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <Link 
              key={player.id} 
              to={`/players/${player.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold">{player.name}</h3>
                {player.teamTag && (
                  <div className="text-sm text-gray-600 mb-2">{player.teamTag}</div>
                )}
                <div className="text-xs text-gray-500">
                  {player.country && (
                    <span>{player.country}</span>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            条件に一致する選手が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersListPage;
