import React from "react";

interface TimelineTabProps {
    events: any[];
}

export default function TimelineTab({ events }: TimelineTabProps) {
    if (!events || events.length === 0) {
        return <p className="text-xs text-gray-400 text-center py-4">No timeline events</p>;
    }

    return (
        <div className="space-y-2">
            {events.map((ev: any, idx: number) => {
                const icon =
                    ev.type === "Goal"
                        ? "⚽"
                        : ev.type === "Card"
                        ? ev.detail?.toLowerCase().includes("yellow")
                            ? "🟨"
                            : "🟥"
                        : ev.type === "Subst"
                        ? "🔄"
                        : "ℹ️";
                return (
                    <div key={idx} className="flex items-start gap-2 bg-white/5 rounded-lg p-2.5 text-xs">
                        <span className="text-base leading-none mt-0.5">{icon}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium truncate">{ev.player?.name}</span>
                                <span className="text-[10px] text-gray-400 ml-2 shrink-0">{ev.time.elapsed}'</span>
                            </div>
                            <span className="text-gray-400 text-[10px]">
                                {ev.team?.name} • {ev.detail}
                            </span>
                            {ev.assist?.name && (
                                <span className="text-gray-500 text-[10px] block mt-0.5">Assist: {ev.assist.name}</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
