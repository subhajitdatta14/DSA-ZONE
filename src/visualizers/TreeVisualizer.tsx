import React, { useState, useEffect, useMemo } from 'react';
import { GitBranch, Play, RotateCcw, Shuffle, Sparkles, Check, Search, ArrowRight, ListFilter } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';
import { ComicBurst } from '../components/ComicBadge';

interface TreeNode {
  val: number;
  left?: TreeNode;
  right?: TreeNode;
}

interface TreeStep {
  treeSnapshot: TreeNode | null;
  currentListIndex: number;
  activeVal?: number;
  justInsertedVal?: number;
  visitedVals: number[];
  actionDescription: string;
  pseudoCodeLine?: string;
  status: 'initial' | 'comparing' | 'inserted' | 'complete';
}

interface TreeVisualizerProps {
  isBST?: boolean;
  onOperationComplete?: () => void;
}

const DEFAULT_LIST = [50, 30, 70, 20, 40, 60, 80];

const PRESETS: Record<string, number[]> = {
  'Min (7)': [50, 30, 70, 20, 40, 60, 80],
  'Standard (10)': [50, 25, 75, 15, 35, 65, 85, 10, 30, 90],
  'Max (15)': [50, 30, 70, 15, 40, 60, 85, 10, 20, 35, 45, 55, 65, 80, 95],
};

function cloneTree(node: TreeNode | undefined | null): TreeNode | undefined {
  if (!node) return undefined;
  return {
    val: node.val,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  isBST = true,
  onOperationComplete,
}) => {
  // Input list state
  const [inputList, setInputList] = useState<number[]>(DEFAULT_LIST);
  const [customListText, setCustomListText] = useState<string>(DEFAULT_LIST.join(', '));
  const [searchTarget, setSearchTarget] = useState<string>('40');

  // Animation Steps state
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(850);

  // Generate steps for automatic tree drawing from inputList
  const buildSteps = useMemo(() => {
    const generated: TreeStep[] = [];

    // Step 0: 1st show the input list ready for drawing
    generated.push({
      treeSnapshot: null,
      currentListIndex: -1,
      visitedVals: [],
      actionDescription: `1st: Input list [${inputList.join(', ')}] loaded. Click Play ▶ to start automatic ${isBST ? 'BST' : 'Binary'} tree drawing!`,
      pseudoCodeLine: `const list = [${inputList.join(', ')}]; // Ready to construct tree`,
      status: 'initial',
    });

    if (inputList.length === 0) return generated;

    if (isBST) {
      // Correct BST Construction: Insert each element adhering to BST Invariant (Left < Root < Right)
      let currentTree: TreeNode | null = null;

      for (let i = 0; i < inputList.length; i++) {
        const val = inputList[i];

        if (!currentTree) {
          currentTree = { val };
          generated.push({
            treeSnapshot: cloneTree(currentTree) || null,
            currentListIndex: i,
            justInsertedVal: val,
            visitedVals: [val],
            actionDescription: `1st item (${val}) from list: Placed as the ROOT node of the tree.`,
            pseudoCodeLine: `root = new TreeNode(${val});`,
            status: 'inserted',
          });
          continue;
        }

        // Traverse down the tree to locate proper insertion leaf
        let curr: TreeNode = currentTree;
        const visited: number[] = [];

        while (true) {
          visited.push(curr.val);

          if (val < curr.val) {
            generated.push({
              treeSnapshot: cloneTree(currentTree) || null,
              currentListIndex: i,
              activeVal: curr.val,
              visitedVals: [...visited],
              actionDescription: `Drawing item (${val}): Compare with node ${curr.val}. Since ${val} < ${curr.val}, branch LEFT.`,
              pseudoCodeLine: `if (${val} < ${curr.val}) curr = curr.left;`,
              status: 'comparing',
            });

            if (!curr.left) {
              curr.left = { val };
              generated.push({
                treeSnapshot: cloneTree(currentTree) || null,
                currentListIndex: i,
                justInsertedVal: val,
                visitedVals: [...visited, val],
                actionDescription: `Left child of ${curr.val} is open! Drew branch & placed new node (${val}).`,
                pseudoCodeLine: `curr.left = new TreeNode(${val});`,
                status: 'inserted',
              });
              break;
            } else {
              curr = curr.left;
            }
          } else {
            generated.push({
              treeSnapshot: cloneTree(currentTree) || null,
              currentListIndex: i,
              activeVal: curr.val,
              visitedVals: [...visited],
              actionDescription: `Drawing item (${val}): Compare with node ${curr.val}. Since ${val} >= ${curr.val}, branch RIGHT.`,
              pseudoCodeLine: `if (${val} >= ${curr.val}) curr = curr.right;`,
              status: 'comparing',
            });

            if (!curr.right) {
              curr.right = { val };
              generated.push({
                treeSnapshot: cloneTree(currentTree) || null,
                currentListIndex: i,
                justInsertedVal: val,
                visitedVals: [...visited, val],
                actionDescription: `Right child of ${curr.val} is open! Drew branch & placed new node (${val}).`,
                pseudoCodeLine: `curr.right = new TreeNode(${val});`,
                status: 'inserted',
              });
              break;
            } else {
              curr = curr.right;
            }
          }
        }
      }

      generated.push({
        treeSnapshot: cloneTree(currentTree) || null,
        currentListIndex: inputList.length - 1,
        visitedVals: [],
        actionDescription: `Tree drawing complete! All ${inputList.length} elements from list [${inputList.join(', ')}] are correctly placed in the BST.`,
        pseudoCodeLine: `// Binary Search Tree constructed in O(n log n) time`,
        status: 'complete',
      });
    } else {
      // General Binary Tree: Level-Order (Breadth-First) sequential placement
      let root: TreeNode = { val: inputList[0] };
      generated.push({
        treeSnapshot: cloneTree(root) || null,
        currentListIndex: 0,
        justInsertedVal: inputList[0],
        visitedVals: [inputList[0]],
        actionDescription: `1st item (${inputList[0]}) from list: Placed as the ROOT node of the tree.`,
        pseudoCodeLine: `root = new TreeNode(${inputList[0]});`,
        status: 'inserted',
      });

      for (let i = 1; i < inputList.length; i++) {
        const val = inputList[i];
        const queue: TreeNode[] = [root];
        let inserted = false;

        while (queue.length > 0 && !inserted) {
          const parent = queue.shift()!;

          generated.push({
            treeSnapshot: cloneTree(root) || null,
            currentListIndex: i,
            activeVal: parent.val,
            visitedVals: [parent.val],
            actionDescription: `Drawing item (${val}): Checking level-order parent slot at node ${parent.val}.`,
            pseudoCodeLine: `parent = queue.shift();`,
            status: 'comparing',
          });

          if (!parent.left) {
            parent.left = { val };
            generated.push({
              treeSnapshot: cloneTree(root) || null,
              currentListIndex: i,
              justInsertedVal: val,
              visitedVals: [parent.val, val],
              actionDescription: `Left slot of node ${parent.val} is open! Drew branch & placed node (${val}).`,
              pseudoCodeLine: `parent.left = new TreeNode(${val});`,
              status: 'inserted',
            });
            inserted = true;
          } else if (!parent.right) {
            queue.push(parent.left);
            parent.right = { val };
            generated.push({
              treeSnapshot: cloneTree(root) || null,
              currentListIndex: i,
              justInsertedVal: val,
              visitedVals: [parent.val, val],
              actionDescription: `Right slot of node ${parent.val} is open! Drew branch & placed node (${val}).`,
              pseudoCodeLine: `parent.right = new TreeNode(${val});`,
              status: 'inserted',
            });
            inserted = true;
          } else {
            queue.push(parent.left);
            queue.push(parent.right);
          }
        }
      }

      generated.push({
        treeSnapshot: cloneTree(root) || null,
        currentListIndex: inputList.length - 1,
        visitedVals: [],
        actionDescription: `Tree drawing complete! All ${inputList.length} elements placed in level-order.`,
        pseudoCodeLine: `// Binary Tree level-order construction finished`,
        status: 'complete',
      });
    }

    return generated;
  }, [inputList, isBST]);

  // Synchronize generated buildSteps to local steps
  useEffect(() => {
    setSteps(buildSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [buildSteps]);

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
        if (onOperationComplete) onOperationComplete();
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, speedMs, onOperationComplete]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const displayTree = currentStep?.treeSnapshot || null;
  const activeVal = currentStep?.activeVal;
  const justInsertedVal = currentStep?.justInsertedVal;
  const visitedVals = currentStep?.visitedVals || [];
  const currentListIdx = currentStep?.currentListIndex ?? -1;

  // Flatten tree to coordinates for SVG rendering (scaled for 7 to 20 nodes)
  const getLayout = (
    root: TreeNode | undefined | null,
    x = 360,
    y = 45,
    offset = 150,
    parentX?: number,
    parentY?: number,
    depth = 0
  ): Array<{ val: number; x: number; y: number; parentX?: number; parentY?: number }> => {
    if (!root) return [];
    const current = [{ val: root.val, x, y, parentX, parentY }];
    const nextOffset = Math.max(22, offset / 1.88);
    const left = getLayout(root.left, x - offset, y + 58, nextOffset, x, y, depth + 1);
    const right = getLayout(root.right, x + offset, y + 58, nextOffset, x, y, depth + 1);
    return [...current, ...left, ...right];
  };

  const layoutNodes = getLayout(displayTree);

  // Set new custom list with strict bounds: minimum 7, maximum 20
  const handleApplyCustomList = () => {
    let parsed = customListText
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length === 0) return;

    // Strict constraint: Minimum 7, Maximum 15
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

    setInputList(parsed);
    setCustomListText(parsed.join(', '));
  };

  // Generate random list within [7, 15] range
  const handleRandomList = () => {
    const size = Math.floor(Math.random() * (15 - 7 + 1)) + 7; // 7 to 15
    const setVals = new Set<number>();
    while (setVals.size < size) {
      setVals.add(Math.floor(Math.random() * 92) + 5);
    }
    const generated = Array.from(setVals);
    setInputList(generated);
    setCustomListText(generated.join(', '));
  };

  // Traversal on the currently constructed tree
  const handleTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (!displayTree) {
      // If tree not drawn yet, jump to completed tree first
      setCurrentStepIndex(steps.length - 1);
    }

    const finalTree = steps[steps.length - 1]?.treeSnapshot;
    if (!finalTree) return;

    const traversalSteps: TreeStep[] = [];
    const visited: number[] = [];

    const traverse = (node: TreeNode | undefined) => {
      if (!node) return;

      if (type === 'preorder') {
        visited.push(node.val);
        traversalSteps.push({
          treeSnapshot: finalTree,
          currentListIndex: inputList.length - 1,
          activeVal: node.val,
          visitedVals: [...visited],
          actionDescription: `Pre-Order: Visit node ${node.val} (Root → Left → Right).`,
          pseudoCodeLine: 'visit(node); traverse(node.left); traverse(node.right);',
          status: 'comparing',
        });
      }

      traverse(node.left);

      if (type === 'inorder') {
        visited.push(node.val);
        traversalSteps.push({
          treeSnapshot: finalTree,
          currentListIndex: inputList.length - 1,
          activeVal: node.val,
          visitedVals: [...visited],
          actionDescription: `In-Order: Visit node ${node.val} (Left → Root → Right: sorted).`,
          pseudoCodeLine: 'traverse(node.left); visit(node); traverse(node.right);',
          status: 'comparing',
        });
      }

      traverse(node.right);

      if (type === 'postorder') {
        visited.push(node.val);
        traversalSteps.push({
          treeSnapshot: finalTree,
          currentListIndex: inputList.length - 1,
          activeVal: node.val,
          visitedVals: [...visited],
          actionDescription: `Post-Order: Visit node ${node.val} (Left → Right → Root).`,
          pseudoCodeLine: 'traverse(node.left); traverse(node.right); visit(node);',
          status: 'comparing',
        });
      }
    };

    traverse(finalTree);
    traversalSteps.push({
      treeSnapshot: finalTree,
      currentListIndex: inputList.length - 1,
      visitedVals: [...visited],
      actionDescription: `${type.toUpperCase()} Traversal Complete! Order: [${visited.join(', ')}]`,
      pseudoCodeLine: `// Finished ${type} traversal`,
      status: 'complete',
    });

    setSteps(traversalSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  // Search target inside constructed tree
  const handleSearch = () => {
    const target = parseInt(searchTarget, 10);
    if (isNaN(target)) return;

    const finalTree = steps[steps.length - 1]?.treeSnapshot;
    if (!finalTree) return;

    const searchSteps: TreeStep[] = [];
    const visited: number[] = [];

    let curr: TreeNode | undefined = finalTree;
    let found = false;

    while (curr) {
      visited.push(curr.val);
      searchSteps.push({
        treeSnapshot: finalTree,
        currentListIndex: inputList.length - 1,
        activeVal: curr.val,
        visitedVals: [...visited],
        actionDescription: `Searching for ${target}: Checking node (${curr.val}).`,
        pseudoCodeLine: `if (curr.val == ${target}) return curr;`,
        status: 'comparing',
      });

      if (curr.val === target) {
        found = true;
        searchSteps.push({
          treeSnapshot: finalTree,
          currentListIndex: inputList.length - 1,
          justInsertedVal: curr.val,
          visitedVals: [...visited],
          actionDescription: `TARGET FOUND! Key ${target} located in the tree.`,
          pseudoCodeLine: `return curr; // SUCCESS`,
          status: 'inserted',
        });
        break;
      } else if (isBST) {
        if (target < curr.val) {
          searchSteps.push({
            treeSnapshot: finalTree,
            currentListIndex: inputList.length - 1,
            activeVal: curr.val,
            visitedVals: [...visited],
            actionDescription: `${target} < ${curr.val}: Branching LEFT in BST.`,
            pseudoCodeLine: 'curr = curr.left;',
            status: 'comparing',
          });
          curr = curr.left;
        } else {
          searchSteps.push({
            treeSnapshot: finalTree,
            currentListIndex: inputList.length - 1,
            activeVal: curr.val,
            visitedVals: [...visited],
            actionDescription: `${target} > ${curr.val}: Branching RIGHT in BST.`,
            pseudoCodeLine: 'curr = curr.right;',
            status: 'comparing',
          });
          curr = curr.right;
        }
      } else {
        // Linear scan fallback for general binary tree
        curr = target < curr.val ? curr.left : curr.right;
      }
    }

    if (!found) {
      searchSteps.push({
        treeSnapshot: finalTree,
        currentListIndex: inputList.length - 1,
        visitedVals: [...visited],
        actionDescription: `Reached empty leaf. Target ${target} does not exist in the tree.`,
        pseudoCodeLine: 'return null; // NOT FOUND',
        status: 'complete',
      });
    }

    setSteps(searchSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  return (
    <div className="space-y-6">
      {/* 1. Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-comic font-bold text-black flex items-center gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span>Presets:</span>
            </span>
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => {
                  setInputList(PRESETS[name]);
                  setCustomListText(PRESETS[name].join(', '));
                }}
                className={`rounded-lg border-2 border-black px-2.5 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                  JSON.stringify(inputList) === JSON.stringify(PRESETS[name])
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
              placeholder="e.g. 50, 30, 70, 20"
              className="w-36 sm:w-48 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleApplyCustomList}
              className="rounded-xl border-2 border-black bg-white px-3 py-1 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 transition-transform active:translate-y-0.5 cursor-pointer"
            >
              Set List (7-15)
            </button>
            <button
              onClick={handleRandomList}
              className="flex items-center gap-1 rounded-xl border-2 border-black bg-[#FFE135] px-2.5 py-1 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
              title="Generate a random list with size between 7 and 15"
            >
              <Shuffle className="h-3 w-3 stroke-[2.5]" />
              <span>Random</span>
            </button>
          </div>

          {/* Search Key */}
          <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
            <span className="text-xs font-comic font-bold text-black">Find:</span>
            <input
              type="number"
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              className="w-14 rounded-xl border-2 border-black bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="rounded-xl border-2 border-black bg-[#22C55E] px-3 py-1 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Traversals */}
          <div className="flex items-center gap-1.5 border-l-2 border-slate-200 pl-3">
            <span className="text-xs font-comic font-bold text-black">Traverse:</span>
            <button
              onClick={() => handleTraversal('inorder')}
              className="rounded-lg border-2 border-black bg-slate-50 px-2 py-1 text-xs font-comic font-bold text-black hover:bg-[#FFE135] transition-colors cursor-pointer"
            >
              In-Order
            </button>
            <button
              onClick={() => handleTraversal('preorder')}
              className="rounded-lg border-2 border-black bg-slate-50 px-2 py-1 text-xs font-comic font-bold text-black hover:bg-[#FFE135] transition-colors cursor-pointer"
            >
              Pre-Order
            </button>
            <button
              onClick={() => handleTraversal('postorder')}
              className="rounded-lg border-2 border-black bg-slate-50 px-2 py-1 text-xs font-comic font-bold text-black hover:bg-[#FFE135] transition-colors cursor-pointer"
            >
              Post-Order
            </button>
          </div>
        </div>

        {/* Reset to Initial List Button */}
        <button
          onClick={() => {
            setSteps(buildSteps);
            setCurrentStepIndex(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
          title="Reset to 1st step with Input List"
        >
          <RotateCcw className="h-3.5 w-3.5 text-black stroke-[2.5]" />
          <span>Reset to List</span>
        </button>
      </div>

      {/* 2. Main Stage: 1st Show One List, Then Automatic Tree Drawing */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-5 shadow-[5px_5px_0px_#000]">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 text-xs font-comic font-bold text-black gap-2">
          <div className="flex items-center gap-2 bg-[#FFE135] px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            <GitBranch className="h-4 w-4 text-black stroke-[2.5]" />
            <span>{isBST ? 'Binary Search Tree Drawing' : 'Binary Tree Drawing'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600">Drawing Method:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-black font-bold">
              {isBST ? 'Left < Root < Right (BST Order)' : 'Level-Order (Breadth First)'}
            </span>
          </div>
        </div>

        {/* 1st SHOW ONE LIST (The Input List Component) */}
        <div className="rounded-xl border-2 border-black bg-slate-50 p-4 shadow-[3px_3px_0px_#000]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-black bg-[#FFE135] font-comic text-xs font-bold text-black">
                1
              </span>
              <span className="font-comic font-extrabold text-xs uppercase tracking-wider text-black">
                Input List to Draw into Tree ({inputList.length} items • Min 7, Max 15):
              </span>
            </div>

            <div className="text-[11px] font-comic font-bold text-slate-600">
              {currentListIdx < 0
                ? `Ready (${inputList.length} items) • Click Play to Start Drawing`
                : currentListIdx >= inputList.length - 1 && currentStep?.status === 'complete'
                ? `✓ All ${inputList.length} Elements Drawn`
                : `Drawing element ${currentListIdx + 1} of ${inputList.length}`}
            </div>
          </div>

          {/* List Items */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
            {inputList.map((val, idx) => {
              const isCurrentlyDrawing = idx === currentListIdx;
              const isAlreadyInserted = idx < currentListIdx || (idx === currentListIdx && currentStep?.status === 'complete');

              let pillStyle = 'bg-white text-black border-black shadow-[2px_2px_0px_#000]';
              if (isCurrentlyDrawing) {
                pillStyle = 'bg-[#FFE135] text-black border-black shadow-[3px_3px_0px_#000] scale-110 -translate-y-0.5';
              } else if (isAlreadyInserted) {
                pillStyle = 'bg-[#22C55E] text-white border-black shadow-[2px_2px_0px_#000]';
              }

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 px-3 py-1.5 font-mono transition-all duration-300 min-w-[52px] ${pillStyle}`}
                >
                  <span className="text-[10px] font-bold opacity-80">
                    [{idx}]
                  </span>
                  <span className="text-base font-extrabold">
                    {val}
                  </span>
                  <span className="text-[9px] font-comic font-bold uppercase mt-0.5">
                    {isCurrentlyDrawing ? 'DRAWING' : isAlreadyInserted ? 'DRAWN' : 'WAITING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tree Canvas Stage */}
        <div className="relative overflow-x-auto touch-scroll overscroll-contain min-h-[280px] sm:min-h-[320px] flex items-center justify-center border-2 border-black/15 rounded-xl bg-white p-2.5 sm:p-4">
          {layoutNodes.length === 0 ? (
            /* Initial State: Waiting for Play to start drawing */
            <div className="text-center p-6 sm:p-8 max-w-md space-y-4">
              <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border-2 border-black bg-[#FFE135] shadow-[3px_3px_0px_#000]">
                <GitBranch className="h-6 w-6 sm:h-7 sm:w-7 text-black stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-comic font-extrabold text-black">
                  Ready for Automatic Tree Drawing
                </h3>
                <p className="mt-1 text-xs font-comic font-medium text-slate-600 leading-relaxed">
                  The input list <strong className="text-black font-mono">[{inputList.join(', ')}]</strong> ({inputList.length} items) is loaded above.
                  Click the Play button to watch the tree build automatically, node by node, according to {isBST ? 'BST rules (left < root < right)' : 'level order'}!
                </p>
              </div>
              <button
                onClick={() => setIsPlaying(true)}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#FFE135] px-4 sm:px-5 py-2.5 font-comic text-xs font-extrabold text-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
              >
                <Play className="h-4 w-4 fill-black stroke-black" />
                <span>Start Automatic Tree Drawing</span>
              </button>
            </div>
          ) : (
            /* Active Tree Drawing SVG */
            <svg viewBox="0 0 720 340" className="w-full max-w-[720px] h-auto aspect-[720/340] min-w-[460px] sm:min-w-0 select-none">
              {/* Draw connecting branches */}
              {layoutNodes.map((n, i) => {
                if (n.parentX === undefined || n.parentY === undefined) return null;
                return (
                  <line
                    key={`line-${i}`}
                    x1={n.parentX}
                    y1={n.parentY}
                    x2={n.x}
                    y2={n.y}
                    stroke="#000000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Draw Tree Nodes */}
              {layoutNodes.map((n, i) => {
                const isActive = activeVal === n.val;
                const isJustInserted = justInsertedVal === n.val;
                const isVisited = visitedVals.includes(n.val);

                let nodeFill = '#FFFFFF';
                let textColor = '#000000';

                if (isJustInserted) {
                  nodeFill = '#22C55E'; // Celebratory green upon insertion
                  textColor = '#FFFFFF';
                } else if (isActive) {
                  nodeFill = '#FFE135'; // Yellow when comparing
                  textColor = '#000000';
                } else if (isVisited) {
                  nodeFill = '#F0FDF4';
                  textColor = '#166534';
                }

                return (
                  <g key={`node-${i}`} className="transition-all duration-300">
                    {/* Hard comic drop shadow circle */}
                    <circle
                      cx={n.x + 2.5}
                      cy={n.y + 2.5}
                      r="18"
                      fill="#000000"
                    />
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="18"
                      fill={nodeFill}
                      stroke="#000000"
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Fredoka, sans-serif"
                    >
                      {n.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Step Action & Explanation Bubble */}
        {currentStep && (
          <div className="rounded-xl border-2 border-black bg-amber-50 p-3.5 text-xs font-comic text-black shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md border border-black bg-[#FFE135] text-[10px] font-bold">
                {currentStepIndex + 1}
              </span>
              <span className="font-extrabold text-black text-sm">
                {currentStep.actionDescription}
              </span>
            </div>
            {currentStep.pseudoCodeLine && (
              <div className="text-amber-900 font-mono font-bold text-[11px] mt-1.5 pl-7">
                &gt; {currentStep.pseudoCodeLine}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Animation Controls (Play/Pause, Step Forward/Back, Speed Slider) */}
      <AnimationControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => {
          if (currentStepIndex >= steps.length - 1) {
            setCurrentStepIndex(0);
          }
          setIsPlaying(true);
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

      {/* 4. Complexity & Theory Panel with Live Code Demonstration */}
      <ComplexityPanel
        topicId="binary-search-tree"
        operation="insert"
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName={isBST ? 'Binary Search Tree (BST) Construction' : 'Binary Tree Level-Order Construction'}
        description={
          isBST
            ? 'Constructing a BST by sequentially inserting items from a list: for each element, it traverses left if smaller and right if greater until finding an empty child slot.'
            : 'Constructing a Binary Tree in sequential level-order: items are placed into the first available parent slot using a breadth-first queue.'
        }
        bestComplexity={isBST ? 'O(n log n)' : 'O(n)'}
        worstComplexity={isBST ? 'O(n²) Skewed' : 'O(n)'}
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Input List Size', value: inputList.length },
          { label: 'Drawn Nodes', value: layoutNodes.length },
          { label: 'Drawing Status', value: currentStep?.status === 'complete' ? 'Completed' : isPlaying ? 'Drawing...' : 'Paused' },
        ]}
      />
    </div>
  );
};
