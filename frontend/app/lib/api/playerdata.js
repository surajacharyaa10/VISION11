const API_KEY = "d53147135bmsha7d92e90059708fp193489jsn059e9a4064ac";
const API_HOST = "sofascore.p.rapidapi.com";

async function callSofaScore(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`https://${API_HOST}${endpoint}?${query}`, {
        method: "GET",
        headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}


// Player ID
const playerId = 155997;


// Call all player endpoints
export async function getAllPlayerData(playerId) {

    const endpoints = {

        detail: [
            "/players/detail",
            { playerId }
        ],

        image: [
            "/players/get-image",
            { playerId }
        ],

        characteristics: [
            "/players/get-characteristics",
            { playerId }
        ],

        ratings: [
            "/players/get-ratings",
            { playerId }
        ],

        attributeOverviews: [
            "/players/get-attribute-overviews",
            { playerId }
        ],

        nationalTeamStatistics: [
            "/players/get-national-team-statistics",
            { playerId }
        ],

        transferHistory: [
            "/players/get-transfer-history",
            { playerId }
        ],

        lastYearSummary: [
            "/players/get-last-year-summary",
            { playerId }
        ],

        statisticsSeasons: [
            "/players/get-statistics-seasons",
            { playerId }
        ],

        allStatistics: [
            "/players/get-all-statistics",
            { playerId }
        ],

        statistics: [
            "/players/get-statistics",
            { playerId }
        ],

        lastMatches: [
            "/players/get-last-matches",
            { playerId }
        ],

        nextMatches: [
            "/players/get-next-matches",
            { playerId }
        ]
    };


    const result = {};

    const promises = Object.entries(endpoints).map(async ([key, [endpoint, params]]) => {
        try {
            console.log(`Fetching ${key}...`);
            result[key] = await callSofaScore(endpoint, params);
        } catch (error) {
            result[key] = { error: error.message || error };
        }
    });

    await Promise.all(promises);

    return result;
}

