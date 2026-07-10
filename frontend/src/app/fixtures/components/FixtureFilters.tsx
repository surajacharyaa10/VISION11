"use client";

import { useState } from "react";
import Link from "next/link";
import type { Fixture } from "@/thesportsdb/fixtures";
import { Leagues } from "@/data/leagues";


function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatFixtureDate(dateStr: string) {
  const date = new Date(dateStr);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const time = `${hours}:${minutes}`;

  if (date.toDateString() === today.toDateString()) {
    return `Today • ${time}`;
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow • ${time}`;
  }

  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const day = date.getUTCDate();

  return `${month} ${day} • ${time}`;
}



function getStatusBadge(fixture: Fixture) {

    const short = fixture.fixture.status.short;
    const elapsed = fixture.fixture.status.elapsed;


    if (["NS", "TBD"].includes(short)) {
        return {
            label: "Upcoming",
            color: "bg-yellow-500/20 text-yellow-400",
        };
    }


    if (["FT", "AET", "PEN"].includes(short)) {
        return {
            label: "Full Time",
            color: "bg-gray-500/20 text-gray-400",
        };
    }


    if (["1H", "2H", "ET", "BT", "LIVE"].includes(short)) {
        return {
            label: elapsed ? `${short} ${elapsed}'` : short,
            color: "bg-green-500/20 text-green-400",
        };
    }


    if (short === "HT") {
        return {
            label: "Half Time",
            color: "bg-blue-500/20 text-blue-400",
        };
    }


    return {
        label: fixture.fixture.status.long,
        color: "bg-red-500/20 text-red-400",
    };
}



export default function FixtureFilters({
    fixtures
}: {
    fixtures: Fixture[]
}) {


    // Dynamic league ordering
    const leagues = [
        "All",

        ...Array.from(
            new Map(
                fixtures.map(f => [
                    f.league.id,
                    f.league
                ])
            ).values()
        )
            .sort((a, b) => {


                const aLive = fixtures.some(
                    f =>
                        f.league.id === a.id &&
                        [
                            "1H",
                            "2H",
                            "ET",
                            "BT",
                            "LIVE"
                        ].includes(
                            f.fixture.status.short
                        )
                );


                const bLive = fixtures.some(
                    f =>
                        f.league.id === b.id &&
                        [
                            "1H",
                            "2H",
                            "ET",
                            "BT",
                            "LIVE"
                        ].includes(
                            f.fixture.status.short
                        )
                );


                if (aLive && !bLive) return -1;
                if (!aLive && bLive) return 1;


                const aCount = fixtures.filter(
                    f => f.league.id === a.id
                ).length;


                const bCount = fixtures.filter(
                    f => f.league.id === b.id
                ).length;


                return bCount - aCount;

            })
            .map(
                league => league.name
            )
    ];



    const [league, setLeague] = useState("All");

    const [liveOnly, setLiveOnly] = useState(false);



    const filtered = fixtures.filter(match => {


        const leagueMatch =
            league === "All" ||
            match.league.name === league;



        const liveStatuses = [
            "1H",
            "2H",
            "ET",
            "BT",
            "LIVE"
        ];


        const liveMatch =
            !liveOnly ||
            liveStatuses.includes(
                match.fixture.status.short
            );


        return leagueMatch && liveMatch;

    });




    return (
        <>

            {/* FILTER DROPDOWN */}

            <div className="
            max-w-4xl mx-auto mb-8
            flex gap-3
            ">


                <select
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    className="
                    flex-1
                    bg-[#151b2b]
                    text-white
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-white/10
                    outline-none
                    text-sm
                    "
                >

                    {
                        leagues.map(item => (

                            <option
                                key={item}
                                value={item}
                                className="bg-[#151b2b]"
                            >
                                {item}
                            </option>

                        ))
                    }

                </select>



                <button
                    onClick={() => setLiveOnly(!liveOnly)}
                    className={`
                    px-5
                    rounded-xl
                    text-sm
                    font-semibold

                    ${liveOnly
                            ?
                            "bg-red-500 text-white"
                            :
                            "bg-[#151b2b] text-gray-300"
                        }

                    `}
                >
                    Live
                </button>


            </div>





            {/* FIXTURE LIST */}


            <div className="
            max-w-4xl
            mx-auto
            space-y-4
            ">


                {
                    filtered.length === 0 ? (

                        <div className="
                    text-center
                    py-20
                    text-gray-400
                    ">
                            No matches found
                        </div>

                    ) : (


                            filtered.map(match => {

                                const league = Leagues.find((l) => l.theSportsDBId === match.league.id);
                                const status =
                                    getStatusBadge(match);


                                const leagueLogo =
                                    league?.logo ||
                                    match.league.logo ||
                                    "https://via.placeholder.com/32?text=?";

                                const homeLogo =
                                    match.teams.home.logo ||
                                    "https://via.placeholder.com/64?text=?";

                                const awayLogo =
                                    match.teams.away.logo ||
                                    "https://via.placeholder.com/64?text=?";



                            return (

                                <Link
                                    href={`/fixtures/${match.fixture.id}`}
                                    key={match.fixture.id}
                                    className="
            bg-[#151b2b]
            rounded-2xl
            p-5
            border border-white/5
            hover:border-green-500/40
            transition
            block
            "
                                >


                                    <div className="
                        flex
                        justify-between
                        items-center
                        border-b
                        border-white/5
                        pb-3
                        mb-4
                        ">


                                        <div className="
                            flex gap-2 items-center
                            ">

                                            <img
                                                src={leagueLogo}
                                                className="
                                    w-5 h-5 object-contain
                                    "
                                            />

                                            <span className="
                                text-green-400
                                text-sm
                                ">
                                                {match.league.name}
                                            </span>

                                        </div>



                                        <span className="
                            text-gray-400
                            text-xs
                            ">
                                            {formatFixtureDate(
                                                match.fixture.date
                                            )}
                                        </span>


                                    </div>





                                    <div className="
                        grid grid-cols-3
                        items-center
                        ">


                                        <Team
                                            name={match.teams.home.name}
                                            logo={homeLogo}
                                        />



                                        <div className="
                            text-center
                            text-2xl
                            font-bold
                            ">

                                            {
                                                ["NS", "TBD"]
                                                    .includes(
                                                        match.fixture.status.short
                                                    )
                                                    ?
                                                    "VS"
                                                    :
                                                    `${match.goals.home ?? 0} - ${match.goals.away ?? 0
                                                    }`
                                            }

                                        </div>



                                        <Team
                                            name={match.teams.away.name}
                                            logo={awayLogo}
                                        />


                                    </div>




                                    <div className="
                        mt-5
                        bg-[#0b0f19]
                        rounded-xl
                        p-3
                        flex
                        justify-between
                        items-center
                        ">


                                        <span className="
                            text-gray-300
                            text-sm
                            ">
                                            🏟 {match.fixture.venue.name ?? "TBD"}
                                        </span>



                                        <span className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            ${status.color}
                            `}>
                                            {status.label}
                                        </span>


                                    </div>


                                </Link>

                            );

                        })

                    )
                }


            </div>


        </>
    );
}




function Team({
    name,
    logo
}: {
    name: string;
    logo: string;
}) {


    return (

        <div className="
        flex
        flex-col
        items-center
        text-center
        ">


            <div className="
            w-14
            h-14
            bg-[#0b0f19]
            rounded-full
            p-2
            ">

                <img
                    src={logo}
                    className="
                    w-full
                    h-full
                    object-contain
                    "
                />

            </div>


            <p className="
            mt-2
            text-sm
            truncate
            max-w-[120px]
            ">
                {name}
            </p>


        </div>

    );

}