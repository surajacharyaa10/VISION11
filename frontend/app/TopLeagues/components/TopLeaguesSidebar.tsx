"use client";

import { ChevronDown, Globe, AlertCircle } from "lucide-react";
import { useState } from "react";

type Competition = {
  id: number | null;
  name: string;
  code?: string | null;
  type: string;
  emblem?: string | null;
  plan?: string | null;
  isBaseline?: boolean;
};

type Area = {
  areaName: string;
  areaCode: string | null;
  areaFlag: string | null;
  competitions: Competition[];
};

type Props = {
  areas: Area[];
  isDemo?: boolean;
};

const TOP_LEAGUE_IDS = [2021, 2014, 2019, 2002, 2015];

export default function TopLeaguesSidebar({ areas, isDemo }: Props) {
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");

  // Flatten to get top leagues from live data
  const topLeagues = areas
    .flatMap((a) => a.competitions)
    .filter((c) => c.id !== null && TOP_LEAGUE_IDS.includes(c.id));

  // Filter areas and their sub-competitions dynamically
  const filteredAreas = areas.filter((area) => {
    const matchesArea = area.areaName
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesComp = area.competitions.some((c) =>
      c.name.toLowerCase().includes(filterText.toLowerCase())
    );
    return matchesArea || matchesComp;
  });

  return (
    <aside className="w-72 bg-white text-zinc-900 h-screen overflow-y-auto border-r border-zinc-200 flex flex-col">
      {/* Top Leagues */}
      <div className="p-5 border-b border-zinc-100">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
          Top Leagues
        </h2>
        <div className="space-y-1">
          {topLeagues.length > 0 ? (
            topLeagues.map((league) => (
              <button
                key={league.id}
                className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-lg text-sm text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-all"
              >
                {league.emblem ? (
                  <img
                    src={league.emblem}
                    alt={league.name}
                    className="w-5 h-5 object-contain shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-zinc-100 shrink-0" />
                )}
                {league.name}
              </button>
            ))
          ) : (
            <p className="text-xs text-zinc-400">Loading...</p>
          )}
        </div>
      </div>

      {/* All Leagues */}
      <div className="flex-1 flex flex-col p-5 min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            All Leagues
          </h2>
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
            {areas.length} areas
          </span>
        </div>

        {isDemo && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 text-xs">
            <AlertCircle size={12} className="shrink-0" />
            <span>Showing demo data. Check your API key.</span>
          </div>
        )}

        <input
          placeholder="Filter countries or leagues..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none placeholder-zinc-400 mb-3 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 transition"
        />

        <div className="flex-1 overflow-y-auto space-y-0.5 -mx-2 px-2">
          {filteredAreas.length > 0 ? (
            filteredAreas.map((area) => {
              const isOpen = openArea === area.areaName;
              // When filtering, show only matching competitions inside
              const visibleComps =
                filterText.length > 0
                  ? area.competitions.filter((c) =>
                      c.name
                        .toLowerCase()
                        .includes(filterText.toLowerCase())
                    )
                  : area.competitions;

              return (
                <div key={area.areaName}>
                  <button
                    onClick={() =>
                      setOpenArea(isOpen ? null : area.areaName)
                    }
                    className="w-full flex justify-between items-center px-2 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-all"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {area.areaFlag ? (
                        <img
                          src={area.areaFlag}
                          alt={area.areaName}
                          className="w-5 h-3.5 object-cover rounded-sm shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <Globe size={16} className="text-zinc-300 shrink-0" />
                      )}
                      <span className="truncate">{area.areaName}</span>
                      <span className="text-xs text-zinc-300 shrink-0">
                        ({area.competitions.length})
                      </span>
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform shrink-0 text-zinc-400 ${
                        isOpen || filterText.length > 0 ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {(isOpen || filterText.length > 0) && (
                    <div className="ml-5 mb-1 space-y-0.5 border-l-2 border-zinc-100 pl-3">
                      {visibleComps.map((comp) => (
                        <button
                          key={comp.id ?? comp.name}
                          className="flex items-center gap-2 w-full text-left py-1.5 text-xs text-zinc-500 hover:text-emerald-600 transition-colors rounded"
                        >
                          {comp.emblem ? (
                            <img
                              src={comp.emblem}
                              alt={comp.name}
                              className="w-4 h-4 object-contain shrink-0"
                              onError={(e) => {
                                (
                                  e.target as HTMLImageElement
                                ).style.display = "none";
                              }}
                            />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                comp.type === "CUP" ||
                                comp.type === "SUPER_CUP"
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                              }`}
                            />
                          )}
                          <span className="truncate">{comp.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 flex flex-col items-center gap-2 text-zinc-400">
              <Globe className="w-8 h-8 text-zinc-200" />
              <span className="text-xs">No results found</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
