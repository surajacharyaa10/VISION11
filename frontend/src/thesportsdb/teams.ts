import { theSportsDBGetV1, theSportsDBGetV2 } from "./client";
import type { QueryParams, TheSportsDBResponse, TheSportsDBTeam, TheSportsDBEvent } from "./types";

export interface GetTeamParams extends QueryParams {
  id?: number | string;
}

export function getTeam(params?: GetTeamParams): Promise<TheSportsDBResponse<TheSportsDBTeam[]>> {
  return theSportsDBGetV1<TheSportsDBTeam[]>("lookupteam.php", params ? { id: String(params.id) } : undefined);
}

export interface GetTeamsLeagueParams extends QueryParams {
  l?: string;
  s?: string;
  c?: string;
}

export function getTeamsLeague(params?: GetTeamsLeagueParams): Promise<TheSportsDBResponse<TheSportsDBTeam[]>> {
  return theSportsDBGetV1<TheSportsDBTeam[]>("search_all_teams.php", params);
}

export interface SearchTeamsParams extends QueryParams {
  t?: string;
}

export function searchTeams(params?: SearchTeamsParams): Promise<TheSportsDBResponse<TheSportsDBTeam[]>> {
  return theSportsDBGetV1<TheSportsDBTeam[]>("searchteams.php", params);
}

export interface GetTeamPreviousEventsParams extends QueryParams {
  id?: number | string;
}

export function getTeamPreviousEvents(params?: GetTeamPreviousEventsParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("eventslast.php", params ? { id: String(params.id) } : undefined);
}

export interface GetTeamNextEventsParams extends QueryParams {
  id?: number | string;
}

export function getTeamNextEvents(params?: GetTeamNextEventsParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("eventsnext.php", params ? { id: String(params.id) } : undefined);
}
