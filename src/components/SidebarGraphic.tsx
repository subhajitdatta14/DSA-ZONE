import React from 'react';
import { Sparkles } from 'lucide-react';

export const SidebarGraphic: React.FC = () => {
  return (
    <div className="relative rounded-2xl border-2 border-black bg-[#FFFBEB] p-3 shadow-[3px_3px_0px_#000] overflow-hidden select-none">
      {/* Decorative comic dots */}
      <div className="absolute top-1 right-2 text-[10px] font-black text-amber-300/80 font-mono">
        + + +
      </div>

      {/* Comic Illustration Graphic */}
      <div className="flex items-center justify-center py-1">
        <svg
          viewBox="0 0 200 120"
          className="w-full h-auto max-h-[110px] drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for shadow */}
          <defs>
            <filter id="miniShadow" x="0" y="0" width="150%" height="150%">
              <feOffset dx="2" dy="2" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 1 0"
              />
              <feBlend in="SourceGraphic" mode="normal" />
            </filter>
          </defs>

          {/* 1. MINI BINARY TREE (TOP LEFT) */}
          <g transform="translate(18, 12)">
            {/* Branches */}
            <line x1="28" y1="14" x2="12" y2="34" stroke="#111827" strokeWidth="2" />
            <line x1="28" y1="14" x2="44" y2="34" stroke="#111827" strokeWidth="2" />

            {/* Root Node */}
            <circle cx="28" cy="14" r="11" fill="#FFE135" stroke="#111827" strokeWidth="2" />
            <text x="28" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Fredoka, sans-serif" fill="#111827">
              42
            </text>

            {/* Left Child Node */}
            <circle cx="12" cy="34" r="9" fill="#22C55E" stroke="#111827" strokeWidth="1.8" />
            <text x="12" y="37" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="Fredoka, sans-serif" fill="#FFFFFF">
              17
            </text>

            {/* Right Child Node */}
            <circle cx="44" cy="34" r="9" fill="#3B82F6" stroke="#111827" strokeWidth="1.8" />
            <text x="44" y="37" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="Fredoka, sans-serif" fill="#FFFFFF">
              89
            </text>
          </g>

          {/* 2. SPEECH BUBBLE "Code & Conquer!" */}
          <g transform="translate(90, 8)">
            <path
              d="M 6 4 C 6 0, 94 0, 94 4 L 94 22 C 94 26, 6 26, 6 26 L 0 32 L 2 24 C 0 24, 0 4, 6 4 Z"
              fill="#FFFFFF"
              stroke="#111827"
              strokeWidth="2"
            />
            <text
              x="50"
              y="16"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="bold"
              fontFamily="Fredoka, sans-serif"
              fill="#111827"
            >
              Master DSA! 🚀
            </text>
          </g>

          {/* 3. RETRO COMPUTER / ALGORITHM MASCOT */}
          <g transform="translate(108, 44)">
            {/* Computer Stand / Base */}
            <path d="M 22 56 L 38 56 L 34 50 L 26 50 Z" fill="#D1D5DB" stroke="#111827" strokeWidth="2" />
            <rect x="18" y="56" width="24" height="4" rx="2" fill="#9CA3AF" stroke="#111827" strokeWidth="1.5" />

            {/* Antenna with light */}
            <line x1="30" y1="0" x2="30" y2="10" stroke="#111827" strokeWidth="2" />
            <circle cx="30" cy="2" r="3.5" fill="#EF4444" stroke="#111827" strokeWidth="1.5" />

            {/* Monitor Outer Shell */}
            <rect
              x="6"
              y="10"
              width="48"
              height="40"
              rx="8"
              fill="#FFFFFF"
              stroke="#111827"
              strokeWidth="2.5"
            />

            {/* Monitor Screen Face (Yellow glow) */}
            <rect
              x="11"
              y="15"
              width="38"
              height="30"
              rx="5"
              fill="#FFE135"
              stroke="#111827"
              strokeWidth="1.8"
            />

            {/* Cheerful Mascot Eyes */}
            <circle cx="23" cy="28" r="3" fill="#111827" />
            <circle cx="37" cy="28" r="3" fill="#111827" />
            {/* Eye sparkle highlights */}
            <circle cx="24" cy="27" r="1" fill="#FFFFFF" />
            <circle cx="38" cy="27" r="1" fill="#FFFFFF" />

            {/* Cute Rosy Cheeks */}
            <ellipse cx="18" cy="33" rx="2.5" ry="1.5" fill="#F87171" opacity="0.8" />
            <ellipse cx="42" cy="33" rx="2.5" ry="1.5" fill="#F87171" opacity="0.8" />

            {/* Happy Smile */}
            <path
              d="M 27 34 Q 30 38 33 34"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* 4. MINI ARRAY BUFFER (BOTTOM LEFT) */}
          <g transform="translate(14, 68)">
            {/* Array Box 1 */}
            <rect x="0" y="0" width="22" height="20" rx="4" fill="#FFFFFF" stroke="#111827" strokeWidth="1.8" />
            <text x="11" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#111827">
              10
            </text>

            {/* Array Box 2 (Highlighted) */}
            <rect x="24" y="0" width="22" height="20" rx="4" fill="#FFE135" stroke="#111827" strokeWidth="2" />
            <text x="35" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#111827">
              20
            </text>

            {/* Array Box 3 */}
            <rect x="48" y="0" width="22" height="20" rx="4" fill="#FFFFFF" stroke="#111827" strokeWidth="1.8" />
            <text x="59" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#111827">
              30
            </text>

            {/* Pointer arrow to 20 */}
            <path d="M 35 30 L 35 23 M 32 26 L 35 22 L 38 26" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="35" y="40" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="monospace" fill="#EF4444">
              ptr
            </text>
          </g>

          {/* 5. SPARKS / STARS */}
          <g transform="translate(76, 32)">
            <path d="M 4 0 L 5 3 L 8 4 L 5 5 L 4 8 L 3 5 L 0 4 L 3 3 Z" fill="#F59E0B" />
          </g>
          <g transform="translate(170, 78)">
            <path d="M 3 0 L 4 2 L 6 3 L 4 4 L 3 6 L 2 4 L 0 3 L 2 2 Z" fill="#10B981" />
          </g>
        </svg>
      </div>

      {/* Mini Motivational Note & Badge */}
      <div className="mt-1 flex items-center justify-between border-t border-black/15 pt-2">
        <div className="flex items-center gap-1 text-[10px] font-comic font-bold text-slate-800">
          <Sparkles className="h-3 w-3 text-amber-500 fill-amber-400 stroke-black stroke-[1.5]" />
          <span>DSA Practice Tip</span>
        </div>
        <span className="rounded bg-[#22C55E] border border-black px-1.5 py-0.2 text-[9px] font-mono font-bold text-white shadow-[1px_1px_0px_#000]">
          O(log n)
        </span>
      </div>
      <p className="mt-1 text-[10.5px] font-comic font-medium text-slate-600 leading-tight">
        Practice one problem daily to build algorithmic intuition!
      </p>
    </div>
  );
};
