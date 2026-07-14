"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Flame, Trophy, Globe, Zap, ChevronLeft, ChevronRight } from "lucide-react";

interface TopMatch {
  id: string;
  competition: string;
  competitionBadge: string;
  home: { name: string; logo: string; shortName: string };
  away: { name: string; logo: string; shortName: string };
  date: string;
  rating: number; // 1-5 flames
  gradient: string;
  accent: string;
  fixtureHref?: string;
  icon: "trophy" | "globe" | "zap" | "flame";
}

const TOP_MATCHES: TopMatch[] = [
  {
    id: "1",
    competition: "UEFA Champions League",
    competitionBadge: "UCL",
    home: {
      name: "Real Madrid",
      shortName: "RMA",
      logo: "https://media.api-sports.io/football/teams/541.png",
    },
    away: {
      name: "Manchester City",
      shortName: "MCI",
      logo: "https://media.api-sports.io/football/teams/50.png",
    },
    date: "Sep 17 · 21:00",
    rating: 5,
    gradient: "from-indigo-950 via-[#0f0f1a] to-blue-950",
    accent: "#6366f1",
    fixtureHref: "/fixtures",
    icon: "trophy",
  },
  {
    id: "2",
    competition: "La Liga — El Clásico",
    competitionBadge: "ESP",
    home: {
      name: "Barcelona",
      shortName: "BAR",
      logo: "https://media.api-sports.io/football/teams/529.png",
    },
    away: {
      name: "Real Madrid",
      shortName: "RMA",
      logo: "https://media.api-sports.io/football/teams/541.png",
    },
    date: "Oct 26 · 20:00",
    rating: 5,
    gradient: "from-blue-950 via-[#0f0f1a] to-red-950",
    accent: "#ef4444",
    fixtureHref: "/fixtures",
    icon: "flame",
  },
  {
    id: "3",
    competition: "FIFA World Cup",
    competitionBadge: "WC",
    home: {
      name: "Brazil",
      shortName: "BRA",
      logo: "https://media.api-sports.io/football/teams/6.png",
    },
    away: {
      name: "Argentina",
      shortName: "ARG",
      logo: "https://media.api-sports.io/football/teams/26.png",
    },
    date: "Nov 2026",
    rating: 5,
    gradient: "from-yellow-950 via-[#0f0f1a] to-sky-950",
    accent: "#eab308",
    fixtureHref: "/fixtures",
    icon: "globe",
  },
  {
    id: "4",
    competition: "Premier League Derby",
    competitionBadge: "EPL",
    home: {
      name: "Manchester Utd",
      shortName: "MUN",
      logo: "https://media.api-sports.io/football/teams/33.png",
    },
    away: {
      name: "Manchester City",
      shortName: "MCI",
      logo: "https://media.api-sports.io/football/teams/50.png",
    },
    date: "Nov 2 · 17:30",
    rating: 4,
    gradient: "from-red-950 via-[#0f0f1a] to-sky-950",
    accent: "#f97316",
    fixtureHref: "/fixtures",
    icon: "flame",
  },
  {
    id: "5",
    competition: "Serie A — Derby della Madonnina",
    competitionBadge: "ITA",
    home: {
      name: "AC Milan",
      shortName: "MIL",
      logo: "https://media.api-sports.io/football/teams/489.png",
    },
    away: {
      name: "Inter Milan",
      shortName: "INT",
      logo: "https://media.api-sports.io/football/teams/505.png",
    },
    date: "Sep 22 · 20:45",
    rating: 4,
    gradient: "from-red-950 via-[#0f0f1a] to-blue-950",
    accent: "#ef4444",
    fixtureHref: "/fixtures",
    icon: "zap",
  },
  {
    id: "6",
    competition: "Bundesliga — Der Klassiker",
    competitionBadge: "BUN",
    home: {
      name: "Bayern Munich",
      shortName: "BAY",
      logo: "https://media.api-sports.io/football/teams/157.png",
    },
    away: {
      name: "Borussia Dortmund",
      shortName: "BVB",
      logo: "https://media.api-sports.io/football/teams/165.png",
    },
    date: "Oct 5 · 18:30",
    rating: 4,
    gradient: "from-red-950 via-[#0f0f1a] to-yellow-950",
    accent: "#f59e0b",
    fixtureHref: "/fixtures",
    icon: "trophy",
  },
  {
    id: "7",
    competition: "UEFA Europa League",
    competitionBadge: "UEL",
    home: {
      name: "Liverpool",
      shortName: "LIV",
      logo: "https://media.api-sports.io/football/teams/40.png",
    },
    away: {
      name: "Atlético Madrid",
      shortName: "ATM",
      logo: "https://media.api-sports.io/football/teams/530.png",
    },
    date: "Oct 23 · 21:00",
    rating: 4,
    gradient: "from-red-950 via-[#0f0f1a] to-orange-950",
    accent: "#f97316",
    fixtureHref: "/fixtures",
    icon: "zap",
  },
  {
    id: "8",
    competition: "Ligue 1 — Le Classique",
    competitionBadge: "L1",
    home: {
      name: "PSG",
      shortName: "PSG",
      logo: "https://media.api-sports.io/football/teams/85.png",
    },
    away: {
      name: "Marseille",
      shortName: "OM",
      logo: "https://media.api-sports.io/football/teams/81.png",
    },
    date: "Sep 27 · 21:00",
    rating: 4,
    gradient: "from-blue-950 via-[#0f0f1a] to-sky-950",
    accent: "#0ea5e9",
    fixtureHref: "/fixtures",
    icon: "globe",
  },
];

function CompIcon({ type }: { type: TopMatch["icon"] }) {
  const cls = "w-3.5 h-3.5";
  if (type === "trophy") return <Trophy className={cls} />;
  if (type === "globe") return <Globe className={cls} />;
  if (type === "zap") return <Zap className={cls} />;
  return <Flame className={cls} />;
}

function FlameRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Flame
          key={i}
          className={`w-3 h-3 transition-colors ${i < count ? "text-orange-400" : "text-white/10"}`}
        />
      ))}
    </div>
  );
}

export default function TopMatchesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <section className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">Top Matches</h2>
          <span className="text-[10px] font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md">
            Must Watch
          </span>
        </div>
        {/* Scroll arrows — hidden on mobile (swipe instead) */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TOP_MATCHES.map((match) => (
          <Link
            key={match.id}
            href={match.fixtureHref ?? "/fixtures"}
            className={`
              flex-none w-[220px] sm:w-[240px] snap-start
              relative overflow-hidden rounded-2xl
              border border-white/8
              bg-gradient-to-br ${match.gradient}
              p-4 group
              hover:border-white/20 hover:scale-[1.02]
              transition-all duration-300
            `}
            style={{ boxShadow: `0 0 24px ${match.accent}18` }}
          >
            {/* Glow orb */}
            <div
              className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-30"
              style={{ background: match.accent }}
            />

            {/* Competition header */}
            <div className="flex items-center gap-1.5 mb-3 relative">
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{
                  background: `${match.accent}25`,
                  color: match.accent,
                  border: `1px solid ${match.accent}40`,
                }}
              >
                <CompIcon type={match.icon} />
                {match.competitionBadge}
              </span>
              <span className="text-[10px] text-neutral-400 truncate">{match.competition}</span>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between gap-2 relative">
              {/* Home */}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-11 h-11 rounded-xl bg-black/30 backdrop-blur-sm p-1.5 flex items-center justify-center border border-white/10">
                  <img
                    src={match.home.logo}
                    alt={match.home.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-white/90 text-center leading-tight max-w-[60px] truncate">
                  {match.home.shortName}
                </span>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center gap-0.5 shrink-0">
                <span className="text-base font-black text-white/30">VS</span>
                <span className="text-[9px] text-neutral-500 font-medium">{match.date}</span>
              </div>

              {/* Away */}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-11 h-11 rounded-xl bg-black/30 backdrop-blur-sm p-1.5 flex items-center justify-center border border-white/10">
                  <img
                    src={match.away.logo}
                    alt={match.away.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-white/90 text-center leading-tight max-w-[60px] truncate">
                  {match.away.shortName}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/8 relative">
              <FlameRating count={match.rating} />
              <span className="text-[9px] text-neutral-500 font-medium uppercase tracking-wide">Marquee</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
