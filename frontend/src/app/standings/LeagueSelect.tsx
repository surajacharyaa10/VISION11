"use client";

import { useRouter } from "next/navigation";

interface LeagueOption {
    id: number;
    name: string;
    theSportsDBId: number;
    category: string;
}

const GROUP_LABELS: Record<string, string> = {
    "international-country": "International (Country)",
    "international-club": "International (Club)",
    "league": "Domestic Leagues",
};

export default function LeagueSelect({
    current,
    leagues,
}: {
    current: number;
    leagues: LeagueOption[];
}) {
    const router = useRouter();

    const byCategory = Object.entries(
        leagues.reduce<Record<string, LeagueOption[]>>((acc, l) => {
            (acc[l.category] ??= []).push(l);
            return acc;
        }, {})
    )
        .map(([cat, items]) => ({
            cat,
            label: GROUP_LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "),
            items,
        }))
        .filter((g) => g.items.length > 0);

    return (
        <select
            value={String(current)}
            onChange={(e) => router.push(`/standings?league=${e.target.value}`)}
            className="
            bg-[#151b2b]
            text-white
            px-5
            py-3
            rounded-xl
            outline-none
            border border-white/10
            cursor-pointer
            "
        >
            {byCategory.map((g) => (
                <optgroup key={g.cat} label={g.label}>
                    {g.items.map((l) => (
                        <option key={l.id} value={String(l.theSportsDBId)}>
                            {l.name}
                        </option>
                    ))}
                </optgroup>
            ))}
        </select>
    );
}
