import { GetStaticProps, GetStaticPaths } from 'next';
import { useState } from 'react';
import Layout from '../../components/Layout';
import TabBar from '../../components/TabBar';
import { Toast, useToast } from '../../components/Toast';
import { useAppState } from '../../lib/useAppState';
import { KIDS, KidId } from '../../lib/types';

const TABS = [
  { id:'today', label:'Today', icon:'✅' },
  { id:'week', label:'This week', icon:'📅' },
  { id:'earnings', label:'My $$$', icon:'💰' },
];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function KidPage({ kidId }: { kidId: KidId }) {
  const [tab, setTab] = useState('today');
  const app = useAppState();
  const toast = useToast();
  const kid = KIDS.find(k => k.id === kidId)!;
  if (!app.loaded || !kid) return null;
  const today = new Date().toISOString().split('T')[0];
  const { done, total } = app.choreProgress(kidId, today);
  return (
    <Layout title={kid.name} avatarLabel={kid.name[0]} avatarClass={`${kid.bg} ${kid.color}`}>
      <div className="mb-4">
        {done === total && total > 0 ? (
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="text-brand-800 font-medium text-sm">All done! Amazing work, {kid.name}!</span>
          </div>
        ) : done > 0 ? (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-xl">💪</span>
            <span className="text-amber-800 font-medium text-sm">Keep going! {total - done} more to go.</span>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-xl">👋</span>
            <span className="text-blue-800 font-medium text-sm">Hey {kid.name}! Let us get started.</span>
          </div>
        )}
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'today' && <TodayTab kidId={kidId} app={app} toast={toast} />}
      {tab === 'week' && <WeekTab kidId={kidId} app={app} />}
      {tab === 'earnings' && <EarningsTab kidId={kidId} app={app} />}
      <Toast msg={toast.msg} visible={toast.visible} />
    </Layout>
  );
}

function TodayTab({ kidId, app, toast }: { kidId: KidId; app: ReturnType<typeof useAppState>; toast: ReturnType<typeof useToast> }) {
  const today = new Date().toISOString().split('T')[0];
  const chores = app.kidChores(kidId);
  const earned = app.earnedOnDate(kidId, today);
  const { done, total } = app.choreProgress(kidId, today);
  const pct = total > 0 ? Math.round((done/total)*100) : 0;
  function toggle(choreId: string, instance = '') {
    const was = app.isDone(kidId, choreId, today, instance);
    app.toggleCheck(kidId, choreId, today, instance);
    if (!was) toast.show('Nice work! Keep it up!');
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{done}/{total}</div>
          <div className="text-xs text-gray-400 mt-1">chores done</div>
        </div>
        <div className="bg-brand-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-brand-600">${earned.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">earned today</div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{pct}%</span></div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-400 rounded-full transition-all duration-500" style={{ width:`${pct}%` }} />
        </div>
      </div>
      <div className="card space-y-1">
        {chores.map(chore => {
          const d = app.isDone(kidId, chore.id, today);
          return (
            <button key={chore.id} onClick={() => toggle(chore.id)}
              className={`w-full flex items-center gap-3 py-3 px-3 rounded-xl transition-all text-left ${d ? 'bg-brand-50' : 'hover:bg-gray-50'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${d ? 'bg-brand-400 border-brand-400' : 'border-gray-300'}`}>
                {d && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-xl">{chore.emoji}</span>
              <span className={`text-sm flex-1 ${d ? 'line-through text-gray-400' : 'text-gray-700'}`}>{chore.name}</span>
              <span className="text-sm font-semibold text-brand-600">${chore.payPerCompletion.toFixed(2)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekTab({ kidId, app }: { kidId: KidId; app: ReturnType<typeof useAppState> }) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const start = new Date(now); start.setDate(now.getDate() - now.getDay());
  const days = Array.from({ length:7 }, (_, i) => {
    const d = new Date(start); d.setDate(start.getDate()+i);
    const dk = d.toISOString().split('T')[0];
    const { done, total } = app.choreProgress(kidId, dk);
    return { date:d, dk, done, total, isToday: dk===today };
  });
  const weekTotal = days.reduce((a, d) => a + app.earnedOnDate(kidId, d.dk), 0);
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map(({ date, dk, done, total, isToday }) => {
            const cls = done===0 ? 'bg-gray-100 text-gray-400' : done===total ? 'bg-brand-400 text-white' : 'bg-brand-100 text-brand-600';
            return (
              <div key={dk} className="text-center">
                <div className="text-xs text-gray-400 mb-1">{DAYS[date.getDay()]}</div>
                <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center text-xs font-semibold ${cls} ${isToday ? 'ring-2 ring-brand-400 ring-offset-1' : ''}`}>{date.getDate()}</div>
                <div className="text-xs text-gray-400 mt-1">{done}/{total}</div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">Total earned this week</span>
          <span className="text-xl font-bold text-brand-600">${weekTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function EarningsTab({ kidId, app }: { kidId: KidId; app: ReturnType<typeof useAppState> }) {
  const wk = app.earnedThisWeek(kidId);
  const paid = app.paidOut(kidId);
  const pending = Math.max(0, wk - paid);
  const history = app.state.payments.filter(p => p.kid === kidId).slice(-8).reverse();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Earned this week', val:`$${wk.toFixed(2)}`, cls:'bg-gray-50' },
          { label:'Received so far', val:`$${paid.toFixed(2)}`, cls:'bg-gray-50' },
          { label:'Waiting for you', val:`$${pending.toFixed(2)}`, cls:'bg-brand-50' },
        ].map(s => (
          <div key={s.label} className={`${s.cls} rounded-xl p-3 text-center`}>
            <div className="text-xl font-bold text-gray-900">{s.val}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      {pending > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <div className="font-semibold text-brand-800">Payment pending!</div>
            <div className="text-sm text-brand-600">Ask a parent to pay you ${pending.toFixed(2)}</div>
          </div>
        </div>
      )}
      <div className="card">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Payment history</h3>
        {history.length === 0 ? <p className="text-sm text-gray-400">No payments yet!</p> : (
          <div className="space-y-2">
            {history.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm text-gray-700">{p.note || 'Payment'}</div>
                  <div className="text-xs text-gray-400">{p.date}</div>
                </div>
                <span className="bg-brand-50 text-brand-700 text-sm font-semibold px-3 py-1 rounded-lg">+${p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{ params:{ name:'liam' } }, { params:{ name:'sofia' } }],
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: { kidId: params!.name as KidId },
});