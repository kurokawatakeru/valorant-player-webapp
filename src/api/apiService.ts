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
  };
  results: MatchResult[];
  pastTeams: PastTeam[];
  socials: {
    twitter: string;
    twitter_url: string;
    twitch: string;
  };
}

export interface MatchResult {
  match: {
    id: string;
    url: string;
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
}

export interface PastTeam {
  id: string;
  name: string;
  logo: string;
  joined: string;
  left: string;
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
  matches: {
    match_id: string;
    date: string;
    event: string;
    event_logo: string;
    opponent: string;
    opponent_tag: string;
    opponent_logo: string;
    result: string;
    score: string;
    match_url: string;
    stats: Record<string, any>;
  }[];
  career_phases?: {
    phase_name: string;
    start_date: string;
    end_date: string;
    description: string;
    key_stats: Record<string, number>;
    key_matches: string[];
  }[];
  performance_trends?: {
    date: string;
    acs?: number;
    kd_ratio?: number;
    win_rate?: number;
    headshot_percentage?: number;
    first_bloods?: number;
  }[];
  agent_stats?: {
    agent_name: string;
    usage_percentage: number;
    win_rate: number;
    acs: number;
    kd_ratio: number;
    matches_played: number;
  }[];
  map_stats?: {
    map_name: string;
    matches_played: number;
    win_rate: number;
    acs: number;
    kd_ratio: number;
  }[];
}

// API基本URL
const API_BASE_URL = 'https://vlr.orlandomm.net/api/v1';

/**
 * APIからデータを取得する基本関数
 */
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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching from API (${endpoint}):`, error);
    throw error;
  }
}

/**
 * プレイヤー一覧を取得
 */
export async function getPlayers(
  limit: number = 100, 
  page: number = 1, 
  country?: string
): Promise<PaginatedResponse<Player>> {
  const params: Record<string, string | number> = { limit, page };
  if (country) params.country = country;
  
  return fetchFromApi<PaginatedResponse<Player>>('players', params);
}

/**
 * 日本人プレイヤー一覧を取得
 */
export async function getJapanesePlayers(limit: number = 100): Promise<Player[]> {
  const players: Player[] = [];
  let page = 1;
  let hasNextPage = true;
  
  while (hasNextPage) {
    const response = await getPlayers(limit, page, 'jp');
    players.push(...response.data);
    
    hasNextPage = response.pagination.hasNextPage;
    if (hasNextPage) page++;
  }
  
  return players;
}

/**
 * プレイヤー詳細を取得
 */
export async function getPlayerDetail(playerId: string): Promise<ApiResponse<PlayerDetail>> {
  return fetchFromApi<ApiResponse<PlayerDetail>>(`players/${playerId}`);
}

/**
 * チーム一覧を取得
 */
export async function getTeams(
  limit: number = 100, 
  page: number = 1, 
  region?: string
): Promise<PaginatedResponse<Team>> {
  const params: Record<string, string | number> = { limit, page };
  if (region) params.region = region;
  
  return fetchFromApi<PaginatedResponse<Team>>('teams', params);
}

/**
 * チーム詳細を取得
 */
export async function getTeamDetail(teamId: string): Promise<ApiResponse<TeamDetail>> {
  return fetchFromApi<ApiResponse<TeamDetail>>(`teams/${teamId}`);
}

/**
 * プレイヤーの成長ストーリーデータを生成
 */
export async function generatePlayerGrowthStory(playerId: string): Promise<PlayerGrowthStory> {
  // プレイヤー詳細を取得
  const playerResponse = await getPlayerDetail(playerId);
  const playerData = playerResponse.data;
  
  // 基本情報の整理
  const growthStory: PlayerGrowthStory = {
    info: {
      player_id: playerId,
      name: playerData.info.user,
      full_name: playerData.info.name,
      team: playerData.team?.name || '',
      team_id: playerData.team?.id || '',
      country: playerData.info.country,
      image_url: playerData.info.img,
      url: playerData.info.url,
      social_links: {
        twitter: playerData.socials?.twitter || '',
        twitch: playerData.socials?.twitch || ''
      },
      last_updated: new Date().toISOString()
    },
    matches: []
  };
  
  // 試合データの処理
  growthStory.matches = playerData.results.map(result => {
    const match = result.match;
    const event = result.event;
    const teams = result.teams;
    
    // チーム情報の処理
    const team1 = teams[0] || {};
    const team2 = teams[1] || {};
    
    // プレイヤーのチームとスコアを特定
    const playerTeamName = playerData.team?.name || '';
    const playerTeam = team1.name === playerTeamName ? team1 : team2;
    const opponentTeam = team1.name === playerTeamName ? team2 : team1;
    
    // 勝敗判定
    const playerScore = parseInt(playerTeam.points || '0');
    const opponentScore = parseInt(opponentTeam.points || '0');
    const resultStr = playerScore > opponentScore ? 'W' : playerScore < opponentScore ? 'L' : 'D';
    
    return {
      match_id: match.id,
      date: '', // APIからは日付が取得できないため空欄
      event: event.name,
      event_logo: event.logo,
      opponent: opponentTeam.name,
      opponent_tag: opponentTeam.tag,
      opponent_logo: opponentTeam.logo,
      result: resultStr,
      score: `${playerScore}:${opponentScore}`,
      match_url: match.url,
      stats: {} // APIからは詳細な統計が取得できないため空欄
    };
  });
  
  // 成長ストーリー分析（実際のデータが不足しているため、サンプルデータを生成）
  // 実際の実装では、試合データから時系列分析を行い、キャリアフェーズや傾向を検出する
  
  // サンプルのキャリアフェーズ
  growthStory.career_phases = [
    {
      phase_name: '初期キャリア',
      start_date: '2020-06-01',
      end_date: '2021-03-31',
      description: 'VALORANTプロシーンでのキャリア開始期。基本的なスキルと戦術を習得する時期。',
      key_stats: {
        average_acs: 210,
        average_kd: 1.05,
        win_rate: 0.48
      },
      key_matches: []
    },
    {
      phase_name: '成長期',
      start_date: '2021-04-01',
      end_date: '2022-06-30',
      description: 'チームでの役割を確立し、パフォーマンスが安定してきた時期。国内大会での活躍が目立つ。',
      key_stats: {
        average_acs: 235,
        average_kd: 1.15,
        win_rate: 0.55
      },
      key_matches: []
    },
    {
      phase_name: '黄金期',
      start_date: '2022-07-01',
      end_date: '2023-12-31',
      description: '国際大会での活躍が増え、最高のパフォーマンスを発揮した時期。チームの中核として活躍。',
      key_stats: {
        average_acs: 255,
        average_kd: 1.25,
        win_rate: 0.62
      },
      key_matches: []
    },
    {
      phase_name: '現在',
      start_date: '2024-01-01',
      end_date: '2025-05-22',
      description: '新たなチーム編成や役割の変化に適応しながら、経験を活かした安定したプレイを見せている。',
      key_stats: {
        average_acs: 245,
        average_kd: 1.18,
        win_rate: 0.58
      },
      key_matches: []
    }
  ];
  
  // サンプルのパフォーマンス推移
  growthStory.performance_trends = [];
  const startDate = new Date('2020-06-01');
  const endDate = new Date();
  const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
  
  for (let i = 0; i <= monthDiff; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + i);
    
    // 時期によって異なる成長曲線を模擬
    let baseAcs = 200;
    let baseKd = 1.0;
    let baseWinRate = 0.45;
    
    if (i > 10) { // 成長期
      baseAcs = 220 + (i - 10) * 1.5;
      baseKd = 1.05 + (i - 10) * 0.01;
      baseWinRate = 0.5 + (i - 10) * 0.005;
    }
    
    if (i > 24) { // 黄金期
      baseAcs = 240 + (i - 24) * 0.8;
      baseKd = 1.2 + (i - 24) * 0.005;
      baseWinRate = 0.58 + (i - 24) * 0.002;
    }
    
    if (i > 42) { // 現在
      baseAcs = 255 - (i - 42) * 0.3;
      baseKd = 1.25 - (i - 42) * 0.002;
      baseWinRate = 0.62 - (i - 42) * 0.001;
    }
    
    // ランダム変動を加える
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    growthStory.performance_trends.push({
      date: currentDate.toISOString().split('T')[0],
      acs: Math.round(baseAcs * randomFactor),
      kd_ratio: parseFloat((baseKd * randomFactor).toFixed(2)),
      win_rate: parseFloat((baseWinRate * randomFactor).toFixed(2)),
      headshot_percentage: parseFloat((0.2 + Math.random() * 0.1).toFixed(2)),
      first_bloods: Math.round(2 + Math.random() * 2)
    });
  }
  
  // サンプルのエージェント統計
  growthStory.agent_stats = [
    {
      agent_name: 'Jett',
      usage_percentage: 0.35,
      win_rate: 0.65,
      acs: 260,
      kd_ratio: 1.35,
      matches_played: 120
    },
    {
      agent_name: 'Raze',
      usage_percentage: 0.25,
      win_rate: 0.58,
      acs: 245,
      kd_ratio: 1.25,
      matches_played: 85
    },
    {
      agent_name: 'Reyna',
      usage_percentage: 0.15,
      win_rate: 0.62,
      acs: 255,
      kd_ratio: 1.3,
      matches_played: 50
    },
    {
      agent_name: 'Phoenix',
      usage_percentage: 0.1,
      win_rate: 0.52,
      acs: 230,
      kd_ratio: 1.15,
      matches_played: 35
    },
    {
      agent_name: 'Sage',
      usage_percentage: 0.08,
      win_rate: 0.55,
      acs: 210,
      kd_ratio: 1.05,
      matches_played: 28
    },
    {
      agent_name: 'その他',
      usage_percentage: 0.07,
      win_rate: 0.5,
      acs: 215,
      kd_ratio: 1.1,
      matches_played: 22
    }
  ];
  
  // サンプルのマップ統計
  growthStory.map_stats = [
    {
      map_name: 'Ascent',
      matches_played: 65,
      win_rate: 0.68,
      acs: 255,
      kd_ratio: 1.3
    },
    {
      map_name: 'Bind',
      matches_played: 58,
      win_rate: 0.62,
      acs: 245,
      kd_ratio: 1.25
    },
    {
      map_name: 'Haven',
      matches_played: 70,
      win_rate: 0.57,
      acs: 240,
      kd_ratio: 1.2
    },
    {
      map_name: 'Split',
      matches_played: 55,
      win_rate: 0.6,
      acs: 250,
      kd_ratio: 1.28
    },
    {
      map_name: 'Icebox',
      matches_played: 48,
      win_rate: 0.52,
      acs: 235,
      kd_ratio: 1.15
    },
    {
      map_name: 'Breeze',
      matches_played: 42,
      win_rate: 0.5,
      acs: 225,
      kd_ratio: 1.1
    },
    {
      map_name: 'Fracture',
      matches_played: 38,
      win_rate: 0.55,
      acs: 230,
      kd_ratio: 1.18
    }
  ];
  
  return growthStory;
}
