import React, { useState, useEffect } from 'react';
import { LEARN_TOPICS } from '../data/learnContent';
import { TOPICS } from '../data/topics';
import { ComicBurst } from '../components/ComicBadge';
import {
  Play,
  Calculator,
  Check,
  ChevronDown
} from 'lucide-react';

interface LearnProps {
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onOpenVisualizer: (topicId: string) => void;
  onMarkCompleted: (topicId: string) => void;
}

export const Learn: React.FC<LearnProps> = ({
  selectedTopicId,
  onSelectTopic,
  onOpenVisualizer,
  onMarkCompleted,
}) => {
  const content = LEARN_TOPICS[selectedTopicId] || LEARN_TOPICS['array'];

  // Interactive visual memory / inspection state
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  // Quick check quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Reset quiz and active index when topic changes
  useEffect(() => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setActiveItemIndex(0);
  }, [selectedTopicId]);

  const visualEx = content.sections.visualExample;
  const items = visualEx.items || (visualEx.elements ? visualEx.elements.map((val, idx) => ({
    label: `arr[${idx}]`,
    value: val,
    note: `Offset: +${idx * 4}B`
  })) : []);

  const safeIndex = Math.min(activeItemIndex, Math.max(0, items.length - 1));
  const activeItem = items[safeIndex] || items[0];

  const baseAddressInt = 0x1000;
  const elementSize = visualEx.elementSizeBytes || 4;
  const calculatedHex = `0x${(baseAddressInt + safeIndex * elementSize).toString(16).toUpperCase()}`;

  const handleQuizAnswer = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(idx);
    setQuizSubmitted(true);
    if (idx === content.sections.quickCheck.correctIndex) {
      onMarkCompleted(content.topicId);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 bg-[#fafafa]">
      {/* Top Banner / Topic Navigation in Comic Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border-2 border-black bg-[#22C55E] px-2.5 py-0.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000]">
              LEARN CURRICULUM
            </span>
            {/* Topic Switcher Dropdown */}
            <div className="relative inline-block">
              <select
                value={content.topicId}
                onChange={(e) => {
                  onSelectTopic(e.target.value);
                }}
                className="appearance-none rounded-xl border-2 border-black bg-white pl-3 pr-8 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] cursor-pointer focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-black stroke-[3]" />
            </div>
          </div>

          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-black font-comic">
            {content.topicTitle}
          </h1>
          <p className="mt-1 text-sm font-comic font-medium text-slate-700">
            {content.tagline}
          </p>
        </div>

        {/* Action to Visualizer */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenVisualizer(content.topicId)}
            className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#FFE135] px-4 py-2.5 font-comic text-xs font-bold text-black shadow-[3px_3px_0px_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-black stroke-black" />
            <span>Launch Visualizer</span>
          </button>
        </div>
      </div>

      {/* 9-Step Standard Learning Structure */}
      <div className="space-y-8">
        {/* 1. What is it? */}
        <section className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-[#FFE135] font-comic text-xs font-bold text-black">
              1
            </span>
            <h2 className="text-xl font-bold text-black font-comic">
              {content.sections.whatIsIt.title}
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-800 font-medium">
            {content.sections.whatIsIt.content}
          </p>
          {content.sections.whatIsIt.points && (
            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-800 font-medium">
              {content.sections.whatIsIt.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-black bg-[#22C55E] text-white text-xs font-bold mt-0.5 shadow-[1px_1px_0px_#000]">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 2. Why is it used? */}
        <section className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-[#22C55E] font-comic text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-xl font-bold text-black font-comic">
              {content.sections.whyUsed.title}
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-800 font-medium">
            {content.sections.whyUsed.content}
          </p>
          {content.sections.whyUsed.points && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {content.sections.whyUsed.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border-2 border-black bg-[#F0FDF4] p-3.5 text-xs text-slate-800 font-medium leading-relaxed shadow-[2px_2px_0px_#000]"
                >
                  {pt}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. How does it work? */}
        <section className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-[#EF4444] font-comic text-xs font-bold text-white">
              3
            </span>
            <h2 className="text-xl font-bold text-black font-comic">
              {content.sections.howItWorks.title}
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-800 font-medium">
            {content.sections.howItWorks.content}
          </p>
          {content.sections.howItWorks.code && (
            <div className="mt-4 rounded-xl border-2 border-black bg-slate-900 p-4 font-mono text-xs text-amber-300 shadow-[3px_3px_0px_#000] whitespace-pre-wrap">
              <code>{content.sections.howItWorks.code}</code>
            </div>
          )}
          {content.sections.howItWorks.highlightBox && (
            <div className="mt-4 rounded-xl border-2 border-black bg-[#FFFBEB] p-4 text-xs leading-relaxed text-slate-900 shadow-[2px_2px_0px_#000]">
              <strong className="text-black font-comic font-bold">
                {content.sections.howItWorks.highlightBox.label}:{' '}
              </strong>
              {content.sections.howItWorks.highlightBox.text}
            </div>
          )}
        </section>

        {/* 4. Visual Example: Interactive Element Breakdown */}
        <section className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-[#FFE135] font-comic text-xs font-bold text-black">
                4
              </span>
              <h2 className="text-xl font-bold text-black font-comic">
                {visualEx.title}
              </h2>
            </div>
            <span className="font-comic text-xs font-bold text-amber-600 bg-amber-50 border border-black/20 px-2 py-0.5 rounded-md">
              Interactive • Click a Component
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-700 font-medium">
            {visualEx.description}
          </p>

          {/* Interactive diagram elements */}
          <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-black bg-slate-50 p-6 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto max-w-full pb-3">
              {items.map((item, idx) => {
                const isSelected = safeIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveItemIndex(idx)}
                    className={`group flex flex-col items-center rounded-xl p-3 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-black bg-[#FFE135] shadow-[4px_4px_0px_#000] scale-105 -translate-y-1'
                        : 'border-black bg-white shadow-[2px_2px_0px_#000] hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono text-[11px] font-bold text-slate-700">
                      {item.label}
                    </span>
                    <span className="my-1 font-mono text-base sm:text-lg font-bold text-black text-center whitespace-nowrap">
                      {item.value}
                    </span>
                    {item.note && (
                      <span className="font-mono text-[10px] font-medium text-slate-600 text-center">
                        {item.note}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calculated Breakdown Display */}
            {activeItem && (
              <div className="mt-6 w-full max-w-lg rounded-xl border-2 border-black bg-white p-4 font-mono text-xs shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2 font-comic font-bold text-black mb-2">
                  <Calculator className="h-4 w-4 text-amber-600 stroke-[2.5]" />
                  <span>Component Details: {activeItem.label}</span>
                </div>
                <div className="space-y-1 text-slate-800">
                  <div>• Payload / State: <span className="font-bold text-black">{activeItem.value}</span></div>
                  {activeItem.note && (
                    <div>• Connection / Note: <span className="font-bold text-black">{activeItem.note}</span></div>
                  )}
                  {visualEx.elementSizeBytes ? (
                    <div>• Physical RAM Address: <span className="bg-[#FFE135] px-2 py-0.5 rounded border border-black font-bold">{calculatedHex}</span></div>
                  ) : null}
                  {visualEx.breakdownNote && (
                    <div className="pt-2 border-t-2 border-black/10 font-bold text-black font-sans text-xs">
                      {visualEx.breakdownNote}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 5. Operations */}
        <section className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-[#22C55E] font-comic text-xs font-bold text-white">
              5
            </span>
            <h2 className="text-xl font-bold text-black font-comic">
              Operations & Behaviors
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {content.sections.operations.map((op, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-2 border-black bg-slate-50 p-4 shadow-[2px_2px_0px_#000]"
              >
                <div>
                  <h4 className="text-sm font-bold text-black font-comic">
                    {op.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-700 font-medium">
                    {op.description}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 italic">
                    {op.note}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                  <div className="rounded-lg border border-black bg-[#F0FDF4] px-2.5 py-1">
                    <span className="text-slate-600 mr-1 text-[10px]">Best:</span>
                    <span className="font-bold text-emerald-700">{op.bestCase}</span>
                  </div>
                  <div className="rounded-lg border border-black bg-[#FEF2F2] px-2.5 py-1">
                    <span className="text-slate-600 mr-1 text-[10px]">Worst:</span>
                    <span className="font-bold text-rose-700">{op.worstCase}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Time Complexity Table */}
        <section className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#000] overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-[#EF4444] font-comic text-xs font-bold text-white">
              6
            </span>
            <h2 className="text-xl font-bold text-black font-comic">
              Time Complexity Reference
            </h2>
          </div>
          <table className="w-full text-left font-mono text-xs border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_#000]">
            <thead className="bg-[#FFE135] text-black border-b-2 border-black">
              <tr>
                <th className="p-3 font-comic font-bold">Operation</th>
                <th className="p-3 font-comic font-bold">Best Case</th>
                <th className="p-3 font-comic font-bold">Average Case</th>
                <th className="p-3 font-comic font-bold">Worst Case</th>
                <th className="p-3 font-comic font-bold">Algorithmic Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 bg-white">
              {content.sections.timeComplexity.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-black font-comic">{row.operation}</td>
                  <td className="p-3 font-bold text-emerald-700">{row.best}</td>
                  <td className="p-3 font-bold text-amber-700">{row.average}</td>
                  <td className="p-3 font-bold text-rose-700">{row.worst}</td>
                  <td className="p-3 text-[11px] text-slate-700 font-sans">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 7. Space Complexity */}
        <section className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-[#FFE135] font-comic text-xs font-bold text-black">
              7
            </span>
            <h2 className="text-xl font-bold text-black font-comic">
              {content.sections.spaceComplexity.title}
            </h2>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-mono text-2xl font-extrabold text-black bg-[#EFF6FF] border-2 border-black px-3 py-1 rounded-xl shadow-[2px_2px_0px_#000]">
              {content.sections.spaceComplexity.complexity}
            </span>
            <span className="text-xs text-slate-600 font-comic font-bold">Memory Requirement</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-800 font-medium">
            {content.sections.spaceComplexity.explanation}
          </p>
        </section>

        {/* 8. Real-world Examples */}
        <section className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-[#22C55E] font-comic text-xs font-bold text-white">
              8
            </span>
            <h2 className="text-xl font-bold text-black font-comic">
              {content.sections.realWorldExample.title}
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-700 font-medium">
            {content.sections.realWorldExample.description}
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {content.sections.realWorldExample.examples.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-xl border-2 border-black bg-[#FFFBEB] p-4 space-y-1.5 shadow-[2px_2px_0px_#000]"
              >
                <h4 className="text-xs font-bold text-black font-comic uppercase tracking-wider">
                  {ex.title}
                </h4>
                <p className="text-xs leading-relaxed text-slate-700 font-medium">
                  {ex.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Quick Check Interactive Quiz */}
        <section className="rounded-2xl border-3 border-black bg-white p-6 sm:p-7 shadow-[6px_6px_0px_#000]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl border-2 border-black bg-[#FFE135] font-comic text-sm font-bold text-black">
                9
              </span>
              <h3 className="font-comic text-xl font-bold text-black">
                Quick Concept Check
              </h3>
            </div>
            <ComicBurst text="QUIZ!" variant="yellow" size="sm" />
          </div>

          <h4 className="mt-4 text-base font-bold text-black font-comic">
            {content.sections.quickCheck.question}
          </h4>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.sections.quickCheck.options.map((opt, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = idx === content.sections.quickCheck.correctIndex;

              let btnStyle =
                'border-black bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000]';

              if (quizSubmitted) {
                if (isCorrect) {
                  btnStyle = 'border-black bg-[#22C55E] text-white font-bold shadow-[3px_3px_0px_#000]';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-black bg-[#EF4444] text-white font-bold shadow-[3px_3px_0px_#000]';
                } else {
                  btnStyle = 'border-black/30 bg-slate-100 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={quizSubmitted}
                  className={`rounded-xl border-2 p-3 font-mono text-xs sm:text-sm text-left transition-all font-bold cursor-pointer ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div
              className={`mt-4 rounded-xl border-2 border-black p-4 text-xs leading-relaxed shadow-[3px_3px_0px_#000] animate-in fade-in ${
                selectedQuizOption === content.sections.quickCheck.correctIndex
                  ? 'bg-[#F0FDF4] text-emerald-900'
                  : 'bg-[#FEF2F2] text-rose-900'
              }`}
            >
              <div className="font-comic font-bold text-sm mb-1">
                {selectedQuizOption === content.sections.quickCheck.correctIndex
                  ? '🎉 Correct! Concept mastery verified.'
                  : '❌ Incorrect. Here is why:'}
              </div>
              <div className="font-medium text-slate-800">
                {content.sections.quickCheck.explanation}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
