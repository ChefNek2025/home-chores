import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [family, setFamily] = useState<any>(null);
  const [kids, setKids] = useState<any[]>([]);
  const [chores, setChores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [newKidName, setNewKidName] = useState('');
  const [newKidAge, setNewKidAge] = useState('');
  const [newChoreName, setNewChoreName] = useState('');
  const [newChorePay, setNewChorePay] = useState('2.00');
  const [newChoreFreq, setNewChoreFreq] = useState('daily');
  const [newChoreKid, setNewChoreKid] = useState('both');
  const [newChoreEmoji, setNewChoreEmoji] = useState('🏠');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const { data: fam } = await supabase.from('families').select('*').eq('id', user.id).single();
    setFamily(fam);
    const { data: kidsData } = await supabase.from('kids').select('*').eq('family_id', user.id);
    setKids(kidsData || []);
    const { data: choresData } = await supabase.from('chores').select('*').eq('family_id', user.id);
    setChores(choresData || []);
    setLoading(false);
  }

  async function addKid() {
    if (!newKidName.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('kids').insert({
      family_id: user!.id,
      name: newKidName.trim(),
      age: parseInt(newKidAge) || 6,
    }).select().single();
    if (data) setKids([...kids, data]);
    setNewKidName(''); setNewKidAge('');
  }

  async function removeKid(id: string) {
    await supabase.from('kids').delete().eq('id', id);
    setKids(kids.filter(k => k.id !== id));
  }

  async function addChore() {
    if (!newChoreName.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('chores').insert({
      family_id: user!.id,
      name: newChoreName.trim(),
      emoji: newChoreEmoji,
      pay_per_completion: parseFloat(newChorePay) || 1,
      freq: newChoreFreq,
      assign_to: newChoreKid,
    }).select().single();
    if (data) setChores([...chores, data]);
    setNewChoreName(''); setNewChorePay('2.00');
  }

  async function removeChore(id: string) {
    await supabase.from('chores').delete().eq('id', id);
    setChores(chores.filter(c => c.id !== id));
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,system-ui,sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🏠</div>
        <p style={{ color:'#666' }}>Loading Seru Chores...</p>
      </div>
    </div>
  );

  const CHORE_EMOJIS = ['🧹','🍽️','🛏️','🗑️','🐕','🌀','🚿','👕','🌿','🐾','✨','🏠'];

  return (
    <div style={{ fontFamily:'Inter,system-ui,sans-serif', minHeight:'100vh', background:'#F7F7F5' }}>
      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #EBEBEB', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:24 }}>🏠</span>
          <span style={{ fontWeight:800, fontSize:18, color:'#0D1117' }}>Seru Chores</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:14, color:'#666' }}>{family?.name}</span>
          <button onClick={logout} style={{ background:'none', border:'1px solid #E0E0E0', borderRadius:8, padding:'6px 14px', fontSize:13, cursor:'pointer', color:'#666' }}>Log out</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:'#fff', borderBottom:'1px solid #EBEBEB', padding:'0 24px', display:'flex', gap:4 }}>
        {[{id:'overview',label:'📊 Overview'},{id:'kids',label:'👧 Kids'},{id:'chores',label:'📋 Chores'},{id:'earnings',label:'💵 Earnings'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'14px 16px', fontSize:14, fontWeight:500, border:'none', background:'none', cursor:'pointer', borderBottom: tab===t.id ? '2px solid #1D9E75' : '2px solid transparent', color: tab===t.id ? '#1D9E75' : '#666' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 16px' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:16 }}>Today's overview</h2>
            {kids.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', border:'1px solid #EBEBEB' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>👧</div>
                <p style={{ color:'#666', marginBottom:16 }}>No kids added yet! Go to the Kids tab to add your children.</p>
                <button onClick={() => setTab('kids')} style={{ background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>Add kids →</button>
              </div>
            ) : (
              <div style={{ display:'grid', gap:16 }}>
                {kids.map(kid => (
                  <div key={kid.id} style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                      <div style={{ width:44, height:44, borderRadius:14, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18, color:'#0F6E56' }}>{kid.name[0]}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:16, color:'#0D1117' }}>{kid.name}</div>
                        <div style={{ fontSize:13, color:'#888' }}>Age {kid.age}</div>
                      </div>
                      <div style={{ marginLeft:'auto', textAlign:'right' }}>
                        <div style={{ fontSize:20, fontWeight:800, color:'#1D9E75' }}>
                          {chores.filter(c => c.assign_to === 'both' || c.assign_to === kid.id).length} chores
                        </div>
                        <div style={{ fontSize:12, color:'#888' }}>assigned</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <a href={`/kid/${kid.name.toLowerCase()}`}
                        style={{ flex:1, background:'#E1F5EE', color:'#0F6E56', border:'none', borderRadius:10, padding:'8px', fontSize:13, fontWeight:600, cursor:'pointer', textAlign:'center', textDecoration:'none' }}>
                        📱 Kid view
                      </a>
                      <button
                        onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/kid/${kid.name.toLowerCase()}`)}}
                        style={{ flex:1, background:'#F7F7F5', color:'#333', border:'1px solid #E0E0E0', borderRadius:10, padding:'8px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                        📋 Copy link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* KIDS */}
        {tab === 'kids' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:16 }}>Your kids</h2>
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:16 }}>Add a kid</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div>
                  <label style={{ fontSize:13, color:'#555', display:'block', marginBottom:6 }}>Name</label>
                  <input value={newKidName} onChange={e => setNewKidName(e.target.value)} placeholder="e.g. Liam"
                    style={{ width:'100%', border:'1.5px solid #E0E0E0', borderRadius:10, padding:'9px 12px', fontSize:14, boxSizing:'border-box' as any }} />
                </div>
                <div>
                  <label style={{ fontSize:13, color:'#555', display:'block', marginBottom:6 }}>Age (6-17)</label>
                  <input value={newKidAge} onChange={e => setNewKidAge(e.target.value)} placeholder="e.g. 6" type="number" min="6" max="17"
                    style={{ width:'100%', border:'1.5px solid #E0E0E0', borderRadius:10, padding:'9px 12px', fontSize:14, boxSizing:'border-box' as any }} />
                </div>
              </div>
              <button onClick={addKid} style={{ width:'100%', background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add kid</button>
            </div>
            {kids.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', border:'1px solid #EBEBEB', color:'#888' }}>No kids added yet.</div>
            ) : (
              <div style={{ display:'grid', gap:10 }}>
                {kids.map(kid => (
                  <div key={kid.id} style={{ background:'#fff', borderRadius:16, padding:'16px 20px', border:'1px solid #EBEBEB', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:'#0F6E56' }}>{kid.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, color:'#0D1117' }}>{kid.name}</div>
                      <div style={{ fontSize:13, color:'#888' }}>Age {kid.age}</div>
                    </div>
                    <button onClick={() => removeKid(kid.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18 }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHORES */}
        {tab === 'chores' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:16 }}>Chores</h2>
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:16 }}>Add a chore</h3>
              <div style={{ display:'flex', flexWrap:'wrap' as any, gap:8, marginBottom:12 }}>
                {CHORE_EMOJIS.map(e => (
                  <button key={e} onClick={() => setNewChoreEmoji(e)}
                    style={{ width:36, height:36, borderRadius:8, border: newChoreEmoji===e ? '2px solid #1D9E75' : '1px solid #E0E0E0', background: newChoreEmoji===e ? '#E1F5EE' : '#fff', fontSize:18, cursor:'pointer' }}>
                    {e}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:13, color:'#555', display:'block', marginBottom:6 }}>Chore name</label>
                <input value={newChoreName} onChange={e => setNewChoreName(e.target.value)} placeholder="e.g. Wash dishes"
                  style={{ width:'100%', border:'1.5px solid #E0E0E0', borderRadius:10, padding:'9px 12px', fontSize:14, boxSizing:'border-box' as any }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                <div>
                  <label style={{ fontSize:13, color:'#555', display:'block', marginBottom:6 }}>Pay ($)</label>
                  <input value={newChorePay} onChange={e => setNewChorePay(e.target.value)} type="number" step="0.50"
                    style={{ width:'100%', border:'1.5px solid #E0E0E0', borderRadius:10, padding:'9px 12px', fontSize:14, boxSizing:'border-box' as any }} />
                </div>
                <div>
                  <label style={{ fontSize:13, color:'#555', display:'block', marginBottom:6 }}>Frequency</label>
                  <select value={newChoreFreq} onChange={e => setNewChoreFreq(e.target.value)}
                    style={{ width:'100%', border:'1.5px solid #E0E0E0', borderRadius:10, padding:'9px 12px', fontSize:14, boxSizing:'border-box' as any }}>
                    <option value="daily">Daily</option>
                    <option value="3x daily">3x daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:13, color:'#555', display:'block', marginBottom:6 }}>Assign to</label>
                  <select value={newChoreKid} onChange={e => setNewChoreKid(e.target.value)}
                    style={{ width:'100%', border:'1.5px solid #E0E0E0', borderRadius:10, padding:'9px 12px', fontSize:14, boxSizing:'border-box' as any }}>
                    <option value="both">Both</option>
                    {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={addChore} style={{ width:'100%', background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add chore</button>
            </div>
            {chores.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', border:'1px solid #EBEBEB', color:'#888' }}>No chores yet.</div>
            ) : (
              <div style={{ display:'grid', gap:8 }}>
                {chores.map(c => (
                  <div key={c.id} style={{ background:'#fff', borderRadius:14, padding:'14px 18px', border:'1px solid #EBEBEB', display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontSize:22 }}>{c.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, color:'#0D1117' }}>{c.name}</div>
                      <div style={{ fontSize:12, color:'#888' }}>{c.freq} · ${c.pay_per_completion}</div>
                    </div>
                    <button onClick={() => removeChore(c.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16 }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EARNINGS */}
        {tab === 'earnings' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:16 }}>Earnings</h2>
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB', textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>💵</div>
              <p style={{ color:'#666', fontSize:15 }}>Full earnings tracking coming next! For now use the app to track payments.</p>
              <a href="/app" style={{ display:'inline-block', marginTop:16, background:'#1D9E75', color:'#fff', borderRadius:12, padding:'10px 24px', fontWeight:700, textDecoration:'none' }}>Go to app →</a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}