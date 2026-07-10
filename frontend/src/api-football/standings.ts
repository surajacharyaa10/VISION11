import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

export interface StandingRecord {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  group: string;
  form: string | null;
  status: string;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
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
    /** Array of ranking tables (group stage, overall, home/away splits, etc.) */
    standings: StandingRecord[][];
  };
}

export interface GetStandingsParams {
  league?: number;
  season: number;
  team?: number;
}

/** GET /standings */
export function getStandings(
  params: GetStandingsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<StandingsResponseItem[]>> {
  return apiFootballGet<StandingsResponseItem[]>("/standings", params, options);
}
