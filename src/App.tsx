/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavPage, UserProgress } from './types/dsa';
import { QUESTIONS } from './data/questions';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Visualizer } from './pages/Visualizer';
import { Learn } from './pages/Learn';
import { Practice } from './pages/Practice';
import { ProgressModal } from './components/ProgressModal';
import { IntroSplash } from './components/IntroSplash';

const STORAGE_KEY = 'dsa_lab_user_progress_v2';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('array');
  const [isProgressOpen, setIsProgressOpen] = useState<boolean>(false);

  // Initialize progress from localStorage (Practice progress starts fresh on every open/refresh)
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          practicedQuestions: [],
        };
      }
    } catch {
      // Fallback
    }
    return {
      completedTopics: [],
      practicedQuestions: [],
      operationsRunCount: 0,
      visitedVisualizers: ['array'],
    };
  });

  // Save progress changes (do not persist practice questions across reloads/sessions)
  useEffect(() => {
    try {
      const toSave = {
        ...progress,
        practicedQuestions: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignore
    }
  }, [progress]);

  const handleIncrementOps = () => {
    setProgress((prev) => ({
      ...prev,
      operationsRunCount: prev.operationsRunCount + 1,
    }));
  };

  const handleMarkTopicCompleted = (topicId: string) => {
    setProgress((prev) => {
      if (prev.completedTopics.includes(topicId)) return prev;
      return {
        ...prev,
        completedTopics: [...prev.completedTopics, topicId],
      };
    });
  };

  const handleAnswerQuestion = (questionId: string, optionId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const existingIdx = prev.practicedQuestions.findIndex((p) => p.questionId === questionId);
      const entry = {
        questionId,
        selectedOption: optionId,
        isCorrect,
        timestamp: Date.now(),
      };

      let updatedList = [...prev.practicedQuestions];
      if (existingIdx >= 0) {
        updatedList[existingIdx] = entry;
      } else {
        updatedList.push(entry);
      }

      return {
        ...prev,
        practicedQuestions: updatedList,
      };
    });
  };

  const handleResetPractice = (topicId?: string) => {
    setProgress((prev) => {
      if (topicId) {
        const topicQuestionIds = new Set(
          QUESTIONS.filter((q) => q.topicId === topicId).map((q) => q.id)
        );
        return {
          ...prev,
          practicedQuestions: prev.practicedQuestions.filter(
            (p) => !topicQuestionIds.has(p.questionId)
          ),
        };
      }
      return {
        ...prev,
        practicedQuestions: [],
      };
    });
  };

  const handleTopicSelection = (
    topicId: string,
    targetTab: 'home' | 'visualizer' | 'learn' | 'practice' = 'visualizer'
  ) => {
    setSelectedTopicId(topicId);
    setCurrentPage(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans selection:bg-[#FFE135] selection:text-black">
      {/* 0. Animated First Page Splash (1.5 sec on open / refresh) */}
      {showSplash && <IntroSplash onFinish={() => setShowSplash(false)} durationMs={1500} />}

      {/* 1. Main Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenProgress={() => setIsProgressOpen(true)}
      />

      {/* 2. Main Page Body */}
      <div className="flex-1">
        {currentPage === 'home' && (
          <Home
            onNavigateTab={(tab) => {
              setCurrentPage(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTopic={handleTopicSelection}
          />
        )}

        {currentPage === 'visualizer' && (
          <Visualizer
            selectedTopicId={selectedTopicId}
            onSelectTopic={(id) => setSelectedTopicId(id)}
            onOpenLearn={(id) => handleTopicSelection(id, 'learn')}
            onOpenPractice={(id) => handleTopicSelection(id, 'practice')}
            onIncrementOps={handleIncrementOps}
          />
        )}

        {currentPage === 'learn' && (
          <Learn
            selectedTopicId={selectedTopicId}
            onSelectTopic={(id) => setSelectedTopicId(id)}
            onOpenVisualizer={(id) => handleTopicSelection(id, 'visualizer')}
            onMarkCompleted={handleMarkTopicCompleted}
          />
        )}

        {currentPage === 'practice' && (
          <Practice
            progress={progress}
            selectedTopicId={selectedTopicId}
            onSelectTopic={(id) => setSelectedTopicId(id)}
            onAnswerQuestion={handleAnswerQuestion}
            onResetPractice={handleResetPractice}
          />
        )}
      </div>

      {/* 3. Progress Dashboard Modal */}
      <ProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        progress={progress}
        totalQuestions={QUESTIONS.length}
      />

      {/* 4. Clean Comic Footer (for non-home pages) */}
      {currentPage !== 'home' && (
        <footer className="border-t-2 border-black bg-white py-4 text-center text-xs">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-center">
            <div className="flex items-center gap-2 font-comic font-bold text-slate-800 text-[11px]">
              <span className="bg-[#FFE135] px-2 py-0.5 rounded border border-black">VISUALIZE</span>
              <span>→</span>
              <span className="bg-[#22C55E] text-white px-2 py-0.5 rounded border border-black">LEARN</span>
              <span>→</span>
              <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded border border-black">PRACTICE</span>
              <span>→</span>
              <span className="bg-black text-white px-2 py-0.5 rounded border border-black">MASTER</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
