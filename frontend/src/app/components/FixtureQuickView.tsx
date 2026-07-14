"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    X, ArrowUpRight, MapPin, Calendar, List, BarChart3,
    Clock, Users, Activity, Tv2, Star, Loader2,
} from "lucide-react";
import { Leagues } from "@/data/leagues";

/* ── tiny helpers ────────────────────────────────────────── */
function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
        year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
    });
}

function statusBadge(short: string, elapsed: number | null) {
    if (short === "NS" || short === "TBD") return { label: "Upcoming", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
    if (["FT","AET","PEN"].includes(short))  return { label: "Full Time", cls: "bg-slate-500/15 text-slate-400 border-slate-500/20" };
    if (["1H","2H","ET","BT","LIVE"].includes(short)) return { label: elapsed ? `Live ${short} ${elapsed}'` : "Live", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 animate-pulse" };
    if (short === "HT") return { label: "Half Time", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" };
    return { label: short, cls: "bg-rose-500/15 text-rose-400 border-rose-500/20" };
}

/* ── Match header inside modal ───────────────────────────── */
function ModalHeader({ fixture, fallback }: { fixture: any; fallback: MatchFallback }) {
    const homeName  = fixture?.teams?.home?.name  ?? fallback.homeName;
    const awayName  = fixture?.teams?.away?.name  ?? fallback.awayName;
    const homeLogo  = fixture?.teams?.home?.logo  ?? fallback.homeLogo;
    const awayLogo  = fixture?.teams?.away?.logo  ?? fallback.awayLogo;
    const league    = fixture ? Leagues.find(l => l.theSportsDBId === fixture.league?.id) : null;
    const lLogo     = league?.logo || fixture?.league?.logo || fallback.leagueLogo;
    const lName     = fixture?.league?.name ?? fallback.competition;
    const date      = fixture ? fmtDate(fixture.fixture.date) : fallback.date;
    const venue     = fixture?.fixture?.venue?.name ?? "";
    const isUpcoming = !fixture || ["NS","TBD"].includes(fixture.fixture.status.short);
    const sb        = fixture ? statusBadge(fixture.fixture.status.short, fixture.fixture.status.elapsed) : { label: "Upcoming", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
    const homeGoals = fixture?.goals?.home ?? null;
    const awayGoals = fixture?.goals?.away ?? null;
    const hasScore  = homeGoals !== null && !isUpcoming;

    return (
        <div className="bg-gradient-to-b from-[#141b30] to-[#0e1424] rounded-2xl p-5 border border-white/5">
            {/* League row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {lLogo && <img src={lLogo} alt={lName} className="w-5 h-5 object-contain" onError={e => { (e.target as any).style.display="none"; }} />}
                    <span className="text-xs font-semibold text-neutral-300">{lName}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${sb.cls}`}>{sb.label}</span>
            </div>

            {/* Teams */}
            <div className="grid grid-cols-3 items-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-xl bg-black/30 border border-white/8 p-2.5 flex items-center justify-center">
                        {homeLogo
                            ? <img src={homeLogo} alt={homeName} className="w-full h-full object-contain" onError={e => { (e.target as any).style.display="none"; }} />
                            : <span className="text-sm font-bold text-slate-400">{homeName.slice(0,3).toUpperCase()}</span>
                        }
                    </div>
                    <p className="text-xs font-bold text-center leading-tight">{homeName}</p>
                </div>

                <div className="text-center">
                    {hasScore ? (
                        <div className="bg-black/30 rounded-xl px-4 py-2 border border-white/5 inline-block">
                            <span className="text-3xl font-black text-white tracking-tight">{homeGoals}</span>
                            <span className="text-slate-600 mx-1.5">:</span>
                            <span className="text-3xl font-black text-white tracking-tight">{awayGoals}</span>
                        </div>
                    ) : (
                        <div className="bg-black/30 rounded-xl px-3 py-1.5 border border-white/5 inline-block">
                            <span className="text-lg font-black text-amber-400">VS</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-xl bg-black/30 border border-white/8 p-2.5 flex items-center justify-center">
                        {awayLogo
                            ? <img src={awayLogo} alt={awayName} className="w-full h-full object-contain" onError={e => { (e.target as any).style.display="none"; }} />
                            : <span className="text-sm font-bold text-slate-400">{awayName.slice(0,3).toUpperCase()}</span>
                        }
                    </div>
                    <p className="text-xs font-bold text-center leading-tight">{awayName}</p>
                </div>
            </div>

            {/* Date / Venue */}
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-3 text-[11px] text-slate-400">
                {date && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{date}</span>
                )}
                {venue && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{venue}</span>
                )}
            </div>
        </div>
    );
}

/* ── Stats mini view ─────────────────────────────────────── */
function MiniStats({ statistics }: { statistics: any[] }) {
    if (!Array.isArray(statistics) || statistics.length < 2) {
        return <p className="text-xs text-gray-400 text-center py-6">No statistics available</p>;
    }
    const homeStats = statistics[0].statistics ?? [];
    const awayStats = statistics[1].statistics ?? [];
    const homeName  = statistics[0]?.team?.name ?? "Home";
    const awayName  = statistics[1]?.team?.name ?? "Away";

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between text-xs px-1 pb-2 border-b border-white/5">
                <span className="font-bold text-emerald-400 truncate flex-1">{homeName}</span>
                <span className="text-gray-500 mx-2">vs</span>
                <span className="font-bold text-blue-400 truncate flex-1 text-right">{awayName}</span>
            </div>
            {homeStats.slice(0, 8).map((stat: any, idx: number) => {
                const away = awayStats[idx];
                const hv = Number(stat.value) || 0;
                const av = Number(away?.value) || 0;
                const max = Math.max(hv, av, 1);
                return (
                    <div key={stat.type ?? idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-white font-semibold w-6 text-left">{hv}</span>
                            <span className="text-gray-400 text-[10px] uppercase tracking-wider flex-1 text-center">{stat.type}</span>
                            <span className="text-white font-semibold w-6 text-right">{av}</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex justify-end">
                                <div className="bg-emerald-500/80 h-full rounded-full" style={{ width: `${Math.min(100,(hv/max)*100)}%` }} />
                            </div>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="bg-blue-500/80 h-full rounded-full" style={{ width: `${Math.min(100,(av/max)*100)}%` }} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ── Timeline mini view ──────────────────────────────────── */
function MiniTimeline({ events }: { events: any[] }) {
    if (!Array.isArray(events) || events.length === 0) {
        return <p className="text-xs text-gray-400 text-center py-6">No events available</p>;
    }
    return (
        <div className="space-y-2">
            {events.map((ev, idx) => {
                const icon = ev.type === "Goal" ? "⚽" : ev.type === "Card" ? (ev.detail?.toLowerCase().includes("yellow") ? "🟨" : "🟥") : ev.type === "Subst" ? "🔄" : "ℹ️";
                return (
                    <div key={idx} className="flex items-start gap-2 bg-white/5 rounded-lg p-2.5 text-xs">
                        <span className="text-base leading-none mt-0.5">{icon}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium truncate">{ev.player?.name}</span>
                                <span className="text-[10px] text-gray-400 ml-2 shrink-0">{ev.time?.elapsed}'</span>
                            </div>
                            <span className="text-gray-400 text-[10px]">{ev.team?.name} • {ev.detail}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ── Types ───────────────────────────────────────────────── */
export interface MatchFallback {
    fixtureId: number;
    homeName: string;
    homeLogo: string;
    awayName: string;
    awayLogo: string;
    competition: string;
    leagueLogo: string;
    date: string;
    fixtureHref: string;
}

type TabKey = "overview" | "stats" | "timeline";
const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: List },
    { key: "stats",    label: "Stats",    icon: BarChart3 },
    { key: "timeline", label: "Timeline", icon: Clock },
];

/* ── Main Modal ──────────────────────────────────────────── */
export default function FixtureQuickView({ match, onClose }: { match: MatchFallback; onClose: () => void }) {
    const [loading, setLoading] = useState(true);
    const [fixture,    setFixture]    = useState<any>(null);
    const [events,     setEvents]     = useState<any[]>([]);
    const [statistics, setStatistics] = useState<any[]>([]);
    const [rawEvent,   setRawEvent]   = useState<any>(null);
    const [activeTab,  setActiveTab]  = useState<TabKey>("overview");
    const sheetRef = useRef<HTMLDivElement>(null);

    // Fetch fixture data
    useEffect(() => {
        setLoading(true);
        setFixture(null); setEvents([]); setStatistics([]); setRawEvent(null);
        fetch(`/api/fixture-detail?id=${match.fixtureId}`)
            .then(r => r.json())
            .then(data => {
                setFixture(data.fixture ?? null);
                setEvents(data.events ?? []);
                setStatistics(data.statistics ?? []);
                setRawEvent(data.rawEvent ?? null);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [match.fixtureId]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const venue  = fixture?.fixture?.venue?.name ?? rawEvent?.strVenue ?? "";
    const season = rawEvent?.strSeason ?? "";
    const desc   = rawEvent?.strDescriptionEN ?? "";

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Dim overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Sheet */}
            <div
                ref={sheetRef}
                className="relative z-10 w-full md:max-w-2xl max-h-[92dvh] md:max-h-[88vh] bg-[#0e1424] md:rounded-3xl rounded-t-3xl border border-white/8 shadow-2xl shadow-black/60 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            >
                {/* Header bar */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                    <p className="text-sm font-bold text-white">Match Details</p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={match.fixtureHref}
                            className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                            onClick={onClose}
                        >
                            Full Details <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Match header — shows immediately with fallback */}
                    <ModalHeader fixture={fixture} fallback={match} />

                    {/* Loading spinner */}
                    {loading && (
                        <div className="flex items-center justify-center py-8 gap-2 text-sm text-neutral-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading match data…
                        </div>
                    )}

                    {/* Tabs */}
                    {!loading && (
                        <>
                            <div className="flex border-b border-white/5">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition ${
                                            activeTab === tab.key
                                                ? "text-emerald-400 border-b-2 border-emerald-400"
                                                : "text-gray-400 hover:text-gray-300"
                                        }`}
                                    >
                                        <tab.icon className="w-3.5 h-3.5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div>
                                {activeTab === "overview" && (
                                    <div className="space-y-3 text-xs">
                                        {venue && (
                                            <div className="flex items-start gap-2 bg-white/5 rounded-xl p-3">
                                                <MapPin className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Venue</p>
                                                    <p className="font-semibold text-white">{venue}</p>
                                                </div>
                                            </div>
                                        )}
                                        {season && (
                                            <div className="flex items-start gap-2 bg-white/5 rounded-xl p-3">
                                                <Activity className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Season</p>
                                                    <p className="font-semibold text-white">{season}</p>
                                                </div>
                                            </div>
                                        )}
                                        {desc && (
                                            <div className="bg-white/5 rounded-xl p-3">
                                                <p className="text-slate-300 leading-relaxed">{desc}</p>
                                            </div>
                                        )}
                                        {!venue && !season && !desc && (
                                            <p className="text-center text-gray-500 py-6">No overview details available</p>
                                        )}
                                    </div>
                                )}
                                {activeTab === "stats"    && <MiniStats    statistics={statistics} />}
                                {activeTab === "timeline" && <MiniTimeline events={events} />}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
