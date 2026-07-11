"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, Activity, Tv2, BarChart3, Star, List, Clock } from "lucide-react";
import { Leagues } from "@/data/leagues";

type TabKey = "overview" | "lineup" | "stats" | "timeline" | "h2h" | "tv" | "results";

const TABS: { key: TabKey; label: string; icon?: any }[] = [
    { key: "overview", label: "Overview", icon: List },
    { key: "lineup", label: "Lineup", icon: Users },
    { key: "stats", label: "Stats", icon: BarChart3 },
    { key: "timeline", label: "Timeline", icon: Clock },
    { key: "h2h", label: "H2H", icon: Activity },
    { key: "tv", label: "TV", icon: Tv2 },
    { key: "results", label: "Results", icon: Star },
];

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

export default function FixtureDetail({ fixture, rawEvent, h2h, lineups, statistics, events, tvData, eventResults, venue }: {
    fixture: any;
    rawEvent: any;
    h2h: any[];
    lineups: any[];
    statistics: any[];
    events: any[];
    tvData: any[];
    eventResults: any[];
    venue: any[];
    error?: string | null;
}) {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");

    if (!fixture) {
        return (
            <div className="min-h-screen bg-[#070a13] text-white p-6 flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-gray-400 mb-4">Fixture not found</p>
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
    const venueInfo = venue.find((v: any) => v.strVenue === fixture.fixture.venue.name) || venue[0];

    return (
        <div className="min-h-screen bg-[#070a13] text-slate-100 antialiased max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            <Link href="/fixtures" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Fixtures
            </Link>

            {/* Match Header */}
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

            {/* Tabs */}
            <div className="bg-[#0e1424] rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-medium whitespace-nowrap transition ${activeTab === tab.key ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-400 hover:text-gray-300"
                                }`}
                        >
                            {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-4 md:p-6 space-y-6">
                    {activeTab === "overview" && (
                        <div className="space-y-4">
                            {rawEvent && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                        <div className="bg-white/5 rounded-lg p-2.5">
                                            <span className="text-gray-400 block mb-1">Date</span>
                                            <span className="text-white font-medium">{new Date(rawEvent.dateEvent).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2.5">
                                            <span className="text-gray-400 block mb-1">Season</span>
                                            <span className="text-white font-medium">{rawEvent.strSeason ?? "N/A"}</span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2.5">
                                            <span className="text-gray-400 block mb-1">Time</span>
                                            <span className="text-white font-medium">{rawEvent.strTime ? new Date(rawEvent.strTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) : "TBD"}</span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2.5">
                                            <span className="text-gray-400 block mb-1">Round</span>
                                            <span className="text-white font-medium">{rawEvent.intRound ? `Round ${rawEvent.intRound}` : "N/A"}</span>
                                        </div>
                                    </div>

                                    {venueInfo && (
                                        <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                                                <MapPin className="w-3.5 h-3.5" />
                                                Venue
                                            </div>
                                            <p className="text-white text-sm font-medium">{venueInfo.strVenue}</p>
                                            <p className="text-xs text-gray-400">{venueInfo.strLocation}</p>
                                            {venueInfo.intCapacity && <p className="text-xs text-gray-400">Capacity: {venueInfo.intCapacity}</p>}
                                        </div>
                                    )}

                                    {rawEvent.strDescriptionEN && (
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <p className="text-xs text-gray-300 leading-relaxed">{rawEvent.strDescriptionEN}</p>
                                        </div>
                                    )}

                                    {rawEvent.strVideo && (
                                        <div>
                                            <span className="text-xs text-gray-400">Watch video</span>
                                            <a href={rawEvent.strVideo} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline block mt-1">
                                                {rawEvent.strVideo}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "lineup" && (
                        <div className="space-y-3">
                            {lineups.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No lineup available</p>}
                            {lineups.map((lu: any, idx: number) => (
                                <div key={idx} className="bg-white/5 rounded-lg p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-white">{lu.team?.name}</span>
                                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{lu.formation}</span>
                                    </div>
                                    {lu.startXI && lu.startXI.length > 0 && (
                                        <div className="space-y-1">
                                            {lu.startXI.map((p: any) => (
                                                <div key={p.player?.id} className="flex items-center gap-2 text-xs">
                                                    <span className="text-gray-500 w-4 text-right">{p.player?.number}</span>
                                                    <span className="text-white truncate">{p.player?.name}</span>
                                                    {p.player?.pos && <span className="text-[10px] text-gray-400 bg-white/5 px-1 rounded">{p.player.pos}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {lu.substitutes && lu.substitutes.length > 0 && (
                                        <div className="space-y-1 mt-2 border-t border-white/5 pt-2">
                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Substitutes</span>
                                            {lu.substitutes.map((p: any) => (
                                                <div key={p.player?.id} className="flex items-center gap-2 text-xs">
                                                    <span className="text-gray-500 w-4 text-right">{p.player?.number}</span>
                                                    <span className="text-white truncate">{p.player?.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "stats" && (
                        <div className="space-y-3">
                            {statistics.length < 2 && <p className="text-xs text-gray-400 text-center py-4">No statistics available</p>}
                            {statistics.length >= 2 && (() => {
                                const homeStats = statistics[0].statistics ?? [];
                                const awayStats = statistics[1].statistics ?? [];
                                const homeName = statistics[0]?.team?.name ?? "Home";
                                const awayName = statistics[1]?.team?.name ?? "Away";
                                return homeStats.map((stat: any, idx: number) => {
                                    const away = awayStats[idx];
                                    const homeVal = Number(stat.value) || 0;
                                    const awayVal = Number(away?.value) || 0;
                                    const max = Math.max(homeVal, awayVal, 1);
                                    return (
                                        <div key={stat.type ?? idx} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs px-1">
                                                <span className="text-white font-medium w-16 truncate">{homeName}</span>
                                                <span className="text-gray-400 text-[10px] uppercase tracking-wider">{stat.type}</span>
                                                <span className="text-white font-medium w-16 text-right truncate">{awayName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-white font-bold w-8 text-right">{homeVal}</span>
                                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                                                    <div className="bg-emerald-500/80 h-full rounded-full" style={{ width: `${Math.min(100, (homeVal / max) * 100)}%` }} />
                                                </div>
                                                <span className="text-xs text-white font-bold w-8">{awayVal}</span>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    )}

                    {activeTab === "timeline" && (
                        <div className="space-y-2">
                            {events.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No timeline events</p>}
                            {events.map((ev: any, idx: number) => {
                                const icon = ev.type === "Goal" ? "⚽" : ev.type === "Card" ? (ev.detail?.toLowerCase().includes("yellow") ? "🟨" : "🟥") : ev.type === "Subst" ? "🔄" : "ℹ️";
                                return (
                                    <div key={idx} className="flex items-start gap-2 bg-white/5 rounded-lg p-2.5 text-xs">
                                        <span className="text-base leading-none mt-0.5">{icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-medium truncate">{ev.player?.name}</span>
                                                <span className="text-[10px] text-gray-400 ml-2 shrink-0">{ev.time.elapsed}'</span>
                                            </div>
                                            <span className="text-gray-400 text-[10px]">{ev.team?.name} • {ev.detail}</span>
                                            {ev.assist?.name && <span className="text-gray-500 text-[10px] block mt-0.5">Assist: {ev.assist.name}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === "h2h" && (
                        <div className="space-y-2">
                            {h2h.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No head-to-head matches</p>}
                            {h2h.map((match: any, idx: number) => {
                                const home = match.teams?.home;
                                const away = match.teams?.away;
                                const date = match.fixture?.date ? new Date(match.fixture.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
                                return (
                                    <div key={match.fixture?.id ?? idx} className="flex items-center justify-between bg-white/5 rounded-lg p-2.5 text-xs">
                                        <span className="text-gray-400">{date}</span>
                                        <div className="flex items-center gap-2 flex-1 justify-center">
                                            <span className="text-white font-medium text-right w-24 truncate">{home?.name ?? ""}</span>
                                            <span className="text-emerald-400 font-bold">{match.goals?.home ?? 0} - {match.goals?.away ?? 0}</span>
                                            <span className="text-white font-medium text-left w-24 truncate">{away?.name ?? ""}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === "tv" && (
                        <div className="space-y-2">
                            {tvData.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No broadcast info</p>}
                            {tvData.map((tv: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                                    {tv.strLogo && (
                                        <img src={tv.strLogo} alt={tv.strChannel} className="w-8 h-8 object-contain rounded" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white truncate">{tv.strChannel}</p>
                                        <p className="text-[10px] text-gray-400">{tv.strCountry}</p>
                                    </div>
                                    <span className="text-[10px] text-emerald-400 font-medium">{tv.strTime}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "results" && (
                        <div className="space-y-2">
                            {eventResults.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No results</p>}
                            {eventResults.map((r: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5 text-xs">
                                    <span className="text-lg font-black text-emerald-400 w-4">{r.intPosition}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{r.strPlayer}</p>
                                        <p className="text-gray-400 text-[10px]">{r.idTeam ? `Team ${r.idTeam}` : ""}</p>
                                    </div>
                                    <span className="text-white font-bold">{r.intPoints ?? "0"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
