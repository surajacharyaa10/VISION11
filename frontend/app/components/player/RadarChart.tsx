"use client";
import { getAttrColor, type AttributeScores } from './helpers';

interface RadarChartProps {
    attrs: AttributeScores;
}

export default function RadarChart({ attrs }: RadarChartProps) {
    const keys = Object.keys(attrs) as (keyof AttributeScores)[];
    const n = keys.length;
    const cx = 80, cy = 80, r = 56;
    const angles = keys.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);
    const levelPts = (f: number) =>
        angles.map(a => `${cx + r * f * Math.cos(a)},${cy + r * f * Math.sin(a)}`).join(' ');
    const dataPts = angles
        .map((a, i) => { const v = attrs[keys[i]] / 100; return `${cx + r * v * Math.cos(a)},${cy + r * v * Math.sin(a)}`; })
        .join(' ');

    return (
        <svg width="160" height="160" viewBox="0 0 160 160">
            {[0.25, 0.5, 0.75, 1].map((f, li) => (
                <polygon key={li} points={levelPts(f)} fill="none"
                    stroke={f === 1 ? '#d1d5db' : '#e5e7eb'} strokeWidth="0.8" />
            ))}
            {angles.map((a, i) => (
                <line key={i} x1={cx} y1={cy}
                    x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
                    stroke="#e5e7eb" strokeWidth="0.8" />
            ))}
            <polygon points={dataPts} fill="rgba(34,197,94,0.18)" stroke="#22c55e" strokeWidth="1.8" />
            {angles.map((a, i) => {
                const v = attrs[keys[i]] / 100;
                return <circle key={i} cx={cx + r * v * Math.cos(a)} cy={cy + r * v * Math.sin(a)} r="2.5" fill="#22c55e" />;
            })}
            {angles.map((a, i) => {
                const lx = cx + (r + 17) * Math.cos(a);
                const ly = cy + (r + 17) * Math.sin(a);
                const val = attrs[keys[i]];
                return (
                    <g key={i}>
                        <text x={lx} y={ly - 5} textAnchor="middle" dominantBaseline="middle"
                            fontSize="8" fontWeight="600" fill="#6b7280">{keys[i]}</text>
                        <text x={lx} y={ly + 6} textAnchor="middle" dominantBaseline="middle"
                            fontSize="9" fontWeight="700" fill={getAttrColor(val)}>{val}</text>
                    </g>
                );
            })}
        </svg>
    );
}
