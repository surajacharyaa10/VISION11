"use client";

import { useState, useEffect } from 'react';
import PlayerDetailsModal from '../components/PlayerDetailsModal';

export default function PlayersPage() {
    const [prefix, setPrefix] = useState('');
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
    const [playerDetails, setPlayerDetails] = useState<any | null>(null);
    const [teamMatches, setTeamMatches] = useState<any[]>([]);
    const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        const loadDefaultPlayers = async () => {
            setLoading(true);
            try {
                const { getDefaultPlayers } = await import('../lib/api/playerdata');
                const defaults = await getDefaultPlayers();
                setPlayers(defaults);
            } catch (err) {
                console.error("Failed to load default players", err);
            } finally {
                setLoading(false);
            }
        };

        loadDefaultPlayers();
    }, []);
    const fetchPlayers = async () => {
        setLoading(true);
        setError('');
        setPlayers([]);
        try {
            const { getPlayersByPrefix } = await import('../lib/api/playerdata');
            const data: any = await getPlayersByPrefix(prefix);
            if (Array.isArray(data)) setPlayers(data);
            else if (data?.players && Array.isArray(data.players)) setPlayers(data.players);
            else if (data) setPlayers([data]);
        } catch (err: any) {
            setError(err.message || 'Failed to connect. Ensure the API is reachable.');
        } finally {
            setLoading(false);
        }
    };

    const handlePlayerClick = async (player: any) => {
        setSelectedPlayer(player);
        setPlayerDetails(null);
        setTeamMatches([]);
        setUpcomingMatches([]);
        setDetailsLoading(true);
        try {
            const { getPlayerFullData, resolvePlayerIdByName } = await import('../lib/api/playerdata');

            let targetId = player.id;
            if (player.isTheSportsDb) {
                const resolvedId = await resolvePlayerIdByName(player.name);
                if (resolvedId) {
                    targetId = resolvedId;
                    setSelectedPlayer({ ...player, id: resolvedId, isTheSportsDb: false });
                } else {
                    throw new Error("Could not find this player in the stats database.");
                }
            }

            const result = await getPlayerFullData(targetId);
            // We pass the entire result to playerDetails so we have transfers and trophies
            setPlayerDetails(result);
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to load player details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 relative">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col mb-10 gap-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Players
                    </h1>
                    <p className="text-gray-600">Search players by name</p>

                    <div className="flex gap-4 mt-4 max-w-md">
                        <input
                            type="text"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchPlayers()}
                            placeholder="e.g. messi, ro, mb"
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm"
                        />
                        <button
                            onClick={fetchPlayers}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {loading ? 'Searching…' : 'Search'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mt-2 max-w-2xl shadow-sm text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {players.map((player, idx) => (
                        <div
                            key={player.id || player.slug || idx}
                            onClick={() => handlePlayerClick(player)}
                            className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:bg-blue-50/40 transition-all duration-300 hover:shadow-lg shadow-sm group cursor-pointer flex flex-col items-center text-center"
                        >
                            {player.thumbnail ? (
                                <img src={player.thumbnail} alt={player.name} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-100 group-hover:border-blue-400 transition-colors shadow-sm" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 flex items-center justify-center text-3xl font-bold shadow-sm text-white">
                                    {(player.name || player.player_name || 'U').charAt(0)}
                                </div>
                            )}
                            <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors text-gray-900 leading-tight">
                                {player.name || player.player_name || 'Unknown Player'}
                            </h2>
                            <div className="w-full space-y-2 text-sm text-gray-500 mt-2">
                                <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <span className="text-gray-400 text-xs">Team</span>
                                    <span className="font-medium text-gray-700 truncate ml-3 text-xs">{player.team || '–'}</span>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <span className="text-gray-400 text-xs">Position</span>
                                    <span className="font-medium text-gray-700 truncate ml-3 text-xs">{player.position || '–'}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {players.length === 0 && !loading && !error && (
                        <div className="col-span-full py-16 text-center text-gray-400 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-4xl mb-3">⚽</p>
                            <p className="font-medium">No players found. Try a name like <strong>messi</strong> or <strong>ro</strong></p>
                        </div>
                    )}
                </div>
            </div>

            <PlayerDetailsModal
                selectedPlayer={selectedPlayer}
                playerDetails={playerDetails}
                teamMatches={teamMatches}
                upcomingMatches={upcomingMatches}
                detailsLoading={detailsLoading}
                onClose={() => setSelectedPlayer(null)}
            />
        </div>
    );
}