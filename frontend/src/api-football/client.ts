import type { ApiFootballResponse, QueryParams } from "./types";
import type { LiveMatch, StreamLink } from "./types";

const API_FOOTBALL_URL = "https://v3.football.api-sports.io";

const LIVE_STREAM_URL = "https://football-live-stream-api.p.rapidapi.com";
const LIVE_STREAM_HOST = "football-live-stream-api.p.rapidapi.com";


export interface RequestOptions {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  cache?: RequestCache;
  signal?: AbortSignal;
}


/**
 * API Football Error
 */
export class ApiFootballError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiFootballError";
    this.status = status;
    this.body = body;
  }
}


/**
 * Live Stream Error
 */
export class LiveStreamApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "LiveStreamApiError";
    this.status = status;
    this.body = body;
  }
}


/**
 * Build query
 */
function buildQueryString(params?: QueryParams) {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  const result = query.toString();

  return result ? `?${result}` : "";
}



/**
 * API Football request
 */
export async function apiFootballGet<T>(
  path: string,
  params?: QueryParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<T>> {

  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing FOOTBALL_API_KEY in .env.local"
    );
  }


  const response = await fetch(
    `${API_FOOTBALL_URL}${path}${buildQueryString(params)}`,
    {
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: options?.cache,
      next: options?.next,
      signal: options?.signal,
    }
  );


  const json = await response.json();


  if (!response.ok) {
    throw new ApiFootballError(
      "API Football request failed",
      response.status,
      json
    );
  }


  return json as ApiFootballResponse<T>;
}



/**
 * Live stream request
 */
async function liveStreamRequest<T>(
  path: string,
  options?: RequestOptions
): Promise<T> {

  const apiKey = process.env.LIVE_STREAM_API_KEY;


  if (!apiKey) {
    throw new Error(
      "Missing LIVE_STREAM_API_KEY in .env.local"
    );
  }


  const response = await fetch(
    `${LIVE_STREAM_URL}${path}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": LIVE_STREAM_HOST,
        "x-rapidapi-key": apiKey,
      },
      cache: options?.cache,
      next: options?.next,
      signal: options?.signal,
    }
  );


  const json = await response.json();


  if (!response.ok) {
    throw new LiveStreamApiError(
      "Live Stream API failed",
      response.status,
      json
    );
  }


  return json as T;
}



/**
 * Get all live matches
 */
export async function getAllMatches(
  options?: RequestOptions
): Promise<LiveMatch[]> {

  const data = await liveStreamRequest<unknown>(
    "/all-match",
    {
      next: {
        revalidate: 30,
      },
      ...options,
    }
  );


  /*
    Some APIs return:
    [
      {...}
    ]

    Others return:
    {
      response:[]
    }

    This handles both.
  */

  if (Array.isArray(data)) {
    return data.map((match: any) => ({
      ...match,
      id: String(match.id),
    }));
  }


  if (
    typeof data === "object" &&
    data !== null &&
    "response" in data &&
    Array.isArray((data as any).response)
  ) {
    return (data as any).response.map((match: any) => ({
      ...match,
      id: String(match.id),
    }));
  }


  return [];
}



/**
 * Get stream URL
 */
export async function getStreamLink(
  id: string,
  options?: RequestOptions
): Promise<StreamLink[]> {

  return liveStreamRequest<StreamLink[]>(
    `/link/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
      ...options,
    }
  );
}



/**
 * Media URLs
 */
export const apiFootballMedia = {

  flag: (countryCode: string) =>
    `https://media.api-sports.io/flags/${countryCode}.svg`,

  leagueLogo: (leagueId: number | string) =>
    `https://media.api-sports.io/football/leagues/${leagueId}.png`,

  teamLogo: (teamId: number | string) =>
    `https://media.api-sports.io/football/teams/${teamId}.png`,

  venueImage: (venueId: number | string) =>
    `https://media.api-sports.io/football/venues/${venueId}.png`,

  coachPhoto: (coachId: number | string) =>
    `https://media.api-sports.io/football/coachs/${coachId}.png`,

  playerPhoto: (playerId: number | string) =>
    `https://media.api-sports.io/football/players/${playerId}.png`,
};