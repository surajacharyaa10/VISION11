"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Activity, Tv2, BarChart3, Star, List, Clock } from "lucide-react";
import { Leagues } from "@/data/leagues";

import MatchHeader from "./components/MatchHeader";
import OverviewTab from "./components/OverviewTab";
import LineupTab from "./components/LineupTab";
import StatsTab from "./components/StatsTab";
import TimelineTab from "./components/TimelineTab";
import H2HTab from "./components/H2HTab";
import TVTab from "./components/TVTab";
import ResultsTab from "./components/ResultsTab";

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

export default function FixtureDetail({ fixture, rawEvent, h2h = [], lineups = [], statistics = [], events = [], tvData = [], eventResults = [], venue = [], error, listFallback }: {
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
    listFallback?: {
        home: string | null; homeLogo: string | null;
        away: string | null; awayLogo: string | null;
        league: string | null; leagueLogo: string | null;
        date: string | null; venue: string | null;
        homeGoals: number | null; awayGoals: number | null;
        status: string | null;
    } | null;
}) {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");

    const status = fixture ? getStatusBadge(fixture) : null;
    const homeLogo = fixture?.teams.home.logo || listFallback?.homeLogo || "";
    const awayLogo = fixture?.teams.away.logo || listFallback?.awayLogo || "";
    const league = fixture ? Leagues.find((l) => l.theSportsDBId === fixture.league.id) : null;
    const leagueLogo = league?.logo || fixture?.league.logo || listFallback?.leagueLogo || "";
    const venueInfo = fixture
        ? venue.find((v: any) => v.strVenue === fixture.fixture.venue.name) || venue[0]
        : venue[0] ?? null;
    const formattedDate = fixture ? formatFixtureDate(fixture.fixture.date) : (listFallback?.date ? formatFixtureDate(listFallback.date) : "");

    return (
        <div className="min-h-screen bg-[#070a13] text-slate-100 antialiased max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            <Link href="/fixtures" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Fixtures
            </Link>

            {/* Match Header — always shown, uses listFallback → rawEvent as fallback when fixture is null */}
            <MatchHeader
                fixture={fixture}
                status={status}
                leagueLogo={leagueLogo}
                homeLogo={homeLogo}
                awayLogo={awayLogo}
                formattedDate={formattedDate}
                rawEvent={rawEvent}
                listFallback={listFallback}
            />

            {/* Tabs & Content */}
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
                        <OverviewTab rawEvent={rawEvent} venueInfo={venueInfo} listFallback={listFallback} />
                    )}

                    {activeTab === "lineup" && (
                        <LineupTab lineups={lineups} />
                    )}

                    {activeTab === "stats" && (
                        <StatsTab statistics={statistics} />
                    )}

                    {activeTab === "timeline" && (
                        <TimelineTab events={events} />
                    )}

                    {activeTab === "h2h" && (
                        <H2HTab h2h={h2h} />
                    )}

                    {activeTab === "tv" && (
                        <TVTab tvData={tvData} />
                    )}

                    {activeTab === "results" && (
                        <ResultsTab eventResults={eventResults} />
                    )}
                </div>
            </div>
        </div>
    );
}
