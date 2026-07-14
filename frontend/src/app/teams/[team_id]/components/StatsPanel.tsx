import React from "react";
import NestedStatBlock from "./NestedStatBlock";

interface StatsPanelProps {
    fdStats: any;
}

export default function StatsPanel({ fdStats }: StatsPanelProps) {
    if (!fdStats) {
        return <p className="text-gray-400">No stats available.</p>;
    }

    const summary = fdStats.summary || {};
    const flatItems: { title: string; value: number | string }[] = [
        { title: "Matches", value: summary.matches_played ?? "-" },
        { title: "Wins", value: summary.wins ?? "-" },
        { title: "Draws", value: summary.draws ?? "-" },
        { title: "Losses", value: summary.losses ?? "-" },
        { title: "Goals For", value: summary.goals_for ?? "-" },
        { title: "Goals Against", value: summary.goals_against ?? "-" },
        { title: "Goal Difference", value: summary.goal_difference ?? "-" },
        { title: "Win %", value: summary.win_percentage ?? "-" },
        { title: "Draw %", value: summary.draw_percentage ?? "-" },
        { title: "Loss %", value: summary.loss_percentage ?? "-" },
        { title: "Points per Game", value: summary.points_per_game ?? "-" },
    ];

    const nestedBlocks: { title: string; data: any }[] = [];
    const maybeNest = (label: string, val: any) => {
        if (val && typeof val === "object") nestedBlocks.push({ title: label, data: val });
    };

    maybeNest("Home / Away", fdStats.home_away);
    maybeNest("Goals", fdStats.goals);
    maybeNest("Clean Sheets", fdStats.clean_sheets);
    maybeNest("Failed to Score", fdStats.failed_to_score);
    maybeNest("Both Teams to Score", fdStats.both_teams_to_score);
    maybeNest("Corners", fdStats.corners);
    maybeNest("Cards", fdStats.cards);
    maybeNest("Shots", fdStats.shots);
    maybeNest("xG", fdStats.xg);
    maybeNest("Possession", fdStats.possession);
    maybeNest("Fouls", fdStats.fouls);
    maybeNest("Goal Timing", fdStats.goal_timing);
    maybeNest("Form", fdStats.form);
    maybeNest("Set Pieces", fdStats.set_pieces);
    maybeNest("Offsides", fdStats.offsides);
    maybeNest("Goal Timing (Minutes)", fdStats.goal_timing_minutes);
    maybeNest("Correct Score", fdStats.correct_score);
    maybeNest("Special Markets", fdStats.special_markets);
    maybeNest("Penalties", fdStats.penalties);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {flatItems.map((item) => (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs text-gray-400 uppercase tracking-wider">{item.title}</div>
                        <div className="mt-1 text-2xl font-bold text-white">{typeof item.value === "number" ? Number(item.value).toLocaleString() : item.value}</div>
                    </div>
                ))}
            </div>

            {nestedBlocks.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nestedBlocks.map((block) => (
                        <NestedStatBlock key={block.title} label={block.title} data={block.data} />
                    ))}
                </div>
            )}
        </div>
    );
}
