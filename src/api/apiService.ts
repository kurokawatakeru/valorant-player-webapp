/**
 * VALORANTプレイヤー成長ストーリーサイト API連携サービス
 * vlr.orlandomm.net APIからデータを取得し、フロントエンド用に加工する
 */

// APIレスポンスの型定義
export interface Player {
  id: string;
  url: string;
  name: string;
  teamTag: string;
  country: string;
}

export interface PlayerMatchStats {
  acs?: number;
  kills?: number;
  deaths?: number;
  assists?: number;
  kd_ratio?: number;
  adr?: number;
  hs_percentage?: number;
  first_kills?: number;
  first_deaths?: number;
}

export interface MatchResult {
  match: {
    id: string;
    url: string;
    date?: string; 
  };
  event: {
    name: string;
    logo: string;
  };
  teams: {
    name: string;
    tag: string;
    logo: string;
    points: string;
  }[];
  player_stats?: PlayerMatchStats;
  maps_played?: { map_name: string; player_agent?: string; team1_score?: number; team2_score?: number }[];
}

export interface PastTeam {
  id: string;
  name: string;
  logo: string;
  joined: string; 
  left: string;   
}

export interface PlayerOverallAgentStat { // ★ exportされていることを確認
  agent_name: string;
  play_rate?: number;
  matches_played?: number;
  win_rate?: number;
  acs?: number;
  kd_ratio?: number;
}

export interface PlayerOverallMapStat { // ★ exportされていることを確認
  map_name: string;
  matches_played?: number;
  win_rate?: number;
  attack_win_rate?: number;
  defense_win_rate?: number;
}


export interface PlayerDetail {
  info: {
    id: string;
    url: string;
    img: string;
    user: string; 
    name: string; 
    country: string;
    flag: string;
  };
  team: { 
    id: string;
    url: string;
    name: string;
    logo: string;
    tag?: string; // Added 'tag' property as optional
    joined: string; 
  };
  results: MatchResult[]; 
  pastTeams: PastTeam[];  
  socials: {
    twitter: string;
    twitter_url: string;
    twitch: string;
  };
  overall_agent_stats?: PlayerOverallAgentStat[]; // APIから直接取得できる場合は使用
  overall_map_stats?: PlayerOverallMapStat[];   // APIから直接取得できる場合は使用
}

export interface Team {
  id: string;
  url: string;
  name: string;
  logo: string;
  tag: string;
  region: string;
}

export interface TeamDetail {
  info: {
    id: string;
    url: string;
    name: string;
    tag: string;
    logo: string;
    website: string;
    twitter: string;
    country: string;
  };
  roster: {
    id: string;
    url: string;
    name: string;
    country: string;
  }[];
  results: MatchResult[];
}

export interface PaginatedResponse<T> {
  status: string;
  size: number;
  pagination: {
    page: number;
    limit: string;
    totalElements: number;
    totalPages: number;
    hasNextPage: boolean;
  };
  data: T[];
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

// 成長ストーリー分析用の型定義
export interface ProcessedMatch {
  match_id: string;
  date: string; 
  event: string;
  event_logo: string;
  opponent: string;
  opponent_tag: string;
  opponent_logo: string;
  result: "W" | "L" | "D";
  score: string; 
  match_url: string;
  player_match_stats?: PlayerMatchStats;
  map_played?: string; 
  agent_played?: string; 
}

export interface PerformanceTrendPoint {
  date: string; 
  acs?: number;
  kd_ratio?: number;
  hs_percentage?: number;
}

export interface AgentStatSummary { // ★ exportされていることを確認
  agent_name: string;
  matches_played: number;
  win_rate: number; 
  wins: number;
  losses: number;
  acs_sum: number;
  acs_avg?: number;
  kd_ratio_sum: number;
  kd_ratio_avg?: number;
}

export interface MapStatSummary { // ★ exportされていることを確認
  map_name: string;
  matches_played: number;
  win_rate: number; 
  wins: number;
  losses: number;
}

export interface CareerPhase { // ★ exportされていることを確認
  phase_name: string; 
  start_date: string; 
  end_date: string;   
  team_name?: string;
  description: string;
  key_stats: { 
    matches_played?: number;
    win_rate?: string; 
    average_acs?: number;
    average_kd_ratio?: number;
    titles_won?: number; // ★ titles_won を追加 (オプショナル)
  };
  key_matches_ids?: string[]; 
}

export interface PlayerGrowthStory {
  info: {
    player_id: string;
    name: string;
    full_name: string;
    team: string;
    team_id: string;
    country: string;
    image_url: string;
    url: string;
    social_links: {
      twitter: string;
      twitch: string;
    };
    last_updated: string; 
  };
  processed_matches: ProcessedMatch[]; 
  performance_trends: PerformanceTrendPoint[]; 
  agent_stats: AgentStatSummary[]; 
  map_stats: MapStatSummary[];     
  career_phases: CareerPhase[];    
}

const API_BASE_URL = 'https://vlr.orlandomm.net/api/v1';

async function fetchFromApi<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for URL: ${url.toString()}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching from API (${endpoint}):`, error);
    throw error;
  }
}

export async function getPlayers(
  limit: number = 100,
  page: number = 1,
  country?: string
): Promise<PaginatedResponse<Player>> {
  const params: Record<string, string | number> = { limit, page };
  if (country) params.country = country;
  return fetchFromApi<PaginatedResponse<Player>>('players', params);
}

export async function getJapanesePlayers(limit: number = 100): Promise<Player[]> {
  const players: Player[] = [];
  let page = 1;
  let hasNextPage = true;
  try {
    while (hasNextPage) {
      const response = await getPlayers(limit, page, 'jp');
      if (response && response.data) {
        players.push(...response.data);
        hasNextPage = response.pagination.hasNextPage;
        if (hasNextPage) page++;
      } else {
        hasNextPage = false;
      }
    }
  } catch (error) {
    console.error("Failed to fetch all Japanese players:", error);
  }
  return players;
}

export async function getPlayerDetail(playerId: string): Promise<ApiResponse<PlayerDetail>> {
  return fetchFromApi<ApiResponse<PlayerDetail>>(`players/${playerId}`);
}

export async function getTeams(
  limit: number = 100,
  page: number = 1,
  region?: string
): Promise<PaginatedResponse<Team>> {
  const params: Record<string, string | number> = { limit, page };
  if (region) params.region = region;
  return fetchFromApi<PaginatedResponse<Team>>('teams', params);
}

export async function getTeamDetail(teamId: string): Promise<ApiResponse<TeamDetail>> {
  return fetchFromApi<ApiResponse<TeamDetail>>(`teams/${teamId}`);
}

export async function generatePlayerGrowthStory(playerId: string): Promise<PlayerGrowthStory | null> {
  try {
    const playerResponse = await getPlayerDetail(playerId);
    if (!playerResponse || !playerResponse.data) {
      console.error(`Player data not found for ID: ${playerId}`);
      return null;
    }
    const playerData = playerResponse.data;

    const growthStory: PlayerGrowthStory = {
      info: {
        player_id: playerId,
        name: playerData.info.user,
        full_name: playerData.info.name,
        team: playerData.team?.name || 'N/A',
        team_id: playerData.team?.id || 'N/A',
        country: playerData.info.country,
        image_url: playerData.info.img,
        url: playerData.info.url,
        social_links: {
          twitter: playerData.socials?.twitter || '',
          twitch: playerData.socials?.twitch || ''
        },
        last_updated: new Date().toISOString()
      },
      processed_matches: [],
      performance_trends: [],
      agent_stats: [],
      map_stats: [],
      career_phases: [],
    };

    if (playerData.results && playerData.results.length > 0) {
      const validMatches = playerData.results.filter(result => result.match?.date && result.player_stats);

      growthStory.processed_matches = validMatches.map(result => {
        const match = result.match;
        const event = result.event;
        const teams = result.teams;
        const team1 = teams[0] || {};
        const team2 = teams[1] || {};
        
        const playerTeamName = playerData.team?.name?.toLowerCase();
        const playerTeamTag = playerData.team?.tag?.toLowerCase();

        let playerTeamDetails = team1;
        let opponentTeamDetails = team2;

        if (team2.name?.toLowerCase() === playerTeamName || team2.tag?.toLowerCase() === playerTeamTag) {
            playerTeamDetails = team2;
            opponentTeamDetails = team1;
        }
        
        const playerScore = parseInt(playerTeamDetails.points || '0');
        const opponentScore = parseInt(opponentTeamDetails.points || '0');
        let resultStr: "W" | "L" | "D" = 'D';
        if (playerScore > opponentScore) resultStr = 'W';
        else if (playerScore < opponentScore) resultStr = 'L';

        if (match.date && result.player_stats) {
         growthStory.performance_trends.push({
            date: match.date, 
            acs: result.player_stats.acs,
            kd_ratio: result.player_stats.kd_ratio,
            hs_percentage: result.player_stats.hs_percentage,
          });
        }
        
        const mapInfo = result.maps_played && result.maps_played.length > 0 ? result.maps_played[0] : undefined;

        return {
          match_id: match.id,
          date: match.date!,
          event: event.name,
          event_logo: event.logo,
          opponent: opponentTeamDetails.name || 'N/A',
          opponent_tag: opponentTeamDetails.tag || 'N/A',
          opponent_logo: opponentTeamDetails.logo || '',
          result: resultStr,
          score: `${playerScore}-${opponentScore}`,
          match_url: match.url,
          player_match_stats: result.player_stats,
          map_played: mapInfo?.map_name,
          agent_played: mapInfo?.player_agent,
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); 

      growthStory.performance_trends.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    const agentSummary: { [key: string]: AgentStatSummary } = {};
    growthStory.processed_matches.forEach(match => {
      if (match.agent_played && match.player_match_stats) {
        const agent = match.agent_played;
        if (!agentSummary[agent]) {
          agentSummary[agent] = { agent_name: agent, matches_played: 0, wins: 0, losses: 0, acs_sum: 0, kd_ratio_sum: 0, win_rate: 0 };
        }
        agentSummary[agent].matches_played++;
        if (match.result === 'W') agentSummary[agent].wins++;
        if (match.result === 'L') agentSummary[agent].losses++;
        agentSummary[agent].acs_sum += match.player_match_stats.acs || 0;
        agentSummary[agent].kd_ratio_sum += match.player_match_stats.kd_ratio || 0;
      }
    });
    growthStory.agent_stats = Object.values(agentSummary).map(stat => ({
      ...stat,
      win_rate: stat.matches_played > 0 ? stat.wins / stat.matches_played : 0,
      acs_avg: stat.matches_played > 0 ? parseFloat((stat.acs_sum / stat.matches_played).toFixed(1)) : 0,
      kd_ratio_avg: stat.matches_played > 0 ? parseFloat((stat.kd_ratio_sum / stat.matches_played).toFixed(2)) : 0,
    })).sort((a,b) => b.matches_played - a.matches_played);

    const mapSummary: { [key: string]: MapStatSummary } = {};
    growthStory.processed_matches.forEach(match => {
      if (match.map_played) {
        const map = match.map_played;
        if (!mapSummary[map]) {
          mapSummary[map] = { map_name: map, matches_played: 0, wins: 0, losses: 0, win_rate: 0 };
        }
        mapSummary[map].matches_played++;
        if (match.result === 'W') mapSummary[map].wins++;
        if (match.result === 'L') mapSummary[map].losses++;
      }
    });
    growthStory.map_stats = Object.values(mapSummary).map(stat => ({
      ...stat,
      win_rate: stat.matches_played > 0 ? stat.wins / stat.matches_played : 0,
    })).sort((a,b) => b.matches_played - a.matches_played);

    const phases: CareerPhase[] = [];
    const allTeamsHistory = [...(playerData.pastTeams || [])];
    if (playerData.team?.name && playerData.team?.joined) { 
        allTeamsHistory.push({
            id: playerData.team.id,
            name: playerData.team.name,
            logo: playerData.team.logo,
            joined: playerData.team.joined,
            left: 'Present' 
        });
    }
    allTeamsHistory.sort((a, b) => new Date(a.joined).getTime() - new Date(b.joined).getTime());

    allTeamsHistory.forEach((teamHistory, index) => {
        const startDate = teamHistory.joined;
        const endDate = teamHistory.left === 'Present' ? '現在' : (teamHistory.left || (allTeamsHistory[index+1]?.joined ? new Date(new Date(allTeamsHistory[index+1].joined).getTime() - 86400000).toISOString().split('T')[0] : '不明'));

        const phaseMatches = growthStory.processed_matches.filter(match => {
            const matchDate = new Date(match.date);
            const phaseStartDate = new Date(startDate);
            const phaseEndDate = endDate === '現在' || endDate === '不明' ? new Date() : new Date(endDate);
            // Ensure dates are valid before comparison
            if (isNaN(phaseStartDate.getTime()) || isNaN(phaseEndDate.getTime())) return false;
            return matchDate >= phaseStartDate && matchDate <= phaseEndDate;
        });

        let average_acs, average_kd_ratio, win_rate_str;
        let titles_won_this_phase = 0; // このフェーズでのタイトル獲得数を初期化

        if (phaseMatches.length > 0) {
            const totalAcs = phaseMatches.reduce((sum, m) => sum + (m.player_match_stats?.acs || 0), 0);
            average_acs = parseFloat((totalAcs / phaseMatches.length).toFixed(1));
            
            const totalKd = phaseMatches.reduce((sum, m) => sum + (m.player_match_stats?.kd_ratio || 0), 0);
            average_kd_ratio = parseFloat((totalKd / phaseMatches.length).toFixed(2));

            const wins = phaseMatches.filter(m => m.result === 'W').length;
            win_rate_str = `${((wins / phaseMatches.length) * 100).toFixed(0)}%`;
            // ここでAPIレスポンスや別途定義されたロジックに基づき titles_won_this_phase を計算する
            // 例: 特定のイベント名や大会レベルでフィルタリングするなど (今回はAPIに情報がないため0のまま)
        }

        phases.push({
            phase_name: `${teamHistory.name}時代`,
            start_date: startDate,
            end_date: endDate,
            team_name: teamHistory.name,
            description: `${teamHistory.name}に在籍していた期間。`,
            key_stats: {
                matches_played: phaseMatches.length,
                win_rate: win_rate_str,
                average_acs: average_acs,
                average_kd_ratio: average_kd_ratio,
                titles_won: titles_won_this_phase, 
            },
        });
    });
    growthStory.career_phases = phases;
    
    if (growthStory.career_phases.length === 0) {
        growthStory.career_phases = [
            { phase_name: '初期キャリア (サンプル)', start_date: '2020-01-01', end_date: '2021-12-31', team_name: 'サンプルチームA', description: 'プロとしてのキャリアを開始した時期のサンプルデータです。', key_stats: { average_acs: 210, average_kd_ratio: 1.05, win_rate: "50%", titles_won: 0 } },
            { phase_name: '成長期 (サンプル)', start_date: '2022-01-01', end_date: '現在', team_name: 'サンプルチームB',description: 'チームの中心選手として活躍し始めた時期のサンプルデータです。', key_stats: { average_acs: 245, average_kd_ratio: 1.18, win_rate: "60%", titles_won: 1 } },
        ];
    }
    return growthStory;

  } catch (error) {
    console.error(`Failed to generate player growth story for ${playerId}:`, error);
    return null;
  }
}
