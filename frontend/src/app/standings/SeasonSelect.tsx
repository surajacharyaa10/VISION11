"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

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

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("season", value);
        } else {
            params.delete("season");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const reversed = [...seasons].reverse();

    return (
        <select
            value={currentSeason}
            onChange={(e) => handleChange(e.target.value)}
            className="
                bg-[#151b2b]
                text-white
                px-5
                py-3
                rounded-xl
                outline-none
                border border-white/10
            "
        >
            {reversed.map((s) => (
                <option key={s.season_id} value={String(s.season_id)}>
                    {formatYear(s.year)}
                </option>
            ))}
        </select>
    );
}
