import React from "react";

interface Team {
    idTeam: string;
    strTeam: string;
    strTeamShort?: string;
    strTeamAlternate?: string;
    intFormedYear?: string;
    strSport?: string;
    strLeague?: string;
    strCountry?: string;
    strStadium?: string;
    strDescriptionEN?: string;
    strBadge?: string;
    strLogo?: string;
    strWebsite?: string;
    strGender?: string;
    intStadiumCapacity?: string;
}

interface PlayersTableProps {
    team?: Team;
    players?: any[];
}

export default function PlayersTable({ team, players }: PlayersTableProps) {
    const list = players && players.length > 0 ? players : [];

    return (
        <div className="text-gray-400">
            {list.length === 0 ? (
                <p>No players available.</p>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-xs text-gray-400 uppercase tracking-wider">
                                <th className="pb-2 pr-4">Player</th>
                                <th className="pb-2 pr-4">Position</th>
                                <th className="pb-2 pr-4">Nationality</th>
                                <th className="pb-2 pr-4">Age</th>
                                <th className="pb-2 pr-4 text-right">Apps</th>
                                <th className="pb-2 pr-4 text-right">Goals</th>
                                <th className="pb-2 pr-4 text-right">Assists</th>
                                <th className="pb-2 text-right">Minutes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((p: any) => (
                                <tr key={p.player_id} className="border-b border-white/5 hover:bg-white/5 transition">
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            {p.player_image ? (
                                                <img src={p.player_image} alt={p.known_name || p.player_name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                    {(p.known_name || p.player_name || "").charAt(0)}
                                                </div>
                                            )}
                                            <span className="font-medium text-white">{p.known_name || p.player_name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4 text-gray-300">{p.position}</td>
                                    <td className="py-3 pr-4 text-gray-300">{p.nationality}</td>
                                    <td className="py-3 pr-4 text-gray-300">{p.age ?? "-"}</td>
                                    <td className="py-3 pr-4 text-right text-gray-300">{p.stats?.appearances ?? "-"}</td>
                                    <td className="py-3 pr-4 text-right text-gray-300">{p.stats?.goals ?? "-"}</td>
                                    <td className="py-3 pr-4 text-right text-gray-300">{p.stats?.assists ?? "-"}</td>
                                    <td className="py-3 text-right text-gray-300">{p.stats?.minutes ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
