import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";


export interface SidelinedRecord {
  type: string;
  start: string;
  end: string;
}

export interface GetSidelinedParams {
  player?: number;
  /** "id-id-id", max 20 player ids */
  players?: string;
  coach?: number;
  /** "id-id-id", max 20 coach ids */
  coachs?: string;
}

/** GET /sidelined — requires at least one query parameter. */
export function getSidelined(
  params: GetSidelinedParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<SidelinedRecord[]>> {
  return apiFootballGet<SidelinedRecord[]>("/sidelined", params, options);
}
