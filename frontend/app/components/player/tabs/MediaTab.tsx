"use client";

import React, { useState } from 'react';

interface MediaTabProps {
    playerDetails: any;
}

export default function MediaTab({ playerDetails }: MediaTabProps) {
    const [filter, setFilter] = useState<'All' | 'Highlights' | 'News'>('All');
    const playerName = playerDetails?.player?.name || 'Player';

    // Generate dynamic YouTube searches based on player name
    const highlights = [
        { title: `@${playerName.toLowerCase().replace(/\s/g, '')} season part II, now loading👀 come back...`, views: '1.2M views', time: '2 days ago', thumb: `https://img.youtube.com/vi/W7qWa52k-nE/hqdefault.jpg` },
        { title: `World Cup ${playerName}. 🐐`, views: '5M views', time: '1 week ago', thumb: `https://img.youtube.com/vi/1_IuNDmAPxg/hqdefault.jpg` },
    ];

    const news = [
        { title: `The Best XI of the World Cup Round of 16`, desc: `Our World Cup round of 16 Team of the Week in a 4-3-3. ${playerName} is Player of the Round, with Kobel, Haaland...`, source: 'Sofascore', date: '8 Jul 2026', img: 'https://images.unsplash.com/photo-1518605368461-1ee7c5320673?auto=format&fit=crop&w=500&q=80' },
        { title: `${playerName} has missed half of his World Cup penalties – Egypt almost made him pay`, desc: `${playerName} has taken eight penalties at FIFA World Cups but converted only four. Here's a look at every miss, ever...`, source: 'Sofascore', date: '8 Jul 2026', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=500&q=80' }
    ];

    return (
        <div className="flex flex-col text-sm text-gray-300 pb-8">
            
            {/* Filter Pills */}
            <div className="flex gap-2 mb-8">
                <button 
                    onClick={() => setFilter('All')} 
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'All' ? 'bg-white text-black' : 'bg-transparent border border-white/20 text-white hover:bg-white/10'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('Highlights')} 
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'Highlights' ? 'bg-white text-black' : 'bg-transparent border border-white/20 text-white hover:bg-white/10'}`}
                >
                    Highlights
                </button>
                <button 
                    onClick={() => setFilter('News')} 
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'News' ? 'bg-white text-black' : 'bg-transparent border border-white/20 text-white hover:bg-white/10'}`}
                >
                    News
                </button>
            </div>

            {/* Highlights Section */}
            {(filter === 'All' || filter === 'Highlights') && (
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-semibold text-lg">Highlights</h3>
                        <button className="text-blue-500 hover:text-blue-400 text-xs font-bold flex items-center gap-1">
                            See all ›
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {highlights.map((h, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative rounded-xl overflow-hidden aspect-video bg-[#1a1a1c] mb-3">
                                    {/* Thumbnail Image */}
                                    <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `url(${h.thumb})` }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <p className="text-white font-bold text-sm line-clamp-2 leading-tight">{h.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold px-1">
                                    <span>#{playerName.replace(/\s/g, '').toLowerCase()}</span>
                                    <span>#newseason</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* News Section */}
            {(filter === 'All' || filter === 'News') && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-semibold text-lg">News</h3>
                        <button className="text-blue-500 hover:text-blue-400 text-xs font-bold flex items-center gap-1">
                            See all ›
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {news.map((n, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#1a1a1c] mb-3">
                                    <img src={n.img} alt="News thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h4 className="text-white font-bold text-base leading-tight mb-2 line-clamp-2">{n.title}</h4>
                                        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">{n.desc}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold">
                                            <span className="w-4 h-4 bg-white/20 rounded-sm flex items-center justify-center text-white">S</span>
                                            <span>{n.source}</span>
                                            <span>•</span>
                                            <span>{n.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
