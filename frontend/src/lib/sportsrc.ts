const SPORTSRC_BASE = "https://api.sportsrc.org/v2";

export interface SportsrcMatch {
  status_detail: any;
  id: string;
  title: string;
  sport: string;
  category?: string;
  status?: string;
  league?: string;
  country?: string;
  home_team: string;
  away_team: string;
  home_badge?: string;
  away_badge?: string;
  poster?: string;
  popular?: boolean;
  home_score: number | null;
  away_score: number | null;
  display_score?: string;
  time?: string;
  timestamp?: number;
  embed_url?: string;
  sources?: any[];
  raw?: any;
}

export interface SportsrcMatchesResponse {
  success: boolean;
  data: any[];
}

function getApiKey() {
  return process.env.NEXT_PUBLIC_SPORTSRC_API_KEY || process.env.SPORTSRC_API_KEY;
}

function headers() {
  const apiKey = getApiKey();
  const res: Record<string, string> = {
    Accept: "application/json",
  };
  if (apiKey) {
    res["X-API-KEY"] = apiKey;
  }
  return res;
}

function toNumber(val: any): number | null {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

/**
 * The live API returns `data` as an array of LEAGUE groups, each with a
 * `league` object and a `matches` array — NOT a flat array of matches:
 *
 *   { "data": [ { "league": {...}, "matches": [ {...}, {...} ] }, ... ] }
 *
 * The old code assumed a flat array, so normalizeMatch() was being handed
 * league-group objects (no home_team/away_team/title) and silently
 * returning null for almost everything — which is why matches weren't
 * showing up. Some endpoints may still return a flat array directly, so
 * both shapes are supported here.
 */
function flattenLeagueGroups(data: any[]): any[] {
  const flat: any[] = [];
  if (!Array.isArray(data)) return flat;

  for (const item of data) {
    if (!item) continue;

    if (Array.isArray(item.matches)) {
      for (const m of item.matches) {
        if (!m) continue;
        flat.push({ ...m, league: item.league });
      }
    } else {
      flat.push(item);
    }
  }

  return flat;
}

function normalizeMatch(raw: any): SportsrcMatch | null {
  if (!raw) return null;

  const homeTeam = raw.teams?.home?.name || raw.home_team || "";
  const awayTeam = raw.teams?.away?.name || raw.away_team || "";
  const homeBadge = raw.teams?.home?.badge || raw.home_badge || "";
  const awayBadge = raw.teams?.away?.badge || raw.away_badge || "";

  if (!homeTeam && !awayTeam && !raw.title) return null;

  const rawTimestamp = raw.timestamp || raw.date || 0;
  const normalizedTimestamp = rawTimestamp > 100000000000 ? rawTimestamp / 1000 : rawTimestamp;

  const scoreObj = raw.score || {};
  const current = scoreObj.current || {};

  return {
    id: String(raw.id || raw.match_id || ""),
    title: raw.title || `${homeTeam} vs ${awayTeam}`,
    sport: raw.sport || raw.category || "football",
    category: raw.category,
    status: raw.status || undefined,
    status_detail: raw.status_detail,
    league: raw.league?.name || raw.league_name || (typeof raw.league === "string" ? raw.league : "") || "",
    country: raw.league?.country || raw.country,
    home_team: homeTeam,
    away_team: awayTeam,
    home_badge: homeBadge,
    away_badge: awayBadge,
    poster: raw.poster || raw.image || undefined,
    popular: raw.popular,
    home_score: toNumber(raw.home_score ?? current.home ?? scoreObj.home),
    away_score: toNumber(raw.away_score ?? current.away ?? scoreObj.away),
    display_score: raw.display_score || scoreObj.display,
    time: raw.time || raw.start_time || raw.match_date,
    timestamp: normalizedTimestamp,
    embed_url: raw.embed_url || raw.embedUrl || raw.sources?.[0]?.embedUrl,
    sources: raw.sources || [],
    raw,
  };
}

// Status strings the API uses for "currently being played"
const LIVE_STATUSES = new Set(["inprogress", "live", "1h", "2h", "ht", "halftime"]);
// Status strings the API uses for "hasn't started yet"
const UPCOMING_STATUSES = new Set(["notstarted", "not_started", "fixture", "upcoming", "scheduled"]);

export async function getSportsrcMatches(sport = "football", status?: string | string[], date?: string): Promise<SportsrcMatch[]> {
  const today = date || new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const statuses = Array.isArray(status) ? status : status ? [status] : ["inprogress"];

  const wantsLive = statuses.some((s) => s === "inprogress" || s === "live");
  const wantsUpcoming = statuses.some((s) => s === "upcoming" || s === "fixture" || s === "notstarted");

  const fetchPromises: Promise<any>[] = [];

  for (const s of statuses) {
    const datesToFetch = (s === "upcoming" || s === "fixture") ? [today, tomorrow] : [today];

    for (const d of datesToFetch) {
      const url = new URL(`${SPORTSRC_BASE}/`);
      url.searchParams.set("type", "matches");
      url.searchParams.set("category", sport);
      if (s === "inprogress") {
        url.searchParams.set("status", s);
      }
      url.searchParams.set("date", d);

      fetchPromises.push(
        fetch(url.toString(), {
          headers: headers(),
          next: { revalidate: 30 },
        }).then(async (res) => {
          if (!res.ok) {
            console.error(`[Sportsrc] matches request failed for ${s} on ${d}: ${res.status} ${res.statusText}`);
            return { ok: false, data: [] };
          }
          const json = await res.json();
          return { ok: true, data: json?.data };
        }).catch((e) => {
          console.error(`[Sportsrc] matches request threw for ${s} on ${d}:`, e);
          return { ok: false, data: [] };
        })
      );
    }
  }

  try {
    const results = await Promise.all(fetchPromises);
    const dataList: any[] = [];

    for (const result of results) {
      if (result.ok && Array.isArray(result.data)) {
        dataList.push(...flattenLeagueGroups(result.data));
      }
    }

    const now = Date.now() / 1000;
    const twentyFourHours = 24 * 60 * 60;
    const fiveMinutesGrace = 5 * 60;

    const matches: SportsrcMatch[] = [];
    const seenIds = new Set<string>();

    for (const item of dataList) {
      const normalized = normalizeMatch(item);
      if (!normalized) continue;
      if (!normalized.id || seenIds.has(normalized.id)) continue;

      const ts = normalized.timestamp || 0;
      const apiStatus = (normalized.status || "").toLowerCase();

      if (LIVE_STATUSES.has(apiStatus)) {
        if (!wantsLive) continue;
        seenIds.add(normalized.id);
        matches.push({ ...normalized, status: "inprogress" });
        continue;
      }

      if (UPCOMING_STATUSES.has(apiStatus)) {
        if (!wantsUpcoming) continue;
        // small grace window in case a match just kicked off but the feed
        // hasn't flipped its status to inprogress yet
        if (ts > now - fiveMinutesGrace && ts <= now + twentyFourHours) {
          seenIds.add(normalized.id);
          matches.push({ ...normalized, status: "upcoming" });
        }
        continue;
      }

      // Fallback for feeds that don't set a recognizable status string:
      // classify purely by kickoff time.
      if (!apiStatus && ts > 0) {
        if (wantsLive && ts <= now && ts > now - 2 * 60 * 60) {
          seenIds.add(normalized.id);
          matches.push({ ...normalized, status: "inprogress" });
        } else if (wantsUpcoming && ts > now && ts <= now + twentyFourHours) {
          seenIds.add(normalized.id);
          matches.push({ ...normalized, status: "upcoming" });
        }
      }

      // Anything else (finished, postponed, cancelled, etc.) is intentionally skipped.
    }

    return matches;
  } catch (e) {
    console.error("[Sportsrc] getSportsrcMatches error", e);
    return [];
  }
}

export async function getSportsrcMatchDetail(matchId: string): Promise<SportsrcMatch | null> {
  const url = new URL(`${SPORTSRC_BASE}/`);
  url.searchParams.set("type", "detail");
  url.searchParams.set("id", matchId);

  try {
    const res = await fetch(url.toString(), {
      headers: headers(),
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.error(`[Sportsrc] detail request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = (await res.json()) as any;
    const data = json?.data;
    if (!data) return null;

    const mi = data.match_info || data;
    const scoreObj = mi.score || {};
    const current = scoreObj.current || scoreObj;
    const teams = mi.teams || {};
    const league = mi.league || {};
    const sources = Array.isArray(data.sources) ? data.sources : (Array.isArray(mi.sources) ? mi.sources : []);

    const homeTeam = teams.home?.name || "";
    const awayTeam = teams.away?.name || "";

    if (!homeTeam && !awayTeam && !mi.title) return null;

    const embedUrl = sources.find((s: any) => s.embedUrl)?.embedUrl || undefined;

    const rawTimestamp = mi.timestamp || mi.date || 0;
    const normalizedTimestamp = rawTimestamp > 100000000000 ? rawTimestamp / 1000 : rawTimestamp;

    return {
      id: String(mi.id || matchId),
      title: mi.title || `${homeTeam} vs ${awayTeam}`,
      sport: mi.sport || "football",
      status: mi.status || "unknown",
      status_detail: mi.status_detail,
      league: league.name || "",
      country: league.country,
      home_team: homeTeam,
      away_team: awayTeam,
      home_badge: teams.home?.badge,
      away_badge: teams.away?.badge,
      home_score: toNumber(current.home ?? scoreObj.home),
      away_score: toNumber(current.away ?? scoreObj.away),
      display_score: scoreObj.display,
      time: mi.time || mi.start_time || mi.match_date,
      timestamp: normalizedTimestamp,
      embed_url: embedUrl,
      sources,
      raw: data,
    };
  } catch (e) {
    console.error("[Sportsrc] getSportsrcMatchDetail error", e);
    return null;
  }
}

export async function getSportsrcLeagues(): Promise<any[]> {
  const url = new URL(`${SPORTSRC_BASE}/`);
  url.searchParams.set("type", "leagues");

  try {
    const res = await fetch(url.toString(), {
      headers: headers(),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`[Sportsrc] leagues request failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = (await res.json()) as any;
    return Array.isArray(json?.data) ? json.data : [];
  } catch (e) {
    console.error("[Sportsrc] getSportsrcLeagues error", e);
    return [];
  }
}

export async function getSportsrcLeagueStandings(leagueId: string | number): Promise<any[]> {
  const url = new URL(`${SPORTSRC_BASE}/`);
  url.searchParams.set("type", "tables");
  url.searchParams.set("league", String(leagueId));

  try {
    const res = await fetch(url.toString(), {
      headers: headers(),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`[Sportsrc] standings request failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = (await res.json()) as any;
    const data = json?.data;
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  } catch (e) {
    console.error("[Sportsrc] getSportsrcLeagueStandings error", e);
    return [];
  }
}

export async function getSportsrcMatchResults(leagueId: string | number): Promise<any[]> {
  const url = new URL(`${SPORTSRC_BASE}/`);
  url.searchParams.set("type", "scores");
  url.searchParams.set("league", String(leagueId));

  try {
    const res = await fetch(url.toString(), {
      headers: headers(),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`[Sportsrc] scores request failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = (await res.json()) as any;
    const data = json?.data;
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  } catch (e) {
    console.error("[Sportsrc] getSportsrcMatchResults error", e);
    return [];
  }
}