import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

export interface Coach {
  id: number;
  name: string;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  birth: { date: string | null; place: string | null; country: string | null };
  nationality: string | null;
  height: string | null;
  weight: string | null;
  photo: string;
  team: { id: number; name: string; logo: string } | null;
  career: {
    team: { id: number; name: string; logo: string };
    start: string;
    end: string | null;
  }[];
}

export interface GetCoachsParams {
  id?: number;
  team?: number;
  search?: string;
}

/** GET /coachs */
export function getCoachs(
  params?: GetCoachsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<Coach[]>> {
  return apiFootballGet<Coach[]>("/coachs", params, options);
}
