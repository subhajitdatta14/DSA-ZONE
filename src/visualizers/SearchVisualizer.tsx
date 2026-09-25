import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Binary } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';

const SORTED_ARRAY = [4, 12, 19, 27, 35, 42, 58, 63, 74, 88];

interface Step {
  array: number[];
  currentIndex: number | null;
  lowIndex?: number;
  midIndex?: number;
  highIndex?: number;
  isFound: boolean;
  comparisons: number;
  actionDescription: string;
  pseudoCodeLine?: string;
}

interface SearchVisualizerProps {
  algorithmMode?: 'linear' | 'binary' | string;
  onOperationComplete?: () => void;
}

export const SearchVisualizer: React.FC<SearchVisualizerProps> = ({
  algorithmMode = 'binary',
  onOperationComplete,
}) => {
  const [mode, setMode] = useState<'binary' | 'linear'>(
    algorithmMode === 'linear' ? 'linear' : 'binary'
  );
  const [target, setTarget] = useState<string>('42');
  const [array] = useState<number[]>(SORTED_ARRAY);

  // Animation State
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(750);

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

  const currentStep = steps[currentStepIndex];

  const handleSearch = () => {
    const val = parseInt(target, 10);
    if (isNaN(val)) return;

    const newSteps: Step[] = [];
    let comps = 0;

    if (mode === 'linear') {
      let found = false;
      for (let i = 0; i < array.length; i++) {
        comps++;
        newSteps.push({
          array,
          currentIndex: i,
          isFound: array[i] === val,
          comparisons: comps,
          actionDescription: `Checking arr[${i}] = ${array[i]} against search target ${val}...`,
          pseudoCodeLine: 'if (arr[i] == target) return i;',
        });

        if (array[i] === val) {
          newSteps.push({
            array,
            currentIndex: i,
            isFound: true,
            comparisons: comps,
            actionDescription: `Match found! Element ${val} located at index ${i} after ${comps} step(s).`,
            pseudoCodeLine: 'return i; // Target match found',
          });
          found = true;
          break;
        }
      }

      if (!found) {
        newSteps.push({
          array,
          currentIndex: null,
          isFound: false,
          comparisons: comps,
          actionDescription: `Reached end of array. Element ${val} not found in collection.`,
          pseudoCodeLine: 'return -1; // Not found',
        });
      }
    } else {
      // Binary Search
      let low = 0;
      let high = array.length - 1;
      let found = false;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        comps++;

        newSteps.push({
          array,
          currentIndex: mid,
          lowIndex: low,
          midIndex: mid,
          highIndex: high,
          isFound: array[mid] === val,
          comparisons: comps,
          actionDescription: `Computing mid = ⌊(${low} + ${high}) / 2⌋ = ${mid}. Comparing arr[mid]=${array[mid]} with target ${val}...`,
          pseudoCodeLine: 'int mid = low + (high - low) / 2;',
        });

        if (array[mid] === val) {
          newSteps.push({
            array,
            currentIndex: mid,
            lowIndex: low,
            midIndex: mid,
            highIndex: high,
            isFound: true,
            comparisons: comps,
            actionDescription: `Success! Target ${val} located at index ${mid} with only ${comps} comparison(s) in O(log n) time!`,
            pseudoCodeLine: 'return mid; // Target match found',
          });
          found = true;
          break;
        } else if (array[mid] < val) {
          newSteps.push({
            array,
            currentIndex: mid,
            lowIndex: mid + 1,
            midIndex: mid,
            highIndex: high,
            isFound: false,
            comparisons: comps,
            actionDescription: `${array[mid]} < ${val}: Target is in right half. Discarding left range [${low}..${mid}]. Updating low = ${mid + 1}.`,
            pseudoCodeLine: 'low = mid + 1;',
          });
          low = mid + 1;
        } else {
          newSteps.push({
            array,
            currentIndex: mid,
            lowIndex: low,
            midIndex: mid,
            highIndex: mid - 1,
            isFound: false,
            comparisons: comps,
            actionDescription: `${array[mid]} > ${val}: Target is in left half. Discarding right range [${mid}..${high}]. Updating high = ${mid - 1}.`,
            pseudoCodeLine: 'high = mid - 1;',
          });
          high = mid - 1;
        }
      }

      if (!found) {
        newSteps.push({
          array,
          currentIndex: null,
          isFound: false,
          comparisons: comps,
          actionDescription: `Search completed: low > high. Target ${val} is not present in sorted array.`,
          pseudoCodeLine: 'return -1; // Not found',
        });
      }
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-comic font-bold text-black">Algorithm:</span>
            <button
              onClick={() => setMode('binary')}
              className={`rounded-xl px-3 py-1.5 text-xs font-comic font-bold transition-all cursor-pointer ${
                mode === 'binary'
                  ? 'border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]'
                  : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
              }`}
            >
              Binary Search (O(log n))
            </button>
            <button
              onClick={() => setMode('linear')}
              className={`rounded-xl px-3 py-1.5 text-xs font-comic font-bold transition-all cursor-pointer ${
                mode === 'linear'
                  ? 'border-2 border-black bg-[#22C55E] text-white shadow-[2px_2px_0px_#000]'
                  : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
              }`}
            >
              Linear Search (O(n))
            </button>
          </div>

          <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
            <span className="text-xs font-comic font-bold text-black">Target:</span>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-3.5 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
              <span>Search Target</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setSteps([]);
            setCurrentStepIndex(0);
          }}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Search Stage (Pure White Comic Style like Array) */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-6 shadow-[5px_5px_0px_#000]">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 text-xs font-comic font-bold text-black">
          <div className="flex items-center gap-2 bg-[#FFE135] px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            <Binary className="h-4 w-4 text-black stroke-[2.5]" />
            <span>
              {mode === 'binary' ? 'Binary Search (Divide & Conquer on Sorted Array)' : 'Linear Sequential Search'}
            </span>
          </div>
          <div className="bg-slate-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            Comparisons: <strong className="text-black font-mono font-black">{currentStep ? currentStep.comparisons : 0}</strong>
          </div>
        </div>

        {/* Array Items Display */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-8">
          {array.map((val, idx) => {
            const isMid = currentStep?.midIndex === idx;
            const isLow = currentStep?.lowIndex === idx;
            const isHigh = currentStep?.highIndex === idx;
            const isCur = currentStep?.currentIndex === idx;
            const isPruned =
              mode === 'binary' &&
              currentStep &&
              currentStep.lowIndex !== undefined &&
              currentStep.highIndex !== undefined &&
              (idx < currentStep.lowIndex || idx > currentStep.highIndex);
            const isFound = currentStep?.isFound && isCur;

            return (
              <div key={idx} className="flex flex-col items-center shrink-0">
                {/* Pointers Label */}
                <div className="h-6 text-[10px] font-comic font-black flex gap-1">
                  {isLow && <span className="bg-[#22C55E] text-white px-1.5 py-0.5 rounded border border-black">LOW</span>}
                  {isMid && <span className="bg-[#FFE135] text-black px-1.5 py-0.5 rounded border border-black">MID</span>}
                  {isHigh && <span className="bg-purple-600 text-white px-1.5 py-0.5 rounded border border-black">HIGH</span>}
                  {mode === 'linear' && isCur && <span className="bg-[#FFE135] text-black px-1.5 py-0.5 rounded border border-black">PTR</span>}
                </div>

                {/* Box */}
                <div
                  className={`flex h-16 w-14 sm:h-20 sm:w-16 flex-col items-center justify-center rounded-2xl border-2 border-black transition-all duration-300 ${
                    isFound
                      ? 'bg-[#22C55E] text-white shadow-[4px_4px_0px_#000] scale-110 -translate-y-1'
                      : isMid
                      ? 'bg-[#FFE135] text-black shadow-[4px_4px_0px_#000] scale-105'
                      : isPruned
                      ? 'border-dashed border-slate-300 bg-slate-100 opacity-40 text-slate-400'
                      : 'bg-white text-black shadow-[3px_3px_0px_#000]'
                  }`}
                >
                  <span className={`font-comic text-lg sm:text-xl font-black ${isFound ? 'text-white' : 'text-black'}`}>
                    {val}
                  </span>
                  <span className={`text-[10px] font-mono font-bold mt-1 ${isFound ? 'text-emerald-100' : 'text-slate-500'}`}>
                    idx {idx}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

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
          else handleSearch();
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

      {/* Complexity and Specs with Live Code Demonstration */}
      <ComplexityPanel
        topicId={mode === 'binary' ? 'binary-search' : 'linear-search'}
        operation={mode === 'binary' ? 'binary' : 'linear'}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName={mode === 'binary' ? 'Binary Search' : 'Linear Search'}
        description={
          mode === 'binary'
            ? 'Divide-and-conquer algorithm halving the search space at each comparison. Requires monotonically sorted input.'
            : 'Sequential scanning of elements from start to finish. Works on unsorted inputs with O(n) worst-case time.'
        }
        bestComplexity={mode === 'binary' ? 'O(1)' : 'O(1)'}
        worstComplexity={mode === 'binary' ? 'O(log n)' : 'O(n)'}
        spaceComplexity="O(1)"
        customStats={[
          { label: 'Array Size', value: array.length },
          { label: 'Algorithm', value: mode === 'binary' ? 'Binary' : 'Linear' },
          { label: 'Comparisons Made', value: currentStep ? currentStep.comparisons : 0 },
        ]}
      />
    </div>
  );
};
