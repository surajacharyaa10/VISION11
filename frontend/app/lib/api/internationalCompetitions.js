import footballDataApi from "./footballDataApi";

/**
 * The specific international competition IDs to display,
 * grouped by confederation for the sidebar.
 */
const INTERNATIONAL_IDS = [
  2,    // UEFA Champions League
  3,    // UEFA Europa League
  848,  // UEFA Conference League
  531,  // UEFA Super Cup
  15,   // FIFA Club World Cup
  1,    // FIFA World Cup
  32,   // World Cup Qualification
  5,    // UEFA Nations League
  4,    // Euro Championship
  960,  // Euro Qualification
  9,    // Copa America
  11,   // Copa America Qualification
  6,    // Gold Cup
  7,    // AFC Asian Cup
  17,   // AFC Asian Cup Qualification
  18,   // AFC Champions League Elite
  19,   // AFC Champions League Two
  12,   // CAF Champions League
  20,   // CAF Confederation Cup
  21,   // OFC Champions League
  10,   // International Friendlies
];

/**
 * Maps a competition ID to its confederation/group name for sidebar grouping.
 */
const ID_TO_GROUP = {
  2: "UEFA Club",
  3: "UEFA Club",
  848: "UEFA Club",
  531: "UEFA Club",
  15: "FIFA",
  1: "FIFA",
  32: "FIFA",
  5: "UEFA National",
  4: "UEFA National",
  960: "UEFA National",
  9: "CONMEBOL",
  11: "CONMEBOL",
  6: "CONCACAF",
  7: "AFC",
  17: "AFC",
  18: "AFC",
  19: "AFC",
  12: "CAF",
  20: "CAF",
  21: "OFC",
  10: "Friendly",
};

/**
 * Display order for groups in the sidebar.
 */
const GROUP_ORDER = [
  "FIFA",
  "UEFA Club",
  "UEFA National",
  "CONMEBOL",
  "CONCACAF",
  "AFC",
  "CAF",
  "OFC",
  "Friendly",
];

// ─── Fallback static data ─────────────────────────────────────────────────────
const FALLBACK_COMPETITIONS = [
  { id: 1, name: "FIFA World Cup", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/2022_FIFA_World_Cup.svg/150px-2022_FIFA_World_Cup.svg.png", type: "CUP", area: { name: "World", flag: null } },
  { id: 32, name: "World Cup Qualification", emblem: null, type: "CUP", area: { name: "World", flag: null } },
  { id: 15, name: "FIFA Club World Cup", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/FIFA_Club_World_Cup_logo.svg/120px-FIFA_Club_World_Cup_logo.svg.png", type: "CUP", area: { name: "World", flag: null } },
  { id: 2, name: "UEFA Champions League", emblem: "https://crests.football-data.org/UCL.png", type: "CUP", area: { name: "Europe", flag: "https://crests.football-data.org/EUR.svg" } },
  { id: 3, name: "UEFA Europa League", emblem: "https://crests.football-data.org/UEL.png", type: "CUP", area: { name: "Europe", flag: "https://crests.football-data.org/EUR.svg" } },
  { id: 848, name: "UEFA Conference League", emblem: "https://crests.football-data.org/UECL.png", type: "CUP", area: { name: "Europe", flag: "https://crests.football-data.org/EUR.svg" } },
  { id: 531, name: "UEFA Super Cup", emblem: null, type: "CUP", area: { name: "Europe", flag: "https://crests.football-data.org/EUR.svg" } },
  { id: 4, name: "Euro Championship", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/UEFA_European_Championship_logo.svg/120px-UEFA_European_Championship_logo.svg.png", type: "CUP", area: { name: "Europe", flag: "https://crests.football-data.org/EUR.svg" } },
  { id: 960, name: "Euro Qualification", emblem: null, type: "CUP", area: { name: "Europe", flag: "https://crests.football-data.org/EUR.svg" } },
  { id: 5, name: "UEFA Nations League", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/3/38/UEFA_Nations_League_logo.svg/120px-UEFA_Nations_League_logo.svg.png", type: "LEAGUE", area: { name: "Europe", flag: "https://crests.football-data.org/EUR.svg" } },
  { id: 9, name: "Copa America", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Copa_Am%C3%A9rica_logo.svg/120px-Copa_Am%C3%A9rica_logo.svg.png", type: "CUP", area: { name: "South America", flag: null } },
  { id: 11, name: "Copa America Qualification", emblem: null, type: "CUP", area: { name: "South America", flag: null } },
  { id: 6, name: "Gold Cup", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/2/20/CONCACAF_Gold_Cup_logo.svg/120px-CONCACAF_Gold_Cup_logo.svg.png", type: "CUP", area: { name: "North America", flag: null } },
  { id: 7, name: "AFC Asian Cup", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Asian_Cup_logo.svg/120px-Asian_Cup_logo.svg.png", type: "CUP", area: { name: "Asia", flag: null } },
  { id: 17, name: "AFC Asian Cup Qualification", emblem: null, type: "CUP", area: { name: "Asia", flag: null } },
  { id: 18, name: "AFC Champions League Elite", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/AFC_Champions_League_Elite_logo.svg/120px-AFC_Champions_League_Elite_logo.svg.png", type: "CUP", area: { name: "Asia", flag: null } },
  { id: 19, name: "AFC Champions League Two", emblem: null, type: "CUP", area: { name: "Asia", flag: null } },
  { id: 12, name: "CAF Champions League", emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/CAF_Champions_League_logo.svg/120px-CAF_Champions_League_logo.svg.png", type: "CUP", area: { name: "Africa", flag: null } },
  { id: 20, name: "CAF Confederation Cup", emblem: null, type: "CUP", area: { name: "Africa", flag: null } },
  { id: 21, name: "OFC Champions League", emblem: null, type: "CUP", area: { name: "Oceania", flag: null } },
  { id: 10, name: "International Friendlies", emblem: null, type: "LEAGUE", area: { name: "World", flag: null } },
];

/**
 * Shapes a raw competition object (from API or fallback) into the same
 * { league, country, seasons } format used by LeagueGrid.
 */
function shapeComp(comp) {
  const currentSeason = comp.currentSeason || {};
  const year = currentSeason.startDate
    ? new Date(currentSeason.startDate).getFullYear()
    : 2026;
  const start = currentSeason.startDate || "2026-06-01";
  const end = currentSeason.endDate || "2026-12-31";

  return {
    league: {
      id: comp.id,
      name: comp.name,
      type: comp.type === "LEAGUE" ? "League" : "Cup",
      logo: comp.emblem || null,
    },
    country: {
      name: comp.area?.name || "International",
      code: comp.area?.code || null,
      flag: comp.area?.flag || null,
    },
    seasons: [
      {
        year,
        start,
        end,
        current: true,
        coverage: {
          standings: true,
          players: true,
          top_scorers: true,
          top_assists: true,
          predictions: comp.plan === "TIER_ONE" || comp.plan === "TIER_TWO",
          odds: comp.plan === "TIER_ONE",
        },
      },
    ],
    group: ID_TO_GROUP[comp.id] || "Other",
  };
}

/**
 * Groups shaped competitions by confederation and sorts them
 * according to GROUP_ORDER.
 *
 * Returns an array of { groupName, competitions[] }.
 */
function groupByConfederation(shaped) {
  const map = {};
  for (const item of shaped) {
    const g = item.group;
    if (!map[g]) map[g] = { groupName: g, competitions: [] };
    map[g].competitions.push(item);
  }

  // Sort by GROUP_ORDER, unknown groups go last alphabetically
  return Object.values(map).sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a.groupName);
    const bi = GROUP_ORDER.indexOf(b.groupName);
    if (ai === -1 && bi === -1) return a.groupName.localeCompare(b.groupName);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

/**
 * Fetches all international competitions, filtered to INTERNATIONAL_IDS,
 * and returns them both as a flat list (for LeagueGrid) and grouped by
 * confederation (for the sidebar).
 *
 * Returns: { flat: LeagueData[], groups: Group[], isDemo: boolean }
 */
export async function getInternationalCompetitions() {
  try {
    const response = await footballDataApi("/competitions");

    if (!response?.competitions) {
      throw new Error("Invalid response from competitions API");
    }

    const filtered = response.competitions.filter((c) =>
      INTERNATIONAL_IDS.includes(c.id)
    );

    // If no matches (common on free API plans that don't include international
    // competitions), use the comprehensive static fallback instead of throwing.
    if (filtered.length === 0) {
      const shaped = FALLBACK_COMPETITIONS.map(shapeComp);
      return {
        flat: shaped,
        groups: groupByConfederation(shaped),
        isDemo: true,
      };
    }

    // Preserve the requested order
    filtered.sort(
      (a, b) => INTERNATIONAL_IDS.indexOf(a.id) - INTERNATIONAL_IDS.indexOf(b.id)
    );

    const shaped = filtered.map(shapeComp);

    return {
      flat: shaped,
      groups: groupByConfederation(shaped),
      isDemo: false,
    };
  } catch (error) {
    console.error(
      "Failed to fetch international competitions, using fallback:",
      error
    );

    const shaped = FALLBACK_COMPETITIONS.map(shapeComp);

    return {
      flat: shaped,
      groups: groupByConfederation(shaped),
      isDemo: true,
    };
  }
}
