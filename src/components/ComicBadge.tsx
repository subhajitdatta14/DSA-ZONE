import React from 'react';

interface ComicBurstProps {
  text: string;
  variant?: 'yellow' | 'green' | 'red' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ComicBurst: React.FC<ComicBurstProps> = ({
  text,
  variant = 'yellow',
  className = '',
  size = 'md',
}) => {
  const bgColors = {
    yellow: 'bg-[#FFE135] text-black border-black',
    green: 'bg-[#22C55E] text-white border-black',
    red: 'bg-[#EF4444] text-white border-black',
    white: 'bg-white text-black border-black',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-extrabold',
  };

  return (
    <span
      className={`inline-flex items-center font-comic font-bold uppercase tracking-wider border-2 rounded-lg shadow-[2px_2px_0px_#000] rotate-[-2deg] transition-transform hover:rotate-0 select-none ${bgColors[variant]} ${sizes[size]} ${className}`}
    >
      {text}
    </span>
  );
};

interface SpeechBubbleProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'white' | 'green';
  tailPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  children,
  variant = 'white',
  tailPosition = 'bottom-left',
  className = '',
}) => {
  const bg = {
    white: 'bg-white text-slate-900 border-black',
    yellow: 'bg-[#FFFBEB] text-slate-900 border-black',
    green: 'bg-[#F0FDF4] text-slate-900 border-black',
  };

  return (
    <div
      className={`relative rounded-xl border-2 p-3 font-comic font-semibold shadow-[3px_3px_0px_#000] ${bg[variant]} ${className}`}
    >
      {children}
      {/* Speech bubble tail */}
      {tailPosition === 'bottom-left' && (
        <div
          className="absolute -bottom-2.5 left-4 h-0 w-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-black border-r-[2px] border-r-transparent"
        />
      )}
      {tailPosition === 'bottom-right' && (
        <div
          className="absolute -bottom-2.5 right-4 h-0 w-0 border-r-[10px] border-r-transparent border-t-[10px] border-t-black border-l-[2px] border-l-transparent"
        />
      )}
    </div>
  );
};

// Sketched action doodles like speed lines / highlight marks
export const ComicDoodleLines: React.FC<{ color?: string; className?: string }> = ({
  color = '#FFE135',
  className = '',
}) => (
  <svg
    className={`w-6 h-6 select-none ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 5L8 2M7 11L14 7M11 17L18 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
