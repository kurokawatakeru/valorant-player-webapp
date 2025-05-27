import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Users,
  Globe,
  // CalendarDays, // ★ 未使用のため削除
  Trophy,
  ExternalLink,
  AlertTriangle,
  Link2, 
  Twitter 
} from 'lucide-react';
import { getTeamDetail, TeamDetail, MatchResult } from '../api/apiService'; 
import { LoadingStates } from '../components/ui/LoadingSpinner';
// import { Button } from '@/components/ui/button'; // ★ 未使用のため削除
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // ★ CardTitle を削除

// Team Detail Skeleton
const TeamDetailSkeleton: React.FC = () => (
  <LoadingStates.Page title="チームデータを読み込み中..." description="詳細情報を取得しています。少々お待ちください。" />
);

// Team Header Component
interface TeamHeaderProps {
  teamInfo: TeamDetail['info'];
}
const TeamHeader: React.FC<TeamHeaderProps> = ({ teamInfo }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl shadow-xl overflow-hidden mb-8">
      <div className="relative p-6 sm:p-8">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-hero-pattern-1 opacity-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center p-2 shadow-lg flex-shrink-0">
            {teamInfo.logo && !logoError ? (
              <img 
                src={teamInfo.logo} 
                alt={`${teamInfo.name} logo`} 
                className="max-h-full max-w-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              {teamInfo.name} {teamInfo.tag && `[${teamInfo.tag}]`}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-gray-300 text-sm sm:text-base mb-4">
              {/* ★ teamInfo.region は apiService.ts でオプショナルに変更済み */}
              {teamInfo.region && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1.5" />
                  <span>{teamInfo.region}</span>
                </div>
              )}
              {teamInfo.country && (
                <div className="flex items-center">
                  <img src={`https://flagcdn.com/w20/${teamInfo.country.toLowerCase()}.png`} alt={teamInfo.country} className="w-5 h-auto mr-1.5 rounded-sm"/>
                  <span>{teamInfo.country}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                {teamInfo.website && (
                    <a href={teamInfo.website} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Link2 className="w-3.5 h-3.5 mr-1.5"/> Webサイト
                    </a>
                )}
                {teamInfo.twitter && (
                     <a href={`https://twitter.com/${teamInfo.twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Twitter className="w-3.5 h-3.5 mr-1.5"/> Twitter
                    </a>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Roster Item Component
interface RosterItemProps {
  player: TeamDetail['roster'][0];
}
const RosterItem: React.FC<RosterItemProps> = ({ player }) => (
  <Link to={`/players/${player.id}`} className="block group">
    <Card className="hover:shadow-lg transition-shadow duration-200 hover:border-valorant-red">
      <CardContent className="p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 group-hover:text-valorant-red">{player.name}</p>
          {player.country && <p className="text-xs text-gray-500">{player.country}</p>}
        </div>
      </CardContent>
    </Card>
  </Link>
);

// Match History Item Component
interface MatchHistoryItemProps {
  matchResult: MatchResult;
  currentTeamName?: string; 
  currentTeamTag?: string; // ★ currentTeamTag を追加
}
const MatchHistoryItem: React.FC<MatchHistoryItemProps> = ({ matchResult, currentTeamName, currentTeamTag }) => {
  const { match, event, teams } = matchResult;
  const team1 = teams[0] || {};
  const team2 = teams[1] || {};

  let playerTeam = team1;
  let opponentTeam = team2;

  if (currentTeamName || currentTeamTag) {
    const isTeam2Current = 
        (currentTeamName && team2.name?.toLowerCase() === currentTeamName.toLowerCase()) ||
        (currentTeamTag && team2.tag?.toLowerCase() === currentTeamTag.toLowerCase());
    if (isTeam2Current) {
      playerTeam = team2;
      opponentTeam = team1;
    }
  }

  const playerScore = parseInt(playerTeam.points || '0');
  const opponentScore = parseInt(opponentTeam.points || '0');
  let resultStr: "W" | "L" | "D" = 'D';
  if (playerScore > opponentScore) resultStr = 'W';
  else if (playerScore < opponentScore) resultStr = 'L';

  const resultColor = resultStr === 'W' ? 'text-green-500' : resultStr === 'L' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
          {event.logo && <img src={event.logo} alt={event.name} className="w-4 h-4 sm:w-5 sm:h-5 object-contain"/>}
          <span className="font-medium text-gray-700 text-xs sm:text-sm truncate" title={event.name}>{event.name}</span>
        </div>
        <span className="text-xs text-gray-500">{match.date ? new Date(match.date).toLocaleDateString() : '日付不明'}</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-2">
              <span className={`font-bold text-md sm:text-lg ${resultColor}`}>{resultStr}</span>
              <span className="text-gray-800 text-sm sm:text-base">{playerTeam.name} ({playerScore})</span>
              <span className="text-gray-500 text-xs sm:text-sm">vs</span>
              <span className="text-gray-800 text-sm sm:text-base">{opponentTeam.name} ({opponentScore})</span>
          </div>
          {match.url && (
            <a 
                href={match.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-500 hover:underline mt-1 sm:mt-0 inline-flex items-center"
            >
                試合詳細 <ExternalLink className="inline w-3 h-3 ml-1"/>
            </a>
          )}
      </div>
    </div>
  );
};

const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teamDetail, setTeamDetail] = useState<TeamDetail | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamId) {
        setError('チームIDが指定されていません。');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await getTeamDetail(teamId);
        if (response && response.data) {
          setTeamDetail(response.data);
        } else {
          setError('チームデータの取得に失敗しました。');
        }
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('チームデータの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return <TeamDetailSkeleton />;
  }

  if (error || !teamDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">データ表示エラー</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              {error || 'チームデータが見つかりませんでした。'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                to="/teams" 
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                チーム一覧へ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const recentMatches = teamDetail.results?.slice(0, 10).sort((a,b) => {
    const dateA = a.match.date ? new Date(a.match.date).getTime() : 0;
    const dateB = b.match.date ? new Date(b.match.date).getTime() : 0;
    return dateB - dateA; 
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Link 
          to="/teams" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-6 sm:mb-8 group text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          チーム一覧に戻る
        </Link>
        
        <TeamHeader teamInfo={teamDetail.info} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <Card>
              {/* ★ CardHeader の title prop を使用 */}
              <CardHeader title="所属選手">
                <div className="flex items-center"> {/* アイコンとタイトルを横並びにするためのdiv */}
                    <Users className="w-5 h-5 mr-2 text-valorant-blue"/>
                    {/* CardHeaderのtitle propがh3タグを生成するため、ここではテキストを表示しない */}
                </div>
              </CardHeader>
              <CardContent>
                {teamDetail.roster && teamDetail.roster.length > 0 ? (
                  <div className="space-y-3">
                    {teamDetail.roster.map(player => (
                      <RosterItem key={player.id} player={player} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">所属選手の情報はありません。</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="最近の試合結果 (最大10件)">
                <div className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-valorant-gold"/>
                </div>
              </CardHeader>
              <CardContent>
                {recentMatches.length > 0 ? (
                  <div className="space-y-3">
                    {recentMatches.map(matchResult => (
                      <MatchHistoryItem 
                        key={matchResult.match.id} 
                        matchResult={matchResult} 
                        currentTeamName={teamDetail.info.name}
                        currentTeamTag={teamDetail.info.tag} // ★ currentTeamTag を渡す
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">最近の試合結果はありません。</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
