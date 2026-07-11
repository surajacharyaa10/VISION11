import { getLeague, getLeagueTable } from "@/thesportsdb/leagues";
import { getEventsNextLeague, getEventsPastLeague } from "@/thesportsdb/events";
import { Leagues } from "@/data/leagues";
import { notFound } from "next/navigation";
import LeagueTabs from "./LeagueTabs";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ league_href: string }>;
}

function formatEventDate(dateStr: string | null | undefined, timeStr: string | null | undefined): string {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let time = "";
    if (timeStr) {
        const parts = timeStr.split(":");
        const hours = parts[0] || "00";
        const minutes = parts[1] || "00";
        const parsed = new Date();
        parsed.setHours(Number(hours), Number(minutes), 0, 0);
        time = parsed.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    if (isToday) return time ? `Today • ${time}` : "Today";
    if (isTomorrow) return time ? `Tomorrow • ${time}` : "Tomorrow";

    const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });

    return time ? `${formatted} • ${time}` : formatted;
}

function getStatusBadge(status: string | null | undefined): { label: string; color: string } {
    const s = (status || "").toUpperCase();
    if (s === "NS" || s === "TBD") return { label: "Upcoming", color: "bg-yellow-500/20 text-yellow-400" };
    if (s === "FT" || s === "AET" || s === "PEN") return { label: "Full Time", color: "bg-gray-500/20 text-gray-400" };
    if (["1H", "2H", "ET", "BT", "LIVE"].includes(s)) return { label: s, color: "bg-green-500/20 text-green-400" };
    if (s === "HT") return { label: "Half Time", color: "bg-blue-500/20 text-blue-400" };
    if (["PST", "CANC", "ABD", "AWD", "WO", "SUSP", "INT"].includes(s)) return { label: s, color: "bg-red-500/20 text-red-400" };
    return { label: s || "Unknown", color: "bg-gray-500/20 text-gray-400" };
}

export default async function LeaguePage({ params }: PageProps) {
    const { league_href } = await params;
    const league = Leagues.find((l) => l.href === league_href);

    if (!league) {
        notFound();
    }

    const leagueId = league.theSportsDBId || league.apiFootballId;
    const leagueIdStr = String(leagueId);

    let leagueInfo: any = null;
    let standings: any[] = [];
    let upcomingEvents: any[] = [];
    let pastEvents: any[] = [];
    let errors: string[] = [];

    try {
        const leagueRes = await getLeague({ id: leagueId });
        const leagueArr = Array.isArray((leagueRes as any)?.response) ? (leagueRes as any).response : [];
        leagueInfo = leagueArr[0] || null;
    } catch (e) {
        errors.push(e instanceof Error ? e.message : "Failed to load league info");
    }

    try {
        const tableRes = await getLeagueTable({ l: leagueId });
        const tableArr = Array.isArray((tableRes as any)?.response) ? (tableRes as any).response : [];
        standings = tableArr;
    } catch (e) {
        errors.push(e instanceof Error ? e.message : "Failed to load standings");
    }

    try {
        const [nextRes, pastRes] = await Promise.all([
            getEventsNextLeague({ id: leagueIdStr }),
            getEventsPastLeague({ id: leagueIdStr }),
        ]);
        upcomingEvents = Array.isArray((nextRes as any)?.response) ? (nextRes as any).response : [];
        pastEvents = Array.isArray((pastRes as any)?.response) ? (pastRes as any).response : [];
    } catch (e) {
        errors.push(e instanceof Error ? e.message : "Failed to load fixtures");
    }

    const events = [...upcomingEvents, ...pastEvents].sort((a, b) => {
        const dateA = a.dateEvent || a.strTimestamp || "";
        const dateB = b.dateEvent || b.strTimestamp || "";
        return dateB.localeCompare(dateA);
    });

    return (
        <LeagueTabs
            league={league}
            leagueInfo={leagueInfo}
            standings={standings}
            events={events}
            errors={errors}
        />
    );
}
