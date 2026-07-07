"use client";

import { ChevronDown, Globe, AlertCircle, Trophy } from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Competition = {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string | null;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
};

type Group = {
  groupName: string;
  competitions: Competition[];
};

type Props = {
  groups: Group[];
  isDemo?: boolean;
};

// Confederation badge colours
const GROUP_COLOURS: Record<string, string> = {
  "FIFA":           "bg-sky-100 text-sky-700 border-sky-200",
  "UEFA Club":      "bg-violet-100 text-violet-700 border-violet-200",
  "UEFA National":  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "CONMEBOL":       "bg-yellow-100 text-yellow-700 border-yellow-200",
  "CONCACAF":       "bg-orange-100 text-orange-700 border-orange-200",
  "AFC":            "bg-emerald-100 text-emerald-700 border-emerald-200",
  "CAF":            "bg-red-100 text-red-700 border-red-200",
  "OFC":            "bg-teal-100 text-teal-700 border-teal-200",
  "Friendly":       "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export default function InternationalSidebar({ groups, isDemo }: Props) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");

  // Flatten all comps for "Featured" pinned section (non-friendly)
  const featured = groups
    .filter((g) => g.groupName !== "Friendly")
    .flatMap((g) =>
      g.competitions.filter((c) =>
        [2, 3, 1, 4, 9, 7, 12, 848].includes(c.league.id)
      )
    )
    .slice(0, 8);

  // Filter groups and their competitions
  const filteredGroups = groups
    .map((g) => ({
      ...g,
      competitions: g.competitions.filter(
        (c) =>
          c.league.name.toLowerCase().includes(filterText.toLowerCase()) ||
          g.groupName.toLowerCase().includes(filterText.toLowerCase())
      ),
    }))
    .filter((g) => g.competitions.length > 0);

  return (
    <aside className="w-72 bg-white text-zinc-900 h-screen overflow-y-auto border-r border-zinc-200 flex flex-col shrink-0">
      {/* Featured competitions */}
      <div className="p-5 border-b border-zinc-100">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
          Featured
        </h2>
        <div className="space-y-1">
          {featured.length > 0 ? (
            featured.map((item) => (
              <button
                key={item.league.id}
                className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-lg text-sm text-zinc-700 hover:bg-sky-50 hover:text-sky-700 font-medium transition-all"
              >
                {item.league.logo ? (
                  <img
                    src={item.league.logo}
                    alt={item.league.name}
                    className="w-5 h-5 object-contain shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Trophy size={14} className="text-zinc-400 shrink-0" />
                )}
                <span className="truncate">{item.league.name}</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-zinc-400">Loading…</p>
          )}
        </div>
      </div>

      {/* All international competitions */}
      <div className="flex-1 flex flex-col p-5 min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            All Competitions
          </h2>
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
            {groups.reduce((n, g) => n + g.competitions.length, 0)}
          </span>
        </div>

        {isDemo && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 text-xs">
            <AlertCircle size={12} className="shrink-0" />
            <span>Showing demo data. Check your API key.</span>
          </div>
        )}

        <input
          placeholder="Filter competitions…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none placeholder-zinc-400 mb-3 focus:bg-white focus:border-sky-300 focus:ring-2 focus:ring-sky-50 transition"
        />

        <div className="flex-1 overflow-y-auto space-y-0.5 -mx-2 px-2">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => {
              const isOpen = openGroup === group.groupName;
              const badgeCls =
                GROUP_COLOURS[group.groupName] ??
                "bg-zinc-100 text-zinc-600 border-zinc-200";

              return (
                <div key={group.groupName}>
                  <button
                    onClick={() =>
                      setOpenGroup(isOpen ? null : group.groupName)
                    }
                    className="w-full flex justify-between items-center px-2 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-all"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${badgeCls}`}
                      >
                        {group.groupName}
                      </span>
                      <span className="text-xs text-zinc-300 shrink-0">
                        ({group.competitions.length})
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
                    <div className="ml-4 mb-1 space-y-0.5 border-l-2 border-zinc-100 pl-3">
                      {group.competitions.map((item) => (
                        <button
                          key={item.league.id}
                          className="flex items-center gap-2 w-full text-left py-1.5 text-xs text-zinc-500 hover:text-sky-600 transition-colors rounded"
                        >
                          {item.league.logo ? (
                            <img
                              src={item.league.logo}
                              alt={item.league.name}
                              className="w-4 h-4 object-contain shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                item.league.type === "Cup"
                                  ? "bg-amber-400"
                                  : "bg-sky-400"
                              }`}
                            />
                          )}
                          <span className="truncate">{item.league.name}</span>
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
