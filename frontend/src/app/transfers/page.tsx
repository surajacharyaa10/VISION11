export default function Transfer() {
    const transfers = [
        {
            player: "Kylian Mbappé",
            position: "Forward",
            from: "PSG",
            to: "Real Madrid",
            fee: "€180M",
            status: "Completed",
            image: "https://i.pravatar.cc/150?img=12",
        },
        {
            player: "Jude Bellingham",
            position: "Midfielder",
            from: "Dortmund",
            to: "Real Madrid",
            fee: "€103M",
            status: "Completed",
            image: "https://i.pravatar.cc/150?img=15",
        },
        {
            player: "Victor Osimhen",
            position: "Striker",
            from: "Napoli",
            to: "Chelsea",
            fee: "€90M",
            status: "Negotiating",
            image: "https://i.pravatar.cc/150?img=33",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">
                        Transfer Market
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Latest football transfers and rumors
                    </p>
                </div>

            </div>


            {/* Transfer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                <div className="bg-[#151b2b] rounded-2xl p-5">
                    <p className="text-gray-400">
                        Total Transfers
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                        1,248
                    </h2>
                </div>

                <div className="bg-[#151b2b] rounded-2xl p-5">
                    <p className="text-gray-400">
                        Money Spent
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                        €2.4B
                    </h2>
                </div>

                <div className="bg-[#151b2b] rounded-2xl p-5">
                    <p className="text-gray-400">
                        Active Rumors
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                        356
                    </h2>
                </div>

            </div>


            {/* Transfer List */}
            <div className="space-y-5">

                {transfers.map((transfer, index) => (
                    <div
                        key={index}
                        className="
                        bg-[#151b2b]
                        rounded-3xl
                        p-5
                        flex
                        flex-col
                        md:flex-row
                        items-center
                        justify-between
                        gap-5
                        border
                        border-white/5
                        hover:border-green-500/50
                        transition
                        "
                    >

                        {/* Player */}
                        <div className="flex items-center gap-4">

                            <img
                                src={transfer.image}
                                className="
                                w-20
                                h-20
                                rounded-full
                                object-cover
                                border-2
                                border-green-500
                                "
                            />

                            <div>
                                <h2 className="text-xl font-bold">
                                    {transfer.player}
                                </h2>

                                <p className="text-gray-400">
                                    {transfer.position}
                                </p>
                            </div>

                        </div>


                        {/* Clubs */}
                        <div className="flex items-center gap-4">

                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                                    {transfer.from[0]}
                                </div>
                                <p className="text-sm mt-1">
                                    {transfer.from}
                                </p>
                            </div>


                            <div className="text-green-400 text-2xl">
                                →
                            </div>


                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center font-bold">
                                    {transfer.to[0]}
                                </div>
                                <p className="text-sm mt-1">
                                    {transfer.to}
                                </p>
                            </div>

                        </div>


                        {/* Fee */}
                        <div>
                            <p className="text-gray-400 text-sm">
                                Transfer Fee
                            </p>
                            <h3 className="text-2xl font-bold text-green-400">
                                {transfer.fee}
                            </h3>
                        </div>


                        {/* Status */}
                        <span
                            className={`
                            px-4 py-2 rounded-full text-sm font-semibold
                            ${transfer.status === "Completed"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }
                            `}
                        >
                            {transfer.status}
                        </span>

                    </div>
                ))}

            </div>

        </div>
    );
}