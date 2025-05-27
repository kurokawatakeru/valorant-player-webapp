import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Shield, // Team icon
  Globe,  // Region icon
  List,
  Grid3X3,
  Users,
  X
} from 'lucide-react';
import { getTeams, Team } from '../api/apiService'; // getTeams と Team 型をインポート
import { LoadingStates } from '../components/ui/LoadingSpinner'; // ローディングコンポーネント
import { Input } from '@/components/ui/input'; // Inputコンポーネント
import { Button } from '@/components/ui/button'; // Buttonコンポーネント
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Selectコンポーネント

// Team Card Skeleton Component
const TeamCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-32 bg-gray-200 flex items-center justify-center">
      <Shield className="w-16 h-16 text-gray-300" />
    </div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

// Team Card Component
interface TeamCardProps {
  team: Team;
  viewMode: 'grid' | 'list';
}

const TeamCard: React.FC<TeamCardProps> = ({ team, viewMode }) => {
  const [logoError, setLogoError] = useState(false);
  const placeholderLogo = "https://placehold.co/100x100/e2e8f0/94a3b8?text=Team";

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/teams/${team.id}`} // TODO: チーム詳細ページへのリンク (将来的に実装)
        className="group block"
      >
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 flex items-center space-x-4 sm:space-x-6 hover:bg-gray-50">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {team.logo && !logoError ? (
              <img 
                src={team.logo} 
                alt={`${team.name} logo`} 
                className="w-full h-full object-contain p-1" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1 sm:mb-2">
              <h3 className="text-md sm:text-lg font-semibold text-gray-900 group-hover:text-valorant-red transition-colors duration-200 truncate" title={team.name}>
                {team.name}
              </h3>
              {team.tag && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium hidden sm:inline-block">
                  {team.tag}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500">
              {team.region && (
                <div className="flex items-center">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>{team.region}</span>
                </div>
              )}
               {/* <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">選手数: N/A</span>  TODO: APIから選手数を取得できれば */}
            </div>
          </div>
          
          <div className="flex items-center text-gray-400 group-hover:text-valorant-red transition-colors duration-200 ml-auto">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link 
      to={`/teams/${team.id}`} // TODO: チーム詳細ページへのリンク (将来的に実装)
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 overflow-hidden">
          {team.logo && !logoError ? (
            <img 
              src={team.logo} 
              alt={`${team.name} logo`} 
              className="max-h-full max-w-full object-contain"
              onError={() => {setLogoError(true); console.warn(`Failed to load logo: ${team.logo}`)}}
            />
          ) : (
            <Shield className="w-16 h-16 text-gray-400" />
          )}
        </div>
        
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-valorant-red transition-colors duration-200 truncate" title={team.name}>
              {team.name}
            </h3>
            {team.tag && (
              <span className="bg-valorant-red text-white px-2 py-0.5 rounded-full text-xs font-semibold ml-2 flex-shrink-0">
                {team.tag}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-gray-400" />
            <span>{team.region || 'N/A'}</span>
          </div>

          <Button variant="outline" size="sm" className="w-full group-hover:bg-valorant-red group-hover:text-white transition-colors">
            チーム詳細を見る
            <Users className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

// Filter Component
interface FilterComponentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  regionFilter: string;
  setRegionFilter: (region: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  regions: string[];
  totalCount: number;
  filteredCount: number;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  searchTerm,
  setSearchTerm,
  regionFilter,
  setRegionFilter,
  sortBy,
  setSortBy,
  regions,
  totalCount,
  filteredCount
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="チーム名やタグで検索..."
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-valorant-red focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-all duration-200 h-7 w-7 sm:h-8 sm:w-8 ${
              showFilters ? 'text-valorant-red bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
          <span>
            {filteredCount}件 / 全{totalCount}チーム
          </span>
          {(searchTerm || regionFilter) && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setRegionFilter('');
              }}
              className="flex items-center text-valorant-red hover:text-red-600 font-medium p-0 h-auto"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              クリア
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label htmlFor="region-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                地域
              </label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger id="region-filter" className="w-full text-xs sm:text-sm">
                  <SelectValue placeholder="すべての地域" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべての地域</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="sort-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                並び替え
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-filter" className="w-full text-xs sm:text-sm">
                  <SelectValue placeholder="並び替え" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">名前順 (昇順)</SelectItem>
                  <SelectItem value="name_desc">名前順 (降順)</SelectItem>
                  <SelectItem value="region">地域順</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main TeamsListPage Component
const TeamsListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllTeams = async () => {
      setLoading(true);
      setError(null);
      const allTeams: Team[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const limit = 100; // APIの1リクエストあたりの最大取得数に合わせる

      try {
        while (hasMorePages) {
          const response = await getTeams(limit, currentPage);
          if (response && response.data) {
            allTeams.push(...response.data);
            hasMorePages = response.pagination.hasNextPage;
            currentPage++;
          } else {
            hasMorePages = false; // データがないか、レスポンス形式が不正
          }
          if (currentPage > 20) { // 無限ループ防止 (最大2000チーム程度)
             console.warn("Reached page limit while fetching teams.");
             hasMorePages = false;
          }
        }
        setTeams(allTeams);
        const regions = Array.from(new Set(allTeams.map(team => team.region).filter(Boolean))).sort();
        setUniqueRegions(regions);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('チームデータの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllTeams();
  }, []);

  const filteredAndSortedTeams = useMemo(() => {
    let result = [...teams];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(team => 
        team.name.toLowerCase().includes(searchLower) || 
        (team.tag && team.tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (regionFilter) {
      result = result.filter(team => team.region === regionFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'region':
          return (a.region || '').localeCompare(b.region || '') || a.name.localeCompare(b.name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return result;
  }, [teams, searchTerm, regionFilter, sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-valorant-red to-pink-500 bg-clip-text text-transparent mb-3 sm:mb-4">
            VALORANT チーム一覧
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">チーム情報を読み込んでいます...</p>
        </div>
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}`}>
          {Array.from({ length: viewMode === 'grid' ? 8 : 4 }).map((_, index) => (
            viewMode === 'grid' ? <TeamCardSkeleton key={index} /> : <LoadingStates.List items={1} key={index}/>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 sm:p-6 rounded-xl">
          <div className="flex items-center mb-2">
            <X className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-md sm:text-lg">エラーが発生しました</h3>
          </div>
          <p className="text-sm sm:text-base">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
          >
            再読み込み
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-valorant-red to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-4">
            VALORANT チーム一覧
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            世界のVALORANTチームを発見しよう
          </p>
        </div>
        
        <FilterComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          regions={uniqueRegions}
          totalCount={teams.length}
          filteredCount={filteredAndSortedTeams.length}
        />

        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-gray-600 font-medium text-sm sm:text-base">表示形式:</span>
            <div className="flex bg-white rounded-lg p-0.5 sm:p-1 shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-valorant-red text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-valorant-red text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {filteredAndSortedTeams.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6' 
              : 'space-y-3 sm:space-y-4'
          }`}>
            {filteredAndSortedTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                条件に一致するチームが見つかりませんでした
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                検索条件を変更するか、フィルターをリセットしてください。
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setRegionFilter('');
                }}
                variant="primary"
                size="sm"
                className="text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                フィルターをリセット
              </Button>
            </div>
          </div>
        )}

        {/* TODO: Pagination (将来的に実装) */}
      </div>
    </div>
  );
};

export default TeamsListPage;
