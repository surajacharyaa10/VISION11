import { getTopScorers, getPlayerProfiles } from "@/api-football";
import type { PlayerWithStatistics, PlayerProfile } from "@/api-football";
import PlayersClient, { type PlayerCard } from "./PlayersClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams?: {
        league?: string;
        season?: string;
        search?: string;
    };
}

/** Well known API-Football league IDs used as the default browse list. */
const DEFAULT_LEAGUE_ID = 39; // Premier League
const DEFAULT_SEASON = 2023; // Widely available on the free API-Football plan

function ratingFromStats(
    ratingStr: string | null | undefined,
    goals: number,
    assists: number
): number {
    const parsed = ratingStr ? parseFloat(ratingStr) : NaN;
    if (!Number.isNaN(parsed) && parsed > 0) {
        return Math.min(99, Math.round(parsed * 10));
    }
    // Fallback heuristic rating so the UI still has something meaningful to show.
    return Math.min(99, 60 + goals * 2 + assists);
}

function mapTopScorerToCard(item: PlayerWithStatistics): PlayerCard {
    const stat = item.statistics?.[0];
    const goals = stat?.goals?.total ?? 0;
    const assists = stat?.goals?.assists ?? 0;
    const matches = stat?.games?.appearences ?? 0;
    const club = stat?.team?.name ?? "Free Agent";
    const position = stat?.games?.position ?? "Unknown";
    const country = item.player.nationality ?? "Unknown";

    return {
        id: item.player.id,
        name: item.player.name,
        image: item.player.photo,
        club,
        country,
        position,
        age: item.player.age ?? 0,
        rating: ratingFromStats(stat?.games?.rating, goals, assists),
        goals,
        assists,
        matches,
        bio: `${item.player.name} plays for ${club} as a ${position}. Born ${item.player.birth?.place ?? "unknown"
            }, ${country}.`,
    };
}

function mapProfileToCard(profile: PlayerProfile): PlayerCard {
    return {
        id: profile.id,
        name: profile.name,
        image: profile.photo,
        club: "—",
        country: profile.nationality ?? "Unknown",
        position: "Unknown",
        age: profile.age ?? 0,
        rating: 0,
        goals: 0,
        assists: 0,
        matches: 0,
        bio: `${profile.name} is from ${profile.nationality ?? "an unknown country"
            }. Born ${profile.birth?.date ?? "n/a"} in ${profile.birth?.place ?? "n/a"
            }.`,
    };
}

export default async function PlayerPage({ searchParams }: PageProps) {
    const league = Number(searchParams?.league) || DEFAULT_LEAGUE_ID;
    const season = Number(searchParams?.season) || DEFAULT_SEASON;
    const search = searchParams?.search?.trim() ?? "";

    let players: PlayerCard[] = [];
    let errorMessage: string | null = null;

    try {
        if (search.length >= 3) {
            // Global search by (last)name across all players via /players/profiles.
            const res = await getPlayerProfiles(
                { search },
                { next: { revalidate: 3600 } }
            );
            players = (res.response ?? []).map(mapProfileToCard);
        } else {
            // Default browsing experience: top scorers of a given league/season.
            const res = await getTopScorers(
                { league, season },
                { next: { revalidate: 3600 } }
            );
            players = (res.response ?? []).map(mapTopScorerToCard);
        }
    } catch (error) {
        console.error("Failed to load players from API-Football:", error);
        errorMessage =
            error instanceof Error
                ? error.message
                : "Unable to load players right now. Please try again later.";
    }

    return (
        <PlayersClient
            initialPlayers={players}
            initialSearch={search}
            errorMessage={errorMessage}
            league={league}
            season={season}
        />
    );
}
