"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface LivePlayerProps {
    streamUrl: string;
    isLive?: boolean;
}

export default function LivePlayer({ streamUrl, isLive = true }: LivePlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Cleanup previous instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                liveSyncDurationCount: 3, // Target 3 segments behind live edge
                liveMaxLatencyDurationCount: 5,
                enableWorker: true, // Offload transcoding
                lowLatencyMode: true,
            });

            hlsRef.current = hls;
            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch((e) => console.warn("Autoplay blocked:", e));
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) setError("Stream error: Unable to load source");
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch((e) => console.warn("Autoplay blocked:", e));
            });
        } else {
            setError("Your browser does not support HLS playback.");
        }

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [streamUrl]);

    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
            <video
                ref={videoRef}
                controls
                playsInline
                className="w-full h-full object-contain"
                muted // Required for autoplay policies
            />
            {isLive && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                    LIVE
                </span>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
                    {error}
                </div>
            )}
        </div>
    );
}