import { Leagues } from "@/data/leagues";

export interface FootballdataTeam {
  team_id: number;
  team_name: string;
  team_logo: string;
  team_name_clean: string;
}

export interface FootballdataStandingRow {
  position: number;
  team: FootballdataTeam;
  record: {
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
  };
  goals: {
    for: number;
    against: number;
    difference: number;
  };
  home: {
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
  };
  away: {
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
  };
}

export interface FootballdataStandingsResponse {
  success: boolean;
  data: {
    league: {
      league_id: number;
      name: string;
      country: string;
      league_name: string;
      image: string;
    };
    season: {
      season_id: number;
      year: number | string;
    };
    standings: FootballdataStandingRow[];
  };
}

function mapFootballdataRow(row: FootballdataStandingRow) {
  return {
    rank: row.position,
    team: {
      id: row.team.team_id,
      name: row.team.team_name_clean || row.team.team_name,
      logo: row.team.team_logo || "",
    },
    points: row.record.points,
    goalsDiff: row.goals.difference,
    group: "",
    form: null,
    status: "",
    description: null,
    all: {
      played: row.record.matches_played,
      win: row.record.wins,
      draw: row.record.draws,
      lose: row.record.losses,
      goals: {
        for: row.goals.for,
        against: row.goals.against,
      },
    },
    home: {
      played: row.home.wins + row.home.draws + row.home.losses,
      win: row.home.wins,
      draw: row.home.draws,
      lose: row.home.losses,
      goals: {
        for: row.home.goals_for,
        against: row.home.goals_against,
      },
    },
    away: {
      played: row.away.wins + row.away.draws + row.away.losses,
      win: row.away.wins,
      draw: row.away.draws,
      lose: row.away.losses,
      goals: {
        for: row.away.goals_for,
        against: row.away.goals_against,
      },
    },
    update: "",
  };
}

const FOOTBALLDATA_BASE = "https://footballdata.io/api/v1";

export function hasFootballDataId(leagueId: number): boolean {
  const league = Leagues.find((l) => l.theSportsDBId === leagueId);
  return Boolean(league?.footballDataId);
}

export function getFootballdataLeagueId(leagueId: number): number | undefined {
  const league = Leagues.find((l) => l.theSportsDBId === leagueId);
  return league?.footballDataId;
}

export interface FootballdataSeason {
  season_id: number;
  year: number | string;
  is_current: boolean;
}

export interface FootballdataSeasonsResponse {
  success: boolean;
  data: {
    league: {
      league_id: number;
      name: string;
      country: string;
      competition_name: string;
      image: string;
    };
    seasons: FootballdataSeason[];
  };
}

export async function getFootballdataSeasons(leagueId: number): Promise<FootballdataSeason[]> {
  const footballDataId = getFootballdataLeagueId(leagueId);
  if (!footballDataId) return [];

  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return [];

  const url = `${FOOTBALLDATA_BASE}/leagues/${footballDataId}/seasons`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`[Footballdata] Seasons request failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as FootballdataSeasonsResponse;
  const seasons = json?.data?.seasons ?? [];
  const sorted = seasons
    .slice()
    .sort((a, b) => Number(b.season_id) - Number(a.season_id));
  return sorted.slice(0, 3);
}

export async function getFootballdataStandings(leagueId: number, seasonId?: number): Promise<any[]> {
  const footballDataId = getFootballdataLeagueId(leagueId);
  if (!footballDataId) return [];

  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return [];

  let url = `${FOOTBALLDATA_BASE}/leagues/${footballDataId}/standings`;
  if (seasonId) {
    url += `?season_id=${seasonId}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error(`[Footballdata] Standings request failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as FootballdataStandingsResponse;
  const standingsData = json?.data;
  const rows = standingsData?.standings ?? [];
  return rows.map(mapFootballdataRow);
}

export interface FootballdataMatch {
  match_id: number;
  match_date: string;
  date_unix: number;
  status: string;
  status_localized: string;
  league: { league_id: number; name: string; country: string };
  season: { season_id: number; year: number | string };
  home_team: { team_id: number; team_name: string; team_logo?: string };
  away_team: { team_id: number; team_name: string; team_logo?: string };
  score: {
    home: number;
    away: number;
    total_goals: number;
    halftime: { home: number; away: number; total_goals: number };
    second_half: { home: number; away: number; total_goals: number };
  };
  xg?: { home: number; away: number; total: number };
  odds?: { match_winner: { home: number; draw: number; away: number } };
  probabilities?: {
    home_win: number;
    draw: number;
    away_win: number;
    over_2_5_goals: number;
    both_teams_to_score: number;
  };
  venue?: { stadium_name?: string; stadium_location?: string };
  winner_text?: string;
}

export interface FootballdataMatchesResponse {
  success: boolean;
  data: {
    team: {
      team_id: number;
      team_name: string;
      team_name_english: string;
      team_logo: string;
      country: string;
    };
    matches: FootballdataMatch[];
  };
}

export async function getFootballdataTeamMatches(teamId: number | string): Promise<FootballdataMatchesResponse | null> {
  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `${FOOTBALLDATA_BASE}/teams/${teamId}/matches`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[Footballdata] Team matches request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return (await res.json()) as FootballdataMatchesResponse;
  } catch {
    return null;
  }
}

export interface FootballdataPlayer {
  player_id: number;
  player_name: string;
  first_name: string;
  last_name: string;
  known_name: string;
  nationality: string;
  date_of_birth: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  position: string;
  player_image?: string;
  season?: { season_id: number; year: number | string };
  league?: { league_id: number; name: string };
  stats?: {
    appearances: number | null;
    minutes: number | null;
    goals: number | null;
    assists: number | null;
    clean_sheets: number | null;
    goals_conceded: number | null;
    cards: number | null;
    yellow_cards: number | null;
    red_cards: number | null;
    goals_per_90: number;
    assists_per_90: number;
    cards_per_90: number;
  };
}

export interface FootballdataPlayersResponse {
  success: boolean;
  data: {
    team: {
      team_id: number;
      team_name: string;
      team_logo: string;
      country: string;
    };
    players: FootballdataPlayer[];
  };
}

export async function getFootballdataTeamPlayers(teamId: number | string): Promise<FootballdataPlayer[]> {
  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `${FOOTBALLDATA_BASE}/teams/${teamId}/players`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`[Footballdata] Team players request failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = (await res.json()) as FootballdataPlayersResponse;
    return Array.isArray(json?.data?.players) ? json.data.players : [];
  } catch {
    return [];
  }
}

export interface FootballdataTeamStatsResponse {
  success: boolean;
  data: {
    team: {
      team_id: number;
      team_name: string;
      team_name_clean: string;
      seo_slug: string;
      full_name: string;
      country: string;
      team_logo: string;
    };
    league?: {
      league_id: number;
      name: string;
      country: string;
      competition_name: string;
      image: string;
    };
    season?: {
      season_id: number;
      year: number | string;
      is_current: boolean;
    };
    summary?: {
      matches_played: number;
      wins: number;
      draws: number;
      losses: number;
      goals_for: number;
      goals_against: number;
      goal_difference: number;
      win_percentage: number;
      draw_percentage: number;
      loss_percentage: number;
      points_per_game: number;
    };
    home_away?: {
      home: {
        matches_played: number;
        wins: number;
        draws: number;
        losses: number;
        goals_for: number | null;
        goals_against: number | null;
        points_per_game: number;
      };
      away: {
        matches_played: number;
        wins: number;
        draws: number;
        losses: number;
        goals_for: number | null;
        goals_against: number | null;
        points_per_game: number;
      };
    };
    goals?: {
      for_per_match: number;
      against_per_match: number;
      total_goals_per_match: number;
      over_0_5_percentage: number;
      over_1_5_percentage: number;
      over_2_5_percentage: number;
      over_3_5_percentage: number;
      over_4_5_percentage: number;
      over_5_5_percentage: number;
      under_0_5_percentage: number;
      under_1_5_percentage: number;
      under_2_5_percentage: number;
      under_3_5_percentage: number;
      under_4_5_percentage: number;
      under_5_5_percentage: number;
    };
    clean_sheets?: {
      total: number;
      home: number;
      away: number;
      percentage: number;
      home_percentage: number;
      away_percentage: number;
    };
    failed_to_score?: {
      total: number;
      home: number;
      away: number;
      percentage: number;
      home_percentage: number;
      away_percentage: number;
    };
    both_teams_to_score?: {
      total: number;
      home: number;
      away: number;
      percentage: number;
      home_percentage: number;
      away_percentage: number;
    };
    corners?: {
      recorded_matches: number;
      for_total: number;
      against_total: number;
      for_per_match: number;
      against_per_match: number;
      total_per_match: number;
      over_7_5_percentage: number;
      over_8_5_percentage: number;
      over_9_5_percentage: number;
      over_10_5_percentage: number;
      over_11_5_percentage: number;
    };
    cards?: {
      for_total: number;
      against_total: number;
      total: number;
      for_per_match: number;
      against_per_match: number;
      total_per_match: number;
      over_1_5_percentage: number;
      over_2_5_percentage: number;
      over_3_5_percentage: number;
      over_4_5_percentage: number;
    };
    shots?: {
      recorded_matches: number;
      shots_total: number;
      shots_per_match: number;
      shots_on_target_total: number;
      shots_on_target_per_match: number;
      shot_conversion_rate: number;
    };
    xg?: {
      xg_for: number;
      xg_against: number;
      xg_for_per_match: number;
      xg_against_per_match: number;
    };
    possession?: {
      average: number;
      home_average: number;
      away_average: number;
    };
    fouls?: {
      committed_total: number;
      committed_per_match: number;
      against_total: number;
      against_per_match: number;
    };
    goal_timing?: {
      scored: Record<string, number>;
      conceded: Record<string, number>;
    };
    form?: {
      overall: string;
      home: string;
      away: string;
    };
    set_pieces?: {
      throw_ins: Record<string, number>;
      free_kicks: Record<string, number>;
      goal_kicks: Record<string, number>;
    };
    offsides?: {
      team_per_match: number;
      match_total_per_match: number;
      over_2_5_percentage: number;
      over_3_5_percentage: number;
      over_4_5_percentage: number;
    };
    goal_timing_minutes?: {
      scored: Record<string, number>;
      conceded: Record<string, number>;
    };
    correct_score?: {
      match_total_goals: Record<string, number>;
      team_goals: Record<string, number>;
    };
    special_markets?: Record<string, number>;
    penalties?: {
      won: number;
      scored: number;
      missed: number;
      conceded: number;
      won_per_match: number;
      match_with_penalty_percentage: number;
    };
    last_updated?: string;
  };
}

export async function getFootballdataTeamStats(teamId: number | string): Promise<FootballdataTeamStatsResponse | null> {
  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `${FOOTBALLDATA_BASE}/teams/${teamId}/stats`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`[Footballdata] Team stats request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = (await res.json()) as any;
    return json?.data ?? json;
  } catch {
    return null;
  }
}

export interface FootballdataTeamDetailsResponse {
  success: boolean;
  data: {
    team_id: number;
    team_name: string;
    team_name_clean: string;
    seo_slug: string;
    full_name: string;
    country: string;
    continent: string | null;
    team_logo: string;
    stadium: { name: string; address: string };
    founded: string;
    form: { ppg_home: number; ppg_away: number; ppg_overall: number };
    league_seasons: any[];
    recent_matches: any[];
    upcoming_matches: any[];
  };
}

export async function getFootballdataTeam(teamId: number | string): Promise<FootballdataTeamDetailsResponse | null> {
  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `${FOOTBALLDATA_BASE}/teams/${teamId}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`[Footballdata] Team details request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return (await res.json()) as FootballdataTeamDetailsResponse;
  } catch {
    return null;
  }
}

export interface FootballdataMatchEvent {
  event_id: number;
  match_id: number;
  type: string;
  detail: string;
  time: { elapsed: number; extra?: number };
  player: { player_id: number; player_name: string };
  assist?: { player_id: number; player_name: string };
  team: { team_id: number; team_name: string };
}

export interface FootballdataMatchStat {
  type: string;
  value: number | string;
  team: { team_id: number; team_name: string };
}

export interface FootballdataMatchDetail {
  match_id: number;
  match_date: string;
  status: string;
  league: { league_id: number; name: string };
  home_team: { team_id: number; team_name: string; team_logo?: string };
  away_team: { team_id: number; team_name: string; team_logo?: string };
  score: {
    home: number;
    away: number;
    total_goals: number;
    halftime: { home: number; away: number };
  };
  venue?: { stadium_name?: string; stadium_location?: string };
  events?: FootballdataMatchEvent[];
  stats?: FootballdataMatchStat[];
}

export async function getFootballdataMatchDetail(matchId: number | string): Promise<FootballdataMatchDetail | null> {
  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `${FOOTBALLDATA_BASE}/matches/${matchId}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[Footballdata] Match detail request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = (await res.json()) as any;
    return json?.data ?? json ?? null;
  } catch {
    return null;
  }
}

export async function getFootballdataMatchEvents(matchId: number | string): Promise<FootballdataMatchEvent[]> {
  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `${FOOTBALLDATA_BASE}/matches/${matchId}/events`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[Footballdata] Match events request failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = (await res.json()) as any;
    const events = Array.isArray(json?.data?.events) ? json.data.events : Array.isArray(json) ? json : [];
    return events;
  } catch {
    return [];
  }
}

export async function getFootballdataMatchStats(matchId: number | string): Promise<FootballdataMatchStat[]> {
  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `${FOOTBALLDATA_BASE}/matches/${matchId}/stats`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[Footballdata] Match stats request failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = (await res.json()) as any;
    const stats = Array.isArray(json?.data?.stats) ? json.data.stats : Array.isArray(json) ? json : [];
    return stats;
  } catch {
    return [];
  }
}

export async function searchFootballdataMatches(fixture: any): Promise<FootballdataMatch | null> {
  const apiKey = process.env.FOOTBALLDATA_API_KEY;
  if (!apiKey) return null;

  const dateStr = fixture?.fixture?.date ? fixture.fixture.date.split("T")[0] : null;
  const homeName = fixture?.teams?.home?.name || "";
  const awayName = fixture?.teams?.away?.name || "";
  const leagueId = fixture?.league?.id;

  if (!dateStr || !homeName || !awayName) return null;

  const footballDataId = getFootballdataLeagueId(leagueId);

  try {
    let url = `${FOOTBALLDATA_BASE}/matches?date=${dateStr}`;
    if (footballDataId) {
      url += `&league_id=${footballDataId}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[Footballdata] Match search failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    let matches: FootballdataMatch[] = [];

    if (Array.isArray(json)) {
      matches = json;
    } else if (Array.isArray(json?.matches)) {
      matches = json.matches;
    } else if (json?.data?.matches && Array.isArray(json.data.matches)) {
      matches = json.data.matches;
    } else if (json?.data && Array.isArray(json.data)) {
      matches = json.data;
    }

    const lowerHome = homeName.toLowerCase();
    const lowerAway = awayName.toLowerCase();

    const found = matches.find((m) => {
      const mHome = (m.home_team?.team_name || "").toLowerCase();
      const mAway = (m.away_team?.team_name || "").toLowerCase();
      return mHome === lowerHome && mAway === lowerAway;
    });

    return found || null;
  } catch {
    return null;
  }
}