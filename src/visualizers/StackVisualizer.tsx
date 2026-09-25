import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Eye, Trash2 } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';

const MAX_STACK_SIZE = 6;
const INITIAL_STACK = [15, 28, 42];

interface Step {
  activeItemIndex?: number;
  stackState: number[];
  actionDescription: string;
  pseudoCodeLine?: string;
  status: 'normal' | 'overflow' | 'underflow';
}

interface StackVisualizerProps {
  onOperationComplete?: () => void;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ onOperationComplete }) => {
  const [stack, setStack] = useState<number[]>(INITIAL_STACK);
  const [inputValue, setInputValue] = useState<string>('99');

  // Animation playback state
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(650);
  const [stats, setStats] = useState({ pushCount: 0, popCount: 0, peekCount: 0 });

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
  const displayedItems = currentStep ? currentStep.stackState : stack;
  const currentTop = displayedItems.length - 1;

  // 1. Push Operation
  const handlePush = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;

    if (stack.length >= MAX_STACK_SIZE) {
      setSteps([
        {
          stackState: stack,
          actionDescription: 'STACK OVERFLOW! Cannot push into full stack (max size 6).',
          pseudoCodeLine: 'if (top >= MAX_SIZE - 1) throw StackOverflow();',
          status: 'overflow',
        },
      ]);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    const newSteps: Step[] = [
      {
        stackState: stack,
        actionDescription: `Increment top index from ${stack.length - 1} to ${stack.length}`,
        pseudoCodeLine: 'top = top + 1;',
        status: 'normal',
      },
      {
        activeItemIndex: stack.length,
        stackState: [...stack, val],
        actionDescription: `Pushed value ${val} onto top of stack at index ${stack.length}. Constant time O(1)!`,
        pseudoCodeLine: 'arr[top] = value;',
        status: 'normal',
      },
    ];

    setStack([...stack, val]);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setStats((s) => ({ ...s, pushCount: s.pushCount + 1 }));
    if (onOperationComplete) onOperationComplete();
  };

  // 2. Pop Operation
  const handlePop = () => {
    if (stack.length === 0) {
      setSteps([
        {
          stackState: stack,
          actionDescription: 'STACK UNDERFLOW! Cannot pop from empty stack.',
          pseudoCodeLine: 'if (top < 0) throw StackUnderflow();',
          status: 'underflow',
        },
      ]);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    const poppedVal = stack[stack.length - 1];
    const newSteps: Step[] = [
      {
        activeItemIndex: stack.length - 1,
        stackState: stack,
        actionDescription: `Identify item ${poppedVal} at TOP (index ${stack.length - 1}) to pop`,
        pseudoCodeLine: 'val = arr[top];',
        status: 'normal',
      },
      {
        stackState: stack.slice(0, stack.length - 1),
        actionDescription: `Popped ${poppedVal}. Decremented top index to ${stack.length - 2}. O(1) time.`,
        pseudoCodeLine: 'top = top - 1; return val;',
        status: 'normal',
      },
    ];

    setStack(stack.slice(0, stack.length - 1));
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setStats((s) => ({ ...s, popCount: s.popCount + 1 }));
    if (onOperationComplete) onOperationComplete();
  };

  // 3. Peek Operation
  const handlePeek = () => {
    if (stack.length === 0) {
      setSteps([
        {
          stackState: stack,
          actionDescription: 'Stack is empty! Peek returns NULL.',
          pseudoCodeLine: 'if (isEmpty()) return null;',
          status: 'underflow',
        },
      ]);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    const topVal = stack[stack.length - 1];
    setSteps([
      {
        activeItemIndex: stack.length - 1,
        stackState: stack,
        actionDescription: `Peek inspects TOP element: ${topVal} at index ${stack.length - 1} without removing it.`,
        pseudoCodeLine: 'return arr[top]; // O(1) Access',
        status: 'normal',
      },
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setStats((s) => ({ ...s, peekCount: s.peekCount + 1 }));
    if (onOperationComplete) onOperationComplete();
  };

  const handleClear = () => {
    setStack([]);
    setSteps([]);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-comic font-bold text-black">Push Val:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
            />
          </div>

          <button
            onClick={handlePush}
            disabled={stack.length >= MAX_STACK_SIZE}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-3.5 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-40 cursor-pointer"
          >
            <ArrowDownToLine className="h-4 w-4 stroke-[2.5]" />
            <span>Push (O(1))</span>
          </button>

          <button
            onClick={handlePop}
            disabled={stack.length === 0}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#EF4444] px-3.5 py-1.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-40 cursor-pointer"
          >
            <ArrowUpFromLine className="h-4 w-4 stroke-[2.5]" />
            <span>Pop (O(1))</span>
          </button>

          <button
            onClick={handlePeek}
            disabled={stack.length === 0}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#22C55E] px-3.5 py-1.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-40 cursor-pointer"
          >
            <Eye className="h-4 w-4 stroke-[2.5]" />
            <span>Peek (O(1))</span>
          </button>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Clear Stack</span>
        </button>
      </div>

      {/* Main Stack Visualizer Stage (Pure White Comic Style like Array) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border-2 border-black bg-white p-6 shadow-[5px_5px_0px_#000]">
        {/* Left: Vertical Stack Container */}
        <div className="flex flex-col items-center justify-end col-span-1 md:col-span-2 min-h-[360px] border-b-2 md:border-b-0 md:border-r-2 border-black pb-6 md:pb-0 md:pr-6">
          <div className="mb-3 flex items-center justify-between w-full max-w-xs text-xs font-comic font-bold text-black">
            <span>Stack Top Pointer</span>
            <span className="bg-[#FFE135] px-2 py-0.5 rounded-lg border-2 border-black font-mono shadow-[1px_1px_0px_#000]">
              {currentTop === -1 ? 'EMPTY (top = -1)' : `top = ${currentTop}`}
            </span>
          </div>

          {/* Vertical U-Tube Tank */}
          <div className="relative flex flex-col-reverse items-center justify-start w-64 h-[280px] border-x-4 border-b-4 border-black rounded-b-2xl bg-slate-50 p-2 overflow-hidden shadow-[3px_3px_0px_#000]">
            {displayedItems.length === 0 ? (
              <div className="m-auto text-xs font-comic font-bold text-slate-400">
                [ Empty Stack (LIFO) ]
              </div>
            ) : (
              displayedItems.map((val, idx) => {
                const isTop = idx === currentTop;
                const isHighlighted = currentStep?.activeItemIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`relative my-1 flex h-10 w-full items-center justify-between rounded-xl border-2 border-black px-4 transition-all duration-300 ${
                      isHighlighted
                        ? 'bg-[#FFE135] shadow-[3px_3px_0px_#000] scale-102 -translate-y-0.5'
                        : isTop
                        ? 'bg-amber-100 shadow-[2px_2px_0px_#000]'
                        : 'bg-white shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-slate-500">
                      [{idx}]
                    </span>
                    <span className="font-comic text-base font-black text-black">
                      {val}
                    </span>
                    <span className="font-comic text-[10px] font-black text-black">
                      {isTop ? 'TOP ▲' : `0x${(0x3000 + idx * 4).toString(16).toUpperCase()}`}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-2 text-[11px] font-comic font-bold text-slate-600">
            Capacity: {displayedItems.length} / {MAX_STACK_SIZE} elements
          </div>
        </div>

        {/* Right: State & Array Memory View */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="rounded-xl border-2 border-black bg-slate-50 p-3 shadow-[2px_2px_0px_#000]">
            <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-2">
              Linear Memory Buffer
            </h4>
            <div className="space-y-1.5 font-mono text-xs font-bold">
              {Array.from({ length: MAX_STACK_SIZE }).map((_, idx) => {
                const hasValue = idx < displayedItems.length;
                const isTop = idx === currentTop;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded-lg border-2 border-black px-2.5 py-1 text-xs ${
                      isTop
                        ? 'bg-[#FFE135] text-black shadow-[1px_1px_0px_#000]'
                        : hasValue
                        ? 'bg-white text-black'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span>idx {idx}</span>
                    <span className="font-comic font-black">
                      {hasValue ? displayedItems[idx] : '—'}
                    </span>
                    <span>{isTop ? '◄ top' : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Step Note */}
          {currentStep && (
            <div
              className={`rounded-xl border-2 border-black p-3 font-comic text-xs shadow-[2px_2px_0px_#000] ${
                currentStep.status === 'overflow' || currentStep.status === 'underflow'
                  ? 'bg-rose-100 text-rose-950'
                  : 'bg-amber-50 text-slate-900'
              }`}
            >
              <div className="font-black text-black mb-0.5">
                {currentStep.actionDescription}
              </div>
              {currentStep.pseudoCodeLine && (
                <div className="text-amber-900 font-mono font-bold text-[11px] mt-1">
                  &gt; {currentStep.pseudoCodeLine}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animation Controls */}
      <AnimationControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => {
          if (steps.length > 0) setIsPlaying(true);
          else handlePush();
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
        topicId="stack"
        operation={currentStep?.actionDescription?.toLowerCase().includes('pop') ? 'pop' : currentStep?.actionDescription?.toLowerCase().includes('peek') ? 'peek' : 'push'}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName="Stack (LIFO - Last In First Out)"
        description="Linear abstract data structure restricted to operations at a single end (TOP). Push, Pop, and Peek execute in strict O(1) constant time."
        bestComplexity="O(1)"
        worstComplexity="O(1)"
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Current Size', value: displayedItems.length },
          { label: 'Push Count', value: stats.pushCount },
          { label: 'Pop Count', value: stats.popCount },
          { label: 'Peek Count', value: stats.peekCount },
        ]}
      />
    </div>
  );
};
