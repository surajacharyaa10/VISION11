import { footballDataApi } from "./footballDataApi";

const MOCK_LEAGUES = [
  {
    league: {
      id: 2021,
      name: "Premier League",
      type: "League",
      logo: "https://crests.football-data.org/PL.png"
    },
    country: {
      name: "England",
      code: "ENG",
      flag: "https://crests.football-data.org/770.svg"
    },
    seasons: [
      {
        year: 2026,
        start: "2026-08-15",
        end: "2027-05-23",
        current: true,
        coverage: {
          standings: true,
          players: true,
          top_scorers: true,
          top_assists: true,
          predictions: true,
          odds: true
        }
      }
    ]
  },
  {
    league: {
      id: 2014,
      name: "Primera Division",
      type: "League",
      logo: "https://crests.football-data.org/PD.png"
    },
    country: {
      name: "Spain",
      code: "ESP",
      flag: "https://crests.football-data.org/760.svg"
    },
    seasons: [
      {
        year: 2026,
        start: "2026-08-18",
        end: "2027-05-26",
        current: true,
        coverage: {
          standings: true,
          players: true,
          top_scorers: true,
          top_assists: true,
          predictions: true,
          odds: false
        }
      }
    ]
  },
  {
    league: {
      id: 2019,
      name: "Serie A",
      type: "League",
      logo: "https://crests.football-data.org/SA.png"
    },
    country: {
      name: "Italy",
      code: "ITA",
      flag: "https://crests.football-data.org/784.svg"
    },
    seasons: [
      {
        year: 2026,
        start: "2026-08-19",
        end: "2027-05-26",
        current: true,
        coverage: {
          standings: true,
          players: true,
          top_scorers: true,
          top_assists: true,
          predictions: true,
          odds: true
        }
      }
    ]
  },
  {
    league: {
      id: 2002,
      name: "Bundesliga",
      type: "League",
      logo: "https://crests.football-data.org/BL1.png"
    },
    country: {
      name: "Germany",
      code: "DEU",
      flag: "https://crests.football-data.org/759.svg"
    },
    seasons: [
      {
        year: 2026,
        start: "2026-08-22",
        end: "2027-05-18",
        current: true,
        coverage: {
          standings: true,
          players: true,
          top_scorers: true,
          top_assists: true,
          predictions: true,
          odds: true
        }
      }
    ]
  },
  {
    league: {
      id: 2015,
      name: "Ligue 1",
      type: "League",
      logo: "https://crests.football-data.org/FL1.png"
    },
    country: {
      name: "France",
      code: "FRA",
      flag: "https://crests.football-data.org/773.svg"
    },
    seasons: [
      {
        year: 2026,
        start: "2026-08-11",
        end: "2027-05-19",
        current: true,
        coverage: {
          standings: true,
          players: true,
          top_scorers: true,
          top_assists: true,
          predictions: false,
          odds: false
        }
      }
    ]
  }
];

export async function getTopLeagues() {
  const targetIds = [2021, 2014, 2019, 2002, 2015];

  try {
    const response = await footballDataApi("/competitions");
    
    if (!response || !response.competitions) {
      throw new Error("Invalid response format from competitions API");
    }

    const filtered = response.competitions.filter(comp => targetIds.includes(comp.id));
    
    if (filtered.length === 0) {
      throw new Error("No targeted competitions found in API response");
    }

    const mapped = filtered.map(comp => {
      const currentSeason = comp.currentSeason || {};
      const year = currentSeason.startDate ? new Date(currentSeason.startDate).getFullYear() : 2026;
      const start = currentSeason.startDate || "2026-08-15";
      const end = currentSeason.endDate || "2027-05-23";

      return {
        league: {
          id: comp.id,
          name: comp.name,
          type: comp.type === "LEAGUE" ? "League" : (comp.type === "CUP" ? "Cup" : comp.type),
          logo: comp.emblem
        },
        country: {
          name: comp.area ? comp.area.name : "International",
          code: comp.area ? comp.area.code : null,
          flag: comp.area ? comp.area.flag : null
        },
        seasons: [
          {
            year: year,
            start: start,
            end: end,
            current: true,
            coverage: {
              standings: true,
              players: true,
              top_scorers: true,
              top_assists: true,
              predictions: comp.plan === "TIER_ONE" || comp.plan === "TIER_TWO",
              odds: comp.plan === "TIER_ONE"
            }
          }
        ]
      };
    });

    return {
      data: mapped,
      isDemo: false
    };
  } catch (error) {
    console.error("Failed to fetch top leagues from football-data.org, using fallback:", error);
    return {
      data: MOCK_LEAGUES,
      isDemo: true
    };
  }
}