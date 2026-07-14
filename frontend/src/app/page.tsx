import { getMatchesFootballFinished, getMatchesFootball } from "@/api";
import Status from "./components/Status";
import TopMatchesCarousel from "./components/TopMatchesCarousel";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  UploadCloud,
  ChevronRight,
  Activity,
  Tv2,
  CalendarDays,
  Users2,
  Shield,
  Globe,
} from "lucide-react";

export default async function Home() {
  const getData = await getMatchesFootball();
  const getDataFinished = await getMatchesFootballFinished();
  const matchesData = getData?.matches?.slice(0, 5) ?? [];
  const matchesDataFinished = getDataFinished?.matches?.slice(0, 5) ?? [];

  const nd = new Date();
  const dateConvert = nd.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const liveCount =
    matchesData?.filter(
      (m: any) =>
        m?.status === "IN_PLAY" ||
        m?.status === "PAUSED" ||
        m?.status === "LIVE"
    )?.length ?? 0;

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 md:px-0 pb-32 space-y-6">

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-800/60 bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-neutral-950 px-6 py-7 shadow-2xl backdrop-blur-md">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-blue-500/10 blur-[80px]" />

        <div className="relative space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                  {dateConvert}
                </span>
                {liveCount > 0 && (
                  <span className="flex items-center gap-1.5 rounded-md bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-400 animate-pulse">
                    <Activity className="h-3 w-3" />
                    {liveCount} In-Play
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                Today's Matches
              </h1>
              <p className="text-xs text-neutral-400 font-medium">
                Real-time tracking, AI analytics & historical squad databases.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-emerald-500/80 shadow-inner backdrop-blur">
              <TrendingUp className="h-7 w-7" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP MATCHES CAROUSEL ── */}
      <TopMatchesCarousel />

      {/* Feature Grid Hub */}
      <section className="grid grid-cols-2 gap-3">
        {/* Teams */}
        <Link
          href="/teams"
          className="group relative flex flex-col justify-between p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-emerald-500/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <Shield className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="mt-5">
            <h3 className="text-sm font-bold text-neutral-200 group-hover:text-white flex items-center gap-1">
              Teams
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">Search and explore football teams, badges, and details.</p>
          </div>
        </Link>

        {/* Watch Live */}
        <Link
          href="/Livestreamplayer"
          className="group relative flex flex-col justify-between p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-red-500/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10">
              <Tv2 className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-red-400 transition-colors" />
          </div>
          <div className="mt-5">
            <h3 className="text-sm font-bold text-neutral-200 group-hover:text-white">Match Stream</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">Watch live events, multi-cam feeds, and match logs.</p>
          </div>
        </Link>

        {/* Fixtures */}
        <Link
          href="/fixtures"
          className="group relative flex flex-col justify-between p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-blue-500/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/10">
              <CalendarDays className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="mt-5">
            <h3 className="text-sm font-bold text-neutral-200 group-hover:text-white">Match Center</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">Fixtures, historical logs, and group breakdowns.</p>
          </div>
        </Link>

        {/* Players */}
        <Link
          href="/players"
          className="group relative flex flex-col justify-between p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
              <Users2 className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="mt-5">
            <h3 className="text-sm font-bold text-neutral-200 group-hover:text-white">Player Database</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">Scouting metrics, fitness records, and index evaluations.</p>
          </div>
        </Link>
      </section>

      {/* AI Analysis CTA */}
      <Link
        href="/AiAnalysis"
        className="group relative block overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/10 via-neutral-900/60 to-neutral-950 p-4 shadow-lg transition-all duration-300 hover:border-emerald-500/40 hover:shadow-emerald-500/5"
      >
        <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 shadow-inner transition-transform group-hover:scale-105">
              <UploadCloud className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white tracking-wide">Upload Match Footage</p>
                <span className="flex items-center gap-0.5 rounded bg-emerald-500/20 px-1 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  <Sparkles className="h-2.5 w-2.5" /> Smart AI
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-400 leading-relaxed">
                Tactical blueprints, player metrics, heatmaps & highlights.
              </p>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors group-hover:bg-emerald-500 group-hover:text-neutral-950">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      {/* Match Status */}
      <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-3 md:p-4 shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">Today's Results</h2>
        </div>
        <Status
          matchesList={matchesData}
          matchesListFinished={matchesDataFinished}
        />
      </div>

      {/* View More */}
      <div className="text-center">
        <Link
          href="/fixtures"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          View All Fixtures
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}