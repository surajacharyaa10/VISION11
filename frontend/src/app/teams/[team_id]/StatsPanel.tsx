"use client";

interface StatsPanelProps {
    fdStats: any | null;
}

export default function StatsPanel({ fdStats }: StatsPanelProps) {
    if (!fdStats) {
        return (
            <div className="text-gray-400">
                <p>No statistics available for this team.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold mb-3">Team Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fdStats && Object.entries(fdStats).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-3 border border-white/5 rounded-lg">
                        <span className="block text-gray-500 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-white font-semibold">{value ?? '-'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}