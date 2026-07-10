import React from "react";

interface LogoProps {
  /** "mark" = icon only, "full" = icon + wordmark */
  variant?: "mark" | "full";
  className?: string;
}

export default function Logo({ variant = "full", className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-8 w-8 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="v11-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        {/* Hexagon badge — nods to a football panel */}
        <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" fill="url(#v11-gradient)" />
        {/* "V" chevron */}
        <path
          d="M12 14L20 26L28 14"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="20" cy="19.5" r="1.4" fill="white" opacity="0.55" />
      </svg>

      {variant === "full" && (
        <span className="text-2xl font-bold tracking-tight">
          VISION<span className="text-emerald-500">11</span>
        </span>
      )}
    </div>
  );
}
