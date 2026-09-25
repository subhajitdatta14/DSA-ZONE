import React, { useState, useEffect, useRef } from 'react';
import { ArrayVisualizerStep, OperationType } from '../types/dsa';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';
import { ComicBurst } from '../components/ComicBadge';
import {
  Plus,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  Shuffle,
  AlertCircle,
  Database
} from 'lucide-react';

interface ArrayVisualizerProps {
  onOperationComplete?: () => void;
}

const DEFAULT_ARRAY = [10, 20, 30, 40, 50];
const BASE_MEMORY_HEX = 0x1000;
const ELEMENT_SIZE_BYTES = 4;

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  onOperationComplete,
}) => {
  // Array state
  const [array, setArray] = useState<number[]>(DEFAULT_ARRAY);

  // Form inputs
  const [inputValue, setInputValue] = useState<string>('25');
  const [inputIndex, setInputIndex] = useState<string>('2');
  const [searchTarget, setSearchTarget] = useState<string>('30');
  const [updateValue, setUpdateValue] = useState<string>('99');
  const [accessIndex, setAccessIndex] = useState<string>('3');

  // Operation selection
  const [activeOp, setActiveOp] = useState<OperationType>('insert');

  // Animation timeline state
  const [steps, setSteps] = useState<ArrayVisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(650);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState<{
    elementCount: number;
    comparisons: number;
    shifts: number;
  }>({
    elementCount: DEFAULT_ARRAY.length,
    comparisons: 0,
    shifts: 0,
  });

  const timerRef = useRef<number | null>(null);

  // Current visual snapshot
  const currentStep = steps[currentStepIndex];
  const displayedArray = currentStep ? currentStep.array : array;

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto playback loop
  useEffect(() => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speedMs]);

  // When step changes, if last step is reached, trigger completion
  useEffect(() => {
    if (currentStep && currentStepIndex === steps.length - 1 && steps.length > 0) {
      setArray(currentStep.array);
      if (onOperationComplete) onOperationComplete();
    }
  }, [currentStepIndex, steps]);

  // Operation generators
  const triggerInsert = () => {
    setErrorMessage(null);
    const val = parseInt(inputValue, 10);
    const idx = parseInt(inputIndex, 10);

    if (isNaN(val)) {
      setErrorMessage('Please enter a valid numeric value to insert.');
      return;
    }
    if (isNaN(idx) || idx < 0 || idx > array.length) {
      setErrorMessage(`Index must be between 0 and ${array.length}.`);
      return;
    }
    if (array.length >= 10) {
      setErrorMessage('Array capacity limit (10) reached for visualizer clarity.');
      return;
    }

    const generatedSteps: ArrayVisualizerStep[] = [];
    const base = [...array];
    const n = base.length;
    let shiftCount = 0;

    // Step 0: Initial planning
    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...base],
      highlightIndices: [idx],
      targetIndex: idx,
      message: `Initiating Insertion: Adding value ${val} at index [${idx}]. Elements from index ${idx} to ${n - 1} must shift right.`,
      operation: 'insert',
      timeComplexity: idx === n ? 'O(1)' : 'O(n)',
      spaceComplexity: 'O(1)',
      status: 'info',
    });

    // Expanding array with placeholder
    const working = [...base, 0];

    // Shift elements rightward from n-1 down to idx
    for (let i = n - 1; i >= idx; i--) {
      shiftCount++;
      working[i + 1] = working[i];
      generatedSteps.push({
        stepIndex: 0,
        totalSteps: 0,
        array: [...working],
        highlightIndices: [i, i + 1],
        shiftedIndex: i,
        targetIndex: idx,
        message: `Step ${shiftCount}: Shifting element [${working[i]}] from index ${i} to index ${i + 1} to create vacancy.`,
        operation: 'insert',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        status: 'active',
      });
    }

    // Vacancy ready
    working[idx] = val;
    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...working],
      highlightIndices: [idx],
      insertedIndex: idx,
      targetIndex: idx,
      message: `Writing value [${val}] into vacant slot at index ${idx}. Memory offset is now occupied.`,
      operation: 'insert',
      timeComplexity: idx === n ? 'O(1)' : 'O(n)',
      spaceComplexity: 'O(1)',
      status: 'active',
    });

    // Final celebration step
    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...working],
      highlightIndices: [idx],
      insertedIndex: idx,
      message: `Insertion complete! Array size is now ${working.length}. Elements shifted: ${shiftCount}.`,
      operation: 'insert',
      timeComplexity: idx === n ? 'O(1)' : 'O(n)',
      spaceComplexity: 'O(1)',
      isFinished: true,
      status: 'success',
    });

    // Set totals
    const finalSteps = generatedSteps.map((s, i) => ({
      ...s,
      stepIndex: i,
      totalSteps: generatedSteps.length,
    }));

    setStats({
      elementCount: working.length,
      comparisons: 0,
      shifts: shiftCount,
    });
    setSteps(finalSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const triggerDelete = () => {
    setErrorMessage(null);
    const idx = parseInt(inputIndex, 10);

    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setErrorMessage(`Index to delete must be between 0 and ${array.length - 1}.`);
      return;
    }
    if (array.length <= 1) {
      setErrorMessage('Array must contain at least 1 element.');
      return;
    }

    const generatedSteps: ArrayVisualizerStep[] = [];
    const base = [...array];
    const valToDelete = base[idx];
    let shiftCount = 0;

    // Step 0: Identify deleted slot
    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...base],
      highlightIndices: [idx],
      deletedIndex: idx,
      message: `Initiating Deletion: Targeting index [${idx}] (value ${valToDelete}). Trailing elements must shift left to close memory gap.`,
      operation: 'delete',
      timeComplexity: idx === base.length - 1 ? 'O(1)' : 'O(n)',
      spaceComplexity: 'O(1)',
      status: 'warning',
    });

    const working = [...base];
    // Shift elements leftward from idx up to length - 2
    for (let i = idx; i < working.length - 1; i++) {
      shiftCount++;
      working[i] = working[i + 1];
      generatedSteps.push({
        stepIndex: 0,
        totalSteps: 0,
        array: [...working],
        highlightIndices: [i, i + 1],
        shiftedIndex: i + 1,
        message: `Step ${shiftCount}: Shifting element [${working[i]}] from index ${i + 1} to index ${i}.`,
        operation: 'delete',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        status: 'active',
      });
    }

    // Truncate last redundant slot
    const finalArr = working.slice(0, working.length - 1);
    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...finalArr],
      highlightIndices: [],
      message: `Deletion finished! Element ${valToDelete} removed. Size reduced to ${finalArr.length}. Total shifts: ${shiftCount}.`,
      operation: 'delete',
      timeComplexity: idx === base.length - 1 ? 'O(1)' : 'O(n)',
      spaceComplexity: 'O(1)',
      isFinished: true,
      status: 'success',
    });

    const finalSteps = generatedSteps.map((s, i) => ({
      ...s,
      stepIndex: i,
      totalSteps: generatedSteps.length,
    }));

    setStats({
      elementCount: finalArr.length,
      comparisons: 0,
      shifts: shiftCount,
    });
    setSteps(finalSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const triggerSearch = () => {
    setErrorMessage(null);
    const target = parseInt(searchTarget, 10);
    if (isNaN(target)) {
      setErrorMessage('Please enter a valid target value to search.');
      return;
    }

    const generatedSteps: ArrayVisualizerStep[] = [];
    const base = [...array];
    let foundIndex = -1;
    let comparisons = 0;

    for (let i = 0; i < base.length; i++) {
      comparisons++;
      const isMatch = base[i] === target;
      generatedSteps.push({
        stepIndex: 0,
        totalSteps: 0,
        array: [...base],
        highlightIndices: [i],
        comparingIndex: i,
        message: `Comparing target ${target} with arr[${i}] = ${base[i]}. ${
          isMatch ? 'MATCH FOUND!' : 'Not a match, continuing linear scan.'
        }`,
        operation: 'search',
        timeComplexity: isMatch && i === 0 ? 'O(1)' : 'O(n)',
        spaceComplexity: 'O(1)',
        status: isMatch ? 'success' : 'active',
      });

      if (isMatch) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      generatedSteps.push({
        stepIndex: 0,
        totalSteps: 0,
        array: [...base],
        highlightIndices: [foundIndex],
        message: `Search successful! Value ${target} found at index [${foundIndex}] after ${comparisons} comparison${
          comparisons > 1 ? 's' : ''
        }.`,
        operation: 'search',
        timeComplexity: foundIndex === 0 ? 'O(1)' : 'O(n)',
        spaceComplexity: 'O(1)',
        isFinished: true,
        status: 'success',
      });
    } else {
      generatedSteps.push({
        stepIndex: 0,
        totalSteps: 0,
        array: [...base],
        highlightIndices: [],
        message: `Search complete: Value ${target} is NOT present in the array. Total comparisons: ${comparisons} (Worst Case: O(n)).`,
        operation: 'search',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        isFinished: true,
        status: 'warning',
      });
    }

    const finalSteps = generatedSteps.map((s, i) => ({
      ...s,
      stepIndex: i,
      totalSteps: generatedSteps.length,
    }));

    setStats({
      elementCount: base.length,
      comparisons,
      shifts: 0,
    });
    setSteps(finalSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const triggerUpdate = () => {
    setErrorMessage(null);
    const idx = parseInt(inputIndex, 10);
    const val = parseInt(updateValue, 10);

    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setErrorMessage(`Index must be between 0 and ${array.length - 1}.`);
      return;
    }
    if (isNaN(val)) {
      setErrorMessage('Please enter a valid replacement value.');
      return;
    }

    const generatedSteps: ArrayVisualizerStep[] = [];
    const base = [...array];
    const prevVal = base[idx];

    // Step 0: Locate address
    const memoryAddressHex = `0x${(BASE_MEMORY_HEX + idx * ELEMENT_SIZE_BYTES).toString(16).toUpperCase()}`;
    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...base],
      highlightIndices: [idx],
      targetIndex: idx,
      message: `Calculating offset: Address = 0x1000 + (${idx} * 4) = ${memoryAddressHex}. Accessing slot directly in O(1).`,
      operation: 'update',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      status: 'active',
    });

    const updated = [...base];
    updated[idx] = val;

    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...updated],
      highlightIndices: [idx],
      targetIndex: idx,
      message: `Directly overwriting memory address ${memoryAddressHex}: replaced [${prevVal}] with new value [${val}].`,
      operation: 'update',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      isFinished: true,
      status: 'success',
    });

    const finalSteps = generatedSteps.map((s, i) => ({
      ...s,
      stepIndex: i,
      totalSteps: generatedSteps.length,
    }));

    setStats({
      elementCount: updated.length,
      comparisons: 0,
      shifts: 0,
    });
    setSteps(finalSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const triggerAccess = () => {
    setErrorMessage(null);
    const idx = parseInt(accessIndex, 10);

    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setErrorMessage(`Index must be between 0 and ${array.length - 1}.`);
      return;
    }

    const generatedSteps: ArrayVisualizerStep[] = [];
    const base = [...array];
    const memoryAddressHex = `0x${(BASE_MEMORY_HEX + idx * ELEMENT_SIZE_BYTES).toString(16).toUpperCase()}`;
    const value = base[idx];

    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...base],
      highlightIndices: [],
      targetIndex: idx,
      message: `Computing hardware offset: Address = BaseAddress (0x1000) + (${idx} * 4 bytes) = ${memoryAddressHex}.`,
      operation: 'access',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      status: 'info',
    });

    generatedSteps.push({
      stepIndex: 0,
      totalSteps: 0,
      array: [...base],
      highlightIndices: [idx],
      targetIndex: idx,
      message: `Instant O(1) Access! Memory cell ${memoryAddressHex} contains value ${value}. Zero iterative steps needed.`,
      operation: 'access',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      isFinished: true,
      status: 'success',
    });

    const finalSteps = generatedSteps.map((s, i) => ({
      ...s,
      stepIndex: i,
      totalSteps: generatedSteps.length,
    }));

    setStats({
      elementCount: base.length,
      comparisons: 0,
      shifts: 0,
    });
    setSteps(finalSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setArray(DEFAULT_ARRAY);
    setSteps([]);
    setCurrentStepIndex(0);
    setErrorMessage(null);
    setStats({
      elementCount: DEFAULT_ARRAY.length,
      comparisons: 0,
      shifts: 0,
    });
  };

  const handleRandomize = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    const count = 5 + Math.floor(Math.random() * 3);
    const newArr: number[] = [];
    for (let i = 0; i < count; i++) {
      newArr.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArr);
    setSteps([]);
    setCurrentStepIndex(0);
    setErrorMessage(null);
    setStats({
      elementCount: newArr.length,
      comparisons: 0,
      shifts: 0,
    });
  };

  // Complexity stats for current active operation
  const opMetadata: Record<
    OperationType,
    { name: string; desc: string; best: string; worst: string; space: string }
  > = {
    insert: {
      name: 'Insert',
      desc: 'A new element is added to the array. Existing elements may need to shift.',
      best: 'O(1)',
      worst: 'O(n)',
      space: 'O(1)',
    },
    delete: {
      name: 'Delete',
      desc: 'Removes an element from the array. Trailing elements shift left to close memory gap.',
      best: 'O(1)',
      worst: 'O(n)',
      space: 'O(1)',
    },
    search: {
      name: 'Search (Linear)',
      desc: 'Sequential scan through elements until target is found or end of array is reached.',
      best: 'O(1)',
      worst: 'O(n)',
      space: 'O(1)',
    },
    update: {
      name: 'Update',
      desc: 'Directly rewrites the value stored at the calculated index in memory.',
      best: 'O(1)',
      worst: 'O(1)',
      space: 'O(1)',
    },
    access: {
      name: 'Access',
      desc: 'Direct RAM address calculation via Address = Base + Index * Size.',
      best: 'O(1)',
      worst: 'O(1)',
      space: 'O(1)',
    },
  };

  const currentOpMeta = opMetadata[currentStep ? currentStep.operation : activeOp];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: Operation Tabs in Comic Style */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4">
        {/* Operation buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
          {(['insert', 'delete', 'search', 'update', 'access'] as OperationType[]).map((op) => {
            const isActive = activeOp === op;
            return (
              <button
                key={op}
                onClick={() => {
                  setActiveOp(op);
                  setErrorMessage(null);
                }}
                className={`px-3 py-1.5 text-xs font-comic font-bold rounded-lg transition-all capitalize ${
                  isActive
                    ? 'border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]'
                    : 'text-slate-700 hover:text-black hover:bg-white/60'
                }`}
              >
                {op}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-50 transition-colors"
          >
            <Shuffle className="h-3.5 w-3.5 text-amber-600" />
            <span>Randomize</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Default</span>
          </button>
        </div>
      </div>

      {/* Operation Input Deck (Comic white card) */}
      <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-4">
          {activeOp === 'insert' && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-comic font-bold text-slate-700">Value:</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-20 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="25"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-comic font-bold text-slate-700">At Index:</label>
                <input
                  type="number"
                  min="0"
                  max={array.length}
                  value={inputIndex}
                  onChange={(e) => setInputIndex(e.target.value)}
                  className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="0"
                />
              </div>
              <button
                onClick={triggerInsert}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-4 py-2 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Execute Insert</span>
              </button>
            </>
          )}

          {activeOp === 'delete' && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-comic font-bold text-slate-700">Delete At Index:</label>
                <input
                  type="number"
                  min="0"
                  max={Math.max(0, array.length - 1)}
                  value={inputIndex}
                  onChange={(e) => setInputIndex(e.target.value)}
                  className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="0"
                />
              </div>
              <button
                onClick={triggerDelete}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#EF4444] px-4 py-2 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
              >
                <Trash2 className="h-4 w-4 stroke-[2.5]" />
                <span>Execute Delete</span>
              </button>
            </>
          )}

          {activeOp === 'search' && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-comic font-bold text-slate-700">Search Target Value:</label>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  className="w-20 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="30"
                />
              </div>
              <button
                onClick={triggerSearch}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#22C55E] px-4 py-2 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
              >
                <Search className="h-4 w-4 stroke-[2.5]" />
                <span>Execute Search</span>
              </button>
            </>
          )}

          {activeOp === 'update' && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-comic font-bold text-slate-700">At Index:</label>
                <input
                  type="number"
                  min="0"
                  max={Math.max(0, array.length - 1)}
                  value={inputIndex}
                  onChange={(e) => setInputIndex(e.target.value)}
                  className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-comic font-bold text-slate-700">New Value:</label>
                <input
                  type="number"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(e.target.value)}
                  className="w-20 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="99"
                />
              </div>
              <button
                onClick={triggerUpdate}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-4 py-2 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
              >
                <RefreshCw className="h-4 w-4 stroke-[2.5]" />
                <span>Execute Update</span>
              </button>
            </>
          )}

          {activeOp === 'access' && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-comic font-bold text-slate-700">Access Index:</label>
                <input
                  type="number"
                  min="0"
                  max={Math.max(0, array.length - 1)}
                  value={accessIndex}
                  onChange={(e) => setAccessIndex(e.target.value)}
                  className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="0"
                />
              </div>
              <button
                onClick={triggerAccess}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#22C55E] px-4 py-2 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
              >
                <Eye className="h-4 w-4 stroke-[2.5]" />
                <span>Execute Access O(1)</span>
              </button>
            </>
          )}
        </div>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border-2 border-black bg-[#FEF2F2] p-3 text-xs font-bold text-rose-800 shadow-[2px_2px_0px_#000]">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Visualization Stage Canvas (Comic white style with hard shadows) */}
      <div className="relative flex flex-col items-center justify-center min-h-[300px] sm:min-h-[340px] rounded-2xl border-2 border-black bg-white p-4 sm:p-8 lg:p-10 shadow-[4px_4px_0px_#000] sm:shadow-[5px_5px_0px_#000] overflow-x-auto touch-scroll overscroll-contain">
        {/* Array Header Label */}
        <div className="z-10 mb-5 sm:mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-comic font-bold text-black bg-[#FFE135] border-2 border-black px-2.5 sm:px-3 py-1 rounded-lg shadow-[2px_2px_0px_#000]">
            <Database className="h-3.5 w-3.5 text-black" />
            <span>ARRAY MEMORY BUFFER: arr[{displayedArray.length}]</span>
          </div>
        </div>

        {/* The Animated Array Cells */}
        <div className="z-10 flex items-end justify-center gap-1.5 sm:gap-3 py-4 min-w-max">
          {displayedArray.map((val, idx) => {
            const isHighlighted = currentStep?.highlightIndices.includes(idx);
            const isComparing = currentStep?.comparingIndex === idx;
            const isTarget = currentStep?.targetIndex === idx;
            const isShifted = currentStep?.shiftedIndex === idx;
            const isInserted = currentStep?.insertedIndex === idx;
            const isDeleted = currentStep?.deletedIndex === idx;

            // Memory address
            const memHex = `0x${(BASE_MEMORY_HEX + idx * ELEMENT_SIZE_BYTES).toString(16).toUpperCase()}`;

            let cellBg = 'bg-white border-black text-black';
            let cellGlow = 'shadow-[3px_3px_0px_#000]';
            let comicAnnotation = null;

            if (isComparing) {
              cellBg = 'bg-[#FFE135] border-black text-black';
              cellGlow = 'shadow-[4px_4px_0px_#000] scale-105 -translate-y-1';
              if (currentStep?.message?.toLowerCase().includes('found')) {
                comicAnnotation = <ComicBurst text="FOUND!" variant="green" size="sm" />;
              }
            } else if (isInserted) {
              cellBg = 'bg-[#22C55E] border-black text-white';
              cellGlow = 'shadow-[4px_4px_0px_#000] scale-105 -translate-y-1';
              comicAnnotation = <ComicBurst text="INSERTED!" variant="green" size="sm" />;
            } else if (isDeleted) {
              cellBg = 'bg-[#EF4444] border-black text-white';
              cellGlow = 'shadow-[3px_3px_0px_#000] scale-95';
              comicAnnotation = <ComicBurst text="DELETED!" variant="red" size="sm" />;
            } else if (isShifted) {
              cellBg = 'bg-amber-100 border-black text-black';
              cellGlow = 'shadow-[3px_3px_0px_#000] -translate-y-1.5';
              comicAnnotation = <ComicBurst text="SHIFT!" variant="yellow" size="sm" />;
            } else if (isHighlighted || isTarget) {
              cellBg = 'bg-[#FFE135] border-black text-black';
              cellGlow = 'shadow-[4px_4px_0px_#000] scale-105 -translate-y-1';
            }

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Comic annotation burst if any */}
                <div className="h-6 flex items-center justify-center mb-1">
                  {comicAnnotation}
                </div>

                {/* Index label above */}
                <div className="mb-1 flex flex-col items-center">
                  <span
                    className={`font-mono text-xs font-bold tabular-nums ${
                      isHighlighted || isTarget ? 'text-amber-600 font-extrabold' : 'text-slate-600'
                    }`}
                  >
                    [{idx}]
                  </span>
                </div>

                {/* Array Box Cell */}
                <div
                  className={`flex h-14 w-12 sm:h-18 sm:w-16 items-center justify-center rounded-xl border-2 font-mono text-base sm:text-xl font-bold transition-all duration-300 select-none ${cellBg} ${cellGlow}`}
                >
                  {val}
                </div>

                {/* Memory byte offset below */}
                <div className="mt-2 flex flex-col items-center">
                  <span className="font-mono text-[10px] font-bold tabular-nums text-slate-500">
                    {memHex}
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">
                    +{(idx * ELEMENT_SIZE_BYTES)}B
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend / Status Pill */}
        <div className="z-10 mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-comic font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-[#FFE135] border-2 border-black" />
            <span>Target / Inspected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-amber-100 border-2 border-black" />
            <span>Memory Shift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-[#22C55E] border-2 border-black" />
            <span>Success / Inserted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-[#EF4444] border-2 border-black" />
            <span>Deleted</span>
          </div>
        </div>
      </div>

      {/* Animation Playback Controls Bar */}
      <AnimationControls
        isPlaying={isPlaying}
        onPlay={() => {
          if (steps.length === 0) {
            // Auto trigger insert as preview if empty
            triggerInsert();
          } else {
            setIsPlaying(true);
          }
        }}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => {
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
          }
        }}
        onStepBack={() => {
          if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
          }
        }}
        onReset={handleReset}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
      />

      {/* Operation Explanation & Complexity Panel with Live Code Demonstration */}
      <ComplexityPanel
        topicId="array"
        operation={activeOp}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        operationName={currentOpMeta.name}
        operationDescription={currentOpMeta.desc}
        bestTime={currentOpMeta.best}
        worstTime={currentOpMeta.worst}
        spaceComplexity={currentOpMeta.space}
        activeStepMessage={currentStep?.message}
        stats={stats}
      />
    </div>
  );
};
