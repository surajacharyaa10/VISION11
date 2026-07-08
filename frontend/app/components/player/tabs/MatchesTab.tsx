"use client";

import React from 'react';

interface MatchesTabProps {
    playerDetails: any;
    stats: any[];
}

export default function MatchesTab({ playerDetails, stats }: MatchesTabProps) {
    // API-Sports /fixtures would be mapped here, but we don't have them in playerDetails yet
    return (
        <div className="flex flex-col text-sm text-gray-300 items-center justify-center py-16">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-400 font-semibold mb-2">No match data available</p>
            <p className="text-gray-500 text-xs">Recent fixtures and match logs have not been loaded from the API.</p>
        </div>
    );
}
