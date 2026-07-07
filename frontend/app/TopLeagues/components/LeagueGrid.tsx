"use client";

import { useState } from "react";
import { 
  Search, 
  Trophy, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Compass, 
  AlertCircle, 
  Calendar,
  Globe,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface CoverageItem {
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  predictions: boolean;
  odds: boolean;
}

interface Season {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: {
    standings: boolean;
    players: boolean;
    top_scorers: boolean;
    top_assists: boolean;
    predictions: boolean;
    odds: boolean;
  };
}

interface LeagueData {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: Season[];
}

interface LeagueGridProps {
  leagues: LeagueData[];
  isDemo: boolean;
}

export default function LeagueGrid({ leagues, isDemo }: LeagueGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");

  // Get current season helper
  const getCurrentSeason = (seasons: Season[]) => {
    return seasons.find(s => s.current) || seasons[0];
  };

  // Calculate season progress percentage
  const calculateProgress = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      const today = new Date();
      
      if (today < start) return 0;
      if (today > end) return 100;
      
      const total = end.getTime() - start.getTime();
      const current = today.getTime() - start.getTime();
      return Math.round((current / total) * 100);
    } catch {
      return 50;
    }
  };

  // Extract list of unique countries for filter tabs
  const countries = ["All", ...Array.from(new Set(leagues.map(item => item.country.name)))];

  // Filter leagues based on search term and country tab selection
  const filteredLeagues = leagues.filter(item => {
    const matchesSearch = item.league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === "All" || item.country.name === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-8">
      {/* Demo Banner */}
      {isDemo && (
        <div className="relative overflow-hidden rounded-2xl bg-amber-50 border border-amber-200 p-5 shadow-sm animate-fade-in text-amber-900">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-24 h-24 text-amber-600" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="p-3 bg-amber-100 rounded-xl border border-amber-200 text-amber-600 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2">
                Running in Demo & Fallback Mode
              </h3>
              <p className="text-sm text-amber-750 mt-1 max-w-2xl leading-relaxed">
                Could not connect to API (missing/invalid API key). Currently showing cached, realistic mockup data representing the top 5 European leagues.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header controls (Search & Filter tabs) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search leagues or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 placeholder-zinc-400 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition focus:border-emerald-500/50 focus:bg-white focus:ring-1 focus:ring-emerald-500/10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition duration-200 ${
                selectedCountry === country
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm"
                  : "bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-650 hover:text-zinc-900"
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {/* Leagues Grid */}
      {filteredLeagues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeagues.map((item) => {
            const currentSeason = getCurrentSeason(item.seasons);
            const progress = calculateProgress(currentSeason.start, currentSeason.end);
            const coverage = currentSeason.coverage;

            // Formatted dates
            const startDate = new Date(currentSeason.start).toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
            const endDate = new Date(currentSeason.end).toLocaleDateString("en-US", { month: 'short', year: 'numeric' });

            return (
              <div 
                key={item.league.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5"
              >
                {/* Visual glow element */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 p-1.5 bg-zinc-50 rounded-xl border border-zinc-150 flex items-center justify-center shadow-inner group-hover:border-emerald-500/20 transition-colors duration-300">
                        {item.league.logo ? (
                          <img 
                            src={item.league.logo} 
                            alt={item.league.name}
                            className="object-contain max-w-full max-h-full"
                          />
                        ) : (
                          <Trophy className="w-8 h-8 text-zinc-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 text-base group-hover:text-emerald-600 transition-colors duration-300 line-clamp-1">
                          {item.league.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                            {item.country.flag ? (
                              <img 
                                src={item.country.flag} 
                                alt={item.country.name || ""} 
                                className="w-4 h-3 rounded-sm object-cover shadow-sm"
                              />
                            ) : (
                              <Globe className="w-3.5 h-3.5 text-zinc-400" />
                            )}
                            {item.country.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-zinc-100 border border-zinc-200 text-zinc-650 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.league.type}
                    </span>
                  </div>

                  {/* Season Information & Progress */}
                  <div className="bg-zinc-50/50 border border-zinc-150/60 rounded-xl p-4 mb-5">
                    <div className="flex justify-between items-center text-xs text-zinc-600 mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        Season {currentSeason.year}
                      </span>
                      <span className="font-mono text-emerald-600 font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-200/80 h-1.5 rounded-full overflow-hidden mb-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>{startDate}</span>
                      <span>{endDate}</span>
                    </div>
                  </div>

                  {/* Coverage Features Checklist */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                      Available Features
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <CoverageChip label="Standings" active={coverage.standings} icon={<Trophy className="w-3 h-3" />} />
                      <CoverageChip label="Players" active={coverage.players} icon={<Users className="w-3 h-3" />} />
                      <CoverageChip label="Top Scorers" active={coverage.top_scorers} icon={<TrendingUp className="w-3 h-3" />} />
                      <CoverageChip label="Top Assists" active={coverage.top_assists} icon={<TrendingUp className="w-3 h-3" />} />
                      <CoverageChip label="Predictions" active={coverage.predictions} icon={<Compass className="w-3 h-3" />} />
                      <CoverageChip label="Odds" active={coverage.odds} icon={<ShieldCheck className="w-3 h-3" />} />
                    </div>
                  </div>
                </div>

                {/* Explore button */}
                <button className="w-full py-2.5 px-4 bg-zinc-50 hover:bg-emerald-600 text-zinc-650 hover:text-white border border-zinc-200 hover:border-emerald-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm active:scale-98">
                  Explore League
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50/50 border border-dashed border-zinc-200 rounded-2xl">
          <Trophy className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="font-semibold text-zinc-800 text-lg">No leagues matched your criteria</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different country tab.
          </p>
        </div>
      )}
    </div>
  );
}

interface CoverageChipProps {
  label: string;
  active: boolean;
  icon: React.ReactNode;
}

function CoverageChip({ label, active, icon }: CoverageChipProps) {
  return (
    <div 
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition duration-200 select-none ${
        active 
          ? "bg-emerald-50/50 border-emerald-200/40 text-emerald-700" 
          : "bg-zinc-50/30 border-zinc-150 text-zinc-400"
      }`}
    >
      <div className={active ? "text-emerald-500" : "text-zinc-400"}>
        {icon}
      </div>
      <span className="font-semibold">{label}</span>
    </div>
  );
}
