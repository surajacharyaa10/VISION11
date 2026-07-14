"use client";

import React, { useState } from "react";

import OverviewTab from "./components/OverviewTab";
import StandingsTab from "./components/StandingsTab";
import FixturesTab from "./components/FixturesTab";

type League = {
    id: number;
    name: string;
    category: string;
    href: string;
    imageQuery: string;
    apiFootballId: number;
    theSportsDBId: number;
    footballDataId: number | undefined;
    logo: string;
};

type LeagueInfo = {
    idLeague: string;
    strLeague: string;
    strSport: string;
    strLeagueAlternate: string;
    intFormedYear: string;
    dateFirstEvent: string;
    strGender: string;
    strCountry: string;
    strWebsite: string;
    strFacebook: string;
    strInstagram: string;
    strTwitter: string;
    strYoutube: string;
    strDescriptionEN: string;
    strFanart1: string;
    strFanart2: string;
    strFanart3: string;
    strFanart4: string;
    strBanner: string;
    strBadge: string;
    strLogo: string;
    strTrophy: string;
    strCurrentSeason?: string;
} | null;

type StandingRow = {
    intRank: string;
    strTeam: string;
    strBadge: string;
    strForm: string;
    intPlayed: string;
    intWin: string;
    intDraw: string;
    intLoss: string;
    intGoalsFor: string;
    intGoalsAgainst: string;
    intGoalDifference: string;
    intPoints: string;
    strGroup: string;
};

type Event = {
    idEvent: string;
    strEvent: string;
    strHomeTeam: string;
    strAwayTeam: string;
    strHomeTeamBadge: string;
    strAwayTeamBadge: string;
    dateEvent: string;
    strTime: string;
    strStatus: string;
    intHomeScore: string | null;
    intAwayScore: string | null;
    strLeague: string;
    strLeagueBadge: string;
    strVenue: string;
    strSeason: string;
    strRound: string;
    intRound: string;
};

type Props = {
    league: League;
    leagueInfo: LeagueInfo;
    standings: StandingRow[];
    events: Event[];
    errors: string[];
};

type TabKey = "overview" | "standings" | "fixtures";

function getTabs(category: string): { key: TabKey; label: string }[] {
    const tabs: { key: TabKey; label: string }[] = [
        { key: "overview", label: "Overview" },
        { key: "fixtures", label: "Fixtures" },
    ];

    if (category !== "cup" && category !== "friendly") {
        tabs.splice(1, 0, { key: "standings", label: "Standings" });
    }

    return tabs;
}

export default function LeagueTabs({ league, leagueInfo, standings, events, errors }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const tabs = getTabs(league.category);

    return (
        <div className="w-full max-w-5xl">
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    {leagueInfo?.strBadge && (
                        <img
                            src={leagueInfo.strBadge}
                            alt={league.name}
                            className="w-16 h-16 object-contain"
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-white">{league.name}</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {leagueInfo?.strCountry || ""} {leagueInfo?.strCurrentSeason ? `• ${leagueInfo.strCurrentSeason}` : ""}
                        </p>
                    </div>
                </div>

                {errors.length > 0 && standings.length === 0 && events.length === 0 && league.category !== "friendly" && (
                    <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-5 py-3 text-yellow-300 text-sm space-y-1">
                        <p className="font-semibold">Limited data available</p>
                        <p>Some league data may not be available for this competition.</p>
                    </div>
                )}
            </div>

            <div className="flex gap-2 mb-6 border-b border-white/10 pb-0 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                            activeTab === tab.key
                                ? "border-emerald-400 text-emerald-400"
                                : "border-transparent text-gray-400 hover:text-gray-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === "overview" && (
                    <OverviewTab league={league} leagueInfo={leagueInfo} />
                )}

                {activeTab === "standings" && league.category !== "cup" && league.category !== "friendly" && (
                    <StandingsTab league={league} standings={standings} />
                )}

                {activeTab === "fixtures" && (
                    <FixturesTab events={events} />
                )}
            </div>
        </div>
    );
}
