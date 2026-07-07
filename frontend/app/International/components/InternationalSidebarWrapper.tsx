import { getInternationalCompetitions } from "@/app/lib/api/internationalCompetitions";
import InternationalSidebar from "./InternationalSidebar";

/**
 * Server component: fetches all international competitions grouped by
 * confederation and passes them to the client sidebar.
 */
export default async function InternationalSidebarWrapper() {
  const { groups, isDemo } = await getInternationalCompetitions();
  return <InternationalSidebar groups={groups} isDemo={isDemo} />;
}
