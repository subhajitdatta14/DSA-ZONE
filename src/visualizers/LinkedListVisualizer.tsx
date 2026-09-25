import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Search,
  RotateCcw,
  ArrowRight,
  ArrowLeftRight,
  Shuffle,
  GitCommit,
  AlertCircle,
} from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';
import { ComicBurst } from '../components/ComicBadge';

interface NodeItem {
  id: string;
  value: number;
  memoryAddr: string;
}

interface Step {
  activeNodeIds: string[];
  activePointerIndex?: number;
  actionDescription: string;
  pseudoCodeLine?: string;
  nodesState: NodeItem[];
}

interface LinkedListVisualizerProps {
  isDoubly?: boolean;
  onOperationComplete?: () => void;
}

const INITIAL_VALUES = [12, 45, 78, 23];

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  isDoubly = false,
  onOperationComplete,
}) => {
  const [nodes, setNodes] = useState<NodeItem[]>(() =>
    INITIAL_VALUES.map((val, idx) => ({
      id: `node-${idx}-${Date.now()}`,
      value: val,
      memoryAddr: `0x${(0x4000 + idx * 0x20).toString(16).toUpperCase()}`,
    }))
  );

  const [activeTab, setActiveTab] = useState<'insert' | 'delete' | 'search' | 'reverse'>('insert');
  const [inputValue, setInputValue] = useState<string>('99');
  const [insertPosition, setInsertPosition] = useState<'head' | 'tail' | 'index'>('head');
  const [inputIndex, setInputIndex] = useState<string>('1');
  const [searchTarget, setSearchTarget] = useState<string>('45');

  // Animation State
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(650);
  const [stats, setStats] = useState({ pointerSwaps: 0, traversals: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Playback timer
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
  const displayedNodes = currentStep ? currentStep.nodesState : nodes;

  const generateRandomNodes = () => {
    setIsPlaying(false);
    setErrorMessage(null);
    const count = 4;
    const newItems: NodeItem[] = Array.from({ length: count }).map((_, idx) => ({
      id: `node-${idx}-${Date.now()}`,
      value: Math.floor(Math.random() * 90) + 10,
      memoryAddr: `0x${(0x4000 + idx * 0x20).toString(16).toUpperCase()}`,
    }));
    setNodes(newItems);
    setSteps([]);
    setCurrentStepIndex(0);
  };

  // 1. Insert Operation
  const handleInsert = () => {
    setErrorMessage(null);
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) {
      setErrorMessage('Please enter a valid numeric value');
      return;
    }

    if (nodes.length >= 8) {
      setErrorMessage('Max capacity reached (8 nodes) for clear visualization');
      return;
    }

    const newNode: NodeItem = {
      id: `node-${Date.now()}`,
      value: val,
      memoryAddr: `0x${(0x4000 + Math.floor(Math.random() * 0x500)).toString(16).toUpperCase()}`,
    };

    const newSteps: Step[] = [];

    if (insertPosition === 'head') {
      newSteps.push({
        activeNodeIds: [newNode.id],
        actionDescription: `Allocate new node with value ${val} in heap memory at address ${newNode.memoryAddr}`,
        pseudoCodeLine: 'Node* newNode = new Node(val);',
        nodesState: [newNode, ...nodes],
      });

      newSteps.push({
        activeNodeIds: [newNode.id, ...(nodes[0] ? [nodes[0].id] : [])],
        actionDescription: `Point newNode->next to current HEAD (${nodes[0]?.memoryAddr || 'NULL'})`,
        pseudoCodeLine: 'newNode->next = head;',
        nodesState: [newNode, ...nodes],
      });

      const updated = [newNode, ...nodes];
      newSteps.push({
        activeNodeIds: [newNode.id],
        actionDescription: `Reassign HEAD pointer to newNode (${newNode.memoryAddr}). Insertion complete! O(1) time.`,
        pseudoCodeLine: 'head = newNode;',
        nodesState: updated,
      });

      setNodes(updated);
      setStats((s) => ({ ...s, pointerSwaps: s.pointerSwaps + 1 }));
    } else if (insertPosition === 'tail') {
      newSteps.push({
        activeNodeIds: [newNode.id],
        actionDescription: `Allocate new node with value ${val} at ${newNode.memoryAddr}`,
        pseudoCodeLine: 'Node* newNode = new Node(val);',
        nodesState: [...nodes, newNode],
      });

      // Traversal to tail
      for (let i = 0; i < nodes.length; i++) {
        newSteps.push({
          activeNodeIds: [nodes[i].id],
          activePointerIndex: i,
          actionDescription: `Traversing pointer: visiting index ${i} (value: ${nodes[i].value})`,
          pseudoCodeLine: 'curr = curr->next;',
          nodesState: [...nodes, newNode],
        });
      }

      const updated = [...nodes, newNode];
      newSteps.push({
        activeNodeIds: [newNode.id],
        actionDescription: `Attached tail node->next to newNode. Tail insertion finished!`,
        pseudoCodeLine: 'tail->next = newNode;',
        nodesState: updated,
      });

      setNodes(updated);
      setStats((s) => ({ ...s, pointerSwaps: s.pointerSwaps + 1, traversals: s.traversals + nodes.length }));
    } else {
      const idx = parseInt(inputIndex, 10);
      if (isNaN(idx) || idx < 0 || idx > nodes.length) {
        setErrorMessage(`Please enter a valid index between 0 and ${nodes.length}`);
        return;
      }

      if (idx === 0) {
        handleInsert();
        return;
      }

      for (let i = 0; i < idx; i++) {
        newSteps.push({
          activeNodeIds: [nodes[i].id],
          activePointerIndex: i,
          actionDescription: `Traversing to target insertion index ${idx}: currently at index ${i}`,
          pseudoCodeLine: 'curr = curr->next;',
          nodesState: nodes,
        });
      }

      const updated = [...nodes.slice(0, idx), newNode, ...nodes.slice(idx)];
      newSteps.push({
        activeNodeIds: [newNode.id],
        actionDescription: `Updated pointer links at index ${idx}. Linked node successfully!`,
        pseudoCodeLine: 'newNode->next = curr->next; curr->next = newNode;',
        nodesState: updated,
      });

      setNodes(updated);
      setStats((s) => ({ ...s, pointerSwaps: s.pointerSwaps + 2, traversals: s.traversals + idx }));
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  // 2. Delete Operation
  const handleDelete = (target: 'head' | 'tail') => {
    setErrorMessage(null);
    if (nodes.length === 0) {
      setErrorMessage('List is already empty!');
      return;
    }

    const newSteps: Step[] = [];

    if (target === 'head') {
      newSteps.push({
        activeNodeIds: [nodes[0].id],
        actionDescription: `Identify HEAD node (${nodes[0].value}) to delete`,
        pseudoCodeLine: 'Node* temp = head;',
        nodesState: nodes,
      });

      const updated = nodes.slice(1);
      newSteps.push({
        activeNodeIds: updated[0] ? [updated[0].id] : [],
        actionDescription: `Advance HEAD pointer to head->next and deallocate old head. O(1) time.`,
        pseudoCodeLine: 'head = head->next; delete temp;',
        nodesState: updated,
      });

      setNodes(updated);
      setStats((s) => ({ ...s, pointerSwaps: s.pointerSwaps + 1 }));
    } else {
      for (let i = 0; i < nodes.length; i++) {
        newSteps.push({
          activeNodeIds: [nodes[i].id],
          activePointerIndex: i,
          actionDescription: `Traversing toward tail node: index ${i}`,
          pseudoCodeLine: 'curr = curr->next;',
          nodesState: nodes,
        });
      }

      const updated = nodes.slice(0, nodes.length - 1);
      newSteps.push({
        activeNodeIds: updated.length > 0 ? [updated[updated.length - 1].id] : [],
        actionDescription: `Set second-to-last node->next = NULL and free tail node. O(n) time.`,
        pseudoCodeLine: 'prev->next = nullptr; delete tail;',
        nodesState: updated,
      });

      setNodes(updated);
      setStats((s) => ({ ...s, pointerSwaps: s.pointerSwaps + 1, traversals: s.traversals + nodes.length }));
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  // 3. Search Operation
  const handleSearch = () => {
    setErrorMessage(null);
    const target = parseInt(searchTarget, 10);
    if (isNaN(target)) {
      setErrorMessage('Please enter a target number to search');
      return;
    }

    const newSteps: Step[] = [];
    let found = false;

    for (let i = 0; i < nodes.length; i++) {
      const isMatch = nodes[i].value === target;
      newSteps.push({
        activeNodeIds: [nodes[i].id],
        activePointerIndex: i,
        actionDescription: `Inspecting node at index ${i} (value: ${nodes[i].value}) vs target ${target}`,
        pseudoCodeLine: 'if (curr->data == target) return curr;',
        nodesState: nodes,
      });

      if (isMatch) {
        found = true;
        newSteps.push({
          activeNodeIds: [nodes[i].id],
          activePointerIndex: i,
          actionDescription: `MATCH FOUND! Target ${target} located at index ${i} (address ${nodes[i].memoryAddr}).`,
          pseudoCodeLine: 'return curr; // FOUND!',
          nodesState: nodes,
        });
        break;
      }
    }

    if (!found) {
      newSteps.push({
        activeNodeIds: [],
        actionDescription: `Reached NULL. Target ${target} not present in linked list.`,
        pseudoCodeLine: 'return nullptr; // NOT FOUND',
        nodesState: nodes,
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setStats((s) => ({ ...s, traversals: s.traversals + (found ? currentStepIndex + 1 : nodes.length) }));
    if (onOperationComplete) onOperationComplete();
  };

  // 4. Reverse Operation
  const handleReverse = () => {
    setErrorMessage(null);
    if (nodes.length <= 1) return;

    const newSteps: Step[] = [];
    for (let i = 0; i < nodes.length; i++) {
      newSteps.push({
        activeNodeIds: [nodes[i].id],
        activePointerIndex: i,
        actionDescription: `Reversing pointer for node ${nodes[i].value}: curr->next = prev`,
        pseudoCodeLine: 'next = curr->next; curr->next = prev; prev = curr; curr = next;',
        nodesState: nodes,
      });
    }

    const reversed = [...nodes].reverse();
    newSteps.push({
      activeNodeIds: [reversed[0].id],
      actionDescription: 'Head updated to former tail. Entire linked list successfully reversed in O(n) time!',
      pseudoCodeLine: 'head = prev;',
      nodesState: reversed,
    });

    setNodes(reversed);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setStats((s) => ({ ...s, pointerSwaps: s.pointerSwaps + nodes.length }));
    if (onOperationComplete) onOperationComplete();
  };

  return (
    <div className="space-y-6">
      {/* Operation Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('insert')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-comic text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'insert'
                ? 'border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]'
                : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
            }`}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Insert</span>
          </button>

          <button
            onClick={() => setActiveTab('delete')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-comic text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'delete'
                ? 'border-2 border-black bg-[#EF4444] text-white shadow-[2px_2px_0px_#000]'
                : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
            }`}
          >
            <Trash2 className="h-4 w-4 stroke-[2.5]" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-comic text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'border-2 border-black bg-[#22C55E] text-white shadow-[2px_2px_0px_#000]'
                : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
            }`}
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
            <span>Search</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('reverse');
              handleReverse();
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-comic text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'reverse'
                ? 'border-2 border-black bg-purple-500 text-white shadow-[2px_2px_0px_#000]'
                : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
            }`}
          >
            <RotateCcw className="h-4 w-4 stroke-[2.5]" />
            <span>Reverse</span>
          </button>
        </div>

        <button
          onClick={generateRandomNodes}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <Shuffle className="h-3.5 w-3.5 text-black stroke-[2.5]" />
          <span>Randomize</span>
        </button>
      </div>

      {/* Dynamic Action Controls */}
      <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
        {activeTab === 'insert' && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-comic font-bold text-black">Value:</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-20 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 border-l-2 border-slate-200 pl-3">
              <span className="text-xs font-comic font-bold text-slate-700">Position:</span>
              <button
                onClick={() => setInsertPosition('head')}
                className={`rounded-lg px-2.5 py-1 text-xs font-comic font-bold cursor-pointer transition-all ${
                  insertPosition === 'head'
                    ? 'border-2 border-black bg-[#FFE135] text-black shadow-[1px_1px_0px_#000]'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Head
              </button>
              <button
                onClick={() => setInsertPosition('tail')}
                className={`rounded-lg px-2.5 py-1 text-xs font-comic font-bold cursor-pointer transition-all ${
                  insertPosition === 'tail'
                    ? 'border-2 border-black bg-[#FFE135] text-black shadow-[1px_1px_0px_#000]'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Tail
              </button>
              <button
                onClick={() => setInsertPosition('index')}
                className={`rounded-lg px-2.5 py-1 text-xs font-comic font-bold cursor-pointer transition-all ${
                  insertPosition === 'index'
                    ? 'border-2 border-black bg-[#FFE135] text-black shadow-[1px_1px_0px_#000]'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Index
              </button>
            </div>

            {insertPosition === 'index' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-comic font-bold text-slate-700">Index:</span>
                <input
                  type="number"
                  value={inputIndex}
                  onChange={(e) => setInputIndex(e.target.value)}
                  className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={handleInsert}
              className="ml-auto rounded-xl border-2 border-black bg-[#FFE135] px-4 py-2 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              Execute Insert
            </button>
          </div>
        )}

        {activeTab === 'delete' && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-comic font-bold text-black">Remove Node:</span>
            <button
              onClick={() => handleDelete('head')}
              className="rounded-xl border-2 border-black bg-[#EF4444] px-4 py-2 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              Delete Head (O(1))
            </button>
            <button
              onClick={() => handleDelete('tail')}
              className="rounded-xl border-2 border-black bg-rose-100 px-4 py-2 font-comic text-xs font-bold text-rose-900 shadow-[2px_2px_0px_#000] hover:bg-rose-200 transition-transform active:translate-y-0.5 cursor-pointer"
            >
              Delete Tail (O(n))
            </button>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-comic font-bold text-black">Target Value:</span>
              <input
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                className="w-24 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="rounded-xl border-2 border-black bg-[#22C55E] px-4 py-2 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              Run Pointer Traversal
            </button>
          </div>
        )}

        {activeTab === 'reverse' && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-comic text-slate-800">
              Three-pointer list reversal (<code className="font-mono font-bold text-purple-700">prev</code>, <code className="font-mono font-bold text-amber-700">curr</code>, <code className="font-mono font-bold text-emerald-700">next</code>).
            </span>
            <button
              onClick={handleReverse}
              className="rounded-xl border-2 border-black bg-purple-500 px-4 py-2 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              Rerun Reversal
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border-2 border-black bg-[#FEF2F2] p-3 text-xs font-bold text-rose-800 shadow-[2px_2px_0px_#000]">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Visualization Stage Canvas (Pure White Comic Style like Array) */}
      <div className="relative min-h-[320px] rounded-2xl border-2 border-black bg-white p-6 flex flex-col justify-between overflow-x-auto shadow-[5px_5px_0px_#000]">
        {/* Head and Tail Indicators */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 text-xs font-comic font-bold text-black">
          <div className="flex items-center gap-2 bg-[#FFE135] px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            <span className="text-black">HEAD Pointer</span>
            <span>→</span>
            <span className="font-mono">{displayedNodes.length > 0 ? displayedNodes[0].memoryAddr : 'NULL'}</span>
          </div>
          <div className="bg-slate-100 px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            <span>Type: </span>
            <span className="font-black text-black">{isDoubly ? 'Doubly Linked List' : 'Singly Linked List'}</span>
          </div>
        </div>

        {/* Nodes Chain Display */}
        <div className="my-8 flex items-center gap-3 overflow-x-auto pb-4 justify-start sm:justify-center min-w-max">
          {displayedNodes.length === 0 ? (
            <div className="py-12 text-center text-sm font-comic font-bold text-slate-500">
              [ Empty List: HEAD points to NULL ]
            </div>
          ) : (
            displayedNodes.map((node, idx) => {
              const isActive = currentStep?.activeNodeIds.includes(node.id);
              const isPointerHere = currentStep?.activePointerIndex === idx;
              const isHead = idx === 0;
              const isTail = idx === displayedNodes.length - 1;

              return (
                <div key={node.id} className="flex items-center shrink-0">
                  {/* Node Container */}
                  <div className="flex flex-col items-center">
                    {/* Top pointers indicator */}
                    <div className="h-6 text-[10px] font-comic font-black">
                      {isHead && <span className="bg-black text-white px-2 py-0.5 rounded border border-black">HEAD</span>}
                      {isTail && !isHead && <span className="bg-purple-600 text-white px-2 py-0.5 rounded border border-black">TAIL</span>}
                      {isPointerHere && <span className="bg-[#FFE135] text-black px-2 py-0.5 rounded border border-black ml-1">▲ curr</span>}
                    </div>

                    {/* Dual/Triple-segment Node Cell */}
                    <div
                      className={`flex rounded-xl border-2 border-black transition-all duration-300 ${
                        isActive
                          ? 'bg-[#FFE135] shadow-[4px_4px_0px_#000] scale-105 -translate-y-1'
                          : 'bg-white shadow-[3px_3px_0px_#000]'
                      }`}
                    >
                      {/* Prev pointer slot (for doubly linked list) */}
                      {isDoubly && (
                        <div className="flex w-8 flex-col items-center justify-center border-r-2 border-black bg-slate-100 px-1 py-3 text-[10px] font-comic font-bold text-slate-700">
                          <span>prev</span>
                        </div>
                      )}

                      {/* Value Data field */}
                      <div className="flex min-w-16 flex-col items-center justify-center px-4 py-3">
                        <span className="font-comic text-xl font-black text-black">
                          {node.value}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-600 mt-0.5">
                          idx: {idx}
                        </span>
                      </div>

                      {/* Next pointer field */}
                      <div className="flex w-10 flex-col items-center justify-center border-l-2 border-black bg-slate-100 px-1.5 py-3 text-[10px] font-comic font-bold text-black">
                        <span>next</span>
                        <span className="text-[10px]">•</span>
                      </div>
                    </div>

                    {/* Address tag */}
                    <span className="mt-1.5 font-mono text-[10px] font-bold text-slate-700">
                      {node.memoryAddr}
                    </span>
                  </div>

                  {/* Inter-node Pointer Arrow */}
                  <div className="flex flex-col items-center px-2">
                    {isDoubly ? (
                      <ArrowLeftRight className="h-5 w-5 text-black stroke-[3]" />
                    ) : (
                      <ArrowRight className="h-5 w-5 text-black stroke-[3]" />
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Terminal NULL node */}
          <div className="flex flex-col items-center shrink-0">
            <div className="h-6" />
            <div className="flex h-14 w-16 items-center justify-center rounded-xl border-2 border-dashed border-black bg-slate-100 font-comic text-xs font-black text-slate-800 shadow-[2px_2px_0px_#000]">
              NULL
            </div>
            <span className="mt-1.5 font-mono text-[10px] font-bold text-slate-600">0x0000</span>
          </div>
        </div>

        {/* Live Step Explanation Footer inside canvas */}
        {currentStep && (
          <div className="rounded-xl border-2 border-black bg-amber-50 p-3 text-xs font-comic text-slate-900 shadow-[2px_2px_0px_#000]">
            <span className="font-black text-black">Step {currentStepIndex + 1}/{steps.length}: </span>
            <span className="font-bold">{currentStep.actionDescription}</span>
            {currentStep.pseudoCodeLine && (
              <div className="mt-1 text-[11px] font-mono font-bold text-amber-900">
                &gt; {currentStep.pseudoCodeLine}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animation Playback Controls */}
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

      {/* Complexity and Technical Details Panel with Live Code Demonstration */}
      <ComplexityPanel
        topicId="linked-list"
        operation={currentStep?.actionDescription?.toLowerCase().includes('delete') ? 'delete' : currentStep?.actionDescription?.toLowerCase().includes('search') ? 'search' : currentStep?.actionDescription?.toLowerCase().includes('reverse') ? 'reverse' : 'insert'}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName={isDoubly ? 'Doubly Linked List Operations' : 'Singly Linked List Operations'}
        description={
          isDoubly
            ? 'Each node maintains two address references: NEXT and PREV. Allows bidirectional traversal and O(1) node deletion given a pointer.'
            : 'Linear dynamic data structure storing data and memory reference pointers in non-contiguous heap memory.'
        }
        bestComplexity="O(1)"
        worstComplexity="O(n)"
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Total Nodes', value: displayedNodes.length },
          { label: 'Pointer Updates', value: stats.pointerSwaps },
          { label: 'Traversals', value: stats.traversals },
        ]}
      />
    </div>
  );
};
