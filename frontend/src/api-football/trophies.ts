import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";


export interface Trophy {
  league: string;
  country: string;
  season: string;
  place: string;
}

export interface GetTrophiesParams {
  player?: number;
  /** "id-id-id", max 20 player ids */
  players?: string;
  coach?: number;
  /** "id-id-id", max 20 coach ids */
  coachs?: string;
}

/** GET /trophies — requires at least one query parameter. */
export function getTrophies(
  params: GetTrophiesParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<Trophy[]>> {
  return apiFootballGet<Trophy[]>("/trophies", params, options);
}
