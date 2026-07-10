import { getFixtures } from "@/thesportsdb/fixtures";
import type { Fixture } from "@/thesportsdb/fixtures";
import { Leagues } from "@/data/leagues";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Params {
    league_href: string;
}

function formatFixtureDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    if (isToday) return `Today • ${time}`;
    if (isTomorrow) return `Tomorrow • ${time}`;

    return `${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })} • ${time}`;
}

function getStatusBadge(fixture: { fixture: { status: { short: string; long: string; elapsed: number | null } } }): { label: string; color: string } {
    const short = fixture.fixture.status.short;
    const elapsed = fixture.fixture.status.elapsed;

    if (short === "NS" || short === "TBD") {
        return { label: "Upcoming", color: "bg-yellow-500/20 text-yellow-400" };
    }
    if (short === "FT" || short === "AET" || short === "PEN") {
        return { label: "Full Time", color: "bg-gray-500/20 text-gray-400" };
    }
    if (["1H", "2H", "ET", "BT", "LIVE"].includes(short)) {
        return { label: elapsed !== null ? `${short} ${elapsed}'` : short, color: "bg-green-500/20 text-green-400" };
    }
    if (short === "HT") {
        return { label: "Half Time", color: "bg-blue-500/20 text-blue-400" };
    }
    if (["PST", "CANC", "ABD", "AWD", "WO", "SUSP", "INT"].includes(short)) {
        return { label: fixture.fixture.status.long, color: "bg-red-500/20 text-red-400" };
    }

    return { label: short, color: "bg-gray-500/20 text-gray-400" };
}

const League = async ({ params }: { params: Params }) => {
    const league = Leagues.find((l) => l.href === params.league_href);

    if (!league) {
        notFound();
    }

    let fixtures: any[] = [];
    let error: string | null = null;

    const leagueId = league.theSportsDBId || league.apiFootballId;

    try {
        const res = await getFixtures(
            { league: leagueId },
            { next: { revalidate: 3600 } }
        );
        fixtures = res.response ?? [];
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load fixtures";
    }

    const statusOrder: Record<string, number> = {
        NS: 0, TBD: 0,
        "1H": 1, "2H": 1, ET: 1, BT: 1, LIVE: 1, HT: 1,
        FT: 2, AET: 2, PEN: 2,
        PST: 3, CANC: 3, ABD: 3, AWD: 3, WO: 3, SUSP: 3, INT: 3,
    };

    const sortedFixtures = [...fixtures].sort((a, b) => {
        const aStatus = statusOrder[a.fixture.status.short] ?? 9;
        const bStatus = statusOrder[b.fixture.status.short] ?? 9;
        if (aStatus !== bStatus) return aStatus - bStatus;
        return new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime();
    });

    const upcomingCount = fixtures.filter(
        (f) => ["NS", "TBD"].includes(f.fixture.status.short)
    ).length;

    return (
        <div className="w-full max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">{league.name}</h1>
                <p className="text-gray-400 mt-2">
                    {error ? error : `${fixtures.length} fixtures`}
                </p>
            </div>

            {error ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-xl mb-2">Unable to load fixtures</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : sortedFixtures.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-xl">No fixtures found</p>
                    <Link href="/fixtures" className="inline-block mt-4 text-green-400 hover:text-green-300">
                        View all fixtures
                    </Link>
                </div>
            ) : (
                <div className="space-y-5">
                    {sortedFixtures.map((match: any) => {
                        const status = getStatusBadge(match);
                        const dateStr = formatFixtureDate(match.fixture.date);
                        const leagueLogo = league.logo || match.league?.logo || "";
                        const homeTeam = match.teams?.home ?? {};
                        const awayTeam = match.teams?.away ?? {};
                        const homeLogo = homeTeam.logo || "";
                        const awayLogo = awayTeam.logo || "";
                        const stadium = match.fixture.venue.name ?? "TBD";

                        return (
                            <Link
                                href={`/fixtures/${match.fixture.id}`}
                                key={match.fixture.id}
                                className="block bg-[#151b2b] rounded-3xl p-6 border border-white/5 hover:border-green-500/40 transition"
                            >
                                <div className="flex justify-between items-center mb-5">
                                    <div className="flex items-center gap-2">
                                        {leagueLogo ? (
                                            <img src={leagueLogo} alt={match.league?.name ?? league.name} className="w-6 h-6 object-contain" />
                                        ) : (
                                            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                                                {(league.name || "?").slice(0, 2)}
                                            </span>
                                        )}
                                        <span className="text-green-400 font-semibold">{match.league?.name ?? league.name}</span>
                                    </div>
                                    <span className="text-gray-400 text-sm">{dateStr}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-center flex-1">
                                        <div className="w-16 h-16 rounded-full bg-[#0b0f19] flex items-center justify-center mx-auto overflow-hidden text-white font-bold">
                                            {homeLogo ? (
                                                <img src={homeLogo} alt={homeTeam.name ?? "home"} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                (homeTeam.name ?? "?").charAt(0)
                                            )}
                                        </div>
                                        <p className="mt-3 font-semibold text-sm truncate px-2">{homeTeam.name}</p>
                                    </div>

                                    <div className="text-center px-4">
                                        {match.fixture.status.short === "NS" || match.fixture.status.short === "TBD" ? (
                                            <p className="text-gray-400 text-sm font-semibold">VS</p>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold">{match.goals.home ?? 0}</span>
                                                <span className="text-gray-500">-</span>
                                                <span className="text-2xl font-bold">{match.goals.away ?? 0}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center flex-1">
                                        <div className="w-16 h-16 rounded-full bg-[#0b0f19] flex items-center justify-center mx-auto overflow-hidden text-white font-bold">
                                            {awayLogo ? (
                                                <img src={awayLogo} alt={awayTeam.name ?? "away"} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                (awayTeam.name ?? "?").charAt(0)
                                            )}
                                        </div>
                                        <p className="mt-3 font-semibold text-sm truncate px-2">{awayTeam.name}</p>
                                    </div>
                                </div>

                                <div className="mt-6 bg-[#0b0f19] rounded-2xl p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-400 text-sm">Stadium</p>
                                        <p className="font-semibold">🏟 {stadium}</p>
                                    </div>
                                    <span className={`${status.color} px-4 py-2 rounded-full text-sm`}>
                                        {status.label}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default League;
