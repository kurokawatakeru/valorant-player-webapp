/**
 * VALORANT Player Analytics API連携サービス
 * vlr.orlandomm.net APIからデータを取得し、フロントエンド用に加工する
 */

import type {
  Player,
  PlayerDetail,
  Team,
  TeamDetail,
  PaginatedResponse,
  ApiResponse,
  PlayerGrowthStory,
  AgentStatSummary,
  MapStatSummary,
  CareerPhase,
  PastTeam,
} from '../types';

// 型を再エクスポート
export type {
  Player,
  PlayerDetail,
  PlayerMatchStats,
  MatchResult,
  PastTeam,
  PlayerOverallAgentStat,
  PlayerOverallMapStat,
  Team,
  TeamDetail,
  PaginatedResponse,
  ApiResponse,
  ProcessedMatch,
  PerformanceTrendPoint,
  AgentStatSummary,
  MapStatSummary,
  CareerPhase,
  PlayerGrowthStory,
} from '../types';

const API_BASE_URL = 'https://vlr.orlandomm.net/api/v1';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// カスタムエラークラス
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 遅延関数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFromApi<T>(
  endpoint: string,
  params?: Record<string, string | number>,
  retries: number = MAX_RETRIES
): Promise<T> {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        console.error(
          `API error: ${response.status} ${response.statusText} for URL: ${url.toString()}`
        );
        if (errorBody) console.error('Error body:', errorBody);

        // 4xx エラーはリトライしない
        if (response.status >= 400 && response.status < 500) {
          throw new ApiError(
            `API error: ${response.status} ${response.statusText}`,
            response.status
          );
        }

        // 5xx エラーはリトライ
        throw new ApiError(
          `Server error: ${response.status}`,
          response.status
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error as Error;

      // ApiErrorで4xxの場合はリトライしない
      if (error instanceof ApiError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      // ネットワークエラーの場合
      if (error instanceof TypeError && error.message.includes('fetch')) {
        lastError = new ApiError('ネットワーク接続エラー', undefined, true);
      }

      // 最後の試行でなければリトライ
      if (attempt < retries) {
        console.warn(`API request failed, retrying (${attempt + 1}/${retries})...`);
        await delay(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  console.error(`Error fetching from API (${endpoint}) after ${retries} retries:`, lastError);
  throw lastError;
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

export async function getAllPlayers(limit: number = 100, country?: string): Promise<Player[]> {
  const players: Player[] = [];
  let page = 1;
  let hasNextPage = true;
  try {
    while (hasNextPage) {
      const response = await getPlayers(limit, page, country);
      if (response && response.data) {
        players.push(...response.data);
        hasNextPage = response.pagination.hasNextPage;
        if (hasNextPage) page++;
      } else {
        hasNextPage = false;
      }
    }
  } catch (error) {
    console.error('Failed to fetch players:', error);
  }
  return players;
}

export async function getPlayerDetail(
  playerId: string
): Promise<ApiResponse<PlayerDetail>> {
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

export async function getTeamDetail(
  teamId: string
): Promise<ApiResponse<TeamDetail>> {
  return fetchFromApi<ApiResponse<TeamDetail>>(`teams/${teamId}`);
}

export async function generatePlayerGrowthStory(
  playerId: string
): Promise<PlayerGrowthStory | null> {
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
        team_tag: playerData.team?.tag,
        country: playerData.info.country,
        image_url: playerData.info.img,
        url: playerData.info.url,
        social_links: {
          twitter: playerData.socials?.twitter || '',
          twitch: playerData.socials?.twitch || '',
        },
        last_updated: new Date().toISOString(),
      },
      processed_matches: [],
      performance_trends: [],
      agent_stats: [],
      map_stats: [],
      career_phases: [],
    };

    if (playerData.results && playerData.results.length > 0) {
      const validMatches = playerData.results.filter(
        (result) => result.match?.date && result.player_stats
      );

      growthStory.processed_matches = validMatches
        .map((result) => {
          const match = result.match;
          const event = result.event;
          const teams = result.teams;
          const team1 = teams[0] || {};
          const team2 = teams[1] || {};

          let playerTeamDetails = team1;
          let opponentTeamDetails = team2;

          if (
            playerData.team &&
            (team2.name?.toLowerCase() === playerData.team.name?.toLowerCase() ||
              (playerData.team.tag &&
                team2.tag?.toLowerCase() === playerData.team.tag?.toLowerCase()))
          ) {
            playerTeamDetails = team2;
            opponentTeamDetails = team1;
          }

          const playerScore = parseInt(playerTeamDetails.points || '0');
          const opponentScore = parseInt(opponentTeamDetails.points || '0');
          let resultStr: 'W' | 'L' | 'D' = 'D';
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

          const mapInfo =
            result.maps_played && result.maps_played.length > 0
              ? result.maps_played[0]
              : undefined;

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
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      growthStory.performance_trends.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    const agentSummary: { [key: string]: AgentStatSummary } = {};
    growthStory.processed_matches.forEach((match) => {
      if (match.agent_played && match.player_match_stats) {
        const agent = match.agent_played;
        if (!agentSummary[agent]) {
          agentSummary[agent] = {
            agent_name: agent,
            matches_played: 0,
            wins: 0,
            losses: 0,
            acs_sum: 0,
            kd_ratio_sum: 0,
            win_rate: 0,
          };
        }
        agentSummary[agent].matches_played++;
        if (match.result === 'W') agentSummary[agent].wins++;
        if (match.result === 'L') agentSummary[agent].losses++;
        agentSummary[agent].acs_sum += match.player_match_stats.acs || 0;
        agentSummary[agent].kd_ratio_sum += match.player_match_stats.kd_ratio || 0;
      }
    });
    growthStory.agent_stats = Object.values(agentSummary)
      .map((stat) => ({
        ...stat,
        win_rate: stat.matches_played > 0 ? stat.wins / stat.matches_played : 0,
        acs_avg:
          stat.matches_played > 0
            ? parseFloat((stat.acs_sum / stat.matches_played).toFixed(1))
            : 0,
        kd_ratio_avg:
          stat.matches_played > 0
            ? parseFloat((stat.kd_ratio_sum / stat.matches_played).toFixed(2))
            : 0,
      }))
      .sort((a, b) => b.matches_played - a.matches_played);

    const mapSummary: { [key: string]: MapStatSummary } = {};
    growthStory.processed_matches.forEach((match) => {
      if (match.map_played) {
        const map = match.map_played;
        if (!mapSummary[map]) {
          mapSummary[map] = {
            map_name: map,
            matches_played: 0,
            wins: 0,
            losses: 0,
            win_rate: 0,
          };
        }
        mapSummary[map].matches_played++;
        if (match.result === 'W') mapSummary[map].wins++;
        if (match.result === 'L') mapSummary[map].losses++;
      }
    });
    growthStory.map_stats = Object.values(mapSummary)
      .map((stat) => ({
        ...stat,
        win_rate: stat.matches_played > 0 ? stat.wins / stat.matches_played : 0,
      }))
      .sort((a, b) => b.matches_played - a.matches_played);

    const phases: CareerPhase[] = [];
    const allTeamsHistory: PastTeam[] = [...(playerData.pastTeams || [])];
    if (playerData.team?.name && playerData.team?.joined) {
      allTeamsHistory.push({
        id: playerData.team.id,
        name: playerData.team.name,
        logo: playerData.team.logo,
        joined: playerData.team.joined,
        left: 'Present',
        tag: playerData.team.tag,
      });
    }
    allTeamsHistory.sort(
      (a, b) => new Date(a.joined).getTime() - new Date(b.joined).getTime()
    );

    allTeamsHistory.forEach((teamHistory, index) => {
      const startDate = teamHistory.joined;
      const endDate =
        teamHistory.left === 'Present'
          ? '現在'
          : teamHistory.left ||
            (allTeamsHistory[index + 1]?.joined
              ? new Date(
                  new Date(allTeamsHistory[index + 1].joined).getTime() - 86400000
                )
                  .toISOString()
                  .split('T')[0]
              : '不明');

      const phaseMatches = growthStory.processed_matches.filter((match) => {
        const matchDate = new Date(match.date);
        const phaseStartDate = new Date(startDate);
        const phaseEndDate =
          endDate === '現在' || endDate === '不明' ? new Date() : new Date(endDate);
        if (isNaN(phaseStartDate.getTime()) || isNaN(phaseEndDate.getTime()))
          return false;
        return matchDate >= phaseStartDate && matchDate <= phaseEndDate;
      });

      let average_acs, average_kd_ratio, win_rate_str;
      const titles_won_this_phase = 0;

      if (phaseMatches.length > 0) {
        const totalAcs = phaseMatches.reduce(
          (sum, m) => sum + (m.player_match_stats?.acs || 0),
          0
        );
        average_acs = parseFloat((totalAcs / phaseMatches.length).toFixed(1));

        const totalKd = phaseMatches.reduce(
          (sum, m) => sum + (m.player_match_stats?.kd_ratio || 0),
          0
        );
        average_kd_ratio = parseFloat((totalKd / phaseMatches.length).toFixed(2));

        const wins = phaseMatches.filter((m) => m.result === 'W').length;
        win_rate_str = `${((wins / phaseMatches.length) * 100).toFixed(0)}%`;
      }

      phases.push({
        phase_name: `${teamHistory.name}${teamHistory.tag ? ` [${teamHistory.tag}]` : ''}時代`,
        start_date: startDate,
        end_date: endDate,
        team_name: teamHistory.name,
        team_tag: teamHistory.tag,
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

    return growthStory;
  } catch (error) {
    console.error(`Failed to generate player growth story for ${playerId}:`, error);
    return null;
  }
}
