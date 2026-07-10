import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query");


    if (!query) {
        return NextResponse.json(
            {
                error: "Missing query"
            },
            {
                status: 400
            }
        );
    }


    try {

        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
            {
                headers: {
                    Authorization: process.env.PEXELS_API_KEY || ""
                },
                cache: "no-store"
            }
        );


        if (!response.ok) {

            return NextResponse.json(
                {
                    error: "Pexels API failed"
                },
                {
                    status: response.status
                }
            );

        }


        const data = await response.json();


        return NextResponse.json({

            image:
                data.photos?.[0]?.src?.medium ??
                "/img/default-league.webp"

        });


    } catch (error) {

        console.log(error);


        return NextResponse.json(
            {
                error: "Server error"
            },
            {
                status: 500
            }
        );

    }

}