import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";


export interface VenueDetail {
  id: number;
  name: string;
  address: string | null;
  city: string;
  country: string;
  capacity: number | null;
  surface: string | null;
  image: string | null;
}

export interface GetVenuesParams {
  id?: number;
  name?: string;
  city?: string;
  country?: string;
  search?: string;
}

/** GET /venues — requires at least one query parameter. */
export function getVenues(
  params: GetVenuesParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<VenueDetail[]>> {
  return apiFootballGet<VenueDetail[]>("/venues", params, options);
}
