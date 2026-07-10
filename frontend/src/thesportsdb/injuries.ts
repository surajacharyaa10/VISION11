import { theSportsDBGetV1 } from "./client";
import type { QueryParams, TheSportsDBResponse } from "./types";

export interface GetInjuriesParams extends QueryParams {
  league?: number | string;
  fixture?: number | string;
  team?: number | string;
  player?: number | string;
  date?: string;
  search?: string;
}

export function getInjuries(params?: GetInjuriesParams): Promise<TheSportsDBResponse<any[]>> {
  return theSportsDBGetV1<any[]>("injuries.php", params);
}
