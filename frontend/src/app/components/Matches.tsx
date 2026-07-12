import React from "react";
import { matchesType } from "@/types";
import Image from 'next/image'


const Matches = ({data}:{data:matchesType})=>{
    const getDate = new Date(data?.utcDate).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})

    const isLive = data?.status === "IN_PLAY" || data?.status === "PAUSED";
    const isFinished = data?.status === "FINISHED";

    const statusLabel = isLive
        ? "LIVE"
        : isFinished
        ? "FT"
        : (data?.status || "Scheduled").toUpperCase();

    return (
        <div className="grid grid-cols-3 items-center">
            <div className="w-full flex items-center">
                <div className="w-[20px] h-[20px] relative mr-2">
                    <Image src = {data?.homeTeam?.crest!} alt={data?.homeTeam?.name!} fill
                    className='object-cover' />
                </div>
                <p className="text-sm">{data?.homeTeam?.name}</p>
            </div>
            <div className="px-2 m-auto flex flex-col items-center justify-center bg-slate-600 rounded-md">
                {isFinished ? (
                    <p className="py-1 text-teal-400 text-xs">{data?.score?.fullTime.home} : {data?.score?.fullTime?.away}</p>
                ): <p className="py-1 text-teal-400 text-xs">{getDate}</p>}
                <span className={`text-[10px] font-semibold leading-none ${isLive ? "text-red-400 animate-pulse" : "text-neutral-300"}`}>{statusLabel}</span>
            </div>
            <div className="w-full flex items-center justify-end">
                    <p className="text-sm text-right">{data?.awayTeam?.name}</p>
                    <div className="w-[20px] h-[20px] relative ml-2">
                        <Image src={data?.awayTeam?.crest!}
                        alt={data?.awayTeam?.name!} fill className="object-cover"/>
                    </div>
            </div>
        </div>
    )
}

export default Matches