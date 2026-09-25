import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  currentStep,
  totalSteps,
  speedMs,
  onSpeedChange,
  disabled = false,
}) => {
  const hasSteps = totalSteps > 0;
  const isAtStart = currentStep <= 0;
  const isAtEnd = currentStep >= totalSteps - 1;

  const getSliderValue = (ms: number) => {
    if (ms >= 1200) return 1;
    if (ms >= 850) return 2;
    if (ms >= 550) return 3;
    if (ms >= 350) return 4;
    return 5;
  };

  const handleSliderChange = (val: number) => {
    switch (val) {
      case 1:
        onSpeedChange(1300);
        break;
      case 2:
        onSpeedChange(900);
        break;
      case 3:
        onSpeedChange(600);
        break;
      case 4:
        onSpeedChange(380);
        break;
      case 5:
        onSpeedChange(200);
        break;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
      {/* Playback Action Buttons */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">
        {isPlaying ? (
          <button
            onClick={onPause}
            disabled={disabled}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-3.5 sm:px-4 py-2 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 min-h-[38px] cursor-pointer"
            title="Pause animation"
          >
            <Pause className="h-4 w-4 fill-black stroke-black" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={disabled}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#22C55E] px-3.5 sm:px-4 py-2 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 min-h-[38px] cursor-pointer"
            title="Play animation"
          >
            <Play className="h-4 w-4 fill-white stroke-white" />
            <span>Play</span>
          </button>
        )}

        <button
          onClick={onStepBack}
          disabled={disabled || !hasSteps || isAtStart}
          className="flex h-9 w-9 sm:h-9 sm:w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 active:translate-y-0.5 min-h-[38px] min-w-[38px] cursor-pointer"
          title="Previous step"
        >
          <SkipBack className="h-4 w-4 stroke-[2.5]" />
        </button>

        <button
          onClick={onStepForward}
          disabled={disabled || !hasSteps || isAtEnd}
          className="flex h-9 w-9 sm:h-9 sm:w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 active:translate-y-0.5 min-h-[38px] min-w-[38px] cursor-pointer"
          title="Next step"
        >
          <SkipForward className="h-4 w-4 stroke-[2.5]" />
        </button>

        <button
          onClick={onReset}
          disabled={disabled}
          className="flex items-center gap-1 rounded-xl border-2 border-black bg-slate-100 px-3 py-2 font-comic text-xs font-bold text-slate-800 shadow-[2px_2px_0px_#000] transition-transform hover:-translate-y-0.5 hover:bg-slate-200 active:translate-y-0.5 min-h-[38px] cursor-pointer"
          title="Reset animation"
        >
          <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Reset</span>
        </button>
      </div>

      {/* Center: Step Count Badge */}
      <div className="font-comic text-xs font-bold text-slate-700 text-center">
        {hasSteps ? (
          <span className="inline-block rounded-lg border-2 border-black bg-[#FFFBEB] px-3 py-1 shadow-[2px_2px_0px_#000]">
            Step <strong className="text-black">{currentStep + 1}</strong> of {totalSteps}
          </span>
        ) : (
          <span className="text-slate-400">Ready for Operation</span>
        )}
      </div>

      {/* Right: Animation Speed Slider ("Slow -------- Fast") */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto">
        <span className="text-[11px] font-bold text-slate-600 font-comic uppercase shrink-0">Speed:</span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] font-bold text-slate-500 font-mono">Slow</span>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={getSliderValue(speedMs)}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-20 sm:w-28 accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg touch-manipulation"
          />
          <span className="text-[10px] font-bold text-slate-500 font-mono">Fast</span>
        </div>
      </div>
    </div>
  );
};
