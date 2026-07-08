"use client";

import React from 'react';

interface CareerTabProps {
    playerDetails: any;
    career: any[]; // Data from /players/teams
}

export default function CareerTab({ playerDetails, career }: CareerTabProps) {
    const [expandedYears, setExpandedYears] = React.useState<Record<string, boolean>>({});

    const toggleYear = (year: string) => {
        setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
    };

    if (!career || career.length === 0) {
        return (
            <div className="flex-1 bg-[#121418] p-12 text-center rounded-xl border border-white/5 flex flex-col items-center justify-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-gray-400 font-semibold">No career history available</p>
            </div>
        );
    }

    const historyRows: any[] = [];
    
    // Build rows from the career data (which only contains team and seasons)
    const sortedCareer = [...career].reverse();
    let currentYearFallback = new Date().getFullYear();

    sortedCareer.forEach((entry) => {
        // API-Sports /players/teams returns { team: {id, name, logo}, seasons: [2023, 2022] }
        if (entry.seasons && Array.isArray(entry.seasons)) {
            entry.seasons.forEach((seasonYear: number) => {
                historyRows.push({
                    year: seasonYear.toString(),
                    teamName: entry.team?.name || 'Unknown',
                    logo: entry.team?.logo,
                    mp: '-', min: '-', gls: '-', ast: '-', asr: '-'
                });
            });
        } else {
            // fallback if no seasons array
            historyRows.push({
                year: currentYearFallback.toString(),
                teamName: entry.team?.name || 'Unknown',
                logo: entry.team?.logo,
                mp: '-', min: '-', gls: '-', ast: '-', asr: '-'
            });
            currentYearFallback--;
        }
    });

    // Group by year
    const grouped = historyRows.reduce((acc: any, row: any) => {
        if (!acc[row.year]) acc[row.year] = [];
        acc[row.year].push(row);
        return acc;
    }, {});

    const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

    // Initialize first year expanded
    if (Object.keys(expandedYears).length === 0 && sortedYears.length > 0) {
        setExpandedYears({ [sortedYears[0]]: true });
    }

    return (
        <div className="flex flex-col text-sm text-gray-300 pb-8">
            
            {/* Table Header */}
            <div className="flex items-center py-2 px-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-white/5 rounded-t-lg">
                <div className="w-16">Year</div>
                <div className="flex-1">Team</div>
                <div className="flex items-center gap-6 justify-end w-1/2 pr-2">
                    <div className="w-8 text-center" title="Matches Played">MP</div>
                    <div className="w-10 text-center" title="Minutes Played">MIN</div>
                    <div className="w-8 text-center" title="Goals">GLS</div>
                    <div className="w-8 text-center" title="Assists">AST</div>
                    <div className="w-10 text-center" title="Average Rating">ASR</div>
                </div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col">
                {sortedYears.map((year) => {
                    const isExpanded = expandedYears[year] !== false;
                    const teams = grouped[year];

                    return (
                        <div key={year} className="flex flex-col border-b border-white/5">
                            {/* Year row (Header) */}
                            <div 
                                className="flex items-center py-3 px-2 hover:bg-white/5 cursor-pointer transition-colors"
                                onClick={() => toggleYear(year)}
                            >
                                <div className="w-16 text-white font-bold text-sm">{year}</div>
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400">🛡️</div>
                                    <span className="text-gray-400 text-xs">
                                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 justify-end w-1/2 pr-2 text-xs font-semibold text-gray-500">
                                    <div className="w-8 text-center">-</div>
                                    <div className="w-10 text-center">-</div>
                                    <div className="w-8 text-center">-</div>
                                    <div className="w-8 text-center">-</div>
                                    <div className="w-10 text-center">-</div>
                                </div>
                            </div>

                            {/* Details rows */}
                            {isExpanded && teams.map((team: any, i: number) => (
                                <div key={i} className="flex items-center py-2 px-2 bg-white/[0.02] hover:bg-white/5 transition-colors">
                                    <div className="w-16"></div>
                                    <div className="flex-1 flex items-center gap-3">
                                        {team.logo ? (
                                            <img src={team.logo} alt={team.teamName} className="w-5 h-5 object-contain" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-gray-500">
                                                {team.teamName.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-xs text-gray-300 truncate max-w-[200px]">{team.teamName}</span>
                                    </div>
                                    <div className="flex items-center gap-6 justify-end w-1/2 pr-2 text-xs text-gray-500">
                                        <div className="w-8 text-center">-</div>
                                        <div className="w-10 text-center">-</div>
                                        <div className="w-8 text-center">-</div>
                                        <div className="w-8 text-center">-</div>
                                        <div className="w-10 text-center">-</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
            
        </div>
    );
}
