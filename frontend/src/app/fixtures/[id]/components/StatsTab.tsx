import React from "react";

interface StatsTabProps {
    statistics: any[];
}

export default function StatsTab({ statistics }: StatsTabProps) {
    if (!statistics || statistics.length < 2) {
        return <p className="text-xs text-gray-400 text-center py-4">No statistics available</p>;
    }

    const homeStats = statistics[0].statistics ?? [];
    const awayStats = statistics[1].statistics ?? [];
    const homeName = statistics[0]?.team?.name ?? "Home";
    const awayName = statistics[1]?.team?.name ?? "Away";

    return (
        <div className="space-y-3">
            {homeStats.map((stat: any, idx: number) => {
                const away = awayStats[idx];
                const homeVal = Number(stat.value) || 0;
                const awayVal = Number(away?.value) || 0;
                const max = Math.max(homeVal, awayVal, 1);
                return (
                    <div key={stat.type ?? idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-white font-medium w-24 truncate">{homeName}</span>
                            <span className="text-gray-400 text-[10px] uppercase tracking-wider">{stat.type}</span>
                            <span className="text-white font-medium w-24 text-right truncate">{awayName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white font-bold w-8 text-right">{homeVal}</span>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                                <div
                                    className="bg-emerald-500/80 h-full rounded-full"
                                    style={{ width: `${Math.min(100, (homeVal / max) * 100)}%` }}
                                />
                            </div>
                            <span className="text-xs text-white font-bold w-8">{awayVal}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
