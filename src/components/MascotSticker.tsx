import React from 'react';

interface MascotStickerProps {
  className?: string;
}

export const MascotSticker: React.FC<MascotStickerProps> = ({ className = 'h-10 w-10' }) => {
  return (
    <svg
      viewBox="0 0 160 170"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DSA Zone Thinking Mascot Sticker"
    >
      {/* 1. LIGHTBULB SHINE RAYS */}
      <line x1="38" y1="28" x2="28" y2="20" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="28" x2="28" y2="20" stroke="#FFE135" strokeWidth="1.5" strokeLinecap="round" />
      
      <line x1="28" y1="42" x2="18" y2="40" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="42" x2="18" y2="40" stroke="#FFE135" strokeWidth="1.5" strokeLinecap="round" />

      <line x1="48" y1="20" x2="42" y2="12" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
      <line x1="48" y1="20" x2="42" y2="12" stroke="#FFE135" strokeWidth="1.5" strokeLinecap="round" />

      {/* 2. SPEECH BUBBLE: "THINK!" */}
      <g>
        <path
          d="M75 16 C75 8, 86 5, 105 5 C124 5, 133 10, 133 19 C133 27, 123 31, 108 31 C102 31, 98 35, 93 40 C95 34, 92 31, 86 31 C78 31, 75 25, 75 16 Z"
          fill="#FFE135"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <text
          x="104"
          y="23"
          fontFamily="Fredoka, Impact, sans-serif"
          fontWeight="900"
          fontSize="12.5"
          fill="#000000"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          THINK!
        </text>
      </g>

      {/* 3. RED BACKPACK (PEEKING LEFT) */}
      <path
        d="M34 88 C26 88, 24 98, 24 112 C24 122, 30 126, 36 126 L40 102 Z"
        fill="#EF4444"
        stroke="#000000"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 4. LIGHTBULB HEAD */}
      <path
        d="M36 68 C32 48, 42 34, 60 34 C78 34, 88 48, 84 68 C82 76, 76 81, 72 85 L50 85 C46 81, 40 76, 36 68 Z"
        fill="#FFE135"
        stroke="#000000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Lightbulb Screw Base */}
      <path d="M49 85 L73 85 L70 90 L52 90 Z" fill="#E2E8F0" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />

      {/* Lightbulb Top-Left White Shine Reflection */}
      <path
        d="M42 46 C48 39, 58 39, 64 41"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <circle cx="43" cy="53" r="2" fill="#FFFFFF" opacity="0.9" />

      {/* Face Eyebrows */}
      <path d="M44 56 C47 53, 53 54, 56 57" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M68 53 C71 50, 75 51, 78 54" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Face Eyes (Looking up at Tree) */}
      {/* Left Eye */}
      <ellipse cx="50" cy="64" rx="6.5" ry="8.5" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
      <ellipse cx="52" cy="63" rx="4.5" ry="6" fill="#000000" />
      <circle cx="50.5" cy="60" r="2" fill="#FFFFFF" />

      {/* Right Eye */}
      <ellipse cx="72" cy="62" rx="6" ry="8" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
      <ellipse cx="74" cy="61" rx="4" ry="5.5" fill="#000000" />
      <circle cx="72.5" cy="58" r="1.8" fill="#FFFFFF" />

      {/* Cute Smile */}
      <path d="M65 72 C68 75, 71 73, 73 70" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* 5. HOODIE BODY */}
      {/* Main Torso */}
      <path
        d="M40 93 C42 87, 76 87, 78 93 L86 120 C86 126, 76 126, 60 126 C44 126, 34 126, 34 120 Z"
        fill="#22C55E"
        stroke="#000000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Hood Collar */}
      <path
        d="M46 88 C50 94, 68 94, 72 88 C68 98, 50 98, 46 88 Z"
        fill="#16A34A"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* White Drawstrings */}
      <path d="M54 95 L54 110" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 95 L64 110" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Hand under chin (Thinking pose) */}
      <path
        d="M43 96 C39 104, 45 112, 52 109 L56 94"
        fill="#22C55E"
        stroke="#000000"
        strokeWidth="2.5"
      />
      <path
        d="M52 83 C49 79, 55 75, 59 77 C61 79, 59 85, 54 85 Z"
        fill="#FFE135"
        stroke="#000000"
        strokeWidth="2.5"
      />

      {/* Right arm reaching toward tree */}
      <path
        d="M74 96 C82 99, 92 105, 98 113 L94 117 C87 111, 78 106, 72 102 Z"
        fill="#22C55E"
        stroke="#000000"
        strokeWidth="2.5"
      />
      <circle cx="100" cy="115" r="5" fill="#FFE135" stroke="#000000" strokeWidth="2.5" />

      {/* 6. PANTS & SNEAKERS */}
      {/* Black Pants */}
      <path d="M44 124 L38 142 L48 142 L54 126" fill="#1E293B" stroke="#000000" strokeWidth="3" />
      <path d="M64 126 L72 142 L82 142 L76 124" fill="#1E293B" stroke="#000000" strokeWidth="3" />

      {/* Left Sneaker */}
      <path d="M30 144 C34 140, 48 140, 50 144 L52 148 L28 148 Z" fill="#FFE135" stroke="#000000" strokeWidth="2.5" />
      <path d="M26 148 L54 148 L54 153 L26 153 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />

      {/* Right Sneaker */}
      <path d="M70 144 C74 140, 90 140, 94 144 L96 148 L68 148 Z" fill="#FFE135" stroke="#000000" strokeWidth="2.5" />
      <path d="M66 148 L98 148 L98 153 L66 153 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />

      {/* Ground shadow beneath character */}
      <ellipse cx="62" cy="155" rx="34" ry="4" fill="#000000" opacity="0.15" />

      {/* 7. FLOATING BINARY TREE */}
      {/* Tree Branches */}
      <line x1="128" y1="42" x2="112" y2="60" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="128" y1="42" x2="142" y2="62" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="112" y1="60" x2="116" y2="80" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="116" y1="80" x2="100" y2="100" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="116" y1="80" x2="130" y2="102" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />

      {/* Node 12 (Green) */}
      <circle cx="128" cy="42" r="8.5" fill="#22C55E" stroke="#000000" strokeWidth="2.5" />
      <text x="128" y="46" fontFamily="Fredoka, sans-serif" fontWeight="900" fontSize="8" fill="#FFFFFF" textAnchor="middle">
        12
      </text>

      {/* Node 7 (Yellow) */}
      <circle cx="112" cy="60" r="7.5" fill="#FFE135" stroke="#000000" strokeWidth="2.5" />
      <text x="112" y="63.5" fontFamily="Fredoka, sans-serif" fontWeight="900" fontSize="7.5" fill="#000000" textAnchor="middle">
        7
      </text>

      {/* Node 18 (Red) */}
      <circle cx="142" cy="62" r="8" fill="#EF4444" stroke="#000000" strokeWidth="2.5" />
      <text x="142" y="65.5" fontFamily="Fredoka, sans-serif" fontWeight="900" fontSize="7.5" fill="#FFFFFF" textAnchor="middle">
        18
      </text>

      {/* Node 10 (Green) */}
      <circle cx="116" cy="80" r="8.5" fill="#22C55E" stroke="#000000" strokeWidth="2.5" />
      <text x="116" y="84" fontFamily="Fredoka, sans-serif" fontWeight="900" fontSize="8" fill="#FFFFFF" textAnchor="middle">
        10
      </text>

      {/* Node 5 (Yellow) */}
      <circle cx="100" cy="100" r="8" fill="#FFE135" stroke="#000000" strokeWidth="2.5" />
      <text x="100" y="103.5" fontFamily="Fredoka, sans-serif" fontWeight="900" fontSize="8" fill="#000000" textAnchor="middle">
        5
      </text>

      {/* Node 15 (Red) */}
      <circle cx="130" cy="102" r="9" fill="#EF4444" stroke="#000000" strokeWidth="2.5" />
      <text x="130" y="106" fontFamily="Fredoka, sans-serif" fontWeight="900" fontSize="8.5" fill="#FFFFFF" textAnchor="middle">
        15
      </text>

      {/* Tree Accent Sparks */}
      <line x1="144" y1="36" x2="148" y2="33" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      <line x1="140" y1="84" x2="146" y2="86" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      <line x1="93" y1="82" x2="89" y2="85" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
