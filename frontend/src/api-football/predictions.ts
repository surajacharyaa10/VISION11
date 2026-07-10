import { apiFootballGet, RequestOptions } from "./client";
import type { ApiFootballResponse } from "./types";

export interface PredictionPredictions {
  winner: { id: number | null; name: string | null; comment: string | null };
  win_or_draw: boolean;
  under_over: string | null;
  goals: { home: string | null; away: string | null };
  advice: string;
  percent: { home: string; draw: string; away: string };
}

export interface PredictionResponseItem {
  predictions: PredictionPredictions;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
  };
  teams: {
    home: { id: number; name: string; logo: string; last_5: unknown; league: unknown };
    away: { id: number; name: string; logo: string; last_5: unknown; league: unknown };
  };
  comparison: unknown;
  h2h: unknown[];
}

export interface GetPredictionsParams {
  fixture: number;
}

/** GET /predictions */
export function getPredictions(
  params: GetPredictionsParams,
  options?: RequestOptions
): Promise<ApiFootballResponse<PredictionResponseItem[]>> {
  return apiFootballGet<PredictionResponseItem[]>("/predictions", params, options);
}
