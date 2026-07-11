import { theSportsDBGetV1 } from "@/thesportsdb/client";
import type { TheSportsDBTeam } from "@/thesportsdb/types";

export const dynamic = "force-dynamic";

const THE_SPORTS_DB_KEY = process.env.NEXT_PUBLIC_THE_SPORTS_DB_API_KEY || "123";

async function getPopularTeams(): Promise<TheSportsDBTeam[]> {
    try {
        const res = await theSportsDBGetV1<any>("search_all_teams.php", {
            l: "English Premier League",
        });
        const data = res.response;
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch teams:", error);
        return [];
    }
}

async function searchTeams(query: string): Promise<TheSportsDBTeam[]> {
    if (!query.trim()) return [];
    try {
        const res = await theSportsDBGetV1<any>("searchteams.php", {
            t: query,
        });
        const data = res.response;
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to search teams:", error);
        return [];
    }
}

export default async function TeamsPage({
    searchParams,
}: {
    searchParams?: { q?: string };
}) {
    const query = searchParams?.q || "";
    let teams: TheSportsDBTeam[] = [];

    if (query) {
        teams = await searchTeams(query);
    } else {
        teams = await getPopularTeams();
    }

    return (
        <div className="min-h-screen bg-[#070b14] text-white">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="text-3xl font-bold mb-2">Teams</h1>
                <p className="text-gray-400 mb-6">
                    Search and explore football teams
                </p>

                <form className="mb-8" action="/teams" method="GET">
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Search teams..."
                        className="w-full rounded-xl border border-white/10 bg-[#151b2b] px-5 py-3 text-white outline-none focus:border-emerald-500"
                    />
                </form>

                {teams.length === 0 && (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-6 text-center text-gray-300">
                        {query ? "No teams found." : "Start by searching for a team."}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {teams.map((team) => (
                        <a
                            key={team.idTeam}
                            href={`https://www.thesportsdb.com/team/${team.idTeam}/${encodeURIComponent(team.strTeam)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="group rounded-xl border border-white/10 bg-[#151b2b] p-4 transition hover:border-emerald-500/40"
                        >
                            <div className="flex aspect-square items-center justify-center">
                                {team.strBadge ? (
                                    <img
                                        src={team.strBadge}
                                        alt={team.strTeam}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-gray-600">
                                        {team.strTeam.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <h3 className="mt-3 truncate text-center text-sm font-semibold text-white">
                                {team.strTeam}
                            </h3>
                            <p className="truncate text-center text-xs text-gray-400">
                                {team.strCountry}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
