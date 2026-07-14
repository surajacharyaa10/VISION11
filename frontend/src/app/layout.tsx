import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import News from "./components/News";
import MobileBottomNav from "./components/MobileBottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VISION11",
  description: "Your ultimate football companion — fixtures, standings, live scores & AI analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Fixed top navbar */}
        <Navbar />

        {/* Main content — push down by navbar height, up by mobile bottom nav */}
        <main className="pt-14 md:pt-16 pb-20 md:pb-0 px-2 md:px-8 lg:px-12 xl:px-16 text-textPrimary min-h-screen">
          <div className="flex flex-col lg:flex-row gap-4 py-4 items-start">

            {/* Sidebar — sticky on desktop */}
            <aside className="hidden lg:block lg:w-[280px] xl:w-[300px] shrink-0 sticky top-[72px] self-start max-h-[calc(100vh-80px)] overflow-y-auto">
              <Sidebar />
            </aside>

            {/* Page content */}
            <div className="flex-1 min-w-0 w-full">
              {children}
            </div>

            {/* News panel — sticky on xl */}
            <aside className="hidden xl:block w-[350px] shrink-0 sticky top-[72px] self-start max-h-[calc(100vh-80px)] overflow-y-auto">
              <News />
            </aside>

          </div>
        </main>

        {/* Mobile bottom navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
