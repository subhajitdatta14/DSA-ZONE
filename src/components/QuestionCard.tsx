import React, { useState, useEffect } from 'react';
import { Question } from '../types/dsa';
import { ComicBurst } from './ComicBadge';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswerSelected?: (questionId: string, optionId: string, isCorrect: boolean) => void;
  savedAnswer?: { selectedOption: string; isCorrect: boolean };
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  onAnswerSelected,
  savedAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    savedAnswer ? savedAnswer.selectedOption : null
  );
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(!!savedAnswer);

  useEffect(() => {
    setSelectedOption(savedAnswer ? savedAnswer.selectedOption : null);
    setHasSubmitted(!!savedAnswer);
  }, [savedAnswer]);

  const difficultyMeta = {
    Beginner: { label: 'BEGINNER', bg: 'bg-[#22C55E] text-white' },
    Intermediate: { label: 'INTERMEDIATE', bg: 'bg-[#FFE135] text-black' },
    Advanced: { label: 'ADVANCED', bg: 'bg-[#EF4444] text-white' },
  }[question.difficulty];

  const handleSelect = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOption(optionId);
    setHasSubmitted(true);
    const isCorrect = optionId === question.correctOptionId;
    if (onAnswerSelected) {
      onAnswerSelected(question.id, optionId, isCorrect);
    }
  };

  const isCorrect = selectedOption === question.correctOptionId;

  return (
    <div className="rounded-2xl border-2 border-black bg-white p-5 sm:p-6 shadow-[4px_4px_0px_#000]">
      {/* Question metadata header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/10 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-comic font-bold text-black bg-[#FFE135] border-2 border-black px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_#000]">
            Q{questionNumber}
          </span>
          <span className="font-comic font-bold text-slate-800">{question.topicName}</span>
          <span className="text-slate-400">•</span>
          <span className="font-comic font-semibold text-slate-600">{question.category}</span>
        </div>

        <div className="flex items-center gap-1.5 font-comic text-[11px] font-bold">
          <span className={`px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_#000] ${difficultyMeta.bg}`}>
            {difficultyMeta.label}
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mt-4">
        <h4 className="text-base font-comic font-bold leading-relaxed text-black">
          {question.question}
        </h4>

        {/* Optional code snippet */}
        {question.codeSnippet && (
          <pre className="mt-3 overflow-x-auto rounded-xl border-2 border-black bg-slate-900 p-3.5 font-mono text-xs text-amber-300 shadow-[2px_2px_0px_#000]">
            <code>{question.codeSnippet}</code>
          </pre>
        )}
      </div>

      {/* Multiple Choice Options */}
      <div className="mt-5 space-y-2.5">
        {question.options.map((option) => {
          const isThisSelected = selectedOption === option.id;
          const isThisCorrect = option.id === question.correctOptionId;

          let btnStyles =
            'border-black bg-white text-black hover:bg-amber-50 hover:-translate-y-0.5 shadow-[2px_2px_0px_#000]';

          if (hasSubmitted) {
            if (isThisCorrect) {
              btnStyles =
                'border-black bg-[#22C55E] text-white font-bold shadow-[3px_3px_0px_#000]';
            } else if (isThisSelected && !isThisCorrect) {
              btnStyles =
                'border-black bg-[#EF4444] text-white font-bold shadow-[3px_3px_0px_#000]';
            } else {
              btnStyles = 'border-black/20 bg-slate-100 text-slate-400 opacity-50';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={hasSubmitted}
              className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left text-xs sm:text-sm transition-all font-comic font-medium ${btnStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-slate-100 font-comic text-xs font-bold text-black uppercase">
                  {option.id}
                </span>
                <span>{option.text}</span>
              </div>

              {hasSubmitted && (
                <div className="shrink-0 ml-3">
                  {isThisCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-white stroke-[2.5]" />
                  )}
                  {isThisSelected && !isThisCorrect && (
                    <XCircle className="h-5 w-5 text-white stroke-[2.5]" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner when answered */}
      {hasSubmitted && (
        <div
          className={`mt-4 rounded-xl border-2 border-black p-4 text-xs leading-relaxed shadow-[3px_3px_0px_#000] animate-in fade-in ${
            isCorrect
              ? 'bg-[#F0FDF4] text-emerald-950'
              : 'bg-[#FEF2F2] text-rose-950'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 font-comic font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                  <span>Brilliant! Correct Answer.</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-600 stroke-[2.5]" />
                  <span>Not quite. Check the concept below:</span>
                </>
              )}
            </div>
            {isCorrect ? (
              <ComicBurst text="CORRECT!" variant="green" size="sm" />
            ) : (
              <ComicBurst text="OOPS!" variant="red" size="sm" />
            )}
          </div>
          <p className="mt-1 font-medium text-slate-800">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
