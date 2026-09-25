import React, { useEffect, useState } from 'react';
import { UserProgress } from '../types/dsa';
import { X, CheckCircle2, Play, Flame, BarChart3, RotateCcw } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  totalQuestions: number;
  onResetAllProgress?: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  totalQuestions,
  onResetAllProgress,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setShowConfirmReset(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const practiced = progress?.practicedQuestions || [];
  const correctAnswers = practiced.filter((p) => p.isCorrect).length;
  const answeredTotal = practiced.length;
  const accuracy = answeredTotal > 0 ? Math.round((correctAnswers / answeredTotal) * 100) : 0;
  const operationsCount = progress?.operationsRunCount || 0;
  const completedTopicsCount = progress?.completedTopics?.length || 0;
  const topicsPercentage = Math.min(100, Math.round((completedTopicsCount / 21) * 100));

  const handleResetConfirm = () => {
    if (onResetAllProgress) {
      onResetAllProgress();
    }
    setShowConfirmReset(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex flex-col w-full max-w-md rounded-2xl border-3 border-black bg-white shadow-[8px_8px_0px_#000] overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black px-6 py-4 bg-[#FFE135]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000]">
              <BarChart3 className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-comic text-lg font-bold text-black">
                Learning Progress
              </h3>
              <p className="font-mono text-[10px] font-bold text-slate-800">
                DSA ZONE Student Record
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 active:translate-y-0.5 cursor-pointer transition-transform"
            aria-label="Close Progress Modal"
          >
            <X className="h-4 w-4 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border-2 border-black bg-[#FFFBEB] p-3 text-center shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-center gap-1 text-[10px] font-comic font-bold text-amber-800 mb-1">
                <Play className="h-3 w-3 fill-amber-800" />
                <span>OPS RUN</span>
              </div>
              <div className="font-comic text-2xl font-black text-black">
                {operationsCount}
              </div>
              <span className="text-[9px] font-bold text-slate-500 font-mono">Animations</span>
            </div>

            <div className="rounded-xl border-2 border-black bg-[#F0FDF4] p-3 text-center shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-center gap-1 text-[10px] font-comic font-bold text-emerald-800 mb-1">
                <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
                <span>SOLVED</span>
              </div>
              <div className="font-comic text-2xl font-black text-emerald-700">
                {correctAnswers}
              </div>
              <span className="text-[9px] font-bold text-slate-500 font-mono">of {totalQuestions}</span>
            </div>

            <div className="rounded-xl border-2 border-black bg-[#FEF2F2] p-3 text-center shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-center gap-1 text-[10px] font-comic font-bold text-rose-800 mb-1">
                <Flame className="h-3 w-3 stroke-[2.5]" />
                <span>ACCURACY</span>
              </div>
              <div className="font-comic text-2xl font-black text-rose-700">
                {accuracy}%
              </div>
              <span className="text-[9px] font-bold text-slate-500 font-mono">Score Rate</span>
            </div>
          </div>

          {/* Topics Explored Breakdown */}
          <div className="rounded-xl border-2 border-black bg-slate-50 p-4 space-y-2 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center justify-between text-xs font-comic font-bold text-black">
              <span>Topics Explored</span>
              <span>
                {completedTopicsCount} / 21 Mastered ({topicsPercentage}%)
              </span>
            </div>
            <div className="h-3 w-full rounded-full border-2 border-black bg-white overflow-hidden">
              <div
                className="h-full bg-[#22C55E] transition-all duration-500"
                style={{
                  width: `${topicsPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* Reset progress prompt */}
          {onResetAllProgress && (
            <div className="pt-1">
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center justify-center gap-1.5 mx-auto text-[11px] font-comic font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3 stroke-[2.5]" />
                  <span>Reset All Progress Records</span>
                </button>
              ) : (
                <div className="rounded-xl border-2 border-red-500 bg-red-50 p-3 text-center space-y-2 animate-in fade-in">
                  <p className="text-xs font-comic font-bold text-red-700">
                    Are you sure you want to reset all progress records?
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handleResetConfirm}
                      className="rounded-lg border-2 border-black bg-red-500 px-3 py-1 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:bg-red-600 active:translate-y-0.5 cursor-pointer"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="rounded-lg border-2 border-black bg-white px-3 py-1 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 active:translate-y-0.5 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full rounded-xl border-2 border-black bg-[#FFE135] py-2.5 font-comic text-sm font-bold text-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer transition-transform"
          >
            Keep Learning
          </button>
        </div>
      </div>
    </div>
  );
};
