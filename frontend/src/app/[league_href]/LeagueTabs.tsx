"use client";

import React, { useState } from "react";

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

function formatEventDate(dateStr: string | null | undefined, timeStr: string | null | undefined): string {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let time = "";
    if (timeStr) {
        const parts = timeStr.split(":");
        const hours = parts[0] || "00";
        const minutes = parts[1] || "00";
        const parsed = new Date();
        parsed.setHours(Number(hours), Number(minutes), 0, 0);
        time = parsed.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    if (isToday) return time ? `Today • ${time}` : "Today";
    if (isTomorrow) return time ? `Tomorrow • ${time}` : "Tomorrow";

    const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });

    return time ? `${formatted} • ${time}` : formatted;
}

function getStatusBadge(status: string | null | undefined): { label: string; color: string } {
    const s = (status || "").toUpperCase();
    if (s === "NS" || s === "TBD") return { label: "Upcoming", color: "bg-yellow-500/20 text-yellow-400" };
    if (s === "FT" || s === "AET" || s === "PEN") return { label: "Full Time", color: "bg-gray-500/20 text-gray-400" };
    if (["1H", "2H", "ET", "BT", "LIVE"].includes(s)) return { label: s, color: "bg-green-500/20 text-green-400" };
    if (s === "HT") return { label: "Half Time", color: "bg-blue-500/20 text-blue-400" };
    if (["PST", "CANC", "ABD", "AWD", "WO", "SUSP", "INT"].includes(s)) return { label: s, color: "bg-red-500/20 text-red-400" };
    return { label: s || "Unknown", color: "bg-gray-500/20 text-gray-400" };
}


export default function LeagueTabs({ league, leagueInfo, standings, events, errors }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");

    const upcoming = events.filter((e) => ["NS", "TBD"].includes((e.strStatus || "").toUpperCase()));
    const past = events.filter((e) => !["NS", "TBD"].includes((e.strStatus || "").toUpperCase()));

    const groupedStandings = new Map<string, StandingRow[]>();
    for (const row of standings) {
        const group = row.strGroup && row.strGroup.trim() ? row.strGroup : "League";
        if (!groupedStandings.has(group)) groupedStandings.set(group, []);
        groupedStandings.get(group)!.push(row);
    }

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

            <div className="flex gap-2 mb-6 border-b border-white/10 pb-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 ${
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
                    <div className="space-y-6">
                        {leagueInfo?.strBanner && (
                            <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden">
                                <img
                                    src={leagueInfo.strBanner}
                                    alt={league.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {leagueInfo?.strDescriptionEN && (
                            <div className="bg-[#0d1117] rounded-xl border border-white/5 p-6">
                                <h2 className="text-lg font-bold text-white mb-3">About</h2>
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                    {leagueInfo.strDescriptionEN}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Country", value: leagueInfo?.strCountry },
                                { label: "Founded", value: leagueInfo?.intFormedYear },
                                { label: "Gender", value: leagueInfo?.strGender },
                                { label: "Sport", value: leagueInfo?.strSport },
                            ].map((item) => (
                                <div key={item.label} className="bg-[#0d1117] rounded-xl border border-white/5 p-4">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                                    <p className="text-white font-semibold text-sm">{item.value || "-"}</p>
                                </div>
                            ))}
                        </div>

                        {(leagueInfo?.strWebsite || leagueInfo?.strFacebook || leagueInfo?.strTwitter || leagueInfo?.strInstagram || leagueInfo?.strYoutube) && (
                            <div className="bg-[#0d1117] rounded-xl border border-white/5 p-6">
                                <h2 className="text-lg font-bold text-white mb-3">Links</h2>
                                <div className="flex flex-wrap gap-3">
                                    {leagueInfo.strWebsite && (
                                        <a href={leagueInfo.strWebsite.startsWith("http") ? leagueInfo.strWebsite : `https://${leagueInfo.strWebsite}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                            Website
                                        </a>
                                    )}
                                    {leagueInfo.strFacebook && (
                                        <a href={`https://${leagueInfo.strFacebook}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                            Facebook
                                        </a>
                                    )}
                                    {leagueInfo.strTwitter && (
                                        <a href={`https://${leagueInfo.strTwitter}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                            Twitter
                                        </a>
                                    )}
                                    {leagueInfo.strInstagram && (
                                        <a href={`https://${leagueInfo.strInstagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                            Instagram
                                        </a>
                                    )}
                                    {leagueInfo.strYoutube && (
                                        <a href={`https://${leagueInfo.strYoutube}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                            YouTube
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "standings" && league.category !== "cup" && league.category !== "friendly" && (
                    <div className="space-y-6">
                        {standings.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-xl">No standings found</p>
                            </div>
                        ) : (
                            Array.from(groupedStandings.entries()).map(([group, rows]) => (
                                <div key={group} className="bg-[#0d1117] rounded-xl border border-white/5 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <h3 className="text-base font-bold text-white">{group}</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                                    <th className="py-2 px-3 text-center w-12">#</th>
                                                    <th className="py-2 px-3 text-left">Team</th>
                                                    <th className="py-2 px-3 text-center">MP</th>
                                                    <th className="py-2 px-3 text-center">W</th>
                                                    <th className="py-2 px-3 text-center">D</th>
                                                    <th className="py-2 px-3 text-center">L</th>
                                                    <th className="py-2 px-3 text-center">GF</th>
                                                    <th className="py-2 px-3 text-center">GA</th>
                                                    <th className="py-2 px-3 text-center">GD</th>
                                                    <th className="py-2 px-3 text-center font-bold">Pts</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((row, idx) => {
                                                    const rank = Number(row.intRank) || idx + 1;
                                                    const gd = Number(row.intGoalDifference) || 0;
                                                    return (
                                                        <tr key={row.strTeam} className="border-b border-white/5 hover:bg-white/5 transition">
                                                            <td className="py-2.5 px-3 text-center text-gray-300 font-medium">{rank}</td>
                                                            <td className="py-2.5 px-3">
                                                                <div className="flex items-center gap-2">
                                                                    {row.strBadge && (
                                                                        <img src={row.strBadge} alt={row.strTeam} className="w-5 h-5 object-contain" />
                                                                    )}
                                                                    <span className="font-medium truncate">{row.strTeam}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5 px-3 text-center text-gray-300">{Number(row.intPlayed) || 0}</td>
                                                            <td className="py-2.5 px-3 text-center text-green-400">{Number(row.intWin) || 0}</td>
                                                            <td className="py-2.5 px-3 text-center text-gray-300">{Number(row.intDraw) || 0}</td>
                                                            <td className="py-2.5 px-3 text-center text-red-400">{Number(row.intLoss) || 0}</td>
                                                            <td className="py-2.5 px-3 text-center text-gray-300">{Number(row.intGoalsFor) || 0}</td>
                                                            <td className="py-2.5 px-3 text-center text-gray-300">{Number(row.intGoalsAgainst) || 0}</td>
                                                            <td className={`py-2.5 px-3 text-center font-medium ${gd > 0 ? "text-green-400" : gd < 0 ? "text-red-400" : "text-gray-300"}`}>
                                                                {gd > 0 ? `+${gd}` : gd}
                                                            </td>
                                                            <td className="py-2.5 px-3 text-center font-bold text-white">{Number(row.intPoints) || 0}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "fixtures" && (
                    <div className="space-y-6">
                        {events.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-xl">No matches found</p>
                            </div>
                        ) : (
                            events.map((ev) => {
                                const status = getStatusBadge(ev.strStatus);
                                const isUpcoming = ["NS", "TBD"].includes((ev.strStatus || "").toUpperCase());
                                const homeScore = ev.intHomeScore !== null && ev.intHomeScore !== undefined ? Number(ev.intHomeScore) : null;
                                const awayScore = ev.intAwayScore !== null && ev.intAwayScore !== undefined ? Number(ev.intAwayScore) : null;

                                return (
                                    <div key={ev.idEvent} className="bg-[#0d1117] rounded-xl border border-white/5 p-5 hover:border-emerald-500/30 transition">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-gray-400 text-xs">{formatEventDate(ev.dateEvent, ev.strTime)}</span>
                                            <span className={`${status.color} px-3 py-1 rounded-full text-xs font-semibold`}>{status.label}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                {ev.strHomeTeamBadge && (
                                                    <img src={ev.strHomeTeamBadge} alt={ev.strHomeTeam} className="w-10 h-10 object-contain" />
                                                )}
                                                <span className="font-medium text-sm truncate">{ev.strHomeTeam}</span>
                                            </div>
                                            {isUpcoming ? (
                                                <span className="text-gray-500 font-bold mx-4">VS</span>
                                            ) : (
                                                <div className="flex items-center gap-2 mx-4">
                                                    <span className="text-2xl font-bold text-white">{homeScore ?? "-"}</span>
                                                    <span className="text-gray-500 font-bold">-</span>
                                                    <span className="text-2xl font-bold text-white">{awayScore ?? "-"}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 flex-1 justify-end">
                                                <span className="font-medium text-sm truncate">{ev.strAwayTeam}</span>
                                                {ev.strAwayTeamBadge && (
                                                    <img src={ev.strAwayTeamBadge} alt={ev.strAwayTeam} className="w-10 h-10 object-contain" />
                                                 )}
                                             </div>
                                         </div>
                                         {ev.strVenue && (
                                             <p className="text-gray-500 text-xs mt-3">🏟 {ev.strVenue}</p>
                                         )}
                                     </div>
                                 );
                             })
                         )}
                     </div>
                 )}
            </div>
        </div>
    );
}
