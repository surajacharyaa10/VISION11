import { theSportsDBGetV1 } from "./client";
import type { TheSportsDBResponse, QueryParams } from "./types";
import { getFootballdataStandings, hasFootballDataId } from "./footballdata";

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
  season?: number | string;
  team?: number;
}

/** Extract the standings rows from a lookuptable response. */
function tableFromResponse(res: any): any[] {
  const r = res?.response;
  if (Array.isArray(r)) return r;
  if (r && Array.isArray(r.table)) return r.table;
  if (Array.isArray(res?.table)) return res.table;
  return [];
}

/**
 * Some continental club competitions (UCL, UECL, etc.) return rows in
 * lookuptable.php that aren't part of the actual group/league-phase points
 * table — e.g. rows explicitly labelled as a domestic/qualifying stage, or
 * placeholder rows with no games played and no points at all. Those don't
 * belong in a "points table" and get filtered out here.
 */
function isDomesticOrPlaceholderRow(row: any): boolean {
  const label = `${row.strDescription ?? ""} ${row.strGroup ?? ""}`.toLowerCase();
  if (label.includes("domestic") || label.includes("qualif")) return true;

  const played = Number(row.intPlayed) || 0;
  const points = Number(row.intPoints) || 0;
  const goalsFor = Number(row.intGoalsFor) || 0;
  const goalsAgainst = Number(row.intGoalsAgainst) || 0;
  const isCompletelyEmpty =
    played === 0 && points === 0 && goalsFor === 0 && goalsAgainst === 0;

  return isCompletelyEmpty;
}

/**
 * Removes domestic/placeholder rows, but only when the response is a mix
 * of real and placeholder rows. If every row is "empty" (e.g. the whole
 * competition genuinely hasn't kicked off yet), we leave the table as-is
 * rather than wiping it out entirely.
 */
function filterToGroupStageRows(rows: any[]): any[] {
  const withRealData = rows.filter((r) => !isDomesticOrPlaceholderRow(r));
  if (withRealData.length === 0) return rows;
  return withRealData;
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
): Promise<TheSportsDBResponse<StandingsResponseItem[]>> {
  const leagueId = String(params.league ?? 0);
  const numericLeagueId = Number(leagueId);

  if (!leagueId || leagueId === "0") {
    return {
      get: "",
      parameters: params,
      errors: [],
      results: 0,
      paging: { current: 1, total: 1 },
      response: [],
    } as TheSportsDBResponse<StandingsResponseItem[]>;
  }

  let standings: any[] = [];
  let usedSource = "thesportsdb";

  if (hasFootballDataId(numericLeagueId)) {
    try {
      const fdRows = await getFootballdataStandings(numericLeagueId, params.season ? Number(params.season) : undefined);
      if (fdRows.length > 0) {
        standings = fdRows;
        usedSource = "footballdata";
      }
    } catch (e) {
      console.warn("[Standings] Footballdata fetch failed, falling back to TheSportsDB", e);
    }
  }

  if (usedSource === "thesportsdb") {
    const season = params.season ? String(params.season) : undefined;
    const query: Record<string, string> = { l: leagueId };
    if (season) query.s = season;

    const res = await theSportsDBGetV1<any>("lookuptable.php", query);
    const rawRows = tableFromResponse(res);
    const rows = filterToGroupStageRows(rawRows);
    standings = rows.map(mapTSDBRowToStanding);
  }

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
  } as TheSportsDBResponse<StandingsResponseItem[]>;
}