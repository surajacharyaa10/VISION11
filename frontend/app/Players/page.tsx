import { Trophy, Activity, Star } from "lucide-react";
import { getBzzoiroPlayers } from "@/app/lib/api/bzzoiroApi";
import PlayersClient from "./PlayersClient";

export interface PlayerCard {
  id: number;
  name: string;
  team: string;
  role: string;
  position: string;
  img: string;
}

function positionLabel(pos: string): string {
  if (pos === "F") return "Attacker";
  if (pos === "M") return "Midfielder";
  if (pos === "D") return "Defender";
  if (pos === "G") return "Goalkeeper";
  return "Player";
}

export default async function PlayersLandingPage() {
  let players: PlayerCard[] = [];
  let totalCount = 0;

  try {
    // Fetch just the first page instantly so the page renders fast.
    // PlayersClient handles "Load More" to fetch additional pages on demand.
    const apiKey = process.env.BZZOIRO_API_KEY || process.env.NEXT_PUBLIC_BZZOIRO_API_KEY || "";
    const res = await fetch(
      `https://sports.bzzoiro.com/api/v2/players/?limit=100&offset=0`,
      {
        headers: { Authorization: `Token ${apiKey}` },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();
      const raw: any[] = data.results ?? (Array.isArray(data) ? data : []);
      totalCount = data.count ?? raw.length;

      players = raw.map((p: any) => ({
        id: p.id,
        name: p.name,
        team: p.nationality || p.team_name || "Unknown",
        role: positionLabel(p.position),
        position: p.position || "",
        img: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=e0f2fe&color=0369a1&size=200`,
      }));
    }
  } catch (err) {
    console.error("Failed to load players:", err);
  }

  return (
    <div className="flex bg-zinc-50 min-h-screen text-zinc-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white h-screen border-r border-zinc-200 shrink-0 p-5 hidden md:block overflow-y-auto">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
          Players Hub
        </h2>
        <div className="space-y-1">
          <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm bg-sky-50 text-sky-700 font-semibold transition-all">
            <Star size={16} /> All Players
          </button>
          <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-all">
            <Activity size={16} /> Top Scorers
          </button>
          <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-all">
            <Trophy size={16} /> Most Assists
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100">
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2">
            Total in Database
          </p>
          <p className="text-2xl font-black text-zinc-800">{totalCount.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 mt-1">players from Bzzoiro</p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
              Players
            </h1>
            <p className="text-sm text-zinc-500 mt-2 max-w-xl">
              {totalCount.toLocaleString()} players in the database — from Ronaldo to Sunday league.
              Search by name or filter by position. More load as you scroll.
            </p>
          </div>

          {/* Client handles infinite scroll / load more */}
          <PlayersClient initialPlayers={players} totalCount={totalCount} />
        </div>
      </main>
    </div>
  );
}
