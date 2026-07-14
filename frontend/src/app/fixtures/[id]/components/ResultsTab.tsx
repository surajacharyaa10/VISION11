import React from "react";

interface ResultsTabProps {
    eventResults: any[];
}

export default function ResultsTab({ eventResults }: ResultsTabProps) {
    if (!eventResults || eventResults.length === 0) {
        return <p className="text-xs text-gray-400 text-center py-4">No results</p>;
    }

    return (
        <div className="space-y-2">
            {eventResults.map((r: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5 text-xs">
                    <span className="text-lg font-black text-emerald-400 w-4">{r.intPosition}</span>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{r.strPlayer}</p>
                        <p className="text-gray-400 text-[10px]">{r.idTeam ? `Team ${r.idTeam}` : ""}</p>
                    </div>
                    <span className="text-white font-bold">{r.intPoints ?? "0"}</span>
                </div>
            ))}
        </div>
    );
}
