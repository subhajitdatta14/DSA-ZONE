import React, { useState } from 'react';
import { Plus, Search, Edit3, RotateCcw } from 'lucide-react';
import { ComicBurst } from './ComicBadge';

export const VisualizationPreview: React.FC = () => {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50]);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(2); // 30 is highlighted initially
  const [annotation, setAnnotation] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerSearch = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnnotation(null);

    // Scan through elements 0, 1, 2
    let step = 0;
    const targetVal = 30;
    const interval = setInterval(() => {
      setHighlightIndex(step);
      if (array[step] === targetVal) {
        clearInterval(interval);
        setAnnotation('FOUND!');
        setIsAnimating(false);
      } else if (step >= array.length - 1) {
        clearInterval(interval);
        setAnnotation('NOT FOUND');
        setIsAnimating(false);
      } else {
        step++;
      }
    }, 380);
  };

  const triggerInsert = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnnotation('SHIFT!');

    setTimeout(() => {
      // Insert 25 at index 2
      const newArr = [10, 20, 25, 30, 40, 50];
      setArray(newArr);
      setHighlightIndex(2);
      setAnnotation('INSERTED!');
      setIsAnimating(false);
    }, 600);
  };

  const triggerUpdate = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setHighlightIndex(2);
    setAnnotation('UPDATING...');

    setTimeout(() => {
      const newArr = [...array];
      newArr[2] = newArr[2] === 99 ? 30 : 99;
      setArray(newArr);
      setAnnotation('UPDATED!');
      setIsAnimating(false);
    }, 500);
  };

  const handleReset = () => {
    setArray([10, 20, 30, 40, 50]);
    setHighlightIndex(2);
    setAnnotation(null);
    setIsAnimating(false);
  };

  return (
    <div className="relative w-full max-w-md rounded-2xl border-3 border-black bg-white p-5 shadow-[6px_6px_0px_#000] overflow-hidden">
      {/* Comic Header Ribbon */}
      <div className="relative mb-3 flex items-center justify-between">
        <div className="relative inline-block">
          <div className="rounded-lg border-2 border-black bg-[#FFE135] px-3 py-1 font-comic text-xs sm:text-sm font-bold tracking-wider text-black shadow-[2px_2px_0px_#000] uppercase">
            VISUALIZATION PREVIEW
          </div>
          {/* Action rays / doodle marks */}
          <div className="absolute -top-3 -right-3 text-black font-extrabold text-xs select-none">
            \ | /
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-black transition-colors"
          title="Reset preview"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <p className="text-xs font-semibold text-slate-600 mb-4 font-mono">
        Insert · Search · Update
      </p>

      {/* Array Elements Display */}
      <div className="relative my-4 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar touch-scroll">
        {array.map((value, idx) => {
          const isHighlighted = highlightIndex === idx;
          return (
            <div
              key={idx}
              className={`relative flex h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border-2 border-black font-mono text-xs xs:text-sm sm:text-base font-bold transition-all duration-300 ${
                isHighlighted
                  ? 'bg-[#FFE135] scale-105 shadow-[3px_3px_0px_#000] -translate-y-1'
                  : 'bg-white shadow-[2px_2px_0px_#000]'
              }`}
            >
              <span>{value}</span>

              {/* Index label below */}
              <span className="absolute -bottom-5 text-[9px] sm:text-[10px] font-mono text-slate-500">
                {idx}
              </span>
            </div>
          );
        })}
      </div>

      {/* Comic Annotation Bubble */}
      <div className="h-8 flex items-center justify-center my-2">
        {annotation && (
          <div className="animate-bounce">
            <ComicBurst
              text={annotation}
              variant={
                annotation === 'FOUND!'
                  ? 'green'
                  : annotation === 'SHIFT!'
                  ? 'yellow'
                  : 'yellow'
              }
              size="md"
            />
          </div>
        )}
      </div>

      {/* 3 Circular Comic Action Buttons (Yellow, Green, Red) */}
      <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-around">
        <button
          onClick={triggerInsert}
          disabled={isAnimating}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5">
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-black">Insert</span>
        </button>

        <button
          onClick={triggerSearch}
          disabled={isAnimating}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-[#22C55E] text-white shadow-[2px_2px_0px_#000] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5">
            <Search className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-black">Search</span>
        </button>

        <button
          onClick={triggerUpdate}
          disabled={isAnimating}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-[#EF4444] text-white shadow-[2px_2px_0px_#000] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5">
            <Edit3 className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-black">Update</span>
        </button>
      </div>
    </div>
  );
};
