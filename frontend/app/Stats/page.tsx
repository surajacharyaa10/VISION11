"use client";

import { useState, useEffect } from 'react';
import { getTopScorers } from '../lib/api/topScorers';
import { getTopAssists } from '../lib/api/topAssists';
import { getTopYellowCards } from '../lib/api/topYellowCards';
import { getTopRedCards } from '../lib/api/topRedCards';

export default function StatsPage() {
    const [leagueId, setLeagueId] = useState('39'); // Default Premier League
    const [season, setSeason] = useState('2023'); // Default 2023
    const [statsType, setStatsType] = useState('scorers'); // scorers, assists, yellow, red
    
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const LEAGUES = [
        { id: '39', name: 'Premier League' },
        { id: '140', name: 'La Liga' },
        { id: '135', name: 'Serie A' },
        { id: '78', name: 'Bundesliga' },
        { id: '61', name: 'Ligue 1' }
    ];

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            setData([]);

            try {
                let res;
                if (statsType === 'scorers') res = await getTopScorers(leagueId, season);
                else if (statsType === 'assists') res = await getTopAssists(leagueId, season);
                else if (statsType === 'yellow') res = await getTopYellowCards(leagueId, season);
                else if (statsType === 'red') res = await getTopRedCards(leagueId, season);

                if (res?.response) {
                    setData(res.response);
                } else {
                    setError("No data found for this selection.");
                }
            } catch (err: any) {
                setError(err.message || "Failed to load stats.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [leagueId, season, statsType]);

    return (
        <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                        League Stats
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2">
                        View leaderboards for goals, assists, and discipline across top leagues.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <select 
                        value={leagueId} 
                        onChange={(e) => setLeagueId(e.target.value)}
                        className="border border-zinc-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                    >
                        {LEAGUES.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>

                    <select 
                        value={season} 
                        onChange={(e) => setSeason(e.target.value)}
                        className="border border-zinc-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                    >
                        <option value="2023">2023/24</option>
                        <option value="2022">2022/23</option>
                        <option value="2021">2021/22</option>
                    </select>

                    <div className="flex rounded-lg overflow-hidden border border-zinc-300">
                        {['scorers', 'assists', 'yellow', 'red'].map(type => (
                            <button
                                key={type}
                                onClick={() => setStatsType(type)}
                                className={`px-4 py-2 capitalize font-medium transition-colors ${
                                    statsType === type ? 'bg-blue-600 text-white' : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : data.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                        <table className="w-full text-left text-sm text-zinc-600">
                            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Rank</th>
                                    <th className="px-6 py-4 font-semibold">Player</th>
                                    <th className="px-6 py-4 font-semibold">Team</th>
                                    <th className="px-6 py-4 font-semibold text-right">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item: any, idx: number) => {
                                    // Depending on statsType, we find the relevant stat count
                                    let count = 0;
                                    const stat = item.statistics[0];
                                    if (statsType === 'scorers') count = stat.goals.total;
                                    else if (statsType === 'assists') count = stat.goals.assists;
                                    else if (statsType === 'yellow') count = stat.cards.yellow;
                                    else if (statsType === 'red') count = stat.cards.red;

                                    return (
                                        <tr key={item.player.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50">
                                            <td className="px-6 py-4 font-medium">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.player.photo} className="w-8 h-8 rounded-full shadow-sm" alt="" />
                                                    <span className="font-semibold text-zinc-900">{item.player.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <img src={item.statistics[0].team.logo} className="w-5 h-5 object-contain" alt="" />
                                                    {item.statistics[0].team.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-xl text-right text-zinc-900">{count || 0}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : !error && (
                    <div className="text-center text-zinc-500 py-12 bg-white rounded-xl border border-zinc-200">
                        No data available for this selection.
                    </div>
                )}
            </div>
        </div>
    );
}
