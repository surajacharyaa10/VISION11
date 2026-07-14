import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import News from "./components/News";

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
        <main className="pt-14 md:pt-16 px-2 md:px-8 lg:px-12 xl:px-16 text-textPrimary min-h-screen">
          <div className="flex flex-col lg:flex-row gap-4 py-4 items-start">

            {/* Sidebar — sticky on desktop, fixed height so internal scroll works */}
            <aside className="hidden lg:flex lg:w-[280px] xl:w-[300px] shrink-0 sticky top-[72px] self-start h-[calc(100vh-88px)]">
              <Sidebar />
            </aside>

            {/* Page content */}
            <div className="flex-1 min-w-0 w-full">
              {children}
            </div>

            {/* News panel — sticky on xl */}
            <aside className="hidden xl:flex w-[350px] shrink-0 sticky top-[72px] self-start h-[calc(100vh-88px)] overflow-y-auto">
              <News />
            </aside>

          </div>
        </main>

      </body>
    </html>
  );
}
