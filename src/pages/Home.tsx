import React, { useState } from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { VisualizationPreview } from '../components/VisualizationPreview';
import { HeroIllustration } from '../components/HeroIllustration';
import { ComicBurst } from '../components/ComicBadge';
import {
  Play,
  BookOpen,
  HelpCircle,
  Box,
  GitBranch,
  Network,
  Cpu,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Target,
  Eye,
  Brain,
  Code2,
  Sparkles,
  X
} from 'lucide-react';

interface HomeProps {
  onNavigateTab: (tab: 'home' | 'visualizer' | 'learn' | 'practice') => void;
  onSelectTopic: (topicId: string, tab?: 'home' | 'visualizer' | 'learn' | 'practice') => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigateTab,
  onSelectTopic,
}) => {
  const [sortifyModalOpen, setSortifyModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (COMIC BOOK + DEVELOPER LAB) */}
      {/* ============================================================ */}
      <section className="relative px-4 pt-6 pb-12 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Sticker & CTAs */}
          <div className="lg:col-span-5 text-left">
            {/* Comic Sticker: BUILD BETTER LOGIC */}
            <div className="mb-4 inline-block -rotate-3 select-none">
              <div className="rounded-lg border-2 border-black bg-white px-3 py-1 font-comic text-xs font-black tracking-wider text-black shadow-[2px_2px_0px_#000]">
                \ BUILD / \ BETTER / \ LOGIC /
              </div>
            </div>

            {/* Main Hero Headline */}
            <h1 className="font-comic text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-black leading-[1.1]">
              DSA,{' '}
              <span className="relative inline-block rounded-xl border-2 sm:border-3 border-black bg-[#FFE135] px-2.5 sm:px-3 py-0.5 shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] -rotate-1 text-black">
                VISUALIZED.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-md">
              Learn Data Structures and Algorithms by seeing every operation happen.
            </p>

            {/* Hero Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('visualizer')}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#FFE135] px-5 py-3 font-comic text-sm font-bold text-black shadow-[3px_3px_0px_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <Play className="h-4 w-4 fill-black stroke-black" />
                <span>Explore Visualizer</span>
              </button>

              <button
                onClick={() => onNavigateTab('learn')}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#22C55E] px-5 py-3 font-comic text-sm font-bold text-white shadow-[3px_3px_0px_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <BookOpen className="h-4 w-4 stroke-[2.5]" />
                <span>Start Learning</span>
              </button>
            </div>

            {/* Secondary Kicker */}
            <p className="mt-4 text-xs font-bold text-slate-500 font-mono tracking-wide">
              Interactive animations • Simple explanations • Practice
            </p>
          </div>

          {/* Center Column: Developer / Student Comic Illustration */}
          <div className="lg:col-span-4 flex justify-center">
            <HeroIllustration />
          </div>

          {/* Right Column: Visualization Preview Card */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <VisualizationPreview />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THREE MAIN FEATURE CARDS (VISUALIZE, LEARN, PRACTICE) */}
      {/* ============================================================ */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: VISUALIZE (Yellow) */}
          <FeatureCard
            title="Visualize"
            variant="yellow"
            description="See data structures and algorithms come alive through interactive step-by-step animations."
            buttonText="Open Visualizer"
            onClick={() => onNavigateTab('visualizer')}
            icon={<Play className="h-6 w-6 fill-black stroke-black" />}
          />

          {/* Card 2: LEARN (Green) */}
          <FeatureCard
            title="Learn"
            variant="green"
            description="Understand concepts, operations, complexity, and real-world applications in simple language."
            buttonText="Start Learning"
            onClick={() => onNavigateTab('learn')}
            icon={<BookOpen className="h-6 w-6 stroke-[2.5]" />}
          />

          {/* Card 3: PRACTICE (Red) */}
          <FeatureCard
            title="Practice"
            variant="red"
            description="Test your knowledge with quizzes, visual challenges, and coding problems."
            buttonText="Start Practice"
            onClick={() => onNavigateTab('practice')}
            icon={<HelpCircle className="h-6 w-6 stroke-[2.5]" />}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. EXPLORE DSA (COMIC CATEGORY CARDS) */}
      {/* ============================================================ */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header with Comic Arrows */}
        <div className="mb-6 flex items-center gap-2 select-none">
          <span className="font-comic text-xl font-bold text-black">⮦</span>
          <h2 className="font-comic text-2xl sm:text-3xl font-bold tracking-tight text-black">
            Explore DSA
          </h2>
          <span className="font-comic text-xl font-bold text-black">⮧</span>
        </div>

        {/* 5 Comic Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* 1. DATA STRUCTURES (Yellow) */}
          <div className="rounded-2xl border-2 border-black bg-[#FFFBEB] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black/10">
                <Box className="h-5 w-5 text-amber-600 stroke-[2.5]" />
                <h3 className="font-comic text-sm font-bold tracking-wider text-black uppercase">
                  DATA STRUCTURES
                </h3>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-slate-800">
                {[
                  { id: 'array', name: 'Array' },
                  { id: 'linked-list', name: 'Linked List' },
                  { id: 'doubly-linked-list', name: 'Doubly Linked List' },
                  { id: 'stack', name: 'Stack' },
                  { id: 'queue', name: 'Queue' },
                  { id: 'circular-queue', name: 'Circular Queue' },
                  { id: 'priority-queue', name: 'Priority Queue' },
                  { id: 'hash-table', name: 'Hash Table' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectTopic(item.id, 'visualizer')}
                    className="flex w-full items-center justify-between text-left hover:text-black hover:translate-x-0.5 transition-transform"
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-amber-600 font-mono">▶</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. TREES (Green) */}
          <div className="rounded-2xl border-2 border-black bg-[#F0FDF4] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black/10">
                <GitBranch className="h-5 w-5 text-emerald-600 stroke-[2.5]" />
                <h3 className="font-comic text-sm font-bold tracking-wider text-black uppercase">
                  TREES
                </h3>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-slate-800">
                {[
                  { id: 'binary-tree', name: 'Binary Tree' },
                  { id: 'binary-search-tree', name: 'Binary Search Tree' },
                  { id: 'avl-tree', name: 'AVL Tree' },
                  { id: 'heap', name: 'Heap' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectTopic(item.id, 'visualizer')}
                    className="flex w-full items-center justify-between text-left hover:text-black hover:translate-x-0.5 transition-transform"
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-emerald-600 font-mono">▶</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. GRAPHS (Red) */}
          <div className="rounded-2xl border-2 border-black bg-[#FEF2F2] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black/10">
                <Network className="h-5 w-5 text-rose-600 stroke-[2.5]" />
                <h3 className="font-comic text-sm font-bold tracking-wider text-black uppercase">
                  GRAPHS
                </h3>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-slate-800">
                {[
                  { id: 'graph', name: 'Graph' },
                  { id: 'bfs', name: 'BFS' },
                  { id: 'dfs', name: 'DFS' },
                  { id: 'dijkstra', name: "Dijkstra's" },
                  { id: 'prims', name: "Prim's MST" },
                  { id: 'kruskals', name: "Kruskal's MST" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectTopic(item.id, 'visualizer')}
                    className="flex w-full items-center justify-between text-left hover:text-black hover:translate-x-0.5 transition-transform"
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-rose-600 font-mono">▶</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. ALGORITHMS (Blue) */}
          <div className="rounded-2xl border-2 border-black bg-[#EFF6FF] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black/10">
                <Cpu className="h-5 w-5 text-blue-600 stroke-[2.5]" />
                <h3 className="font-comic text-sm font-bold tracking-wider text-black uppercase">
                  ALGORITHMS
                </h3>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-slate-800">
                {[
                  { id: 'linear-search', name: 'Linear Search' },
                  { id: 'binary-search', name: 'Binary Search' },
                  { id: 'recursion', name: 'Recursion' },
                  { id: 'greedy-algorithms', name: 'Greedy Algorithms' },
                  { id: 'dynamic-programming', name: 'Dynamic Programming' },
                  { id: 'backtracking', name: 'Backtracking' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectTopic(item.id, 'visualizer')}
                    className="flex w-full items-center justify-between text-left hover:text-black hover:translate-x-0.5 transition-transform"
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-blue-600 font-mono">▶</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. SORTING (Purple - Connected with Sortify) */}
          <div className="rounded-2xl border-2 border-black bg-[#FAF5FF] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black/10">
                <Layers className="h-5 w-5 text-purple-600 stroke-[2.5]" />
                <h3 className="font-comic text-sm font-bold tracking-wider text-black uppercase">
                  SORTING
                </h3>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-slate-800">
                <div>• Bubble Sort</div>
                <div>• Selection Sort</div>
                <div>• Insertion Sort</div>
                <div>• Merge Sort</div>
                <div>• Quick Sort</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-black/10">
              <button
                onClick={() => window.open('https://sortify-algo.vercel.app/', '_blank', 'noopener,noreferrer')}
                title="Open Sortify algorithm visualizer (https://sortify-algo.vercel.app/)"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-purple-200 hover:bg-[#FFE135] hover:text-black py-1.5 font-comic text-xs font-extrabold text-purple-950 shadow-[2px_2px_0px_#000] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <span>Open Sortify</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. LEARN BY DOING BANNER */}
      {/* ============================================================ */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-2xl border-3 border-black bg-white p-6 sm:p-7 shadow-[6px_6px_0px_#000]">
          {/* Comic Speed streaks in corner */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FFE135] border-2 border-black rounded-full rotate-12 -z-0 opacity-80" />
          <div className="absolute top-2 right-4 text-black font-extrabold text-sm select-none">
            \ \ \
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Title with target board */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-[#EF4444] text-white shadow-[2px_2px_0px_#000]">
                <Target className="h-6 w-6 stroke-[2.5]" />
              </div>
              <h3 className="font-comic text-2xl font-bold tracking-tight text-black">
                Learn by Doing
              </h3>
            </div>

            {/* Three Points with yellow, green, red markers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8 flex-1 lg:max-w-3xl">
              {/* Point 1 */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]">
                  <Eye className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="font-comic text-xs sm:text-sm font-bold text-slate-800">
                  See algorithms step by step
                </span>
              </div>

              {/* Point 2 */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#22C55E] text-white shadow-[2px_2px_0px_#000]">
                  <Brain className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="font-comic text-xs sm:text-sm font-bold text-slate-800">
                  Understand complexity visually
                </span>
              </div>

              {/* Point 3 */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#EF4444] text-white shadow-[2px_2px_0px_#000]">
                  <Code2 className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="font-comic text-xs sm:text-sm font-bold text-slate-800">
                  Practice what you learn
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FOOTER */}
      {/* ============================================================ */}
      <footer className="mt-auto border-t-2 border-black bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-comic font-bold text-slate-800">
            <button onClick={() => onNavigateTab('home')} className="hover:underline cursor-pointer">Home</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('visualizer')} className="hover:underline cursor-pointer">Visualizer</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('learn')} className="hover:underline cursor-pointer">Learn</button>
            <span>•</span>
            <button onClick={() => onNavigateTab('practice')} className="hover:underline cursor-pointer">Practice</button>
          </div>
        </div>
      </footer>

      {/* Sortify Information Modal */}
      {sortifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border-3 border-black bg-white p-6 shadow-[8px_8px_0px_#000]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-600" />
                <h3 className="font-comic text-lg font-bold text-black">Sortify Integration</h3>
              </div>
              <button
                onClick={() => setSortifyModalOpen(false)}
                className="rounded-lg border-2 border-black p-1 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-4 text-xs sm:text-sm text-slate-700 space-y-2">
              <p>
                <strong>Sortify</strong> is your dedicated interactive sorting visualizer companion project featuring Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort.
              </p>
              <div className="p-3 bg-purple-50 rounded-xl border-2 border-purple-300 font-mono text-xs text-purple-900">
                Connected with Sortify v2.0 • External Suite Bridge Ready
              </div>
            </div>

            <button
              onClick={() => setSortifyModalOpen(false)}
              className="w-full rounded-xl border-2 border-black bg-[#FFE135] py-2 font-comic text-sm font-bold text-black shadow-[2px_2px_0px_#000]"
            >
              Continue Exploring DSA ZONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
