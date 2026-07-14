import React from "react";

type League = {
    id: number;
    name: string;
    category: string;
    href: string;
    imageQuery: string;
    apiFootballId: number;
    theSportsDBId: number;
    footballDataId: number | undefined;
    logo: string;
};

type LeagueInfo = {
    idLeague: string;
    strLeague: string;
    strSport: string;
    strLeagueAlternate: string;
    intFormedYear: string;
    dateFirstEvent: string;
    strGender: string;
    strCountry: string;
    strWebsite: string;
    strFacebook: string;
    strInstagram: string;
    strTwitter: string;
    strYoutube: string;
    strDescriptionEN: string;
    strFanart1: string;
    strFanart2: string;
    strFanart3: string;
    strFanart4: string;
    strBanner: string;
    strBadge: string;
    strLogo: string;
    strTrophy: string;
    strCurrentSeason?: string;
} | null;

interface OverviewTabProps {
    league: League;
    leagueInfo: LeagueInfo;
}

export default function OverviewTab({ league, leagueInfo }: OverviewTabProps) {
    return (
        <div className="space-y-6">
            {leagueInfo?.strBanner && (
                <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden">
                    <img
                        src={leagueInfo.strBanner}
                        alt={league.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {leagueInfo?.strDescriptionEN && (
                <div className="bg-[#0d1117] rounded-xl border border-white/5 p-6">
                    <h2 className="text-lg font-bold text-white mb-3">About</h2>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {leagueInfo.strDescriptionEN}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Country", value: leagueInfo?.strCountry },
                    { label: "Founded", value: leagueInfo?.intFormedYear },
                    { label: "Gender", value: leagueInfo?.strGender },
                    { label: "Sport", value: leagueInfo?.strSport },
                ].map((item) => (
                    <div key={item.label} className="bg-[#0d1117] rounded-xl border border-white/5 p-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-white font-semibold text-sm">{item.value || "-"}</p>
                    </div>
                ))}
            </div>

            {(leagueInfo?.strWebsite || leagueInfo?.strFacebook || leagueInfo?.strTwitter || leagueInfo?.strInstagram || leagueInfo?.strYoutube) && (
                <div className="bg-[#0d1117] rounded-xl border border-white/5 p-6">
                    <h2 className="text-lg font-bold text-white mb-3">Links</h2>
                    <div className="flex flex-wrap gap-3">
                        {leagueInfo.strWebsite && (
                            <a href={leagueInfo.strWebsite.startsWith("http") ? leagueInfo.strWebsite : `https://${leagueInfo.strWebsite}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                Website
                            </a>
                        )}
                        {leagueInfo.strFacebook && (
                            <a href={`https://${leagueInfo.strFacebook}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                Facebook
                            </a>
                        )}
                        {leagueInfo.strTwitter && (
                            <a href={`https://${leagueInfo.strTwitter}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                Twitter
                            </a>
                        )}
                        {leagueInfo.strInstagram && (
                            <a href={`https://${leagueInfo.strInstagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                Instagram
                            </a>
                        )}
                        {leagueInfo.strYoutube && (
                            <a href={`https://${leagueInfo.strYoutube}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">
                                YouTube
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
