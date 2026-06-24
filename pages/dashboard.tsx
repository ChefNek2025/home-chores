import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [family, setFamily] = useState<any>(null);
  const [kids, setKids] = useState<any[]>([]);
  const [chores, setChores] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [newKidName, setNewKidName] = useState('');
  const [newKidAge, setNewKidAge] = useState('');
  const [newChoreName, setNewChoreName] = useState('');
  const [newChorePay, setNewChorePay] = useState('2.00');
  const [newChoreFreq, setNewChoreFreq] = useState('daily');
  const [newChoreKid, setNewChoreKid] = useState('both');
  const [newChoreEmoji, setNewChoreEmoji] = useState('🏠');
  const [choreSearch, setChoreSearch] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);

  const CHORE_EMOJIS = ['🧹','🍽️','🛏️','🗑️','🐕','🌀','🚿','👕','🌿','🐾','✨','🏠'];

  const CHORE_LIBRARY = [
    {name:'Wash dishes', emoji:'🍽️', pay:'2.00'},
    {name:'Make bed', emoji:'🛏️', pay:'1.00'},
    {name:'Vacuum floor', emoji:'🌀', pay:'2.00'},
    {name:'Take out trash', emoji:'🗑️', pay:'1.50'},
    {name:'Walk the dog', emoji:'🐕', pay:'2.00'},
    {name:'Clean bathroom', emoji:'🚿', pay:'3.00'},
    {name:'Do laundry', emoji:'👕', pay:'2.50'},
    {name:'Mop floor', emoji:'🧹', pay:'2.00'},
    {name:'Water plants', emoji:'🌿', pay:'1.00'},
    {name:'Clean windows', emoji:'✨', pay:'2.00'},
    {name:'Cook dinner', emoji:'🍳', pay:'3.00'},
    {name:'Set the table', emoji:'🍴', pay:'1.00'},
    {name:'Clear the table', emoji:'🥣', pay:'1.00'},
    {name:'Feed pets', emoji:'🐾', pay:'1.00'},
    {name:'Dust furniture', emoji:'🪣', pay:'1.50'},
    {name:'Clean kitchen', emoji:'🏠', pay:'3.00'},
    {name:'Rake leaves', emoji:'🍂', pay:'3.00'},
    {name:'Wash car', emoji:'🚗', pay:'5.00'},
    {name:'Organize room', emoji:'📦', pay:'2.00'},
    {name:'Grocery shopping', emoji:'🛒', pay:'3.00'},
    {name:'Iron clothes', emoji:'👔', pay:'2.00'},
    {name:'Clean fridge', emoji:'🧊', pay:'2.50'},
    {name:'Sweep porch', emoji:'🏡', pay:'1.50'},
    {name:'Wipe counters', emoji:'🧽', pay:'1.00'},
    {name:'Empty dishwasher', emoji:'♻️', pay:'1.50'},
    {name:'Take recycling out', emoji:'♻️', pay:'1.00'},
    {name:'Read for 30 mins', emoji:'📚', pay:'1.00'},
    {name:'Exercise 20 mins', emoji:'💪', pay:'2.00'},
    {name:'Clean microwave', emoji:'📱', pay:'1.50'},
    {name:'Shovel snow', emoji:'❄️', pay:'5.00'},
  ];

  const filteredLibrary = CHORE_LIBRARY.filter(c =>
    c.name.toLowerCase().includes(choreSearch.toLowerCase())
  );

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) { router.push('/login'); return; }
      const userId = authData.user.id;
      const { data: fam } = await supabase.from('families').select('*').eq('id', userId).single();
      if (!fam) { setLoading(false); return; }
      if (fam.plan === 'free') { router.push('/pricing'); return; }
      setFamily(fam);
      const { data: kidsData } = await supabase.from('kids').select('*').eq('family_id', userId);
      setKids(kidsData || []);
      const { data: choresData } = await supabase.from('chores').select('*').eq('family_id', userId);
      setChores(choresData || []);
      const { data: photosData } = await supabase.from('chore_photos').select('*').eq('family_id', userId).order('created_at', { ascending: false });
      setPhotos(photosData || []);
      setLoading(false);
    } catch(e) {
      console.error(e);
      setLoading(false);
    }
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
    setNewChoreName(''); setNewChorePay('2.00'); setChoreSearch('');
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
      <div style={{ background:'#fff', borderBottom:'1px solid #EBEBEB', padding:'0 24px', display:'flex', gap:4, overflowX:'auto' as any }}>
        {[
          {id:'overview', label:'📊 Overview'},
          {id:'kids', label:'👧 Kids'},
          {id:'chores', label:'📋 Chores'},
          {id:'earnings', label:'💵 Earnings'},
          {id:'leaderboard', label:'🏆 Leaderboard'},
          {id:'photos', label:'📸 Photos'},
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'14px 16px', fontSize:14, fontWeight:500, border:'none', background:'none', cursor:'pointer', borderBottom: tab===t.id ? '2px solid #1D9E75' : '2px solid transparent', color: tab===t.id ? '#1D9E75' : '#666', whiteSpace:'nowrap' as any }}>
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
                      <a href={'/kid/' + kid.name.toLowerCase()}
                        style={{ flex:1, background:'#E1F5EE', color:'#0F6E56', border:'none', borderRadius:10, padding:'8px', fontSize:13, fontWeight:600, cursor:'pointer', textAlign:'center', textDecoration:'none' }}>
                        📱 Kid view
                      </a>
                      <button onClick={() => navigator.clipboard.writeText(window.location.origin + '/kid/' + kid.name.toLowerCase())}
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
              <h3 style={{ fontSize:14, fontWeight:600, color:'#888', textTransform:'uppercase' as any, letterSpacing:'0.5px', marginBottom:16 }}>Add a kid</h3>
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

            {/* Search bar */}
            <div style={{ position:'relative', marginBottom:12 }}>
              <input
                value={choreSearch}
                onChange={e => { setChoreSearch(e.target.value); setShowLibrary(true); }}
                onFocus={() => setShowLibrary(true)}
                placeholder="🔍 Search chores or type your own..."
                style={{ width:'100%', border:'1.5px solid #1D9E75', borderRadius:14, padding:'12px 16px', fontSize:15, boxSizing:'border-box' as any, outline:'none' }}
              />
              {choreSearch && (
                <button onClick={() => { setChoreSearch(''); setShowLibrary(false); }}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontSize:18, cursor:'pointer', color:'#999' }}>
                  ✕
                </button>
              )}
            </div>

            {/* Chore library dropdown */}
            {showLibrary && (
              <div style={{ background:'#fff', borderRadius:16, border:'1px solid #EBEBEB', marginBottom:16, maxHeight:280, overflowY:'auto' as any, boxShadow:'0 4px 20px rgba(0,0,0,.08)' }}>
                <div style={{ padding:'10px 16px', borderBottom:'1px solid #F0F0F0', fontSize:12, fontWeight:700, color:'#888', textTransform:'uppercase' as any, letterSpacing:'0.5px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span>{choreSearch ? filteredLibrary.length + ' results' : 'Popular chores — tap to add'}</span>
                  <button onClick={() => setShowLibrary(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:16 }}>✕</button>
                </div>
                {filteredLibrary.map(chore => (
                  <div key={chore.name}
                    onClick={() => {
                      setNewChoreName(chore.name);
                      setNewChoreEmoji(chore.emoji);
                      setNewChorePay(chore.pay);
                      setChoreSearch(chore.name);
                      setShowLibrary(false);
                    }}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid #F7F7F5' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F0FBF7')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize:22 }}>{chore.emoji}</span>
                    <span style={{ flex:1, fontSize:14, fontWeight:500, color:'#0D1117' }}>{chore.name}</span>
                    <span style={{ fontSize:13, color:'#1D9E75', fontWeight:700 }}>${chore.pay}</span>
                    <span style={{ fontSize:12, color:'#999', background:'#F0F0F0', padding:'2px 8px', borderRadius:99 }}>+ Add</span>
                  </div>
                ))}
                {filteredLibrary.length === 0 && (
                  <div style={{ padding:20, textAlign:'center', color:'#888', fontSize:14 }}>
                    No matches — add "{choreSearch}" as a custom chore below!
                  </div>
                )}
              </div>
            )}

            {/* Add chore form */}
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:'#888', textTransform:'uppercase' as any, letterSpacing:'0.5px', marginBottom:16 }}>
                {newChoreName ? 'Customize & add' : 'Add a custom chore'}
              </h3>
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

            {/* Chores list */}
            {chores.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', border:'1px solid #EBEBEB', color:'#888' }}>
                No chores yet. Search above or add a custom chore!
              </div>
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
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:16 }}>Earnings & AI Report</h2>
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB', textAlign:'center', marginBottom:16 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>💵</div>
              <p style={{ color:'#666', fontSize:15, marginBottom:16 }}>Full earnings tracking coming next!</p>
            </div>
            <AIReport familyId={family?.id} />
          </div>
        )}

        {/* LEADERBOARD */}
        {tab === 'leaderboard' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:8 }}>🏆 Family Leaderboard</h2>
            <p style={{ fontSize:14, color:'#888', marginBottom:20 }}>Who is winning this week?</p>
            {kids.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', border:'1px solid #EBEBEB' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>👧</div>
                <p style={{ color:'#666' }}>Add kids first to see the leaderboard!</p>
                <button onClick={() => setTab('kids')} style={{ marginTop:16, background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>Add kids →</button>
              </div>
            ) : (
              <div style={{ display:'grid', gap:12 }}>
                {kids.map((kid, index) => {
                  const kidChores = chores.filter(c => c.assign_to === 'both' || c.assign_to === kid.id);
                  const totalPay = kidChores.reduce((a, c) => a + Number(c.pay_per_completion), 0);
                  const medals = ['🥇','🥈','🥉'];
                  return (
                    <div key={kid.id} style={{ background:'#fff', borderRadius:20, padding:24, border: index===0 ? '2px solid #FFD700' : '1px solid #EBEBEB', display:'flex', alignItems:'center', gap:16 }}>
                      <div style={{ fontSize:40 }}>{medals[index] || '🎖️'}</div>
                      <div style={{ width:48, height:48, borderRadius:14, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, color:'#0F6E56' }}>{kid.name[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:800, fontSize:18, color:'#0D1117' }}>{kid.name}</div>
                        <div style={{ fontSize:13, color:'#888', marginTop:2 }}>Age {kid.age} · {kidChores.length} chores assigned</div>
                        <div style={{ marginTop:8, height:8, background:'#F0F0F0', borderRadius:99, overflow:'hidden' }}>
                          <div style={{ height:'100%', background: index===0?'#FFD700':index===1?'#C0C0C0':'#1D9E75', borderRadius:99, width: Math.min(100, kidChores.length * 15) + '%', transition:'width .5s' }} />
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:24, fontWeight:800, color:'#1D9E75' }}>${totalPay.toFixed(2)}</div>
                        <div style={{ fontSize:12, color:'#888' }}>potential/day</div>
                      </div>
                    </div>
                  );
                })}
                <div style={{ background:'linear-gradient(135deg,#0D1117,#1a2332)', borderRadius:20, padding:24, textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🔥</div>
                  <div style={{ fontWeight:800, fontSize:16, color:'#fff', marginBottom:4 }}>Keep the streak going!</div>
                  <div style={{ fontSize:13, color:'#666' }}>Kids who complete all chores 7 days in a row earn a bonus badge</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHOTOS */}
        {tab === 'photos' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:8 }}>📸 Photo Proof</h2>
            <p style={{ fontSize:14, color:'#888', marginBottom:20 }}>Review and approve chore photos from your kids!</p>
            {photos.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', border:'1px solid #EBEBEB' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📸</div>
                <p style={{ color:'#666' }}>No photos yet! Kids submit photos after completing chores.</p>
              </div>
            ) : (
              <div style={{ display:'grid', gap:16 }}>
                {photos.map(photo => {
                  const kid = kids.find(k => k.id === photo.kid_id);
                  const chore = chores.find(c => c.id === photo.chore_id);
                  return (
                    <div key={photo.id} style={{ background:'#fff', borderRadius:20, padding:20, border: '2px solid ' + (photo.status==='approved'?'#1D9E75':photo.status==='rejected'?'#EF3340':'#EBEBEB') }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                        <div style={{ width:40, height:40, borderRadius:12, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:'#0F6E56' }}>{kid?.name?.[0] || '?'}</div>
                        <div>
                          <div style={{ fontWeight:700, color:'#0D1117' }}>{kid?.name || 'Kid'}</div>
                          <div style={{ fontSize:13, color:'#888' }}>{chore?.emoji} {chore?.name || 'Chore'} · {new Date(photo.created_at).toLocaleString('en-US', {month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true,timeZone:'America/New_York'})}</div>
                        </div>
                        <div style={{ marginLeft:'auto', fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:99, background: photo.status==='approved'?'#E1F5EE':photo.status==='rejected'?'#FFF0F0':'#F7F7F5', color: photo.status==='approved'?'#0F6E56':photo.status==='rejected'?'#C00':'#888' }}>
                          {photo.status==='approved'?'✅ Approved':photo.status==='rejected'?'❌ Rejected':'⏳ Pending'}
                        </div>
                      </div>
                      <img src={photo.photo_url} alt="Chore proof" style={{ width:'100%', maxHeight:300, objectFit:'cover' as any, borderRadius:12, marginBottom:12 }} />
                      {photo.status === 'pending' && (
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={async () => {
                            await supabase.from('chore_photos').update({ status:'approved' }).eq('id', photo.id);
                            setPhotos(photos.map(p => p.id===photo.id ? {...p, status:'approved'} : p));
                          }} style={{ flex:1, background:'#1D9E75', color:'#fff', border:'none', borderRadius:10, padding:'10px', fontWeight:700, cursor:'pointer' }}>✅ Approve</button>
                          <button onClick={async () => {
                            await supabase.from('chore_photos').update({ status:'rejected' }).eq('id', photo.id);
                            setPhotos(photos.map(p => p.id===photo.id ? {...p, status:'rejected'} : p));
                          }} style={{ flex:1, background:'#FFF0F0', color:'#C00', border:'1px solid #FFD0D0', borderRadius:10, padding:'10px', fontWeight:700, cursor:'pointer' }}>❌ Reject</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function AIReport({ familyId }: { familyId: string }) {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateReport() {
    setLoading(true);
    try {
      const res = await fetch('/api/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId }),
      });
      const data = await res.json();
      if (data.report) setReport(data.report);
      else setReport('Could not generate report. Please try again.');
    } catch(e) {
      setReport('Error generating report.');
    }
    setLoading(false);
  }

  return (
    <div style={{ background:'linear-gradient(135deg,#0D1117,#1a2332)', borderRadius:20, padding:24, border:'1px solid #1D9E75' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
        <div style={{ fontSize:32 }}>🤖</div>
        <div>
          <div style={{ fontWeight:800, fontSize:16, color:'#fff' }}>AI Weekly Report</div>
          <div style={{ fontSize:13, color:'#666' }}>Powered by Claude AI</div>
        </div>
      </div>
      {report ? (
        <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:14, padding:20, marginBottom:16 }}>
          <p style={{ color:'#C9D1D9', fontSize:14, lineHeight:1.8, whiteSpace:'pre-wrap' as any }}>{report}</p>
        </div>
      ) : (
        <p style={{ color:'#666', fontSize:14, marginBottom:16, lineHeight:1.6 }}>
          Generate a personalized AI report about your family's chore progress, earnings, and achievements this week!
        </p>
      )}
      <button onClick={generateReport} disabled={loading}
        style={{ width:'100%', background: loading ? '#333' : '#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'12px', fontSize:14, fontWeight:700, cursor: loading ? 'default' : 'pointer' }}>
        {loading ? '🤖 Generating report...' : '✨ Generate AI Report'}
      </button>
    </div>
  );
}
