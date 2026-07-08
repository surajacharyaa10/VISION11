"use server";

const API_KEY = '981cdc47446c04457e289cc66747cf2b';
const BASE_URL = 'https://v3.football.api-sports.io';

const headers = {
    'x-apisports-key': API_KEY
};

export async function getPlayersByPrefix(prefix) {
    if (!prefix || prefix.length < 4) return [];

    try {
        const response = await fetch(`${BASE_URL}/players/profiles?search=${encodeURIComponent(prefix)}`, {
            method: 'GET',
            headers
        });
        const data = await response.json();

        if (data.response && Array.isArray(data.response)) {
            // Map basic profiles
            const basicPlayers = data.response.map(item => item.player);

            // Limit to 10 players to avoid massive rate limit hits on search
            const limitedPlayers = basicPlayers.slice(0, 10);

            // Fetch stats in parallel to get team and position
            const detailedPlayers = await Promise.all(limitedPlayers.map(async (p) => {
                let team = '–';
                let position = '–';

                try {
                    const statRes = await fetch(`${BASE_URL}/players?id=${p.id}&season=2023`, { method: 'GET', headers });
                    const statData = await statRes.json();

                    if (statData.response && statData.response.length > 0) {
                        const stats = statData.response[0].statistics;
                        if (stats && stats.length > 0) {
                            team = stats[0].team?.name || '–';

                            const positions = new Set();
                            stats.forEach(s => {
                                if (s.games?.position) positions.add(s.games.position);
                            });
                            position = positions.size > 0 ? Array.from(positions).join(', ') : '–';
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch stats for search player:", p.id);
                }

                return {
                    id: p.id,
                    name: p.name,
                    firstname: p.firstname,
                    lastname: p.lastname,
                    nationality: p.nationality,
                    thumbnail: p.photo,
                    age: p.age,
                    team,
                    position
                };
            }));

            return detailedPlayers;
        }
        return [];
    } catch (error) {
        console.error("Player fetch error (api-sports):", error);
        return [];
    }
}

export async function getPlayer(id) {
    try {
        const response = await fetch(`${BASE_URL}/players/profiles?player=${id}`, {
            method: 'GET',
            headers
        });
        const data = await response.json();

        if (data.response && data.response.length > 0) {
            const p = data.response[0].player;
            return {
                idPlayer: p.id,
                strPlayer: p.name,
                strNationality: p.nationality,
                strThumb: p.photo,
                strHeight: p.height,
                strWeight: p.weight,
                age: p.age,
                birth: p.birth,
                careerHistory: [] // We'll fetch this separately via squads or transfers
            };
        }
        return null;
    } catch (error) {
        console.error("getPlayer Error:", error);
        return null;
    }
}

export async function getPlayerTransfers(playerId) {
    try {
        const response = await fetch(`${BASE_URL}/transfers?player=${playerId}`, {
            method: 'GET',
            headers
        });
        const data = await response.json();
        return data.response && data.response.length > 0 ? data.response[0].transfers : [];
    } catch (e) {
        console.error("Transfers error:", e);
        return [];
    }
}

export async function getPlayerTrophies(playerId) {
    try {
        const response = await fetch(`${BASE_URL}/trophies?player=${playerId}`, {
            method: 'GET',
            headers
        });
        const data = await response.json();
        return data.response || [];
    } catch (e) {
        console.error("Trophies error:", e);
        return [];
    }
}

export async function getPlayerSquads(playerId) {
    try {
        const response = await fetch(`${BASE_URL}/players/teams?player=${playerId}`, {
            method: 'GET',
            headers
        });
        const data = await response.json();
        return data.response || [];
    } catch (e) {
        console.error("Squads error:", e);
        return [];
    }
}

export async function getPlayerStatistics(playerId) {
    try {
        // First, fetch all seasons this player has participated in
        const seasonsRes = await fetch(`${BASE_URL}/players/seasons?player=${playerId}`, {
            method: 'GET',
            headers
        });
        const seasonsData = await seasonsRes.json();
        const seasons = seasonsData.response || [];

        if (seasons.length === 0) {
            // Fallback to 2023 if no seasons found or rate limited
            const fallbackRes = await fetch(`${BASE_URL}/players?id=${playerId}&season=2023`, {
                method: 'GET',
                headers
            });
            const fallbackData = await fallbackRes.json();
            return fallbackData.response && fallbackData.response.length > 0 ? fallbackData.response[0].statistics : [];
        }

        // Fetch statistics for all available seasons in parallel
        const allStatsPromises = seasons.map(async (season) => {
            const statRes = await fetch(`${BASE_URL}/players?id=${playerId}&season=${season}`, {
                method: 'GET',
                headers
            });
            const statData = await statRes.json();
            // Each response has an array of statistics for different competitions that season
            return statData.response && statData.response.length > 0 ? statData.response[0].statistics : [];
        });

        const allStatsArrays = await Promise.all(allStatsPromises);

        // Flatten the array of arrays into a single list of all stats across all seasons
        return allStatsArrays.flat();
    } catch (e) {
        console.error("Stats error:", e);
        return [];
    }
}

export async function getPlayerFullData(playerId) {
    try {
        const [player, transfers, trophies, career, stats] = await Promise.all([
            getPlayer(playerId),
            getPlayerTransfers(playerId),
            getPlayerTrophies(playerId),
            getPlayerSquads(playerId),
            getPlayerStatistics(playerId)
        ]);

        if (!player) return { player: null, transfers: [], trophies: [], career: [], stats: [], error: "Rate limit exceeded or player not found" };

        return { player, transfers, trophies, career, stats };
    } catch (error) {
        console.error("getPlayerFullData error:", error);
        throw error;
    }
}

export async function getDefaultPlayers() {
    try {
        // Fetch some popular default players individually, since the team search returns an empty response on the free tier
        const defaultNames = ['Lionel Messi', 'Cristiano Ronaldo', 'Kylian Mbappe', 'Erling Haaland', 'Neymar', 'Lamine Yamal', 'Pedri', 'Florian Wirtz', 'Alejandro Balde', 'Rodri', 'Koke', 'Fede Valverde', 'Gavi', 'Nico Williams', 'Mikel Oyarzabal', 'Ángel Correa'];

        const playersPromises = defaultNames.map(async (name) => {
            try {
                const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`);
                const text = await response.text();
                if (!text) return null; // Handle empty responses gracefully
                const data = JSON.parse(text);
                return data.player && data.player.length > 0 ? data.player[0] : null;
            } catch (e) {
                return null;
            }
        });

        const results = await Promise.all(playersPromises);
        const validPlayers = results.filter(Boolean);

        // Map to match the shape expected by the UI
        return validPlayers.map(p => ({
            id: p.idPlayer, // This is TheSportsDB ID
            isTheSportsDb: true, // Flag to identify this player needs API-Sports ID resolution
            name: p.strPlayer,
            firstname: p.strPlayer.split(' ')[0],
            lastname: p.strPlayer.split(' ').slice(1).join(' '),
            nationality: p.strNationality,
            thumbnail: p.strThumb || p.strCutout || p.strRender,
            team: p.strTeam,
            position: p.strPosition
        }));
    } catch (e) {
        console.error("TheSportsDB getDefaultPlayers error:", e);
        return [];
    }
}

export async function resolvePlayerIdByName(name) {
    if (!name) return null;
    try {
        const response = await fetch(`${BASE_URL}/players/profiles?search=${encodeURIComponent(name)}`, {
            method: 'GET',
            headers
        });
        const data = await response.json();
        if (data.response && data.response.length > 0) {
            // Return the first matching player's ID
            return data.response[0].player.id;
        }
        return null;
    } catch (e) {
        console.error("Failed to resolve player ID by name:", e);
        return null;
    }
}