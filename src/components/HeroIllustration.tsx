import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  const [isComicBookOpen, setIsComicBookOpen] = useState<boolean>(false);
  const [isLaptopScreenClicked, setIsLaptopScreenClicked] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0);

  const holdTimeoutRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);
  const laptopRef = useRef<SVGGElement | null>(null);
  const isLaptopScreenClickedRef = useRef<boolean>(false);
  isLaptopScreenClickedRef.current = isLaptopScreenClicked;

  // Closes the comic book and disables the yellow border on the laptop screen
  const closeComicBook = () => {
    setIsComicBookOpen(false);
    setIsLaptopScreenClicked(false);
  };

  // 3-second hold logic for mobile
  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / 3000) * 100));
      setHoldProgress(progress);
    }, 100);

    holdTimeoutRef.current = window.setTimeout(() => {
      setIsComicBookOpen(true);
      clearHold();
    }, 3000);
  };

  const clearHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // Click outside laptop screen automatically disables the yellow border glow and function
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent | TouchEvent) => {
      if (isComicBookOpen) return;
      if (laptopRef.current && !laptopRef.current.contains(event.target as Node)) {
        setIsLaptopScreenClicked(false);
      }
    };

    if (isLaptopScreenClicked) {
      document.addEventListener('pointerdown', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('pointerdown', handleDocumentClick);
    };
  }, [isLaptopScreenClicked, isComicBookOpen]);

  // Keyboard shortcut listeners: Shift + S to open (only when active/glowing), Shift + D to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
        if (isLaptopScreenClickedRef.current) {
          e.preventDefault();
          setIsComicBookOpen(true);
        }
      }
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        closeComicBook();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearHold();
    };
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center select-none py-2">
      <svg
        viewBox="0 0 540 340"
        className="w-full h-auto drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions for patterns and markers */}
        <defs>
          <filter id="comicShadow" x="0" y="0" width="200%" height="200%">
            <feOffset result="offOut" in="SourceAlpha" dx="3" dy="3" />
            <feColorMatrix
              result="matrixOut"
              in="offOut"
              type="matrix"
              values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 1 0"
            />
            <feBlend in="SourceGraphic" in2="matrixOut" mode="normal" />
          </filter>
          {/* Yellow glow filter for active laptop screen */}
          <filter id="yellowGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#FFE135" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFE135" floodOpacity="1" />
          </filter>
        </defs>

        {/* 1. FLOATING ARRAY (TOP LEFT) */}
        <g transform="translate(180, 25)">
          <rect
            x="0"
            y="0"
            width="170"
            height="32"
            rx="6"
            fill="#FFFFFF"
            stroke="#111827"
            strokeWidth="2.5"
            filter="url(#comicShadow)"
          />
          <line x1="34" y1="0" x2="34" y2="32" stroke="#111827" strokeWidth="2" />
          <line x1="68" y1="0" x2="68" y2="32" stroke="#111827" strokeWidth="2" />
          <line x1="102" y1="0" x2="102" y2="32" stroke="#111827" strokeWidth="2" />
          <line x1="136" y1="0" x2="136" y2="32" stroke="#111827" strokeWidth="2" />
          <text x="17" y="21" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="13" fill="#111827" textAnchor="middle">10</text>
          <text x="51" y="21" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="13" fill="#111827" textAnchor="middle">20</text>
          <rect x="68" y="0" width="34" height="32" fill="#FFE135" stroke="#111827" strokeWidth="2" />
          <text x="85" y="21" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="14" fill="#111827" textAnchor="middle">30</text>
          <text x="119" y="21" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="13" fill="#111827" textAnchor="middle">40</text>
          <text x="153" y="21" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="13" fill="#111827" textAnchor="middle">50</text>
        </g>

        {/* 2. COMIC SPEECH BUBBLE: "Think Logically!" */}
        <g transform="translate(195, 75)">
          <path
            d="M20 10 C10 10 0 18 0 28 C0 38 10 46 22 46 C25 54 20 60 16 63 C24 62 31 56 34 46 C48 46 56 38 56 28 C56 18 40 10 20 10 Z"
            fill="#FFE135"
            stroke="#111827"
            strokeWidth="2.5"
            transform="scale(1.5)"
          />
          <text
            x="42"
            y="42"
            fontFamily="Fredoka, sans-serif"
            fontWeight="bold"
            fontSize="12"
            fill="#111827"
            textAnchor="middle"
          >
            Think
          </text>
          <text
            x="42"
            y="56"
            fontFamily="Fredoka, sans-serif"
            fontWeight="bold"
            fontSize="12"
            fill="#111827"
            textAnchor="middle"
          >
            Logically!
          </text>
        </g>

        {/* 3. LIGHTBULB DOODLE */}
        <g transform="translate(285, 65)">
          <path
            d="M15 0 C7 0 2 6 2 13 C2 18 6 22 8 26 L12 26 L12 29 L18 29 L18 26 L22 26 C24 22 28 18 28 13 C28 6 23 0 15 0 Z"
            fill="#FFE135"
            stroke="#111827"
            strokeWidth="2"
          />
          <line x1="10" y1="32" x2="20" y2="32" stroke="#111827" strokeWidth="2" />
          {/* Bulb shine rays */}
          <line x1="15" y1="-6" x2="15" y2="-2" stroke="#111827" strokeWidth="2" />
          <line x1="28" y1="2" x2="24" y2="5" stroke="#111827" strokeWidth="2" />
          <line x1="2" y1="2" x2="6" y2="5" stroke="#111827" strokeWidth="2" />
        </g>

        {/* 4. FLOATING BINARY TREE (RIGHT) */}
        <g transform="translate(390, 70)">
          {/* Edges */}
          <line x1="50" y1="20" x2="25" y2="55" stroke="#111827" strokeWidth="2" />
          <line x1="50" y1="20" x2="75" y2="55" stroke="#111827" strokeWidth="2" />
          <line x1="25" y1="55" x2="10" y2="90" stroke="#111827" strokeWidth="2" />
          <line x1="25" y1="55" x2="38" y2="90" stroke="#111827" strokeWidth="2" />
          <line x1="75" y1="55" x2="90" y2="90" stroke="#111827" strokeWidth="2" />

          {/* Root node 10 */}
          <circle cx="50" cy="20" r="14" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <text x="50" y="24" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="11" fill="#111827" textAnchor="middle">10</text>

          {/* Left 5 */}
          <circle cx="25" cy="55" r="12" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <text x="25" y="59" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="10" fill="#111827" textAnchor="middle">5</text>

          {/* Right 15 (Red highlight) */}
          <circle cx="75" cy="55" r="12" fill="#EF4444" stroke="#111827" strokeWidth="2" />
          <text x="75" y="59" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="10" fill="#FFFFFF" textAnchor="middle">15</text>

          {/* Leaves */}
          <circle cx="10" cy="90" r="10" fill="#22C55E" stroke="#111827" strokeWidth="2" />
          <text x="10" y="93" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9" fill="#FFFFFF" textAnchor="middle">3</text>

          <circle cx="38" cy="90" r="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <text x="38" y="93" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9" fill="#111827" textAnchor="middle">7</text>

          <circle cx="90" cy="90" r="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <text x="90" y="93" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9" fill="#111827" textAnchor="middle">20</text>

          <text x="75" y="112" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="10" fill="#EF4444" textAnchor="middle">DFS</text>
        </g>

        {/* 5. MINI STACK [40, 30, 20, 10] */}
        <g transform="translate(350, 90)">
          <rect x="0" y="0" width="30" height="20" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <text x="15" y="15" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="11" fill="#111827" textAnchor="middle">40</text>
          <rect x="0" y="20" width="30" height="20" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <text x="15" y="35" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="11" fill="#111827" textAnchor="middle">30</text>
          <rect x="0" y="40" width="30" height="20" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <text x="15" y="55" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="11" fill="#111827" textAnchor="middle">20</text>
          <rect x="0" y="60" width="30" height="20" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <text x="15" y="75" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="11" fill="#111827" textAnchor="middle">10</text>

          <path d="M35 15 C45 5 45 35 35 25" stroke="#111827" strokeWidth="2" fill="none" />
          <text x="42" y="10" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="10" fill="#111827">Push</text>
        </g>

        {/* 6. TIME COMPLEXITY DOODLE */}
        <g transform="translate(370, 180)">
          <text
            x="0"
            y="0"
            fontFamily="Fredoka, sans-serif"
            fontWeight="bold"
            fontSize="14"
            fill="#EF4444"
            transform="rotate(-8)"
          >
            O(log n)
          </text>
        </g>

        {/* 7. GRAPH BFS DOODLE */}
        <g transform="translate(370, 215)">
          <line x1="20" y1="20" x2="50" y2="10" stroke="#111827" strokeWidth="2" />
          <line x1="20" y1="20" x2="45" y2="40" stroke="#111827" strokeWidth="2" />
          <line x1="50" y1="10" x2="70" y2="25" stroke="#111827" strokeWidth="2" />
          <circle cx="20" cy="20" r="7" fill="#22C55E" stroke="#111827" strokeWidth="2" />
          <circle cx="50" cy="10" r="6" fill="#FFE135" stroke="#111827" strokeWidth="2" />
          <circle cx="45" cy="40" r="6" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <circle cx="70" cy="25" r="7" fill="#EF4444" stroke="#111827" strokeWidth="2" />
          <text x="50" y="55" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="10" fill="#111827">BFS</text>
        </g>

        {/* 8. POTTED PLANT (LEFT) */}
        <g transform="translate(180, 240)">
          {/* Pot */}
          <polygon points="12,45 38,45 42,20 8,20" fill="#FFFFFF" stroke="#111827" strokeWidth="2.5" />
          {/* Leaves */}
          <path d="M25 20 C15 5 10 10 12 0 C18 8 22 15 25 20 Z" fill="#22C55E" stroke="#111827" strokeWidth="2" />
          <path d="M25 20 C35 5 40 10 38 0 C32 8 28 15 25 20 Z" fill="#16A34A" stroke="#111827" strokeWidth="2" />
          <path d="M25 20 C20 10 23 2 25 -5 C27 2 30 10 25 20 Z" fill="#4ADE80" stroke="#111827" strokeWidth="2" />
        </g>

        {/* 9. WORKSTATION LAPTOP WITH CODE SYMBOL (</>) */}
        <g
          ref={laptopRef}
          transform="translate(225, 210)"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsLaptopScreenClicked(true);
          }}
        >
          {/* Laptop Screen */}
          <rect
            x="8"
            y="0"
            width="90"
            height="58"
            rx="5"
            fill="#1E293B"
            stroke={isLaptopScreenClicked ? '#FFE135' : '#111827'}
            strokeWidth={isLaptopScreenClicked ? '3.5' : '2.5'}
            filter={isLaptopScreenClicked ? 'url(#yellowGlow)' : 'url(#comicShadow)'}
            className="transition-all duration-300"
          />
          {/* Screen Inner */}
          <rect
            x="14"
            y="6"
            width="78"
            height="46"
            rx="2"
            fill={isHolding ? '#166534' : isLaptopScreenClicked ? '#1e1b4b' : '#0F172A'}
            stroke={isHolding ? '#22C55E' : isLaptopScreenClicked ? '#FFE135' : 'none'}
            strokeWidth={isHolding ? '2' : isLaptopScreenClicked ? '2.5' : '0'}
            className="cursor-pointer transition-all duration-200 hover:brightness-125"
            onClick={(e) => {
              e.stopPropagation();
              setIsLaptopScreenClicked(true);
            }}
            onTouchStart={startHold}
            onTouchEnd={clearHold}
            onTouchCancel={clearHold}
          />
          {/* Code Icon inside screen */}
          <text
            x="53"
            y="35"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="bold"
            fontSize="18"
            fill={isHolding ? '#4ADE80' : isLaptopScreenClicked ? '#FFE135' : '#FFE135'}
            textAnchor="middle"
            className="cursor-pointer select-none pointer-events-none"
          >
            &lt;/&gt;
          </text>
          {/* Subtle Mobile Hold Indicator or Active Hint */}
          {isHolding && (
            <text
              x="53"
              y="48"
              fontFamily="Fredoka, sans-serif"
              fontWeight="bold"
              fontSize="8"
              fill="#FFFFFF"
              textAnchor="middle"
              className="pointer-events-none"
            >
              {holdProgress}% (HOLD 3S)
            </text>
          )}
          {isLaptopScreenClicked && !isHolding && (
            <text
              x="53"
              y="48"
              fontFamily="Fredoka, sans-serif"
              fontWeight="bold"
              fontSize="7"
              fill="#FFE135"
              textAnchor="middle"
              className="pointer-events-none animate-pulse"
            >
              Shift+S
            </text>
          )}
          {/* Laptop Base / Keyboard */}
          <polygon
            points="0,72 8,58 98,58 106,72"
            fill="#334155"
            stroke={isLaptopScreenClicked ? '#FFE135' : '#111827'}
            strokeWidth={isLaptopScreenClicked ? '2.5' : '2.5'}
            className="transition-colors duration-200"
          />
          {/* Trackpad */}
          <rect x="43" y="62" width="20" height="7" rx="1" fill="#1E293B" stroke="#111827" strokeWidth="1" />
        </g>

        {/* 10. STACK OF BOOKS (RIGHT OF LAPTOP) */}
        <g transform="translate(340, 235)">
          {/* Top Book: DSA (Green) */}
          <rect x="0" y="0" width="75" height="15" rx="3" fill="#22C55E" stroke="#111827" strokeWidth="2" />
          <text x="37" y="11" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9" fill="#FFFFFF" textAnchor="middle">DSA</text>

          {/* Middle Book: ALGORITHMS (Yellow) */}
          <rect x="-4" y="15" width="82" height="16" rx="3" fill="#FFE135" stroke="#111827" strokeWidth="2" />
          <text x="37" y="27" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="8" fill="#111827" textAnchor="middle">ALGORITHMS</text>

          {/* Bottom Book: LOGIC (Red) */}
          <rect x="-8" y="31" width="90" height="17" rx="3" fill="#EF4444" stroke="#111827" strokeWidth="2" />
          <text x="37" y="43" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9" fill="#FFFFFF" textAnchor="middle">LOGIC</text>
        </g>

        {/* Desk Line */}
        <line x1="160" y1="285" x2="435" y2="285" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {/* Comic Book Modal */}
      {isComicBookOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={closeComicBook}
        >
          {/* Only the selected card */}
          <div
            className="relative w-full max-w-md rounded-2xl border-3 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_#000] text-center space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Only Exit Button */}
            <button
              onClick={closeComicBook}
              className="block md:hidden absolute -top-3.5 -right-3.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#EF4444] text-white shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer z-30"
              aria-label="Close comic book"
            >
              <X className="h-5 w-5 stroke-[3]" />
            </button>

            <div className="inline-block -rotate-2 select-none">
              <div className="rounded-lg border-2 border-black bg-[#22C55E] px-3 py-1 font-comic text-xs font-black text-white shadow-[2px_2px_0px_#000]">
                ★ OFFICIAL CREATOR RECORD ★
              </div>
            </div>

            {/* Exact text */}
            <div className="space-y-1.5 pt-2">
              <h3 className="font-comic text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase">
                DEVELOPED BY
              </h3>
              <h2 className="font-comic text-2xl sm:text-4xl font-black text-black tracking-tight uppercase leading-tight">
                SUBHAJIT DATTA
              </h2>
              <div className="pt-2">
                <div className="inline-block rounded-xl border-2 border-black bg-[#FFE135] px-4 py-1.5 font-comic text-sm sm:text-base font-black text-black shadow-[3px_3px_0px_#000] -rotate-1">
                  25TH SEPTEMBER 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
