/**
 * football-data.org v4 — Full API Client
 * Covers every available resource/sub-resource endpoint.
 *
 * All functions return the raw parsed JSON from the API.
 * On failure they throw so callers can catch and use fallbacks.
 *
 * Base URL : https://api.football-data.org/v4
 * Auth     : X-Auth-Token header (set via FOOTBALL_DATA_API_KEY env var)
 *
 * Usage example:
 *   import { getCompetitionStandings, getLiveMatches } from "@/app/lib/api/footballApi";
 *   const standings = await getCompetitionStandings("PL");
 *   const live      = await getLiveMatches();
 */

import { footballDataApi } from "./footballDataApi";

// ─── Helper: build query string from a plain object ──────────────────────────
function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
}

// ════════════════════════════════════════════════════════════════════════════
// AREAS
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /v4/areas/
 * List all available areas (countries, continents, etc.)
 */
export async function getAreas() {
  return footballDataApi("/areas");
}

/**
 * GET /v4/areas/{id}
 * Get one particular area by ID.
 *
 * @param {number} id  Area ID (e.g. 2072 for England)
 */
export async function getArea(id) {
  return footballDataApi(`/areas/${id}`);
}

// ════════════════════════════════════════════════════════════════════════════
// COMPETITIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /v4/competitions/
 * List all available competitions.
 *
 * @param {{ areas?: string }} [filters]
 *   areas – comma-separated area IDs to filter by (e.g. "2072,2081")
 */
export async function getCompetitions(filters = {}) {
  return footballDataApi(`/competitions${buildQuery(filters)}`);
}

/**
 * GET /v4/competitions/{id}
 * Get one particular competition by ID or code.
 *
 * @param {number|string} id  Competition ID or code (e.g. 2021 or "PL")
 */
export async function getCompetition(id) {
  return footballDataApi(`/competitions/${id}`);
}

// ─── Competition sub-resources ────────────────────────────────────────────────

/**
 * GET /v4/competitions/{id}/standings
 * Show standings for a competition.
 *
 * @param {number|string} id
 * @param {{ matchday?: number, season?: number, date?: string }} [filters]
 */
export async function getCompetitionStandings(id, filters = {}) {
  return footballDataApi(`/competitions/${id}/standings${buildQuery(filters)}`);
}

/**
 * GET /v4/competitions/{id}/matches
 * List all matches for a competition.
 *
 * @param {number|string} id
 * @param {{
 *   dateFrom?: string,
 *   dateTo?: string,
 *   stage?: string,
 *   status?: string,
 *   matchday?: number,
 *   group?: string,
 *   season?: number,
 * }} [filters]
 */
export async function getCompetitionMatches(id, filters = {}) {
  return footballDataApi(`/competitions/${id}/matches${buildQuery(filters)}`);
}

/**
 * GET /v4/competitions/{id}/teams
 * List all teams for a competition.
 *
 * @param {number|string} id
 * @param {{ season?: number }} [filters]
 */
export async function getCompetitionTeams(id, filters = {}) {
  return footballDataApi(`/competitions/${id}/teams${buildQuery(filters)}`);
}

/**
 * GET /v4/competitions/{id}/scorers
 * List top scorers for a competition.
 *
 * @param {number|string} id
 * @param {{ limit?: number, season?: number }} [filters]
 */
export async function getCompetitionScorers(id, filters = {}) {
  return footballDataApi(`/competitions/${id}/scorers${buildQuery(filters)}`);
}

// ════════════════════════════════════════════════════════════════════════════
// TEAMS
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /v4/teams/
 * List teams (paginated).
 *
 * @param {{ limit?: number, offset?: number }} [filters]
 */
export async function getTeams(filters = {}) {
  return footballDataApi(`/teams${buildQuery(filters)}`);
}

/**
 * GET /v4/teams/{id}
 * Show one particular team.
 *
 * @param {number} id  Team ID (e.g. 57 for Arsenal)
 */
export async function getTeam(id) {
  return footballDataApi(`/teams/${id}`);
}

/**
 * GET /v4/teams/{id}/matches/
 * Show all matches for a particular team.
 *
 * @param {number} id
 * @param {{
 *   dateFrom?: string,
 *   dateTo?: string,
 *   season?: number,
 *   competitions?: string,
 *   status?: string,
 *   venue?: string,
 *   limit?: number,
 * }} [filters]
 */
export async function getTeamMatches(id, filters = {}) {
  return footballDataApi(`/teams/${id}/matches${buildQuery(filters)}`);
}

// ════════════════════════════════════════════════════════════════════════════
// PERSONS (Players / Managers)
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /v4/persons/{id}
 * List one particular person (player or manager).
 *
 * @param {number} id  Person ID
 */
export async function getPerson(id) {
  return footballDataApi(`/persons/${id}`);
}

/**
 * GET /v4/persons/{id}/matches
 * Show all matches for a particular person.
 *
 * @param {number} id
 * @param {{
 *   dateFrom?: string,
 *   dateTo?: string,
 *   status?: string,
 *   competitions?: string,
 *   limit?: number,
 *   offset?: number,
 * }} [filters]
 */
export async function getPersonMatches(id, filters = {}) {
  return footballDataApi(`/persons/${id}/matches${buildQuery(filters)}`);
}

// ════════════════════════════════════════════════════════════════════════════
// MATCHES
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /v4/matches/{id}
 * Show one particular match.
 *
 * @param {number} id  Match ID
 */
export async function getMatch(id) {
  return footballDataApi(`/matches/${id}`);
}

/**
 * GET /v4/matches
 * List matches across (a set of) competitions.
 *
 * @param {{
 *   competitions?: string,
 *   ids?: string,
 *   dateFrom?: string,
 *   dateTo?: string,
 *   status?: string,
 * }} [filters]
 */
export async function getMatches(filters = {}) {
  return footballDataApi(`/matches${buildQuery(filters)}`);
}

/**
 * GET /v4/matches/{id}/head2head
 * List previous encounters for the teams of a match.
 *
 * @param {number} id  Match ID
 * @param {{
 *   limit?: number,
 *   dateFrom?: string,
 *   dateTo?: string,
 *   competitions?: string,
 * }} [filters]
 */
export async function getMatchHead2Head(id, filters = {}) {
  return footballDataApi(`/matches/${id}/head2head${buildQuery(filters)}`);
}

// ════════════════════════════════════════════════════════════════════════════
// CONVENIENCE HELPERS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Fetch live / in-play matches right now across all competitions.
 */
export async function getLiveMatches() {
  return getMatches({ status: "IN_PLAY,PAUSED" });
}

/**
 * Fetch today's scheduled + finished matches.
 *
 * @param {string} [competitionIds]  Comma-separated competition IDs
 */
export async function getTodayMatches(competitionIds) {
  const today = new Date().toISOString().slice(0, 10);
  return getMatches({
    dateFrom: today,
    dateTo: today,
    ...(competitionIds ? { competitions: competitionIds } : {}),
  });
}

/**
 * Fetch matches for a date range.
 *
 * @param {string} dateFrom          YYYY-MM-DD
 * @param {string} dateTo            YYYY-MM-DD
 * @param {string} [competitionIds]  Comma-separated competition IDs
 */
export async function getMatchesByDateRange(dateFrom, dateTo, competitionIds) {
  return getMatches({
    dateFrom,
    dateTo,
    ...(competitionIds ? { competitions: competitionIds } : {}),
  });
}

/**
 * Fetch league table / standings for the current season.
 *
 * @param {number|string} competitionId  e.g. 2021 or "PL"
 */
export async function getCurrentStandings(competitionId) {
  return getCompetitionStandings(competitionId);
}

/**
 * Fetch top scorers for the current season.
 *
 * @param {number|string} competitionId
 * @param {number} [limit=10]
 */
export async function getTopScorers(competitionId, limit = 10) {
  return getCompetitionScorers(competitionId, { limit });
}
