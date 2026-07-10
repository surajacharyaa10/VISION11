import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

/* ------------------------------------------------------------------ */
/* /odds/live                                                           */
/* ------------------------------------------------------------------ */

export interface OddsLiveValue {
  value: string;
  odd: string;
  handicap: string | null;
  /** True only when several identical values exist for the same bet. */
  main: boolean;
  suspended: boolean;
}

export interface OddsLiveBet {
  id: number;
  name: string;
  values: OddsLiveValue[];
}

export interface OddsLiveStatus {
  stopped: boolean;
  blocked: boolean;
  finished: boolean;
}

export interface OddsLiveResponseItem {
  fixture: { id: number; status: OddsLiveStatus };
  league: { id: number; season: number };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  status: { elapsed: number | null; second: number | null };
  odds: OddsLiveBet[];
}

export interface GetLiveOddsParams {
  fixture?: number;
  /** In this endpoint `season` is embedded in `league` per the docs pattern. */
  league?: number;
  bet?: number;
}

/** GET /odds/live */
export function getLiveOdds(
  params?: GetLiveOddsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<OddsLiveResponseItem[]>> {
  return apiFootballGet<OddsLiveResponseItem[]>("/odds/live", params, options);
}

export interface GetLiveOddsBetsParams {
  id?: string;
  search?: string;
}

/** GET /odds/live/bets — bet ids usable as `bet` filter in /odds/live only. */
export function getLiveOddsBets(
  params?: GetLiveOddsBetsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<{ id: number; name: string }[]>> {
  return apiFootballGet<{ id: number; name: string }[]>(
    "/odds/live/bets",
    params,
    options
  );
}

/* ------------------------------------------------------------------ */
/* /odds (pre-match)                                                    */
/* ------------------------------------------------------------------ */

export interface OddsBookmakerBetValue {
  value: string;
  odd: string;
}

export interface OddsBookmakerBet {
  id: number;
  name: string;
  values: OddsBookmakerBetValue[];
}

export interface OddsBookmaker {
  id: number;
  name: string;
  bets: OddsBookmakerBet[];
}

export interface OddsResponseItem {
  league: { id: number; season: number };
  fixture: { id: number; timezone: string; date: string; timestamp: number };
  update: string;
  bookmakers: OddsBookmaker[];
}

export interface GetOddsParams {
  fixture?: number;
  league?: number;
  season?: number;
  date?: string; // YYYY-MM-DD
  timezone?: string;
  page?: number;
  bookmaker?: number;
  bet?: number;
}

/** GET /odds — pre-match odds, paginated, 10 results per page. */
export function getOdds(
  params?: GetOddsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<OddsResponseItem[]>> {
  return apiFootballGet<OddsResponseItem[]>("/odds", params, options);
}

export interface GetOddsMappingParams {
  page?: number;
}

/** GET /odds/mapping — fixture ids usable with /odds, paginated 100/page. */
export function getOddsMapping(
  params?: GetOddsMappingParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<unknown[]>> {
  return apiFootballGet<unknown[]>("/odds/mapping", params, options);
}

export interface GetBookmakersParams {
  id?: number;
  search?: string;
}

/** GET /odds/bookmakers */
export function getBookmakers(
  params?: GetBookmakersParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<{ id: number; name: string }[]>> {
  return apiFootballGet<{ id: number; name: string }[]>(
    "/odds/bookmakers",
    params,
    options
  );
}

export interface GetOddsBetsParams {
  id?: string;
  search?: string;
}

/** GET /odds/bets — bet ids usable as `bet` filter in /odds only. */
export function getOddsBets(
  params?: GetOddsBetsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<{ id: number; name: string }[]>> {
  return apiFootballGet<{ id: number; name: string }[]>(
    "/odds/bets",
    params,
    options
  );
}
