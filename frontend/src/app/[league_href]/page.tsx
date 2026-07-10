import { filterLeague } from "@/api";
import { matchesType } from "@/types";
import React from "react";
import LeagueTable from "../components/LeagueTable";
import { Leagues } from "@/data/leagues";
import { notFound } from "next/navigation";


interface Params {
    league_href: string;
}


const League = async ({ params }: { params: Params }) => {

    const leagueName = Leagues.find(
        (l) => l.href === params.league_href
    );


    if (!leagueName) {
        notFound();
    }


    const getData = await filterLeague(
        leagueName.name
    );


    return (
        <div className="w-[600px]">

            {
                getData.map((data: matchesType) => (
                    <LeagueTable
                        key={data.id}
                        data={data}
                    />
                ))
            }

        </div>
    );
};


export default League;