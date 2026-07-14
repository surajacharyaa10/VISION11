"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PlayerImage from "./PlayerImage";
import { Search, X } from "lucide-react";

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
    // Local input state — for client-side filtering of the current batch
    const [localSearch, setLocalSearch] = useState(initialSearch);

    // Client-side filtering on the current batch (instant, no reload)
    const filtered = useMemo(
        () =>
            localSearch.trim()
                ? initialPlayers.filter((p) =>
                      p.name.toLowerCase().includes(localSearch.toLowerCase())
                  )
                : initialPlayers,
        [initialPlayers, localSearch]
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

            {/* Search — two modes:
                1. Server search (form GET) — fetches new results from API when you press Enter or click Search
                2. Client filter — instant filter on the current batch as you type  */}
            <div className="max-w-xl mb-10 space-y-2">
                {/* Server-side search form */}
                <form action="/players" method="GET" className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            name="search"
                            defaultValue={initialSearch}
                            placeholder="Search players by name (press Enter or click Search)..."
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-10 pr-5 py-4 outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="shrink-0 px-5 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-colors"
                    >
                        Search
                    </button>
                    {initialSearch && (
                        <a
                            href="/players"
                            className="shrink-0 flex items-center justify-center px-4 py-4 bg-white/10 hover:bg-white/15 text-gray-300 rounded-2xl transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </a>
                    )}
                </form>

            </div>

            {errorMessage && (
                <div className="mb-8 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-300">
                    {errorMessage}
                </div>
            )}

            {!errorMessage && filtered.length === 0 && (
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-gray-300 text-center">
                    {initialSearch
                        ? `No players found for "${initialSearch}". Try a different name.`
                        : "No players found. Try a different search term."}
                </div>
            )}

            {/* Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((player) => (
                    <div
                        key={player.id}
                        className="group cursor-pointer rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 hover:-translate-y-2 transition duration-300 shadow-xl"
                    >
                        <div className="relative h-72 bg-slate-800">
                            <PlayerImage
                                photo={player.image}
                                name={player.name}
                                query={`${player.name} footballer`}
                                className="object-cover w-full h-full group-hover:scale-110 transition"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />

                            <div className="absolute bottom-5 left-5">
                                <h2 className="text-2xl font-bold">{player.name}</h2>
                                <p className="text-gray-300">{player.club}</p>
                            </div>

                            {player.rating > 0 && (
                                <div className="absolute top-5 right-5 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
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

                            {/* Internal player detail route */}
                            <Link
                                href={`/players/${player.id}`}
                                className="mt-4 block w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-semibold text-center text-white transition-colors"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
