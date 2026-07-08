"use client";

import React from 'react';

export default function PlayerSidebar({ playerDetails }: { playerDetails: any }) {
    const player = playerDetails?.player;
    if (!player) return null;

    const stats = playerDetails?.stats || [];
    const currentStat = stats.length > 0 ? stats[0] : null;

    // Determine positions played from recent stats
    const positions = new Set<string>();
    stats.forEach((s: any) => {
        if (s.games?.position) positions.add(s.games.position);
    });
    const positionList = Array.from(positions);

    // Attribute calculation heuristics (0-100) based on available API-Sports data
    let ATT = 0, TEC = 0, TAC = 0, DEF = 0, CRE = 0;
    let hasStatsForRadar = false;

    if (currentStat) {
        hasStatsForRadar = true;
        const games = currentStat.games?.appearences || 1; // avoid div by 0
        
        // ATT: Goals + Shots on target per game
        const goalsPerGame = (currentStat.goals?.total || 0) / games;
        const shotsPerGame = (currentStat.shots?.on || 0) / games;
        ATT = Math.min(100, Math.round((goalsPerGame * 40) + (shotsPerGame * 20) + 40));
        
        // TEC: Dribble success rate
        const dribbleAttempts = currentStat.dribbles?.attempts || 0;
        const dribbleSuccess = currentStat.dribbles?.success || 0;
        TEC = dribbleAttempts > 0 ? Math.round((dribbleSuccess / dribbleAttempts) * 100) : 50;
        
        // TAC: Tackles per game
        const tacklesPerGame = (currentStat.tackles?.total || 0) / games;
        TAC = Math.min(100, Math.round(tacklesPerGame * 30 + 40));
        
        // DEF: Interceptions & Blocks per game
        const defActions = ((currentStat.tackles?.interceptions || 0) + (currentStat.tackles?.blocks || 0)) / games;
        DEF = Math.min(100, Math.round(defActions * 25 + 30));
        
        // CRE: Key passes and Assists
        const keyPassesPerGame = (currentStat.passes?.key || 0) / games;
        const assistsPerGame = (currentStat.goals?.assists || 0) / games;
        CRE = Math.min(100, Math.round((keyPassesPerGame * 20) + (assistsPerGame * 40) + 40));
    }

    // SVG coordinates mapping helper (0-100 scale)
    const getPoint = (value: number, angleOffset: number) => {
        const radius = (value / 100) * 45; // Max radius 45 within a 100x100 viewBox
        const angle = (Math.PI * 2 * angleOffset) / 5 - Math.PI / 2;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return `${x},${y}`;
    };

    const playerPolygonPoints = `${getPoint(ATT, 0)} ${getPoint(TEC, 1)} ${getPoint(TAC, 2)} ${getPoint(DEF, 3)} ${getPoint(CRE, 4)}`;

    return (
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 font-sans">
            
            {/* Header info (Name, Photo, Team) */}
            <div className="flex flex-col items-center mb-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 mb-4 bg-white/5">
                    <img 
                        src={player.strCutout || player.strThumb || player.photo} 
                        alt={player.strPlayer || player.name} 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1 text-center">
                    {player.strPlayer || player.name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    {player.strNationality && <span>{player.strNationality}</span>}
                    {player.age && <span>• {player.age} yrs</span>}
                </div>
            </div>

            {/* 1. Attribute Overview Radar Chart */}
            <div className="bg-[#121418] rounded-xl border border-white/5 p-5 relative">
                <h3 className="text-xs font-semibold text-gray-400 mb-6 text-center">Attribute Overview</h3>
                
                {!hasStatsForRadar ? (
                    <div className="h-48 flex items-center justify-center text-gray-500 text-xs">
                        No attribute data available for radar chart.
                    </div>
                ) : (
                    <div className="relative w-48 h-48 mx-auto">
                        <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 overflow-visible text-gray-700">
                            {/* Concentric pentagons */}
                            <polygon points="50,5 95,38 78,90 22,90 5,38" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            <polygon points="50,20 80,42 68,75 32,75 20,42" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            <polygon points="50,35 65,46 59,60 41,60 35,46" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            
                            {/* Axes connecting center to outer points */}
                            <line x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="95" y2="38" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="78" y2="90" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="22" y2="90" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="5" y2="38" stroke="currentColor" strokeWidth="0.5" />

                            {/* Player Data Polygon */}
                            <polygon points={playerPolygonPoints} fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="2" />
                        </svg>

                        {/* Labels & Values */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
                            <span className="text-[10px] text-gray-400">ATT</span>
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-1 rounded">{ATT}</span>
                        </div>
                        <div className="absolute top-8 -right-8 flex flex-col items-center">
                            <span className="bg-green-600 text-black text-[10px] font-bold px-1 rounded">{TEC}</span>
                            <span className="text-[10px] text-gray-400">TEC</span>
                        </div>
                        <div className="absolute bottom-2 -right-4 flex flex-col items-center">
                            <span className="text-[10px] text-gray-400">TAC</span>
                            <span className="bg-yellow-500 text-black text-[10px] font-bold px-1 rounded">{TAC}</span>
                        </div>
                        <div className="absolute bottom-2 -left-4 flex flex-col items-center">
                            <span className="text-[10px] text-gray-400">DEF</span>
                            <span className="bg-red-600 text-white text-[10px] font-bold px-1 rounded">{DEF}</span>
                        </div>
                        <div className="absolute top-8 -left-8 flex flex-col items-center">
                            <span className="text-[10px] text-gray-400">CRE</span>
                            <span className="bg-green-600 text-black text-[10px] font-bold px-1 rounded">{CRE}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Player Positions (Mini Pitch) */}
            <div className="bg-[#121418] rounded-xl border border-white/5 p-5">
                <h3 className="text-xs font-semibold text-gray-400 mb-6 text-center">Player positions</h3>
                
                <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-4 text-xs">
                        <div>
                            <span className="text-white font-bold mb-1 block border-b border-white/10 pb-1">Positions Played</span>
                            {positionList.length > 0 ? (
                                positionList.map((pos, idx) => (
                                    <div key={idx} className="text-gray-300 py-1">{pos}</div>
                                ))
                            ) : (
                                <div className="text-gray-500">Not available</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Mini Pitch */}
                    <div className="w-24 h-32 bg-[#1b3320] border-2 border-[#2c5333] rounded-sm relative overflow-hidden flex flex-col justify-between">
                        {/* Pitch lines */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#2c5333] -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-[#2c5333] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="w-12 h-6 border-2 border-[#2c5333] mx-auto border-t-0"></div>
                        <div className="w-12 h-6 border-2 border-[#2c5333] mx-auto border-b-0"></div>

                        {/* Positions (Just map first 3 dynamically as rough visualization based on name) */}
                        {positionList.slice(0, 3).map((pos, idx) => {
                            let top = "50%";
                            let left = "50%";
                            const pLow = pos.toLowerCase();
                            if (pLow.includes('attack')) { top = '20%'; }
                            else if (pLow.includes('midfield')) { top = '50%'; }
                            else if (pLow.includes('defend')) { top = '80%'; }
                            
                            return (
                                <div key={idx} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top, left }}>
                                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border border-white/20 shadow">
                                        {pos.substring(0, 3).toUpperCase()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}
