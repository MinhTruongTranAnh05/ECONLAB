import { useCallback, useEffect, useState } from 'react';
export type Progress = { completed: string[]; remembered: string[]; answers: Record<string, number>; essay: string; checklist: string[]; oralChecklist: string[]; exams: { score: number; total: number; date: string }[]; lastSection: string };
export const freshProgress = (): Progress => ({ completed: [], remembered: [], answers: {}, essay: '', checklist: [], oralChecklist: [], exams: [], lastSection: 'chuong-41' });
export function readProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem('econlab-progress-v1') || 'null');
    if (!p || typeof p !== 'object') return freshProgress();
    const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
    return { completed: strings(p.completed), remembered: strings(p.remembered), answers: Object.fromEntries(Object.entries(p.answers || {}).filter(([, v]) => Number.isInteger(v) && Number(v) >= 0 && Number(v) < 4)) as Record<string, number>, essay: typeof p.essay === 'string' ? p.essay : '', checklist: strings(p.checklist), oralChecklist: strings(p.oralChecklist), exams: Array.isArray(p.exams) ? p.exams.filter((x: Record<string, unknown>) => x && typeof x.score === 'number' && typeof x.total === 'number' && typeof x.date === 'string') : [], lastSection: typeof p.lastSection === 'string' ? p.lastSection : 'chuong-41' };
  } catch { return freshProgress(); }
}
export function useProgress() {
  const [progress, setProgress] = useState(readProgress);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem('econlab-progress-v1', JSON.stringify(progress)); setStorageError(false); } catch { setStorageError(true); }
  }, [progress]);
  const update = useCallback((fn: (p: Progress) => Progress) => setProgress(fn), []);
  return { progress, update, storageError };
}
export const toggleItem = (items: string[], id: string) => items.includes(id) ? items.filter(x => x !== id) : [...items, id];
