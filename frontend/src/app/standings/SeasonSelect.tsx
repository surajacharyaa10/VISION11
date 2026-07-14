"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, CalendarDays } from "lucide-react";

interface Season {
    season_id: number;
    year: number | string;
}

function formatYear(year: number | string): string {
    const raw = String(year);
    if (raw.length === 8 && /^\d{8}$/.test(raw)) {
        return `${raw.slice(0, 4)}-${raw.slice(4)}`;
    }
    return raw;
}

export default function SeasonSelect({ seasons }: { seasons: Season[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSeason = searchParams.get("season") || "";
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const reversed = [...seasons].reverse();
    const current = reversed.find(s => String(s.season_id) === currentSeason) ?? reversed[0];

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function select(value: string) {
        setOpen(false);
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set("season", value);
        else params.delete("season");
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className={`
                    flex items-center gap-2 pl-3 pr-3 py-2.5 rounded-xl
                    border transition-all duration-200 text-sm font-semibold
                    ${open
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                    }
                `}
            >
                <CalendarDays className="w-4 h-4 text-neutral-400" />
                <span>{current ? formatYear(current.year) : "Season"}</span>
                <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-2xl border border-white/10 bg-[#0f1420]/98 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto py-1">
                        {reversed.map(s => {
                            const isActive = String(s.season_id) === currentSeason || (!currentSeason && s === reversed[0]);
                            return (
                                <button
                                    key={s.season_id}
                                    onClick={() => select(String(s.season_id))}
                                    className={`
                                        w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors
                                        ${isActive
                                            ? "bg-emerald-500/10 text-emerald-300"
                                            : "text-neutral-300 hover:bg-white/5 hover:text-white"
                                        }
                                    `}
                                >
                                    <span className="font-medium">{formatYear(s.year)}</span>
                                    {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
