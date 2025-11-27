import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  X,
  ArrowRight,
  TrendingUp,
  Target,
  BarChart3,
} from 'lucide-react';
import {
  getAllPlayers,
  generatePlayerGrowthStory,
  Player,
  PlayerGrowthStory,
} from '../api/apiService';
import { LoadingStates } from '../components/ui/LoadingSpinner';

interface PlayerSelectProps {
  label: string;
  selectedPlayer: Player | null;
  onSelect: (player: Player | null) => void;
  players: Player[];
  otherSelectedId: string | null;
}

const PlayerSelect: React.FC<PlayerSelectProps> = memo(
  ({ label, selectedPlayer, onSelect, players, otherSelectedId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredPlayers = useMemo(() => {
      if (!searchTerm) return players.slice(0, 20);
      const search = searchTerm.toLowerCase();
      return players
        .filter(
          (p) =>
            p.id !== otherSelectedId &&
            (p.name.toLowerCase().includes(search) ||
              p.teamTag.toLowerCase().includes(search))
        )
        .slice(0, 20);
    }, [players, searchTerm, otherSelectedId]);

    const handleSelect = useCallback(
      (player: Player) => {
        onSelect(player);
        setIsOpen(false);
        setSearchTerm('');
      },
      [onSelect]
    );

    const handleClear = useCallback(() => {
      onSelect(null);
      setSearchTerm('');
    }, [onSelect]);

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        {selectedPlayer ? (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{selectedPlayer.name}</div>
                <div className="text-sm text-gray-500">{selectedPlayer.teamTag || 'No Team'}</div>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="選手名で検索..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            {isOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handleSelect(player)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{player.name}</div>
                        <div className="text-xs text-gray-500">
                          {player.teamTag || 'No Team'} • {player.country}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    {searchTerm ? '選手が見つかりません' : '検索してください'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

PlayerSelect.displayName = 'PlayerSelect';

interface CompareStatProps {
  label: string;
  value1: string | number;
  value2: string | number;
  higherIsBetter?: boolean;
  format?: 'number' | 'percent' | 'decimal';
}

const CompareStat: React.FC<CompareStatProps> = memo(
  ({ label, value1, value2, higherIsBetter = true, format = 'number' }) => {
    const num1 = typeof value1 === 'number' ? value1 : parseFloat(value1) || 0;
    const num2 = typeof value2 === 'number' ? value2 : parseFloat(value2) || 0;

    const getWinner = () => {
      if (num1 === num2) return 'tie';
      return higherIsBetter ? (num1 > num2 ? 'player1' : 'player2') : num1 < num2 ? 'player1' : 'player2';
    };

    const winner = getWinner();

    const formatValue = (val: string | number) => {
      const num = typeof val === 'number' ? val : parseFloat(val) || 0;
      switch (format) {
        case 'percent':
          return `${(num * 100).toFixed(1)}%`;
        case 'decimal':
          return num.toFixed(2);
        default:
          return num.toFixed(0);
      }
    };

    return (
      <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100">
        <div
          className={`text-right text-xl font-bold ${winner === 'player1' ? 'text-green-600' : 'text-gray-600'}`}
        >
          {formatValue(value1)}
        </div>
        <div className="text-center text-sm font-medium text-gray-500">{label}</div>
        <div
          className={`text-left text-xl font-bold ${winner === 'player2' ? 'text-green-600' : 'text-gray-600'}`}
        >
          {formatValue(value2)}
        </div>
      </div>
    );
  }
);

CompareStat.displayName = 'CompareStat';

interface ComparisonResultProps {
  player1: PlayerGrowthStory;
  player2: PlayerGrowthStory;
}

const ComparisonResult: React.FC<ComparisonResultProps> = memo(({ player1, player2 }) => {
  const stats1 = useMemo(() => {
    const trends = player1.performance_trends || [];
    const matches = player1.processed_matches || [];
    const wins = matches.filter((m) => m.result === 'W').length;
    return {
      avgAcs: trends.length > 0 ? trends.reduce((s, t) => s + (t.acs || 0), 0) / trends.length : 0,
      avgKd: trends.length > 0 ? trends.reduce((s, t) => s + (t.kd_ratio || 0), 0) / trends.length : 0,
      avgHs: trends.length > 0 ? trends.reduce((s, t) => s + (t.hs_percentage || 0), 0) / trends.length : 0,
      winRate: matches.length > 0 ? wins / matches.length : 0,
      totalMatches: matches.length,
      agentCount: player1.agent_stats?.length || 0,
    };
  }, [player1]);

  const stats2 = useMemo(() => {
    const trends = player2.performance_trends || [];
    const matches = player2.processed_matches || [];
    const wins = matches.filter((m) => m.result === 'W').length;
    return {
      avgAcs: trends.length > 0 ? trends.reduce((s, t) => s + (t.acs || 0), 0) / trends.length : 0,
      avgKd: trends.length > 0 ? trends.reduce((s, t) => s + (t.kd_ratio || 0), 0) / trends.length : 0,
      avgHs: trends.length > 0 ? trends.reduce((s, t) => s + (t.hs_percentage || 0), 0) / trends.length : 0,
      winRate: matches.length > 0 ? wins / matches.length : 0,
      totalMatches: matches.length,
      agentCount: player2.agent_stats?.length || 0,
    };
  }, [player2]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      {/* Player Headers */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link
          to={`/players/${player1.info.player_id}`}
          className="text-center group"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="font-bold text-lg text-gray-900 group-hover:text-red-500 transition-colors">
            {player1.info.name}
          </div>
          <div className="text-sm text-gray-500">{player1.info.team}</div>
        </Link>

        <div className="flex items-center justify-center">
          <div className="text-2xl font-bold text-gray-300">VS</div>
        </div>

        <Link
          to={`/players/${player2.info.player_id}`}
          className="text-center group"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="font-bold text-lg text-gray-900 group-hover:text-blue-500 transition-colors">
            {player2.info.name}
          </div>
          <div className="text-sm text-gray-500">{player2.info.team}</div>
        </Link>
      </div>

      {/* Stats Comparison */}
      <div className="space-y-1">
        <CompareStat label="平均ACS" value1={stats1.avgAcs} value2={stats2.avgAcs} />
        <CompareStat label="平均K/D" value1={stats1.avgKd} value2={stats2.avgKd} format="decimal" />
        <CompareStat
          label="平均HS%"
          value1={stats1.avgHs}
          value2={stats2.avgHs}
          format="percent"
        />
        <CompareStat label="勝率" value1={stats1.winRate} value2={stats2.winRate} format="percent" />
        <CompareStat label="総試合数" value1={stats1.totalMatches} value2={stats2.totalMatches} />
        <CompareStat
          label="使用エージェント数"
          value1={stats1.agentCount}
          value2={stats2.agentCount}
        />
      </div>

      {/* Top Agents Comparison */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">メインエージェント</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-right">
            {player1.agent_stats?.slice(0, 3).map((agent) => (
              <div key={agent.agent_name} className="mb-2">
                <span className="text-sm font-medium text-gray-700">{agent.agent_name}</span>
                <span className="text-xs text-gray-500 ml-2">({agent.matches_played}試合)</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Target className="w-6 h-6 text-gray-300" />
          </div>
          <div className="text-left">
            {player2.agent_stats?.slice(0, 3).map((agent) => (
              <div key={agent.agent_name} className="mb-2">
                <span className="text-sm font-medium text-gray-700">{agent.agent_name}</span>
                <span className="text-xs text-gray-500 ml-2">({agent.matches_played}試合)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ComparisonResult.displayName = 'ComparisonResult';

const ComparePage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [player1Data, setPlayer1Data] = useState<PlayerGrowthStory | null>(null);
  const [player2Data, setPlayer2Data] = useState<PlayerGrowthStory | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const playersData = await getAllPlayers(100);
        setPlayers(playersData);
      } catch (error) {
        console.error('Failed to fetch players:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleCompare = useCallback(async () => {
    if (!player1 || !player2) return;

    setComparing(true);
    setPlayer1Data(null);
    setPlayer2Data(null);

    try {
      const [data1, data2] = await Promise.all([
        generatePlayerGrowthStory(player1.id),
        generatePlayerGrowthStory(player2.id),
      ]);
      setPlayer1Data(data1);
      setPlayer2Data(data2);
    } catch (error) {
      console.error('Failed to fetch player data for comparison:', error);
    } finally {
      setComparing(false);
    }
  }, [player1, player2]);

  const canCompare = player1 && player2 && player1.id !== player2.id;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingStates.Page title="読み込み中..." description="選手データを取得しています" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
            選手比較
          </h1>
          <p className="text-xl text-gray-600">2人の選手のパフォーマンスを比較</p>
        </div>

        {/* Player Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PlayerSelect
              label="選手1"
              selectedPlayer={player1}
              onSelect={setPlayer1}
              players={players}
              otherSelectedId={player2?.id || null}
            />
            <PlayerSelect
              label="選手2"
              selectedPlayer={player2}
              onSelect={setPlayer2}
              players={players}
              otherSelectedId={player1?.id || null}
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleCompare}
              disabled={!canCompare || comparing}
              className={`inline-flex items-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 transform ${
                canCompare && !comparing
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:scale-105 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {comparing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  比較中...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5 mr-2" />
                  比較する
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Comparison Result */}
        {player1Data && player2Data && (
          <ComparisonResult player1={player1Data} player2={player2Data} />
        )}

        {/* Empty State */}
        {!player1Data && !player2Data && !comparing && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              2人の選手を選択して比較してください
            </h3>
            <p className="text-gray-600">
              選手のパフォーマンス統計を並べて比較できます
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
