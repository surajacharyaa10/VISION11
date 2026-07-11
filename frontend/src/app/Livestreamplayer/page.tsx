import Link from "next/link";
import { getSportsrcMatches } from "@/lib/sportsrc";

export const dynamic = "force-dynamic";

function formatMatchDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matchDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    if (matchDay.getTime() === today.getTime()) {
        return `Today • ${time}`;
    } else if (matchDay.getTime() === tomorrow.getTime()) {
        return `Tomorrow • ${time}`;
    } else {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        }) + ` • ${time}`;
    }
}

export default async function LivestreamPlayerPage({ searchParams }: { searchParams?: { sport?: string } }) {
    const sport = searchParams?.sport || "football";
    const rawMatches = await getSportsrcMatches(sport, ["inprogress", "upcoming"]);

    const liveMatches = rawMatches.filter((m) => (m.status || "").toLowerCase() === "inprogress" || (m.status || "").toLowerCase() === "live");
    const upcomingMatches = rawMatches.filter((m) => (m.status || "").toLowerCase() !== "inprogress" && (m.status || "").toLowerCase() !== "live");

    return (
        <main className="min-h-screen bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">Live Matches</h1>
                    <span className="text-xs px-3 py-1 rounded bg-red-600 text-white font-bold animate-pulse">
                        LIVE • {sport.toUpperCase()}
                    </span>
                </div>

                {rawMatches.length === 0 ? (
                    <div className="text-gray-400 text-center py-20">
                        No live matches available right now.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {liveMatches.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    Live Now
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {liveMatches.map((m) => (
                                        <Link
                                            key={m.id}
                                            href={`/Livestreamplayer/match/${m.id}?sport=${m.sport || sport}`}
                                            className="block bg-gray-900 border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/40 transition"
                                        >
                                            {m.poster && (
                                                <div className="w-full h-32 bg-black">
                                                    <img src={m.poster} alt={m.title} className="w-full h-full object-cover opacity-60" />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="text-xs text-gray-400 mb-2">{m.league || "Match"}{m.status ? ` • ${m.status}` : ""}</div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            {m.home_badge && <img src={m.home_badge} alt={m.home_team} className="w-5 h-5 object-contain" />}
                                                            <span className="text-white font-medium truncate">{m.home_team || "Home"}</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-bold">{m.home_score ?? 0}</span>
                                                    </div>
                                                    <div className="h-px bg-white/5" />
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            {m.away_badge && <img src={m.away_badge} alt={m.away_team} className="w-5 h-5 object-contain" />}
                                                            <span className="text-white font-medium truncate">{m.away_team || "Away"}</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-bold">{m.away_score ?? 0}</span>
                                                    </div>
                                                </div>
                                                {m.display_score && <div className="mt-2 text-xs text-gray-500 text-center">{m.display_score}</div>}
                                                {m.status_detail && <div className="mt-1 text-[10px] uppercase tracking-wider text-red-400 font-bold">{m.status_detail}</div>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {upcomingMatches.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">Upcoming (Next 24 Hours)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {upcomingMatches.map((m) => (
                                        <Link
                                            key={m.id}
                                            href={`/Livestreamplayer/match/${m.id}?sport=${m.sport || sport}`}
                                            className="block bg-gray-900 border border-white/5 rounded-xl overflow-hidden hover:border-blue-500/40 transition"
                                        >
                                            {m.poster && (
                                                <div className="w-full h-32 bg-black">
                                                    <img src={m.poster} alt={m.title} className="w-full h-full object-cover opacity-40" />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="text-xs text-blue-400 mb-2">{m.league || "Match"}</div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            {m.home_badge && <img src={m.home_badge} alt={m.home_team} className="w-5 h-5 object-contain" />}
                                                            <span className="text-white font-medium truncate">{m.home_team || "Home"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-px bg-white/5" />
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            {m.away_badge && <img src={m.away_badge} alt={m.away_team} className="w-5 h-5 object-contain" />}
                                                            <span className="text-white font-medium truncate">{m.away_team || "Away"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                                                    <span>VS</span>
                                                    <span>{m.timestamp ? formatMatchDate(m.timestamp) : "Upcoming"}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}