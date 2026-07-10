import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

export interface LeagueCoverageFixtures {
  events: boolean;
  lineups: boolean;
  statistics_fixtures: boolean;
  statistics_players: boolean;
}

export interface LeagueCoverage {
  fixtures: LeagueCoverageFixtures;
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
}

export interface LeagueSeason {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: LeagueCoverage;
}

export interface League {
  league: {
    id: number;
    name: string;
    type: "League" | "Cup" | string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: LeagueSeason[];
}

export interface GetLeaguesParams {
  id?: number;
  name?: string;
  country?: string;
  code?: string;
  season?: number;
  team?: number;
  type?: "league" | "cup";
  current?: "true" | "false";
  search?: string;
  last?: number;
}

/** GET /leagues */
export function getLeagues(
  params?: GetLeaguesParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<League[]>> {
  return apiFootballGet<League[]>("/leagues", params, options);
}

/** GET /leagues/seasons — flat list of season years, e.g. [2018, 2019, 2020] */
export function getLeagueSeasons(
  options?: RequestOptions
): Promise<ApiFootballResponse<number[]>> {
  return apiFootballGet<number[]>("/leagues/seasons", undefined, options);
}
