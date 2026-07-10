export default function Predictions() {

    const predictions = [
        {
            home: "Manchester City",
            away: "Arsenal",
            homeWin: 55,
            draw: 25,
            awayWin: 20,
            prediction: "Manchester City Win",
            confidence: "High",
            score: "2 - 1",
        },
        {
            home: "Real Madrid",
            away: "Barcelona",
            homeWin: 45,
            draw: 30,
            awayWin: 25,
            prediction: "Real Madrid Win",
            confidence: "Medium",
            score: "2 - 0",
        },
        {
            home: "Liverpool",
            away: "Chelsea",
            homeWin: 40,
            draw: 35,
            awayWin: 25,
            prediction: "Draw",
            confidence: "Medium",
            score: "1 - 1",
        },
    ];


    return (
        <div className="min-h-screen bg-[#0b0f19] text-white p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold">
                    AI Match Predictions
                </h1>

                <p className="text-gray-400 mt-2">
                    Smart football predictions powered by statistics and form analysis
                </p>
            </div>


            {/* Prediction Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                <div className="bg-[#151b2b] p-5 rounded-2xl">
                    <p className="text-gray-400">
                        Predictions Today
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                        42
                    </h2>
                </div>


                <div className="bg-[#151b2b] p-5 rounded-2xl">
                    <p className="text-gray-400">
                        AI Accuracy
                    </p>
                    <h2 className="text-3xl font-bold mt-2 text-green-400">
                        87%
                    </h2>
                </div>


                <div className="bg-[#151b2b] p-5 rounded-2xl">
                    <p className="text-gray-400">
                        Best Pick
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                        Home Win
                    </h2>
                </div>

            </div>



            {/* Matches */}
            <div className="space-y-6">

                {predictions.map((game, index) => (

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

                        {/* Teams */}
                        <div className="flex justify-between items-center">

                            <div className="text-center">
                                <div className="
                                w-16 h-16 
                                rounded-full 
                                bg-blue-600
                                flex 
                                items-center 
                                justify-center
                                text-xl
                                font-bold
                                mx-auto
                                ">
                                    {game.home[0]}
                                </div>

                                <p className="mt-2 font-semibold">
                                    {game.home}
                                </p>
                            </div>


                            <div className="text-center">

                                <span className="
                                text-gray-400
                                text-sm
                                ">
                                    Prediction
                                </span>

                                <h2 className="
                                text-3xl
                                font-bold
                                text-green-400
                                ">
                                    {game.score}
                                </h2>

                                <p className="text-sm">
                                    VS
                                </p>

                            </div>


                            <div className="text-center">

                                <div className="
                                w-16 h-16 
                                rounded-full 
                                bg-red-600
                                flex 
                                items-center 
                                justify-center
                                text-xl
                                font-bold
                                mx-auto
                                ">
                                    {game.away[0]}
                                </div>

                                <p className="mt-2 font-semibold">
                                    {game.away}
                                </p>

                            </div>

                        </div>



                        {/* Probability */}
                        <div className="mt-8">

                            <div className="flex justify-between text-sm mb-2">

                                <span>
                                    {game.homeWin}% Home
                                </span>

                                <span>
                                    {game.draw}% Draw
                                </span>

                                <span>
                                    {game.awayWin}% Away
                                </span>

                            </div>


                            <div className="h-3 bg-gray-700 rounded-full overflow-hidden flex">

                                <div
                                    className="bg-green-500"
                                    style={{
                                        width: `${game.homeWin}%`
                                    }}
                                />

                                <div
                                    className="bg-yellow-400"
                                    style={{
                                        width: `${game.draw}%`
                                    }}
                                />

                                <div
                                    className="bg-red-500"
                                    style={{
                                        width: `${game.awayWin}%`
                                    }}
                                />

                            </div>

                        </div>



                        {/* AI Result */}
                        <div className="
                        mt-6
                        flex
                        justify-between
                        items-center
                        bg-[#0b0f19]
                        p-4
                        rounded-2xl
                        ">

                            <div>
                                <p className="text-gray-400 text-sm">
                                    AI Prediction
                                </p>

                                <h3 className="font-bold text-lg">
                                    {game.prediction}
                                </h3>
                            </div>


                            <span className="
                            bg-green-500/20
                            text-green-400
                            px-4
                            py-2
                            rounded-full
                            ">
                                {game.confidence}
                            </span>

                        </div>


                    </div>

                ))}

            </div>


        </div>
    );
}