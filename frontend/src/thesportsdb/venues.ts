import { theSportsDBGetV1 } from "./client";
import type { QueryParams, TheSportsDBResponse, TheSportsDBVenue } from "./types";

export interface SearchVenuesParams extends QueryParams {
  v?: string;
}

export function searchVenues(params?: SearchVenuesParams): Promise<TheSportsDBResponse<TheSportsDBVenue[]>> {
  return theSportsDBGetV1<TheSportsDBVenue[]>("searchvenues.php", params);
}

export interface GetVenueParams extends QueryParams {
  id?: number | string;
}

export function getVenue(params?: GetVenueParams): Promise<TheSportsDBResponse<TheSportsDBVenue[]>> {
  return theSportsDBGetV1<TheSportsDBVenue[]>("lookupvenue.php", params ? { id: String(params.id) } : undefined);
}
