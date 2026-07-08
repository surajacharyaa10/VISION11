"use client";

import React from 'react';

interface SeasonTabProps {
    playerDetails: any;
    stats: any[];
}

export default function SeasonTab({ playerDetails, stats }: SeasonTabProps) {
    if (!stats || stats.length === 0) {
        return (
            <div className="flex flex-col text-sm text-gray-300 items-center justify-center py-16">
                <p className="text-4xl mb-4">📊</p>
                <p className="text-gray-400 font-semibold mb-2">No seasonal stats available</p>
                <p className="text-gray-500 text-xs">API-Sports returned no statistics for this player's current season.</p>
            </div>
        );
    }

    const currentStat = stats[0];
    const games = currentStat?.games || {};
    const goals = currentStat?.goals || {};
    const passes = currentStat?.passes || {};
    const tackles = currentStat?.tackles || {};
    const dribbles = currentStat?.dribbles || {};
    const league = currentStat?.league?.name || 'All Competitions';
    const season = currentStat?.league?.season || new Date().getFullYear();
    
    return (
        <div className="flex flex-col text-sm text-gray-300 pb-8">
            
            {/* Top controls */}
            <div className="flex gap-3 mb-6">
                <select className="bg-[#121418] border border-white/10 rounded px-3 py-2 text-sm text-white outline-none w-64">
                    <option>{league}</option>
                </select>
                <select className="bg-[#121418] border border-white/10 rounded px-3 py-2 text-sm text-white outline-none w-32">
                    <option>{season}</option>
                </select>
            </div>

            {/* Grid stats layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Heatmap Placeholder */}
                <div className="bg-[#121418] border border-white/5 rounded-xl p-5 flex flex-col">
                    <h4 className="text-[13px] font-semibold text-white mb-4 text-center">Season heatmap</h4>
                    <div className="flex-1 bg-[#254528] rounded-lg border-2 border-green-900/50 relative overflow-hidden flex items-center justify-center h-48">
                        {/* Pitch markings */}
                        <div className="w-[90%] h-[80%] border-2 border-white/20 relative">
                            {/* Center line */}
                            <div className="w-[2px] h-full bg-white/20 absolute left-1/2 -translate-x-1/2"></div>
                            <div className="w-12 h-12 border-2 border-white/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            {/* Penalty boxes */}
                            <div className="w-16 h-24 border-2 border-white/20 absolute top-1/2 left-0 -translate-y-1/2 border-l-0"></div>
                            <div className="w-16 h-24 border-2 border-white/20 absolute top-1/2 right-0 -translate-y-1/2 border-r-0"></div>
                        </div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                            <span className="text-gray-300 font-semibold text-sm">Heatmap Data Unavailable</span>
                            <span className="text-gray-400 text-xs mt-1">Requires location tracking data</span>
                        </div>
                    </div>
                </div>

                {/* Matches Stats */}
                <div className="bg-[#121418] border border-white/5 rounded-xl p-5 flex flex-col">
                    <h4 className="text-[13px] font-semibold text-white mb-4 text-center">Matches</h4>
                    <div className="flex flex-col gap-3 text-[13px]">
                        <div className="flex justify-between items-center"><span className="text-gray-400">Appearances</span><span className="text-white font-semibold">{games.appearences || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Started</span><span className="text-white font-semibold">{games.lineups || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Minutes per game</span><span className="text-white font-semibold">{games.appearences > 0 ? Math.round((games.minutes || 0) / games.appearences) : 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Total minutes played</span><span className="text-white font-semibold">{games.minutes || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Average Rating</span><span className="text-white font-semibold">{games.rating ? parseFloat(games.rating).toFixed(2) : '-'}</span></div>
                    </div>
                </div>

                {/* Attacking */}
                <div className="bg-[#121418] border border-white/5 rounded-xl p-5 flex flex-col">
                    <h4 className="text-[13px] font-semibold text-white mb-4 text-center">Attacking</h4>
                    <div className="flex flex-col gap-3 text-[13px]">
                        <div className="flex justify-between items-center"><span className="text-gray-400">Goals</span><span className="text-white font-semibold">{goals.total || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Total shots</span><span className="text-white font-semibold">{currentStat?.shots?.total || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Shots on target</span><span className="text-white font-semibold">{currentStat?.shots?.on || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Dribbles (Attempts)</span><span className="text-white font-semibold">{dribbles.attempts || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Dribbles (Success)</span><span className="text-white font-semibold">{dribbles.success || 0}</span></div>
                    </div>
                </div>

                {/* Passing & Defense */}
                <div className="bg-[#121418] border border-white/5 rounded-xl p-5 flex flex-col">
                    <h4 className="text-[13px] font-semibold text-white mb-4 text-center">Passing & Defense</h4>
                    <div className="flex flex-col gap-3 text-[13px]">
                        <div className="flex justify-between items-center"><span className="text-gray-400">Assists</span><span className="text-white font-semibold">{goals.assists || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Total Passes</span><span className="text-white font-semibold">{passes.total || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Key passes</span><span className="text-white font-semibold">{passes.key || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Pass Accuracy</span><span className="text-white font-semibold">{passes.accuracy || 0}%</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Tackles</span><span className="text-white font-semibold">{tackles.total || 0}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Interceptions</span><span className="text-white font-semibold">{tackles.interceptions || 0}</span></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
