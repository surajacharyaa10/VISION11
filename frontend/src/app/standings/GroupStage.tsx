"use client";

import React from "react";
import Link from "next/link";
import TeamLogo from "./TeamLogo";

interface StandingTeam {
    rank?: number;
    team?: {
        id?: number | string;
        name?: string;
        logo?: string;
    };
    all?: {
        played?: number;
        win?: number;
        draw?: number;
        lose?: number;
        goals?: {
            for: number;
            against: number;
        };
    };
    goalsDiff?: number;
    points?: number;
    form?: string | string[];
    group?: string;
    status?: string;
    qualification?: string;
}

interface GroupStageProps {
    teams: StandingTeam[];
    groupName: string;
    leagueId?: number;
}

function FormBadge({ result }: { result: string }) {
    const colorClass =
        result === "W"
            ? "bg-green-500"
            : result === "D"
                ? "bg-gray-500"
                : "bg-red-500";

    return (
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${colorClass}`}>
            {result}
        </span>
    );
}

const getQualificationColor = (qual: string | undefined) => {
    if (!qual) return 'transparent';
    switch (qual.toLowerCase()) {
        case 'champions league':
        case 'ucl':
        case 'champions league qualification':
            return '#00ff85';
        case 'europa league':
        case 'uel':
        case 'uefa europa league':
            return '#0066ff';
        case 'conference league':
        case 'uecl':
        case 'conference league qualification':
            return '#00ccff';
        case 'relegation':
            return '#ff3333';
        default:
            return 'transparent';
    }
};

export default function GroupStage({ teams, groupName, leagueId }: GroupStageProps) {
    const sortedTeams = [...teams].sort((a, b) => {
        const pointsA = a.points ?? 0;
        const pointsB = b.points ?? 0;
        if (pointsB !== pointsA) return pointsB - pointsA;
        const gdA = a.goalsDiff ?? (a.all?.goals?.for ?? 0) - (a.all?.goals?.against ?? 0);
        const gdB = b.goalsDiff ?? (b.all?.goals?.for ?? 0) - (b.all?.goals?.against ?? 0);
        return gdB - gdA;
    });

    return (
        <div className="bg-[#0d1117] rounded-xl border border-white/5 flex-1 min-w-[300px] overflow-hidden">
            {/* Group Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                    {groupName}
                </h3>
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Playoffs
                </span>
            </div>

            <div className="overflow-x-auto w-full">
                <div className="min-w-[600px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-gray-400 text-xs border-b border-white/10 uppercase tracking-wider">
                        <span className="col-span-1 text-center"></span>
                        <span className="col-span-5">Team</span>
                        <span className="text-center">P</span>
                        <span className="text-center">W</span>
                        <span className="text-center">D</span>
                        <span className="text-center">L</span>
                        <span className="text-center">GLS</span>
                        <span className="text-center">PTS</span>
                    </div>

                    {/* Teams */}
                    <div>
                        {sortedTeams.map((team, index) => {
                            const goalsFor = team.all?.goals?.for ?? 0;
                            const gd = team.goalsDiff ?? 0;
                            const form: string[] = team.form ? String(team.form).split("") : [];
                            const qualification = team.qualification || team.status;
                            const indicatorColor = getQualificationColor(qualification);

                            return (
                                <Link
                                    key={team.team?.id ?? index}
                                    href={`/standings/team/${team.team?.id}?league=${leagueId}`}
                                    className="contents"
                                >
                                    <div
                                        className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 border-b border-white/5 hover:bg-white/5 transition text-sm relative"
                                    >
                                        {indicatorColor !== 'transparent' && (
                                            <div
                                                className="absolute left-0 top-0 bottom-0 w-1"
                                                style={{ backgroundColor: indicatorColor }}
                                            />
                                        )}

                                        <div className="col-span-1 font-bold text-gray-300 text-center pl-2">
                                            {team.rank ?? index + 1}
                                        </div>

                                        <div className="col-span-5 flex items-center gap-2">
                                            <TeamLogo src={team.team?.logo} name={team.team?.name ?? "?"} />
                                            <span className="font-medium truncate text-xs md:text-sm">{team.team?.name}</span>
                                        </div>

                                        <div className="text-center text-gray-300">{team.all?.played ?? 0}</div>

                                        <div className="text-center text-green-400">{team.all?.win ?? 0}</div>

                                        <div className="text-center text-gray-300">{team.all?.draw ?? 0}</div>

                                        <div className="text-center text-red-400">{team.all?.lose ?? 0}</div>

                                        <div className="text-center font-medium text-gray-300">
                                            {goalsFor}
                                        </div>

                                        <div className="text-center font-bold text-white">
                                            {team.points ?? 0}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
