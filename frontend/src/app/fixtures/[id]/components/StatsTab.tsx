import React from "react";

interface StatsTabProps {
    statistics: any[];
}

export default function StatsTab({ statistics }: StatsTabProps) {
    if (!Array.isArray(statistics) || statistics.length < 2) {
        return <p className="text-xs text-gray-400 text-center py-4">No statistics available</p>;
    }

    const homeStats = statistics[0].statistics ?? [];
    const awayStats = statistics[1].statistics ?? [];
    const homeName = statistics[0]?.team?.name ?? "Home";
    const awayName = statistics[1]?.team?.name ?? "Away";
    const homeLogo = statistics[0]?.team?.logo ?? "";
    const awayLogo = statistics[1]?.team?.logo ?? "";

    return (
        <div className="space-y-4">
            {/* Team name header */}
            <div className="flex items-center justify-between px-1 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {homeLogo && (
                        <img src={homeLogo} alt={homeName} className="w-5 h-5 object-contain shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                    <span className="text-xs font-bold text-emerald-400 truncate">{homeName}</span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest px-2 shrink-0">vs</span>
                <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                    <span className="text-xs font-bold text-blue-400 truncate text-right">{awayName}</span>
                    {awayLogo && (
                        <img src={awayLogo} alt={awayName} className="w-5 h-5 object-contain shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                </div>
            </div>

            {/* Stat rows */}
            <div className="space-y-3">
                {homeStats.map((stat: any, idx: number) => {
                    const away = awayStats[idx];
                    const homeVal = Number(stat.value) || 0;
                    const awayVal = Number(away?.value) || 0;
                    const max = Math.max(homeVal, awayVal, 1);
                    return (
                        <div key={stat.type ?? idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs px-1">
                                <span className="text-white font-semibold w-8 text-left">{homeVal}</span>
                                <span className="text-gray-400 text-[10px] uppercase tracking-wider flex-1 text-center">{stat.type}</span>
                                <span className="text-white font-semibold w-8 text-right">{awayVal}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Home bar — fills right-to-left */}
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex justify-end">
                                    <div
                                        className="bg-emerald-500/80 h-full rounded-full"
                                        style={{ width: `${Math.min(100, (homeVal / max) * 100)}%` }}
                                    />
                                </div>
                                {/* Away bar */}
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-blue-500/80 h-full rounded-full"
                                        style={{ width: `${Math.min(100, (awayVal / max) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
