import React from "react";
import { MapPin, Calendar } from "lucide-react";

interface MatchHeaderProps {
    fixture: any;
    status: { label: string; color: string } | null;
    leagueLogo: string;
    homeLogo: string;
    awayLogo: string;
    formattedDate: string;
    rawEvent?: any;
    listFallback?: {
        home: string | null; homeLogo: string | null;
        away: string | null; awayLogo: string | null;
        league: string | null; leagueLogo: string | null;
        date: string | null; venue: string | null;
        homeGoals: number | null; awayGoals: number | null;
        status: string | null;
    } | null;
}

function TeamInitials({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
    return (
        <span className="text-lg font-black text-slate-400 tracking-widest">{initials}</span>
    );
}

export default function MatchHeader({
    fixture,
    status,
    leagueLogo,
    homeLogo,
    awayLogo,
    formattedDate,
    rawEvent,
    listFallback,
}: MatchHeaderProps) {
    // Priority: fixture > listFallback > rawEvent > defaults
    const leagueName = fixture?.league?.name ?? listFallback?.league ?? rawEvent?.strLeague ?? "Match";
    const homeName   = fixture?.teams?.home?.name ?? listFallback?.home ?? rawEvent?.strHomeTeam ?? "Home";
    const awayName   = fixture?.teams?.away?.name ?? listFallback?.away ?? rawEvent?.strAwayTeam ?? "Away";
    const venueName  = fixture?.fixture?.venue?.name ?? listFallback?.venue ?? rawEvent?.strVenue ?? "TBD";
    const dateLabel  = formattedDate || listFallback?.date || (rawEvent?.dateEvent
        ? new Date(rawEvent.dateEvent).toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric", year: "numeric",
          })
        : "TBD");
    // Logos: fixture logos > passed homeLogo/awayLogo (already merged with listFallback in parent) 
    const resolvedHomeLogo = homeLogo || listFallback?.homeLogo || "";
    const resolvedAwayLogo = awayLogo || listFallback?.awayLogo || "";
    const resolvedLeagueLogo = leagueLogo || listFallback?.leagueLogo || "";

    // Score fallback from listFallback when fixture has no goals
    const homeGoals = fixture?.goals?.home ?? listFallback?.homeGoals;
    const awayGoals = fixture?.goals?.away ?? listFallback?.awayGoals;

    const isUpcoming = !fixture || fixture.fixture.status.short === "NS" || fixture.fixture.status.short === "TBD";
    const hasScore = homeGoals !== null && homeGoals !== undefined && !isUpcoming;
    const statusBadge = status ?? { label: "Upcoming", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" };

    return (
        <div className="bg-[#0e1424] rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* League row */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    {resolvedLeagueLogo ? (
                        <img
                            src={resolvedLeagueLogo}
                            alt={leagueName}
                            className="w-7 h-7 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : null}
                    <span className="text-white font-bold block text-sm md:text-base">{leagueName}</span>
                </div>
                <span className={`${statusBadge.color} px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase`}>
                    {statusBadge.label}
                </span>
            </div>

            {/* Teams + Score */}
            <div className="grid grid-cols-3 items-center max-w-4xl mx-auto">
                {/* Home */}
                <div className="text-center flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#141b30] border border-white/5 p-4 flex items-center justify-center shadow-inner hover:scale-105 transition duration-300">
                        {resolvedHomeLogo
                            ? <img src={resolvedHomeLogo} alt={homeName} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            : <TeamInitials name={homeName} />
                        }
                    </div>
                    <p className="mt-4 font-bold text-base md:text-xl line-clamp-1">{homeName}</p>
                </div>

                {/* VS / Score */}
                <div className="text-center">
                    {hasScore ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center gap-4 md:gap-6 bg-[#141b30] px-6 py-3 rounded-2xl border border-white/5">
                                <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{homeGoals}</span>
                                <span className="text-slate-600 text-2xl font-light">:</span>
                                <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{awayGoals}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#141b30] px-4 py-2 rounded-xl inline-block border border-white/5">
                            <span className="text-xl md:text-2xl font-black text-amber-400 tracking-wider">VS</span>
                        </div>
                    )}
                </div>

                {/* Away */}
                <div className="text-center flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#141b30] border border-white/5 p-4 flex items-center justify-center shadow-inner hover:scale-105 transition duration-300">
                        {resolvedAwayLogo
                            ? <img src={resolvedAwayLogo} alt={awayName} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            : <TeamInitials name={awayName} />
                        }
                    </div>
                    <p className="mt-4 font-bold text-base md:text-xl line-clamp-1">{awayName}</p>
                </div>
            </div>

            {/* Venue + Date */}
            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs md:text-sm text-slate-400">
                <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Venue</p>
                        <p className="font-semibold text-slate-200">{venueName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Date</p>
                        <p className="font-semibold text-slate-200">{dateLabel}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

