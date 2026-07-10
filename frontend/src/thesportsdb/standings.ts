import { theSportsDBGetV1 } from "./client";
import type { ApiFootballResponse, QueryParams } from "./types";

export interface StandingRecord {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  group: string;
  form: string | null;
  status: string;
  description: string | null;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  home: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  away: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  update: string;
}

export interface StandingsResponseItem {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    standings: StandingRecord[][];
  };
}

export interface GetStandingsParams extends QueryParams {
  league?: number;
  season: number;
  team?: number;
}

function mapTSDBRowToStanding(row: any): StandingRecord {
  return {
    rank: Number(row.intRank) || 0,
    team: {
      id: Number(row.idTeam) || 0,
      name: row.strTeam,
      logo: row.strBadge || "",
    },
    points: Number(row.intPoints) || 0,
    goalsDiff: Number(row.intGoalDifference) || 0,
    group: row.strGroup || "",
    form: row.strForm || null,
    status: row.strDescription || "",
    description: row.strDescription || null,
    all: {
      played: Number(row.intPlayed) || 0,
      win: Number(row.intWin) || 0,
      draw: Number(row.intDraw) || 0,
      lose: Number(row.intLoss) || 0,
      goals: {
        for: Number(row.intGoalsFor) || 0,
        against: Number(row.intGoalsAgainst) || 0,
      },
    },
    home: { played: 0, win: 0, draw: 0, lose: 0, goals: { for: 0, against: 0 } },
    away: { played: 0, win: 0, draw: 0, lose: 0, goals: { for: 0, against: 0 } },
    update: row.dateUpdated || "",
  };
}

export async function getStandings(
  params: GetStandingsParams,
  options?: QueryParams
): Promise<ApiFootballResponse<StandingsResponseItem[]>> {
  const leagueId = String(params.league ?? 0);
  const season = params.season ? String(params.season) : undefined;

  if (!leagueId || leagueId === "0") {
    return {
      get: "",
      parameters: params,
      errors: [],
      results: 0,
      paging: { current: 1, total: 1 },
      response: [],
    } as ApiFootballResponse<StandingsResponseItem[]>;
  }

  const query: Record<string, string> = { l: leagueId };
  if (season) query.s = season;

  const res = await theSportsDBGetV1<any>("lookuptable.php", query);
  const rows = Array.isArray((res as any)?.table) ? (res as any).table : [];

  const standings = rows.map(mapTSDBRowToStanding);

  return {
    get: "",
    parameters: params,
    errors: [],
    results: standings.length,
    paging: { current: 1, total: 1 },
    response: [
      {
        league: {
          id: Number(leagueId),
          name: "",
          country: "",
          logo: "",
          flag: null,
          season: params.season || 0,
          standings: [standings],
        },
      },
    ],
  } as ApiFootballResponse<StandingsResponseItem[]>;
}
