/**
 * VALORANTプレイヤー成長ストーリーサイト API連携サービス
 * Liquipedia APIからデータを取得し、フロントエンド用に加工する
 */

// --- 基本的な型定義 (Liquipediaからのデータに合わせて調整が必要) ---
export interface Player {
  id: string; // Liquipediaのページ名（例: TenZ）
  url: string; // LiquipediaのページURL
  name: string; // 表示名
  teamTag?: string; // 現在のチームタグ (取得できれば)
  country?: string; // 国籍 (詳細取得時に補完)
  imageUrl?: string; // (詳細取得時に補完)
  // Liquipediaから取得できるその他の基本情報
}

export interface PlayerGrowthStory {
  info: {
    playerId: string; // Liquipediaのページ名
    name: string; // IGN
    realName?: string;
    team?: string;
    teamId?: string; // Liquipedia team page name
    country?: string;
    imageUrl?: string;
    role?: string;
    url: string; // Liquipedia URL
    socialLinks: {
      twitter?: string;
      twitch?: string;
    };
    lastUpdated: string; // キャッシュ/取得日時
  };
  teamHistory?: {
    teamName: string;
    teamPageName?: string; // Liquipedia team page name
    joinDate?: string;
    leaveDate?: string;
    isActive?: boolean;
  }[];
  recentMatches?: {
    tournament?: string;
    date?: string;
    opponent?: string;
    opponentPageName?: string;
    score?: string;
    result?: 'W' | 'L' | 'D';
  }[];
  agentStats?: {
    agentName: string;
    [key: string]: any;
  }[];
  mapStats?: {
    mapName: string;
    [key: string]: any;
  }[];
}

// --- API設定 ---
const LIQUIPEDIA_VALORANT_API_URL = 'https://liquipedia.net/valorant/api.php';
const APP_USER_AGENT = 'ValorantPlayerStories/1.0 (https://your-app-url.com; your-contact-email@example.com)'; // TODO: 適切なURLと連絡先に更新

// --- キャッシュ設定 ---
const CACHE_DURATION_MS = 1000 * 60 * 60; // 1時間

// --- レート制限管理 ---
let lastRequestTime = 0;
const REQUEST_INTERVAL_MS = 5000; // カテゴリ取得はparseよりは緩いと期待 (要検証、最初は30秒推奨)

async function ensureRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < REQUEST_INTERVAL_MS) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL_MS - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

// --- APIリクエスト基本関数 ---
async function fetchFromLiquipediaApi<T>(params: URLSearchParams): Promise<T> {
  await ensureRateLimit();
  const url = `${LIQUIPEDIA_VALORANT_API_URL}?${params.toString()}`;
  console.log("Fetching:", url); // デバッグ用ログ

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': APP_USER_AGENT,
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Liquipedia API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Liquipedia API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json() as T;
    console.log("Fetched data:", data); // デバッグ用ログ
    return data;
  } catch (error) {
    console.error(`Error fetching from Liquipedia API (${params.get('action')}, ${params.get('page') || params.get('titles') || params.get('cmtitle')}):`, error);
    throw error;
  }
}

// --- ウィキテキストパーサー (簡易版 - 実際の構造に合わせて要調整) ---
function parseInfobox(wikitext: string): Record<string, string> {
  const data: Record<string, string> = {};
  const infoboxMatch = wikitext.match(/\{\{Infobox player\s*([\s\S]*?)\s*\}\}/i);
  if (infoboxMatch && infoboxMatch[1]) {
    const paramsText = infoboxMatch[1];
    const paramRegex = /\|\s*([^=]+?)\s*=\s*([\s\S]*?)(?=\s*\||\s*\}\})/g; // 値に改行やテンプレートが含まれる場合を考慮
    let match;
    while ((match = paramRegex.exec(paramsText)) !== null) {
      data[match[1].trim().toLowerCase()] = match[2].trim(); // キーを小文字に統一
    }
  }
  // console.log("Parsed Infobox:", data); // デバッグ用
  return data;
}

function parseTeamHistory(wikitext: string): PlayerGrowthStory['teamHistory'] {
    const history: PlayerGrowthStory['teamHistory'] = [];
    // {{PlayerTeamHistoryLine}} や {{PlayerTeamHistoryEnd}} を使った構造を想定
    // または {{Team history}} テンプレートなど
    const teamHistorySection = wikitext.match(/==\s*Team History\s*==([\s\S]*?)(?===|$)/i);
    let historyTextToParse = wikitext; // デフォルトは全文

    if (teamHistorySection && teamHistorySection[1]) {
        historyTextToParse = teamHistorySection[1];
    }
    // console.log("Parsing Team History from text:", historyTextToParse.substring(0, 500));


    // {{PlayerTeamHistoryLine |team=TeamName |joindate=YYYY-MM-DD |leavedate=YYYY-MM-DD |role=Player |type=Active}}
    // {{PlayerTeamHistoryEnd}}
    // この形式のテンプレートをパースする正規表現の例 (要調整)
    const lineRegex = /\{\{PlayerTeamHistoryLine\s*([\s\S]*?)\s*\}\}/gi;
    let lineMatch;
    while((lineMatch = lineRegex.exec(historyTextToParse)) !== null) {
        const paramsText = lineMatch[1];
        const entry: any = {};
        const paramRegex = /\|\s*([^=]+?)\s*=\s*([\s\S]*?)(?=\s*\||\s*$)/g;
        let param;
        while((param = paramRegex.exec(paramsText)) !== null) {
            entry[param[1].trim().toLowerCase()] = param[2].trim();
        }

        if (entry.team) {
            history.push({
                teamName: entry.team,
                teamPageName: entry.teamlink || entry.team, // teamlinkがあればそれを使う
                joinDate: entry.joindate,
                leaveDate: entry.leavedate,
                isActive: !entry.leavedate || entry.leavedate.toLowerCase() === 'present', // "Present" も考慮
            });
        }
    }
    // console.log("Parsed Team History:", history); // デバッグ用
    return history.length > 0 ? history.reverse() : undefined; // 新しいものが上に来ることが多いので逆順にするか確認
}

// --- 主要API関数 ---

async function getPlayerPageWikitext(playerName: string): Promise<string | null> {
  const cacheKey = `liquipedia_player_wikitext_${playerName.replace(/\s/g, '_')}`; // キーの空白を置換
  const cachedItem = localStorage.getItem(cacheKey);
  if (cachedItem) {
    const { timestamp, data } = JSON.parse(cachedItem);
    if (Date.now() - timestamp < CACHE_DURATION_MS) {
      // console.log(`Cache hit for ${playerName}`);
      return data;
    }
    // console.log(`Cache expired for ${playerName}`);
  }

  const params = new URLSearchParams({
    action: 'query',
    titles: playerName,
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main', // スロット指定を追加
    format: 'json',
    formatversion: '2',
    origin: '*'
  });

  try {
    const response = await fetchFromLiquipediaApi<any>(params);
    if (response.query && response.query.pages && response.query.pages.length > 0) {
      const page = response.query.pages[0];
      if (page.revisions && page.revisions.length > 0 && page.revisions[0].slots && page.revisions[0].slots.main) {
        const wikitext = page.revisions[0].slots.main.content;
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: wikitext }));
        return wikitext;
      }
    }
    console.warn(`No wikitext found for player ${playerName}`, response);
    return null;
  } catch (error) {
    console.error(`Error fetching wikitext for player ${playerName}:`, error);
    return null;
  }
}

export async function getPlayerGrowthStoryFromLiquipedia(playerNamePageTitle: string): Promise<PlayerGrowthStory | null> {
  const wikitext = await getPlayerPageWikitext(playerNamePageTitle);
  if (!wikitext) {
    return null;
  }

  const infoboxData = parseInfobox(wikitext);
  const teamHistoryData = parseTeamHistory(wikitext);

  const story: PlayerGrowthStory = {
    info: {
      playerId: playerNamePageTitle,
      name: infoboxData.ign || infoboxData.id || playerNamePageTitle,
      realName: infoboxData.name,
      team: infoboxData.team,
      teamId: infoboxData.teamlink || infoboxData.team,
      country: infoboxData.country || infoboxData.nationality,
      imageUrl: infoboxData.image ? `https://liquipedia.net${infoboxData.image.startsWith('/commons-images') ? infoboxData.image : `/commons-images/valorant/thumb/${infoboxData.image}/YOUR_WIDTHpx-${infoboxData.image}`}` : undefined, // 画像URLの形式を確認・調整
      role: infoboxData.role,
      url: `https://liquipedia.net/valorant/${encodeURIComponent(playerNamePageTitle.replace(/ /g, '_'))}`,
      socialLinks: {
        twitter: infoboxData.twitter,
        twitch: infoboxData.twitch,
      },
      lastUpdated: new Date().toISOString(),
    },
    teamHistory: teamHistoryData,
    recentMatches: [], // TODO: パースロジック実装
    agentStats: [],    // TODO: パースロジック実装
    mapStats: [],      // TODO: パースロジック実装
  };
  return story;
}

/**
 * 全プレイヤーリストを取得 (Liquipediaから取得する場合)
 * Category:Players から取得することを試みる。
 * より多くのプレイヤーを取得するには、複数のカテゴリやクエリを組み合わせる必要があるかもしれない。
 */
export async function getPlayersFromLiquipedia(limit: number = 100): Promise<Player[]> {
    // キャッシュキー（カテゴリメンバーは頻繁に変わる可能性は低いが、キャッシュは有効）
    const cacheKey = `liquipedia_players_category_all_${limit}`;
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
        const { timestamp, data } = JSON.parse(cachedItem);
        if (Date.now() - timestamp < CACHE_DURATION_MS / 4) { // プレイヤーリストは少し短めのキャッシュ
            // console.log("Cache hit for all players list");
            return data;
        }
    }

    const params = new URLSearchParams({
        action: 'query',
        list: 'categorymembers',
        cmtitle: 'Category:Players', // 一般的なプレイヤーカテゴリ (存在確認と調整が必要)
        cmlimit: limit.toString(),
        cmtype: 'page', // サブカテゴリではなくページのみ
        format: 'json',
        formatversion: '2',
        origin: '*'
    });

    try {
        const response = await fetchFromLiquipediaApi<any>(params);
        if (response.query && response.query.categorymembers) {
            const players = response.query.categorymembers.map((member: any) => ({
                id: member.title,
                name: member.title,
                url: `https://liquipedia.net/valorant/${encodeURIComponent(member.title.replace(/ /g, '_'))}`,
                // teamTag, country, imageUrl はこの時点では取得できないため、
                // PlayersListPageで表示する際に別途取得するか、詳細ページでのみ表示する
            }));
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: players }));
            return players;
        }
        return [];
    } catch (error) {
        console.error('Error fetching players from Liquipedia category:', error);
        return [];
    }
}
