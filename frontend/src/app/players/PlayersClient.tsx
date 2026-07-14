"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayerImage from "./PlayerImage";

export interface PlayerCard {
    id: number;
    name: string;
    image: string;
    club: string;
    country: string;
    position: string;
    age: number;
    rating: number;
    goals: number;
    assists: number;
    matches: number;
    bio: string;
}

interface PlayersClientProps {
    initialPlayers: PlayerCard[];
    initialSearch: string;
    errorMessage: string | null;
    league: number;
    season: number;
}

export default function PlayersClient({
    initialPlayers,
    initialSearch,
    errorMessage,
    league,
    season,
}: PlayersClientProps) {
    // Pure client-side search — no router.push, no page reload
    const [search, setSearch] = useState(initialSearch);
    const [selected, setSelected] = useState<PlayerCard | null>(null);
    const router = useRouter();

    // Always filter on the client side — no navigation needed
    const filtered = useMemo(
        () =>
            initialPlayers.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            ),
        [initialPlayers, search]
    );

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Football Players ⚽</h1>
                    <p className="text-gray-400 mt-2">
                        Explore world class football stars — live data from API-Football
                    </p>
                </div>
            </div>

            {/* Search — plain div, no form, no page reload */}
            <div className="relative max-w-xl mb-10">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search player by name..."
                    className="
          w-full
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          px-5 py-4
          outline-none
          text-white
          placeholder-gray-400
          focus:ring-2 focus:ring-blue-500
          "
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {errorMessage && (
                <div className="mb-8 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-300">
                    {errorMessage}
                </div>
            )}

            {!errorMessage && filtered.length === 0 && (
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-gray-300">
                    No players found. Try a different search term.
                </div>
            )}

            {/* Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((player) => (
                    <div
                        key={player.id}
                        onClick={() => setSelected(player)}
                        className="
          group
          cursor-pointer
          rounded-3xl
          overflow-hidden
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          hover:-translate-y-2
          transition
          duration-300
          shadow-xl
          "
                    >
                        <div className="relative h-72 bg-slate-800">
                            <PlayerImage
                                photo={player.image}
                                name={player.name}
                                query={`${player.name} footballer`}
                                className="
              object-cover
              w-full
              h-full
              group-hover:scale-110
              transition
              "
                            />

                            <div
                                className="
              absolute inset-0 
              bg-gradient-to-t 
              from-black 
              via-transparent
              "
                            />

                            <div
                                className="
              absolute bottom-5 left-5
              "
                            >
                                <h2 className="text-2xl font-bold">{player.name}</h2>
                                <p className="text-gray-300">{player.club}</p>
                            </div>

                            {player.rating > 0 && (
                                <div
                                    className="
              absolute top-5 right-5
              bg-yellow-400
              text-black
              px-3 py-1
              rounded-full
              font-bold
              "
                                >
                                    ⭐ {player.rating}
                                </div>
                            )}
                        </div>

                        <div className="p-5 space-y-2">
                            <div className="flex justify-between">
                                <span>Position</span>
                                <b>{player.position}</b>
                            </div>

                            <div className="flex justify-between">
                                <span>Country</span>
                                <b>{player.country}</b>
                            </div>

                            <button
                                onClick={() => router.push(`/players/${player.id}`)}
                                className="
              mt-4
              w-full
              bg-blue-600
              hover:bg-blue-700
              rounded-xl
              py-3
              font-semibold
              "
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Profile Modal */}
            {selected && (
                <div
                    className="
      fixed inset-0
      bg-black/70
      backdrop-blur-sm
      flex items-center justify-center
      p-5
      z-50
      "
                    onClick={() => setSelected(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="
        max-w-xl
        w-full
        bg-slate-900
        rounded-3xl
        border border-white/20
        p-8
        relative
        "
                    >
                        <button
                            onClick={() => setSelected(null)}
                            className="
          absolute right-5 top-5
          text-gray-400
          hover:text-white
          "
                        >
                            ✕
                        </button>

                        <div className="text-center">
                            <div className="relative w-[140px] h-[140px] mx-auto">
                                <PlayerImage
                                    photo={selected.image}
                                    name={selected.name}
                                    query={`${selected.name} footballer`}
                                    className="
          rounded-full
          object-cover
          border-4 border-blue-500
          w-full
          h-full
          "
                                />
                            </div>

                            <h2 className="text-3xl font-bold mt-4">{selected.name}</h2>
                            <p className="text-gray-400">{selected.club}</p>
                        </div>

                        <div
                            className="
          grid grid-cols-3
          gap-4
          mt-8
          "
                        >
                            <Stat title="Goals" value={selected.goals} />
                            <Stat title="Assists" value={selected.assists} />
                            <Stat title="Matches" value={selected.matches} />
                        </div>

                        <div className="mt-6 space-y-2 text-gray-300">
                            <p>🌍 {selected.country}</p>
                            <p>⚽ {selected.position}</p>
                            <p>🎂 Age {selected.age || "N/A"}</p>
                        </div>

                        <p className="mt-6 text-gray-400">{selected.bio}</p>
                    </div>
                </div>
            )}
        </main>
    );
}

function Stat({ title, value }: { title: string; value: number }) {
    return (
        <div
            className="
bg-white/10
rounded-2xl
p-4
text-center
"
        >
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-gray-400 text-sm">{title}</p>
        </div>
    );
}
