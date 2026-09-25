import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Award, Trash2 } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';

interface PQItem {
  id: string;
  value: string;
  priority: number; // 1 = highest priority
}

interface Step {
  activeId?: string;
  itemsState: PQItem[];
  actionDescription: string;
  pseudoCodeLine?: string;
}

const INITIAL_ITEMS: PQItem[] = [
  { id: '1', value: 'System Emergency Alert', priority: 1 },
  { id: '2', value: 'Database Backup', priority: 3 },
  { id: '3', value: 'Send Daily Digest', priority: 5 },
  { id: '4', value: 'Render Background Logs', priority: 8 },
];

interface PriorityQueueVisualizerProps {
  onOperationComplete?: () => void;
}

export const PriorityQueueVisualizer: React.FC<PriorityQueueVisualizerProps> = ({
  onOperationComplete,
}) => {
  const [items, setItems] = useState<PQItem[]>(INITIAL_ITEMS);
  const [inputValue, setInputValue] = useState<string>('Critical Security Patch');
  const [inputPriority, setInputPriority] = useState<string>('2');

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(700);

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
  const displayedItems = currentStep ? currentStep.itemsState : items;

  // 1. Enqueue
  const handleEnqueue = () => {
    const prio = parseInt(inputPriority, 10);
    if (!inputValue.trim() || isNaN(prio)) return;

    const newItem: PQItem = {
      id: `task-${Date.now()}`,
      value: inputValue.trim(),
      priority: prio,
    };

    const newSteps: Step[] = [];
    newSteps.push({
      activeId: newItem.id,
      itemsState: [...items, newItem],
      actionDescription: `Adding task "${newItem.value}" (Priority ${newItem.priority}) at tail of heap array.`,
      pseudoCodeLine: 'heap.push(newItem);',
    });

    const sorted = [...items, newItem].sort((a, b) => a.priority - b.priority);

    newSteps.push({
      activeId: newItem.id,
      itemsState: sorted,
      actionDescription: `Heapify-Up complete: Shifted into position based on priority ${newItem.priority}. O(log n) time.`,
      pseudoCodeLine: 'siftUp(heap.size - 1);',
    });

    setItems(sorted);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  // 2. Dequeue Highest
  const handleDequeue = () => {
    if (items.length === 0) return;

    const highest = items[0];
    const newSteps: Step[] = [
      {
        activeId: highest.id,
        itemsState: items,
        actionDescription: `Selecting root task "${highest.value}" with maximum priority (${highest.priority}).`,
        pseudoCodeLine: 'Task root = heap[0];',
      },
      {
        itemsState: items.slice(1),
        actionDescription: `Extracted highest priority task. Shifted remaining elements and reheapified!`,
        pseudoCodeLine: 'heap[0] = heap.pop(); siftDown(0);',
      },
    ];

    setItems(items.slice(1));
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-comic font-bold text-black">Task:</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-36 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1 text-xs font-comic font-bold text-black focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-comic font-bold text-black">Priority (1=Max):</span>
            <input
              type="number"
              min="1"
              max="10"
              value={inputPriority}
              onChange={(e) => setInputPriority(e.target.value)}
              className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
            />
          </div>

          <button
            onClick={handleEnqueue}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-3.5 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <ArrowDownToLine className="h-4 w-4 stroke-[2.5]" />
            <span>Enqueue Task</span>
          </button>

          <button
            onClick={handleDequeue}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#EF4444] px-3.5 py-1.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-40 cursor-pointer"
          >
            <ArrowUpFromLine className="h-4 w-4 stroke-[2.5]" />
            <span>Extract Highest (O(log n))</span>
          </button>
        </div>

        <button
          onClick={() => {
            setItems([]);
            setSteps([]);
          }}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Clear</span>
        </button>
      </div>

      {/* Main PQ Stage (Pure White Comic Style like Array) */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-5 shadow-[5px_5px_0px_#000]">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 text-xs font-comic font-bold text-black">
          <div className="flex items-center gap-2 bg-[#FFE135] px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            <Award className="h-4 w-4 text-black stroke-[2.5]" />
            <span>Priority Queue Dispatch Order (Lower Number = Higher Precedence)</span>
          </div>
          <div className="bg-slate-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            Total Tasks: <strong className="font-mono">{displayedItems.length}</strong>
          </div>
        </div>

        {/* Priority items list */}
        <div className="space-y-2.5">
          {displayedItems.length === 0 ? (
            <div className="py-12 text-center text-xs font-comic font-bold text-slate-400">
              [ Priority Queue Empty - All Scheduled Tasks Dispatched ]
            </div>
          ) : (
            displayedItems.map((item, idx) => {
              const isFirst = idx === 0;
              const isHighlighted = currentStep?.activeId === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-xl border-2 border-black p-3.5 transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-[#FFE135] shadow-[4px_4px_0px_#000] scale-[1.01] -translate-y-0.5'
                      : isFirst
                      ? 'bg-amber-100 shadow-[3px_3px_0px_#000]'
                      : 'bg-white shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black font-comic text-xs font-black shadow-[1px_1px_0px_#000] ${
                        isFirst
                          ? 'bg-[#FFE135] text-black'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="font-comic font-black text-sm text-black">{item.value}</span>
                  </div>

                  <div className="flex items-center gap-3 font-comic text-xs">
                    <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-slate-800 border-2 border-black font-bold shadow-[1px_1px_0px_#000]">
                      Priority Level: <strong className="text-black font-black font-mono">{item.priority}</strong>
                    </span>
                    {isFirst && (
                      <span className="rounded-lg bg-[#22C55E] text-white px-2 py-0.5 border-2 border-black font-comic text-[11px] font-black shadow-[1px_1px_0px_#000]">
                        NEXT TO PROCESS ▲
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
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
          else handleEnqueue();
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
        topicId="priority-queue"
        operation="insert"
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName="Priority Queue"
        description="Abstract data type where every element possesses an assigned priority. Elements with elevated priority are served prior to elements with lower priority."
        bestComplexity="O(1) Peek"
        worstComplexity="O(log n) Insert/Extract"
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Active Tasks', value: displayedItems.length },
          { label: 'Next Task Priority', value: displayedItems[0] ? displayedItems[0].priority : 'None' },
        ]}
      />
    </div>
  );
};
