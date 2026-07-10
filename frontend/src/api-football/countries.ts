import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

export interface Country {
  name: string;
  code: string | null;
  flag: string | null;
}

export interface GetCountriesParams {
  name?: string;
  code?: string;
  search?: string;
}

/** GET /countries */
export function getCountries(
  params?: GetCountriesParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<Country[]>> {
  return apiFootballGet<Country[]>("/countries", params, options);
}
