import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

/* ------------------------------------------------------------------ */
/* Shared enums                                                        */
/* ------------------------------------------------------------------ */

/** Short fixture status codes, see docs table for the full description. */
export type FixtureStatusShort =
  | "TBD"
  | "NS"
  | "1H"
  | "HT"
  | "2H"
  | "ET"
  | "BT"
  | "P"
  | "SUSP"
  | "INT"
  | "FT"
  | "AET"
  | "PEN"
  | "PST"
  | "CANC"
  | "ABD"
  | "AWD"
  | "WO"
  | "LIVE";

/* ------------------------------------------------------------------ */
/* /fixtures/rounds                                                    */
/* ------------------------------------------------------------------ */

export interface GetFixtureRoundsParams {
  league: number;
  season: number;
  current?: "true" | "false";
  dates?: "true" | "false";
  timezone?: string;
}

/** GET /fixtures/rounds — flat list of round names, e.g. "Regular Season - 1" */
export function getFixtureRounds(
  params: GetFixtureRoundsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<string[]>> {
  return apiFootballGet<string[]>("/fixtures/rounds", params, options);
}

/* ------------------------------------------------------------------ */
/* /fixtures                                                           */
/* ------------------------------------------------------------------ */

export interface FixtureStatus {
  long: string;
  short: FixtureStatusShort;
  elapsed: number | null;
}

export interface FixtureInfo {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: { first: number | null; second: number | null };
  venue: { id: number | null; name: string | null; city: string | null };
  status: FixtureStatus;
}

export interface FixtureLeagueInfo {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
  round: string;
}

export interface FixtureTeamInfo {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface FixtureGoals {
  home: number | null;
  away: number | null;
}

export interface FixtureScore {
  halftime: FixtureGoals;
  fulltime: FixtureGoals;
  extratime: FixtureGoals;
  penalty: FixtureGoals;
}

export interface Fixture {
  fixture: FixtureInfo;
  league: FixtureLeagueInfo;
  teams: { home: FixtureTeamInfo; away: FixtureTeamInfo };
  goals: FixtureGoals;
  score: FixtureScore;
  /** Present when the fixture is/was live, or when queried by id/ids. */
  events?: FixtureEvent[];
  lineups?: FixtureLineup[];
  statistics?: FixtureTeamStatistics[];
  players?: FixturePlayerStatsByTeam[];
}

export interface GetFixturesParams {
  id?: number;
  ids?: string; // "id-id-id", max 20
  live?: "all" | string; // "all" or "id-id"
  date?: string; // YYYY-MM-DD
  league?: number;
  season?: number;
  team?: number;
  last?: number;
  next?: number;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  round?: string;
  status?: string; // "NS" or "NS-PST-FT"
  venue?: number;
  timezone?: string;
}

/** GET /fixtures */
export function getFixtures(
  params?: GetFixturesParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<Fixture[]>> {
  return apiFootballGet<Fixture[]>("/fixtures", params, options);
}

/* ------------------------------------------------------------------ */
/* /fixtures/headtohead                                                */
/* ------------------------------------------------------------------ */

export interface GetHeadToHeadParams {
  h2h: string; // "id-id"
  date?: string;
  league?: number;
  season?: number;
  last?: number;
  next?: number;
  from?: string;
  to?: string;
  status?: string;
  venue?: number;
  timezone?: string;
}

/** GET /fixtures/headtohead */
export function getHeadToHead(
  params: GetHeadToHeadParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<Fixture[]>> {
  return apiFootballGet<Fixture[]>("/fixtures/headtohead", params, options);
}

/* ------------------------------------------------------------------ */
/* /fixtures/statistics                                                */
/* ------------------------------------------------------------------ */

export interface FixtureStatisticValue {
  type: string;
  value: number | string | null;
}

export interface FixtureTeamStatistics {
  team: { id: number; name: string; logo: string };
  statistics: FixtureStatisticValue[];
}

export interface GetFixtureStatisticsParams {
  fixture: number;
  team?: number;
  type?: string;
  half?: "true" | "false";
}

/** GET /fixtures/statistics */
export function getFixtureStatistics(
  params: GetFixtureStatisticsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<FixtureTeamStatistics[]>> {
  return apiFootballGet<FixtureTeamStatistics[]>(
    "/fixtures/statistics",
    params,
    options
  );
}

/* ------------------------------------------------------------------ */
/* /fixtures/events                                                    */
/* ------------------------------------------------------------------ */

export type FixtureEventType = "Goal" | "Card" | "Subst" | "Var";

export interface FixtureEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number | null; name: string | null };
  assist: { id: number | null; name: string | null };
  type: FixtureEventType;
  detail: string;
  comments: string | null;
}

export interface GetFixtureEventsParams {
  fixture: number;
  team?: number;
  player?: number;
  type?: string;
}

/** GET /fixtures/events */
export function getFixtureEvents(
  params: GetFixtureEventsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<FixtureEvent[]>> {
  return apiFootballGet<FixtureEvent[]>("/fixtures/events", params, options);
}

/* ------------------------------------------------------------------ */
/* /fixtures/lineups                                                   */
/* ------------------------------------------------------------------ */

export interface LineupPlayer {
  player: {
    id: number;
    name: string;
    number: number;
    pos: string | null;
    grid: string | null;
  };
}

export interface FixtureLineup {
  team: { id: number; name: string; logo: string; colors: unknown };
  coach: { id: number; name: string; photo: string };
  formation: string;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface GetFixtureLineupsParams {
  fixture: number;
  team?: number;
  player?: number;
  type?: string;
}

/** GET /fixtures/lineups */
export function getFixtureLineups(
  params: GetFixtureLineupsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<FixtureLineup[]>> {
  return apiFootballGet<FixtureLineup[]>("/fixtures/lineups", params, options);
}

/* ------------------------------------------------------------------ */
/* /fixtures/players                                                   */
/* ------------------------------------------------------------------ */

export interface FixturePlayerStats {
  player: { id: number; name: string; photo: string };
  statistics: unknown[];
}

export interface FixturePlayerStatsByTeam {
  team: { id: number; name: string; logo: string; update: string };
  players: FixturePlayerStats[];
}

export interface GetFixturePlayersParams {
  fixture: number;
  team?: number;
}

/** GET /fixtures/players */
export function getFixturePlayers(
  params: GetFixturePlayersParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<FixturePlayerStatsByTeam[]>> {
  return apiFootballGet<FixturePlayerStatsByTeam[]>(
    "/fixtures/players",
    params,
    options
  );
}
