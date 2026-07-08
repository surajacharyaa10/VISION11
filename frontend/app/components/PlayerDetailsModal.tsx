"use client";

import { useState } from 'react';
import PlayerSidebar from './player/PlayerSidebar';
import MatchesTab from './player/tabs/MatchesTab';
import SeasonTab from './player/tabs/SeasonTab';
import CareerTab from './player/tabs/CareerTab';
import FantasyTab from './player/tabs/FantasyTab';
import MediaTab from './player/tabs/MediaTab';
import TransfersTab from './player/tabs/TransfersTab';
import TrophiesTab from './player/tabs/TrophiesTab';

type TabName = 'Matches' | 'Season' | 'Career' | 'Fantasy' | 'Media' | 'Transfers' | 'Trophies';

interface PlayerDetailsModalProps {
    selectedPlayer: any;
    playerDetails: any;
    teamMatches: any[];
    upcomingMatches: any[];
    detailsLoading: boolean;
    onClose: () => void;
}

export default function PlayerDetailsModal({
    selectedPlayer,
    playerDetails,
    teamMatches,
    upcomingMatches,
    detailsLoading,
    onClose,
}: PlayerDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<TabName>('Matches');

    if (!selectedPlayer) return null;

    const TABS: TabName[] = ['Matches', 'Season', 'Career', 'Fantasy', 'Media', 'Transfers', 'Trophies'];

    const player = playerDetails?.player;

    const renderTab = () => {
        if (!player) return null;
        switch (activeTab) {
            case 'Transfers': return <TransfersTab transfers={playerDetails.transfers || []} />;
            case 'Trophies': return <TrophiesTab trophies={playerDetails.trophies || []} />;
            case 'Matches': return <MatchesTab playerDetails={player} stats={playerDetails.stats || []} />;
            case 'Season': return <SeasonTab playerDetails={player} stats={playerDetails.stats || []} />;
            case 'Fantasy': return <FantasyTab playerDetails={player} stats={playerDetails.stats || []} />;
            case 'Media': return <MediaTab playerDetails={player} />;
            default: return <CareerTab playerDetails={player} career={playerDetails.career || []} />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 font-sans text-gray-200">
            <div className="bg-[#0a0a0c] border border-white/10 rounded-none md:rounded-2xl shadow-2xl w-full max-w-[1400px] h-full md:max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col relative custom-scrollbar">

                {/* ─── Close button ─────────────────────────────────── */}
                <button
                    onClick={onClose}
                    aria-label="Close player details"
                    className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-50 border border-white/10 text-xl"
                >
                    ✕
                </button>

                {/* ─── Loading state ────────────────────────────────── */}
                {detailsLoading ? (
                    <div className="p-16 flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-400 font-semibold">Loading player data…</p>
                    </div>

                ) : player ? (
                    <div className="flex flex-col h-full min-h-max">

                        {/* Two-column layout */}
                        <div className="flex flex-col lg:flex-row p-4 md:p-8 gap-8">

                            {/* LEFT COLUMN: Sidebar (Player Value, Charts, Positions) */}
                            <PlayerSidebar playerDetails={playerDetails} />

                            {/* RIGHT COLUMN: Header Info + Tabs */}
                            <div className="flex-1 flex flex-col min-w-0 gap-6">

                                {/* ─── TABS HEADER ─── */}
                                <div className="border-b border-white/10 flex overflow-x-auto custom-scrollbar pt-2">
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`
                                                px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2
                                                ${activeTab === tab
                                                    ? 'border-blue-600 text-blue-500 bg-blue-600/5'
                                                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* ─── TAB CONTENT ─── */}
                                <div className="flex flex-col flex-1 min-h-[400px]">
                                    {renderTab()}
                                </div>

                            </div>
                        </div>
                    </div>
                ) : playerDetails?.error || !player ? (
                    <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                        <p className="text-4xl mb-3">⚠️</p>
                        <p className="text-red-500 font-semibold">{playerDetails?.error ? "API Rate Limit Exceeded" : "Failed to load player details."}</p>
                        <p className="text-gray-500 text-sm mt-1">{playerDetails?.error ? "The free tier limit for API-Sports has been reached for today." : "The API may be unavailable. Try again."}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
