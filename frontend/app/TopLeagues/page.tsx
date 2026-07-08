import TopLeaguesSidebarWrapper from "@/app/TopLeagues/components/TopLeaguesSidebarWrapper";
import LeagueGrid from "@/app/TopLeagues/components/LeagueGrid";
import { getDomesticCompetitions } from "@/app/lib/api/domesticCompetitions";

export default async function TopLeagues() {
  const { data: leagues, isDemo } = await getDomesticCompetitions();

  return (
    <div className="flex bg-zinc-50 min-h-screen text-zinc-900">
      <TopLeaguesSidebarWrapper />


      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
              Top Leagues
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Browse profiles, schedules, standings, and coverage for the world's most prestigious football competitions.
            </p>
          </div>

          <LeagueGrid leagues={leagues} isDemo={isDemo} />
        </div>
      </main>
    </div>
  );

}


