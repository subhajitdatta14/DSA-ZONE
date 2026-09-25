import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, ArrowDownUp, Layers, Shuffle, RotateCcw, ListFilter } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';

const INITIAL_MAX_HEAP = [90, 75, 80, 45, 60, 55, 70];

const HEAP_PRESETS: Record<string, number[]> = {
  'Min (7)': [90, 75, 80, 45, 60, 55, 70],
  'Standard (10)': [95, 85, 90, 70, 80, 65, 75, 40, 50, 60],
  'Max (15)': [99, 90, 95, 80, 85, 75, 88, 60, 70, 65, 75, 50, 55, 68, 72],
};

function buildHeapFromList(list: number[], isMax: boolean): number[] {
  const arr = [...list];
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    let parent = i;
    while (true) {
      let target = parent;
      const left = 2 * parent + 1;
      const right = 2 * parent + 2;
      if (left < n && (isMax ? arr[left] > arr[target] : arr[left] < arr[target])) {
        target = left;
      }
      if (right < n && (isMax ? arr[right] > arr[target] : arr[right] < arr[target])) {
        target = right;
      }
      if (target !== parent) {
        const temp = arr[parent];
        arr[parent] = arr[target];
        arr[target] = temp;
        parent = target;
      } else {
        break;
      }
    }
  }
  return arr;
}

interface Step {
  activeIndices: number[];
  heapState: number[];
  actionDescription: string;
  pseudoCodeLine?: string;
}

interface HeapVisualizerProps {
  onOperationComplete?: () => void;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ onOperationComplete }) => {
  const [heap, setHeap] = useState<number[]>(INITIAL_MAX_HEAP);
  const [isMaxHeap, setIsMaxHeap] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('85');
  const [customListText, setCustomListText] = useState<string>(INITIAL_MAX_HEAP.join(', '));

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
  const displayedHeap = currentStep ? currentStep.heapState : heap;

  // 1. Insert (Sift-Up) with maximum 15 constraint
  const handleInsert = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val) || heap.length >= 15) return;

    const newSteps: Step[] = [];
    const arr = [...heap, val];
    let idx = arr.length - 1;

    newSteps.push({
      activeIndices: [idx],
      heapState: [...arr],
      actionDescription: `Appended value ${val} at the end of heap array (index ${idx}).`,
      pseudoCodeLine: 'heap.push(val); siftUp(heap.length - 1);',
    });

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const shouldSwap = isMaxHeap ? arr[idx] > arr[parentIdx] : arr[idx] < arr[parentIdx];

      newSteps.push({
        activeIndices: [idx, parentIdx],
        heapState: [...arr],
        actionDescription: `Comparing child (${arr[idx]}) with parent (${arr[parentIdx]}) at index ${parentIdx}.`,
        pseudoCodeLine: isMaxHeap ? 'if (arr[i] > arr[parent]) swap(i, parent);' : 'if (arr[i] < arr[parent]) swap(i, parent);',
      });

      if (shouldSwap) {
        const temp = arr[idx];
        arr[idx] = arr[parentIdx];
        arr[parentIdx] = temp;

        newSteps.push({
          activeIndices: [idx, parentIdx],
          heapState: [...arr],
          actionDescription: `Violates heap property! Swapped elements. New parent is ${arr[parentIdx]}.`,
          pseudoCodeLine: 'swap(arr[i], arr[parent]); i = parent;',
        });
        idx = parentIdx;
      } else {
        break;
      }
    }

    newSteps.push({
      activeIndices: [idx],
      heapState: [...arr],
      actionDescription: `Heap property restored! Element placed at index ${idx}.`,
      pseudoCodeLine: '// Sift-up complete',
    });

    setHeap(arr);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setCustomListText(arr.join(', '));
    if (onOperationComplete) onOperationComplete();
  };

  // 2. Extract Root (Sift-Down) with minimum 7 constraint
  const handleExtract = () => {
    if (heap.length <= 7) return;

    const newSteps: Step[] = [];
    const arr = [...heap];
    const rootVal = arr[0];

    newSteps.push({
      activeIndices: [0],
      heapState: [...arr],
      actionDescription: `Extracting root item ${rootVal}. Swapping with last element (${arr[arr.length - 1]}).`,
      pseudoCodeLine: 'swap(arr[0], arr[last]); pop();',
    });

    arr[0] = arr[arr.length - 1];
    arr.pop();

    if (arr.length > 0) {
      let idx = 0;
      while (true) {
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        let target = idx;

        if (left < arr.length) {
          const leftBetter = isMaxHeap ? arr[left] > arr[target] : arr[left] < arr[target];
          if (leftBetter) target = left;
        }

        if (right < arr.length) {
          const rightBetter = isMaxHeap ? arr[right] > arr[target] : arr[right] < arr[target];
          if (rightBetter) target = right;
        }

        if (target !== idx) {
          newSteps.push({
            activeIndices: [idx, target],
            heapState: [...arr],
            actionDescription: `Sift-Down: Swapping ${arr[idx]} with prioritized child ${arr[target]}.`,
            pseudoCodeLine: 'swap(arr[idx], arr[target]); idx = target;',
          });

          const temp = arr[idx];
          arr[idx] = arr[target];
          arr[target] = temp;
          idx = target;
        } else {
          break;
        }
      }
    }

    newSteps.push({
      activeIndices: [],
      heapState: [...arr],
      actionDescription: `Root extraction finished! Restored ${isMaxHeap ? 'Max' : 'Min'}-Heap condition.`,
      pseudoCodeLine: 'return root;',
    });

    setHeap(arr);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setCustomListText(arr.join(', '));
    if (onOperationComplete) onOperationComplete();
  };

  // Set new custom list with strict bounds: minimum 7, maximum 15
  const handleApplyCustomList = () => {
    let parsed = customListText
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length === 0) return;

    if (parsed.length < 7) {
      let val = Math.max(...parsed, 50) + 5;
      while (parsed.length < 7) {
        while (parsed.includes(val)) val += 5;
        parsed.push(val);
        val += 5;
      }
    } else if (parsed.length > 15) {
      parsed = parsed.slice(0, 15);
    }

    const newHeap = buildHeapFromList(parsed, isMaxHeap);
    setHeap(newHeap);
    setSteps([]);
    setCurrentStepIndex(0);
    setCustomListText(newHeap.join(', '));
  };

  // Generate random heap within [7, 15] range
  const handleRandomHeap = () => {
    const size = Math.floor(Math.random() * (15 - 7 + 1)) + 7; // 7 to 15
    const setVals = new Set<number>();
    while (setVals.size < size) {
      setVals.add(Math.floor(Math.random() * 92) + 5);
    }
    const generated = Array.from(setVals);
    const newHeap = buildHeapFromList(generated, isMaxHeap);
    setHeap(newHeap);
    setSteps([]);
    setCurrentStepIndex(0);
    setCustomListText(newHeap.join(', '));
  };

  // Tree coordinates helper for binary heap
  const getCoordinates = (index: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelIndex = index - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);
    const spacing = 580 / (totalInLevel + 1);
    const x = spacing * (levelIndex + 1);
    const y = 35 + level * 65;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-comic font-bold text-black flex items-center gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span>Presets:</span>
            </span>
            {Object.keys(HEAP_PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => {
                  const presetVals = buildHeapFromList(HEAP_PRESETS[name], isMaxHeap);
                  setHeap(presetVals);
                  setSteps([]);
                  setCurrentStepIndex(0);
                  setCustomListText(presetVals.join(', '));
                }}
                className={`rounded-lg border-2 border-black px-2.5 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                  JSON.stringify(heap) === JSON.stringify(HEAP_PRESETS[name])
                    ? 'bg-[#FFE135] text-black shadow-[1px_1px_0px_#000]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Custom List Input */}
          <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
            <span className="text-xs font-comic font-bold text-black">Custom:</span>
            <input
              type="text"
              value={customListText}
              onChange={(e) => setCustomListText(e.target.value)}
              placeholder="e.g. 90, 75, 80, 45, 60, 55, 70"
              className="w-36 sm:w-44 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleApplyCustomList}
              className="rounded-xl border-2 border-black bg-white px-3 py-1 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 transition-transform active:translate-y-0.5 cursor-pointer"
            >
              Set List (7-15)
            </button>
            <button
              onClick={handleRandomHeap}
              className="flex items-center gap-1 rounded-xl border-2 border-black bg-[#FFE135] px-2.5 py-1 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
              title="Generate a random heap with size between 7 and 15"
            >
              <Shuffle className="h-3 w-3 stroke-[2.5]" />
              <span>Random</span>
            </button>
          </div>

          <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
            <span className="text-xs font-comic font-bold text-black">Value:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleInsert}
              disabled={heap.length >= 15}
              className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-3.5 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-40 cursor-pointer"
              title={heap.length >= 15 ? 'Maximum 15 items reached' : 'Insert (Sift Up)'}
            >
              <ArrowDownToLine className="h-4 w-4 stroke-[2.5]" />
              <span>Insert</span>
            </button>
          </div>

          <button
            onClick={handleExtract}
            disabled={heap.length <= 7}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#EF4444] px-3.5 py-1.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-40 cursor-pointer"
            title={heap.length <= 7 ? 'Minimum 7 items required in Heap' : 'Extract Root (O(log n))'}
          >
            <ArrowUpFromLine className="h-4 w-4 stroke-[2.5]" />
            <span>Extract Root</span>
          </button>

          <button
            onClick={() => {
              const nextIsMax = !isMaxHeap;
              setIsMaxHeap(nextIsMax);
              const reordered = buildHeapFromList(heap, nextIsMax);
              setHeap(reordered);
              setSteps([]);
            }}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-purple-100 px-3 py-1.5 font-comic text-xs font-bold text-purple-900 shadow-[2px_2px_0px_#000] hover:bg-purple-200 transition-all cursor-pointer"
          >
            <ArrowDownUp className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Toggle: {!isMaxHeap ? 'Max-Heap' : 'Min-Heap'}</span>
          </button>
        </div>

        <button
          onClick={() => {
            const base = isMaxHeap ? INITIAL_MAX_HEAP : [10, 25, 30, 45, 50, 65, 80];
            setHeap(base);
            setSteps([]);
            setCurrentStepIndex(0);
            setCustomListText(base.join(', '));
          }}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3.5 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Dual Stage: Complete Binary Tree + 1D Array (Pure White Comic Style like Array) */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-6 shadow-[5px_5px_0px_#000]">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 text-xs font-comic font-bold text-black">
          <div className="flex items-center gap-2 bg-[#FFE135] px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            <Layers className="h-4 w-4 text-black stroke-[2.5]" />
            <span>Complete Binary Tree Representation ({isMaxHeap ? 'Max-Heap' : 'Min-Heap'})</span>
          </div>
          <div className="bg-slate-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            Formulas: <span className="font-mono text-slate-800">Left = 2i + 1 | Right = 2i + 2 | Parent = ⌊(i-1)/2⌋</span>
          </div>
        </div>

        {/* Tree SVG */}
        <div className="relative overflow-x-auto min-h-[260px] flex items-center justify-center">
          <svg className="w-[580px] h-[240px]">
            {/* Draw parent-to-child edges */}
            {displayedHeap.map((_, i) => {
              if (i === 0) return null;
              const parent = Math.floor((i - 1) / 2);
              const pCoord = getCoordinates(parent);
              const cCoord = getCoordinates(i);
              return (
                <line
                  key={`edge-${i}`}
                  x1={pCoord.x}
                  y1={pCoord.y}
                  x2={cCoord.x}
                  y2={cCoord.y}
                  stroke="#000000"
                  strokeWidth="2.5"
                />
              );
            })}

            {/* Draw Nodes */}
            {displayedHeap.map((val, i) => {
              const coord = getCoordinates(i);
              const isActive = currentStep?.activeIndices.includes(i);

              return (
                <g key={`node-${i}`}>
                  {/* Drop shadow circle */}
                  <circle
                    cx={coord.x + 2}
                    cy={coord.y + 2}
                    r="19"
                    fill="#000000"
                  />
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="19"
                    fill={isActive ? '#FFE135' : '#FFFFFF'}
                    stroke="#000000"
                    strokeWidth="2.5"
                  />
                  <text
                    x={coord.x}
                    y={coord.y + 4}
                    textAnchor="middle"
                    fill="#000000"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="Fredoka, sans-serif"
                  >
                    {val}
                  </text>
                  <text
                    x={coord.x}
                    y={coord.y + 28}
                    textAnchor="middle"
                    fill="#475569"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    [{i}]
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 1D Array Sequential Storage View */}
        <div className="border-t-2 border-black pt-4">
          <h4 className="text-xs font-comic font-black text-black mb-2 uppercase tracking-wider">
            Contiguous Memory Array Storage ({displayedHeap.length} items • Min 7, Max 15):
          </h4>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {displayedHeap.map((val, idx) => {
              const isActive = currentStep?.activeIndices.includes(idx);

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-black px-3.5 py-2 transition-all ${
                    isActive
                      ? 'bg-[#FFE135] text-black shadow-[3px_3px_0px_#000] scale-105 -translate-y-0.5'
                      : 'bg-white text-black shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <span className="font-comic text-base font-black">{val}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 mt-0.5">idx {idx}</span>
                </div>
              );
            })}
          </div>
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

      <AnimationControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => {
          if (steps.length > 0) setIsPlaying(true);
          else handleInsert();
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

      <ComplexityPanel
        topicId="heap"
        operation="insert"
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName={`${isMaxHeap ? 'Max' : 'Min'} Binary Heap`}
        description="Complete binary tree stored implicitly in a contiguous array without explicit child pointers. Excellent cache locality and optimal O(log n) priority updates."
        bestComplexity="O(1) Peek Root"
        worstComplexity="O(log n) Insert / Extract"
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Elements in Heap', value: displayedHeap.length },
          { label: 'Root Value', value: displayedHeap[0] ?? 'None' },
          { label: 'Storage Model', value: 'Implicit Array' },
        ]}
      />
    </div>
  );
};
