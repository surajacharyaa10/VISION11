import {
  User,
  Trophy,
  Calendar,
  Globe,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Star,
  Activity,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const { id } = await params;
  
  // import the api at the top if needed, but it's probably better to just import it here or at the top of file
  const { getAllPlayerData } = await import("@/app/lib/api/playerdata");

  // Fetch all player data from the new lib
  const playerData: any = await getAllPlayerData(id);

  if (!playerData || !playerData.detail || !playerData.detail.player) {
    notFound();
  }

  const personData = playerData.detail.player;
  const careerData = playerData.statisticsSeasons;

  // Process career totals from SofaScore
  let matches = 0,
    goals = 0,
    assists = 0;
  
  if (careerData && Array.isArray(careerData.uniqueTournamentSeasons)) {
    for (const season of careerData.uniqueTournamentSeasons) {
        if (season.statistics) {
            matches += season.statistics.appearances || 0;
            goals += season.statistics.goals || 0;
            assists += season.statistics.assists || 0;
        }
    }
  }

  const dob = personData.dateOfBirthTimestamp
    ? new Date(personData.dateOfBirthTimestamp * 1000)
    : null;
  const age = dob ? new Date().getFullYear() - dob.getFullYear() : "N/A";

  let role = "Player";
  if (personData.position === "F") role = "Attacker";
  else if (personData.position === "M") role = "Midfielder";
  else if (personData.position === "D") role = "Defender";
  else if (personData.position === "G") role = "Goalkeeper";

  const estValueNum = personData.proposedMarketValue || 0;
  let estValueStr =
    estValueNum > 0 ? `€${(estValueNum / 1000000).toFixed(1)}m` : "N/A";

  let transferScore = 85;
  if (estValueNum > 100_000_000) transferScore = 98;
  else if (estValueNum > 50_000_000) transferScore = 92;
  else if (estValueNum > 10_000_000) transferScore = 88;
  else if (estValueNum > 0) transferScore = 75;

  const fbrefData: any = null; // No fbref data anymore

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(personData.name)}&background=e0f2fe&color=0369a1&size=200`;

  return (
    <div className="flex bg-zinc-50 min-h-screen text-zinc-900">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link
            href="/Players"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Players
          </Link>

          {/* Alert if fbref scraper had to use fallback data */}
          {fbrefData?.isMock && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-start gap-3 shadow-sm">
              <AlertCircle
                size={20}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <div className="text-sm">
                <strong>FBRef Data Unavailable.</strong> We could not parse the
                live FBRef page for this player (likely due to rate limits or
                unsearchable name). Trophy cabinet and percentile stats below
                use cached fallback metrics.
              </div>
            </div>
          )}

          {/* Hero Section */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

            <div className="w-32 h-32 md:w-48 md:h-48 bg-zinc-100 rounded-full border-4 border-white shadow-lg shrink-0 overflow-hidden z-10">
              <img
                src={avatarUrl}
                alt={personData.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {role}
                </span>
                {personData.jersey_number && (
                  <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    No. {personData.jersey_number}
                  </span>
                )}
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {personData.availability || "Available"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
                {personData.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Globe size={16} className="text-zinc-400" />
                  {personData.nationality || "Unknown"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-zinc-400" />
                  {dob ? dob.toLocaleDateString() : "Unknown"}{" "}
                  {age !== "N/A" ? `(${age} yrs)` : ""}
                </div>
                {personData.height_cm && (
                  <div className="flex items-center gap-1.5">
                    <User size={16} className="text-zinc-400" />
                    {personData.height_cm} cm
                  </div>
                )}
                {personData.preferred_foot && (
                  <div className="flex items-center gap-1.5 font-medium">
                    ⚽{" "}
                    {personData.preferred_foot === "R"
                      ? "Right"
                      : personData.preferred_foot === "L"
                        ? "Left"
                        : "Both"}{" "}
                    foot
                  </div>
                )}
                {personData.contract_until && (
                  <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                    📋 Contract until {personData.contract_until}
                  </div>
                )}
              </div>

              {/* Top Level Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                  <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    Career Matches
                  </div>
                  <div className="text-2xl font-black text-zinc-800">
                    {matches || "—"}
                  </div>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                  <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    Total Goals
                  </div>
                  <div className="text-2xl font-black text-emerald-600">
                    {goals}
                  </div>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                  <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    Total Assists
                  </div>
                  <div className="text-2xl font-black text-sky-600">
                    {assists}
                  </div>
                </div>
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                  <div className="text-sky-700 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <DollarSign size={14} /> Market Value
                  </div>
                  <div className="text-2xl font-black text-sky-900">
                    {estValueStr}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Trophy Cabinet (from FBRef) */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
                  <Trophy className="text-amber-500" size={20} />
                  Trophy Cabinet
                </h2>
                <div className="space-y-3">
                  {fbrefData?.trophies && fbrefData.trophies.length > 0 ? (
                    fbrefData.trophies.map((trophy: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-white border border-amber-100/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <Trophy size={16} className="text-amber-600" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-800">
                          {trophy}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-zinc-500 p-4 bg-zinc-50 rounded-xl border border-dashed border-zinc-200 text-center">
                      No trophies recorded on FBRef yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Transfer Rating */}
              <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Star size={100} />
                </div>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-2 relative z-10">
                  <TrendingUp className="text-sky-400" size={20} />
                  Transfer Rating
                </h2>
                <p className="text-zinc-400 text-xs mb-6 relative z-10">
                  Based on market value analysis.
                </p>
                <div className="flex items-end gap-3 relative z-10">
                  <span className="text-5xl font-black tracking-tighter text-sky-400">
                    {transferScore}
                  </span>
                  <span className="text-zinc-500 font-bold mb-1">/100</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden relative z-10">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full"
                    style={{ width: `${transferScore}%` }}
                  />
                </div>
              </div>

              {/* Player Attributes */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <Trophy className="text-amber-500" size={20} />
                  Player Info
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Specific Position</span>
                    <span className="font-semibold text-zinc-800">
                      {personData.specific_position || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Height</span>
                    <span className="font-semibold text-zinc-800">
                      {personData.height_cm
                        ? `${personData.height_cm} cm`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Weight</span>
                    <span className="font-semibold text-zinc-800">
                      {personData.weight_kg
                        ? `${personData.weight_kg} kg`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Preferred Foot</span>
                    <span className="font-semibold text-zinc-800">
                      {personData.preferred_foot === "R"
                        ? "Right"
                        : personData.preferred_foot === "L"
                          ? "Left"
                          : personData.preferred_foot || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Contract Until</span>
                    <span className="font-semibold text-zinc-800">
                      {personData.contract_until || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Injury Risk</span>
                    <span className="font-semibold text-zinc-800">
                      {personData.injury_risk || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Status</span>
                    <span
                      className={`font-semibold capitalize ${personData.availability === "available" ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {personData.availability || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Career Seasons + Detailed FBRef Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Career Seasons (from bzzoiro) */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-6">
                  <Activity className="text-emerald-500" size={20} />
                  Career Seasons
                </h2>

                {careerData && Array.isArray(careerData.uniqueTournamentSeasons) && careerData.uniqueTournamentSeasons.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100">
                          <th className="text-left text-zinc-500 text-xs font-semibold uppercase tracking-wider pb-3">
                            Tournament
                          </th>
                          <th className="text-center text-zinc-500 text-xs font-semibold uppercase tracking-wider pb-3">
                            MP
                          </th>
                          <th className="text-center text-zinc-500 text-xs font-semibold uppercase tracking-wider pb-3">
                            Min
                          </th>
                          <th className="text-center text-zinc-500 text-xs font-semibold uppercase tracking-wider pb-3">
                            Goals
                          </th>
                          <th className="text-center text-zinc-500 text-xs font-semibold uppercase tracking-wider pb-3">
                            Assists
                          </th>
                          <th className="text-center text-zinc-500 text-xs font-semibold uppercase tracking-wider pb-3">
                            Rating
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {careerData.uniqueTournamentSeasons.map((tournament: any, i: number) => (
                          <tr
                            key={i}
                            className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                          >
                            <td className="py-3 font-medium text-zinc-800">
                              {tournament.uniqueTournament?.name || "Unknown Tournament"}
                            </td>
                            <td className="py-3 text-center text-zinc-600">
                              {tournament.statistics?.appearances || "—"}
                            </td>
                            <td className="py-3 text-center text-zinc-600">
                              {tournament.statistics?.minutesPlayed || "—"}
                            </td>
                            <td className="py-3 text-center font-bold text-emerald-600">
                              {tournament.statistics?.goals || "—"}
                            </td>
                            <td className="py-3 text-center font-bold text-sky-600">
                              {tournament.statistics?.assists || "—"}
                            </td>
                            <td className="py-3 text-center">
                              {tournament.statistics?.rating ? (
                                <span
                                  className={`font-bold ${parseFloat(tournament.statistics.rating) >= 7 ? "text-emerald-600" : parseFloat(tournament.statistics.rating) >= 6 ? "text-amber-500" : "text-red-500"}`}
                                >
                                  {tournament.statistics.rating}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                    <Activity
                      size={32}
                      className="text-zinc-300 mx-auto mb-3"
                    />
                    <h3 className="text-zinc-700 font-semibold">
                      No career data available
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1">
                      No season records found for this player.
                    </p>
                  </div>
                )}
              </div>

              {/* Detailed FBRef Percentile Stats */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                    <Activity className="text-emerald-500" size={20} />
                    Detailed Performance Stats
                  </h2>
                  {fbrefData?.sourceUrl && (
                    <a
                      href={fbrefData.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      View on FBRef <ArrowRight size={12} />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {fbrefData?.detailedStats &&
                  Object.keys(fbrefData.detailedStats).length > 0 ? (
                    Object.entries(fbrefData.detailedStats).map(
                      ([stat, percentile]) => {
                        const val = parseInt(percentile as string, 10);
                        const isHigh = val >= 75;
                        const isMid = val >= 40 && val < 75;
                        const color = isHigh
                          ? "bg-emerald-500"
                          : isMid
                            ? "bg-amber-400"
                            : "bg-red-400";

                        return (
                          <div key={stat}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-zinc-600 font-medium">
                                {stat}
                              </span>
                              <span className="font-bold text-zinc-900">
                                {String(percentile)}%
                              </span>
                            </div>
                            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={`${color} h-full rounded-full`}
                                style={{ width: `${val}%` }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )
                  ) : (
                    <div className="col-span-2 text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                      <Activity
                        size={32}
                        className="text-zinc-300 mx-auto mb-3"
                      />
                      <h3 className="text-zinc-700 font-semibold">
                        Detailed stats unavailable
                      </h3>
                      <p className="text-zinc-500 text-sm mt-1">
                        We could not pull the scouting report percentiles for
                        this player.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
