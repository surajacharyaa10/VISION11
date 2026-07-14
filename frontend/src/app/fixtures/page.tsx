import { getFixtures } from "@/thesportsdb/fixtures";
import type { Fixture } from "@/thesportsdb/fixtures";
import { Leagues } from "@/data/leagues";
import FixtureFilters from "./components/FixtureFilters";
import { CalendarDays, AlertCircle } from "lucide-react";

export default async function Fixtures() {
    let fixtures: Fixture[] = [];
    let error: string | null = null;

    try {
        const res = await getFixtures({}, { next: { revalidate: 300 } });
        fixtures = res.response ?? [];
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load fixtures";
        console.error("Fixtures error:", error);
    }

    const formattedFixtures = fixtures.map((f) => {
        const league = Leagues.find((l) => l.theSportsDBId === f.league.id);
        return {
            ...f,
            league: { ...f.league, logo: league?.logo || f.league.logo },
            teams: {
                home: { ...f.teams.home, logo: f.teams.home.logo },
                away: { ...f.teams.away, logo: f.teams.away.logo },
            },
        };
    });

    return (
        <div className="min-h-screen text-white">
            {/* Page header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/15">
                        <CalendarDays className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                            Football Fixtures
                        </h1>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            {error ? (
                                <span className="text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {error}
                                </span>
                            ) : fixtures.length === 0 ? (
                                <span className="text-amber-400">No matches found</span>
                            ) : (
                                `${fixtures.length} matches loaded`
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="text-center text-neutral-500 py-20">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Unable to load fixtures</p>
                </div>
            ) : (
                <FixtureFilters fixtures={formattedFixtures} />
            )}
        </div>
    );
}
