"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import PlayersTable from "./components/PlayersTable";
import StatsPanel from "./components/StatsPanel";

interface Team {
    idTeam: string;
    strTeam: string;
    strTeamShort?: string;
    strTeamAlternate?: string;
    intFormedYear?: string;
    strSport?: string;
    strLeague?: string;
    strCountry?: string;
    strStadium?: string;
    strDescriptionEN?: string;
    strBadge?: string;
    strLogo?: string;
    strWebsite?: string;
    strGender?: string;
    intStadiumCapacity?: string;
}

interface Event {
    idEvent: string;
    strEvent: string;
    dateEvent: string;
    strTime: string;
    strHomeTeam: string;
    strAwayTeam: string;
    intHomeScore?: string;
    intAwayScore?: string;
    strLeague: string;
    strSport: string;
    idHomeTeam?: string;
    idAwayTeam?: string;
}

interface TeamTabProps {
    team: Team;
    initialTab: string;
    previousEvents: Event[];
    nextEvents: Event[];
    h2hMatches: Event[];
    fdMatches?: any[];
    fdPlayers?: any[];
    fdStats?: any | null;
    fdTeamDetails?: any;
    opponent?: string;
}

type Tab = "overview" | "players" | "matches" | "h2h" | "stats";

export default function TeamTab({ team, initialTab, previousEvents, nextEvents, h2hMatches, fdMatches = [], fdPlayers = [], fdStats, fdTeamDetails, opponent = "" }: TeamTabProps) {
    const searchParams = useSearchParams();
    const currentTab = (searchParams.get("tab") || initialTab || "overview") as Tab;
    const router = useRouter();

    const tabs: { key: Tab; label: string }[] = [
        { key: "overview", label: "Overview" },
        { key: "players", label: "Players" },
        { key: "matches", label: "Matches" },
        { key: "h2h", label: "H2H" },
        { key: "stats", label: "Stats" },
    ];

    return (
        <div>
            <button
                type="button"
                onClick={() => router.back()}
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
            >
                <span className="text-lg leading-none">←</span>
                Back
            </button>
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-32 h-32 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                    {(team as any).strBadge || (team as any).team_logo ? (
                        <img src={(team as any).strBadge || (team as any).team_logo} alt={team.strTeam || (team as any).team_name} className="max-h-full max-w-full object-contain" />
                    ) : (
                        <span className="text-5xl font-bold text-gray-600">{team.strTeam?.charAt(0) || (team as any).team_name?.charAt(0)}</span>
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{team.strTeam || (team as any).team_name}</h1>
                    <p className="text-gray-400 mt-1">{(team as any).strCountry || (team as any).country} <span className="text-gray-500">•</span> {(team as any).strLeague || (team as any).name || (team as any).league?.name}</p>
                </div>
            </div>

            <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                    const href = `?tab=${tab.key}${opponent && tab.key === "h2h" ? `&opponent=${opponent}` : ""}`;
                    if (tab.key === "h2h" && !opponent) return null;
                    return (
                        <Link
                            key={tab.key}
                            href={href}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${currentTab === tab.key
                                ? "border-emerald-500 text-white"
                                : "border-transparent text-gray-400 hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            <div>
                {currentTab === "overview" && (
                    <div className="space-y-4">
                        {fdTeamDetails ? (
                            <div className="space-y-4">
                                <p className="text-gray-300">{fdTeamDetails.full_name || team.strTeam || fdTeamDetails.team_name}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                    {fdTeamDetails.country && <div><span className="block text-gray-500">Country</span>{fdTeamDetails.country}</div>}
                                    {fdTeamDetails.founded && <div><span className="block text-gray-500">Founded</span>{fdTeamDetails.founded}</div>}
                                    {fdTeamDetails.stadium?.name && <div><span className="block text-gray-500">Stadium</span>{fdTeamDetails.stadium.name}</div>}
                                    {fdTeamDetails.stadium?.address && <div><span className="block text-gray-500">Address</span>{fdTeamDetails.stadium.address}</div>}
                                    {fdTeamDetails.form && (
                                        <div className="col-span-2">
                                            <span className="block text-gray-500 mb-1">Form (PPG)</span>
                                            <div className="flex gap-4">
                                                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300">Home: {fdTeamDetails.form.ppg_home}</span>
                                                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300">Away: {fdTeamDetails.form.ppg_away}</span>
                                                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300">Overall: {fdTeamDetails.form.ppg_overall}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {fdTeamDetails.league_seasons && fdTeamDetails.league_seasons.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">League Seasons</h3>
                                        <div className="space-y-2">
                                            {fdTeamDetails.league_seasons.map((ls: any, idx: number) => (
                                                <div key={idx} className="p-3 border border-white/5 rounded-lg text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white font-medium">{ls.league?.name}</span>
                                                        <span className="text-gray-400">{ls.season?.label || ls.season?.year}</span>
                                                    </div>
                                                    {ls.standing && (
                                                        <div className="mt-1 text-xs text-gray-400">
                                                            Position: {ls.standing.table_position} • Performance Rank: {ls.standing.performance_rank} • Risk: {ls.standing.risk}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-300">{team.strDescriptionEN || (team as any).description || "No description available."}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                    {(team as any).strStadium && <div><span className="block text-gray-500">Stadium</span>{(team as any).strStadium}</div>}
                                    {(team as any).intFormedYear && <div><span className="block text-gray-500">Formed</span>{(team as any).intFormedYear}</div>}
                                    {(team as any).strSport && <div><span className="block text-gray-500">Sport</span>{(team as any).strSport}</div>}
                                    {(team as any).strGender && <div><span className="block text-gray-500">Gender</span>{(team as any).strGender}</div>}
                                    {(team as any).strCountry && <div><span className="block text-gray-500">Country</span>{(team as any).strCountry}</div>}
                                    {(team as any).strLeague && <div><span className="block text-gray-500">League</span>{(team as any).strLeague}</div>}
                                    {(team as any).country && <div><span className="block text-gray-500">Country</span>{(team as any).country}</div>}
                                    {(team as any).full_name && <div><span className="block text-gray-500">Full Name</span>{(team as any).full_name}</div>}
                                </div>
                            </>
                        )}
                    </div>
                )}
                {currentTab === "players" && (
                    <div className="text-gray-400">
                        {fdPlayers.length > 0 ? <PlayersTable players={fdPlayers} /> : <PlayersTable team={team} />}
                    </div>
                )}
                {currentTab === "matches" && (
                    <div className="space-y-6">
                        {fdMatches.length > 0 ? (
                            <div>
                                <h3 className="text-xl font-bold mb-3">Matches</h3>
                                {fdMatches.map((m: any) => {
                                    const date = new Date(m.match_date).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        weekday: "short",
                                    });
                                    const isScheduled = m.status === "incomplete";
                                    const statusText = m.status_localized || m.status;
                                    return (
                                        <div key={m.match_id} className="p-4 border border-white/5 rounded-xl mb-3 text-sm hover:bg-white/5 transition">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-400">{m.league?.name} • {typeof m.season?.year === "number" ? m.season.year : m.season?.year}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${isScheduled ? "border-emerald-500/40 text-emerald-300" : "border-white/10 text-gray-300"}`}>{statusText}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1 text-right text-sm font-medium text-white">{m.home_team?.team_name}</div>
                                                <div className="text-sm text-gray-300 min-w-[40px] text-center font-bold">
                                                    {isScheduled ? "vs" : `${m.score?.home ?? 0} - ${m.score?.away ?? 0}`}
                                                </div>
                                                <div className="flex-1 text-left text-sm font-medium text-white">{m.away_team?.team_name}</div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                                                <span>{date}{m.match_date ? ` • ${m.match_date.split(" ")[1] ?? ""}` : ""}</span>
                                            </div>
                                            {m.winner_text && (
                                                <div className="mt-2 text-xs text-emerald-300 font-medium">{m.winner_text}</div>
                                            )}
                                            {m.venue?.stadium_name && (
                                                <div className="mt-1 text-xs text-gray-500">{m.venue.stadium_name}{m.venue.stadium_location && <span> • {m.venue.stadium_location}</span>}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <>
                                <div>
                                    <h3 className="text-xl font-bold mb-3">Previous Matches</h3>
                                    {previousEvents.length === 0 && <p className="text-gray-400">No previous matches found.</p>}
                                    {previousEvents.map((ev: any) => (
                                        <div key={ev.idEvent} className="p-3 border border-white/5 rounded-lg mb-2 text-sm">
                                            {ev.strEvent}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3">Next Matches</h3>
                                    {nextEvents.length === 0 && <p className="text-gray-400">No upcoming matches found.</p>}
                                    {nextEvents.map((ev: any) => (
                                        <div key={ev.idEvent} className="p-3 border border-white/5 rounded-lg mb-2 text-sm">
                                            {ev.strEvent}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
                {currentTab === "h2h" && (
                    <div>
                        {h2hMatches.length === 0 ? (
                            <p className="text-gray-400">No head-to-head matches found.</p>
                        ) : (
                            h2hMatches.map((ev: any) => (
                                <div key={ev.idEvent} className="p-3 border border-white/5 rounded-lg mb-2 text-sm">
                                    {ev.strEvent}
                                </div>
                            ))
                        )}
                    </div>
                )}
                {currentTab === "stats" && <StatsPanel fdStats={fdStats} />}
            </div>
        </div>
    );
}