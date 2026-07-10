"use client";


import React, { useEffect, useState } from "react";
import LinkSide from "./LinkSide";
import { Leagues } from "@/data/leagues";


const LeagueImage = ({
    query
}: {
    query: string
}) => {


    const [image, setImage] = useState<string>("");


    useEffect(() => {


        async function loadImage() {

            try {

                const res = await fetch(
                    `/api/imageapi?query=${encodeURIComponent(query)}`
                );


                const data = await res.json();


                setImage(data.image);


            } catch (error) {

                console.log(error);

            }

        }


        loadImage();


    }, [query]);



    return (

        <img
            src={
                image ||
                "/img/default-league.webp"
            }
            alt={query}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
        />

    );

};




const Sidebar = () => {


    return (

        <section className="px-2 md:px-4 py-2 bg-[rgb(40,40,58)] rounded-md">


            <h1 className="font-bold text-xl mb-4 text-teal-400">
                Leagues
            </h1>


            <ul className="space-y-2">


                {
                    Leagues.map((league) => (

                        <li
                            key={league.id}
                            className="flex"
                        >

                            <LinkSide

                                href={`/${league.href}`}

                                name={league.name}

                                src={
                                    <LeagueImage
                                        query={league.imageQuery}
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