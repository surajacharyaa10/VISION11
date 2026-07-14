import React from "react";

interface H2HTabProps {
    h2h: any[];
}

export default function H2HTab({ h2h }: H2HTabProps) {
    if (!h2h || h2h.length === 0) {
        return <p className="text-xs text-gray-400 text-center py-4">No head-to-head matches</p>;
    }

    return (
        <div className="space-y-2">
            {h2h.map((match: any, idx: number) => {
                const home = match.teams?.home;
                const away = match.teams?.away;
                const date = match.fixture?.date
                    ? new Date(match.fixture.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "";
                return (
                    <div key={match.fixture?.id ?? idx} className="flex items-center justify-between bg-white/5 rounded-lg p-2.5 text-xs">
                        <span className="text-gray-400">{date}</span>
                        <div className="flex items-center gap-2 flex-1 justify-center">
                            <span className="text-white font-medium text-right w-24 truncate">{home?.name ?? ""}</span>
                            <span className="text-emerald-400 font-bold">
                                {match.goals?.home ?? 0} - {match.goals?.away ?? 0}
                            </span>
                            <span className="text-white font-medium text-left w-24 truncate">{away?.name ?? ""}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
