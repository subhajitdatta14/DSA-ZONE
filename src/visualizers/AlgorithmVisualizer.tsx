import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';

interface Step {
  actionDescription: string;
  pseudoCodeLine?: string;
  // Recursion
  callStack?: Array<{ name: string; returned?: number }>;
  // Greedy
  greedyRemaining?: number;
  greedyPicked?: number[];
  // Dynamic Programming
  dpTable?: Array<{ index: number; val: number | null; computed: boolean }>;
  // Backtracking (N-Queens)
  board?: number[];
  currentCell?: [number, number];
}

interface AlgorithmVisualizerProps {
  algorithmType: 'recursion' | 'greedy-algorithms' | 'dynamic-programming' | 'backtracking';
  onOperationComplete?: () => void;
}

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  algorithmType,
  onOperationComplete,
}) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(800);

  useEffect(() => {
    let timer: any;
    if (isPlaying && steps.length > 0) {
      if (currentStepIndex < steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, speedMs);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, speedMs]);

  // Generate steps based on paradigm
  const buildSteps = () => {
    const newSteps: Step[] = [];

    if (algorithmType === 'recursion') {
      newSteps.push({
        callStack: [{ name: 'fact(4)' }],
        actionDescription: 'Invoke fact(4): 4 > 1, so recurse with 4 * fact(3). Push frame to Call Stack.',
        pseudoCodeLine: 'return n * fact(n - 1);',
      });
      newSteps.push({
        callStack: [{ name: 'fact(4)' }, { name: 'fact(3)' }],
        actionDescription: 'Invoke fact(3): 3 > 1, so recurse with 3 * fact(2). Push frame.',
        pseudoCodeLine: 'return n * fact(n - 1);',
      });
      newSteps.push({
        callStack: [{ name: 'fact(4)' }, { name: 'fact(3)' }, { name: 'fact(2)' }],
        actionDescription: 'Invoke fact(2): 2 > 1, so recurse with 2 * fact(1). Push frame.',
        pseudoCodeLine: 'return n * fact(n - 1);',
      });
      newSteps.push({
        callStack: [
          { name: 'fact(4)' },
          { name: 'fact(3)' },
          { name: 'fact(2)' },
          { name: 'fact(1)', returned: 1 },
        ],
        actionDescription: 'BASE CASE HIT! fact(1) evaluates n <= 1, returns 1. Start unwinding call stack.',
        pseudoCodeLine: 'if (n <= 1) return 1;',
      });
      newSteps.push({
        callStack: [{ name: 'fact(4)' }, { name: 'fact(3)' }, { name: 'fact(2)', returned: 2 }],
        actionDescription: 'fact(2) resolves: 2 * 1 = 2. Pops stack frame.',
        pseudoCodeLine: 'return 2 * 1; // 2',
      });
      newSteps.push({
        callStack: [{ name: 'fact(4)' }, { name: 'fact(3)', returned: 6 }],
        actionDescription: 'fact(3) resolves: 3 * 2 = 6. Pops stack frame.',
        pseudoCodeLine: 'return 3 * 2; // 6',
      });
      newSteps.push({
        callStack: [{ name: 'fact(4)', returned: 24 }],
        actionDescription: 'fact(4) resolves: 4 * 6 = 24. Final recursion solution computed!',
        pseudoCodeLine: 'return 4 * 6; // 24',
      });
    } else if (algorithmType === 'greedy-algorithms') {
      newSteps.push({
        greedyRemaining: 68,
        greedyPicked: [],
        actionDescription: 'Target Change: 68¢. Available denominations: [25¢, 10¢, 5¢, 1¢].',
        pseudoCodeLine: 'while (remaining > 0) pickLargestCoin();',
      });
      newSteps.push({
        greedyRemaining: 43,
        greedyPicked: [25],
        actionDescription: 'Greedy choice: Take largest possible coin (25¢). Remaining: 43¢.',
        pseudoCodeLine: 'coins.push(25); remaining -= 25;',
      });
      newSteps.push({
        greedyRemaining: 18,
        greedyPicked: [25, 25],
        actionDescription: 'Greedy choice: Take another 25¢ coin. Remaining: 18¢.',
        pseudoCodeLine: 'coins.push(25); remaining -= 25;',
      });
      newSteps.push({
        greedyRemaining: 8,
        greedyPicked: [25, 25, 10],
        actionDescription: '25¢ too large for 18¢. Locally optimal choice is 10¢ dime. Remaining: 8¢.',
        pseudoCodeLine: 'coins.push(10); remaining -= 10;',
      });
      newSteps.push({
        greedyRemaining: 3,
        greedyPicked: [25, 25, 10, 5],
        actionDescription: 'Next largest valid is 5¢ nickel. Remaining: 3¢.',
        pseudoCodeLine: 'coins.push(5); remaining -= 5;',
      });
      newSteps.push({
        greedyRemaining: 0,
        greedyPicked: [25, 25, 10, 5, 1, 1, 1],
        actionDescription: 'Added three 1¢ pennies. Remaining: 0¢! Minimum coin count obtained greedy-style.',
        pseudoCodeLine: 'return coins; // [25, 25, 10, 5, 1, 1, 1]',
      });
    } else if (algorithmType === 'dynamic-programming') {
      const dpInit = [
        { index: 0, val: 0, computed: true },
        { index: 1, val: 1, computed: true },
        { index: 2, val: null, computed: false },
        { index: 3, val: null, computed: false },
        { index: 4, val: null, computed: false },
        { index: 5, val: null, computed: false },
      ];

      newSteps.push({
        dpTable: dpInit,
        actionDescription: 'Base Cases: dp[0] = 0, dp[1] = 1. Prepopulate table to prevent recomputations.',
        pseudoCodeLine: 'dp[0] = 0; dp[1] = 1;',
      });

      const copy2 = JSON.parse(JSON.stringify(dpInit));
      copy2[2] = { index: 2, val: 1, computed: true };
      newSteps.push({
        dpTable: copy2,
        actionDescription: 'Compute dp[2] = dp[1] + dp[0] = 1 + 0 = 1. Constant time table lookup!',
        pseudoCodeLine: 'dp[i] = dp[i-1] + dp[i-2];',
      });

      const copy3 = JSON.parse(JSON.stringify(copy2));
      copy3[3] = { index: 3, val: 2, computed: true };
      newSteps.push({
        dpTable: copy3,
        actionDescription: 'Compute dp[3] = dp[2] + dp[1] = 1 + 1 = 2.',
        pseudoCodeLine: 'dp[i] = dp[i-1] + dp[i-2];',
      });

      const copy4 = JSON.parse(JSON.stringify(copy3));
      copy4[4] = { index: 4, val: 3, computed: true };
      newSteps.push({
        dpTable: copy4,
        actionDescription: 'Compute dp[4] = dp[3] + dp[2] = 2 + 1 = 3.',
        pseudoCodeLine: 'dp[i] = dp[i-1] + dp[i-2];',
      });

      const copy5 = JSON.parse(JSON.stringify(copy4));
      copy5[5] = { index: 5, val: 5, computed: true };
      newSteps.push({
        dpTable: copy5,
        actionDescription: 'Compute dp[5] = dp[4] + dp[3] = 3 + 2 = 5. O(n) linear time with O(1) transitions.',
        pseudoCodeLine: 'return dp[5]; // Result is 5',
      });
    } else {
      // Backtracking: 4-Queens
      newSteps.push({
        board: [1, -1, -1, -1],
        currentCell: [0, 1],
        actionDescription: 'Row 0: Placed Queen at (0, 1). Advancing to Row 1.',
        pseudoCodeLine: 'if (isValid(r, c)) placeQueen(r, c);',
      });
      newSteps.push({
        board: [1, 3, -1, -1],
        currentCell: [1, 3],
        actionDescription: 'Row 1: Placed Queen at (1, 3). Advancing to Row 2.',
        pseudoCodeLine: 'solveNQueens(row + 1);',
      });
      newSteps.push({
        board: [1, 3, 0, -1],
        currentCell: [2, 0],
        actionDescription: 'Row 2: Placed Queen at (2, 0). Advancing to Row 3.',
        pseudoCodeLine: 'solveNQueens(row + 1);',
      });
      newSteps.push({
        board: [1, 3, 0, 2],
        currentCell: [3, 2],
        actionDescription: 'Row 3: Placed Queen at (3, 2). Complete non-conflicting N-Queens solution found!',
        pseudoCodeLine: 'return true; // Valid placement',
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  useEffect(() => {
    buildSteps();
  }, [algorithmType]);

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-comic font-bold text-black">Paradigm:</span>
          <span className="rounded-xl border-2 border-black bg-[#FFE135] px-3 py-1 text-xs font-comic font-black text-black uppercase shadow-[2px_2px_0px_#000]">
            {algorithmType.replace('-', ' ')}
          </span>
        </div>

        <button
          onClick={buildSteps}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Re-run Simulation</span>
        </button>
      </div>

      {/* Main Stage (Pure White Comic Style like Array) */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-6 shadow-[5px_5px_0px_#000]">
        {/* Recursion View */}
        {algorithmType === 'recursion' && (
          <div className="flex flex-col items-center justify-center py-4">
            <h4 className="text-xs font-comic font-black text-black mb-3 uppercase tracking-wider">
              Call Stack Memory Frames (Pushing & Unwinding Factorial(4)):
            </h4>
            <div className="flex flex-col-reverse items-center gap-2 w-64">
              {currentStep?.callStack && currentStep.callStack.length > 0 ? (
                currentStep.callStack.map((frame, idx) => (
                  <div
                    key={idx}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-[#FFE135] px-4 py-2 font-comic text-xs font-black text-black shadow-[2px_2px_0px_#000]"
                  >
                    <span>{frame.name}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-black text-black">
                      {frame.returned !== undefined ? `ret: ${frame.returned}` : 'active'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs font-comic font-bold text-slate-400">[ Call Stack Empty ]</div>
              )}
            </div>
          </div>
        )}

        {/* Greedy View */}
        {algorithmType === 'greedy-algorithms' && (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="flex items-center gap-4 text-xs font-comic font-bold">
              <span className="text-slate-700">Target: 68¢</span>
              <span className="bg-[#FFE135] px-2.5 py-1 rounded-lg border-2 border-black text-black font-black shadow-[1px_1px_0px_#000]">
                Remaining: {currentStep ? currentStep.greedyRemaining : 68}¢
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {currentStep?.greedyPicked?.map((coin, idx) => (
                <div
                  key={idx}
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-[#FFE135] font-comic text-base font-black text-black shadow-[3px_3px_0px_#000]"
                >
                  {coin}¢
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Programming Tabulation Table View */}
        {algorithmType === 'dynamic-programming' && (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider">
              Bottom-Up DP Table (Fibonacci State Space):
            </h4>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentStep?.dpTable?.map((cell, idx) => (
                <div
                  key={idx}
                  className={`flex h-16 w-14 flex-col items-center justify-center rounded-xl border-2 border-black transition-all ${
                    cell.computed
                      ? 'bg-[#22C55E] text-white shadow-[3px_3px_0px_#000] scale-105'
                      : 'bg-slate-50 text-slate-400 shadow-[1px_1px_0px_#000]'
                  }`}
                >
                  <span className={`text-xl font-comic font-black ${cell.computed ? 'text-white' : 'text-slate-400'}`}>
                    {cell.val !== null ? cell.val : '—'}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${cell.computed ? 'text-emerald-100' : 'text-slate-500'}`}>
                    dp[{cell.index}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backtracking Chessboard View */}
        {algorithmType === 'backtracking' && (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider">
              4-Queens Backtracking Board:
            </h4>
            <div className="grid grid-cols-4 gap-1.5 rounded-2xl border-2 border-black bg-slate-100 p-3 shadow-[4px_4px_0px_#000]">
              {Array.from({ length: 16 }).map((_, idx) => {
                const r = Math.floor(idx / 4);
                const c = idx % 4;
                const isQueen = currentStep?.board && currentStep.board[r] === c;
                const isDark = (r + c) % 2 === 1;

                return (
                  <div
                    key={idx}
                    className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border-2 border-black font-comic text-2xl font-black transition-all ${
                      isQueen
                        ? 'bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]'
                        : isDark
                        ? 'bg-slate-200 text-transparent'
                        : 'bg-white text-transparent'
                    }`}
                  >
                    {isQueen ? '♛' : ''}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentStep && (
          <div className="rounded-xl border-2 border-black bg-amber-50 p-3 text-xs font-comic text-black shadow-[2px_2px_0px_#000]">
            <span className="font-black text-black">{currentStep.actionDescription}</span>
            {currentStep.pseudoCodeLine && (
              <div className="text-amber-900 font-mono font-bold text-[11px] mt-1">
                &gt; {currentStep.pseudoCodeLine}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animation Controls */}
      <AnimationControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => {
          if (steps.length > 0) setIsPlaying(true);
          else buildSteps();
        }}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
        onStepBack={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIndex(0);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
      />

      {/* Complexity Panel with Live Code Demonstration */}
      <ComplexityPanel
        topicId={`algorithm:${algorithmType}`}
        operation={algorithmType}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName={`${algorithmType.replace('-', ' ').toUpperCase()} Visualizer`}
        description={
          algorithmType === 'recursion'
            ? 'Function calling itself with base condition checking to solve self-similar subproblems via Call Stack.'
            : algorithmType === 'greedy-algorithms'
            ? 'Problem-solving heuristic making locally optimal choices at each stage with the expectation of finding global optimum.'
            : algorithmType === 'dynamic-programming'
            ? 'Algorithmic optimization storing solutions to overlapping subproblems to prevent exponential redundant recomputations.'
            : 'Systematic depth-first candidate exploration discarding invalid search branches via constraint pruning.'
        }
        bestComplexity="Varies by Problem"
        worstComplexity="O(2^n) to O(n!)"
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Paradigm', value: algorithmType },
          { label: 'State Model', value: 'Interactive Timeline' },
        ]}
      />
    </div>
  );
};
