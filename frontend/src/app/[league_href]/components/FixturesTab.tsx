import React from "react";
import Link from "next/link";

type Event = {
    idEvent: string;
    strEvent: string;
    strHomeTeam: string;
    strAwayTeam: string;
    strHomeTeamBadge: string;
    strAwayTeamBadge: string;
    dateEvent: string;
    strTime: string;
    strStatus: string;
    intHomeScore: string | null;
    intAwayScore: string | null;
    strLeague: string;
    strLeagueBadge: string;
    strVenue: string;
    strSeason: string;
    strRound: string;
    intRound: string;
};

interface FixturesTabProps {
    events: Event[];
}

function pad(value: number): string {
    return String(value).padStart(2, "0");
}

function formatEventDate(dateStr: string | null | undefined, timeStr: string | null | undefined): string {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let time = "";
    if (timeStr) {
        const parts = timeStr.split(":");
        const hours = parts[0] || "00";
        const minutes = parts[1] || "00";
        const parsed = new Date();
        parsed.setHours(Number(hours), Number(minutes), 0, 0);
        time = parsed.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    if (isToday) return time ? `Today • ${time}` : "Today";
    if (isTomorrow) return time ? `Tomorrow • ${time}` : "Tomorrow";

    const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });

    return time ? `${formatted} • ${time}` : formatted;
}

function getStatusBadge(status: string | null | undefined): { label: string; color: string } {
    const s = (status || "").toUpperCase();
    if (s === "NS" || s === "TBD") return { label: "Upcoming", color: "bg-yellow-500/20 text-yellow-400" };
    if (s === "FT" || s === "AET" || s === "PEN") return { label: "Full Time", color: "bg-gray-500/20 text-gray-400" };
    if (["1H", "2H", "ET", "BT", "LIVE"].includes(s)) return { label: s, color: "bg-green-500/20 text-green-400" };
    if (s === "HT") return { label: "Half Time", color: "bg-blue-500/20 text-blue-400" };
    if (["PST", "CANC", "ABD", "AWD", "WO", "SUSP", "INT"].includes(s)) return { label: s, color: "bg-red-500/20 text-red-400" };
    return { label: s || "Unknown", color: "bg-gray-500/20 text-gray-400" };
}

export default function FixturesTab({ events }: FixturesTabProps) {
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                <p className="text-xl">No matches found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {events.map((ev) => {
                const status = getStatusBadge(ev.strStatus);
                const isUpcoming = ["NS", "TBD"].includes((ev.strStatus || "").toUpperCase());
                const homeScore = ev.intHomeScore !== null && ev.intHomeScore !== undefined ? Number(ev.intHomeScore) : null;
                const awayScore = ev.intAwayScore !== null && ev.intAwayScore !== undefined ? Number(ev.intAwayScore) : null;

                return (
                    <Link href={`/fixtures/${ev.idEvent}`} key={ev.idEvent} className="block">
                        <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5 hover:border-emerald-500/30 transition cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400 text-xs">{formatEventDate(ev.dateEvent, ev.strTime)}</span>
                                <span className={`${status.color} px-3 py-1 rounded-full text-xs font-semibold`}>{status.label}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    {ev.strHomeTeamBadge && (
                                        <img src={ev.strHomeTeamBadge} alt={ev.strHomeTeam} className="w-10 h-10 object-contain" />
                                    )}
                                    <span className="font-medium text-sm truncate">{ev.strHomeTeam}</span>
                                </div>
                                {isUpcoming ? (
                                    <span className="text-gray-500 font-bold mx-4">VS</span>
                                ) : (
                                    <div className="flex items-center gap-2 mx-4">
                                        <span className="text-2xl font-bold text-white">{homeScore ?? "-"}</span>
                                        <span className="text-gray-500 font-bold">-</span>
                                        <span className="text-2xl font-bold text-white">{awayScore ?? "-"}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 flex-1 justify-end">
                                    <span className="font-medium text-sm truncate">{ev.strAwayTeam}</span>
                                    {ev.strAwayTeamBadge && (
                                        <img src={ev.strAwayTeamBadge} alt={ev.strAwayTeam} className="w-10 h-10 object-contain" />
                                    )}
                                </div>
                            </div>
                            {ev.strVenue && (
                                <p className="text-gray-500 text-xs mt-3 text-left">🏟 {ev.strVenue}</p>
                            )}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
