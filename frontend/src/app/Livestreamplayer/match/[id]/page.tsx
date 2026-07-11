import { getSportsrcMatchDetail } from "@/lib/sportsrc";

export default async function MatchPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams?: { sport?: string } }) {
    const { id } = await params;
    const match = await getSportsrcMatchDetail(id);

    if (!match) {
        return (
            <main className="min-h-screen bg-gray-950 p-6 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-white mb-6">Match Not Found</h1>
                <p className="text-gray-400">The requested match could not be loaded. It may have ended or the ID is invalid.</p>
            </main>
        );
    }

    const sport = match.sport || searchParams?.sport || "football";

    return (
        <main className="min-h-screen bg-gray-950 flex flex-col items-center">
            <div className="w-full max-w-5xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">{match.league || "Live Match"}</h1>
                    {match.status && (
                        <span className="text-xs font-bold px-3 py-1 rounded bg-red-600 text-white animate-pulse">
                            {match.status.toUpperCase()}{match.status_detail ? ` • ${match.status_detail}` : ""}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-900 p-4 rounded-lg text-center">
                        <div className="text-sm text-gray-400 mb-1">HOME</div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {match.home_badge && (
                                <img src={match.home_badge} alt={match.home_team} className="w-8 h-8 object-contain" />
                            )}
                            <div className="text-lg font-bold text-white">{match.home_team || "TBD"}</div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">{match.home_score ?? 0}</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg text-center flex flex-col items-center justify-center">
                        <div className="text-xs text-gray-500 mb-1">VS</div>
                        {match.display_score && <div className="text-sm text-gray-300 font-mono">{match.display_score}</div>}
                        {match.title && <div className="text-xs text-gray-500 mt-1">{match.title}</div>}
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg text-center">
                        <div className="text-sm text-gray-400 mb-1">AWAY</div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {match.away_badge && (
                                <img src={match.away_badge} alt={match.away_team} className="w-8 h-8 object-contain" />
                            )}
                            <div className="text-lg font-bold text-white">{match.away_team || "TBD"}</div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">{match.away_score ?? 0}</div>
                    </div>
                </div>

                <div className="bg-black rounded-lg overflow-hidden">
                    {match.embed_url ? (
                        <iframe
                            src={match.embed_url}
                            width="100%"
                            height="100%"
                            allow="autoplay; fullscreen; encrypted-media"
                            allowFullScreen
                            className="w-full aspect-video"
                        />
                    ) : (
                        <div className="w-full aspect-video flex items-center justify-center text-gray-400">
                            No stream available for this match.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}