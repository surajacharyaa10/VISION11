import { theSportsDBGetV1 } from "./client";
import type { ApiFootballResponse, QueryParams } from "./types";

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

function mapTSDBPlayerToProfile(pl: any, fallbackTeam: string = ""): PlayerProfile {
  const age = pl.dateBorn ? Math.floor((Date.now() - Date.parse(pl.dateBorn)) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
  const bio = `${pl.strPlayer} is a ${pl.strPosition || "footballer"} from ${pl.strNationality || "unknown country"}. ${pl.dateBorn ? `Born ${pl.dateBorn}` : ""}`.trim();

  return {
    id: Number(pl.idPlayer) || 0,
    name: pl.strPlayer,
    photo: pl.strThumb || pl.strCutout || "",
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
    birth: pl.dateBorn ? { date: pl.dateBorn, place: "" } : undefined,
  };
}

export async function getTopScorers(
  params?: GetTopListParams,
  options?: QueryParams
): Promise<ApiFootballResponse<PlayerWithStatistics[]>> {
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
  const players = Array.isArray((res as any)?.player) ? (res as any).player : [];

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
  } as ApiFootballResponse<PlayerWithStatistics[]>;
}

export async function getPlayerProfiles(
  params: GetPlayerProfilesParams,
  options?: QueryParams
): Promise<ApiFootballResponse<PlayerProfile[]>> {
  const search = params.search || params.name;
  if (!search) {
    return {
      get: "",
      parameters: params,
      errors: [],
      results: 0,
      paging: { current: 1, total: 1 },
      response: [],
    } as ApiFootballResponse<PlayerProfile[]>;
  }

  const res = await theSportsDBGetV1<any[]>("searchplayers.php", { p: String(search) });
  const players = Array.isArray((res as any)?.player) ? (res as any).player : [];
  const profiles = players.map((pl: any) => mapTSDBPlayerToProfile(pl));

  return {
    get: "",
    parameters: params,
    errors: [],
    results: profiles.length,
    paging: { current: 1, total: 1 },
    response: profiles,
  } as ApiFootballResponse<PlayerProfile[]>;
}

export async function getPlayerSeasons(
  params?: GetPlayerSeasonsParams,
  options?: QueryParams
): Promise<ApiFootballResponse<number[]>> {
  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: 0,
    paging: { current: 1, total: 1 },
    response: [],
  } as ApiFootballResponse<number[]>;
}

export async function getPlayers(
  params?: GetPlayersParams,
  options?: QueryParams
): Promise<ApiFootballResponse<Player[]>> {
  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: 0,
    paging: { current: 1, total: 1 },
    response: [],
  } as ApiFootballResponse<Player[]>;
}

export async function getPlayerSquads(
  params?: GetPlayerSquadsParams,
  options?: QueryParams
): Promise<ApiFootballResponse<Player[]>> {
  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: 0,
    paging: { current: 1, total: 1 },
    response: [],
  } as ApiFootballResponse<Player[]>;
}

export async function getPlayerTeams(
  params?: GetPlayerTeamsParams,
  options?: QueryParams
): Promise<ApiFootballResponse<Player[]>> {
  return {
    get: "",
    parameters: params ?? {},
    errors: [],
    results: 0,
    paging: { current: 1, total: 1 },
    response: [],
  } as ApiFootballResponse<Player[]>;
}
