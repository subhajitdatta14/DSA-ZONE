import React from 'react';
import { Topic } from '../types/dsa';
import { BookOpen, HelpCircle, Layers, ArrowRight } from 'lucide-react';

interface TopicPlaceholderProps {
  topic: Topic;
  onOpenLearn: (topicId: string) => void;
  onOpenPractice: (topicId: string) => void;
  onSelectArray: () => void;
}

export const TopicPlaceholder: React.FC<TopicPlaceholderProps> = ({
  topic,
  onOpenLearn,
  onOpenPractice,
  onSelectArray,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-black bg-white p-8 sm:p-12 text-center shadow-[5px_5px_0px_#000]">
      {/* Icon Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-[#FFE135] text-black shadow-[3px_3px_0px_#000]">
        <Layers className="h-8 w-8 stroke-[2.5]" />
      </div>

      <h3 className="mt-5 text-2xl font-comic font-black tracking-tight text-black">
        {topic.name} Visualizer
      </h3>

      <div className="mt-2 flex items-center gap-2 text-xs text-slate-700 font-comic font-bold">
        <span>{topic.categoryName}</span>
        <span>·</span>
        <span>Scheduled for Phase {topic.phase}</span>
      </div>

      <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-800 font-comic">
        The interactive animation engine for <strong className="text-black">{topic.name}</strong> is queued in our development roadmap under <strong>Phase {topic.phase}</strong>. The <strong>Array</strong> visualizer is currently live as the reference engine.
      </p>

      {/* Complexity preview card */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 rounded-xl border-2 border-black bg-slate-50 px-6 py-3 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000]">
        {topic.timeComplexity.access && (
          <div>Access: <span className="font-mono font-black text-emerald-700">{topic.timeComplexity.access}</span></div>
        )}
        {topic.timeComplexity.search && (
          <div>Search: <span className="font-mono font-black text-blue-700">{topic.timeComplexity.search}</span></div>
        )}
        {topic.timeComplexity.best && (
          <div>Best: <span className="font-mono font-black text-emerald-700">{topic.timeComplexity.best}</span></div>
        )}
        {topic.timeComplexity.worst && (
          <div>Worst: <span className="font-mono font-black text-amber-700">{topic.timeComplexity.worst}</span></div>
        )}
        <div>Space: <span className="font-mono font-black text-purple-700">{topic.spaceComplexity}</span></div>
      </div>

      {/* Navigation action buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onSelectArray}
          className="flex items-center gap-2 rounded-xl bg-[#FFE135] px-4 py-2.5 font-comic text-xs font-bold text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
        >
          <span>Launch Array Visualizer</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onOpenLearn(topic.id)}
          className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 transition-all cursor-pointer"
        >
          <BookOpen className="h-4 w-4 stroke-[2.5] text-purple-600" />
          <span>Read Conceptual Guide</span>
        </button>

        <button
          onClick={() => onOpenPractice(topic.id)}
          className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 transition-all cursor-pointer"
        >
          <HelpCircle className="h-4 w-4 stroke-[2.5] text-emerald-600" />
          <span>Practice Questions</span>
        </button>
      </div>
    </div>
  );
};
