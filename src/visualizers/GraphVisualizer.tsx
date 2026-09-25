import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Network, Route, TreePine, Boxes, Layers } from 'lucide-react';
import { AnimationControls } from '../components/AnimationControls';
import { ComplexityPanel } from '../components/ComplexityPanel';
import { ComicBurst } from '../components/ComicBadge';

export interface Vertex {
  id: string;
  x: number;
  y: number;
}

export interface Edge {
  u: string;
  v: string;
  weight: number;
}

export const GRAPH_VERTICES: Vertex[] = [
  { id: 'A', x: 80, y: 150 },
  { id: 'B', x: 200, y: 65 },
  { id: 'C', x: 200, y: 235 },
  { id: 'D', x: 360, y: 65 },
  { id: 'E', x: 360, y: 235 },
  { id: 'F', x: 480, y: 150 },
];

export const GRAPH_EDGES: Edge[] = [
  { u: 'A', v: 'B', weight: 4 },
  { u: 'A', v: 'C', weight: 2 },
  { u: 'B', v: 'C', weight: 1 },
  { u: 'B', v: 'D', weight: 5 },
  { u: 'B', v: 'E', weight: 3 },
  { u: 'C', v: 'E', weight: 8 },
  { u: 'D', v: 'E', weight: 2 },
  { u: 'D', v: 'F', weight: 6 },
  { u: 'E', v: 'F', weight: 4 },
];

const GRAPH_ADJACENCY: Record<string, string[]> = {
  A: ['B', 'C'],
  B: ['A', 'C', 'D', 'E'],
  C: ['A', 'B', 'E'],
  D: ['B', 'E', 'F'],
  E: ['B', 'C', 'D', 'F'],
  F: ['D', 'E'],
};

export type GraphAlgorithmMode = 'bfs' | 'dfs' | 'dijkstra' | 'prims' | 'kruskals';

interface Step {
  visitedNodes: string[];
  activeNode?: string;
  activeEdge?: [string, string];
  frontier?: string[];
  distances?: Record<string, number>;
  predecessors?: Record<string, string | null>;
  mstEdges?: Edge[];
  totalMstWeight?: number;
  unionFindSets?: string[][];
  sortedEdgesState?: Array<{ edge: Edge; status: 'pending' | 'active' | 'accepted' | 'rejected' }>;
  actionDescription: string;
  pseudoCodeLine?: string;
  status: 'initial' | 'running' | 'relax' | 'mst_add' | 'cycle_skip' | 'complete';
}

interface GraphVisualizerProps {
  algorithmMode?: 'general' | 'bfs' | 'dfs' | 'dijkstra' | 'prims' | 'kruskals' | string;
  onOperationComplete?: () => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  algorithmMode = 'dijkstra',
  onOperationComplete,
}) => {
  const getInitialMode = (modeProp: string): GraphAlgorithmMode => {
    if (modeProp === 'dfs') return 'dfs';
    if (modeProp === 'bfs') return 'bfs';
    if (modeProp === 'prims' || modeProp === 'prim') return 'prims';
    if (modeProp === 'kruskals' || modeProp === 'kruskal') return 'kruskals';
    return 'dijkstra';
  };

  const [mode, setMode] = useState<GraphAlgorithmMode>(getInitialMode(algorithmMode));
  const [startNode, setStartNode] = useState<string>('A');

  // Animation State
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(800);

  // Sync mode when algorithmMode prop changes
  useEffect(() => {
    const newMode = getInitialMode(algorithmMode);
    setMode(newMode);
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [algorithmMode]);

  // Animation Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
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

  const currentStep = steps[currentStepIndex];
  const visited = currentStep ? currentStep.visitedNodes : [];
  const activeNode = currentStep ? currentStep.activeNode : undefined;
  const activeEdge = currentStep ? currentStep.activeEdge : undefined;
  const frontier = currentStep?.frontier || [];
  const distances = currentStep?.distances;
  const predecessors = currentStep?.predecessors;
  const mstEdges = currentStep?.mstEdges || [];
  const totalMstWeight = currentStep?.totalMstWeight ?? 0;
  const unionFindSets = currentStep?.unionFindSets || [];
  const sortedEdgesState = currentStep?.sortedEdgesState || [];

  // Helper to build full shortest path string
  const getPathTo = (target: string, preds: Record<string, string | null> | undefined): string => {
    if (!preds) return target;
    const path: string[] = [];
    let curr: string | null = target;
    while (curr) {
      path.unshift(curr);
      curr = preds[curr];
    }
    return path.join(' → ');
  };

  // 1. BFS Steps
  const runBFS = () => {
    const newSteps: Step[] = [];
    const queue: string[] = [startNode];
    const visitedSet = new Set<string>([startNode]);

    newSteps.push({
      visitedNodes: [startNode],
      activeNode: startNode,
      frontier: [...queue],
      actionDescription: `Initialize Queue with starting vertex ${startNode}. Mark ${startNode} as discovered.`,
      pseudoCodeLine: 'queue.push(start); visited.add(start);',
      status: 'initial',
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      const currentVisitedList = Array.from(visitedSet);

      newSteps.push({
        visitedNodes: currentVisitedList,
        activeNode: u,
        frontier: [...queue],
        actionDescription: `Dequeued vertex ${u}. Inspecting all neighbor edges of ${u}.`,
        pseudoCodeLine: 'Vertex u = queue.pop();',
        status: 'running',
      });

      const neighbors = GRAPH_ADJACENCY[u] || [];
      for (const v of neighbors) {
        if (!visitedSet.has(v)) {
          visitedSet.add(v);
          queue.push(v);

          newSteps.push({
            visitedNodes: Array.from(visitedSet),
            activeNode: u,
            activeEdge: [u, v],
            frontier: [...queue],
            actionDescription: `Discovered unvisited neighbor vertex ${v} via edge (${u} → ${v}). Enqueuing ${v}.`,
            pseudoCodeLine: 'if (!visited[v]) { visited.add(v); queue.push(v); }',
            status: 'running',
          });
        }
      }
    }

    newSteps.push({
      visitedNodes: Array.from(visitedSet),
      frontier: [],
      actionDescription: `BFS Traversal completed! All ${visitedSet.size} reachable vertices visited level by level.`,
      pseudoCodeLine: 'return visitedOrder;',
      status: 'complete',
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  // 2. DFS Steps
  const runDFS = () => {
    const newSteps: Step[] = [];
    const visitedSet = new Set<string>();
    const stack: string[] = [];

    newSteps.push({
      visitedNodes: [],
      activeNode: startNode,
      frontier: [startNode],
      actionDescription: `Invoke recursive DFS starting at vertex ${startNode}.`,
      pseudoCodeLine: 'dfs(startVertex);',
      status: 'initial',
    });

    const dfsHelper = (u: string) => {
      visitedSet.add(u);
      stack.push(u);

      newSteps.push({
        visitedNodes: Array.from(visitedSet),
        activeNode: u,
        frontier: [...stack],
        actionDescription: `Pushed vertex ${u} to call stack. Mark as visited.`,
        pseudoCodeLine: 'visited.add(u);',
        status: 'running',
      });

      const neighbors = GRAPH_ADJACENCY[u] || [];
      for (const v of neighbors) {
        if (!visitedSet.has(v)) {
          newSteps.push({
            visitedNodes: Array.from(visitedSet),
            activeNode: u,
            activeEdge: [u, v],
            frontier: [...stack],
            actionDescription: `Traversing edge (${u} → ${v}) into deeper branch.`,
            pseudoCodeLine: 'if (!visited[v]) dfs(v);',
            status: 'running',
          });

          dfsHelper(v);

          newSteps.push({
            visitedNodes: Array.from(visitedSet),
            activeNode: u,
            activeEdge: [u, v],
            frontier: [...stack],
            actionDescription: `Backtracking to vertex ${u} after exploring child branch ${v}.`,
            pseudoCodeLine: '// Backtrack',
            status: 'running',
          });
        }
      }

      stack.pop();
    };

    dfsHelper(startNode);

    newSteps.push({
      visitedNodes: Array.from(visitedSet),
      frontier: [],
      actionDescription: `DFS Traversal complete! Explored depth paths thoroughly with backtracking.`,
      pseudoCodeLine: 'return visited;',
      status: 'complete',
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  // 3. Dijkstra's Algorithm (Single-Source Shortest Paths)
  const runDijkstra = () => {
    const newSteps: Step[] = [];
    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const visitedSet = new Set<string>();

    GRAPH_VERTICES.forEach((v) => {
      dist[v.id] = Infinity;
      prev[v.id] = null;
    });
    dist[startNode] = 0;

    newSteps.push({
      visitedNodes: [],
      activeNode: startNode,
      distances: { ...dist },
      predecessors: { ...prev },
      frontier: [startNode],
      actionDescription: `Initialize Dijkstra from source vertex ${startNode}. Set dist[${startNode}] = 0; all other distances = ∞.`,
      pseudoCodeLine: 'dist[start] = 0; pq.insert(start, 0);',
      status: 'initial',
    });

    while (visitedSet.size < GRAPH_VERTICES.length) {
      // Find unvisited vertex with smallest tentative distance
      let u: string | null = null;
      let minD = Infinity;
      for (const v of GRAPH_VERTICES) {
        if (!visitedSet.has(v.id) && dist[v.id] < minD) {
          minD = dist[v.id];
          u = v.id;
        }
      }

      if (!u || minD === Infinity) break;

      visitedSet.add(u);
      const settledList = Array.from(visitedSet);

      newSteps.push({
        visitedNodes: settledList,
        activeNode: u,
        distances: { ...dist },
        predecessors: { ...prev },
        frontier: GRAPH_VERTICES.filter((v) => !visitedSet.has(v.id) && dist[v.id] < Infinity).map(
          (v) => v.id
        ),
        actionDescription: `Selected vertex ${u} with minimum tentative distance (${dist[u]}). Settled permanently into shortest path tree.`,
        pseudoCodeLine: 'Vertex u = pq.extractMin(); visited.add(u);',
        status: 'running',
      });

      // Relax all incident edges
      const incidentEdges = GRAPH_EDGES.filter((e) => e.u === u || e.v === u);
      for (const edge of incidentEdges) {
        const v = edge.u === u ? edge.v : edge.u;
        if (!visitedSet.has(v)) {
          const weight = edge.weight;
          const newDist = dist[u] + weight;

          newSteps.push({
            visitedNodes: settledList,
            activeNode: u,
            activeEdge: [u, v],
            distances: { ...dist },
            predecessors: { ...prev },
            actionDescription: `Evaluating edge (${u} → ${v}, weight ${weight}): Candidate path through ${u} = ${dist[u]} + ${weight} = ${newDist} vs current dist[${v}] (${
              dist[v] === Infinity ? '∞' : dist[v]
            }).`,
            pseudoCodeLine: `if (dist[${u}] + ${weight} < dist[${v}])`,
            status: 'running',
          });

          if (newDist < dist[v]) {
            dist[v] = newDist;
            prev[v] = u;

            newSteps.push({
              visitedNodes: settledList,
              activeNode: v,
              activeEdge: [u, v],
              distances: { ...dist },
              predecessors: { ...prev },
              actionDescription: `RELAXATION: Found shorter path to vertex ${v}! Updated dist[${v}] = ${newDist} via predecessor ${u}.`,
              pseudoCodeLine: `dist[${v}] = ${newDist}; prev[${v}] = '${u}';`,
              status: 'relax',
            });
          }
        }
      }
    }

    newSteps.push({
      visitedNodes: Array.from(visitedSet),
      distances: { ...dist },
      predecessors: { ...prev },
      actionDescription: `Dijkstra's Algorithm complete! All shortest paths from source ${startNode} determined with O((V+E) log V) efficiency.`,
      pseudoCodeLine: 'return { distances, shortestPathTree };',
      status: 'complete',
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  // 4. Prim's Algorithm (Minimum Spanning Tree)
  const runPrims = () => {
    const newSteps: Step[] = [];
    const inMST = new Set<string>([startNode]);
    const currentMstEdges: Edge[] = [];
    let totalWeight = 0;

    newSteps.push({
      visitedNodes: [startNode],
      activeNode: startNode,
      mstEdges: [],
      totalMstWeight: 0,
      actionDescription: `Initialize Prim's Algorithm starting at vertex ${startNode}. inMST = {${startNode}}. Total MST Weight = 0.`,
      pseudoCodeLine: `inMST.add(${startNode}); totalWeight = 0;`,
      status: 'initial',
    });

    while (inMST.size < GRAPH_VERTICES.length) {
      // Find all cut edges crossing between inMST and outside
      const cutEdges: Array<{ u: string; v: string; weight: number }> = [];
      for (const edge of GRAPH_EDGES) {
        const uIn = inMST.has(edge.u);
        const vIn = inMST.has(edge.v);
        if ((uIn && !vIn) || (!uIn && vIn)) {
          cutEdges.push({
            u: uIn ? edge.u : edge.v,
            v: uIn ? edge.v : edge.u,
            weight: edge.weight,
          });
        }
      }

      if (cutEdges.length === 0) break; // Graph disconnected

      // Sort cut edges to find minimum
      cutEdges.sort((a, b) => a.weight - b.weight);

      newSteps.push({
        visitedNodes: Array.from(inMST),
        activeNode: cutEdges[0].u,
        mstEdges: [...currentMstEdges],
        totalMstWeight: totalWeight,
        actionDescription: `Evaluating cut edges crossing MST boundary {${Array.from(inMST).join(
          ', '
        )}}: [${cutEdges.map((e) => `(${e.u}-${e.v}: ${e.weight})`).join(', ')}].`,
        pseudoCodeLine: '// Find minimum weight edge crossing cut',
        status: 'running',
      });

      const bestEdge = cutEdges[0];
      inMST.add(bestEdge.v);
      currentMstEdges.push(bestEdge);
      totalWeight += bestEdge.weight;

      newSteps.push({
        visitedNodes: Array.from(inMST),
        activeNode: bestEdge.v,
        activeEdge: [bestEdge.u, bestEdge.v],
        mstEdges: [...currentMstEdges],
        totalMstWeight: totalWeight,
        actionDescription: `GREEDY CUT SELECTION: Edge (${bestEdge.u} - ${bestEdge.v}, weight ${bestEdge.weight}) is the minimum cut edge! Added to MST. Vertex ${bestEdge.v} added to inMST.`,
        pseudoCodeLine: `mst.addEdge(${bestEdge.u}, ${bestEdge.v}); inMST.add(${bestEdge.v}); totalWeight += ${bestEdge.weight};`,
        status: 'mst_add',
      });
    }

    newSteps.push({
      visitedNodes: Array.from(inMST),
      mstEdges: [...currentMstEdges],
      totalMstWeight: totalWeight,
      actionDescription: `Prim's Algorithm complete! Minimum Spanning Tree built with ${currentMstEdges.length} edges. Optimal Total Weight = ${totalWeight}.`,
      pseudoCodeLine: 'return mst;',
      status: 'complete',
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  // 5. Kruskal's Algorithm (Minimum Spanning Tree via DSU)
  const runKruskals = () => {
    const newSteps: Step[] = [];
    const sorted = [...GRAPH_EDGES].sort((a, b) => a.weight - b.weight);

    // Union-Find / Disjoint Set Union setup
    const parent: Record<string, string> = {};
    GRAPH_VERTICES.forEach((v) => {
      parent[v.id] = v.id;
    });

    const find = (i: string): string => {
      if (parent[i] === i) return i;
      parent[i] = find(parent[i]);
      return parent[i];
    };

    const union = (i: string, j: string) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
      }
    };

    const getSets = (): string[][] => {
      const groups: Record<string, string[]> = {};
      GRAPH_VERTICES.forEach((v) => {
        const r = find(v.id);
        if (!groups[r]) groups[r] = [];
        groups[r].push(v.id);
      });
      return Object.values(groups);
    };

    const currentMstEdges: Edge[] = [];
    let totalWeight = 0;

    const edgeStates: Array<{ edge: Edge; status: 'pending' | 'active' | 'accepted' | 'rejected' }> =
      sorted.map((e) => ({ edge: e, status: 'pending' }));

    newSteps.push({
      visitedNodes: [],
      mstEdges: [],
      totalMstWeight: 0,
      unionFindSets: getSets(),
      sortedEdgesState: edgeStates.map((s) => ({ ...s })),
      actionDescription: `Sorted all ${sorted.length} edges by weight in ascending order. Each vertex begins in its own isolated component: {A}, {B}, {C}, {D}, {E}, {F}.`,
      pseudoCodeLine: 'edges.sort(); for (v in V) makeSet(v);',
      status: 'initial',
    });

    for (let idx = 0; idx < sorted.length; idx++) {
      const edge = sorted[idx];
      const rootU = find(edge.u);
      const rootV = find(edge.v);

      // Mark current edge active in list
      edgeStates[idx].status = 'active';

      newSteps.push({
        visitedNodes: Array.from(new Set(currentMstEdges.flatMap((e) => [e.u, e.v]))),
        activeEdge: [edge.u, edge.v],
        mstEdges: [...currentMstEdges],
        totalMstWeight: totalWeight,
        unionFindSets: getSets(),
        sortedEdgesState: edgeStates.map((s) => ({ ...s })),
        actionDescription: `Inspecting lowest-weight pending edge #${idx + 1}: (${edge.u} - ${edge.v}, weight ${edge.weight}). Checking if vertices share same component...`,
        pseudoCodeLine: `if (find('${edge.u}') != find('${edge.v}'))`,
        status: 'running',
      });

      if (rootU !== rootV) {
        // Accept edge
        union(rootU, rootV);
        currentMstEdges.push(edge);
        totalWeight += edge.weight;
        edgeStates[idx].status = 'accepted';

        newSteps.push({
          visitedNodes: Array.from(new Set(currentMstEdges.flatMap((e) => [e.u, e.v]))),
          activeEdge: [edge.u, edge.v],
          mstEdges: [...currentMstEdges],
          totalMstWeight: totalWeight,
          unionFindSets: getSets(),
          sortedEdgesState: edgeStates.map((s) => ({ ...s })),
          actionDescription: `ACCEPTED! Edge (${edge.u} - ${edge.v}, weight ${edge.weight}) connects disjoint components. Merging sets via union(). Added to MST.`,
          pseudoCodeLine: `union('${edge.u}', '${edge.v}'); mst.add(edge); totalWeight += ${edge.weight};`,
          status: 'mst_add',
        });

        if (currentMstEdges.length === GRAPH_VERTICES.length - 1) {
          break; // MST reached V - 1 edges
        }
      } else {
        // Cycle detected
        edgeStates[idx].status = 'rejected';

        newSteps.push({
          visitedNodes: Array.from(new Set(currentMstEdges.flatMap((e) => [e.u, e.v]))),
          activeEdge: [edge.u, edge.v],
          mstEdges: [...currentMstEdges],
          totalMstWeight: totalWeight,
          unionFindSets: getSets(),
          sortedEdgesState: edgeStates.map((s) => ({ ...s })),
          actionDescription: `CYCLE DETECTED! Vertices ${edge.u} and ${edge.v} already belong to the same component (${rootU}). Edge (${edge.u} - ${edge.v}, weight ${edge.weight}) rejected!`,
          pseudoCodeLine: `// Cycle detected -> Skip edge (${edge.u} - ${edge.v})`,
          status: 'cycle_skip',
        });
      }
    }

    newSteps.push({
      visitedNodes: GRAPH_VERTICES.map((v) => v.id),
      mstEdges: [...currentMstEdges],
      totalMstWeight: totalWeight,
      unionFindSets: getSets(),
      sortedEdgesState: edgeStates.map((s) => ({ ...s })),
      actionDescription: `Kruskal's Algorithm complete! Spanning tree established with ${currentMstEdges.length} edges without any cycles. Minimum Total Weight = ${totalWeight}.`,
      pseudoCodeLine: 'return mst;',
      status: 'complete',
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (onOperationComplete) onOperationComplete();
  };

  const handleStart = () => {
    if (mode === 'bfs') runBFS();
    else if (mode === 'dfs') runDFS();
    else if (mode === 'dijkstra') runDijkstra();
    else if (mode === 'prims') runPrims();
    else if (mode === 'kruskals') runKruskals();
  };

  // Helper check if edge is in MST
  const isEdgeInMST = (u: string, v: string) => {
    return mstEdges.some(
      (e) => (e.u === u && e.v === v) || (e.u === v && e.v === u)
    );
  };

  // Helper check if edge is in Dijkstra Shortest Path Tree
  const isEdgeInDijkstra = (u: string, v: string) => {
    if (mode !== 'dijkstra' || !predecessors) return false;
    return predecessors[v] === u || predecessors[u] === v;
  };

  return (
    <div className="space-y-6">
      {/* 1. Controls Deck */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Algorithm Mode Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-comic font-bold text-black flex items-center gap-1">
              <Network className="h-3.5 w-3.5" />
              <span>Algorithm:</span>
            </span>
            <button
              onClick={() => {
                setMode('dijkstra');
                setSteps([]);
                setCurrentStepIndex(0);
              }}
              className={`rounded-xl px-3 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                mode === 'dijkstra'
                  ? 'border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]'
                  : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
              }`}
            >
              Dijkstra (Shortest Path)
            </button>
            <button
              onClick={() => {
                setMode('prims');
                setSteps([]);
                setCurrentStepIndex(0);
              }}
              className={`rounded-xl px-3 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                mode === 'prims'
                  ? 'border-2 border-black bg-[#22C55E] text-white shadow-[2px_2px_0px_#000]'
                  : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
              }`}
            >
              Prim's (MST)
            </button>
            <button
              onClick={() => {
                setMode('kruskals');
                setSteps([]);
                setCurrentStepIndex(0);
              }}
              className={`rounded-xl px-3 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                mode === 'kruskals'
                  ? 'border-2 border-black bg-[#8B5CF6] text-white shadow-[2px_2px_0px_#000]'
                  : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
              }`}
            >
              Kruskal's (MST)
            </button>
            <button
              onClick={() => {
                setMode('bfs');
                setSteps([]);
                setCurrentStepIndex(0);
              }}
              className={`rounded-xl px-2.5 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                mode === 'bfs'
                  ? 'border-2 border-black bg-sky-300 text-black shadow-[2px_2px_0px_#000]'
                  : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
              }`}
            >
              BFS
            </button>
            <button
              onClick={() => {
                setMode('dfs');
                setSteps([]);
                setCurrentStepIndex(0);
              }}
              className={`rounded-xl px-2.5 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                mode === 'dfs'
                  ? 'border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000]'
                  : 'border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:text-black'
              }`}
            >
              DFS
            </button>
          </div>

          {/* Start Node (for algorithms with single source) */}
          {mode !== 'kruskals' && (
            <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
              <span className="text-xs font-comic font-bold text-black">Start:</span>
              <select
                value={startNode}
                onChange={(e) => {
                  setStartNode(e.target.value);
                  setSteps([]);
                  setCurrentStepIndex(0);
                }}
                className="rounded-xl border-2 border-black bg-slate-50 px-2.5 py-1 text-xs font-comic font-bold text-black focus:bg-white focus:outline-none cursor-pointer"
              >
                {GRAPH_VERTICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    Vertex {v.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Execute Button */}
          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE135] px-4 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            <span>
              Execute{' '}
              {mode === 'dijkstra'
                ? "Dijkstra's"
                : mode === 'prims'
                ? "Prim's"
                : mode === 'kruskals'
                ? "Kruskal's"
                : mode.toUpperCase()}
            </span>
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            setSteps([]);
            setCurrentStepIndex(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-100 px-3 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-200 transition-transform active:translate-y-0.5 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Reset</span>
        </button>
      </div>

      {/* 2. Main Graph Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 rounded-2xl border-2 border-black bg-white p-3.5 sm:p-6 shadow-[4px_4px_0px_#000] sm:shadow-[5px_5px_0px_#000]">
        {/* Left (8 cols): SVG Network Graph Canvas */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[320px] border-b-2 lg:border-b-0 lg:border-r-2 border-black pb-5 lg:pb-0 lg:pr-6 overflow-x-auto touch-scroll w-full">
          {/* Comic Bursts Status Indicator */}
          <div className="flex items-center justify-center gap-2 min-h-[38px] mb-2">
            {currentStep?.status === 'relax' && (
              <ComicBurst text="RELAXATION!" variant="yellow" size="md" />
            )}
            {currentStep?.status === 'mst_add' && (
              <ComicBurst text="MST EDGE ADDED!" variant="green" size="md" />
            )}
            {currentStep?.status === 'cycle_skip' && (
              <ComicBurst text="CYCLE DETECTED!" variant="red" size="md" />
            )}
            {currentStep?.status === 'complete' && (
              <ComicBurst text="ALGORITHM COMPLETE!" variant="green" size="md" />
            )}
          </div>

          <svg viewBox="0 0 560 300" className="w-full max-w-[560px] h-auto aspect-[560/300] select-none">
            {/* Draw Edges */}
            {GRAPH_EDGES.map((edge) => {
              const uVertex = GRAPH_VERTICES.find((v) => v.id === edge.u)!;
              const vVertex = GRAPH_VERTICES.find((v) => v.id === edge.v)!;

              const isMst = isEdgeInMST(edge.u, edge.v);
              const isDijkstra = isEdgeInDijkstra(edge.u, edge.v);
              const isTreeEdge = isMst || isDijkstra;

              const isEdgeActive =
                activeEdge &&
                ((activeEdge[0] === edge.u && activeEdge[1] === edge.v) ||
                  (activeEdge[0] === edge.v && activeEdge[1] === edge.u));

              const isCycleSkip = isEdgeActive && currentStep?.status === 'cycle_skip';

              let strokeColor = '#000000';
              let strokeWidth = '2.5';
              let strokeDash: string | undefined = undefined;

              if (isCycleSkip) {
                strokeColor = '#EF4444';
                strokeWidth = '4.5';
                strokeDash = '6,4';
              } else if (isTreeEdge) {
                strokeColor = '#10B981';
                strokeWidth = '5';
              } else if (isEdgeActive) {
                strokeColor = '#F59E0B';
                strokeWidth = '4.5';
              }

              // Midpoint for weight badge
              const mx = (uVertex.x + vVertex.x) / 2;
              const my = (uVertex.y + vVertex.y) / 2;

              return (
                <g key={`edge-${edge.u}-${edge.v}`}>
                  <line
                    x1={uVertex.x}
                    y1={uVertex.y}
                    x2={vVertex.x}
                    y2={vVertex.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    className="transition-all duration-300"
                  />

                  {/* Weight Badge Pill */}
                  <g transform={`translate(${mx}, ${my})`}>
                    <rect
                      x="-13"
                      y="-10"
                      width="26"
                      height="20"
                      rx="6"
                      fill={
                        isCycleSkip
                          ? '#FEE2E2'
                          : isTreeEdge
                          ? '#10B981'
                          : isEdgeActive
                          ? '#FFE135'
                          : '#FFFFFF'
                      }
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={isTreeEdge ? '#FFFFFF' : '#000000'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {edge.weight}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Draw Vertices */}
            {GRAPH_VERTICES.map((v) => {
              const isCurrent = activeNode === v.id;
              const isVisited = visited.includes(v.id);
              const isStart = mode !== 'kruskals' && startNode === v.id;

              let nodeFill = '#FFFFFF';
              if (isCurrent) {
                nodeFill = '#FFE135';
              } else if (isVisited) {
                nodeFill = '#22C55E';
              }

              const distVal = distances ? distances[v.id] : undefined;

              return (
                <g key={`vertex-${v.id}`} className="cursor-pointer">
                  {/* Drop shadow circle */}
                  <circle cx={v.x + 3} cy={v.y + 3} r="22" fill="#000000" />
                  {/* Main circle */}
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r="22"
                    fill={nodeFill}
                    stroke="#000000"
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />
                  {/* Vertex Label */}
                  <text
                    x={v.x}
                    y={v.y + 5}
                    textAnchor="middle"
                    fill={isVisited && !isCurrent ? '#FFFFFF' : '#000000'}
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="Fredoka, sans-serif"
                  >
                    {v.id}
                  </text>

                  {/* Start Node Badge */}
                  {isStart && (
                    <g transform={`translate(${v.x}, ${v.y - 28})`}>
                      <rect
                        x="-16"
                        y="-8"
                        width="32"
                        height="14"
                        rx="4"
                        fill="#000000"
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fill="#FFE135"
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="Fredoka, sans-serif"
                      >
                        START
                      </text>
                    </g>
                  )}

                  {/* Dijkstra Distance Tag */}
                  {mode === 'dijkstra' && distVal !== undefined && (
                    <g transform={`translate(${v.x}, ${v.y + 35})`}>
                      <rect
                        x="-18"
                        y="-7"
                        width="36"
                        height="15"
                        rx="4"
                        fill={isCurrent ? '#FFE135' : '#0F172A'}
                        stroke="#000000"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isCurrent ? '#000000' : '#FFFFFF'}
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        d:{distVal === Infinity ? '∞' : distVal}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right (4 cols): Dynamic Info Panel based on Mode */}
        <div className="col-span-1 lg:col-span-4 flex flex-col justify-between space-y-4">
          {/* Panel for DIJKSTRA: Distance & Predecessor Table */}
          {mode === 'dijkstra' && (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-black bg-slate-50 p-3 shadow-[2px_2px_0px_#000]">
                <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Route className="h-3.5 w-3.5 text-blue-600 stroke-[2.5]" />
                  <span>Dijkstra Shortest Distances</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-mono border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black text-left text-slate-600 font-comic">
                        <th className="pb-1 font-bold">Node</th>
                        <th className="pb-1 font-bold">Dist</th>
                        <th className="pb-1 font-bold">Shortest Path</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {GRAPH_VERTICES.map((v) => {
                        const d = distances ? distances[v.id] : Infinity;
                        const isSettled = visited.includes(v.id);
                        const isCurr = activeNode === v.id;
                        const fullPath = getPathTo(v.id, predecessors);

                        return (
                          <tr
                            key={v.id}
                            className={`${
                              isCurr
                                ? 'bg-[#FFE135] font-bold text-black'
                                : isSettled
                                ? 'bg-emerald-50 text-emerald-900'
                                : 'text-slate-800'
                            }`}
                          >
                            <td className="py-1 font-bold">{v.id}</td>
                            <td className="py-1">{d === Infinity ? '∞' : d}</td>
                            <td className="py-1 font-fredoka text-[10px]">
                              {d === Infinity ? '-' : fullPath}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-[#F0FDF4] p-3 shadow-[2px_2px_0px_#000]">
                <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-1">
                  Settled Vertices ({visited.length}/{GRAPH_VERTICES.length})
                </h4>
                <div className="font-comic text-xs font-bold text-emerald-800">
                  {visited.length > 0 ? visited.join(' → ') : 'None yet'}
                </div>
              </div>
            </div>
          )}

          {/* Panel for PRIM'S: Minimum Spanning Tree Cut */}
          {mode === 'prims' && (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-black bg-[#FFE135] p-3 shadow-[2px_2px_0px_#000]">
                <span className="text-[10px] font-comic font-bold text-black uppercase tracking-wider block">
                  Total Minimum Spanning Tree Weight
                </span>
                <span className="text-2xl font-black font-fredoka text-black">
                  {totalMstWeight}
                </span>
                <span className="text-xs font-comic font-bold text-slate-800 block mt-0.5">
                  Edges: {mstEdges.length} of {GRAPH_VERTICES.length - 1} required
                </span>
              </div>

              <div className="rounded-xl border-2 border-black bg-slate-50 p-3 shadow-[2px_2px_0px_#000]">
                <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <TreePine className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
                  <span>Selected MST Edges</span>
                </h4>
                <div className="space-y-1 font-mono text-xs max-h-36 overflow-y-auto">
                  {mstEdges.length === 0 ? (
                    <span className="text-slate-400 text-[11px] font-bold">[ No edges yet ]</span>
                  ) : (
                    mstEdges.map((e, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_#000]"
                      >
                        <span className="font-bold font-comic">
                          ({e.u} — {e.v})
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                          wt: {e.weight}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-[#F0FDF4] p-3 shadow-[2px_2px_0px_#000]">
                <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-1">
                  Vertices in Tree ({visited.length}/{GRAPH_VERTICES.length})
                </h4>
                <div className="font-comic text-xs font-bold text-emerald-800">
                  {visited.length > 0 ? `{ ${visited.join(', ')} }` : 'None'}
                </div>
              </div>
            </div>
          )}

          {/* Panel for KRUSKAL'S: Sorted Edge List & DSU Sets */}
          {mode === 'kruskals' && (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-black bg-[#8B5CF6] text-white p-3 shadow-[2px_2px_0px_#000]">
                <span className="text-[10px] font-comic font-bold uppercase tracking-wider block text-purple-200">
                  Kruskal MST Total Weight
                </span>
                <span className="text-2xl font-black font-fredoka">{totalMstWeight}</span>
                <span className="text-xs font-comic font-bold block text-purple-200 mt-0.5">
                  Edges: {mstEdges.length} of {GRAPH_VERTICES.length - 1} required
                </span>
              </div>

              <div className="rounded-xl border-2 border-black bg-slate-50 p-3 shadow-[2px_2px_0px_#000]">
                <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-purple-600 stroke-[2.5]" />
                  <span>Sorted Edges Queue</span>
                </h4>
                <div className="space-y-1 font-mono text-[11px] max-h-40 overflow-y-auto pr-1">
                  {sortedEdgesState.map((item, idx) => {
                    let badgeBg = 'bg-slate-200 text-slate-700';
                    let badgeText = 'PENDING';
                    if (item.status === 'active') {
                      badgeBg = 'bg-[#FFE135] text-black font-bold ring-1 ring-black';
                      badgeText = 'TESTING';
                    } else if (item.status === 'accepted') {
                      badgeBg = 'bg-emerald-500 text-white font-bold';
                      badgeText = '✓ MST';
                    } else if (item.status === 'rejected') {
                      badgeBg = 'bg-red-500 text-white font-bold';
                      badgeText = '✗ CYCLE';
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-2 py-0.5 rounded border border-black ${
                          item.status === 'active'
                            ? 'bg-amber-50 shadow-[1px_1px_0px_#000]'
                            : 'bg-white'
                        }`}
                      >
                        <span className="font-bold">
                          {idx + 1}. ({item.edge.u}-{item.edge.v}) wt:{item.edge.weight}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] ${badgeBg}`}>
                          {badgeText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-purple-50 p-2.5 shadow-[2px_2px_0px_#000]">
                <h4 className="text-[11px] font-comic font-black text-purple-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Boxes className="h-3 w-3 stroke-[2.5]" />
                  <span>DSU Disjoint Sets</span>
                </h4>
                <div className="flex flex-wrap gap-1 text-[11px] font-mono font-bold text-purple-800">
                  {unionFindSets.map((s, i) => (
                    <span
                      key={i}
                      className="bg-white px-1.5 py-0.5 rounded border border-purple-300 shadow-[1px_1px_0px_#8B5CF6]"
                    >
                      {'{'}
                      {s.join(', ')}
                      {'}'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Panel for BFS / DFS: Adjacency List & Queue / Stack */}
          {(mode === 'bfs' || mode === 'dfs') && (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-black bg-slate-50 p-3 shadow-[2px_2px_0px_#000]">
                <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-2">
                  Adjacency List (G)
                </h4>
                <div className="space-y-1 font-mono text-xs font-bold text-slate-800">
                  {Object.entries(GRAPH_ADJACENCY).map(([node, list]) => (
                    <div key={node} className="flex items-center gap-1.5">
                      <span className="text-black font-black">{node}:</span>
                      <span className="text-slate-700">[{list.join(', ')}]</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-slate-50 p-3 shadow-[2px_2px_0px_#000]">
                <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-1.5">
                  {mode === 'bfs' ? 'Frontier Queue (FIFO)' : 'Call Stack (LIFO)'}
                </h4>
                <div className="flex flex-wrap gap-1.5 min-h-8 items-center rounded-lg border-2 border-black bg-white p-2 font-mono text-xs">
                  {frontier.length === 0 ? (
                    <span className="text-slate-400 text-[11px] font-bold">[ Empty ]</span>
                  ) : (
                    frontier.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-[#FFE135] text-black px-2.5 py-0.5 border-2 border-black font-comic font-bold shadow-[1px_1px_0px_#000]"
                      >
                        {item}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-[#F0FDF4] p-3 shadow-[2px_2px_0px_#000]">
                <h4 className="text-xs font-comic font-black text-black uppercase tracking-wider mb-1.5">
                  Visited Order ({visited.length}/{GRAPH_VERTICES.length})
                </h4>
                <div className="font-comic text-xs font-bold text-emerald-800">
                  {visited.length > 0 ? visited.join(' → ') : 'None yet'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Description & Pseudocode Box */}
      {currentStep && (
        <div className="rounded-xl border-2 border-black bg-[#FFFBEB] p-3 text-xs font-mono text-slate-900 shadow-[2px_2px_0px_#000]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-comic font-black text-black uppercase">
                STEP {currentStepIndex + 1}/{steps.length}:{' '}
              </span>
              <span className="font-bold">{currentStep.actionDescription}</span>
            </div>
          </div>
          {currentStep.pseudoCodeLine && (
            <div className="text-slate-600 text-[11px] mt-1 font-mono">
              &gt; {currentStep.pseudoCodeLine}
            </div>
          )}
        </div>
      )}

      {/* 4. Animation Controls */}
      <AnimationControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => {
          if (steps.length > 0) {
            if (currentStepIndex >= steps.length - 1) {
              setCurrentStepIndex(0);
            }
            setIsPlaying(true);
          } else {
            handleStart();
          }
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

      {/* 5. Complexity Panel with Live Code Demonstration */}
      <ComplexityPanel
        topicId={mode}
        operation={mode}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        activeStepMessage={currentStep?.actionDescription}
        operationName={
          mode === 'dijkstra'
            ? "Dijkstra's Algorithm (Single-Source Shortest Path)"
            : mode === 'prims'
            ? "Prim's Algorithm (Minimum Spanning Tree)"
            : mode === 'kruskals'
            ? "Kruskal's Algorithm (MST via Disjoint Set Union)"
            : mode === 'bfs'
            ? 'Breadth-First Search (BFS)'
            : 'Depth-First Search (DFS)'
        }
        description={
          mode === 'dijkstra'
            ? 'Greedy algorithm that computes the shortest path tree from a single source vertex to all other vertices on non-negative weighted graphs.'
            : mode === 'prims'
            ? 'Greedy MST algorithm that grows a tree from an arbitrary start vertex by always picking the minimum weight cut edge.'
            : mode === 'kruskals'
            ? 'Greedy MST algorithm that sorts all edges globally and adds them one by one if they do not create a cycle using Union-Find.'
            : mode === 'bfs'
            ? 'Level-order breadth-first search exploring neighbor vertices layer by layer using a FIFO Queue.'
            : 'Depth-first search exploring deepest branch paths first until reaching dead-end, then backtracking.'
        }
        bestComplexity={
          mode === 'dijkstra'
            ? 'O((V + E) log V)'
            : mode === 'prims'
            ? 'O((V + E) log V)'
            : mode === 'kruskals'
            ? 'O(E log E)'
            : 'O(V + E)'
        }
        worstComplexity={
          mode === 'dijkstra'
            ? 'O((V + E) log V)'
            : mode === 'prims'
            ? 'O((V + E) log V)'
            : mode === 'kruskals'
            ? 'O(E log E)'
            : 'O(V + E)'
        }
        spaceComplexity={
          mode === 'dijkstra'
            ? 'O(V)'
            : mode === 'prims'
            ? 'O(V + E)'
            : mode === 'kruskals'
            ? 'O(V + E)'
            : 'O(V)'
        }
        customStats={[
          { label: 'Total Vertices (V)', value: GRAPH_VERTICES.length },
          { label: 'Total Edges (E)', value: GRAPH_EDGES.length },
          {
            label:
              mode === 'prims' || mode === 'kruskals'
                ? 'MST Total Cost'
                : mode === 'dijkstra'
                ? 'Settled Vertices'
                : 'Visited Vertices',
            value:
              mode === 'prims' || mode === 'kruskals'
                ? totalMstWeight
                : `${visited.length}/${GRAPH_VERTICES.length}`,
          },
        ]}
      />
    </div>
  );
};
