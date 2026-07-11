import type { QueryParams, TheSportsDBResponse, TheSportsDBEvent, LiveMatch, StreamLink } from "./types";

const V1_BASE = "https://www.thesportsdb.com/api/v1/json";
const V2_BASE = "https://www.thesportsdb.com/api/v2/json";

const TEST_KEYS = new Set(["123", "1"]);

const CONFIGURED_KEYS = [
  process.env.THESPORTSDB_API_KEY,
  process.env.NEXT_PUBLIC_THESPORTSDB_API_KEY,
].filter((k): k is string => Boolean(k));

const HAS_REAL_KEY = CONFIGURED_KEYS.some((k) => !TEST_KEYS.has(k));

const FREE_KEYS = [...CONFIGURED_KEYS, "123", "1"].filter(
  (k, i, arr): k is string => Boolean(k) && arr.indexOf(k) === i
);

/**
 * TheSportsDB's free/test keys ("123", "1") silently truncate many
 * endpoints (e.g. lookuptable.php caps at 5 rows vs 100 on a premium key).
 * If we configured a real key but end up falling back to a test key,
 * warn loudly instead of quietly returning a truncated table.
 */
function warnIfUsingTestKeyFallback(usedKey: string, endpoint: string) {
  if (HAS_REAL_KEY && TEST_KEYS.has(usedKey)) {
    console.warn(
      `[TheSportsDB] Falling back to limited test key "${usedKey}" for "${endpoint}". ` +
      `Your configured THESPORTSDB_API_KEY failed (bad/expired key?) — results may be truncated ` +
      `(e.g. lookuptable.php is capped at 5 rows on test keys vs 100 on a premium key).`
    );
  }
}

/**
 * TheSportsDB caps lookuptable responses to 5 rows on free/test API keys.
 * We expose this cap so callers can detect a likely truncation.
 */
const LOOKUPTABLE_FREE_KEY_CAP = 5;

export function isLikelyTruncated(response: any, expectedTotal: number): boolean {
  const rows = Array.isArray(response?.table) ? response.table.length : 0;
  if (expectedTotal > LOOKUPTABLE_FREE_KEY_CAP && rows <= LOOKUPTABLE_FREE_KEY_CAP) {
    return true;
  }
  return false;
}

export interface RequestOptions {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  cache?: RequestCache;
  signal?: AbortSignal;
}

export class TheSportsDBError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "TheSportsDBError";
    this.status = status;
    this.body = body;
  }
}

function buildQuery(params?: QueryParams): URLSearchParams {
  const q = new URLSearchParams();
  if (!params) return q;
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      q.append(k, String(v));
    }
  });
  return q;
}

async function v1Raw<T>(endpoint: string, params?: QueryParams, options?: RequestOptions): Promise<TheSportsDBResponse<T>> {
  const keys = FREE_KEYS.length > 0 ? FREE_KEYS : ["123"];
  let lastError: unknown = null;

  for (const key of keys) {
    try {
      const url = `${V1_BASE}/${encodeURIComponent(key)}/${endpoint}`;
      const qs = buildQuery(params);
      const full = qs.toString() ? `${url}?${qs.toString()}` : url;

      const res = await fetch(full, {
        headers: { Accept: "application/json" },
        cache: options?.cache,
        next: options?.next,
        signal: options?.signal,
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        warnIfUsingTestKeyFallback(key, endpoint);

        let arrayResult: any[] = [];
        let objectResult: Record<string, any> = {};

        if (Array.isArray(json)) {
          arrayResult = json;
        } else if (json && typeof json === "object") {
          objectResult = json;
          const arrKeys = ["events", "teams", "players", "venues", "table", "timeline", "lineups", "eventstats", "leagues", "results", "playerstats", "honours", "formerteams", "contracts", "milestones", "sidelined", "injuries", "predictions", "odds", "bookmakers", "bets", "tv", "team"];
          for (const k of arrKeys) {
            if (Array.isArray(json[k])) {
              arrayResult = json[k];
              break;
            }
          }
        }

        return {
          get: full,
          parameters: params ?? {},
          errors: json.errors ?? [],
          results: arrayResult.length,
          paging: { current: 1, total: 1 },
          response: arrayResult.length > 0 ? arrayResult : objectResult,
        } as TheSportsDBResponse<T>;
      }

      if (res.status === 429 || res.status >= 500) {
        lastError = new TheSportsDBError("TheSportsDB v1 rate/server error", res.status, json);
        continue;
      }

      throw new TheSportsDBError("TheSportsDB v1 request failed", res.status, json);
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError instanceof Error ? lastError : new TheSportsDBError("All TheSportsDB keys failed", 0, null);
}

async function v2Raw<T>(endpoint: string, params?: QueryParams, options?: RequestOptions): Promise<TheSportsDBResponse<T>> {
  const keys = FREE_KEYS.filter((k): k is string => Boolean(k));
  if (keys.length === 0) {
    throw new TheSportsDBError("Missing THESPORTSDB_API_KEY", 401, null);
  }

  let lastError: unknown = null;

  for (const key of keys) {
    try {
      const url = `${V2_BASE}/${endpoint}`;
      const qs = buildQuery(params);
      const full = qs.toString() ? `${url}?${qs.toString()}` : url;

      const res = await fetch(full, {
        headers: {
          Accept: "application/json",
          "X-API-KEY": String(key),
        },
        cache: options?.cache,
        next: options?.next,
        signal: options?.signal,
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        const arr = Array.isArray(json) ? json : (json?.response ?? json);
        return {
          get: full,
          parameters: params ?? {},
          errors: json.errors ?? [],
          results: Array.isArray(arr) ? arr.length : 0,
          paging: { current: 1, total: 1 },
          response: arr,
        } as TheSportsDBResponse<T>;
      }

      if (res.status === 429 || res.status >= 500) {
        lastError = new TheSportsDBError("TheSportsDB v2 rate/server error", res.status, json);
        continue;
      }

      throw new TheSportsDBError("TheSportsDB v2 request failed", res.status, json);
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError instanceof Error ? lastError : new TheSportsDBError("All TheSportsDB v2 keys failed", 0, null);
}

export async function theSportsDBGetV1<T>(
  endpoint: string,
  params?: QueryParams,
  options?: RequestOptions
): Promise<TheSportsDBResponse<T>> {
  return v1Raw<T>(endpoint, params, options);
}

export async function theSportsDBGetV2<T>(
  endpoint: string,
  params?: QueryParams,
  options?: RequestOptions
): Promise<TheSportsDBResponse<T>> {
  return v2Raw<T>(endpoint, params, options);
}

export async function theSportsDBGet<T>(
  endpoint: string,
  params?: QueryParams,
  options?: RequestOptions,
  preferV2: boolean = false
): Promise<TheSportsDBResponse<T>> {
  if (preferV2) {
    try {
      return await v2Raw<T>(endpoint, params, options);
    } catch (e) {
      if ((e as TheSportsDBError).status === 401) {
        return v1Raw<T>(endpoint, params, options);
      }
      throw e;
    }
  }
  return v1Raw<T>(endpoint, params, options);
}

export async function getAllMatchesTSDB(options?: RequestOptions): Promise<LiveMatch[]> {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);

  const [upcomingRes, finishedRes] = await Promise.all([
    theSportsDBGetV1<any>("eventsnextleague.php", { id: "4328" }),
    theSportsDBGetV1<any>("eventspastleague.php", { id: "4328" }),
  ]);

  const upcoming = Array.isArray((upcomingRes as any)?.events) ? (upcomingRes as any).events : [];
  const finished = Array.isArray((finishedRes as any)?.events) ? (finishedRes as any).events : [];

  const seen = new Set<string>();
  const merged = [...upcoming, ...finished].filter((m: any) => {
    const id = String(m.idEvent ?? m.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return merged.map((ev: any) => {
    const ts = ev.strTimestamp ? Date.parse(ev.strTimestamp) : NaN;
    const startTime = Number.isNaN(ts) ? new Date().toISOString() : new Date(ts).toISOString();

    return {
      id: String(ev.idEvent ?? ev.id),
      name: ev.strEvent ?? ev.strEvent,
      league: ev.strLeague || undefined,
      status: ev.strStatus === "FT" ? "finished" : ev.strStatus === "NS" ? "upcoming" : "live",
      startTime,
      home: {
        name: ev.strHomeTeam,
        logo: ev.strHomeTeamBadge || undefined,
      },
      away: {
        name: ev.strAwayTeam,
        logo: ev.strAwayTeamBadge || undefined,
      },
      raw: ev,
    } as LiveMatch;
  });
}

const LIVE_STREAM_URL = "https://football-live-stream-api.p.rapidapi.com";
const LIVE_STREAM_HOST = "football-live-stream-api.p.rapidapi.com";

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

async function liveStreamRequest<T>(
  path: string,
  options?: RequestOptions
): Promise<T> {
  const apiKey = process.env.LIVE_STREAM_API_KEY;
  if (!apiKey) {
    throw new Error("Missing LIVE_STREAM_API_KEY in .env.local");
  }

  const response = await fetch(`${LIVE_STREAM_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": LIVE_STREAM_HOST,
      "x-rapidapi-key": apiKey,
    },
    cache: options?.cache,
    next: options?.next,
    signal: options?.signal,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new LiveStreamApiError("Live Stream API failed", response.status, json);
  }

  return json as T;
}

export async function getAllMatches(
  options?: RequestOptions
): Promise<LiveMatch[]> {
  try {
    return await getAllMatchesTSDB(options);
  } catch {
    const data = await liveStreamRequest<unknown>("/all-match", {
      next: { revalidate: 30 },
      ...options,
    });

    if (Array.isArray(data)) {
      return data.map((match: any) => ({ ...match, id: String(match.id) }));
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "response" in data &&
      Array.isArray((data as any).response)
    ) {
      return (data as any).response.map((match: any) => ({ ...match, id: String(match.id) }));
    }

    return [];
  }
}

export async function getStreamLink(
  id: string,
  options?: RequestOptions
): Promise<StreamLink[]> {
  return liveStreamRequest<StreamLink[]>(`/link/${encodeURIComponent(id)}`, {
    cache: "no-store",
    ...options,
  });
}

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