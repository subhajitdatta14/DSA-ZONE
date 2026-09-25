import React, { useEffect } from 'react';
import { CATEGORIES, TOPICS } from '../data/topics';
import { Layers, X, ArrowUpRight } from 'lucide-react';

interface SidebarProps {
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedTopicId,
  onSelectTopic,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  // Lock background scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenMobile]);

  const renderContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between pb-3 border-b-2 border-black/10 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black font-comic">
          <Layers className="h-4 w-4 text-amber-500 stroke-[2.5]" />
          <span>TOPICS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-comic text-xs font-bold text-slate-600 bg-slate-100 border border-black/20 px-2 py-0.5 rounded-md">
            {TOPICS.length} Topics
          </span>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg border-2 border-black bg-white text-black hover:bg-slate-100 md:hidden cursor-pointer shadow-[1px_1px_0px_#000]"
              aria-label="Close topics drawer"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5 overflow-y-auto flex-1 pr-2 overscroll-contain touch-scroll min-h-0 thin-scrollbar">
        {CATEGORIES.map((category) => {
          const catTopics = TOPICS.filter((t) => t.category === category.id);
          if (catTopics.length === 0) return null;

          return (
            <div key={category.id} className="space-y-1.5">
              <h4 className="px-2 text-[11px] font-bold tracking-wider text-slate-500 font-comic uppercase">
                {category.name}
              </h4>

              <div className="space-y-1">
                {catTopics.map((topic) => {
                  const isSelected = selectedTopicId === topic.id;

                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        onSelectTopic(topic.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all text-left cursor-pointer min-h-[36px] ${
                        isSelected
                          ? 'border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]'
                          : 'text-slate-800 hover:bg-slate-100 hover:text-black active:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 border border-black ${
                            isSelected
                              ? 'bg-black'
                              : topic.isImplemented
                              ? 'bg-emerald-400'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span className="truncate">{topic.name}</span>
                      </div>

                      {topic.isImplemented && (
                        <span className="text-[10px] font-mono font-bold text-emerald-600 shrink-0 ml-1">
                          LIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. SORTING (Connected with Sortify - same as Home page) */}
      <div className="shrink-0 mt-3 pt-3 border-t-2 border-black/10">
        <div className="rounded-2xl border-2 border-black bg-[#FAF5FF] p-3 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-black/10">
              <Layers className="h-4 w-4 text-purple-600 stroke-[2.5]" />
              <h3 className="font-comic text-xs font-bold tracking-wider text-black uppercase">
                SORTING
              </h3>
            </div>

            <div className="space-y-1 text-xs font-semibold text-slate-800">
              <div>• Bubble Sort</div>
              <div>• Selection Sort</div>
              <div>• Insertion Sort</div>
              <div>• Merge Sort</div>
              <div>• Quick Sort</div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t-2 border-black/10">
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
    </div>
  );

  return (
    <>
      {/* Desktop / Laptop Permanent Sidebar */}
      <aside className="hidden md:block w-60 lg:w-68 shrink-0 border-2 border-black bg-white p-4 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden thin-scrollbar">
        {renderContent()}
      </aside>

      {/* Mobile / Tablet Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />

          {/* Drawer container */}
          <div className="relative w-[85%] max-w-xs h-full bg-white border-r-2 border-black p-4 z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-250">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};
