import { getPlayerDetail } from "@/thesportsdb";
import PlayerImage from "../PlayerImage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
    params: { id: string };
}

export default async function PlayerDetailPage({ params }: PageProps) {
    const id = params.id;

    let detail;
    let error: string | null = null;

    try {
        detail = await getPlayerDetail(id, { next: { revalidate: 3600 } });
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load player";
    }

    const profile = detail?.profile ?? null;

    if (!profile) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 text-white">
                <div className="max-w-xl mx-auto mt-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Player not found</h1>
                    <p className="text-gray-400">{error ?? "We couldn't load this player's profile."}</p>
                    <a href="/players" className="inline-block mt-6 text-blue-400 hover:text-blue-300">
                        ← Back to players
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 text-white">
            <a href="/players" className="inline-block mb-6 text-blue-400 hover:text-blue-300">
                ← Back to players
            </a>

            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="w-40 h-40 shrink-0 overflow-hidden rounded-3xl bg-slate-800">
                        <PlayerImage
                            photo={profile.photo}
                            name={profile.name}
                            query={`${profile.name} footballer`}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-bold">{profile.name}</h1>
                        <p className="text-gray-300 mt-1">{profile.club}</p>
                        <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start text-sm">
                            <span className="px-3 py-1 rounded-full bg-white/10">{profile.position}</span>
                            <span className="px-3 py-1 rounded-full bg-white/10">{profile.nationality}</span>
                            {profile.age > 0 && (
                                <span className="px-3 py-1 rounded-full bg-white/10">Age {profile.age}</span>
                            )}
                            {profile.status && (
                                <span className="px-3 py-1 rounded-full bg-white/10">{profile.status}</span>
                            )}
                            {profile.number && (
                                <span className="px-3 py-1 rounded-full bg-white/10">#{profile.number}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                    {profile.height && <span>📏 {profile.height}</span>}
                    {profile.weight && <span>⚖️ {profile.weight}</span>}
                    {profile.birthLocation && <span>📍 {profile.birthLocation}</span>}
                </div>

                {profile.socials && (
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        {profile.socials.instagram && (
                            <a href={`https://${profile.socials.instagram}`} target="_blank" rel="noreferrer" className="text-pink-400 hover:underline">Instagram</a>
                        )}
                        {profile.socials.twitter && (
                            <a href={`https://${profile.socials.twitter}`} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">Twitter</a>
                        )}
                        {profile.socials.facebook && (
                            <a href={`https://${profile.socials.facebook}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Facebook</a>
                        )}
                    </div>
                )}

                <p className="mt-8 text-gray-300 leading-relaxed whitespace-pre-line">{profile.bio}</p>

                {detail && detail.honours.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-2xl font-bold mb-4">Honours</h2>
                        <ul className="space-y-2">
                            {detail.honours.slice(0, 20).map((h: any, i: number) => (
                                <li
                                    key={i}
                                    className="flex justify-between bg-white/5 rounded-xl px-4 py-3"
                                >
                                    <span>{h.strHonour || "Honour"}</span>
                                    <span className="text-gray-400">
                                        {h.strSeason || h.intYear || ""}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {detail && detail.contracts.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-2xl font-bold mb-4">Transfers &amp; Contracts</h2>
                        <ul className="space-y-2">
                            {detail.contracts.slice(0, 30).map((c: any, i: number) => {
                                const from = c.strTeam || c.strFormerTeam || "";
                                const to = c.strTeam2 || c.strNewTeam || "";
                                const transfer = from && to ? `${from} → ${to}` : (from || to || "Team");
                                const period = `${c.strYearStart || ""}${c.strYearStart && c.strYearEnd ? " – " : ""}${c.strYearEnd || "present"}`;
                                return (
                                    <li
                                        key={i}
                                        className="flex flex-col sm:flex-row sm:justify-between gap-1 bg-white/5 rounded-xl px-4 py-3"
                                    >
                                        <span className="font-medium">{transfer}</span>
                                        <span className="text-gray-400">
                                            {period}
                                            {c.strPosition ? ` · ${c.strPosition}` : ""}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}

                {detail && detail.milestones.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-2xl font-bold mb-4">Milestones</h2>
                        <ul className="space-y-2">
                            {detail.milestones.slice(0, 20).map((m: any, i: number) => (
                                <li
                                    key={i}
                                    className="flex justify-between bg-white/5 rounded-xl px-4 py-3"
                                >
                                    <span>{m.strMilestone || "Milestone"}</span>
                                    <span className="text-gray-400">{m.intYear || ""}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

            </div>
        </main>
    );
}
