import { getAllMatches } from "../../api-football/client";
import LiveStreamPlayer from "./LiveStreamPlayer";


export default async function LiveMatchPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;

    const matches = await getAllMatches();


    const match = matches.find(
        (m) => String(m.id) === String(id)
    );


    return (
        <div className="mx-auto max-w-4xl space-y-4 p-4">

            <h1 className="text-xl font-bold">
                {
                    match
                        ? `${match.home?.name ?? "Home"} vs ${match.away?.name ?? "Away"}`
                        : "Live match"
                }
            </h1>


            <LiveStreamPlayer matchId={id} />

        </div>
    );
}