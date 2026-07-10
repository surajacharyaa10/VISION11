export default function Standing() {

    const teams = [
        {
            pos: 1,
            team: "Manchester City",
            played: 24,
            win: 19,
            draw: 3,
            loss: 2,
            gd: "+42",
            points: 60,
            form: ["W", "W", "W", "D", "W"]
        },
        {
            pos: 2,
            team: "Arsenal",
            played: 24,
            win: 17,
            draw: 5,
            loss: 2,
            gd: "+35",
            points: 56,
            form: ["W", "W", "D", "W", "W"]
        },
        {
            pos: 3,
            team: "Liverpool",
            played: 24,
            win: 16,
            draw: 4,
            loss: 4,
            gd: "+28",
            points: 52,
            form: ["W", "L", "W", "W", "D"]
        },
        {
            pos: 4,
            team: "Chelsea",
            played: 24,
            win: 14,
            draw: 4,
            loss: 6,
            gd: "+18",
            points: 46,
            form: ["W", "D", "W", "L", "W"]
        }
    ];


    return (

        <main className="
            min-h-screen
            bg-[#070b14]
            text-white
            p-6
        ">


            {/* Header */}

            <div className="
                flex
                flex-col
                md:flex-row
                justify-between
                gap-5
                mb-8
            ">

                <div>

                    <h1 className="
                        text-4xl
                        font-black
                    ">
                        League Standings 🏆
                    </h1>

                    <p className="
                        text-gray-400
                        mt-2
                    ">
                        Live football rankings powered by Vision11 AI
                    </p>

                </div>



                <select className="
                    bg-[#151b2b]
                    px-5
                    py-3
                    rounded-xl
                    outline-none
                ">

                    <option>
                        Premier League
                    </option>

                    <option>
                        La Liga
                    </option>

                    <option>
                        Champions League
                    </option>

                    <option>
                        Serie A
                    </option>

                </select>


            </div>





            {/* Table */}

            <div className="
                bg-[#111827]
                rounded-3xl
                overflow-hidden
                border
                border-white/5
            ">


                {/* Desktop Header */}

                <div className="
                    hidden
                    md:grid
                    grid-cols-12
                    px-6
                    py-4
                    text-gray-400
                    text-sm
                    border-b
                    border-white/10
                ">

                    <span className="col-span-1">
                        #
                    </span>

                    <span className="col-span-4">
                        Club
                    </span>

                    <span>
                        MP
                    </span>

                    <span>
                        W
                    </span>

                    <span>
                        D
                    </span>

                    <span>
                        L
                    </span>

                    <span>
                        GD
                    </span>

                    <span>
                        PTS
                    </span>

                    <span className="col-span-2">
                        Form
                    </span>


                </div>





                {
                    teams.map((team, index) => (

                        <div
                            key={index}
                            className="
                            grid
                            grid-cols-1
                            md:grid-cols-12
                            gap-4
                            items-center
                            px-6
                            py-5
                            border-b
                            border-white/5
                            hover:bg-white/5
                            transition
                        "
                        >


                            {/* Position */}

                            <div className="
                                font-bold
                                text-green-400
                            ">
                                {team.pos}
                            </div>



                            {/* Club */}

                            <div className="
                                md:col-span-4
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-full
                                    bg-blue-600
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                ">
                                    {team.team[0]}
                                </div>


                                <div>

                                    <h3 className="font-bold">
                                        {team.team}
                                    </h3>

                                    <p className="
                                    text-xs
                                    text-gray-400
                                    ">
                                        AI Rating 8.7
                                    </p>

                                </div>


                            </div>




                            <span>
                                {team.played}
                            </span>

                            <span className="text-green-400">
                                {team.win}
                            </span>

                            <span>
                                {team.draw}
                            </span>

                            <span className="text-red-400">
                                {team.loss}
                            </span>


                            <span>
                                {team.gd}
                            </span>



                            <span className="
                                text-xl
                                font-black
                            ">
                                {team.points}
                            </span>





                            {/* Form */}

                            <div className="
                                flex
                                gap-2
                                col-span-2
                            ">

                                {
                                    team.form.map((f, i) => (

                                        <span
                                            key={i}
                                            className={`
                                            w-7
                                            h-7
                                            rounded-full
                                            flex
                                            items-center
                                            justify-center
                                            text-xs
                                            font-bold
                                            ${f === "W"
                                                    ?
                                                    "bg-green-500/20 text-green-400"
                                                    :
                                                    f === "D"
                                                        ?
                                                        "bg-yellow-500/20 text-yellow-400"
                                                        :
                                                        "bg-red-500/20 text-red-400"
                                                }
                                        `}
                                        >
                                            {f}
                                        </span>

                                    ))
                                }

                            </div>



                        </div>

                    ))
                }



            </div>



        </main>

    );
}