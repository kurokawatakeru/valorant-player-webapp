import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
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
  X,
} from 'lucide-react';
import { getAllPlayers, Player } from '../api/apiService';

// Loading Skeleton Component
const PlayerCardSkeleton: React.FC = memo(() => (
  <div className="bg-[#161B22] border-4 border-[#FF0040]/30 shadow-[8px_8px_0_0_#000] animate-pulse">
    <div className="h-40 bg-[#0D1117]"></div>
    <div className="p-4">
      <div className="h-4 bg-[#0D1117] mb-3"></div>
      <div className="h-3 bg-[#0D1117] mb-2 w-3/4"></div>
      <div className="h-3 bg-[#0D1117] w-1/2"></div>
    </div>
  </div>
));

PlayerCardSkeleton.displayName = 'PlayerCardSkeleton';

// Enhanced Player Card Component
interface EnhancedPlayerCardProps {
  player: Player;
  viewMode: 'grid' | 'list';
}

const EnhancedPlayerCard: React.FC<EnhancedPlayerCardProps> = memo(({ player, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <Link to={`/players/${player.id}`} className="group block">
        <div className="bg-[#161B22] border-4 border-[#FF0040] shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 p-4 flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-14 h-14 bg-[#0D1117] border-2 border-[#00FFFF] flex items-center justify-center flex-shrink-0">
            <Users className="w-7 h-7 text-[#00FFFF]" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="font-pixel text-xs sm:text-sm text-[#00FFFF] group-hover:text-[#FFFF00] transition-colors duration-200 truncate">
                {player.name}
              </h3>
              {player.teamTag && (
                <span className="font-pixel text-xs bg-[#FF0040] text-white px-2 py-0.5 border-2 border-[#000]">
                  {player.teamTag}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 font-pixel-jp text-xs text-[#F0F6FC]/60">
              <span>{player.country}</span>
              <span className="text-[#FF0040]">|</span>
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center text-[#F0F6FC]/60 group-hover:text-[#FFFF00] transition-colors duration-200">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/players/${player.id}`} className="group block">
      <div className="bg-[#161B22] border-4 border-[#FF0040] shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 overflow-hidden">
        {/* Player Image */}
        <div className="relative h-36 bg-[#0D1117] overflow-hidden border-b-4 border-[#FF0040]">
          {/* Country Badge */}
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-[#00FFFF] text-[#0D1117] px-2 py-1 font-pixel text-xs border-2 border-[#000]">
              {player.country}
            </div>
          </div>

          {/* Placeholder for player image */}
          <div className="w-full h-full flex items-center justify-center">
            <Users className="w-14 h-14 text-[#FF0040]/50" />
          </div>
        </div>

        {/* Player Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-pixel text-xs text-[#00FFFF] group-hover:text-[#FFFF00] transition-colors duration-200 truncate">
              {player.name}
            </h3>
            {player.teamTag && (
              <span className="font-pixel text-xs bg-[#FF0040] text-white px-2 py-0.5 border-2 border-[#000]">
                {player.teamTag}
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-center py-2 text-[#F0F6FC]/60 group-hover:text-[#FFFF00] transition-colors duration-200 border-t-2 border-[#FF0040]/30">
            <Eye className="w-4 h-4 mr-2" />
            <span className="font-pixel-jp text-xs">VIEW</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

EnhancedPlayerCard.displayName = 'EnhancedPlayerCard';

// Filter Component
interface FilterComponentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  teamFilter: string;
  setTeamFilter: (team: string) => void;
  countryFilter: string;
  setCountryFilter: (country: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  teams: string[];
  countries: string[];
  totalCount: number;
  filteredCount: number;
}

const FilterComponent: React.FC<FilterComponentProps> = memo(
  ({
    searchTerm,
    setSearchTerm,
    teamFilter,
    setTeamFilter,
    countryFilter,
    setCountryFilter,
    sortBy,
    setSortBy,
    teams,
    countries,
    totalCount,
    filteredCount,
  }) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      },
      [setSearchTerm]
    );

    const handleTeamChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTeamFilter(e.target.value);
      },
      [setTeamFilter]
    );

    const handleCountryChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryFilter(e.target.value);
      },
      [setCountryFilter]
    );

    const handleSortChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
      },
      [setSortBy]
    );

    const handleClear = useCallback(() => {
      setSearchTerm('');
      setTeamFilter('');
      setCountryFilter('');
    }, [setSearchTerm, setTeamFilter, setCountryFilter]);

    const toggleFilters = useCallback(() => {
      setShowFilters((prev) => !prev);
    }, []);

    return (
      <div className="bg-[#161B22] border-4 border-[#00FFFF] shadow-[8px_8px_0_0_#000] p-4 sm:p-6 mb-8">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00FFFF] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="検索..."
              className="w-full pl-12 pr-12 py-3 bg-[#0D1117] border-4 border-[#FF0040] text-[#F0F6FC] placeholder-[#F0F6FC]/40 font-pixel-jp text-sm focus:outline-none focus:border-[#FFFF00] transition-all duration-200"
            />
            <button
              onClick={toggleFilters}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 transition-all duration-200 ${
                showFilters
                  ? 'text-[#FFFF00]'
                  : 'text-[#F0F6FC]/60 hover:text-[#00FFFF]'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between font-pixel text-xs">
            <span className="text-[#00FFFF]">
              {filteredCount} / {totalCount}
            </span>
            {(searchTerm || teamFilter || countryFilter) && (
              <button
                onClick={handleClear}
                className="flex items-center text-[#FF0040] hover:text-[#FFFF00] transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-1" />
                CLEAR
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-[#FF0040]/30">
              {/* Team Filter */}
              <div>
                <label className="block font-pixel text-xs text-[#FFFF00] mb-2">TEAM</label>
                <select
                  value={teamFilter}
                  onChange={handleTeamChange}
                  className="w-full px-3 py-2 bg-[#0D1117] border-4 border-[#FF0040] text-[#F0F6FC] font-pixel-jp text-sm focus:outline-none focus:border-[#FFFF00] transition-all duration-200"
                >
                  <option value="">ALL TEAMS</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block font-pixel text-xs text-[#FFFF00] mb-2">SORT</label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 bg-[#0D1117] border-4 border-[#FF0040] text-[#F0F6FC] font-pixel-jp text-sm focus:outline-none focus:border-[#FFFF00] transition-all duration-200"
                >
                  <option value="name">NAME</option>
                  <option value="team">TEAM</option>
                  <option value="country">COUNTRY</option>
                </select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block font-pixel text-xs text-[#FFFF00] mb-2">COUNTRY</label>
                <select
                  value={countryFilter}
                  onChange={handleCountryChange}
                  className="w-full px-3 py-2 bg-[#0D1117] border-4 border-[#FF0040] text-[#F0F6FC] font-pixel-jp text-sm focus:outline-none focus:border-[#FFFF00] transition-all duration-200"
                >
                  <option value="">ALL</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FilterComponent.displayName = 'FilterComponent';

// View Toggle Component
interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  filteredCount: number;
  teamsCount: number;
}

const ViewToggle: React.FC<ViewToggleProps> = memo(
  ({ viewMode, setViewMode, filteredCount, teamsCount }) => {
    const handleGridClick = useCallback(() => setViewMode('grid'), [setViewMode]);
    const handleListClick = useCallback(() => setViewMode('list'), [setViewMode]);

    return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <span className="font-pixel text-xs text-[#F0F6FC]/60">VIEW:</span>
          <div className="flex border-4 border-[#FF0040] bg-[#0D1117]">
            <button
              onClick={handleGridClick}
              className={`p-2 transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-[#FF0040] text-white'
                  : 'text-[#F0F6FC]/60 hover:text-[#00FFFF]'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={handleListClick}
              className={`p-2 transition-all duration-200 border-l-2 border-[#FF0040] ${
                viewMode === 'list'
                  ? 'bg-[#FF0040] text-white'
                  : 'text-[#F0F6FC]/60 hover:text-[#00FFFF]'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center space-x-6 font-pixel text-xs">
          <div className="flex items-center text-[#00FFFF]">
            <Users className="w-4 h-4 mr-2" />
            {filteredCount}
          </div>
          <div className="flex items-center text-[#FF00FF]">
            <Trophy className="w-4 h-4 mr-2" />
            {teamsCount}
          </div>
        </div>
      </div>
    );
  }
);

ViewToggle.displayName = 'ViewToggle';

// Main PlayersListPage Component
const PlayersListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [teams, setTeams] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);

        const playersData = await getAllPlayers();
        setPlayers(playersData);

        const uniqueTeams = Array.from(
          new Set(playersData.map((player) => player.teamTag))
        )
          .filter(Boolean)
          .sort();
        setTeams(uniqueTeams);

        const uniqueCountries = Array.from(
          new Set(playersData.map((player) => player.country))
        )
          .filter(Boolean)
          .sort();
        setCountries(uniqueCountries);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('データの取得中にエラーが発生しました。');
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
      result = result.filter(
        (player) =>
          player.name.toLowerCase().includes(searchLower) ||
          player.teamTag.toLowerCase().includes(searchLower)
      );
    }

    if (teamFilter) {
      result = result.filter((player) => player.teamTag === teamFilter);
    }

    if (countryFilter) {
      result = result.filter((player) => player.country === countryFilter);
    }

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
  }, [players, searchTerm, teamFilter, countryFilter, sortBy]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setTeamFilter('');
    setCountryFilter('');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-pixel text-xl sm:text-2xl text-[#FF0040] mb-2">
              PLAYERS
            </h1>
            <p className="font-pixel text-xs text-[#00FFFF] animate-pulse">LOADING...</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <PlayerCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-[#161B22] border-4 border-[#FF0040] shadow-[8px_8px_0_0_#000] p-6">
            <div className="flex items-center mb-3">
              <X className="w-5 h-5 mr-2 text-[#FF0040]" />
              <h3 className="font-pixel text-sm text-[#FF0040]">ERROR</h3>
            </div>
            <p className="font-pixel-jp text-sm text-[#F0F6FC] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#FF0040] text-white font-pixel text-xs border-4 border-[#FFFF00] shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
            >
              RETRY
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-[#FF0040] mb-2">
            PLAYERS
          </h1>
          <p className="font-pixel-jp text-sm text-[#F0F6FC]/60">
            {players.length}人のプロプレイヤー
          </p>
        </div>

        {/* Filter Section */}
        <FilterComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          teamFilter={teamFilter}
          setTeamFilter={setTeamFilter}
          countryFilter={countryFilter}
          setCountryFilter={setCountryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          teams={teams}
          countries={countries}
          totalCount={players.length}
          filteredCount={filteredAndSortedPlayers.length}
        />

        {/* View Toggle and Stats */}
        <ViewToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
          filteredCount={filteredAndSortedPlayers.length}
          teamsCount={teams.length}
        />

        {/* Players Grid/List */}
        {filteredAndSortedPlayers.length > 0 ? (
          <div
            className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}
          >
            {filteredAndSortedPlayers.map((player) => (
              <EnhancedPlayerCard key={player.id} player={player} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#161B22] border-4 border-[#FF0040] flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-[#FF0040]/50" />
              </div>
              <h3 className="font-pixel text-sm text-[#FF0040] mb-2">
                NOT FOUND
              </h3>
              <p className="font-pixel-jp text-xs text-[#F0F6FC]/60 mb-6">
                条件に一致する選手が見つかりませんでした
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center px-6 py-3 bg-[#FF0040] text-white font-pixel text-xs border-4 border-[#FFFF00] shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                RESET
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredAndSortedPlayers.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 font-pixel text-xs text-[#F0F6FC]/40 border-4 border-[#FF0040]/30 bg-[#161B22] cursor-not-allowed"
                disabled
              >
                PREV
              </button>
              <span className="px-4 py-2 bg-[#FF0040] text-white font-pixel text-xs border-4 border-[#FFFF00]">1</span>
              <button
                className="px-4 py-2 font-pixel text-xs text-[#F0F6FC]/40 border-4 border-[#FF0040]/30 bg-[#161B22] cursor-not-allowed"
                disabled
              >
                NEXT
              </button>
            </div>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-16 bg-[#161B22] border-4 border-[#FF0040] shadow-[12px_12px_0_0_#000] p-6 sm:p-8 text-center">
          <h2 className="font-pixel text-lg sm:text-xl text-[#FFFF00] mb-2">REQUEST</h2>
          <p className="font-pixel-jp text-sm text-[#F0F6FC]/80 mb-6">
            追加してほしい選手をリクエスト
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-transparent text-[#00FFFF] font-pixel text-xs border-4 border-[#00FFFF] shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#00FFFF] hover:text-[#0D1117] transition-all duration-200">
            <Star className="w-4 h-4 mr-2" />
            REQUEST
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayersListPage;
