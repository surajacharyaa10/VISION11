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

type StandingRow = {
    intRank: string;
    strTeam: string;
    strBadge: string;
    strForm: string;
    intPlayed: string;
    intWin: string;
    intDraw: string;
    intLoss: string;
    intGoalsFor: string;
    intGoalsAgainst: string;
    intGoalDifference: string;
    intPoints: string;
    strGroup: string;
};

interface StandingsTabProps {
    league: League;
    standings: StandingRow[];
}

export default function StandingsTab({ league, standings }: StandingsTabProps) {
    if (!standings || standings.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                <p className="text-xl">No standings found</p>
            </div>
        );
    }

    const groupedStandings = new Map<string, StandingRow[]>();
    for (const row of standings) {
        const group = row.strGroup && row.strGroup.trim() ? row.strGroup : "League";
        if (!groupedStandings.has(group)) groupedStandings.set(group, []);
        groupedStandings.get(group)!.push(row);
    }

    return (
        <div className="space-y-6">
            {Array.from(groupedStandings.entries()).map(([group, rows]) => (
                <div key={group} className="bg-[#0d1117] rounded-xl border border-white/5 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                        <h3 className="text-base font-bold text-white">{group}</h3>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm min-w-[650px]">
                            <thead>
                                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                    <th className="py-2 px-3 text-center w-12">#</th>
                                    <th className="py-2 px-3 text-left">Team</th>
                                    <th className="py-2 px-3 text-center">MP</th>
                                    <th className="py-2 px-3 text-center">W</th>
                                    <th className="py-2 px-3 text-center">D</th>
                                    <th className="py-2 px-3 text-center">L</th>
                                    <th className="py-2 px-3 text-center">GF</th>
                                    <th className="py-2 px-3 text-center">GA</th>
                                    <th className="py-2 px-3 text-center">GD</th>
                                    <th className="py-2 px-3 text-center font-bold">Pts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => {
                                    const rank = Number(row.intRank) || idx + 1;
                                    const gd = Number(row.intGoalDifference) || 0;
                                    return (
                                        <tr key={row.strTeam} className="border-b border-white/5 hover:bg-white/5 transition">
                                            <td className="py-2.5 px-3 text-center text-gray-300 font-medium">{rank}</td>
                                            <td className="py-2.5 px-3">
                                                <div className="flex items-center gap-2">
                                                    {row.strBadge && (
                                                        <img src={row.strBadge} alt={row.strTeam} className="w-5 h-5 object-contain" />
                                                    )}
                                                    <span className="font-medium truncate">{row.strTeam}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3 text-center text-gray-300">{Number(row.intPlayed) || 0}</td>
                                            <td className="py-2.5 px-3 text-center text-green-400">{Number(row.intWin) || 0}</td>
                                            <td className="py-2.5 px-3 text-center text-gray-300">{Number(row.intDraw) || 0}</td>
                                            <td className="py-2.5 px-3 text-center text-red-400">{Number(row.intLoss) || 0}</td>
                                            <td className="py-2.5 px-3 text-center text-gray-300">{Number(row.intGoalsFor) || 0}</td>
                                            <td className="py-2.5 px-3 text-center text-gray-300">{Number(row.intGoalsAgainst) || 0}</td>
                                            <td className={`py-2.5 px-3 text-center font-medium ${gd > 0 ? "text-green-400" : gd < 0 ? "text-red-400" : "text-gray-300"}`}>
                                                {gd > 0 ? `+${gd}` : gd}
                                            </td>
                                            <td className="py-2.5 px-3 text-center font-bold text-white">{Number(row.intPoints) || 0}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}
