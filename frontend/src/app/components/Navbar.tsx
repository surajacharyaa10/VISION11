"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Fixtures", href: "/fixtures" },
  { label: "Standings", href: "/standings" },
  { label: "Players", href: "/players" },
  { label: "Transfers", href: "/transfers" },
  { label: "Predictions", href: "/predictions" },
  { label: "Livestreamplayer", href: "/Livestreamplayer" },
  { label: "AI Analysis", href: "/AiAnalysis" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="relative flex items-center justify-between py-2">
      {/* Logo — icon only; the wordmark below is the ONLY text, no duplicate */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="relative h-9 w-9 shrink-0 md:h-10 md:w-10">
          <Image
            src="/vision11.png"
            alt="Vision 11"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white md:block">
          VISION<span className="text-emerald-400">11</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center space-x-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isActive(link.href) ? "text-emerald-500" : "text-neutral-400"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu toggle */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-300 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile nav panel */}
      {open && (
        <nav className="absolute top-full left-0 right-0 z-50 mt-2 flex flex-col rounded-lg border border-neutral-800 bg-neutral-900 p-4 shadow-lg md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-2 text-sm font-medium transition-colors hover:text-emerald-500 ${isActive(link.href) ? "text-emerald-500" : "text-neutral-400"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Navbar;