"use client";

import { useState } from "react";
import type { Fixture } from "@/thesportsdb/fixtures";
import { Leagues } from "@/data/leagues";
import Link from "next/link";
import { Radio, SlidersHorizontal } from "lucide-react";

/* ─── helpers ─────────────────────────────────────────── */

function pad(value: number): string {
    return String(value).padStart(2, "0");
}

function formatFixtureDate(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const time = `${hours}:${minutes}`;

    if (date.toDateString() === today.toDateString()) return `Today • ${time}`;
    if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow • ${time}`;

    const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    return `${month} ${date.getUTCDate()} • ${time}`;
}

function getStatusBadge(fixture: Fixture) {
    const short = fixture.fixture.status.short;
    const elapsed = fixture.fixture.status.elapsed;

    if (["NS", "TBD"].includes(short)) return { label: "Upcoming", style: "bg-amber-500/15 text-amber-400 border-amber-500/25" };
    if (["FT", "AET", "PEN"].includes(short)) return { label: "Full Time", style: "bg-neutral-500/15 text-neutral-400 border-neutral-500/25" };
    if (["1H", "2H", "ET", "BT", "LIVE"].includes(short)) return {
        label: elapsed ? `${short} ${elapsed}'` : short,
        style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 animate-pulse",
        live: true,
    };
    if (short === "HT") return { label: "Half Time", style: "bg-blue-500/15 text-blue-400 border-blue-500/25" };
    return { label: fixture.fixture.status.long, style: "bg-red-500/15 text-red-400 border-red-500/25" };
}

/* ─── Team sub-component ───────────────────────────────── */
function Team({ name, logo }: { name: string; logo: string }) {
    return (
        <div className="flex flex-col items-center text-center gap-2 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/8 p-2 flex items-center justify-center">
                <img
                    src={logo}
                    alt={name}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                />
            </div>
            <p className="text-[13px] font-medium text-white/90 truncate max-w-[100px] leading-tight">{name}</p>
        </div>
    );
}

/* ─── Main component ────────────────────────────────────── */
export default function FixtureFilters({ fixtures }: { fixtures: Fixture[] }) {

    // Build unique sorted league list — coerce IDs to Number to avoid string/number mismatch
    const leagueObjects = Array.from(
        new Map(fixtures.map(f => [Number(f.league.id), f.league])).values()
    ).sort((a, b) => {
        const aLive = fixtures.some(f => Number(f.league.id) === Number(a.id) && ["1H","2H","ET","BT","LIVE"].includes(f.fixture.status.short));
        const bLive = fixtures.some(f => Number(f.league.id) === Number(b.id) && ["1H","2H","ET","BT","LIVE"].includes(f.fixture.status.short));
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
        return fixtures.filter(f => Number(f.league.id) === Number(b.id)).length - fixtures.filter(f => Number(f.league.id) === Number(a.id)).length;
    });

    const [league, setLeague] = useState<number | "All">("All");
    const [liveOnly, setLiveOnly] = useState(false);

    const filtered = fixtures.filter(match => {
        // Coerce to Number on both sides — the API can return string IDs
        const leagueMatch = league === "All" || Number(match.league.id) === Number(league);
        const liveMatch = !liveOnly || ["1H","2H","ET","BT","LIVE"].includes(match.fixture.status.short);
        return leagueMatch && liveMatch;
    });

    const liveCount = fixtures.filter(f => ["1H","2H","ET","BT","LIVE"].includes(f.fixture.status.short)).length;

    return (
        <>
            {/* ── FILTER BAR ── */}
            <div className="mb-6 space-y-3">
                {/* Stats row */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{filtered.length} matches</span>
                    </div>
                    {liveCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md animate-pulse">
                            <Radio className="w-3 h-3" /> {liveCount} Live
                        </span>
                    )}
                </div>

                {/* Pill chips — horizontally scrollable */}
                <div
                    className="flex gap-2 overflow-x-auto pb-1"
                    style={{ scrollbarWidth: "none" }}
                >
                    {/* Live toggle pill */}
                    <button
                        onClick={() => setLiveOnly(v => !v)}
                        className={`
                            flex-none flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                            border transition-all duration-200 whitespace-nowrap
                            ${liveOnly
                                ? "bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/25"
                                : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                            }
                        `}
                    >
                        <Radio className="w-3 h-3" />
                        Live Only
                    </button>

                    {/* "All" pill */}
                    <button
                        onClick={() => setLeague("All")}
                        className={`
                            flex-none px-3.5 py-2 rounded-xl text-xs font-semibold
                            border transition-all duration-200 whitespace-nowrap
                            ${league === "All"
                                ? "bg-white text-black border-white shadow-md"
                                : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                            }
                        `}
                    >
                        All Leagues
                    </button>

                    {/* League pills */}
                    {leagueObjects.map(lg => {
                        const lgId = Number(lg.id);
                        const meta = Leagues.find(l => l.theSportsDBId === lgId);
                        const logo = meta?.logo || lg.logo;
                        const isActive = league === lgId;
                        const hasLive = fixtures.some(f => Number(f.league.id) === lgId && ["1H","2H","ET","BT","LIVE"].includes(f.fixture.status.short));

                        return (
                            <button
                                key={lgId}
                                onClick={() => setLeague(isActive ? "All" : lgId)}
                                className={`
                                    flex-none flex items-center gap-2 pl-2 pr-3.5 py-2 rounded-xl text-xs font-semibold
                                    border transition-all duration-200 whitespace-nowrap
                                    ${isActive
                                        ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10"
                                        : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                                    }
                                `}
                            >
                                {logo && (
                                    <img
                                        src={logo}
                                        alt={lg.name}
                                        className="w-4 h-4 object-contain"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                )}
                                {lg.name}
                                {hasLive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── FIXTURE CARDS ── */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500">
                        <Radio className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No matches found</p>
                    </div>
                ) : (
                    filtered.map(match => {
                        const meta = Leagues.find(l => l.theSportsDBId === match.league.id);
                        const status = getStatusBadge(match);
                        const leagueLogo = meta?.logo || match.league.logo || "";
                        const homeLogo = match.teams.home.logo || "";
                        const awayLogo = match.teams.away.logo || "";
                        const isLive = ["1H","2H","ET","BT","LIVE"].includes(match.fixture.status.short);
                        const isUpcoming = ["NS","TBD"].includes(match.fixture.status.short);

                        return (
                            <Link
                                href={`/fixtures/${match.fixture.id}?home=${encodeURIComponent(match.teams.home.name)}&homeLogo=${encodeURIComponent(homeLogo)}&away=${encodeURIComponent(match.teams.away.name)}&awayLogo=${encodeURIComponent(awayLogo)}&league=${encodeURIComponent(match.league.name)}&leagueLogo=${encodeURIComponent(leagueLogo)}&date=${encodeURIComponent(match.fixture.date)}&venue=${encodeURIComponent(match.fixture.venue.name ?? '')}&homeGoals=${match.goals.home ?? ''}&awayGoals=${match.goals.away ?? ''}&status=${encodeURIComponent(match.fixture.status.short)}`}
                                key={match.fixture.id}
                                className={`
                                    group block rounded-2xl border transition-all duration-300
                                    ${isLive
                                        ? "bg-gradient-to-br from-emerald-950/30 via-[#0f1420] to-[#0b0f19] border-emerald-500/20 hover:border-emerald-500/40"
                                        : "bg-[#0f1420] border-white/5 hover:border-white/15"
                                    }
                                `}
                            >
                                {/* Live indicator strip */}
                                {isLive && (
                                    <div className="h-0.5 rounded-t-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent" />
                                )}

                                <div className="p-4 md:p-5">
                                    {/* League header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            {leagueLogo && (
                                                <img
                                                    src={leagueLogo}
                                                    alt={match.league.name}
                                                    className="w-4 h-4 object-contain"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                                />
                                            )}
                                            <span className="text-xs font-semibold text-emerald-400/90">{match.league.name}</span>
                                        </div>
                                        <span className="text-xs text-neutral-500">{formatFixtureDate(match.fixture.date)}</span>
                                    </div>

                                    {/* Match body */}
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <Team name={match.teams.home.name} logo={homeLogo} />

                                        {/* Score / VS */}
                                        <div className="flex flex-col items-center gap-1">
                                            {isUpcoming ? (
                                                <span className="text-xl font-black text-neutral-500">VS</span>
                                            ) : (
                                                <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                                    {match.goals.home ?? 0}
                                                    <span className="text-neutral-600 mx-1">–</span>
                                                    {match.goals.away ?? 0}
                                                </span>
                                            )}
                                        </div>

                                        <Team name={match.teams.away.name} logo={awayLogo} />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/5">
                                        <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                                            <span className="text-base leading-none">🏟</span>
                                            {match.fixture.venue.name ?? "TBD"}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${(status as any).style}`}>
                                            {(status as any).live && <span className="mr-1">●</span>}
                                            {status.label}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </>
    );
}