"use client";

import React, { useEffect, useState } from "react";

interface PlayerImageProps {
    photo?: string;
    name: string;
    query?: string;
    className?: string;
}

const PlayerImage = ({ photo, name, query, className }: PlayerImageProps) => {
    const [image, setImage] = useState<string>(photo ?? "");
    const [photoFailed, setPhotoFailed] = useState<boolean>(!photo);

    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");

    useEffect(() => {
        if (!photoFailed || image) return;

        async function loadImage() {
            try {
                const res = await fetch(
                    `/api/imageapi?query=${encodeURIComponent(query || name)}`
                );
                const data = await res.json();
                if (data.image) setImage(data.image);
            } catch (error) {
                console.log(error);
            }
        }

        loadImage();
    }, [query, name, photoFailed, image]);

    if (image) {
        return (
            <img
                src={image}
                alt={name}
                onError={() => {
                    if (!photoFailed) {
                        setPhotoFailed(true);
                        setImage("");
                    }
                }}
                className={className}
            />
        );
    }

    return (
        <div
            className={`flex items-center justify-center bg-white/10 text-white font-bold ${className ?? ""}`}
            aria-hidden="true"
        >
            {initials}
        </div>
    );
};

export default PlayerImage;
