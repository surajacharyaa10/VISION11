import { filterLeague } from "@/api";
import { matchesType } from "@/types";
import React from "react";
import LeagueTable from "../components/LeagueTable";
import { Leagues } from "../components/Sidebar";

interface Params{
    league_href: string
}
const League = async({params}:{params:Params})=>{
    const leagueName = Leagues.find((l)=>{return l.href == params.league_href})!
    const getData = await filterLeague(leagueName.name)

    return (
    <div className="w-[600px]">
        {
            getData.map((data:matchesType)=>{
                return (
                <div key={data.id}>
                    <LeagueTable data={data}/>
                </div>
                )
            })
        }
    </div>
    )
}

export default League