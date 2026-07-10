"use client";

import React, { useEffect, useState } from "react";
import LinkSide from "./LinkSide";
import { Leagues } from "@/data/leagues";


const LeagueImage = ({
    query,
    logo
}: {
    query: string,
    logo?: string
}) => {


    const [image, setImage] = useState<string>(logo ?? "");
    const [logoFailed, setLogoFailed] = useState<boolean>(!logo);


    const initials = query
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");


    useEffect(() => {


        if (!logoFailed || image) return;


        async function loadImage() {


            try {


                const res = await fetch(
                    `/api/imageapi?query=${encodeURIComponent(query)}`
                );


                const data = await res.json();


                if (data.image) {
                    setImage(data.image);
                }


            } catch (error) {


                console.log(error);


            }


        };


        loadImage();


    }, [query, logoFailed, image]);



    if (image) {
        return (
            <img
                src={image}

                alt={query}
                width={36}
                height={36}
                onError={() => {

                    if (!logoFailed) {

                        setLogoFailed(true);
                        setImage("");

                    }

                }}
                className="
                w-9
                h-9
                rounded-full
                object-contain
                bg-white/5
                p-1
                "
            />
        );
    }


    return (
        <div
            className="
            w-9
            h-9
            rounded-full
            bg-white/10
            text-white
            text-xs
            font-bold
            flex
            items-center
            justify-center
            "
            aria-hidden="true"
        >
            {initials}
        </div>
    );


};





const TABS = [
    {
        key: "league",
        label: "Leagues"
    },

    {
        key: "international-club",
        label: "International Club"
    },

    {
        key: "international-country",
        label: "International Country"
    },

    {
        key: "cup",
        label: "Cups"
    },

    {
        key: "friendly",
        label: "Friendlies"
    },

] as const;






const Sidebar = () => {


    const [activeTab, setActiveTab] =
        useState<string>("league");



    const filteredLeagues =
        Leagues.filter(
            (league) =>
                league.category === activeTab
        );



    return (

        <section
            className="
            w-full
            lg:w-[280px]
            xl:w-[300px]
            h-fit
            max-h-[calc(100vh-120px)]
            overflow-hidden

            px-4
            py-4

            bg-[rgb(40,40,58)]
            rounded-xl
            "
        >



            <h1
                className="
                font-bold
                text-xl
                mb-5
                text-teal-400
                "
            >
                Quick Links
            </h1>





            {/* CATEGORY FILTER */}

            <div
                className="
                flex
                flex-wrap
                gap-2
                mb-5
                "
            >


                {
                    TABS.map((tab) => (


                        <button

                            key={tab.key}

                            onClick={() =>
                                setActiveTab(tab.key)
                            }


                            className={`
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            transition

                            ${activeTab === tab.key

                                    ?

                                    "bg-emerald-500 text-white"

                                    :

                                    "bg-white/5 text-gray-300 hover:bg-white/10"

                                }

                            `}
                        >

                            {tab.label}

                        </button>


                    ))
                }


            </div>






            {/* LINKS */}


            <ul
                className="
                space-y-2

                overflow-y-auto
                max-h-[650px]

                pr-2

                scrollbar-thin
                scrollbar-thumb-white/20
                "
            >

                {/* LEAGUES */}


                {
                    filteredLeagues.map((league) => (


                        <li

                            key={league.id}

                            className="
                            flex
                            w-full
                            "

                        >


                            <LinkSide

                                href={`/${league.href}`}

                                name={league.name}


                                src={
                                    <LeagueImage
                                        logo={league.logo || undefined}
                                        query={league.imageQuery || league.name}
                                    />
                                }
                            />
                        </li>


                    ))
                }




            </ul>




        </section>

    );

};



export default Sidebar;