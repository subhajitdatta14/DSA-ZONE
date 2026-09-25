import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Hash, ArrowRight } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';

const BUCKET_COUNT = 6;

interface HashEntry {
  key: string;
  value: string;
}

interface Step {
  activeBucketIdx?: number;
  activeKey?: string;
  hashCalc?: { key: string; hash: number; bucket: number };
  bucketsState: HashEntry[][];
  actionDescription: string;
  pseudoCodeLine?: string;
}

const INITIAL_ENTRIES: HashEntry[] = [
  { key: 'alice', value: 'Eng' },
  { key: 'bob', value: 'Dev' },
  { key: 'carol', value: 'Design' },
  { key: 'dave', value: 'QA' },
];

interface HashTableVisualizerProps {
  onOperationComplete?: () => void;
}

export const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({
  onOperationComplete,
}) => {
  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % BUCKET_COUNT;
  };

  const [buckets, setBuckets] = useState<HashEntry[][]>(() => {
    const table: HashEntry[][] = Array.from({ length: BUCKET_COUNT }, () => []);
    INITIAL_ENTRIES.forEach((e) => {
      const idx = hashFunction(e.key);
      table[idx].push(e);
    });
    return table;
  });

  const [inputKey, setInputKey] = useState<string>('grace');
  const [inputValue, setInputValue] = useState<string>('ML');
  const [searchKey, setSearchKey] = useState<string>('alice');

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
  const displayedBuckets = currentStep ? currentStep.bucketsState : buckets;
  const totalEntries = displayedBuckets.reduce((acc, b) => acc + b.length, 0);
  const loadFactor = (totalEntries / BUCKET_COUNT).toFixed(2);

  // 1. Insert Operation
  const handleInsert = () => {
    if (!inputKey.trim() || !inputValue.trim()) return;

    const bucketIdx = hashFunction(inputKey.trim());
    const newEntry: HashEntry = { key: inputKey.trim(), value: inputValue.trim() };

    const newSteps: Step[] = [];
    newSteps.push({
      bucketsState: buckets,
      hashCalc: { key: newEntry.key, hash: 0, bucket: bucketIdx },
      actionDescription: `Compute hash code: hash("${newEntry.key}") % ${BUCKET_COUNT} = Bucket [${bucketIdx}]`,
      pseudoCodeLine: 'int index = hash(key) % capacity;',
    });

    const updatedBuckets = buckets.map((b, idx) => {
      if (idx !== bucketIdx) return b;
      const existingIdx = b.findIndex((e) => e.key === newEntry.key);
      if (existingIdx >= 0) {
        const copy = [...b];
        copy[existingIdx] = newEntry;
        return copy;
      }
      return [...b, newEntry];
    });

    newSteps.push({
      activeBucketIdx: bucketIdx,
      activeKey: newEntry.key,
      bucketsState: updatedBuckets,
      actionDescription: `Chained entry ("${newEntry.key}" → "${newEntry.value}") into Bucket [${bucketIdx}]. Constant time O(1) average!`,
      pseudoCodeLine: 'table[index].append(new Node(key, value));',
    });

    setBuckets(updatedBuckets);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // 2. Search Operation
  const handleSearch = () => {
    if (!searchKey.trim()) return;

    const bucketIdx = hashFunction(searchKey.trim());
    const bucket = buckets[bucketIdx];
    const match = bucket.find((e) => e.key === searchKey.trim());

    const newSteps: Step[] = [];
    newSteps.push({
      activeBucketIdx: bucketIdx,
      bucketsState: buckets,
      actionDescription: `Hash lookup: "${searchKey.trim()}" directly indexes into Bucket [${bucketIdx}].`,
      pseudoCodeLine: 'int index = hash(key) % capacity;',
    });

    if (match) {
      newSteps.push({
        activeBucketIdx: bucketIdx,
        activeKey: match.key,
        bucketsState: buckets,
        actionDescription: `KEY FOUND! Value is "${match.value}". Accessed with O(1) average time!`,
        pseudoCodeLine: 'return table[index].get(key); // FOUND',
      });
    } else {
      newSteps.push({
        activeBucketIdx: bucketIdx,
        bucketsState: buckets,
        actionDescription: `Scanned chain at Bucket [${bucketIdx}]. Key "${searchKey}" does not exist.`,
        pseudoCodeLine: 'return null; // NOT FOUND',
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // 3. Delete Operation
  const handleDelete = (keyToDelete: string) => {
    const bucketIdx = hashFunction(keyToDelete);
    const updated = buckets.map((b, idx) => {
      if (idx !== bucketIdx) return b;
      return b.filter((e) => e.key !== keyToDelete);
    });

    setBuckets(updated);
    setSteps([
      {
        activeBucketIdx: bucketIdx,
        bucketsState: updated,
        actionDescription: `Removed key "${keyToDelete}" from Bucket [${bucketIdx}] chain.`,
        pseudoCodeLine: 'table[index].remove(key);',
      },
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-comic font-bold text-black">Key:</span>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-20 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1 text-xs font-comic font-bold text-black focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-comic font-bold text-black">Val:</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-24 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1 text-xs font-comic font-bold text-black focus:bg-white focus:outline-none"
            />
          </div>

          <button
            onClick={handleInsert}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-3.5 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Put (Insert)</span>
          </button>

          <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
            <span className="text-xs font-comic font-bold text-black">Find Key:</span>
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="w-20 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1 text-xs font-comic font-bold text-black focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#22C55E] px-3.5 py-1.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
              <span>Get (Search)</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setBuckets(Array.from({ length: BUCKET_COUNT }, () => []));
            setSteps([]);
          }}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Clear</span>
        </button>
      </div>

      {/* Main Hash Table Grid (Pure White Comic Style like Array) */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-5 shadow-[5px_5px_0px_#000]">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 text-xs font-comic font-bold text-black">
          <div className="flex items-center gap-3 bg-[#FFE135] px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            <Hash className="h-4 w-4 text-black stroke-[2.5]" />
            <span>Hash Table Slots (Capacity = {BUCKET_COUNT} Buckets)</span>
          </div>
          <div className="bg-slate-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            Load Factor (α = n/k): <strong className="text-black font-mono font-black">{loadFactor}</strong>
          </div>
        </div>

        {/* Buckets with Chaining */}
        <div className="space-y-3">
          {displayedBuckets.map((bucket, idx) => {
            const isBucketActive = currentStep?.activeBucketIdx === idx;

            return (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border-2 border-black p-3 transition-all duration-300 ${
                  isBucketActive
                    ? 'bg-[#FFE135] shadow-[3px_3px_0px_#000]'
                    : 'bg-slate-50 shadow-[2px_2px_0px_#000]'
                }`}
              >
                {/* Bucket slot header */}
                <div className="flex items-center justify-between sm:w-32 shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 border-black pb-2 sm:pb-0 sm:pr-3">
                  <span className="font-comic text-xs font-black text-black">
                    Bucket [{idx}]
                  </span>
                  <span className="font-comic text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-black">
                    {bucket.length} items
                  </span>
                </div>

                {/* Chain of items */}
                <div className="flex flex-wrap items-center gap-2">
                  {bucket.length === 0 ? (
                    <span className="text-xs font-comic font-bold text-slate-400 italic">
                      [ NULL - Empty Bucket ]
                    </span>
                  ) : (
                    bucket.map((entry, entryIdx) => {
                      const isMatch = currentStep?.activeKey === entry.key;

                      return (
                        <div key={entryIdx} className="flex items-center gap-2">
                          <div
                            className={`flex items-center gap-2 rounded-xl border-2 border-black px-3 py-1.5 text-xs font-comic font-bold transition-all ${
                              isMatch
                                ? 'bg-[#22C55E] text-white shadow-[2px_2px_0px_#000]'
                                : 'bg-white text-black shadow-[2px_2px_0px_#000]'
                            }`}
                          >
                            <span className={isMatch ? 'text-white font-black' : 'text-black font-black'}>{entry.key}:</span>
                            <span>"{entry.value}"</span>
                            <button
                              onClick={() => handleDelete(entry.key)}
                              className="ml-1 text-slate-500 hover:text-rose-600 transition-colors font-black cursor-pointer"
                              title="Delete key"
                            >
                              ×
                            </button>
                          </div>
                          {entryIdx < bucket.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-black stroke-[3]" />
                          )}
                        </div>
                      );
                    })
                  )}
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
        topicId="hash-table"
        operation="insert"
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName="Hash Table (Separate Chaining)"
        description="Associative array mapping keys to values using a deterministic hash function. Offers O(1) average-case insertion, retrieval, and deletion."
        bestComplexity="O(1)"
        worstComplexity="O(n)"
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Total Keys', value: totalEntries },
          { label: 'Bucket Count', value: BUCKET_COUNT },
          { label: 'Load Factor α', value: loadFactor },
        ]}
      />
    </div>
  );
};
