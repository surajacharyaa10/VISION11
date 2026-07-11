import { getTeam } from "@/thesportsdb/teams";
import { getEventsLast, getEventsNext } from "@/thesportsdb/events";
import { getHeadToHead } from "@/thesportsdb/fixtures";
import TeamTab from "./TeamTab";

interface PageProps {
    params: { team_id: string };
    searchParams?: { tab?: string; opponent?: string };
}

export default async function TeamDetailPage({ params, searchParams }: PageProps) {
    const teamId = params.team_id;
    const initialTab = searchParams?.tab || "overview";

    let team: any = null;
    let error: string | null = null;
    let previousEvents: any[] = [];
    let nextEvents: any[] = [];
    let h2hMatches: any[] = [];

    try {
        const teamRes = await getTeam({ id: teamId });
        const teamData = Array.isArray(teamRes?.response)
            ? teamRes.response[0]
            : teamRes?.response;
        if (!teamData || (Array.isArray(teamRes?.response) && teamRes.response.length === 0)) {
            throw new Error("Team not found");
        }
        team = teamData;
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load team details";
    }

    if (team) {
        try {
            const [lastRes, nextRes] = await Promise.all([
                getEventsLast({ id: teamId }),
                getEventsNext({ id: teamId }),
            ]);
            previousEvents = Array.isArray(lastRes?.response) ? lastRes.response : [];
            nextEvents = Array.isArray(nextRes?.response) ? nextRes.response : [];
        } catch {
            // ignore match fetch errors
        }

        if (searchParams?.opponent) {
            try {
                const h2hRes = await getHeadToHead({ h2h: `${teamId}-${searchParams.opponent}` });
                h2hMatches = Array.isArray(h2hRes?.response) ? h2hRes.response : [];
            } catch {
                // ignore h2h error
            }
        }
    }

    return (
        <main className="min-h-screen bg-[#070b14] text-white py-10">
            <div className="mx-auto max-w-6xl px-4">
                {error ? (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-6 text-red-300">
                        {error}
                    </div>
                ) : team ? (
                    <TeamTab
                        team={team}
                        initialTab={initialTab}
                        previousEvents={previousEvents}
                        nextEvents={nextEvents}
                        h2hMatches={h2hMatches}
                        fdMatches={[]}
                        opponent={searchParams?.opponent || ""}
                    />
                ) : null}
            </div>
        </main>
    );
}
