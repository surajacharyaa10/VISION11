import React from "react";

interface TVTabProps {
    tvData: any[];
}

export default function TVTab({ tvData }: TVTabProps) {
    if (!tvData || tvData.length === 0) {
        return <p className="text-xs text-gray-400 text-center py-4">No broadcast info</p>;
    }

    return (
        <div className="space-y-2">
            {tvData.map((tv: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    {tv.strLogo && <img src={tv.strLogo} alt={tv.strChannel} className="w-8 h-8 object-contain rounded" />}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{tv.strChannel}</p>
                        <p className="text-[10px] text-gray-400">{tv.strCountry}</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">{tv.strTime}</span>
                </div>
            ))}
        </div>
    );
}
