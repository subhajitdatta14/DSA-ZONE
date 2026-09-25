export function getComplexityColor(notation: string): {
  text: string;
  bg: string;
  border: string;
  level: string;
} {
  const clean = notation.trim();
  if (clean.includes('O(1)')) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/30',
      level: 'Constant (Optimal)',
    };
  }
  if (clean.includes('O(log n)')) {
    return {
      text: 'text-cyan-400',
      bg: 'bg-cyan-950/40',
      border: 'border-cyan-500/30',
      level: 'Logarithmic (Fast)',
    };
  }
  if (clean.includes('O(n log n)')) {
    return {
      text: 'text-indigo-400',
      bg: 'bg-indigo-950/40',
      border: 'border-indigo-500/30',
      level: 'Linearithmic (Fair)',
    };
  }
  if (clean.includes('O(n)') && !clean.includes('O(n²)')) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/30',
      level: 'Linear (Moderate)',
    };
  }
  if (clean.includes('O(n²)') || clean.includes('O(2^n)') || clean.includes('O(n!)')) {
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/30',
      level: 'Quadratic / Exponential (Heavy)',
    };
  }
  return {
    text: 'text-slate-300',
    bg: 'bg-slate-900',
    border: 'border-slate-700/50',
    level: 'Variable',
  };
}
