import React from "react";
import Link from "next/link";


interface Props {

    href: string;
    name: string;
    src: React.ReactNode;

}



const LinkSide = ({
    href,
    name,
    src
}: Props) => {


    return (

        <Link

            href={href}

            className="
            flex 
            items-center 
            py-2 
            px-2 
            rounded-md 
            hover:bg-[rgb(54,63,78)]
            "

        >

            {src}


            <p className="ml-4 text-xs md:text-sm">

                {name}

            </p>


        </Link>

    );

};


export default LinkSide;