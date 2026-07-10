import { theSportsDBGetV1, theSportsDBGetV2, type RequestOptions } from "./client";
import type { TheSportsDBResponse, QueryParams } from "./types";

export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: { date: string; place: string; country: string };
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}

export interface PlayerWithStatistics {
  player: {
    id: number;
    name: string;
    nationality: string;
    photo: string;
    birth: { date: string; place: string };
    age?: number;
  };
  statistics: any[];
}

export interface PlayerProfile {
  id: number;
  name: string;
  photo: string;
  club: string;
  country: string;
  nationality: string;
  position: string;
  age: number;
  rating: number;
  goals: number;
  assists: number;
  matches: number;
  bio: string;
  birth?: { date: string; place: string };
  height?: string;
  weight?: string;
  birthLocation?: string;
  status?: string;
  number?: string;
  team?: string;
  socials?: { facebook?: string; twitter?: string; instagram?: string };
}

export interface GetPlayerSeasonsParams extends QueryParams {
  player?: number;
}

export interface GetPlayerProfilesParams extends QueryParams {
  id?: number;
  search?: string;
  name?: string;
  nationality?: string;
  position?: string;
  birthdate?: string;
}

export interface GetPlayersParams extends QueryParams {
  id?: number;
  name?: string;
  team?: number;
  league?: number;
  season?: number;
  search?: string;
  page?: number;
}

export interface GetPlayerSquadsParams extends QueryParams {
  team?: number;
  player?: number;
  search?: string;
}

export interface GetPlayerTeamsParams extends QueryParams {
  player?: number;
  search?: string;
}

export interface GetTopListParams extends QueryParams {
  league?: number;
  season?: number;
  type?: string;
}

/**
 * Extract the player array from a TheSportsDB v1 response.
 * The client wraps data under `response`, which is either the array itself or
 * the original JSON object (e.g. `{ player: [...] }`).
 */
function playersFromResponse(res: any): any[] {
  const r = res?.response;
  if (Array.isArray(r)) return r;
  if (r && Array.isArray(r.player)) return r.player;
  if (Array.isArray(res?.player)) return res.player;
  return [];
}

/** Extract an array stored under `key` from a response's `response` object. */
function arrayFromResponse(res: any, key: string): any[] {
  const r = res?.response;
  if (Array.isArray(r)) return r;
  if (r && Array.isArray(r[key])) return r[key];
  if (Array.isArray(res?.[key])) return res[key];
  return [];
}

function mapTSDBPlayerToProfile(pl: any, fallbackTeam: string = ""): PlayerProfile {
  const age = pl.dateBorn ? Math.floor((Date.now() - Date.parse(pl.dateBorn)) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
  // Prefer the rich biography from lookupplayer.php; fall back to a generated one.
  const bio =
    pl.strDescriptionEN && pl.strDescriptionEN.trim().length > 0
      ? pl.strDescriptionEN.replace(/\r\n/g, "\n").trim()
      : `${pl.strPlayer} is a ${pl.strPosition || "footballer"} from ${pl.strNationality || "unknown country"}. ${pl.dateBorn ? `Born ${pl.dateBorn}` : ""}`.trim();

  return {
    id: Number(pl.idPlayer) || 0,
    name: pl.strPlayer,
    photo: pl.strThumb || pl.strCutout || pl.strRender || "",
    club: pl.strTeam || fallbackTeam || "Free Agent",
    country: pl.strNationality || "Unknown",
    nationality: pl.strNationality || "Unknown",
    position: pl.strPosition || "Unknown",
    age: age > 0 && age < 120 ? age : 0,
    rating: 0,
    goals: 0,
    assists: 0,
    matches: 0,
    bio,
    birth: pl.dateBorn ? { date: pl.dateBorn, place: pl.strBirthLocation || "" } : undefined,
    height: pl.strHeight || undefined,
    weight: pl.strWeight || undefined,
    birthLocation: pl.strBirthLocation || undefined,
    status: pl.strStatus || undefined,
    number: pl.strNumber || undefined,
    team: pl.strTeam || fallbackTeam || "Free Agent",
    socials: {
      facebook: pl.strFacebook || undefined,
      twitter: pl.strTwitter || undefined,
      instagram: pl.strInstagram || undefined,
    },
  };
}

export async function getTopScorers(
  params?: GetTopListParams,
  options?: QueryParams
): Promise<TheSportsDBResponse<PlayerWithStatistics[]>> {
  const leagueMap: Record<number, string> = {
    39: "English Premier League",
    140: "Spanish La Liga",
    135: "Italian Serie A",
    61: "French Ligue 1",
    78: "German Bundesliga",
    2: "UEFA Champions League",
    88: "Dutch Eredivisie",
    40: "English Championship",
    94: "Portuguese Primeira Liga",
    71: "Brasileiro Serie A",
    1: "FIFA World Cup",
    4: "European Championship",
  };

  const searchTerm = params?.league ? (leagueMap[params.league] || `league ${params.league}`) : "football";
  const res = await theSportsDBGetV1<any[]>("searchplayers.php", { p: searchTerm });
  const players = playersFromResponse(res);

  const mapped = players.slice(0, 30).map((pl: any) => ({
    player: {
      id: Number(pl.idPlayer) || 0,
      name: pl.strPlayer,
      nationality: pl.strNationality || "",
      photo: pl.strThumb || pl.strCutout || "",
      birth: { date: pl.dateBorn || "", place: "" },
    },
    statistics: [
      {
        team: { id: Number(pl.idTeam) || 0, name: pl.strTeam || "" },
        league: { id: Number(params?.league) || 0, name: "" },
        games: { appearences: 0, minutes: 0, position: pl.strPosition || "", rating: undefined },
        goals: { total: 0, assists: 0 },
      },
    ],
  }));

  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: mapped.length,
    paging: { current: 1, total: 1 },
    response: mapped,
  } as TheSportsDBResponse<PlayerWithStatistics[]>;
}

export async function getPlayerProfiles(
  params: GetPlayerProfilesParams,
  options?: RequestOptions
): Promise<TheSportsDBResponse<PlayerProfile[]>> {
  const search = params.search || params.name;
  if (!search) {
    return {
      get: "",
      parameters: params,
      errors: [],
      results: 0,
      paging: { current: 1, total: 1 },
      response: [],
    } as TheSportsDBResponse<PlayerProfile[]>;
  }

  const res = await theSportsDBGetV1<any[]>("searchplayers.php", { p: String(search) });
  const players = playersFromResponse(res);
  const profiles = (
    await Promise.all(
      players.slice(0, 20).map(async (pl: any) => {
        const id = pl.idPlayer;
        if (id) return getPlayerProfileById(String(id), pl, options);
        return mapTSDBPlayerToProfile(pl);
      })
    )
  ).filter(Boolean) as PlayerProfile[];

  return {
    get: "",
    parameters: params,
    errors: [],
    results: profiles.length,
    paging: { current: 1, total: 1 },
    response: profiles,
  } as TheSportsDBResponse<PlayerProfile[]>;
}

export async function getPlayerSeasons(
  params?: GetPlayerSeasonsParams,
  options?: RequestOptions
): Promise<TheSportsDBResponse<number[]>> {
  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: 0,
    paging: { current: 1, total: 1 },
    response: [],
  } as TheSportsDBResponse<number[]>;
}

export async function getPlayers(
  params?: GetPlayersParams,
  options?: RequestOptions
): Promise<TheSportsDBResponse<Player[]>> {
  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: 0,
    paging: { current: 1, total: 1 },
    response: [],
  } as TheSportsDBResponse<Player[]>;
}

export async function getPlayerSquads(
  params?: GetPlayerSquadsParams,
  options?: RequestOptions
): Promise<TheSportsDBResponse<Player[]>> {
  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: 0,
    paging: { current: 1, total: 1 },
    response: [],
  } as TheSportsDBResponse<Player[]>;
}

export async function getPlayerTeams(
  params?: GetPlayerTeamsParams,
  options?: RequestOptions
): Promise<TheSportsDBResponse<Player[]>> {
  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: 0,
    paging: { current: 1, total: 1 },
    response: [],
  } as TheSportsDBResponse<Player[]>;
}

export interface PlayerDetail {
  profile: PlayerProfile | null;
  honours: any[];
  milestones: any[];
  contracts: any[];
  results: any[];
  stats: any[];
}


export async function getPlayerDetail(
  id: number | string,
  options?: RequestOptions
): Promise<PlayerDetail> {
  const pid = String(id);

  const [playerRes, honoursRes, milestonesRes, v1ContractsRes, resultsRes, statsRes] =
    await Promise.all([
      theSportsDBGetV1<any>("lookupplayer.php", { id: pid }, options),
      theSportsDBGetV1<any>("lookuphonours.php", { id: pid }, options),
      theSportsDBGetV1<any>("lookupmilestones.php", { id: pid }, options),
      // Full contract history (all clubs) comes from the v1 endpoint.
      theSportsDBGetV1<any>("lookupcontracts.php", { id: pid }, options).catch(() => null),
      theSportsDBGetV1<any>("playerresults.php", { id: pid }, options),
      theSportsDBGetV1<any>("lookupplayerstats.php", { id: pid }, options),
    ]);

  // The current contract also comes from the v2 endpoint, which takes the id
  // as a path parameter: /api/v2/json/lookup/player_contracts/{id}
  let v2ContractsRes: any = null;
  try {
    v2ContractsRes = await theSportsDBGetV2<any>(`lookup/player_contracts/${pid}`, undefined, options);
  } catch {
    v2ContractsRes = null;
  }

  const playerArr = arrayFromResponse(playerRes, "players");
  const profile = playerArr.length ? mapTSDBPlayerToProfile(playerArr[0]) : null;

  // Merge v1 (full history) + v2 (current) so every club is shown, deduped.
  const contracts = mergeContracts(
    arrayFromResponse(v1ContractsRes, "contracts"),
    contractsArrayFromResponse(v2ContractsRes)
  );

  return {
    profile,
    honours: arrayFromResponse(honoursRes, "honours"),
    milestones: arrayFromResponse(milestonesRes, "milestones"),
    contracts,
    results: arrayFromResponse(resultsRes, "results"),
    stats: arrayFromResponse(statsRes, "playerstats"),
  };
}

/** v2 `lookup/player_contracts` may nest the list under several key names. */
function contractsArrayFromResponse(res: any): any[] {
  const r = res?.response ?? res;
  if (Array.isArray(r)) return r;
  const keys = ["contracts", "player_contracts", "transfers", "contract", "player_contract"];
  for (const k of keys) {
    if (Array.isArray(r?.[k])) return r[k];
  }
  if (Array.isArray(res?.contracts)) return res.contracts;
  return [];
}

/** Merge v1 + v2 contracts, dropping duplicates by team + year range. */
function mergeContracts(v1: any[], v2: any[]): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const c of [...v1, ...v2]) {
    if (!c) continue;
    const team = c.strTeam || c.strFormerTeam || c.strTeam2 || "";
    const key = `${team}|${c.strYearStart || ""}|${c.strYearEnd || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out.sort((a, b) => Number(a.strYearStart || 0) - Number(b.strYearStart || 0));
}

/** Curated list of world-class players shown by default on the players page.
 * Uses common searchable names so searchplayers matches the right player. */
const FEATURED_PLAYERS = [

  "Lionel Messi",

  "Lamine Yamal",

  "Pablo Martín Páez Gavira",

  "Cristiano Ronaldo",

  "Kylian Mbappe",

  "Erling Haaland",

  "Neymar",

  "Edson Arantes do Nascimento",

  "Diego Armando Maradona",

  "Harry Kane",

  "Luis Alberto Suárez Díaz",

  "Pedro González López",

];

/**
 * Build a full profile for a player by id. `lookupplayer.php` gives the real
 * position / age / bio, and `lookupplayerstats.php` fills in season goals,
 * assists and appearances so cards don't show "Unknown" / all zeros.
 * `searchPl` is the original search result, used as a fallback if the lookup
 * fails (e.g. returns no position).
 */
async function getPlayerProfileById(
  id: string,
  searchPl?: any,
  options?: RequestOptions
): Promise<PlayerProfile | null> {
  try {
    const [playerRes, statsRes] = await Promise.all([
      theSportsDBGetV1<any>("lookupplayer.php", { id }, options).catch(() => null),
      theSportsDBGetV1<any>("lookupplayerstats.php", { id }, options).catch(() => null),
    ]);
    const arr = arrayFromResponse(playerRes, "players");
    const base = arr.length ? arr[0] : searchPl;
    if (!base) return null;

    const profile = mapTSDBPlayerToProfile(base);
    const stats = arrayFromResponse(statsRes, "playerstats");

    if (stats.length) {
      const latest = stats[0];
      const goals = Number(latest.totalGoals ?? latest.intGoals ?? 0) || 0;
      const assists = Number(latest.totalAssists ?? latest.intAssists ?? 0) || 0;
      const matches = Number(latest.strAppearances ?? latest.intAppearances ?? 0) || 0;
      profile.goals = goals;
      profile.assists = assists;
      profile.matches = matches;
      profile.rating = goals + assists > 0 ? Math.min(99, 60 + goals * 2 + assists) : 0;
      // Some lookupplayer records omit strPosition; fall back to season stats.
      if (!profile.position || profile.position === "Unknown") {
        profile.position = latest.strPosition || profile.position;
      }
    }

    return profile;
  } catch {
    return searchPl ? mapTSDBPlayerToProfile(searchPl) : null;
  }
}

export async function getFeaturedPlayers(
  options?: RequestOptions
): Promise<PlayerProfile[]> {
  const results = await Promise.all(
    FEATURED_PLAYERS.map(async (name) => {
      try {
        const res = await theSportsDBGetV1<any>("searchplayers.php", { p: name }, options);
        const players = playersFromResponse(res);
        const pl = players[0];
        if (!pl?.idPlayer) return null;
        return await getPlayerProfileById(String(pl.idPlayer), pl, options);
      } catch {
        return null;
      }
    })
  );
  return results.filter(Boolean) as PlayerProfile[];
}
