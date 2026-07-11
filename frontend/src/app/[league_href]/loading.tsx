import React from "react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
            <div className="w-[600px] max-w-[90%] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-10 flex flex-col items-center justify-center gap-8">

                {/* Animated Spinner */}
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-500 animate-spin"></div>

                    <div className="absolute inset-3 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 blur-xl opacity-60 animate-pulse"></div>

                    <div className="absolute inset-6 rounded-full bg-slate-950"></div>
                </div>


                {/* Loading Text */}
                <div className="flex items-center text-white text-2xl font-semibold tracking-wide">
                    <span>Loading</span>

                    <div className="flex ml-2 gap-1">
                        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"></span>

                        <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce [animation-delay:200ms]"></span>

                        <span className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce [animation-delay:400ms]"></span>
                    </div>
                </div>


                {/* Animated Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="
            h-full 
            w-1/2
            rounded-full
            bg-gradient-to-r 
            from-cyan-400 
            via-purple-500 
            to-pink-500
            animate-[progress_1.5s_ease-in-out_infinite]
          "></div>
                </div>


                {/* Small Status Text */}
                <p className="text-sm text-slate-400">
                    Please wait while we prepare everything...
                </p>

            </div>
        </div>
    );
};

export default Loader;