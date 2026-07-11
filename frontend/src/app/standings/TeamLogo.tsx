"use client";

import { useState } from "react";
import Image from "next/image";

export default function TeamLogo({ src, name }: { src?: string; name: string }) {
    const [err, setErr] = useState(false);

    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");

    if (!src || err || !src.includes("://")) {
        return (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                {initials}
            </div>
        );
    }

    return (
        <div className="relative w-8 h-8">
            <Image
                src={src}
                alt={name}
                fill
                onError={() => setErr(true)}
                className="object-contain"
            />
        </div>
    );
}
