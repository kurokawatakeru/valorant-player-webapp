/**
 * VALORANTプレイヤー成長ストーリーサイト 型定義
 */

// === API レスポンス型 ===

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
  maps_played?: {
    map_name: string;
    player_agent?: string;
    team1_score?: number;
    team2_score?: number;
  }[];
}

export interface PastTeam {
  id: string;
  name: string;
  logo: string;
  joined: string;
  left: string;
  tag?: string;
}

export interface PlayerOverallAgentStat {
  agent_name: string;
  play_rate?: number;
  matches_played?: number;
  win_rate?: number;
  acs?: number;
  kd_ratio?: number;
}

export interface PlayerOverallMapStat {
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
    joined: string;
    tag?: string;
  };
  results: MatchResult[];
  pastTeams: PastTeam[];
  socials: {
    twitter: string;
    twitter_url: string;
    twitch: string;
  };
  overall_agent_stats?: PlayerOverallAgentStat[];
  overall_map_stats?: PlayerOverallMapStat[];
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
    region?: string;
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

// === 加工済みデータ型 ===

export interface ProcessedMatch {
  match_id: string;
  date: string;
  event: string;
  event_logo: string;
  opponent: string;
  opponent_tag: string;
  opponent_logo: string;
  result: 'W' | 'L' | 'D';
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

export interface AgentStatSummary {
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

export interface MapStatSummary {
  map_name: string;
  matches_played: number;
  win_rate: number;
  wins: number;
  losses: number;
}

export interface CareerPhase {
  phase_name: string;
  start_date: string;
  end_date: string;
  team_name?: string;
  team_tag?: string;
  description: string;
  key_stats: {
    matches_played?: number;
    win_rate?: string;
    average_acs?: number;
    average_kd_ratio?: number;
    titles_won?: number;
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
    team_tag?: string;
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
