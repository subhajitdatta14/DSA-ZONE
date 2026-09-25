import React, { useState, useEffect, useRef } from 'react';
import { Code2, Play, Pause, Check, Copy, Terminal, Zap, ArrowRight } from 'lucide-react';
import { getDemonstrationCode, calculateActiveLine, CodeSnippet } from '../data/demonstrationCode';

interface LiveCodeDemonstratorProps {
  topicId: string;
  operation?: string;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  stepMessage?: string;
}

export const LiveCodeDemonstrator: React.FC<LiveCodeDemonstratorProps> = ({
  topicId,
  operation = 'insert',
  currentStepIndex,
  totalSteps,
  isPlaying,
  stepMessage,
}) => {
  const [language, setLanguage] = useState<'java' | 'cpp'>('java');
  const [copied, setCopied] = useState<boolean>(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const entry = getDemonstrationCode(topicId, operation);
  const snippet: CodeSnippet = language === 'java' ? entry.java : entry.cpp;

  // Calculate active line (1-indexed)
  const activeLine = calculateActiveLine(snippet, currentStepIndex, totalSteps, isPlaying);

  // Split lines
  const lines = snippet.code.split('\n');

  // Copy code handler
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll active line into view smoothly
  useEffect(() => {
    if (activeLineRef.current && codeContainerRef.current) {
      const container = codeContainerRef.current;
      const el = activeLineRef.current;
      const elTop = el.offsetTop;
      const elHeight = el.offsetHeight;
      const containerHeight = container.clientHeight;

      if (elTop < container.scrollTop || elTop + elHeight > container.scrollTop + containerHeight) {
        container.scrollTo({
          top: Math.max(0, elTop - containerHeight / 2 + elHeight / 2),
          behavior: 'smooth',
        });
      }
    }
  }, [activeLine]);

  // Syntax highlighting helper for dark background
  const highlightSyntax = (line: string) => {
    // Comments
    if (line.trim().startsWith('//')) {
      return <span className="text-slate-400 font-medium italic">{line}</span>;
    }

    // Keywords
    const keywords = [
      'public', 'private', 'protected', 'void', 'int', 'boolean', 'bool', 'char',
      'double', 'float', 'long', 'size_t', 'const', 'auto', 'new', 'delete',
      'class', 'struct', 'if', 'else', 'for', 'while', 'return', 'throw',
      'import', 'using', 'namespace', 'true', 'false', 'null', 'nullptr'
    ];

    // Standard types / classes
    const types = [
      'Node', 'TreeNode', 'Queue', 'Stack', 'List', 'ArrayList', 'LinkedList',
      'PriorityQueue', 'Arrays', 'Math', 'System', 'Comparator', 'Collections',
      'vector', 'string', 'queue', 'stack', 'priority_queue', 'pair', 'unordered_map'
    ];

    const tokens = line.split(/(\s+|[(),.;{}[\]+\-*/%<>=!&|:])/);

    return tokens.map((token, idx) => {
      if (keywords.includes(token)) {
        return <span key={idx} className="text-purple-400 font-bold">{token}</span>;
      }
      if (types.includes(token)) {
        return <span key={idx} className="text-amber-300 font-semibold">{token}</span>;
      }
      if (/^\d+$/.test(token)) {
        return <span key={idx} className="text-rose-300 font-medium">{token}</span>;
      }
      if (token.startsWith('"') || token.endsWith('"') || token.startsWith("'") || token.endsWith("'")) {
        return <span key={idx} className="text-emerald-300 font-medium">{token}</span>;
      }
      return <span key={idx} className="text-slate-200">{token}</span>;
    });
  };

  return (
    <div className="flex flex-col rounded-2xl border-2 border-black bg-white overflow-hidden shadow-[4px_4px_0px_#000]">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black bg-slate-900 px-3 sm:px-4 py-2.5 sm:py-3 text-white gap-2 sm:gap-3">
        {/* Left: Section Title & Live Status */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black bg-[#FFE135] text-black shadow-[1px_1px_0px_#000]">
            <Terminal className="h-4 w-4 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-comic text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">
                LIVE CODE DEMONSTRATION
              </span>
              {/* Status Badge */}
              {isPlaying ? (
                <span className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-black bg-[#22C55E] px-2 py-0.5 text-[9px] sm:text-[10px] font-comic font-black text-black animate-pulse shadow-[1px_1px_0px_#000] shrink-0">
                  <Play className="h-2.5 w-2.5 fill-black" />
                  <span>EXECUTING (Line {activeLine})</span>
                </span>
              ) : totalSteps > 0 && currentStepIndex >= totalSteps - 1 ? (
                <span className="flex items-center gap-1 rounded-full border border-black bg-[#FFE135] px-2 py-0.5 text-[9px] sm:text-[10px] font-comic font-bold text-black shadow-[1px_1px_0px_#000] shrink-0">
                  <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                  <span>COMPLETED</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[9px] sm:text-[10px] font-comic font-medium text-slate-300 shrink-0">
                  <Pause className="h-2.5 w-2.5" />
                  <span>READY</span>
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
              {entry.title}
            </p>
          </div>
        </div>

        {/* Right: Language Switcher Tabs & Copy Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Java / C++ Switcher */}
          <div className="flex items-center rounded-xl border border-black bg-slate-800 p-0.5 shadow-[1px_1px_0px_#000]">
            <button
              onClick={() => setLanguage('java')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-comic text-xs font-bold transition-all cursor-pointer ${
                language === 'java'
                  ? 'bg-[#FFE135] text-black shadow-[1px_1px_0px_#000]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Java</span>
            </button>
            <button
              onClick={() => setLanguage('cpp')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-comic text-xs font-bold transition-all cursor-pointer ${
                language === 'cpp'
                  ? 'bg-[#FFE135] text-black shadow-[1px_1px_0px_#000]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>C++</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-comic font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            title="Copy source code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[2.5]" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Window - Sleek Dark Background */}
      <div
        ref={codeContainerRef}
        className="relative max-h-64 sm:max-h-72 overflow-y-auto overflow-x-auto bg-[#181825] p-2.5 sm:p-3 font-mono text-xs sm:text-[13px] leading-relaxed select-text overscroll-contain touch-pan-x touch-pan-y"
      >
        <div className="min-w-full">
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === activeLine;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                className={`flex items-center gap-3 rounded px-2 py-0.5 transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#FFE135]/20 border-l-4 border-[#FFE135] text-white font-medium shadow-inner'
                    : 'border-l-4 border-transparent hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                {/* Line Number Gutter */}
                <div className="flex w-8 shrink-0 items-center justify-between text-right text-[11px] font-mono select-none">
                  {isActive ? (
                    <span className="text-[#FFE135] font-bold animate-pulse">▶</span>
                  ) : (
                    <span className="opacity-0">·</span>
                  )}
                  <span className={`${isActive ? 'text-[#FFE135] font-bold' : 'text-slate-500'}`}>
                    {lineNum}
                  </span>
                </div>

                {/* Line Content */}
                <div className="flex-1 overflow-x-auto whitespace-pre font-mono">
                  {highlightSyntax(lineText)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Live Execution Sync Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 border-t-2 border-black bg-[#FFFBEB] p-2.5 sm:px-4 sm:py-2.5 text-xs text-slate-900">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <Zap className="h-4 w-4 shrink-0 text-amber-600 stroke-[2.5]" />
          <span className="font-comic font-bold text-black uppercase text-[11px] sm:text-xs shrink-0">
            ACTIVE LINE {activeLine}:
          </span>
          <span className="font-mono text-slate-800 truncate min-w-0 text-[11px] sm:text-xs">
            {stepMessage || lines[activeLine - 1]?.trim() || 'Waiting for playback...'}
          </span>
        </div>

        {totalSteps > 0 && (
          <div className="flex items-center gap-1.5 shrink-0 font-comic font-bold text-[10px] sm:text-[11px] text-slate-600 self-end sm:self-auto">
            <span className="rounded bg-white px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
              Step {Math.min(currentStepIndex + 1, totalSteps)} / {totalSteps}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
