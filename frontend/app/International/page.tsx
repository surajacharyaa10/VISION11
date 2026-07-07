import InternationalSidebarWrapper from "@/app/International/components/InternationalSidebarWrapper";
import LeagueGrid from "@/app/TopLeagues/components/LeagueGrid";
import { getInternationalCompetitions } from "@/app/lib/api/internationalCompetitions";

export default async function InternationalPage() {
  const { flat: leagues, isDemo } = await getInternationalCompetitions();

  return (
    <div className="flex bg-zinc-50 min-h-screen -m-6 text-zinc-900">
      <InternationalSidebarWrapper />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
              International
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Browse FIFA, UEFA, CONMEBOL, AFC, CAF, CONCACAF and OFC competitions — World Cups, continental championships, club tournaments and more.
            </p>
          </div>

          <LeagueGrid leagues={leagues} isDemo={false} />
        </div>
      </main>
    </div>
  );
}
