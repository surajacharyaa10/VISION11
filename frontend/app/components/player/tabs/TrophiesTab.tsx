import React from 'react';

interface TrophiesTabProps {
    trophies: any[];
}

export default function TrophiesTab({ trophies }: TrophiesTabProps) {
    if (!trophies || trophies.length === 0) {
        return (
            <div className="p-10 flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-4">🏆</span>
                <p>No trophies data available for this player.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🏆</span> Career Trophies
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trophies.map((trophy, idx) => (
                    <div 
                        key={idx} 
                        className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                    >
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center shrink-0 border border-amber-100">
                            {trophy.place === 'Winner' ? (
                                <span className="text-2xl" title="Winner">🥇</span>
                            ) : (
                                <span className="text-2xl" title="Runner-up">🥈</span>
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{trophy.league}</h4>
                            <p className="text-sm text-gray-500">{trophy.country}</p>
                            <div className="mt-2 inline-block px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-700 rounded-md">
                                {trophy.season}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
