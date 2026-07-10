import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

export interface Injury {
  player: {
    id: number;
    name: string;
    photo: string;
    type: "Missing Fixture" | "Questionable" | string;
    reason: string;
  };
  team: { id: number; name: string; logo: string };
  fixture: { id: number; timezone: string; date: string; timestamp: number };
  league: {
    id: number;
    season: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
  };
}

export interface GetInjuriesParams {
  league?: number;
  /** Required alongside league, team, or player. */
  season?: number;
  fixture?: number;
  team?: number;
  player?: number;
  date?: string; // YYYY-MM-DD
  ids?: string; // "id-id-id", max 20 fixture ids
  timezone?: string;
}

/** GET /injuries — requires at least one query parameter. */
export function getInjuries(
  params: GetInjuriesParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<Injury[]>> {
  return apiFootballGet<Injury[]>("/injuries", params, options);
}
