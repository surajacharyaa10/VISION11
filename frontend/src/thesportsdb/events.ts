import { theSportsDBGetV1 } from "./client";
import type { QueryParams, TheSportsDBResponse, TheSportsDBEvent } from "./types";
export type { TheSportsDBEvent } from "./types";

export interface GetEventsNextLeagueParams extends QueryParams {
  id?: number | string;
}

export function getEventsNextLeague(params?: GetEventsNextLeagueParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("eventsnextleague.php", params ? { id: String(params.id) } : undefined);
}

export interface GetEventsPastLeagueParams extends QueryParams {
  id?: number | string;
}

export function getEventsPastLeague(params?: GetEventsPastLeagueParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("eventspastleague.php", params ? { id: String(params.id) } : undefined);
}

export interface GetEventsDayParams extends QueryParams {
  d?: string;
  l?: number | string;
  s?: string;
}

export function getEventsDay(params?: GetEventsDayParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("eventsday.php", params);
}

export interface GetEventParams extends QueryParams {
  id?: number | string;
}

export function getEvent(params?: GetEventParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("lookupevent.php", params ? { id: String(params.id) } : undefined);
}

export interface GetEventTVParams extends QueryParams {
  id?: number | string;
}

export function getEventTV(params?: GetEventTVParams): Promise<TheSportsDBResponse<any[]>> {
  return theSportsDBGetV1<any[]>("lookuptv.php", params ? { id: String(params.id) } : undefined);
}

export interface SearchEventsParams extends QueryParams {
  e?: string;
  s?: string;
  d?: string;
}

export function searchEvents(params?: SearchEventsParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("searchevents.php", params);
}

export interface GetEventsNextParams extends QueryParams {
  id?: number | string;
}

export function getEventsNext(params?: GetEventsNextParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("eventsnext.php", params ? { id: String(params.id) } : undefined);
}

export interface GetEventsLastParams extends QueryParams {
  id?: number | string;
}

export function getEventsLast(params?: GetEventsLastParams): Promise<TheSportsDBResponse<TheSportsDBEvent[]>> {
  return theSportsDBGetV1<TheSportsDBEvent[]>("eventslast.php", params ? { id: String(params.id) } : undefined);
}

export interface GetEventResultsParams extends QueryParams {
  id?: number | string;
}

export function getEventResults(params?: GetEventResultsParams): Promise<TheSportsDBResponse<any[]>> {
  return theSportsDBGetV1<any[]>("eventresults.php", params ? { id: String(params.id) } : undefined);
}

export interface GetEventTimelineParams extends QueryParams {
  id?: number | string;
}

export function getEventTimeline(params?: GetEventTimelineParams): Promise<TheSportsDBResponse<any[]>> {
  return theSportsDBGetV1<any[]>("lookupeventtimeline.php", params ? { id: String(params.id) } : undefined);
}

export interface GetEventStatsParams extends QueryParams {
  id?: number | string;
}

export function getEventStats(params?: GetEventStatsParams): Promise<TheSportsDBResponse<any[]>> {
  return theSportsDBGetV1<any[]>("lookupeventstats.php", params ? { id: String(params.id) } : undefined);
}

export interface GetEventLineupParams extends QueryParams {
  id?: number | string;
}

export function getEventLineup(params?: GetEventLineupParams): Promise<TheSportsDBResponse<any[]>> {
  return theSportsDBGetV1<any[]>("lookuplineup.php", params ? { id: String(params.id) } : undefined);
}
