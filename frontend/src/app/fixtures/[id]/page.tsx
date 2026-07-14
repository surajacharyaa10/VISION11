import { getFixtures, getFixtureEvents, getFixtureStatistics, getFixtureLineups, getFixturePlayers, getHeadToHead } from "@/thesportsdb/fixtures";
import { getEvent, getEventTV, getEventResults } from "@/thesportsdb/events";
import { getVenue } from "@/thesportsdb/venues";
import { searchFootballdataMatches, getFootballdataMatchDetail, getFootballdataMatchEvents, getFootballdataMatchStats } from "@/thesportsdb/footballdata";
import FixtureDetailClient from "./FixtureDetailClient";

export const dynamic = "force-dynamic";

function mapFootballdataToFixture(m: any): any {
  return {
    fixture: {
      id: Number(m.match_id),
      date: m.match_date || new Date().toISOString(),
      timestamp: Number(m.date_unix) || Date.now(),
      venue: { name: m.venue?.stadium_name || null },
      status: {
        short: m.status === "finished" ? "FT" : m.status === "inprogress" ? "LIVE" : "NS",
        long: m.status_localized || m.status || "Not Started",
        elapsed: null,
      },
    },
    league: {
      id: Number(m.league?.league_id || 0),
      name: m.league?.name || "League",
      logo: "",
    },
    teams: {
      home: { id: Number(m.home_team?.team_id || 0), name: m.home_team?.team_name || "Home", logo: m.home_team?.team_logo || "" },
      away: { id: Number(m.away_team?.team_id || 0), name: m.away_team?.team_name || "Away", logo: m.away_team?.team_logo || "" },
    },
    goals: { home: Number(m.score?.home ?? 0), away: Number(m.score?.away ?? 0) },
    score: {
      halftime: { home: Number(m.score?.halftime?.home ?? 0), away: Number(m.score?.halftime?.away ?? 0) },
      fulltime: { home: Number(m.score?.home ?? 0), away: Number(m.score?.away ?? 0) },
      extratime: null,
      penalty: null,
    },
  };
}

function mapFootballdataEvent(ev: any) {
  return {
    time: { elapsed: Number(ev.time?.elapsed || 0), extra: ev.time?.extra || null },
    team: { id: Number(ev.team?.team_id || 0), name: ev.team?.team_name || "", logo: "" },
    player: { id: Number(ev.player?.player_id || 0), name: ev.player?.player_name || "" },
    assist: ev.assist ? { id: Number(ev.assist?.player_id || 0), name: ev.assist?.player_name || "" } : null,
    type: ev.type === "goal" ? "Goal" : ev.type === "card" ? "Card" : ev.type === "subst" ? "Subst" : ev.type || "Info",
    detail: ev.detail || "",
    comments: ev.comment || null,
  };
}

function mapFootballdataStat(stat: any) {
  return { type: stat.type || stat.name || "Stat", value: Number(stat.value) || 0 };
}

export default async function FixtureDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const fixtureId = Number(id);

    let fixture: any = null;
    let rawEvent: any = null;
    let events: any[] = [];
    let statistics: any[] = [];
    let lineups: any[] = [];
    let players: any[] = [];
    let h2h: any[] = [];
    let venue: any[] = [];
    let tvData: any[] = [];
    let eventResults: any[] = [];
    let error: string | null = null;
    let source = "thesportsdb";

    try {
        const fixtureRes = await getFixtures({ id: fixtureId }, { next: { revalidate: 60 } }).catch((e: any) => ({ response: [] }));
        fixture = fixtureRes.response?.[0] ?? null;

        if (fixture) {
            const [eventsRes, statsRes, lineupsRes, playersRes, h2hRes, rawEventRes, tvRes, resultsRes] = await Promise.all([
                getFixtureEvents({ fixture: fixtureId }, { next: { revalidate: 60 } }).catch(() => ({ response: [] })),
                getFixtureStatistics({ fixture: fixtureId }, { next: { revalidate: 60 } }).catch(() => ({ response: [] })),
                getFixtureLineups({ fixture: fixtureId }, { next: { revalidate: 60 } }).catch(() => ({ response: [] })),
                getFixturePlayers({ fixture: fixtureId }, { next: { revalidate: 60 } }).catch(() => ({ response: [] })),
                getHeadToHead({ h2h: `${fixture.teams.home.id}-${fixture.teams.away.id}` }, { next: { revalidate: 3600 } }).catch(() => ({ response: [] })),
                getEvent({ id: fixtureId }).catch(() => ({ response: [] })),
                getEventTV({ id: fixtureId }).catch(() => ({ response: [] })),
                getEventResults({ id: fixtureId }).catch(() => ({ response: [] })),
            ]);

            events = eventsRes.response ?? [];
            statistics = statsRes.response ?? [];
            lineups = lineupsRes.response ?? [];
            players = playersRes.response ?? [];
            h2h = h2hRes.response ?? [];
            rawEvent = (rawEventRes as any)?.response?.[0] ?? null;
            if (rawEvent?.idVenue) {
                const venueRes = await getVenue({ id: rawEvent.idVenue }).catch(() => ({ response: [] }));
                venue = Array.isArray(venueRes.response) ? venueRes.response : venueRes.response ? [venueRes.response] : [];
            }
            tvData = tvRes.response ?? [];
            eventResults = resultsRes.response ?? [];
        }
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load fixture details";
    }

    if (!fixture) {
        try {
            const fdMatch = await searchFootballdataMatches({ fixture: { id: fixtureId, date: new Date().toISOString() }, teams: { home: { name: "" }, away: { name: "" } }, league: { id: 0 } });
            if (fdMatch) {
                source = "footballdata";
                fixture = mapFootballdataToFixture(fdMatch);

                const [fdDetail, fdEvents, fdStats] = await Promise.all([
                    getFootballdataMatchDetail(fdMatch.match_id),
                    getFootballdataMatchEvents(fdMatch.match_id),
                    getFootballdataMatchStats(fdMatch.match_id),
                ]);

                if (fdDetail) {
                    rawEvent = {
                        strVenue: fdDetail.venue?.stadium_name || "",
                        strLocation: fdDetail.venue?.stadium_location || "",
                        strCountry: fdDetail.league?.name || "",
                        strSeason: (fdDetail as any).season?.year || "",
                        dateEvent: fdDetail.match_date || "",
                        strTime: "",
                        strDescriptionEN: "",
                    };
                    venue = rawEvent.strVenue ? [rawEvent] : [];
                }

                events = fdEvents.map(mapFootballdataEvent);
                statistics = [{
                    team: { id: fdMatch.home_team?.team_id || 0, name: fdMatch.home_team?.team_name || "Home", logo: fdMatch.home_team?.team_logo || "" },
                    statistics: fdStats.map(mapFootballdataStat),
                }, {
                    team: { id: fdMatch.away_team?.team_id || 0, name: fdMatch.away_team?.team_name || "Away", logo: fdMatch.away_team?.team_logo || "" },
                    statistics: fdStats.length ? fdStats.map(mapFootballdataStat) : [],
                }];

                lineups = [];
                h2h = [];
                tvData = [];
                eventResults = [];
                error = null;
            }
        } catch (e) {
            error = error || (e instanceof Error ? e.message : "Failed to load fixture details");
        }
    }

    return (
        <FixtureDetailClient
            fixture={fixture}
            rawEvent={rawEvent}
            h2h={h2h}
            lineups={lineups}
            statistics={statistics}
            events={events}
            tvData={tvData}
            eventResults={eventResults}
            venue={venue}
            error={error}
        />
    );
}
