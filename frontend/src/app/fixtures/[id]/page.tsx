import { getFixtures, getFixtureEvents, getFixtureStatistics, getFixtureLineups, getFixturePlayers, getHeadToHead } from "@/thesportsdb/fixtures";
import { Leagues } from "@/data/leagues";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User, Trophy, Activity, Users } from "lucide-react";

export const dynamic = "force-dynamic";

function formatFixtureDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function getStatusBadge(fixture: { fixture: { status: { short: string; long: string; elapsed: number | null } } }): { label: string; color: string } {
    const short = fixture.fixture.status.short;
    const elapsed = fixture.fixture.status.elapsed;

    if (short === "NS" || short === "TBD") {
        return { label: "Upcoming", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" };
    }
    if (short === "FT" || short === "AET" || short === "PEN") {
        return { label: "Full Time", color: "bg-slate-500/10 text-slate-400 border border-slate-500/20" };
    }
    if (["1H", "2H", "ET", "BT", "LIVE"].includes(short)) {
        return { label: elapsed !== null ? `Live ${short} ${elapsed}'` : "Live", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse" };
    }
    if (short === "HT") {
        return { label: "Half Time", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
    }
    return { label: fixture.fixture.status.long || short, color: "bg-rose-500/10 text-rose-400 border border-rose-500/20" };
}

function FootballField({ homeXI, awayXI }: { homeXI: any[]; awayXI: any[] }) {
    const renderRow = (players: any[], position: string, isHome: boolean) => {
        const filtered = players.filter(p => p.player.pos === position);
        return (
            <div className="flex justify-around items-center w-full px-2 min-h-[44px]">
                {filtered.map((p, idx) => (
                    <div key={idx} className="flex flex-col items-center group relative cursor-pointer">
                        <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-xs shadow-lg ring-2 ring-white/10 group-hover:scale-110 transition duration-200 ${isHome
                                ? "bg-gradient-to-b from-amber-400 to-orange-500 text-slate-950"
                                : "bg-gradient-to-b from-blue-400 to-indigo-600 text-white"
                            }`}>
                            {p.player.number}
                        </div>
                        <span className="text-[9px] mt-0.5 font-semibold bg-slate-950/90 px-1 py-0.5 rounded text-slate-200 text-center max-w-[65px] truncate">
                            {p.player.name.split(' ').pop()}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="relative w-full max-w-xl mx-auto aspect-[3/4] bg-gradient-to-b from-emerald-800 to-emerald-950 border-4 border-slate-900 rounded-2xl p-3 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 border border-white/10 m-1 rounded-xl pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 border-b border-white/20 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/20 rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-16 border border-t-0 border-white/10 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-16 border border-b-0 border-white/10 pointer-events-none" />

            <div className="relative h-full flex flex-col justify-between z-10 py-2">
                <div className="flex flex-col gap-y-3 w-full">
                    {renderRow(awayXI, "G", false)}
                    {renderRow(awayXI, "D", false)}
                    {renderRow(awayXI, "M", false)}
                    {renderRow(awayXI, "F", false)}
                </div>

                <div className="flex flex-col-reverse gap-y-3 w-full">
                    {renderRow(homeXI, "G", true)}
                    {renderRow(homeXI, "D", true)}
                    {renderRow(homeXI, "M", true)}
                    {renderRow(homeXI, "F", true)}
                </div>
            </div>
        </div>
    );
}

export default async function FixtureDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const fixtureId = Number(id);

    let fixture: any = null;
    let events: any[] = [];
    let statistics: any[] = [];
    let lineups: any[] = [];
    let players: any[] = [];
    let h2h: any[] = [];
    let error: string | null = null;

    try {
        const fixtureRes = await getFixtures({ id: fixtureId }, { next: { revalidate: 60 } });
        fixture = fixtureRes.response?.[0] ?? null;

        if (fixture) {
            const [eventsRes, statsRes, lineupsRes, playersRes, h2hRes] = await Promise.all([
                getFixtureEvents({ fixture: fixtureId }, { next: { revalidate: 60 } }),
                getFixtureStatistics({ fixture: fixtureId }, { next: { revalidate: 60 } }),
                getFixtureLineups({ fixture: fixtureId }, { next: { revalidate: 60 } }),
                getFixturePlayers({ fixture: fixtureId }, { next: { revalidate: 60 } }),
                getHeadToHead({ h2h: `${fixture.teams.home.id}-${fixture.teams.away.id}` }, { next: { revalidate: 3600 } }).catch(() => ({ response: [] })),
            ]);

            events = eventsRes.response ?? [];
            statistics = statsRes.response ?? [];
            lineups = lineupsRes.response ?? [];
            players = playersRes.response ?? [];
            h2h = h2hRes.response ?? [];
        }
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load fixture details";
    }

    if (error || !fixture) {
        return (
            <div className="min-h-screen bg-[#070a13] text-white p-6 flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-gray-400 mb-4">{error ?? "Fixture not found"}</p>
                <Link href="/fixtures" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Fixtures
                </Link>
            </div>
        );
    }

    const status = getStatusBadge(fixture);
    const homeLogo = fixture.teams.home.logo;
    const awayLogo = fixture.teams.away.logo;
    const league = Leagues.find((l) => l.theSportsDBId === fixture.league.id);
    const leagueLogo = league?.logo || fixture.league.logo;

    return (
        <div className="min-h-screen bg-[#070a13] text-slate-100 antialiased max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            <Link href="/fixtures" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Fixtures
            </Link>

            <div className="bg-[#0e1424] rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <img src={leagueLogo} alt={fixture.league.name} className="w-7 h-7 object-contain" />
                        <div>
                            <span className="text-white font-bold block text-sm md:text-base">{fixture.league.name}</span>
                        </div>
                    </div>
                    <span className={`${status.color} px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase`}>{status.label}</span>
                </div>

                <div className="grid grid-cols-3 items-center max-w-4xl mx-auto">
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#141b30] border border-white/5 p-4 flex items-center justify-center shadow-inner hover:scale-105 transition duration-300">
                            <img src={homeLogo} alt={fixture.teams.home.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="mt-4 font-bold text-base md:text-xl line-clamp-1">{fixture.teams.home.name}</p>
                    </div>

                    <div className="text-center">
                        {fixture.fixture.status.short === "NS" || fixture.fixture.status.short === "TBD" ? (
                            <div className="bg-[#141b30] px-4 py-2 rounded-xl inline-block border border-white/5">
                                <span className="text-xl md:text-2xl font-black text-amber-400 tracking-wider">VS</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center justify-center gap-4 md:gap-6 bg-[#141b30] px-6 py-3 rounded-2xl border border-white/5">
                                    <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{fixture.goals.home ?? 0}</span>
                                    <span className="text-slate-600 text-2xl font-light">:</span>
                                    <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{fixture.goals.away ?? 0}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#141b30] border border-white/5 p-4 flex items-center justify-center shadow-inner hover:scale-105 transition duration-300">
                            <img src={awayLogo} alt={fixture.teams.away.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="mt-4 font-bold text-base md:text-xl line-clamp-1">{fixture.teams.away.name}</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs md:text-sm text-slate-400">
                    <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                        <div><p className="text-slate-500 text-[10px] uppercase tracking-wider">Venue</p><p className="font-semibold text-slate-200">{fixture.fixture.venue.name ?? "TBD"}</p></div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                        <div><p className="text-slate-500 text-[10px] uppercase tracking-wider">Date</p><p className="font-semibold text-slate-200">{formatFixtureDate(fixture.fixture.date)}</p></div>
                    </div>
                </div>
            </div>

            {lineups.length > 0 && (
                <div className="bg-[#0e1424] rounded-3xl p-6 border border-white/5 shadow-lg">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-400" /> Tactical Match Formations</h2>
                    <div className="flex items-center justify-between mb-4 text-xs font-semibold px-2 text-slate-400">
                        <span>{lineups[0]?.team.name} ({lineups[0]?.formation})</span>
                        <span>{lineups[1]?.team.name} ({lineups[1]?.formation})</span>
                    </div>
                    <FootballField homeXI={lineups[0]?.startXI ?? []} awayXI={lineups[1]?.startXI ?? []} />
                </div>
            )}

            {statistics.length > 0 && (
                <div className="bg-[#0e1424] rounded-3xl p-6 border border-white/5 shadow-lg">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Performance Bars</h2>
                    <div className="space-y-4">
                        {statistics[0].statistics.map((stat: any, idx: number) => {
                            const homeVal = stat.value;
                            const awayVal = statistics[1]?.statistics[idx]?.value;
                            const homeNum = parseInt(homeVal) || 0;
                            const awayNum = parseInt(awayVal) || 0;
                            const max = Math.max(homeNum, awayNum, 1);

                            return (
                                <div key={stat.type} className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-emerald-400 font-bold">{homeVal ?? 0}</span>
                                        <span className="text-slate-400 text-[11px] uppercase tracking-wider">{stat.type}</span>
                                        <span className="text-blue-400 font-bold">{awayVal ?? 0}</span>
                                    </div>
                                    <div className="h-2 bg-slate-900 rounded-full flex overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-l-full ml-auto transition-all" style={{ width: `${(homeNum / max) * 50}%` }} />
                                        <div className="h-full bg-blue-500 rounded-r-full mr-auto transition-all" style={{ width: `${(awayNum / max) * 50}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {events.length > 0 && (
                <div className="bg-[#0e1424] rounded-3xl p-6 border border-white/5 shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Timeline Blocks</h2>
                    <div className="relative border-l border-white/5 pl-4 ml-2 space-y-4">
                        {events.map((event: any, idx: number) => (
                            <div key={idx} className="relative group">
                                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 ring-4 ring-[#0e1424] group-hover:bg-emerald-400 transition" />
                                <div className="bg-[#141b30] rounded-2xl p-3 border border-white/5 flex items-start gap-3">
                                    <span className="font-extrabold text-sm text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-md self-start">{event.time.elapsed}'</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-100 truncate">{event.player.name ?? event.type}</p>
                                        <p className="text-xs text-slate-400 truncate">{event.team.name} • {event.detail}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${event.type === "Goal" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            event.type === "Card" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                "bg-slate-800 text-slate-400 border-white/5"
                                        }`}>{event.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {h2h.length > 0 && (
                <div className="bg-[#0e1424] rounded-3xl p-6 border border-white/5 shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Historical Head to Head</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        {h2h.slice(0, 6).map((match: any) => (
                            <Link key={match.fixture.id} href={`/fixtures/${match.fixture.id}`} className="flex items-center justify-between bg-[#141b30] rounded-2xl p-4 border border-white/5 hover:border-emerald-500/30 transition group">
                                <span className="text-xs text-slate-500 font-medium">{new Date(match.fixture.date).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}</span>
                                <div className="flex items-center gap-3 flex-1 px-4 justify-center">
                                    <span className="font-semibold text-xs text-slate-300 text-right w-24 truncate">{match.teams.home.name}</span>
                                    <span className="font-extrabold text-sm bg-slate-900 px-2.5 py-1 rounded-xl group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition">
                                        {match.goals.home ?? 0} - {match.goals.away ?? 0}
                                    </span>
                                    <span className="font-semibold text-xs text-slate-300 text-left w-24 truncate">{match.teams.away.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
