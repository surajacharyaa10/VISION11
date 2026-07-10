import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

import type { Country } from "./countries";

export interface Venue {
  id: number | null;
  name: string | null;
  address: string | null;
  city: string | null;
  country?: string | null;
  capacity: number | null;
  surface: string | null;
  image: string | null;
}

export interface Team {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string;
    founded: number | null;
    national: boolean;
    logo: string;
  };
  venue: Venue;
}

export interface GetTeamsParams {
  id?: number;
  name?: string;
  league?: number;
  season?: number;
  country?: string;
  code?: string;
  venue?: number;
  search?: string;
}

/** GET /teams — requires at least one query parameter. */
export function getTeams(
  params: GetTeamsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<Team[]>> {
  return apiFootballGet<Team[]>("/teams", params, options);
}

export interface GetTeamStatisticsParams {
  league: number;
  season: number;
  team: number;
  date?: string; // YYYY-MM-DD
}

/**
 * GET /teams/statistics
 * Response shape is large/nested (form, fixtures, goals, biggest, clean_sheet,
 * failed_to_score, penalty, lineups, cards). Left as `unknown` — narrow with
 * your own interface if you need strict typing on every field.
 */
export function getTeamStatistics(
  params: GetTeamStatisticsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<unknown>> {
  return apiFootballGet<unknown>("/teams/statistics", params, options);
}

export interface GetTeamSeasonsParams {
  team: number;
}

/** GET /teams/seasons — list of season years a team has data for. */
export function getTeamSeasons(
  params: GetTeamSeasonsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<number[]>> {
  return apiFootballGet<number[]>("/teams/seasons", params, options);
}

/** GET /teams/countries */
export function getTeamCountries(
  options?: RequestOptions
): Promise<ApiFootballResponse<Country[]>> {
  return apiFootballGet<Country[]>("/teams/countries", undefined, options);
}
