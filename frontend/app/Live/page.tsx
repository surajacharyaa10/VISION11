"use client";

import { useState, useEffect } from 'react';
import { getLiveFixtures } from '../lib/api/fixtures';

export default function LiveMatchesPage() {
    const [fixtures, setFixtures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLive = async () => {
            try {
                const data = await getLiveFixtures();
                if (data && data.response) {
                    setFixtures(data.response);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load live matches");
            } finally {
                setLoading(false);
            }
        };
        fetchLive();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                        Live Matches
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2">
                        Real-time scores and updates for currently ongoing matches.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm border border-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : fixtures.length === 0 && !error ? (
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-12 text-center text-zinc-500">
                        No live matches happening right now.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fixtures.map((match: any) => (
                            <div key={match.fixture.id} className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-xs text-red-600 font-semibold mb-4 flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                        LIVE {match.fixture.status.elapsed}'
                                    </span>
                                    <span className="text-zinc-400 font-normal">{match.league.name}</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-8 h-8 object-contain" />
                                            <span className="font-medium text-zinc-800">{match.teams.home.name}</span>
                                        </div>
                                        <span className="text-xl font-bold">{match.goals.home}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-8 h-8 object-contain" />
                                            <span className="font-medium text-zinc-800">{match.teams.away.name}</span>
                                        </div>
                                        <span className="text-xl font-bold">{match.goals.away}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
