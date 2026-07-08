import React from 'react';

interface TransfersTabProps {
    transfers: any[];
}

export default function TransfersTab({ transfers }: TransfersTabProps) {
    if (!transfers || transfers.length === 0) {
        return (
            <div className="p-10 flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-4">✈️</span>
                <p>No transfer data available for this player.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>✈️</span> Transfer History
            </h3>
            
            <div className="relative border-l-2 border-gray-100 ml-4 pl-6 space-y-8">
                {transfers.map((transfer, idx) => (
                    <div key={idx} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-[33px] top-1.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-sm z-10" />
                        
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                                    {transfer.date || 'Unknown Date'}
                                </span>
                                {transfer.type && (
                                    <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 text-xs font-bold rounded-full">
                                        {transfer.type}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                                {/* From Team */}
                                <div className="flex-1 flex flex-col items-center sm:items-end text-center sm:text-right w-full">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">From</span>
                                    {transfer.teams?.out?.name ? (
                                        <div className="flex flex-col items-center sm:items-end">
                                            {transfer.teams.out.logo && (
                                                <img src={transfer.teams.out.logo} alt={transfer.teams.out.name} className="w-12 h-12 object-contain mb-2" />
                                            )}
                                            <span className="font-semibold text-gray-800">{transfer.teams.out.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Unknown</span>
                                    )}
                                </div>

                                {/* Arrow */}
                                <div className="shrink-0 text-gray-300 flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>

                                {/* To Team */}
                                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">To</span>
                                    {transfer.teams?.in?.name ? (
                                        <div className="flex flex-col items-center sm:items-start">
                                            {transfer.teams.in.logo && (
                                                <img src={transfer.teams.in.logo} alt={transfer.teams.in.name} className="w-12 h-12 object-contain mb-2" />
                                            )}
                                            <span className="font-semibold text-gray-900">{transfer.teams.in.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Unknown</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
