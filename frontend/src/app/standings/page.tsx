import Link from "next/link";
import { Suspense } from "react";
import { getStandings, isLikelyTruncated } from "@/thesportsdb";
import { getFootballdataSeasons } from "@/thesportsdb/footballdata";
import { Leagues } from "@/data/leagues";
import { Trophy } from "lucide-react";
import TeamLogo from "./TeamLogo";
import LeagueSelect from "./LeagueSelect";
import GroupStage from "./GroupStage";
import SeasonSelect from "./SeasonSelect";
export const dynamic = "force-dynamic";

interface PageProps {
    searchParams?: { league?: string; season?: string };
}

function FormBadge({ result }: { result: string }) {
    const colorClass =
        result === "W"
            ? "bg-green-500"
            : result === "D"
                ? "bg-gray-500"
                : "bg-red-500";
    return (
        <span className={`inline-flex w-5 h-5 rounded-sm text-[10px] font-bold text-white items-center justify-center ${colorClass}`}>
            {result}
        </span>
    );
}


function TeamRow({ team, index }: { team: any; index: number }) {
    const form: string[] = team.form ? String(team.form).split("") : [];
    const gd = team.goalsDiff ?? 0;
    const goalsFor = team.all?.goals?.for ?? 0;

    return (
        <div className="grid grid-cols-12 gap-2 items-center pl-5 pr-4 md:pr-6 py-2.5 border-b border-white/5 hover:bg-white/5 transition text-sm">
            <div className="col-span-1 font-bold text-gray-300">
                {team.rank ?? index + 1}
            </div>
            <div className="col-span-3 flex items-center gap-3 min-w-0">
                <TeamLogo src={team.team?.logo} name={team.team?.name ?? "?"} />
                <span className="font-medium truncate">{team.team?.name}</span>
            </div>
            <div className="col-span-1 text-center text-gray-300">{team.all?.played ?? 0}</div>
            <div className="col-span-1 text-center text-gray-300">
                {team.all?.win ?? 0}-{team.all?.draw ?? 0}-{team.all?.lose ?? 0}
            </div>
            <div className="col-span-1 text-center font-medium text-gray-200">
                {gd > 0 ? `+${gd}` : gd}
            </div>
            <div className="col-span-1 text-center font-medium text-gray-200">{goalsFor}</div>
            <div className="col-span-3 flex gap-1 justify-center items-center">
                {form.length > 0
                    ? form.map((f, i) => <FormBadge key={i} result={f} />)
                    : <span className="text-gray-500 text-xs">-</span>}
            </div>
            <div className="col-span-1 text-center font-bold text-white">{team.points ?? 0}</div>
        </div>
    );
}

export default async function StandingPage({ searchParams }: PageProps) {
    const domesticLeagues = Leagues.filter((l) => l.category === "league");
    const defaultId = domesticLeagues[0]?.theSportsDBId ?? 4328;
    const leagueId = Number(searchParams?.league) || defaultId;
    const league = Leagues.find((l) => l.theSportsDBId === leagueId);

    let initialSeason: string | undefined;
    let seasons: any[] = [];

    if (league?.footballDataId) {
        try {
            const fdSeasons = await getFootballdataSeasons(league.theSportsDBId);
            seasons = fdSeasons;
            if (fdSeasons.length) {
                const current = searchParams?.season ? Number(searchParams.season) : undefined;
                if (current && fdSeasons.some((s) => s.season_id === current)) {
                    initialSeason = String(current);
                } else if (fdSeasons[0]) {
                    initialSeason = String(fdSeasons[0].season_id);
                }
            }
        } catch {
            initialSeason = searchParams?.season;
        }
    }

    const selectedSeason = initialSeason ?? searchParams?.season ?? undefined;

    let standings: any[] = [];
    let error: string | null = null;
    let truncated = false;

    try {
        const res = await getStandings({
            league: leagueId,
            season: selectedSeason ? Number(selectedSeason) : undefined,
        });
        standings = res.response?.[0]?.league?.standings?.[0] ?? [];
        truncated = isLikelyTruncated((res as any).response?.[0], 20);
    } catch (e) {
        error =
            e instanceof Error
                ? e.message
                : "Failed to load standings. Please try again later.";
    }

    const groups = new Map<string, any[]>();
    const leagueDisplayName = league?.name ?? "League";
    for (const t of standings) {
        let g = t.group && t.group.trim() ? t.group : "League";
        if (g === "League") g = leagueDisplayName;
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g)!.push(t);
    }
    const groupEntries = Array.from(groups.entries());
    const hasMultipleGroups = groupEntries.length > 1;

    return (
        <main className="min-h-screen text-white">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/15">
                        <Trophy className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                            {league?.name ?? "League"} Standings
                        </h1>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Live rankings powered by Vision11 AI
                        </p>
                    </div>
                </div>
                {/* Selectors */}
                <div className="flex flex-wrap items-center gap-2">
                    <Suspense fallback={<div className="h-10 w-40 rounded-xl bg-white/5 animate-pulse" />}>
                        <LeagueSelect current={leagueId} leagues={domesticLeagues} />
                    </Suspense>
                    {seasons.length > 0 && (
                        <Suspense fallback={<div className="h-10 w-28 rounded-xl bg-white/5 animate-pulse" />}>
                            <SeasonSelect seasons={seasons} />
                        </Suspense>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {error && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-300">
                        {error}
                    </div>
                )}

                {!error && standings.length === 0 && (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-gray-300">
                        No standings found for this competition.
                    </div>
                )}

                {!error && groupEntries.length > 0 && (
                    <div>
                        {groupEntries.map(([group, teams]) => (
                            <GroupStage key={group} teams={teams} groupName={group} leagueId={leagueId} />
                        ))}
                    </div>
                )}

                {!error && standings.length > 0 && (
                    <div className="mt-8 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                        <details className="group">
                            <summary className="px-5 py-4 border-b border-white/10 cursor-pointer text-sm font-bold text-white hover:bg-white/5 transition flex items-center justify-between list-none">
                                <span>Rules and Legend</span>
                                <svg className="w-5 h-5 text-gray-400 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="px-5 py-4 text-sm text-gray-300 space-y-2">
                                <p>In the event that two (or more) teams have an equal number of points, the following rules break the tie:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-2">
                                    <li>Head-to-head if all tied teams have paired matches</li>
                                    <li>Goal difference</li>
                                    <li>Goals scored</li>
                                </ol>
                            </div>
                            <div className="px-5 py-4 border-t border-white/10">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                    {[
                                        ["P", "Matches played"],
                                        ["W", "Wins"],
                                        ["D", "Draws"],
                                        ["L", "Losses"],
                                        ["DIFF", "Difference"],
                                        ["GLS", "Goals"],
                                        ["PTS", "Points"],
                                    ].map(([abbr, full]) => (
                                        <div key={abbr} className="flex items-start gap-2">
                                            <span className="text-xs font-bold text-gray-400 w-8">{abbr}</span>
                                            <span className="text-xs text-gray-300">{full}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </main>
    );
}