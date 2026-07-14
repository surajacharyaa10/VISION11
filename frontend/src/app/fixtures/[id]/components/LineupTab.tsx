import React from "react";

interface LineupTabProps {
    lineups: any[];
}

export default function LineupTab({ lineups }: LineupTabProps) {
    if (!lineups || lineups.length === 0) {
        return <p className="text-xs text-gray-400 text-center py-4">No lineup available</p>;
    }

    return (
        <div className="space-y-3">
            {lineups.map((lu: any, idx: number) => (
                <div key={idx} className="bg-white/5 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{lu.team?.name}</span>
                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{lu.formation}</span>
                    </div>
                    {lu.startXI && lu.startXI.length > 0 && (
                        <div className="space-y-1">
                            {lu.startXI.map((p: any) => (
                                <div key={p.player?.id} className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500 w-4 text-right">{p.player?.number}</span>
                                    <span className="text-white truncate">{p.player?.name}</span>
                                    {p.player?.pos && <span className="text-[10px] text-gray-400 bg-white/5 px-1 rounded">{p.player.pos}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                    {lu.substitutes && lu.substitutes.length > 0 && (
                        <div className="space-y-1 mt-2 border-t border-white/5 pt-2">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Substitutes</span>
                            {lu.substitutes.map((p: any) => (
                                <div key={p.player?.id} className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500 w-4 text-right">{p.player?.number}</span>
                                    <span className="text-white truncate">{p.player?.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
