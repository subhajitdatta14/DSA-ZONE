import React, { useState, useEffect } from 'react';
import { Lightbulb, Zap } from 'lucide-react';

interface IntroSplashProps {
  onFinish: () => void;
  durationMs?: number;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({
  onFinish,
  durationMs = 1500,
}) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    const exitDuration = 300;
    const holdTime = Math.max(200, durationMs - exitDuration);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onFinish();
      }, exitDuration);
    }, holdTime);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafafa] selection:bg-[#FFE135] selection:text-black transition-all duration-300 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {/* 1. Animated Logo / Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-2.5 rounded-3xl bg-[#FFE135] border-2 border-black rotate-[-3deg] shadow-[4px_4px_0px_#000] animate-pulse" />
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000]">
            <Lightbulb className="h-12 w-12 sm:h-14 sm:w-14 text-amber-500 fill-amber-300 stroke-[2.5] animate-bounce" />
          </div>
          <div className="absolute -top-2.5 -right-3 rounded-full border-2 border-black bg-[#22C55E] p-2 shadow-[2px_2px_0px_#000]">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
        </div>

        {/* 2. DSA ZONE Title */}
        <h1 className="font-comic text-5xl sm:text-7xl font-black text-black tracking-tight select-none">
          DSA ZONE
        </h1>
      </div>
    </div>
  );
};
