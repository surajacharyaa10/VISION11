"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ScoreBoard({ matchId }: { matchId: string }) {
    const [score, setScore] = useState<{ home: number; away: number; status: string } | null>(null);

    useEffect(() => {
        // 1. Fetch initial data
        const fetchInitial = async () => {
            const { data } = await supabase
                .from('scores')
                .select('home_score, away_score, status')
                .eq('match_id', matchId)
                .single();

            if (data) setScore({ home: data.home_score, away: data.away_score, status: data.status });
        };

        fetchInitial();

        // 2. Subscribe to real-time changes
        const channel = supabase
            .channel(`live-score-${matchId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'scores',
                    filter: `match_id=eq.${matchId}`,
                },
                (payload) => {
                    setScore({
                        home: payload.new.home_score,
                        away: payload.new.away_score,
                        status: payload.new.status,
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [matchId]);

    if (!score) return <div className="p-4 bg-gray-900 text-white rounded">Loading scores...</div>;

    return (
        <div className="flex justify-between items-center p-4 bg-gray-900 text-white rounded-lg mt-4">
            <div className="text-xl font-bold">HOME: {score.home}</div>
            <div className="text-red-500 font-mono animate-pulse">{score.status}</div>
            <div className="text-xl font-bold">AWAY: {score.away}</div>
        </div>
    );
}