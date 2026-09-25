import React, { useState } from 'react';
import { TOPICS } from '../data/topics';
import { Sidebar } from '../components/Sidebar';
import { ArrayVisualizer } from '../visualizers/ArrayVisualizer';
import { LinkedListVisualizer } from '../visualizers/LinkedListVisualizer';
import { StackVisualizer } from '../visualizers/StackVisualizer';
import { QueueVisualizer } from '../visualizers/QueueVisualizer';
import { PriorityQueueVisualizer } from '../visualizers/PriorityQueueVisualizer';
import { HashTableVisualizer } from '../visualizers/HashTableVisualizer';
import { TreeVisualizer } from '../visualizers/TreeVisualizer';
import { AVLTreeVisualizer } from '../visualizers/AVLTreeVisualizer';
import { HeapVisualizer } from '../visualizers/HeapVisualizer';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { SearchVisualizer } from '../visualizers/SearchVisualizer';
import { AlgorithmVisualizer } from '../visualizers/AlgorithmVisualizer';
import { TopicPlaceholder } from '../visualizers/TopicPlaceholder';
import { PanelLeft, BookOpen, HelpCircle } from 'lucide-react';

interface VisualizerProps {
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onOpenLearn: (topicId: string) => void;
  onOpenPractice: (topicId: string) => void;
  onIncrementOps: () => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  selectedTopicId,
  onSelectTopic,
  onOpenLearn,
  onOpenPractice,
  onIncrementOps,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  const renderVisualizer = () => {
    switch (currentTopic.id) {
      case 'array':
        return <ArrayVisualizer onOperationComplete={onIncrementOps} />;

      case 'linked-list':
        return <LinkedListVisualizer isDoubly={false} onOperationComplete={onIncrementOps} />;

      case 'doubly-linked-list':
        return <LinkedListVisualizer isDoubly={true} onOperationComplete={onIncrementOps} />;

      case 'stack':
        return <StackVisualizer onOperationComplete={onIncrementOps} />;

      case 'queue':
        return <QueueVisualizer isCircular={false} onOperationComplete={onIncrementOps} />;

      case 'circular-queue':
        return <QueueVisualizer isCircular={true} onOperationComplete={onIncrementOps} />;

      case 'priority-queue':
        return <PriorityQueueVisualizer onOperationComplete={onIncrementOps} />;

      case 'hash-table':
        return <HashTableVisualizer onOperationComplete={onIncrementOps} />;

      case 'binary-tree':
        return <TreeVisualizer isBST={false} onOperationComplete={onIncrementOps} />;

      case 'binary-search-tree':
        return <TreeVisualizer isBST={true} onOperationComplete={onIncrementOps} />;

      case 'avl-tree':
        return <AVLTreeVisualizer onOperationComplete={onIncrementOps} />;

      case 'heap':
        return <HeapVisualizer onOperationComplete={onIncrementOps} />;

      case 'graph':
        return <GraphVisualizer algorithmMode="general" onOperationComplete={onIncrementOps} />;

      case 'bfs':
        return <GraphVisualizer algorithmMode="bfs" onOperationComplete={onIncrementOps} />;

      case 'dfs':
        return <GraphVisualizer algorithmMode="dfs" onOperationComplete={onIncrementOps} />;

      case 'dijkstra':
        return <GraphVisualizer algorithmMode="dijkstra" onOperationComplete={onIncrementOps} />;

      case 'prims':
      case 'prim':
        return <GraphVisualizer algorithmMode="prims" onOperationComplete={onIncrementOps} />;

      case 'kruskals':
      case 'kruskal':
        return <GraphVisualizer algorithmMode="kruskals" onOperationComplete={onIncrementOps} />;

      case 'linear-search':
        return <SearchVisualizer algorithmMode="linear" onOperationComplete={onIncrementOps} />;

      case 'binary-search':
        return <SearchVisualizer algorithmMode="binary" onOperationComplete={onIncrementOps} />;

      case 'recursion':
        return <AlgorithmVisualizer algorithmType="recursion" onOperationComplete={onIncrementOps} />;

      case 'greedy-algorithms':
        return <AlgorithmVisualizer algorithmType="greedy-algorithms" onOperationComplete={onIncrementOps} />;

      case 'dynamic-programming':
        return <AlgorithmVisualizer algorithmType="dynamic-programming" onOperationComplete={onIncrementOps} />;

      case 'backtracking':
        return <AlgorithmVisualizer algorithmType="backtracking" onOperationComplete={onIncrementOps} />;

      default:
        return (
          <TopicPlaceholder
            topic={currentTopic}
            onOpenLearn={onOpenLearn}
            onOpenPractice={onOpenPractice}
            onSelectArray={() => onSelectTopic('array')}
          />
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row bg-[#fafafa]">
      {/* Sidebar for topic categories */}
      <Sidebar
        selectedTopicId={currentTopic.id}
        onSelectTopic={onSelectTopic}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Visualizer Area */}
      <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-6xl mx-auto w-full min-w-0">
        {/* Mobile toggle button + Top Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b-2 border-black pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3 py-1.5 text-xs font-comic font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-50 active:translate-y-0.5 md:hidden cursor-pointer shrink-0"
              aria-label="Open topic selection menu"
            >
              <PanelLeft className="h-4 w-4 text-amber-500" />
              <span>Topics</span>
            </button>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black font-comic truncate">
                  {currentTopic.name}
                </h1>
                {currentTopic.isImplemented ? (
                  <span className="rounded-lg bg-[#22C55E] border-2 border-black px-2 py-0.5 text-[9px] sm:text-[10px] font-comic font-bold text-white shadow-[2px_2px_0px_#000] uppercase tracking-wider shrink-0">
                    LIVE
                  </span>
                ) : (
                  <span className="rounded-lg bg-slate-100 border-2 border-black px-2 py-0.5 text-[9px] sm:text-[10px] font-comic font-bold text-slate-700 shadow-[1px_1px_0px_#000] shrink-0">
                    P{currentTopic.phase}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-600 font-comic font-medium truncate">
                {currentTopic.categoryName} • {currentTopic.description}
              </p>
            </div>
          </div>

          {/* Quick links to Learn / Practice */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
            <button
              onClick={() => onOpenLearn(currentTopic.id)}
              className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#22C55E] px-3 sm:px-3.5 py-1.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Learn Guide</span>
            </button>
            <button
              onClick={() => onOpenPractice(currentTopic.id)}
              className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#EF4444] px-3 sm:px-3.5 py-1.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Practice Questions</span>
            </button>
          </div>
        </div>

        {/* Visualizer Canvas Area */}
        {renderVisualizer()}
      </main>
    </div>
  );
};
