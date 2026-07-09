"use client";

import { useState } from 'react';
import { searchTeam } from '../lib/api/teams';
import { getSquads } from '../lib/api/squads';

export default function SquadsPage() {
    const [teamName, setTeamName] = useState('');
    const [team, setTeam] = useState<any>(null);
    const [squad, setSquad] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!teamName) return;
        setLoading(true);
        setError('');
        setTeam(null);
        setSquad([]);

        try {
            const teamData = await searchTeam(teamName);
            if (teamData?.response && teamData.response.length > 0) {
                const foundTeam = teamData.response[0].team;
                setTeam(foundTeam);

                const squadData = await getSquads(foundTeam.id);
                if (squadData?.response && squadData.response.length > 0) {
                    setSquad(squadData.response[0].players);
                } else {
                    setError("No squad data found for this team.");
                }
            } else {
                setError("Team not found.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to search for squad");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                        Team Squads
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2">
                        Search for any football team to view their current squad list.
                    </p>
                </div>

                <div className="flex gap-4 max-w-md">
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="e.g. Manchester United, Real Madrid"
                        className="flex-1 border border-zinc-300 rounded-lg px-4 py-2 text-zinc-900 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                    >
                        {loading ? 'Searching…' : 'Search'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mt-2 shadow-sm">
                        {error}
                    </div>
                )}

                {team && !loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden mt-8">
                        <div className="p-6 border-b border-zinc-100 flex items-center gap-4 bg-zinc-50/50">
                            <img src={team.logo} alt={team.name} className="w-16 h-16 object-contain" />
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-800">{team.name}</h2>
                                <p className="text-zinc-500">{team.country}</p>
                            </div>
                        </div>
                        
                        {squad.length > 0 ? (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {squad.map((player: any) => (
                                        <div key={player.id} className="flex items-center gap-4 p-4 rounded-lg border border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200 transition-colors">
                                            {player.photo ? (
                                                <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-500">
                                                    {player.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-zinc-800 leading-tight">{player.name}</p>
                                                <p className="text-xs text-zinc-500 mt-1">{player.position}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-zinc-500">No players available</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
