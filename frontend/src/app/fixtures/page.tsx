import { getFixtures } from "@/thesportsdb/fixtures";
import type { Fixture } from "@/thesportsdb/fixtures";
import { Leagues } from "@/data/leagues";
import Link from "next/link";
import FixtureFilters from "./components/FixtureFilters";

export default async function Fixtures() {
    let fixtures: Fixture[] = [];
    let error: string | null = null;
    let source = "";

    try {
        const res = await getFixtures(
            {},
            { next: { revalidate: 300 } }
        );
        fixtures = res.response ?? [];
        source = "thesportsdb.com";
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load fixtures";
        console.error("Fixtures error:", error);
    }

    const formattedFixtures = fixtures.map((f) => {
        const league = Leagues.find((l) => l.theSportsDBId === f.league.id);
        return {
            ...f,
            league: {
                ...f.league,
                logo: league?.logo || f.league.logo,
            },
            teams: {
                home: {
                    ...f.teams.home,
                    logo: f.teams.home.logo,
                },
                away: {
                    ...f.teams.away,
                    logo: f.teams.away.logo,
                },
            },
        };
    });

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white p-4 md:p-6">
            <div className="max-w-7xl mx-auto mb-8 px-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Football Fixtures
                </h1>
                <p className="text-gray-400 mt-2 text-sm">
                    {error ? (
                        <span className="text-red-400">Error: {error}</span>
                    ) : fixtures.length === 0 ? (
                        <span className="text-yellow-400">No matches found.</span>
                    ) : (
                        `${fixtures.length} matches via ${source}`
                    )}
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                {error ? (
                    <div className="text-center text-gray-400 py-20">
                        Unable to load fixtures
                    </div>
                ) : (
                    <FixtureFilters fixtures={formattedFixtures} />
                )}
            </div>
        </div>
    );
}
