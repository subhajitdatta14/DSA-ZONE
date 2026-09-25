import React from 'react';
import { Topic } from '../types/dsa';
import { ArrowUpRight, Play, BookOpen } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onOpenVisualizer: (topicId: string) => void;
  onOpenLearn: (topicId: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onOpenVisualizer,
  onOpenLearn,
}) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border-2 border-black bg-white p-5 transition-all duration-200 shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]">
      <div>
        {/* Header line: Title & Status indicator */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-comic text-base font-black text-black group-hover:text-amber-600 transition-colors">
              {topic.name}
            </h4>
            {/* Zero-Pill unboxed metadata with separators */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-comic font-bold text-slate-600">
              <span>{topic.categoryName}</span>
              {topic.tags.slice(0, 2).map((tag, idx) => (
                <React.Fragment key={idx}>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span>{tag}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {topic.isImplemented ? (
            <span className="flex items-center gap-1 text-[11px] font-comic font-black text-white border-2 border-black bg-[#22C55E] px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_#000]">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
          ) : (
            <span className="text-[11px] font-comic font-bold text-slate-700 border-2 border-black bg-slate-100 px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_#000]">
              Phase {topic.phase}
            </span>
          )}
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-slate-700 font-comic line-clamp-2">
          {topic.description}
        </p>

        {/* Complexity indicators */}
        <div className="mt-3.5 flex items-center gap-3 text-[11px] font-mono tabular-nums text-slate-700 border-t-2 border-slate-100 pt-2.5">
          {topic.timeComplexity.access && (
            <div>
              <span className="text-slate-500 mr-1">Access:</span>
              <span className="text-emerald-700 font-bold">{topic.timeComplexity.access}</span>
            </div>
          )}
          {topic.timeComplexity.search && (
            <div>
              <span className="text-slate-500 mr-1">Search:</span>
              <span className="text-blue-700 font-bold">{topic.timeComplexity.search}</span>
            </div>
          )}
          {topic.timeComplexity.best && (
            <div>
              <span className="text-slate-500 mr-1">Best:</span>
              <span className="text-emerald-700 font-bold">{topic.timeComplexity.best}</span>
            </div>
          )}
          {topic.timeComplexity.worst && (
            <div>
              <span className="text-slate-500 mr-1">Worst:</span>
              <span className="text-amber-700 font-bold">{topic.timeComplexity.worst}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action links */}
      <div className="mt-4 flex items-center justify-between border-t-2 border-slate-100 pt-3 text-xs font-comic font-bold">
        <button
          onClick={() => onOpenLearn(topic.id)}
          className="flex items-center gap-1.5 text-slate-700 hover:text-black transition-colors cursor-pointer"
        >
          <BookOpen className="h-4 w-4 stroke-[2.5] text-purple-600" />
          <span>Learn Concept</span>
        </button>

        {topic.isImplemented ? (
          <button
            onClick={() => onOpenVisualizer(topic.id)}
            className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#FFE135] px-2.5 py-1 text-black shadow-[1px_1px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <Play className="h-3 w-3 fill-current stroke-[2]" />
            <span>Visualize</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenVisualizer(topic.id)}
            className="flex items-center gap-1 text-slate-500 hover:text-black transition-colors cursor-pointer"
          >
            <span>Roadmap</span>
            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
