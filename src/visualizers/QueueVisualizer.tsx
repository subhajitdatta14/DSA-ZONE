import React, { useState, useEffect } from 'react';
import { ArrowRightToLine, ArrowLeftFromLine, Trash2 } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';

const CAPACITY = 5;

interface Step {
  activeSlot?: number;
  bufferState: (number | null)[];
  front: number;
  rear: number;
  actionDescription: string;
  pseudoCodeLine?: string;
  isError?: boolean;
}

interface QueueVisualizerProps {
  isCircular?: boolean;
  onOperationComplete?: () => void;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
  isCircular = false,
  onOperationComplete,
}) => {
  const [buffer, setBuffer] = useState<(number | null)[]>([10, 20, 30, null, null]);
  const [front, setFront] = useState<number>(0);
  const [rear, setRear] = useState<number>(2);
  const [inputValue, setInputValue] = useState<string>('99');

  // Animation playback state
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(650);
  const [stats, setStats] = useState({ enqueueCount: 0, dequeueCount: 0 });

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
  const displayedBuffer = currentStep ? currentStep.bufferState : buffer;
  const currentFront = currentStep ? currentStep.front : front;
  const currentRear = currentStep ? currentStep.rear : rear;
  const activeCount = displayedBuffer.filter((x) => x !== null).length;

  // 1. Enqueue Operation
  const handleEnqueue = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;

    if (activeCount >= CAPACITY) {
      setSteps([
        {
          bufferState: buffer,
          front,
          rear,
          actionDescription: 'QUEUE OVERFLOW! Buffer capacity full (size 5).',
          pseudoCodeLine: 'if (isFull()) throw QueueOverflow();',
          isError: true,
        },
      ]);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    const nextRear = isCircular ? (rear + 1) % CAPACITY : rear + 1;
    if (!isCircular && nextRear >= CAPACITY) {
      setSteps([
        {
          bufferState: buffer,
          front,
          rear,
          actionDescription: 'LINEAR QUEUE LIMIT! Rear reached end. Use Circular Queue for ring buffer wrap-around.',
          pseudoCodeLine: 'if (rear == CAPACITY - 1) throw LimitReached();',
          isError: true,
        },
      ]);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    const nextFront = front === -1 ? 0 : front;
    const newBuffer = [...buffer];
    newBuffer[nextRear] = val;

    const newSteps: Step[] = [
      {
        bufferState: buffer,
        front,
        rear: nextRear,
        actionDescription: isCircular
          ? `Advance REAR pointer: rear = (${rear} + 1) % ${CAPACITY} = ${nextRear}`
          : `Advance REAR pointer to index ${nextRear}`,
        pseudoCodeLine: isCircular ? 'rear = (rear + 1) % CAPACITY;' : 'rear = rear + 1;',
      },
      {
        activeSlot: nextRear,
        bufferState: newBuffer,
        front: nextFront,
        rear: nextRear,
        actionDescription: `Enqueued item ${val} at REAR slot (index ${nextRear}). O(1) constant time!`,
        pseudoCodeLine: 'arr[rear] = item;',
      },
    ];

    setBuffer(newBuffer);
    setFront(nextFront);
    setRear(nextRear);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setStats((s) => ({ ...s, enqueueCount: s.enqueueCount + 1 }));
    if (onOperationComplete) onOperationComplete();
  };

  // 2. Dequeue Operation
  const handleDequeue = () => {
    if (activeCount === 0 || front === -1) {
      setSteps([
        {
          bufferState: buffer,
          front,
          rear,
          actionDescription: 'QUEUE UNDERFLOW! Cannot dequeue from empty queue.',
          pseudoCodeLine: 'if (isEmpty()) throw QueueUnderflow();',
          isError: true,
        },
      ]);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    const dequeuedVal = buffer[front];
    const newBuffer = [...buffer];
    newBuffer[front] = null;

    let nextFront: number;
    let nextRear: number;

    if (front === rear) {
      nextFront = -1;
      nextRear = -1;
    } else {
      nextFront = isCircular ? (front + 1) % CAPACITY : front + 1;
      nextRear = rear;
    }

    const newSteps: Step[] = [
      {
        activeSlot: front,
        bufferState: buffer,
        front,
        rear,
        actionDescription: `Fetch item ${dequeuedVal} from FRONT position (index ${front})`,
        pseudoCodeLine: 'item = arr[front];',
      },
      {
        bufferState: newBuffer,
        front: nextFront,
        rear: nextRear,
        actionDescription: isCircular
          ? `Dequeued ${dequeuedVal}. Advanced FRONT: front = (${front} + 1) % ${CAPACITY} = ${nextFront}. O(1) time!`
          : `Dequeued ${dequeuedVal}. Advanced FRONT to index ${nextFront}. O(1) time!`,
        pseudoCodeLine: isCircular ? 'front = (front + 1) % CAPACITY;' : 'front = front + 1;',
      },
    ];

    setBuffer(newBuffer);
    setFront(nextFront);
    setRear(nextRear);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setStats((s) => ({ ...s, dequeueCount: s.dequeueCount + 1 }));
    if (onOperationComplete) onOperationComplete();
  };

  const handleReset = () => {
    setBuffer([null, null, null, null, null]);
    setFront(-1);
    setRear(-1);
    setSteps([]);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-comic font-bold text-black">Value:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
            />
          </div>

          <button
            onClick={handleEnqueue}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-3.5 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <ArrowRightToLine className="h-4 w-4 stroke-[2.5]" />
            <span>Enqueue (O(1))</span>
          </button>

          <button
            onClick={handleDequeue}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#EF4444] px-3.5 py-1.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <ArrowLeftFromLine className="h-4 w-4 stroke-[2.5]" />
            <span>Dequeue (O(1))</span>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Clear Queue</span>
        </button>
      </div>

      {/* Main Queue Stage (Pure White Comic Style like Array) */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-6 shadow-[5px_5px_0px_#000]">
        {/* Header Pointers State */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 text-xs font-comic font-bold text-black">
          <div className="flex items-center gap-4">
            <div className="bg-[#22C55E] text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              <span>FRONT: </span>
              <span className="font-mono font-black">{currentFront}</span>
            </div>
            <div className="bg-[#FFE135] text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              <span>REAR: </span>
              <span className="font-mono font-black">{currentRear}</span>
            </div>
            <div>
              <span>Load: </span>
              <span className="font-black text-black">{activeCount}/{CAPACITY}</span>
            </div>
          </div>
          <div className="bg-slate-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
            <span>Mode: </span>
            <span className="font-black text-black">
              {isCircular ? 'Circular Ring Buffer' : 'Linear FIFO Buffer'}
            </span>
          </div>
        </div>

        {/* Linear or Circular Visual Layout */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 max-w-full">
            {displayedBuffer.map((val, idx) => {
              const isFront = idx === currentFront && val !== null;
              const isRear = idx === currentRear && val !== null;
              const isHighlighted = currentStep?.activeSlot === idx;

              return (
                <div key={idx} className="flex flex-col items-center shrink-0">
                  {/* Pointers Top Label */}
                  <div className="h-6 text-[10px] font-comic font-bold flex gap-1">
                    {isFront && <span className="bg-[#22C55E] text-white px-1.5 py-0.5 rounded border border-black">FRONT</span>}
                    {isRear && <span className="bg-[#FFE135] text-black px-1.5 py-0.5 rounded border border-black">REAR</span>}
                  </div>

                  {/* Slot Cell */}
                  <div
                    className={`flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-2xl border-2 border-black transition-all duration-300 ${
                      isHighlighted
                        ? 'bg-[#FFE135] shadow-[4px_4px_0px_#000] scale-105 -translate-y-1'
                        : val !== null
                        ? 'bg-white shadow-[3px_3px_0px_#000]'
                        : 'border-dashed border-slate-300 bg-slate-50'
                    }`}
                  >
                    <span className="font-comic text-xl sm:text-2xl font-black text-black">
                      {val !== null ? val : '—'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">
                      idx {idx}
                    </span>
                  </div>

                  {/* Modulo Indicator for circular */}
                  {isCircular && (
                    <span className="mt-1 text-[9px] font-mono font-bold text-slate-500">
                      ({idx}+1)%{CAPACITY}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* FIFO Flow Indicators */}
          <div className="mt-4 flex items-center justify-between w-full max-w-lg text-xs font-comic font-bold px-4">
            <div className="flex items-center gap-1.5 text-rose-700">
              <span>◄ DEQUEUE (from Front)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span>ENQUEUE (to Rear) ►</span>
            </div>
          </div>
        </div>

        {/* Step Note */}
        {currentStep && (
          <div
            className={`rounded-xl border-2 border-black p-3 font-comic text-xs shadow-[2px_2px_0px_#000] ${
              currentStep.isError
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

      {/* Complexity and Specs with Live Code Demonstration */}
      <ComplexityPanel
        topicId="queue"
        operation={currentStep?.actionDescription?.toLowerCase().includes('dequeue') ? 'dequeue' : 'enqueue'}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName={isCircular ? 'Circular Queue (Ring Buffer)' : 'Queue (FIFO - First In First Out)'}
        description={
          isCircular
            ? 'Ring buffer overcoming linear queue space wastage by wrapping indices using modulo arithmetic: (rear + 1) % size.'
            : 'Linear data structure where elements are added at the REAR and removed from the FRONT in strict FIFO sequence.'
        }
        bestComplexity="O(1)"
        worstComplexity="O(1)"
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Capacity', value: CAPACITY },
          { label: 'Current Load', value: activeCount },
          { label: 'Total Enqueues', value: stats.enqueueCount },
          { label: 'Total Dequeues', value: stats.dequeueCount },
        ]}
      />
    </div>
  );
};
