import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';
import { ComicBurst } from '../components/ComicBadge';
import {
  RotateCcw,
  Plus,
  Shuffle,
  Scale,
  ListFilter,
  Search,
  GitBranch,
  ArrowRight,
  ShieldCheck,
  Play,
} from 'lucide-react';

interface AVLNode {
  val: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

interface AVLStep {
  root: AVLNode | null;
  currentListIndex: number;
  activeVal?: number | null;
  justInsertedVal?: number | null;
  imbalancedVal?: number | null;
  visitedVals?: number[];
  rotationType?: string;
  actionDescription: string;
  pseudoCodeLine?: string;
  status: 'initial' | 'taking' | 'comparing' | 'inserted' | 'unbalanced' | 'rotating' | 'balanced' | 'complete';
}

function getHeight(node: AVLNode | null): number {
  return node ? node.height : 0;
}

function getBalanceFactor(node: AVLNode | null): number {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function updateHeight(node: AVLNode): number {
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function rotateRight(y: AVLNode): AVLNode {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  return x;
}

function rotateLeft(x: AVLNode): AVLNode {
  const y = x.right!;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  return y;
}

function cloneAVL(node: AVLNode | null): AVLNode | null {
  if (!node) return null;
  return {
    val: node.val,
    height: node.height,
    left: cloneAVL(node.left),
    right: cloneAVL(node.right),
  };
}

const DEFAULT_AVL_LIST = [40, 20, 60, 10, 30, 50, 70];

const AVL_PRESETS: Record<string, number[]> = {
  'Min (7)': [40, 20, 60, 10, 30, 50, 70],
  'Standard (10)': [40, 20, 60, 10, 30, 50, 70, 5, 25, 65],
  'Max (15)': [50, 25, 75, 15, 35, 65, 85, 10, 20, 30, 40, 55, 70, 80, 90],
};

// Build comprehensive AVL animation steps from input list
function buildAVLSteps(inputList: number[]): AVLStep[] {
  const steps: AVLStep[] = [];

  // Step 0: 1st show the input list ready for drawing
  steps.push({
    root: null,
    currentListIndex: -1,
    visitedVals: [],
    actionDescription: `1st: Input list [${inputList.join(', ')}] loaded. Click Play ▶ to start automatic AVL tree drawing with proper balancing and rotations!`,
    pseudoCodeLine: `const list = [${inputList.join(', ')}]; // Ready to construct AVL Tree`,
    status: 'initial',
  });

  if (inputList.length === 0) return steps;

  let fullTree: AVLNode | null = null;

  const emit = (params: Omit<AVLStep, 'root'>) => {
    steps.push({
      ...params,
      root: cloneAVL(fullTree),
    });
  };

  for (let i = 0; i < inputList.length; i++) {
    const val = inputList[i];

    // Emit taking step
    emit({
      currentListIndex: i,
      activeVal: val,
      actionDescription: `Taking item #${i + 1} (${val}) from list: Preparing to insert into AVL Tree.`,
      pseudoCodeLine: `root = avlInsert(root, ${val});`,
      status: 'taking',
    });

    if (!fullTree) {
      fullTree = { val, height: 1, left: null, right: null };
      emit({
        currentListIndex: i,
        justInsertedVal: val,
        activeVal: val,
        actionDescription: `1st item (${val}) from list: Placed as the ROOT node of the AVL tree (BF = 0, Height = 1).`,
        pseudoCodeLine: `root = new AVLNode(${val}); // Root created`,
        status: 'inserted',
      });
      continue;
    }

    // Recursive insertion with backtracking rebalance & immediate parent wiring
    const insertNode = (
      curr: AVLNode,
      parent: AVLNode | null,
      isLeftChild: boolean
    ): AVLNode => {
      // Comparison step
      emit({
        currentListIndex: i,
        activeVal: curr.val,
        actionDescription: `Drawing item (${val}): Compare with node ${curr.val}. Since ${val < curr.val ? `${val} < ${curr.val}, branching LEFT` : `${val} > ${curr.val}, branching RIGHT`}.`,
        pseudoCodeLine: val < curr.val ? `curr.left = avlInsert(curr.left, ${val});` : `curr.right = avlInsert(curr.right, ${val});`,
        status: 'comparing',
      });

      if (val < curr.val) {
        if (!curr.left) {
          curr.left = { val, height: 1, left: null, right: null };
          emit({
            currentListIndex: i,
            justInsertedVal: val,
            activeVal: val,
            actionDescription: `Left slot of node ${curr.val} is open! Drew branch & placed new leaf node (${val}).`,
            pseudoCodeLine: `curr.left = new AVLNode(${val});`,
            status: 'inserted',
          });
        } else {
          curr.left = insertNode(curr.left, curr, true);
        }
      } else if (val > curr.val) {
        if (!curr.right) {
          curr.right = { val, height: 1, left: null, right: null };
          emit({
            currentListIndex: i,
            justInsertedVal: val,
            activeVal: val,
            actionDescription: `Right slot of node ${curr.val} is open! Drew branch & placed new leaf node (${val}).`,
            pseudoCodeLine: `curr.right = new AVLNode(${val});`,
            status: 'inserted',
          });
        } else {
          curr.right = insertNode(curr.right, curr, false);
        }
      } else {
        emit({
          currentListIndex: i,
          activeVal: curr.val,
          actionDescription: `Value ${val} is a duplicate of node ${curr.val}. Ignored in AVL tree.`,
          pseudoCodeLine: `return curr; // Duplicate ignored`,
          status: 'balanced',
        });
        return curr;
      }

      // Update height
      curr.height = 1 + Math.max(getHeight(curr.left), getHeight(curr.right));
      const bf = getBalanceFactor(curr);

      // LL Case: Left-Left Imbalance (Single Right Rotation)
      if (bf > 1 && val < (curr.left?.val ?? 0)) {
        emit({
          currentListIndex: i,
          imbalancedVal: curr.val,
          activeVal: curr.val,
          rotationType: 'Right (LL)',
          actionDescription: `IMBALANCE at node ${curr.val} (BF = +${bf} > 1). Left-Left (LL) condition -> Performing RIGHT ROTATION.`,
          pseudoCodeLine: `return rotateRight(curr); // LL Case`,
          status: 'unbalanced',
        });

        const rotated = rotateRight(curr);
        if (parent) {
          if (isLeftChild) parent.left = rotated;
          else parent.right = rotated;
        } else {
          fullTree = rotated;
        }

        emit({
          currentListIndex: i,
          activeVal: rotated.val,
          rotationType: 'Right (LL)',
          actionDescription: `RIGHT ROTATION complete! Pivot node ${rotated.val} is new subtree root. Rebalanced (|BF| <= 1).`,
          pseudoCodeLine: `curr = rotateRight(curr); // Rebalanced`,
          status: 'balanced',
        });

        return rotated;
      }

      // RR Case: Right-Right Imbalance (Single Left Rotation)
      if (bf < -1 && val > (curr.right?.val ?? 0)) {
        emit({
          currentListIndex: i,
          imbalancedVal: curr.val,
          activeVal: curr.val,
          rotationType: 'Left (RR)',
          actionDescription: `IMBALANCE at node ${curr.val} (BF = ${bf} < -1). Right-Right (RR) condition -> Performing LEFT ROTATION.`,
          pseudoCodeLine: `return rotateLeft(curr); // RR Case`,
          status: 'unbalanced',
        });

        const rotated = rotateLeft(curr);
        if (parent) {
          if (isLeftChild) parent.left = rotated;
          else parent.right = rotated;
        } else {
          fullTree = rotated;
        }

        emit({
          currentListIndex: i,
          activeVal: rotated.val,
          rotationType: 'Left (RR)',
          actionDescription: `LEFT ROTATION complete! Pivot node ${rotated.val} is new subtree root. Rebalanced (|BF| <= 1).`,
          pseudoCodeLine: `curr = rotateLeft(curr); // Rebalanced`,
          status: 'balanced',
        });

        return rotated;
      }

      // LR Case: Left-Right Imbalance (Double: Left then Right Rotation)
      if (bf > 1 && val > (curr.left?.val ?? 0)) {
        emit({
          currentListIndex: i,
          imbalancedVal: curr.val,
          activeVal: curr.left?.val,
          rotationType: 'Left-Right (LR)',
          actionDescription: `IMBALANCE at node ${curr.val} (BF = +${bf} > 1). Left-Right (LR) zigzag. Step 1: LEFT ROTATE left child (${curr.left?.val}).`,
          pseudoCodeLine: `curr.left = rotateLeft(curr.left); // Step 1 of LR`,
          status: 'unbalanced',
        });

        curr.left = rotateLeft(curr.left!);

        emit({
          currentListIndex: i,
          imbalancedVal: curr.val,
          activeVal: curr.val,
          rotationType: 'Left-Right (LR)',
          actionDescription: `Step 2 of LR: Node ${curr.val} is now in LL shape. Performing RIGHT ROTATION on parent (${curr.val}).`,
          pseudoCodeLine: `return rotateRight(curr); // Step 2 of LR`,
          status: 'rotating',
        });

        const rotated = rotateRight(curr);
        if (parent) {
          if (isLeftChild) parent.left = rotated;
          else parent.right = rotated;
        } else {
          fullTree = rotated;
        }

        emit({
          currentListIndex: i,
          activeVal: rotated.val,
          rotationType: 'Left-Right (LR)',
          actionDescription: `DOUBLE ROTATION (LR) complete! Pivot node ${rotated.val} is new subtree root. Rebalanced (|BF| <= 1).`,
          pseudoCodeLine: `curr = rotateRight(curr); // Rebalanced`,
          status: 'balanced',
        });

        return rotated;
      }

      // RL Case: Right-Left Imbalance (Double: Right then Left Rotation)
      if (bf < -1 && val < (curr.right?.val ?? 0)) {
        emit({
          currentListIndex: i,
          imbalancedVal: curr.val,
          activeVal: curr.right?.val,
          rotationType: 'Right-Left (RL)',
          actionDescription: `IMBALANCE at node ${curr.val} (BF = ${bf} < -1). Right-Left (RL) zigzag. Step 1: RIGHT ROTATE right child (${curr.right?.val}).`,
          pseudoCodeLine: `curr.right = rotateRight(curr.right); // Step 1 of RL`,
          status: 'unbalanced',
        });

        curr.right = rotateRight(curr.right!);

        emit({
          currentListIndex: i,
          imbalancedVal: curr.val,
          activeVal: curr.val,
          rotationType: 'Right-Left (RL)',
          actionDescription: `Step 2 of RL: Node ${curr.val} is now in RR shape. Performing LEFT ROTATION on parent (${curr.val}).`,
          pseudoCodeLine: `return rotateLeft(curr); // Step 2 of RL`,
          status: 'rotating',
        });

        const rotated = rotateLeft(curr);
        if (parent) {
          if (isLeftChild) parent.left = rotated;
          else parent.right = rotated;
        } else {
          fullTree = rotated;
        }

        emit({
          currentListIndex: i,
          activeVal: rotated.val,
          rotationType: 'Right-Left (RL)',
          actionDescription: `DOUBLE ROTATION (RL) complete! Pivot node ${rotated.val} is new subtree root. Rebalanced (|BF| <= 1).`,
          pseudoCodeLine: `curr = rotateLeft(curr); // Rebalanced`,
          status: 'balanced',
        });

        return rotated;
      }

      return curr;
    };

    fullTree = insertNode(fullTree, null, false);
  }

  // Final step
  steps.push({
    root: cloneAVL(fullTree),
    currentListIndex: inputList.length - 1,
    actionDescription: `AVL Tree drawing complete! All ${inputList.length} elements from list [${inputList.join(', ')}] are placed and strictly height-balanced (|BF| <= 1 for all nodes). Max height: ${getHeight(fullTree)}.`,
    pseudoCodeLine: `// AVL property maintained: |h(left) - h(right)| <= 1 for all nodes`,
    status: 'complete',
  });

  return steps;
}

export const AVLTreeVisualizer: React.FC<{ onOperationComplete?: () => void }> = ({
  onOperationComplete,
}) => {
  // Input list state
  const [inputList, setInputList] = useState<number[]>(DEFAULT_AVL_LIST);
  const [customListText, setCustomListText] = useState<string>(DEFAULT_AVL_LIST.join(', '));
  const [inputValue, setInputValue] = useState<string>('25');
  const [searchTarget, setSearchTarget] = useState<string>('30');

  // Animation Steps state
  const [steps, setSteps] = useState<AVLStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(850);

  // Generate steps for automatic tree drawing from inputList
  const buildSteps = useMemo(() => {
    return buildAVLSteps(inputList);
  }, [inputList]);

  // Synchronize steps when buildSteps changes
  useEffect(() => {
    setSteps(buildSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [buildSteps]);

  // Animation timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
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
  const displayedTree = currentStep?.root || null;
  const activeVal = currentStep?.activeVal;
  const justInsertedVal = currentStep?.justInsertedVal;
  const imbalancedVal = currentStep?.imbalancedVal;
  const currentListIdx = currentStep?.currentListIndex ?? -1;

  // Flatten tree to coordinates for SVG rendering
  interface RenderAVLNode {
    val: number;
    bf: number;
    height: number;
    x: number;
    y: number;
    parentX?: number;
    parentY?: number;
  }

  const computeLayout = (
    node: AVLNode | null,
    x = 360,
    y = 45,
    offset = 145,
    parentX?: number,
    parentY?: number
  ): RenderAVLNode[] => {
    if (!node) return [];
    const bf = getBalanceFactor(node);
    const current: RenderAVLNode = {
      val: node.val,
      bf,
      height: node.height,
      x,
      y,
      parentX,
      parentY,
    };
    const nextOffset = Math.max(22, offset / 1.88);
    const leftNodes = computeLayout(node.left, x - offset, y + 58, nextOffset, x, y);
    const rightNodes = computeLayout(node.right, x + offset, y + 58, nextOffset, x, y);
    return [current, ...leftNodes, ...rightNodes];
  };

  const layoutNodes = computeLayout(displayedTree);

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

    setInputList(parsed);
    setCustomListText(parsed.join(', '));
  };

  // Generate random list within [7, 15] range
  const handleRandomAVL = () => {
    const size = Math.floor(Math.random() * (15 - 7 + 1)) + 7; // 7 to 15
    const setVals = new Set<number>();
    while (setVals.size < size) {
      setVals.add(Math.floor(Math.random() * 92) + 5);
    }
    const vals = Array.from(setVals);
    setInputList(vals);
    setCustomListText(vals.join(', '));
  };

  // Fast O(log n) Search on the constructed AVL tree
  const handleSearch = () => {
    const target = parseInt(searchTarget, 10);
    if (isNaN(target)) return;

    const finalTree = steps[steps.length - 1]?.root;
    if (!finalTree) return;

    const searchSteps: AVLStep[] = [];
    let curr: AVLNode | null = finalTree;
    let found = false;

    while (curr) {
      searchSteps.push({
        root: finalTree,
        currentListIndex: inputList.length - 1,
        activeVal: curr.val,
        actionDescription: `AVL Search for ${target}: Checking node (${curr.val}).`,
        pseudoCodeLine: `if (${target} == curr.val) return curr;`,
        status: 'comparing',
      });

      if (curr.val === target) {
        found = true;
        searchSteps.push({
          root: finalTree,
          currentListIndex: inputList.length - 1,
          justInsertedVal: curr.val,
          activeVal: curr.val,
          actionDescription: `TARGET FOUND! Key ${target} located in AVL tree in O(log n) time.`,
          pseudoCodeLine: `return curr; // SUCCESS (Balanced height guarantee)`,
          status: 'inserted',
        });
        break;
      } else if (target < curr.val) {
        searchSteps.push({
          root: finalTree,
          currentListIndex: inputList.length - 1,
          activeVal: curr.val,
          actionDescription: `${target} < ${curr.val}: Branching LEFT in AVL BST order.`,
          pseudoCodeLine: `curr = curr.left; // O(log n)`,
          status: 'comparing',
        });
        curr = curr.left;
      } else {
        searchSteps.push({
          root: finalTree,
          currentListIndex: inputList.length - 1,
          activeVal: curr.val,
          actionDescription: `${target} > ${curr.val}: Branching RIGHT in AVL BST order.`,
          pseudoCodeLine: `curr = curr.right; // O(log n)`,
          status: 'comparing',
        });
        curr = curr.right;
      }
    }

    if (!found) {
      searchSteps.push({
        root: finalTree,
        currentListIndex: inputList.length - 1,
        actionDescription: `Reached empty leaf. Key ${target} does NOT exist in the AVL tree.`,
        pseudoCodeLine: `return null; // NOT FOUND`,
        status: 'complete',
      });
    }

    setSteps(searchSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // Traversals on the completed AVL Tree
  const handleTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    const finalTree = steps[steps.length - 1]?.root;
    if (!finalTree) return;

    const traversalSteps: AVLStep[] = [];
    const visited: number[] = [];

    const traverse = (node: AVLNode | null) => {
      if (!node) return;

      if (type === 'preorder') {
        visited.push(node.val);
        traversalSteps.push({
          root: finalTree,
          currentListIndex: inputList.length - 1,
          activeVal: node.val,
          actionDescription: `Pre-Order: Visit node ${node.val} (Root -> Left -> Right).`,
          pseudoCodeLine: `visit(node); traverse(node.left); traverse(node.right);`,
          status: 'comparing',
        });
      }

      traverse(node.left);

      if (type === 'inorder') {
        visited.push(node.val);
        traversalSteps.push({
          root: finalTree,
          currentListIndex: inputList.length - 1,
          activeVal: node.val,
          actionDescription: `In-Order: Visit node ${node.val} (Left -> Root -> Right: strictly sorted order!).`,
          pseudoCodeLine: `traverse(node.left); visit(node); traverse(node.right);`,
          status: 'comparing',
        });
      }

      traverse(node.right);

      if (type === 'postorder') {
        visited.push(node.val);
        traversalSteps.push({
          root: finalTree,
          currentListIndex: inputList.length - 1,
          activeVal: node.val,
          actionDescription: `Post-Order: Visit node ${node.val} (Left -> Right -> Root).`,
          pseudoCodeLine: `traverse(node.left); traverse(node.right); visit(node);`,
          status: 'comparing',
        });
      }
    };

    traverse(finalTree);

    traversalSteps.push({
      root: finalTree,
      currentListIndex: inputList.length - 1,
      actionDescription: `${type.toUpperCase()} traversal complete! Visited sequence: [${visited.join(', ')}].`,
      pseudoCodeLine: `// Traversal visited all ${visited.length} nodes in O(n) time`,
      status: 'complete',
    });

    setSteps(traversalSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // Add individual node to list
  const handleInsertSingle = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val) || inputList.length >= 15) return;
    if (inputList.includes(val)) return;

    const nextList = [...inputList, val];
    setInputList(nextList);
    setCustomListText(nextList.join(', '));
  };

  // Check comic burst indicators
  const isCurrentlyImbalanced = currentStep?.status === 'unbalanced' || Boolean(imbalancedVal);
  const isRotationStep = Boolean(currentStep?.rotationType) && (currentStep?.status === 'rotating' || currentStep?.status === 'unbalanced');
  const isBalancedStep = currentStep?.status === 'balanced';

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
            {Object.keys(AVL_PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => {
                  setInputList(AVL_PRESETS[name]);
                  setCustomListText(AVL_PRESETS[name].join(', '));
                }}
                className={`rounded-lg border-2 border-black px-2.5 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                  JSON.stringify(inputList) === JSON.stringify(AVL_PRESETS[name])
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
              placeholder="e.g. 40, 20, 60, 10, 30, 50, 70"
              className="w-36 sm:w-48 rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1 text-xs font-mono font-bold text-black focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleApplyCustomList}
              className="rounded-xl border-2 border-black bg-white px-3 py-1 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 transition-transform active:translate-y-0.5 cursor-pointer"
            >
              Set List (7-15)
            </button>
            <button
              onClick={handleRandomAVL}
              className="flex items-center gap-1 rounded-xl border-2 border-black bg-[#FFE135] px-2.5 py-1 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
              title="Generate a random AVL tree with size between 7 and 15"
            >
              <Shuffle className="h-3 w-3 stroke-[2.5]" />
              <span>Random</span>
            </button>
          </div>

          {/* Single Value Insert */}
          <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
            <span className="text-xs font-comic font-bold text-slate-700">Add:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-16 rounded-xl border-2 border-black bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-black text-center focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleInsertSingle}
              disabled={inputList.length >= 15}
              className="flex items-center gap-1 rounded-xl border-2 border-black bg-[#22C55E] px-3 py-1 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform disabled:opacity-40 cursor-pointer"
              title={inputList.length >= 15 ? 'Maximum 15 nodes reached' : 'Insert node'}
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Insert</span>
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
              title="Left -> Root -> Right: produces sorted sequence"
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

        {/* Reset to List */}
        <button
          onClick={() => {
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

      {/* 2. Main Stage: 1st Show One List, Then Automatic AVL Tree Drawing */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-5 shadow-[5px_5px_0px_#000]">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 text-xs font-comic font-bold text-black gap-2">
          <div className="flex items-center gap-2 bg-[#FFE135] px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
            <Scale className="h-4 w-4 text-black stroke-[2.5]" />
            <span>AVL Tree Drawing (Self-Balancing Binary Search Tree)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600">Balance Formula:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-black font-mono font-bold">
              BF = h(Left) - h(Right) ∈ {'{-1, 0, +1}'}
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
                Input List to Draw into AVL Tree ({inputList.length} items • Min 7, Max 15):
              </span>
            </div>

            <div className="text-[11px] font-comic font-bold text-slate-600">
              {currentListIdx < 0
                ? `Ready (${inputList.length} items) • Click Play ▶ to Start Automatic AVL Drawing`
                : currentListIdx >= inputList.length - 1 && currentStep?.status === 'complete'
                ? `✓ All ${inputList.length} Elements Drawn & Rebalanced`
                : `Drawing element ${currentListIdx + 1} of ${inputList.length} (Key: ${inputList[currentListIdx] ?? ''})`}
            </div>
          </div>

          {/* List items representation */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {inputList.map((val, idx) => {
              const isCurrentlyActive = currentListIdx === idx;
              const isAlreadyDrawn = currentListIdx > idx;

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-black px-3.5 py-1.5 transition-all min-w-[50px] ${
                    isCurrentlyActive
                      ? 'bg-[#FFE135] text-black shadow-[3px_3px_0px_#000] scale-105 -translate-y-0.5 font-black ring-2 ring-black'
                      : isAlreadyDrawn
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-[1px_1px_0px_#000] opacity-90'
                      : 'bg-white text-slate-700 shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold text-slate-500">[{idx}]</span>
                  <span className="text-sm font-fredoka font-bold">{val}</span>
                  {isCurrentlyActive && (
                    <span className="text-[8px] font-comic font-black bg-black text-[#FFE135] px-1 rounded-sm mt-0.5">
                      DRAWING
                    </span>
                  )}
                  {isAlreadyDrawn && (
                    <span className="text-[8px] font-comic font-bold text-emerald-700 mt-0.5">
                      ✓ PLACED
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Comic Bursts overlay */}
        <div className="flex items-center justify-center gap-3 min-h-[36px]">
          {isCurrentlyImbalanced && (
            <ComicBurst text="UNBALANCED!" variant="red" size="md" />
          )}
          {isRotationStep && currentStep?.rotationType && (
            <ComicBurst text={`${currentStep.rotationType.toUpperCase()} ROTATION`} variant="yellow" size="md" />
          )}
          {isBalancedStep && (
            <ComicBurst text="BALANCED!" variant="green" size="md" />
          )}
        </div>

        {/* 3. Tree Visualizer Canvas */}
        <div className="relative overflow-x-auto touch-scroll overscroll-contain min-h-[280px] sm:min-h-[330px] flex items-center justify-center rounded-xl border-2 border-dashed border-black/30 bg-slate-50/50 p-2 sm:p-4">
          {currentStepIndex === 0 && !displayedTree ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-14 text-center px-4">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 border-black bg-[#FFE135] shadow-[4px_4px_0px_#000] mb-3">
                <Scale className="h-7 w-7 sm:h-8 sm:w-8 text-black stroke-[2.5]" />
              </div>
              <h3 className="font-comic font-black text-base sm:text-lg text-black">Input List Ready for AVL Tree!</h3>
              <p className="font-comic text-xs text-slate-600 max-w-md mt-1">
                Input list of {inputList.length} numbers is loaded. Click <strong className="text-black">Play ▶</strong> in the controls below to start the step-by-step AVL tree drawing with automatic height balancing and rotations (LL, RR, LR, RL)!
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#FFE135] px-4 sm:px-5 py-2.5 font-comic text-xs font-extrabold text-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-black stroke-black" />
                  <span>Start Automatic Tree Drawing</span>
                </button>
              </div>
            </div>
          ) : (
            <svg viewBox="0 0 720 340" className="w-full max-w-[720px] h-auto aspect-[720/340] min-w-[460px] sm:min-w-0 select-none">
              {/* Connecting Edges */}
              {layoutNodes.map((n, i) => {
                if (n.parentX === undefined || n.parentY === undefined) return null;
                return (
                  <line
                    key={`line-${i}`}
                    x1={n.parentX}
                    y1={n.parentY}
                    x2={n.x}
                    y2={n.y}
                    stroke="#111827"
                    strokeWidth="2.5"
                  />
                );
              })}

              {/* Tree Nodes */}
              {layoutNodes.map((n, i) => {
                const isImbalanced = imbalancedVal === n.val || Math.abs(n.bf) > 1;
                const isJustInserted = justInsertedVal === n.val;
                const isActive = activeVal === n.val;

                let nodeBg = '#FFFFFF';
                let textColor = '#111827';
                let bfColor = '#4B5563';

                if (isImbalanced) {
                  nodeBg = '#EF4444';
                  textColor = '#FFFFFF';
                  bfColor = '#FEE2E2';
                } else if (isJustInserted) {
                  nodeBg = '#22C55E';
                  textColor = '#FFFFFF';
                  bfColor = '#DCFCE7';
                } else if (isActive) {
                  nodeBg = '#FFE135';
                  textColor = '#111827';
                  bfColor = '#4B5563';
                }

                return (
                  <g key={`node-${i}`} className="transition-all duration-300">
                    {/* Drop shadow */}
                    <circle cx={n.x + 2.5} cy={n.y + 2.5} r="18" fill="#000000" />
                    {/* Main circle */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="18"
                      fill={nodeBg}
                      stroke="#111827"
                      strokeWidth="2.5"
                    />
                    {/* Value */}
                    <text
                      x={n.x}
                      y={n.y}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Fredoka, sans-serif"
                    >
                      {n.val}
                    </text>
                    {/* Balance Factor */}
                    <text
                      x={n.x}
                      y={n.y + 11}
                      textAnchor="middle"
                      fill={bfColor}
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      BF:{n.bf}
                    </text>
                    {/* Height badge above node */}
                    <rect
                      x={n.x + 10}
                      y={n.y - 19}
                      width="20"
                      height="12"
                      rx="3"
                      fill="#111827"
                    />
                    <text
                      x={n.x + 20}
                      y={n.y - 10}
                      textAnchor="middle"
                      fill="#FFE135"
                      fontSize="7.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      h:{n.height}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Action Description & Pseudocode Box */}
        {currentStep && (
          <div className="rounded-xl border-2 border-black bg-[#FFFBEB] p-3 text-xs font-mono text-slate-900 shadow-[2px_2px_0px_#000]">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div>
                <span className="font-comic font-bold text-black uppercase">ACTION: </span>
                <span>{currentStep.actionDescription}</span>
              </div>
              {currentStep.rotationType && (
                <span className="font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-500 text-[11px]">
                  {currentStep.rotationType} ROTATION
                </span>
              )}
            </div>
            {currentStep.pseudoCodeLine && (
              <div className="text-slate-600 text-[11px] mt-1 font-mono">
                &gt; {currentStep.pseudoCodeLine}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Animation Controls */}
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
        onStepForward={() => {
          setIsPlaying(false);
          setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
        }}
        onStepBack={() => {
          setIsPlaying(false);
          setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
        }}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIndex(0);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
      />

      {/* 5. 4 AVL Rotations Quick Reference Guide */}
      <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000] space-y-3">
        <h4 className="font-comic font-bold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
          <span>AVL Rebalancing Rotations Guide</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="rounded-xl border-2 border-black bg-slate-50 p-2.5 text-xs font-comic">
            <span className="font-bold text-black block mb-0.5">1. Right (LL)</span>
            <p className="text-[11px] text-slate-600">Left child is left-heavy (BF = +2, left BF = +1). Single right rotation around imbalanced node.</p>
          </div>
          <div className="rounded-xl border-2 border-black bg-slate-50 p-2.5 text-xs font-comic">
            <span className="font-bold text-black block mb-0.5">2. Left (RR)</span>
            <p className="text-[11px] text-slate-600">Right child is right-heavy (BF = -2, right BF = -1). Single left rotation around imbalanced node.</p>
          </div>
          <div className="rounded-xl border-2 border-black bg-slate-50 p-2.5 text-xs font-comic">
            <span className="font-bold text-black block mb-0.5">3. Left-Right (LR)</span>
            <p className="text-[11px] text-slate-600">Left child has right child (zigzag). Left rotate left child, then Right rotate parent.</p>
          </div>
          <div className="rounded-xl border-2 border-black bg-slate-50 p-2.5 text-xs font-comic">
            <span className="font-bold text-black block mb-0.5">4. Right-Left (RL)</span>
            <p className="text-[11px] text-slate-600">Right child has left child (zigzag). Right rotate right child, then Left rotate parent.</p>
          </div>
        </div>
      </div>

      {/* 6. Complexity Panel with Live Code Demonstration */}
      <ComplexityPanel
        topicId="avl-tree"
        operation="insert"
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName="AVL Tree (Self-Balancing BST)"
        description="Maintains guaranteed O(log n) search, insert, and delete complexity by automatically detecting imbalances and applying single or double tree rotations."
        bestComplexity="O(log n)"
        worstComplexity="O(log n) Guaranteed"
        spaceComplexity="O(n)"
        customStats={[
          { label: 'Max Balance Factor', value: '±1' },
          { label: 'Rebalancing Invariant', value: 'Strict' },
          { label: 'Rotations Supported', value: 'LL, RR, LR, RL' },
        ]}
      />
    </div>
  );
};
