"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, SlidersHorizontal, Loader2 } from "lucide-react";
import type { PlayerCard } from "./page";

const POSITIONS = [
  { label: "All", value: "" },
  { label: "Attackers", value: "F" },
  { label: "Midfielders", value: "M" },
  { label: "Defenders", value: "D" },
  { label: "Goalkeepers", value: "G" },
];

const PAGE_SIZE = 100;

function positionLabel(pos: string): string {
  if (pos === "F") return "Attacker";
  if (pos === "M") return "Midfielder";
  if (pos === "D") return "Defender";
  if (pos === "G") return "Goalkeeper";
  return "Player";
}

interface PlayersClientProps {
  initialPlayers: PlayerCard[];
  totalCount: number;
}

export default function PlayersClient({ initialPlayers, totalCount }: PlayersClientProps) {
  const [players, setPlayers] = useState<PlayerCard[]>(initialPlayers);
  const [offset, setOffset] = useState(initialPlayers.length);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(initialPlayers.length >= totalCount);
  const [currentTotal, setCurrentTotal] = useState(totalCount);

  const [query, setQuery] = useState("");
  const [posFilter, setPosFilter] = useState("");
  // How many of the filtered list to show at once (client-side display limit)
  const [displayLimit, setDisplayLimit] = useState(60);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Load next page from the API
  const loadMore = useCallback(async () => {
    if (loading || allLoaded) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/players?offset=${offset}&limit=${PAGE_SIZE}&search=${encodeURIComponent(query)}&position=${encodeURIComponent(posFilter)}`);
      if (res.ok) {
        const data = await res.json();
        const newPlayers: PlayerCard[] = data.players || [];
        if (newPlayers.length === 0) {
          setAllLoaded(true);
        } else {
          setPlayers((prev) => {
            // deduplicate
            const seen = new Set(prev.map((p) => p.id));
            const newOnes = newPlayers.filter((p) => !seen.has(p.id));
            return [...prev, ...newOnes];
          });
          setOffset((o) => o + newPlayers.length);
          if (players.length + newPlayers.length >= currentTotal) setAllLoaded(true);
        }
      } else {
        setAllLoaded(true);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [loading, allLoaded, offset, players.length, currentTotal, query, posFilter]);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/players?offset=0&limit=${PAGE_SIZE}&search=${encodeURIComponent(query)}&position=${encodeURIComponent(posFilter)}`);
        if (res.ok) {
          const data = await res.json();
          const newPlayers = data.players || [];
          setPlayers(newPlayers);
          setOffset(newPlayers.length);
          setCurrentTotal(data.totalCount || 0);
          setAllLoaded(newPlayers.length >= (data.totalCount || 0));
        }
      } catch (err) {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, posFilter]);

  const visible = players.slice(0, displayLimit);
  const hasMoreToDisplay = displayLimit < players.length;

  function handleQuery(v: string) { setQuery(v); setDisplayLimit(60); }
  function handlePos(v: string) { setPosFilter(v); setDisplayLimit(60); }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="player-search"
            type="text"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Search players or nationality…"
            className="w-full bg-white border border-zinc-200 text-zinc-800 placeholder-zinc-400 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <SlidersHorizontal size={14} className="text-zinc-400 mr-1" />
          {POSITIONS.map((pos) => (
            <button
              key={pos.value}
              onClick={() => handlePos(pos.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                posFilter === pos.value
                  ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-sky-300 hover:text-sky-600"
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>

        <span className="ml-auto text-sm text-zinc-400 shrink-0">
          {players.length.toLocaleString()} loaded
          {!allLoaded && (
            <span className="text-zinc-300"> / {currentTotal.toLocaleString()} total</span>
          )}
        </span>
      </div>

      {/* Grid */}
      {players.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          No players found matching &quot;{query}&quot;
          {posFilter ? ` in ${POSITIONS.find((p) => p.value === posFilter)?.label}` : ""}
          {!allLoaded && (
            <p className="mt-3 text-sm">
              Only {players.length.toLocaleString()} of {currentTotal.toLocaleString()} players are loaded.{" "}
              <button onClick={loadMore} className="text-sky-600 font-semibold hover:underline">
                Load more
              </button>{" "}
              to search further.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
            {visible.map((player, idx) => (
              <Link href={`/Players/${player.id}`} key={`${idx}-${player.id}`}>
                <div className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 h-full">
                  <div className="aspect-square w-full overflow-hidden bg-zinc-100 relative">
                    <img
                      src={player.img}
                      alt={player.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=e0f2fe&color=0369a1&size=200`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10">
                        {player.role}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-zinc-900 text-sm group-hover:text-sky-600 transition-colors leading-tight truncate">
                      {player.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{player.team}</p>
                    <div className="flex justify-end mt-2">
                      <ArrowRight size={13} className="text-zinc-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="flex flex-col items-center gap-3 mt-8">
            {/* Show more of already-loaded filtered results */}
            {hasMoreToDisplay && (
              <button
                onClick={() => setDisplayLimit((l) => l + 60)}
                className="px-6 py-2.5 bg-white border border-zinc-200 hover:border-sky-400 text-zinc-700 hover:text-sky-600 text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                Show more ({players.length - displayLimit} remaining in view)
              </button>
            )}

            {/* Fetch next API page */}
            {!allLoaded && !hasMoreToDisplay && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Loading…</>
                ) : (
                  <>Load next {PAGE_SIZE} players ({(currentTotal - players.length).toLocaleString()} remaining)</>
                )}
              </button>
            )}

            <p className="text-xs text-zinc-400">
              {players.length.toLocaleString()} of {currentTotal.toLocaleString()} players loaded
            </p>
          </div>
        </>
      )}
    </>
  );
}
