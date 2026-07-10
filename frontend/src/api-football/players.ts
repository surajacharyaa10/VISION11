import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

/* ------------------------------------------------------------------ */
/* /players/seasons                                                    */
/* ------------------------------------------------------------------ */

export interface GetPlayerSeasonsParams {
  player?: number;
}

/** GET /players/seasons — flat list of season years. */
export function getPlayerSeasons(
  params?: GetPlayerSeasonsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<number[]>> {
  return apiFootballGet<number[]>("/players/seasons", params, options);
}

/* ------------------------------------------------------------------ */
/* /players/profiles                                                   */
/* ------------------------------------------------------------------ */

export interface PlayerProfile {
  id: number;
  name: string;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  birth: { date: string | null; place: string | null; country: string | null };
  nationality: string | null;
  height: string | null;
  weight: string | null;
  injured: boolean;
  photo: string;
}

export interface GetPlayerProfilesParams {
  player?: number;
  search?: string; // >= 4 chars, lastname
  page?: number;
}

/** GET /players/profiles — paginated, 250 results per page. */
export function getPlayerProfiles(
  params?: GetPlayerProfilesParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PlayerProfile[]>> {
  return apiFootballGet<PlayerProfile[]>("/players/profiles", params, options);
}

/* ------------------------------------------------------------------ */
/* /players (statistics)                                               */
/* ------------------------------------------------------------------ */

export interface PlayerStatisticsBlock {
  team: { id: number; name: string; logo: string };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
  };
  games: {
    appearences: number | null;
    lineups: number | null;
    minutes: number | null;
    number: number | null;
    position: string | null;
    rating: string | null;
    captain: boolean;
  };
  substitutes: { in: number | null; out: number | null; bench: number | null };
  shots: { total: number | null; on: number | null };
  goals: {
    total: number | null;
    conceded: number | null;
    assists: number | null;
    saves: number | null;
  };
  passes: { total: number | null; key: number | null; accuracy: number | string | null };
  tackles: { total: number | null; blocks: number | null; interceptions: number | null };
  duels: { total: number | null; won: number | null };
  dribbles: { attempts: number | null; success: number | null; past: number | null };
  fouls: { drawn: number | null; committed: number | null };
  cards: { yellow: number | null; yellowred: number | null; red: number | null };
  penalty: {
    won: number | null;
    commited: number | null;
    scored: number | null;
    missed: number | null;
    saved: number | null;
  };
}

export interface PlayerWithStatistics {
  player: PlayerProfile;
  statistics: PlayerStatisticsBlock[];
}

export interface GetPlayersParams {
  id?: number;
  team?: number;
  league?: number;
  /** Requires id, league, or team to also be set. */
  season?: number;
  /** >= 4 chars; requires league or team. */
  search?: string;
  page?: number;
}

/** GET /players — paginated, 20 results per page. */
export function getPlayers(
  params: GetPlayersParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PlayerWithStatistics[]>> {
  return apiFootballGet<PlayerWithStatistics[]>("/players", params, options);
}

/* ------------------------------------------------------------------ */
/* /players/squads                                                     */
/* ------------------------------------------------------------------ */

export interface SquadPlayer {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
}

export interface Squad {
  team: { id: number; name: string; logo: string };
  players: SquadPlayer[];
}

export interface GetPlayerSquadsParams {
  team?: number;
  player?: number;
}

/** GET /players/squads — requires `team` or `player`. */
export function getPlayerSquads(
  params: GetPlayerSquadsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<Squad[]>> {
  return apiFootballGet<Squad[]>("/players/squads", params, options);
}

/* ------------------------------------------------------------------ */
/* /players/teams                                                      */
/* ------------------------------------------------------------------ */

export interface PlayerTeamHistoryItem {
  team: { id: number; name: string; logo: string };
  seasons: number[];
}

export interface GetPlayerTeamsParams {
  player: number;
}

/** GET /players/teams */
export function getPlayerTeams(
  params: GetPlayerTeamsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PlayerTeamHistoryItem[]>> {
  return apiFootballGet<PlayerTeamHistoryItem[]>("/players/teams", params, options);
}

/* ------------------------------------------------------------------ */
/* Top lists: scorers / assists / yellow cards / red cards             */
/* ------------------------------------------------------------------ */

export interface GetTopListParams {
  league: number;
  season: number;
}

/** GET /players/topscorers — top 20 goal scorers for a league/season. */
export function getTopScorers(
  params: GetTopListParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PlayerWithStatistics[]>> {
  return apiFootballGet<PlayerWithStatistics[]>(
    "/players/topscorers",
    params,
    options
  );
}

/** GET /players/topassists — top 20 assist providers for a league/season. */
export function getTopAssists(
  params: GetTopListParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PlayerWithStatistics[]>> {
  return apiFootballGet<PlayerWithStatistics[]>(
    "/players/topassists",
    params,
    options
  );
}

/** GET /players/topyellowcards — top 20 by yellow cards for a league/season. */
export function getTopYellowCards(
  params: GetTopListParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PlayerWithStatistics[]>> {
  return apiFootballGet<PlayerWithStatistics[]>(
    "/players/topyellowcards",
    params,
    options
  );
}

/** GET /players/topredcards — top 20 by red cards for a league/season. */
export function getTopRedCards(
  params: GetTopListParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PlayerWithStatistics[]>> {
  return apiFootballGet<PlayerWithStatistics[]>(
    "/players/topredcards",
    params,
    options
  );
}
