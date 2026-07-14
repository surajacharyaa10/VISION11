import React from "react";
import { MapPin } from "lucide-react";

interface OverviewTabProps {
    rawEvent: any;
    venueInfo: any;
    listFallback?: any;
}

function formatDateFull(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export default function OverviewTab({ rawEvent, venueInfo, listFallback }: OverviewTabProps) {
    // If no backend event data exists, try to show fallback data gracefully
    if (!rawEvent) {
        if (listFallback?.venue || listFallback?.date) {
            return (
                <div className="space-y-4">
                    {listFallback.venue && (
                        <div className="bg-white/5 rounded-xl p-4">
                            <span className="text-gray-400 text-xs block mb-1">Venue</span>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <span className="text-white font-medium">{listFallback.venue}</span>
                            </div>
                        </div>
                    )}
                    {listFallback.date && (
                        <div className="bg-white/5 rounded-xl p-4">
                            <span className="text-gray-400 text-xs block mb-1">Date</span>
                            <span className="text-white font-medium">
                                {formatDateFull(listFallback.date)}
                            </span>
                        </div>
                    )}
                </div>
            );
        }
        return <p className="text-xs text-gray-400 text-center py-4">No overview details available</p>;
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/5 rounded-lg p-2.5">
                    <span className="text-gray-400 block mb-1">Date</span>
                    <span className="text-white font-medium">
                        {new Date(rawEvent.dateEvent).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5">
                    <span className="text-gray-400 block mb-1">Season</span>
                    <span className="text-white font-medium">{rawEvent.strSeason ?? "N/A"}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5">
                    <span className="text-gray-400 block mb-1">Time</span>
                    <span className="text-white font-medium">
                        {rawEvent.strTime
                            ? new Date(rawEvent.strTime).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                              })
                            : "TBD"}
                    </span>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5">
                    <span className="text-gray-400 block mb-1">Round</span>
                    <span className="text-white font-medium">
                        {rawEvent.intRound ? `Round ${rawEvent.intRound}` : "N/A"}
                    </span>
                </div>
            </div>

            {venueInfo && (
                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                        <MapPin className="w-3.5 h-3.5" />
                        Venue
                    </div>
                    <p className="text-white text-sm font-medium">{venueInfo.strVenue}</p>
                    <p className="text-xs text-gray-400">{venueInfo.strLocation}</p>
                    {venueInfo.intCapacity && (
                        <p className="text-xs text-gray-400">Capacity: {Number(venueInfo.intCapacity).toLocaleString()}</p>
                    )}
                </div>
            )}

            {rawEvent.strDescriptionEN && (
                <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-300 leading-relaxed">{rawEvent.strDescriptionEN}</p>
                </div>
            )}

            {rawEvent.strVideo && (
                <div>
                    <span className="text-xs text-gray-400">Watch video</span>
                    <a
                        href={rawEvent.strVideo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-400 hover:underline block mt-1"
                    >
                        {rawEvent.strVideo}
                    </a>
                </div>
            )}
        </div>
    );
}
