import { getAllCompetitionsByCountry } from "@/app/lib/api/domesticCompetitions";
import TopLeaguesSidebar from "./TopLeaguesSidebar";

/**
 * Server component: fetches all competitions grouped by country from the
 * football-data.org API and passes the result to the client sidebar.
 */
export default async function TopLeaguesSidebarWrapper() {
  const { data: areas, isDemo } = await getAllCompetitionsByCountry();
  return <TopLeaguesSidebar areas={areas} isDemo={isDemo} />;
}
