import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";


export interface TransferRecord {
  date: string;
  type: string | null;
  teams: {
    in: { id: number; name: string; logo: string };
    out: { id: number; name: string; logo: string };
  };
}

export interface PlayerTransfers {
  player: { id: number; name: string };
  update: string;
  transfers: TransferRecord[];
}

export interface GetTransfersParams {
  player?: number;
  team?: number;
}

/** GET /transfers — requires `player` or `team`. */
export function getTransfers(
  params: GetTransfersParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PlayerTransfers[]>> {
  return apiFootballGet<PlayerTransfers[]>("/transfers", params, options);
}
