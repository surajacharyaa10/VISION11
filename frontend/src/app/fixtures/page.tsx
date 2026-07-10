export default function Fixtures() {

    const fixtures = [
        {
            league: "Premier League",
            date: "Today • 20:00",
            home: "Manchester United",
            away: "Liverpool",
            stadium: "Old Trafford",
            status: "Upcoming",
        },
        {
            league: "La Liga",
            date: "Tomorrow • 21:00",
            home: "Real Madrid",
            away: "Barcelona",
            stadium: "Santiago Bernabéu",
            status: "Upcoming",
        },
        {
            league: "Champions League",
            date: "25 July • 18:45",
            home: "Bayern Munich",
            away: "PSG",
            stadium: "Allianz Arena",
            status: "Scheduled",
        },
    ];


    return (
        <div className="min-h-screen bg-[#0b0f19] text-white p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-4xl font-bold">
                        Football Fixtures
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Upcoming matches, schedules and match details
                    </p>
                </div>


                <button className="
                    bg-green-500
                    hover:bg-green-600
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                ">
                    Filter Matches
                </button>

            </div>



            {/* League Tabs */}
            <div className="
                flex 
                gap-3 
                overflow-x-auto
                mb-8
            ">

                {[
                    "All",
                    "Premier League",
                    "La Liga",
                    "Champions League",
                    "Serie A"
                ].map((item, index) => (
                    <button
                        key={index}
                        className={`
                        px-5
                        py-2
                        rounded-full
                        whitespace-nowrap
                        ${index === 0
                                ? "bg-green-500 text-black"
                                : "bg-[#151b2b] text-gray-300"
                            }
                        `}
                    >
                        {item}
                    </button>
                ))}

            </div>



            {/* Fixture Cards */}

            <div className="space-y-5">

                {fixtures.map((match, index) => (

                    <div
                        key={index}
                        className="
                        bg-[#151b2b]
                        rounded-3xl
                        p-6
                        border
                        border-white/5
                        hover:border-green-500/40
                        transition
                        "
                    >

                        {/* League */}
                        <div className="
                            flex
                            justify-between
                            mb-5
                        ">

                            <span className="
                                text-green-400
                                font-semibold
                            ">
                                {match.league}
                            </span>


                            <span className="
                                text-gray-400
                                text-sm
                            ">
                                {match.date}
                            </span>

                        </div>



                        {/* Teams */}

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">


                            <div className="text-center">

                                <div className="
                                w-16
                                h-16
                                rounded-full
                                bg-red-600
                                flex
                                items-center
                                justify-center
                                text-xl
                                font-bold
                                mx-auto
                                ">
                                    {match.home[0]}
                                </div>

                                <p className="mt-3 font-semibold">
                                    {match.home}
                                </p>

                            </div>



                            <div className="text-center">

                                <p className="
                                text-gray-400
                                text-sm
                                ">
                                    VS
                                </p>

                                <button className="
                                mt-3
                                bg-green-500/20
                                text-green-400
                                px-4
                                py-2
                                rounded-full
                                text-sm
                                ">
                                    Match Centre
                                </button>

                            </div>



                            <div className="text-center">

                                <div className="
                                w-16
                                h-16
                                rounded-full
                                bg-blue-600
                                flex
                                items-center
                                justify-center
                                text-xl
                                font-bold
                                mx-auto
                                ">
                                    {match.away[0]}
                                </div>


                                <p className="mt-3 font-semibold">
                                    {match.away}
                                </p>

                            </div>


                        </div>




                        {/* Footer */}

                        <div className="
                            mt-6
                            bg-[#0b0f19]
                            rounded-2xl
                            p-4
                            flex
                            justify-between
                            items-center
                        ">

                            <div>

                                <p className="text-gray-400 text-sm">
                                    Stadium
                                </p>

                                <p className="font-semibold">
                                    🏟 {match.stadium}
                                </p>

                            </div>


                            <span className="
                            bg-yellow-500/20
                            text-yellow-400
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            ">
                                {match.status}
                            </span>

                        </div>


                    </div>

                ))}


            </div>


        </div>
    );
}