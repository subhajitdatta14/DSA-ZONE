import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../data/questions';
import { TOPICS } from '../data/topics';
import { QuestionDifficulty, UserProgress } from '../types/dsa';
import { QuestionCard } from '../components/QuestionCard';
import { Brain, RotateCcw, ChevronDown } from 'lucide-react';

interface PracticeProps {
  progress: UserProgress;
  selectedTopicId?: string;
  onSelectTopic?: (topicId: string) => void;
  onAnswerQuestion: (questionId: string, optionId: string, isCorrect: boolean) => void;
  onResetPractice: (topicId?: string) => void;
}

export const Practice: React.FC<PracticeProps> = ({
  progress,
  selectedTopicId,
  onSelectTopic,
  onAnswerQuestion,
  onResetPractice,
}) => {
  const initialTopic: string =
    selectedTopicId && TOPICS.some((t) => t.id === selectedTopicId) ? selectedTopicId : 'array';
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'All'>('All');
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Sync when selectedTopicId from parent changes
  useEffect(() => {
    if (selectedTopicId && TOPICS.some((t) => t.id === selectedTopicId)) {
      setSelectedTopic(selectedTopicId);
    }
  }, [selectedTopicId]);

  const handleReset = () => {
    setIsResetting(true);
    onResetPractice(activeTopic.id);
    setTimeout(() => {
      setIsResetting(false);
    }, 600);
  };

  const difficulties: (QuestionDifficulty | 'All')[] = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  const activeTopic = TOPICS.find((t) => t.id === selectedTopic) || TOPICS[0];
  const topicQuestions = QUESTIONS.filter((q) => q.topicId === activeTopic.id);

  const filteredQuestions = topicQuestions.filter((q) => {
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesDifficulty;
  });

  const topicPracticed = progress.practicedQuestions.filter((p) => {
    const q = QUESTIONS.find((item) => item.id === p.questionId);
    return q && q.topicId === activeTopic.id;
  });
  const correctAnswers = topicPracticed.filter((p) => p.isCorrect).length;
  const attemptedTotal = topicPracticed.length;
  const accuracy = attemptedTotal > 0 ? Math.round((correctAnswers / attemptedTotal) * 100) : 0;

  const handleTopicChange = (newTopicId: string) => {
    setSelectedTopic(newTopicId);
    if (onSelectTopic) {
      onSelectTopic(newTopicId);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-[#fafafa]">
      {/* Practice Header & Score Tracker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border-2 border-black bg-[#EF4444] px-2.5 py-0.5 font-comic text-xs font-bold text-white shadow-[2px_2px_0px_#000]">
              PRACTICE ARENA
            </span>
            <span className="font-comic text-xs font-bold text-slate-600">
              {activeTopic.name}: {topicQuestions.length} Questions
            </span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-black font-comic">
            {activeTopic.name} Practice
          </h1>
          <p className="mt-1 text-sm font-comic font-medium text-slate-700">
            Solidify your mental models through active recall, complexity quizzes, and visual output challenges for {activeTopic.name}.
          </p>
        </div>

        {/* Score & Accuracy Card */}
        <div className="flex items-center gap-4 rounded-2xl border-2 border-black bg-white p-3.5 shadow-[4px_4px_0px_#000]">
          <div className="text-right">
            <div className="text-[11px] font-comic font-bold text-slate-600 uppercase">{activeTopic.name} Score</div>
            <div className="font-comic text-lg font-extrabold text-black">
              <span className="text-emerald-600">{correctAnswers}</span> / {topicQuestions.length}
              <span className="text-xs text-slate-500 font-bold ml-1.5 font-mono">({accuracy}%)</span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-slate-100 text-black shadow-[2px_2px_0px_#000] hover:bg-[#FFE135] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={`Refresh ${activeTopic.name} Quiz Scores`}
            aria-label={`Refresh ${activeTopic.name} Quiz Scores`}
          >
            <RotateCcw
              className={`h-4 w-4 stroke-[2.5] transition-transform duration-500 ${
                isResetting ? '-rotate-180 text-black' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filter Bar with Topic and Difficulty */}
      <div className="space-y-4 rounded-2xl border-2 border-black bg-white p-4 sm:p-5 shadow-[4px_4px_0px_#000]">
        {/* Topic Selector Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-comic font-bold text-slate-800 uppercase min-w-[50px]">Topic:</span>
          <div className="relative inline-block">
            <select
              value={selectedTopic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="appearance-none rounded-xl border-2 border-black bg-[#FFE135] pl-3 pr-8 py-1.5 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] cursor-pointer focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {TOPICS.map((t) => {
                const count = QUESTIONS.filter((q) => q.topicId === t.id).length;
                return (
                  <option key={t.id} value={t.id}>
                    {t.name} ({count})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-black stroke-[3]" />
          </div>
        </div>

        {/* Difficulty Level Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-slate-100">
          <span className="text-xs font-comic font-bold text-slate-800 uppercase min-w-[50px]">Level:</span>
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`rounded-xl px-3 py-1 text-xs font-comic font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-black bg-[#22C55E] text-white shadow-[2px_2px_0px_#000]'
                    : 'border-2 border-black bg-white text-slate-800 hover:bg-slate-100 shadow-[1px_1px_0px_#000]'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl border-2 border-black bg-white p-12 text-center shadow-[4px_4px_0px_#000]">
            <Brain className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 font-comic text-lg font-bold text-black">No questions match filters</h3>
            <p className="mt-1 text-xs font-medium text-slate-600">
              Try switching your difficulty or topic filter.
            </p>
            <button
              onClick={() => {
                setSelectedDifficulty('All');
              }}
              className="mt-4 rounded-xl border-2 border-black bg-[#FFE135] px-4 py-2 font-comic text-xs font-bold text-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((question, idx) => {
            const saved = progress.practicedQuestions.find((p) => p.questionId === question.id);
            return (
              <QuestionCard
                key={`${question.id}-${saved ? saved.selectedOption : 'fresh'}`}
                question={question}
                questionNumber={idx + 1}
                onAnswerSelected={onAnswerQuestion}
                savedAnswer={saved ? { selectedOption: saved.selectedOption, isCorrect: saved.isCorrect } : undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
