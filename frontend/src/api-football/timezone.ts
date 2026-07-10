import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";


/** GET /timezone — list of all valid timezones for the `timezone` fixture param. */
export function getTimezones(
  options?: RequestOptions
): Promise<ApiFootballResponse<string[]>> {
  return apiFootballGet<string[]>("/timezone", undefined, options);
}
