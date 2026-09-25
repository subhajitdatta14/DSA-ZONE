import React from 'react';
import { Clock, HardDrive, Info, Activity } from 'lucide-react';
import { LiveCodeDemonstrator } from './LiveCodeDemonstrator';

interface ComplexityPanelProps {
  operationName: string;
  operationDescription?: string;
  description?: string;
  bestTime?: string;
  bestComplexity?: string;
  worstTime?: string;
  worstComplexity?: string;
  spaceComplexity: string;
  activeStepMessage?: string;
  stats?: {
    elementCount: number;
    comparisons: number;
    shifts: number;
  };
  customStats?: { label: string; value: string | number }[];
  // Live Code Demonstration Props
  topicId?: string;
  operation?: string;
  currentStepIndex?: number;
  totalSteps?: number;
  isPlaying?: boolean;
}

export const ComplexityPanel: React.FC<ComplexityPanelProps> = ({
  operationName,
  operationDescription,
  description,
  bestTime,
  bestComplexity,
  worstTime,
  worstComplexity,
  spaceComplexity,
  activeStepMessage,
  stats,
  customStats,
  topicId,
  operation,
  currentStepIndex = 0,
  totalSteps = 0,
  isPlaying = false,
}) => {
  const finalDesc = operationDescription || description || '';
  const finalBest = bestTime || bestComplexity || 'O(1)';
  const finalWorst = worstTime || worstComplexity || 'O(n)';

  // Infer topicId if not explicitly provided
  const inferTopicId = (): string => {
    if (topicId) return topicId;
    const nameUpper = (operationName || '').toUpperCase();
    if (nameUpper.includes('BFS')) return 'bfs';
    if (nameUpper.includes('DFS')) return 'dfs';
    if (nameUpper.includes('DIJKSTRA')) return 'dijkstra';
    if (nameUpper.includes('PRIM')) return 'prims';
    if (nameUpper.includes('KRUSKAL')) return 'kruskals';
    if (nameUpper.includes('PUSH') || nameUpper.includes('POP') || nameUpper.includes('STACK')) return 'stack';
    if (nameUpper.includes('ENQUEUE') || nameUpper.includes('DEQUEUE') || nameUpper.includes('QUEUE')) return 'queue';
    if (nameUpper.includes('HEAP')) return 'heap';
    if (nameUpper.includes('HASH') || nameUpper.includes('BUCKET')) return 'hash-table';
    if (nameUpper.includes('LINKED') || nameUpper.includes('NODE')) return 'linked-list';
    if (nameUpper.includes('AVL')) return 'avl-tree';
    if (nameUpper.includes('BST') || nameUpper.includes('TREE')) return 'binary-search-tree';
    if (nameUpper.includes('RECURSION') || nameUpper.includes('FACTORIAL')) return 'recursion';
    if (nameUpper.includes('GREEDY') || nameUpper.includes('ACTIVITY')) return 'greedy-algorithms';
    if (nameUpper.includes('DYNAMIC') || nameUpper.includes('MEMO')) return 'dynamic-programming';
    if (nameUpper.includes('BACKTRACK') || nameUpper.includes('QUEEN')) return 'backtracking';
    if (nameUpper.includes('LINEAR SEARCH')) return 'linear-search';
    if (nameUpper.includes('BINARY SEARCH')) return 'binary-search';
    return 'array';
  };

  const resolvedTopicId = inferTopicId();

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Live Code Demonstration (Java / C++) synchronized with picture demonstration */}
      <LiveCodeDemonstrator
        topicId={resolvedTopicId}
        operation={operation || operationName}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        stepMessage={activeStepMessage}
      />

      {/* 2. Operation Explanation & Complexity Panel */}
      <div className="flex flex-col gap-3.5 sm:gap-4 rounded-2xl border-2 border-black bg-white p-3.5 sm:p-5 shadow-[4px_4px_0px_#000]">
        {/* Operation Explanation Banner */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#FFE135]">
              <Info className="h-3.5 w-3.5 text-black stroke-[2.5]" />
            </div>
            <h4 className="font-comic text-xs font-bold uppercase tracking-wider text-black truncate">
              OPERATION: {operationName}
            </h4>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
            {finalDesc}
          </p>
        </div>

        {/* Live Active Step Narration with Comic Speech Styling */}
        {activeStepMessage && (
          <div className="flex items-start gap-2.5 rounded-xl border-2 border-black bg-[#FFFBEB] p-2.5 sm:p-3 text-xs text-slate-900 shadow-[2px_2px_0px_#000]">
            <Activity className="h-4 w-4 shrink-0 text-amber-600 mt-0.5 animate-pulse" />
            <div className="leading-relaxed font-mono text-[11px] sm:text-xs">
              <span className="font-bold font-comic text-black uppercase">ACTION:</span> {activeStepMessage}
            </div>
          </div>
        )}

        {/* Complexity Breakdown Grid (White/Comic styling) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 border-t-2 border-black/10 pt-3">
          {/* Time Complexity: Best */}
          <div className="rounded-xl border-2 border-black bg-[#F0FDF4] p-2.5 sm:p-3 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-800 font-comic uppercase">
              <Clock className="h-3.5 w-3.5" />
              <span>Time: Best Case</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-700">
                {finalBest}
              </span>
            </div>
          </div>

          {/* Time Complexity: Worst */}
          <div className="rounded-xl border-2 border-black bg-[#FEF2F2] p-2.5 sm:p-3 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-rose-800 font-comic uppercase">
              <Clock className="h-3.5 w-3.5" />
              <span>Time: Worst Case</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold font-mono text-rose-700">
                {finalWorst}
              </span>
            </div>
          </div>

          {/* Space Complexity */}
          <div className="rounded-xl border-2 border-black bg-[#EFF6FF] p-2.5 sm:p-3 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-blue-800 font-comic uppercase">
              <HardDrive className="h-3.5 w-3.5" />
              <span>Space Complexity</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold font-mono text-blue-700">
                {spaceComplexity}
              </span>
            </div>
          </div>
        </div>

        {/* Live Operation Stats */}
        {stats && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-black/10 pt-3 text-xs text-slate-700 font-mono tabular-nums">
            <div>Elements: <span className="text-black font-bold">{stats.elementCount}</span></div>
            <div>Comparisons: <span className="text-blue-700 font-bold">{stats.comparisons}</span></div>
            <div>Memory Shifts: <span className="text-amber-700 font-bold">{stats.shifts}</span></div>
          </div>
        )}

        {/* Custom Operation Stats */}
        {customStats && customStats.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t-2 border-black/10 pt-3 text-xs text-slate-700 font-mono tabular-nums">
            {customStats.map((stat, i) => (
              <div key={i}>
                {stat.label}: <span className="text-black font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
