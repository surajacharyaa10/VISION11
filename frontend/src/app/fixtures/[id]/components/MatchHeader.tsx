import React from "react";
import { MapPin, Calendar } from "lucide-react";

interface MatchHeaderProps {
    fixture: any;
    status: { label: string; color: string };
    leagueLogo: string;
    homeLogo: string;
    awayLogo: string;
    formattedDate: string;
}

export default function MatchHeader({
    fixture,
    status,
    leagueLogo,
    homeLogo,
    awayLogo,
    formattedDate,
}: MatchHeaderProps) {
    return (
        <div className="bg-[#0e1424] rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <img src={leagueLogo} alt={fixture.league.name} className="w-7 h-7 object-contain" />
                    <div>
                        <span className="text-white font-bold block text-sm md:text-base">{fixture.league.name}</span>
                    </div>
                </div>
                <span className={`${status.color} px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase`}>{status.label}</span>
            </div>

            <div className="grid grid-cols-3 items-center max-w-4xl mx-auto">
                <div className="text-center flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#141b30] border border-white/5 p-4 flex items-center justify-center shadow-inner hover:scale-105 transition duration-300">
                        <img src={homeLogo} alt={fixture.teams.home.name} className="w-full h-full object-contain" />
                    </div>
                    <p className="mt-4 font-bold text-base md:text-xl line-clamp-1">{fixture.teams.home.name}</p>
                </div>

                <div className="text-center">
                    {fixture.fixture.status.short === "NS" || fixture.fixture.status.short === "TBD" ? (
                        <div className="bg-[#141b30] px-4 py-2 rounded-xl inline-block border border-white/5">
                            <span className="text-xl md:text-2xl font-black text-amber-400 tracking-wider">VS</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center gap-4 md:gap-6 bg-[#141b30] px-6 py-3 rounded-2xl border border-white/5">
                                <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{fixture.goals.home ?? 0}</span>
                                <span className="text-slate-600 text-2xl font-light">:</span>
                                <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{fixture.goals.away ?? 0}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#141b30] border border-white/5 p-4 flex items-center justify-center shadow-inner hover:scale-105 transition duration-300">
                        <img src={awayLogo} alt={fixture.teams.away.name} className="w-full h-full object-contain" />
                    </div>
                    <p className="mt-4 font-bold text-base md:text-xl line-clamp-1">{fixture.teams.away.name}</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs md:text-sm text-slate-400">
                <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Venue</p>
                        <p className="font-semibold text-slate-200">{fixture.fixture.venue.name ?? "TBD"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Date</p>
                        <p className="font-semibold text-slate-200">{formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
