import { useState } from 'react';
import Layout from '../components/Layout';
import TabBar from '../components/TabBar';
import { Toast, useToast } from '../components/Toast';
import { useAppState } from '../lib/useAppState';
import { KIDS, CHORE_SUGGESTIONS, Chore } from '../lib/types';

const TABS = [
  { id:'overview', label:'Overview', icon:'📊' },
  { id:'earnings', label:'Earnings', icon:'💵' },
  { id:'manage',   label:'Manage',   icon:'⚙️' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const app = useAppState();
  const toast = useToast();
  if (!app.loaded) return null;
  return (
    <Layout title="Admin Dashboard" avatarLabel="🛡️" avatarClass="bg-purple-100 text-purple-800">
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'overview' && <Overview app={app} />}
      {tab === 'earnings' && <Earnings app={app} toast={toast} />}
      {tab === 'manage'   && <Manage   app={app} toast={toast} />}
      <Toast msg={toast.msg} visible={toast.visible} />
    </Layout>
  );
}

function Overview({ app }: { app: ReturnType<typeof useAppState> }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="space-y-4">
      {KIDS.map(kid => {
        const { done, total } = app.choreProgress(kid.id, today);
        const pct = total > 0 ? Math.round((done/total)*100) : 0;
        const wkEarn = app.earnedThisWeek(kid.id);
        return (
          <div key={kid.id} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${kid.bg} ${kid.color} flex items-center justify-center font-bold text-lg`}>{kid.name[0]}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{kid.name} · Age {kid.age}</div>
                <div className="text-sm text-gray-500">{done}/{total} chores done today</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-brand-600">${wkEarn.toFixed(2)}</div>
                <div className="text-xs text-gray-400">this week</div>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-400 rounded-full transition-all duration-500" style={{ width:`${pct}%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">{pct}% complete</div>
          </div>
        );
      })}
      <div className="card">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Today's chores</h3>
        <div className="space-y-1">
          {app.state.chores.map(chore => {
            const targetKids = chore.kid === 'both' ? KIDS : KIDS.filter(k => k.id === chore.kid);
            return targetKids.map(kid => {
              const done = app.isDone(kid.id, chore.id, today);
              return (
                <div key={kid.id+chore.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${done ? 'bg-brand-400 text-white' : 'bg-gray-100 text-gray-300'}`}>{done ? '✓' : '○'}</span>
                  <span className="text-sm flex-1">{chore.emoji} {chore.name}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${kid.bg} ${kid.color}`}>{kid.name}</span>
                  <span className="text-sm font-medium text-brand-600">${chore.payPerCompletion.toFixed(2)}</span>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}

function Earnings({ app, toast }: { app: ReturnType<typeof useAppState>; toast: ReturnType<typeof useToast> }) {
  function pay(kid: typeof KIDS[0]) {
    const due = Math.max(0, app.earnedThisWeek(kid.id) - app.paidOut(kid.id));
    if (due <= 0) return;
    app.addPayment(kid.id, due, 'Weekly pay');
    toast.show(`✅ Paid $${due.toFixed(2)} to ${kid.name}!`);
  }
  return (
    <div className="space-y-4">
      {KIDS.map(kid => {
        const wk = app.earnedThisWeek(kid.id);
        const paid = app.paidOut(kid.id);
        const due = Math.max(0, wk - paid);
        const history = app.state.payments.filter(p => p.kid === kid.id).slice(-5).reverse();
        return (
          <div key={kid.id} className="card space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${kid.bg} ${kid.color} flex items-center justify-center font-bold text-lg`}>{kid.name[0]}</div>
              <div className="font-semibold text-gray-900 text-lg">{kid.name}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{label:'Earned this week',val:`$${wk.toFixed(2)}`},{label:'Paid out',val:`$${paid.toFixed(2)}`},{label:'Due now',val:`$${due.toFixed(2)}`,hi:due>0}].map(s=>(
                <div key={s.label} className={`rounded-xl p-3 text-center ${(s as any).hi?'bg-brand-50':'bg-gray-50'}`}>
                  <div className={`text-lg font-bold ${(s as any).hi?'text-brand-600':'text-gray-900'}`}>{s.val}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => pay(kid)} disabled={due<=0} className="btn-primary w-full py-3 text-base">
              {due>0?`💸 Pay $${due.toFixed(2)} to ${kid.name}`:`✓ ${kid.name} is all paid up`}
            </button>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Payment history</div>
              {history.length===0?<p className="text-sm text-gray-400">No payments yet.</p>:(
                <div className="space-y-1">
                  {history.map(p=>(
                    <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{p.date}</span>
                      <span className="text-sm font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">${p.amount.toFixed(2)} paid</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Manage({ app, toast }: { app: ReturnType<typeof useAppState>; toast: ReturnType<typeof useToast> }) {
  const [name, setName] = useState('');
  const [kid, setKid] = useState<'both'|'liam'|'sofia'>('both');
  const [pay, setPay] = useState('2.00');
  const [freq, setFreq] = useState<Chore['freq']>('daily');
  const [emoji, setEmoji] = useState('🏠');

  function handleAdd() {
    if (!name.trim()) return;
    app.addChore({ name:name.trim(), kid, payPerCompletion:parseFloat(pay)||1, freq, emoji });
    setName(''); setPay('2.00');
    toast.show('✅ Chore added!');
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Add a chore</h3>
        <div className="flex flex-wrap gap-1.5">
          {CHORE_SUGGESTIONS.map(s=>(
            <button key={s.name} onClick={()=>{setName(s.name);setEmoji(s.emoji);}}
              className="text-xs bg-gray-100 hover:bg-brand-50 hover:text-brand-600 px-2.5 py-1 rounded-lg transition-colors">
              {s.emoji} {s.name}
            </button>
          ))}
        </div>
        <div><label className="block text-xs text-gray-500 mb-1">Chore name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Clean bathroom" /></div>
        <div className="grid grid-cols-3 gap-2">
          <div><label className="block text-xs text-gray-500 mb-1">Assign to</label>
            <select className="input" value={kid} onChange={e=>setKid(e.target.value as any)}>
              <option value="both">Both</option><option value="liam">Liam</option><option value="sofia">Sofia</option>
            </select></div>
          <div><label className="block text-xs text-gray-500 mb-1">Pay ($)</label>
            <input className="input" type="number" step="0.50" min="0" value={pay} onChange={e=>setPay(e.target.value)} /></div>
          <div><label className="block text-xs text-gray-500 mb-1">Frequency</label>
            <select className="input" value={freq} onChange={e=>setFreq(e.target.value as any)}>
              <option value="daily">Daily</option><option value="3x daily">3x daily</option><option value="weekly">Weekly</option>
            </select></div>
        </div>
        <button onClick={handleAdd} className="btn-primary w-full py-2.5">+ Add chore</button>
      </div>
      <div className="card">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Current chores ({app.state.chores.length})</h3>
        {app.state.chores.length===0?<p className="text-sm text-gray-400">No chores yet.</p>:(
          <div className="space-y-1">
            {app.state.chores.map(c=>{
              const kidInfo=c.kid==='both'?null:KIDS.find(k=>k.id===c.kid);
              return(
                <div key={c.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-lg">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-gray-400">{c.freq}</span>
                      {kidInfo?<span className={`badge ${kidInfo.bg} ${kidInfo.color}`}>{kidInfo.name}</span>
                        :<span className="badge bg-gray-100 text-gray-600">Both</span>}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-brand-600">${c.payPerCompletion.toFixed(2)}</span>
                  <button onClick={()=>app.removeChore(c.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}