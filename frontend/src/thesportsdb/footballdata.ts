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
