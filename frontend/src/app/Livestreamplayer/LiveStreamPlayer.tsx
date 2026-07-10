"use client";

import React, { useEffect, useState } from "react";
import type { StreamLink } from "@/lib/live-stream/types";

interface Props {
  matchId: string;
}

export default function LiveStreamPlayer({ matchId }: Props) {
  const [links, setLinks] = useState<StreamLink[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/live-stream/link/${matchId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data: StreamLink[] = await res.json();
        if (!cancelled) setLinks(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load stream");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-900 text-neutral-400">
        Loading stream…
      </div>
    );
  }

  if (error || !links || links.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-900 text-neutral-400">
        Stream unavailable right now. Try again closer to kickoff.
      </div>
    );
  }

  const primary = links[0];

  return (
    <div className="w-full space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        {primary.type === "iframe" || primary.type === "embed" ? (
          <iframe
            src={primary.url}
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Native <video> handles mp4/HLS on Safari. For broad HLS (.m3u8)
          // support on Chrome/Firefox, wire this up to hls.js instead.
          <video src={primary.url} controls autoPlay className="h-full w-full" />
        )}
      </div>

      {links.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <span
              key={link.id}
              className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-600"
            >
              {link.language ?? "Stream"} {link.quality ? `· ${link.quality}` : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
