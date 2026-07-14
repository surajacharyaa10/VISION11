"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  Trophy,
  Users,
  UserRound,
  Tv,
  Sparkles,
} from "lucide-react";

const BOTTOM_NAV = [
  { label: "Home", href: "/", icon: Home },
  { label: "Fixtures", href: "/fixtures", icon: CalendarDays },
  { label: "Standings", href: "/standings", icon: Trophy },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Players", href: "/players", icon: UserRound },
  { label: "Live", href: "/Livestreamplayer", icon: Tv },
  { label: "AI", href: "/AiAnalysis", icon: Sparkles },
];

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Mobile navigation"
    >
      {/* Frosted glass bar */}
      <div className="bg-[#0f0f1a]/95 backdrop-blur-md border-t border-white/10 shadow-2xl shadow-black/60">
        <ul className="flex items-stretch justify-around px-1 py-1 safe-area-inset-bottom">
          {BOTTOM_NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl transition-all duration-200 ${
                    active
                      ? "text-emerald-400"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-emerald-500/20 scale-110"
                        : "bg-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 1.8} />
                  </span>
                  <span
                    className={`text-[10px] font-medium leading-none transition-colors ${
                      active ? "text-emerald-400" : "text-neutral-500"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
