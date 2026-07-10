import { theSportsDBGetV1 } from "./client";
import type { QueryParams, TheSportsDBResponse, TheSportsDBLeague, TheSportsDBStandingRow } from "./types";

export interface SearchLeaguesParams extends QueryParams {
  l?: string;
}

export function searchLeagues(params?: SearchLeaguesParams): Promise<TheSportsDBResponse<TheSportsDBLeague[]>> {
  return theSportsDBGetV1<TheSportsDBLeague[]>("search_all_leagues.php", params);
}

export interface GetAllLeaguesParams extends QueryParams {}

export function getAllLeagues(): Promise<TheSportsDBResponse<TheSportsDBLeague[]>> {
  return theSportsDBGetV1<TheSportsDBLeague[]>("all_leagues.php");
}

export interface GetLeagueParams extends QueryParams {
  id?: number | string;
}

export function getLeague(params?: GetLeagueParams): Promise<TheSportsDBResponse<any[]>> {
  return theSportsDBGetV1<any[]>("lookupleague.php", params ? { id: String(params.id) } : undefined);
}

export interface GetLeagueSeasonsParams extends QueryParams {
  id?: number | string;
}

export function getLeagueSeasons(params?: GetLeagueSeasonsParams): Promise<TheSportsDBResponse<any[]>> {
  return theSportsDBGetV1<any[]>("search_all_seasons.php", params ? { id: String(params.id) } : undefined);
}

export interface GetLeagueTableParams extends QueryParams {
  l?: number | string;
  s?: string;
}

export function getLeagueTable(params?: GetLeagueTableParams): Promise<TheSportsDBResponse<TheSportsDBStandingRow[]>> {
  return theSportsDBGetV1<TheSportsDBStandingRow[]>("lookuptable.php", params);
}
