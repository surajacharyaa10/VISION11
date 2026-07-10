/**
 * Shared types for the API-Football (v3.football.api-sports.io) client.
 */

export interface ApiFootballPaging {
  current: number;
  total: number;
}

export interface ApiFootballResponse<T> {
  get: string;
  parameters: Record<string, string> | unknown[];
  errors: unknown[] | Record<string, string>;
  results: number;
  paging: ApiFootballPaging;
  response: T;
}

/** Generic query-param bag. `undefined` values are stripped before the request. */
export type QueryParams = Record<string, string | number | boolean | undefined>;


export interface LiveMatchTeam {
  name: string;
  logo?: string;
}

export interface LiveMatch {
  id: string;
  name?: string;
  league?: string;
  status?: string; // e.g. "live", "upcoming", "finished" — provider-specific
  startTime?: string;
  home?: LiveMatchTeam;
  away?: LiveMatchTeam;
  /** Fallback bag for any fields not modeled above. */
  raw?: Record<string, unknown>;
}

export interface StreamLink {
  id: string;
  url: string;
  quality?: string;
  language?: string;
  type?: string; // e.g. "m3u8", "iframe", "embed"
  raw?: Record<string, unknown>;
}
