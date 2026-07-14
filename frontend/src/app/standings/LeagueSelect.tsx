"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface LeagueOption {
    id: number;
    name: string;
    theSportsDBId: number;
    category: string;
    logo?: string;
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
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const currentLeague = leagues.find(l => l.theSportsDBId === current);

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
        .filter(g => g.items.length > 0);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function select(id: number) {
        setOpen(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set("league", String(id));
        params.delete("season");
        router.push(`/standings?${params.toString()}`);
    }

    return (
        <div ref={ref} className="relative">
            {/* Trigger button */}
            <button
                onClick={() => setOpen(v => !v)}
                className={`
                    flex items-center gap-2.5 pl-3 pr-3 py-2.5 rounded-xl
                    border transition-all duration-200 text-sm font-semibold
                    ${open
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                    }
                `}
            >
                {currentLeague?.logo && (
                    <img
                        src={currentLeague.logo}
                        alt={currentLeague.name}
                        className="w-5 h-5 object-contain rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                )}
                <span className="max-w-[160px] truncate">{currentLeague?.name ?? "Select League"}</span>
                <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-white/10 bg-[#0f1420]/98 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
                    <div className="max-h-80 overflow-y-auto">
                        {byCategory.map((group, gi) => (
                            <div key={group.cat}>
                                {gi > 0 && <div className="h-px bg-white/5 mx-3" />}
                                <div className="px-3 py-2 sticky top-0 bg-[#0f1420]/95 backdrop-blur-sm">
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                        {group.label}
                                    </span>
                                </div>
                                {group.items.map(league => {
                                    const isActive = league.theSportsDBId === current;
                                    return (
                                        <button
                                            key={league.id}
                                            onClick={() => select(league.theSportsDBId)}
                                            className={`
                                                w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors
                                                ${isActive
                                                    ? "bg-emerald-500/10 text-emerald-300"
                                                    : "text-neutral-300 hover:bg-white/5 hover:text-white"
                                                }
                                            `}
                                        >
                                            {league.logo && (
                                                <img
                                                    src={league.logo}
                                                    alt={league.name}
                                                    className="w-5 h-5 object-contain flex-none rounded-sm"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                                />
                                            )}
                                            <span className="flex-1 truncate font-medium">{league.name}</span>
                                            {isActive && <Check className="w-3.5 h-3.5 text-emerald-400 flex-none" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
