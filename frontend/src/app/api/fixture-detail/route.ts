import { getFixtures, getFixtureEvents, getFixtureStatistics } from "@/thesportsdb/fixtures";
import { getEvent } from "@/thesportsdb/events";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return Response.json({ error: "No ID" }, { status: 400 });

    const [fixtureRes, eventsRes, statsRes, rawEventRes] = await Promise.allSettled([
        getFixtures({ id }, { cache: "no-store" }),
        getFixtureEvents({ fixture: id }, { cache: "no-store" }),
        getFixtureStatistics({ fixture: id }, { cache: "no-store" }),
        getEvent({ id }),
    ]);

    return Response.json({
        fixture:  fixtureRes.status  === "fulfilled" ? fixtureRes.value.response?.[0]              ?? null : null,
        events:   eventsRes.status   === "fulfilled" ? eventsRes.value.response                     ?? []   : [],
        statistics: statsRes.status  === "fulfilled" ? statsRes.value.response                      ?? []   : [],
        rawEvent: rawEventRes.status === "fulfilled" ? (rawEventRes.value as any)?.response?.[0]   ?? null : null,
    });
}
