import { useState, useEffect, useCallback } from 'react';
import { AppState, DEFAULT_CHORES } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'homechores_v3';
const DEFAULT_STATE: AppState = { chores: DEFAULT_CHORES, checks: {}, payments: [], nextId: 10 };

export function useAppState() {
  const [state, setStateRaw] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStateRaw({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch (_) {}
    setLoaded(true);
  }, []);

  const setState = useCallback((updater: (prev: AppState) => AppState) => {
    setStateRaw(prev => {
      const next = updater(prev);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, []);

  function choreKey(kid: string, choreId: string, date: string, instance = '') {
    return `${kid}|${choreId}|${date}|${instance}`;
  }
  function isDone(kid: string, choreId: string, date: string, instance = '') {
    return !!state.checks[choreKey(kid, choreId, date, instance)];
  }
  function toggleCheck(kid: string, choreId: string, date: string, instance = '') {
    const key = choreKey(kid, choreId, date, instance);
    setState(prev => {
      const checks = { ...prev.checks };
      if (checks[key]) delete checks[key]; else checks[key] = true;
      return { ...prev, checks };
    });
  }
  function kidChores(kid: string) {
    return state.chores.filter(c => c.kid === kid || c.kid === 'both');
  }
  function earnedOnDate(kid: string, date: string) {
    let total = 0;
    kidChores(kid).forEach(c => {
      if (c.freq === '3x daily') {
        ['m','a','e'].forEach(i => { if (isDone(kid, c.id, date, i)) total += c.payPerCompletion; });
      } else { if (isDone(kid, c.id, date)) total += c.payPerCompletion; }
    });
    return total;
  }
  function earnedThisWeek(kid: string) {
    const now = new Date();
    const start = new Date(now); start.setDate(now.getDate() - now.getDay());
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      total += earnedOnDate(kid, d.toISOString().split('T')[0]);
    }
    return total;
  }
  function paidOut(kid: string) {
    return state.payments.filter(p => p.kid === kid).reduce((a, p) => a + p.amount, 0);
  }
  function addPayment(kid: string, amount: number, note?: string) {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => ({ ...prev, payments: [...prev.payments, { id: uuidv4(), kid: kid as any, amount, date: today, note }] }));
  }
  function addChore(chore: Omit<AppState['chores'][0], 'id'>) {
    setState(prev => ({ ...prev, chores: [...prev.chores, { ...chore, id: uuidv4() }] }));
  }
  function removeChore(id: string) {
    setState(prev => ({ ...prev, chores: prev.chores.filter(c => c.id !== id) }));
  }
  function choreProgress(kid: string, date: string) {
    const chores = kidChores(kid);
    let done = 0, total = 0;
    chores.forEach(c => {
      if (c.freq === '3x daily') {
        total += 3; ['m','a','e'].forEach(i => { if (isDone(kid, c.id, date, i)) done++; });
      } else { total++; if (isDone(kid, c.id, date)) done++; }
    });
    return { done, total };
  }

  return { state, loaded, isDone, toggleCheck, kidChores, earnedOnDate, earnedThisWeek, paidOut, addPayment, addChore, removeChore, choreProgress };
}