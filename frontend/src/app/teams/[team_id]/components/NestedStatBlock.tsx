import React from "react";

interface NestedStatBlockProps {
    label: string;
    data: any;
}

export default function NestedStatBlock({ label, data }: NestedStatBlockProps) {
    if (!data || typeof data !== "object") return null;
    const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== "");
    if (entries.length === 0) return null;
    return (
        <div className="mt-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {entries.map(([k, v]) => (
                    <div key={k} className="flex justify-between text-gray-300">
                        <span className="text-gray-500 capitalize">{k.replace(/_/g, " ")}</span>
                        <span className="font-medium text-white">{String(v)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
