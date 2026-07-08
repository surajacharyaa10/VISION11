"use client";

import React from 'react';

interface FantasyTabProps {
    playerDetails: any;
    stats: any[];
}

export default function FantasyTab({ playerDetails, stats }: FantasyTabProps) {
    if (!stats || stats.length === 0) {
        return (
            <div className="flex flex-col text-sm text-gray-300 items-center justify-center py-16">
                <p className="text-4xl mb-4">⭐</p>
                <p className="text-gray-400 font-semibold mb-2">No fantasy data available</p>
                <p className="text-gray-500 text-xs">Could not generate fantasy points because season stats are missing.</p>
            </div>
        );
    }

    const currentStat = stats[0];
    
    // Derived Fantasy Points Logic (mocking SofaScore's fantasy point system based on real API stats)
    const goals = currentStat?.goals?.total || 0;
    const assists = currentStat?.goals?.assists || 0;
    const keyPasses = currentStat?.passes?.key || 0;
    const tackles = currentStat?.tackles?.total || 0;
    const interceptions = currentStat?.tackles?.interceptions || 0;
    const yellow = currentStat?.cards?.yellow || 0;
    const red = currentStat?.cards?.red || 0;
    const minutes = currentStat?.games?.minutes || 0;
    
    let totalPoints = 0;
    totalPoints += goals * 5; // 5 pts per goal
    totalPoints += assists * 3; // 3 pts per assist
    totalPoints += keyPasses * 1; // 1 pt per key pass
    totalPoints += tackles * 1; // 1 pt per tackle
    totalPoints += interceptions * 1; // 1 pt per interception
    totalPoints -= yellow * 2; // -2 pts per yellow card
    totalPoints -= red * 5; // -5 pts per red card
    totalPoints += Math.floor(minutes / 90) * 2; // 2 pts for full 90 mins

    const positionStr = currentStat?.games?.position === 'Attacker' ? 'FWD' : 
                        currentStat?.games?.position === 'Midfielder' ? 'MID' : 
                        currentStat?.games?.position === 'Defender' ? 'DEF' : 'GK';
                        
    const form = (currentStat?.games?.rating ? parseFloat(currentStat.games.rating) + 3 : 11.0).toFixed(1);

    return (
        <div className="flex flex-col text-sm text-gray-300 pb-8">
            <div className="flex gap-8">
                
                {/* Left Column: Competition Selectors */}
                <div className="w-48 shrink-0 flex flex-col gap-2">
                    <button className="flex items-center gap-2 bg-[#1b1c21] border border-yellow-600 rounded px-3 py-2 text-white font-semibold">
                        <span className="text-yellow-500">🏆</span> World Cup 2026 <span className="ml-auto text-xs">▲</span>
                    </button>
                    <button className="flex items-center gap-2 bg-transparent hover:bg-white/5 rounded px-3 py-2 text-gray-400">
                        <span>🇺🇸</span> MLS 2025
                    </button>
                    <button className="flex items-center gap-2 bg-transparent hover:bg-white/5 rounded px-3 py-2 text-gray-400">
                        <span>🇺🇸</span> MLS 2026
                    </button>
                    <button className="flex items-center gap-2 bg-transparent hover:bg-white/5 rounded px-3 py-2 text-gray-400">
                        <span className="text-yellow-500">🏆</span> World Cup 2026
                    </button>
                </div>

                {/* Right Column: Fantasy Stats */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6 text-center">Overview</h3>
                    
                    {/* Overview Stats Grid */}
                    <div className="flex justify-center gap-24 mb-12">
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-gray-500 uppercase font-semibold mb-1">Form</span>
                            <span className="text-xl font-bold text-white">{form}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Pts</span>
                            <span className="text-xl font-bold text-white">{totalPoints}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-gray-500 uppercase font-semibold mb-1">Selected</span>
                            <span className="text-xl font-bold text-white">27.2%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-gray-500 uppercase font-semibold mb-1">Position</span>
                            <span className="text-xl font-bold text-white">{positionStr}</span>
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-4">Season results</h3>
                    
                    {/* Season Results List */}
                    <div className="flex flex-col">
                        {/* Dynamic Round (using average points to simulate match performance) */}
                        <div className="flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer">
                            <div className="flex flex-col w-32">
                                <span className="font-bold text-white">R1</span>
                                <span className="text-[10px] text-gray-500">17/06/26, 06:45</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>🇦🇷</span>
                                <span className="text-white font-bold text-xs">3 - 0</span>
                                <span>🇪🇬</span>
                                <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold text-white ml-2">W</span>
                            </div>
                            <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                {Math.round(totalPoints * 0.28)}pts <span className="text-blue-500">›</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer">
                            <div className="flex flex-col w-32">
                                <span className="font-bold text-white">R2</span>
                                <span className="text-[10px] text-gray-500">22/06/26, 22:45</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>🇦🇷</span>
                                <span className="text-white font-bold text-xs">2 - 0</span>
                                <span>🇦🇹</span>
                                <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold text-white ml-2">W</span>
                            </div>
                            <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                {Math.round(totalPoints * 0.2)}pts <span className="text-blue-500">›</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer">
                            <div className="flex flex-col w-32">
                                <span className="font-bold text-white">R3</span>
                                <span className="text-[10px] text-gray-500">28/06/26, 07:45</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>🇯🇴</span>
                                <span className="text-white font-bold text-xs">1 - 3</span>
                                <span>🇦🇷</span>
                                <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold text-white ml-2">W</span>
                            </div>
                            <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                {Math.round(totalPoints * 0.12)}pts <span className="text-blue-500">›</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
