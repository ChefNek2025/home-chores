import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { supabase } from '../../lib/supabase';

export default function KidPage({ kidName }: { kidName: string }) {
  const router = useRouter();
  const [kid, setKid] = useState<any>(null);
  const [chores, setChores] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { load(); }, [kidName]);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data: kidData } = await supabase
      .from('kids')
      .select('*')
      .eq('family_id', user.id)
      .ilike('name', kidName)
      .single();

    if (!kidData) { setLoading(false); return; }
    setKid(kidData);

    const { data: choresData } = await supabase
      .from('chores')
      .select('*')
      .eq('family_id', user.id)
      .or('assign_to.eq.both,assign_to.eq.' + kidData.id);

    setChores(choresData || []);

    const { data: completionsData } = await supabase
      .from('completions')
      .select('*')
      .eq('kid_id', kidData.id)
      .eq('date', today);

    setCompletions(completionsData || []);
    setLoading(false);
  }

  async function toggleChore(chore: any) {
    if (!kid) return;
    const isDone = completions.some(c => c.chore_id === chore.id);

    if (isDone) {
      await supabase.from('completions').delete()
        .eq('chore_id', chore.id)
        .eq('kid_id', kid.id)
        .eq('date', today);
      setCompletions(completions.filter(c => c.chore_id !== chore.id));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('completions').insert({
        chore_id: chore.id,
        kid_id: kid.id,
        family_id: user!.id,
        date: today,
      }).select().single();
      if (data) setCompletions([...completions, data]);
      setMessage('Nice work! Keep it up! 💪');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  async function uploadPhoto(choreId: string, file: File) {
    try {
      // Upload original photo first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMessage('Please log in!'); return; }
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const chore = chores.find(c => c.id === choreId);
      const fileName = kid.id + '-' + choreId + '-' + Date.now() + '.jpg';
      const { error: uploadError } = await supabase.storage.from('chore-photos').upload(fileName, file);
      if (uploadError) { setMessage('Upload failed: ' + uploadError.message); return; }
      const { data: urlData } = supabase.storage.from('chore-photos').getPublicUrl(fileName);
      await supabase.from('chore_photos').insert({
        family_id: user.id,
        kid_id: kid.id,
        chore_id: choreId,
        photo_url: urlData.publicUrl,
        status: 'pending',
        date: today,
        notes: (chore?.name || 'Chore') + ' · ' + datePart + ' · ' + timePart,
      });
      setMessage('📸 Photo submitted! ' + datePart + ' ' + timePart);
      setTimeout(() => setMessage(''), 4000);
      return;
      // Canvas watermark below (kept for reference)
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const url = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const chore = chores.find(c => c.id === choreId);
      const watermark = (chore?.name || 'Chore') + ' · ' + datePart;
      const timeLine = timePart;
      const fontSize = Math.max(32, Math.round(img.width / 20));
      const barHeight = fontSize * 3.5;
      const padding = 20;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, img.height - barHeight, img.width, barHeight);
      ctx.fillStyle = '#1D9E75';
      ctx.font = 'bold ' + Math.round(fontSize * 0.65) + 'px Arial';
      ctx.fillText('✓ Seru Chores', padding, img.height - barHeight + fontSize * 0.9);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold ' + Math.round(fontSize * 0.85) + 'px Arial';
      ctx.fillText(watermark, padding, img.height - barHeight + fontSize * 1.9);
      ctx.fillStyle = '#FCDD09';
      ctx.font = 'bold ' + Math.round(fontSize * 0.85) + 'px Arial';
      ctx.fillText(timeLine, padding, img.height - barHeight + fontSize * 2.9);
      const blob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!), 'image/jpeg', 0.9));
      const stampedFile = new File([blob], file.name, { type: 'image/jpeg' });
      const fileName = kid.id + '-' + choreId + '-' + Date.now() + '.jpg';
      const { error: uploadError } = await supabase.storage.from('chore-photos').upload(fileName, stampedFile);
      if (uploadError) { setMessage('Upload failed!'); return; }
      const { data: urlData } = supabase.storage.from('chore-photos').getPublicUrl(fileName);
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('chore_photos').insert({
        family_id: user!.id,
        kid_id: kid.id,
        chore_id: choreId,
        photo_url: urlData.publicUrl,
        status: 'pending',
        date: today,
      });
      setMessage('📸 Photo submitted with timestamp!');
      setTimeout(() => setMessage(''), 3000);
    } catch(e: any) {
      setMessage('Error: ' + e.message);
    }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,system-ui,sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🏠</div>
        <p style={{ color:'#666' }}>Loading...</p>
      </div>
    </div>
  );

  if (!kid) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,system-ui,sans-serif', padding:24 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>😕</div>
        <h2 style={{ color:'#0D1117', marginBottom:8 }}>Kid not found</h2>
        <p style={{ color:'#666', marginBottom:16 }}>Make sure you're logged in and the name matches!</p>
        <a href="/login" style={{ background:'#1D9E75', color:'#fff', padding:'10px 24px', borderRadius:12, textDecoration:'none', fontWeight:700 }}>Log in</a>
      </div>
    </div>
  );

  const done = completions.length;
  const total = chores.length;
  const pct = total > 0 ? Math.round((done/total)*100) : 0;
  const earned = chores
    .filter(c => completions.some(comp => comp.chore_id === c.id))
    .reduce((a, c) => a + Number(c.pay_per_completion), 0);

  return (
    <div style={{ fontFamily:'Inter,system-ui,sans-serif', minHeight:'100vh', background:'#F7F7F5' }}>
      {/* Header */}
      <div style={{ background:'#0F6E56', padding:'16px 20px', color:'#fff' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18 }}>{kid.name[0]}</div>
            <div>
              <div style={{ fontWeight:800, fontSize:18 }}>Hey {kid.name}! 👋</div>
              <div style={{ fontSize:12, opacity:0.8 }}>{new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}</div>
            </div>
          </div>
          <a href="/dashboard" style={{ color:'rgba(255,255,255,0.7)', fontSize:13, textDecoration:'none' }}>Switch</a>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:13, opacity:0.8 }}>{done}/{total} chores done</span>
          <span style={{ fontSize:13, fontWeight:700 }}>${earned.toFixed(2)} earned</span>
        </div>
        <div style={{ background:'rgba(255,255,255,0.25)', borderRadius:99, height:8 }}>
          <div style={{ background:'#fff', borderRadius:99, height:8, width: pct + '%', transition:'width .5s' }} />
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div style={{ background:'#1D9E75', color:'#fff', padding:'12px 20px', textAlign:'center', fontWeight:600, fontSize:14 }}>
          {message}
        </div>
      )}

      {/* Status banner */}
      <div style={{ padding:'12px 16px' }}>
        {done === total && total > 0 ? (
          <div style={{ background:'#E1F5EE', border:'1px solid #9FE1CB', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>🎉</span>
            <span style={{ color:'#0F6E56', fontWeight:600, fontSize:14 }}>All done! Amazing work, {kid.name}!</span>
          </div>
        ) : done > 0 ? (
          <div style={{ background:'#FFF8E1', border:'1px solid #FFE082', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>💪</span>
            <span style={{ color:'#F57F17', fontWeight:600, fontSize:14 }}>Keep going! {total - done} more to go!</span>
          </div>
        ) : (
          <div style={{ background:'#E3F2FD', border:'1px solid #90CAF9', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>👋</span>
            <span style={{ color:'#1565C0', fontWeight:600, fontSize:14 }}>Let's get started, {kid.name}!</span>
          </div>
        )}
      </div>

      {/* Chores list */}
      <div style={{ padding:'0 16px 32px' }}>
        <div style={{ background:'#fff', borderRadius:20, border:'1px solid #EBEBEB', overflow:'hidden' }}>
          {chores.length === 0 ? (
            <div style={{ padding:32, textAlign:'center', color:'#888' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
              <p>No chores assigned yet! Ask a parent to add some.</p>
            </div>
          ) : chores.map((chore, i) => {
            const isDone = completions.some(c => c.chore_id === chore.id);
            return (
              <div key={chore.id} style={{ borderBottom: i < chores.length-1 ? '1px solid #F0F0F0' : 'none' }}>
                <button onClick={() => toggleChore(chore)}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background: isDone ? '#F0FBF7' : '#fff', border:'none', cursor:'pointer', textAlign:'left' }}>
                  <div style={{ width:24, height:24, borderRadius:'50%', border: isDone ? 'none' : '2px solid #CCC', background: isDone ? '#1D9E75' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {isDone && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
                  </div>
                  <span style={{ fontSize:22 }}>{chore.emoji}</span>
                  <span style={{ flex:1, fontSize:15, fontWeight:500, color: isDone ? '#888' : '#0D1117', textDecoration: isDone ? 'line-through' : 'none' }}>{chore.name}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'#1D9E75' }}>${Number(chore.pay_per_completion).toFixed(2)}</span>
                </button>
                {isDone && (
                  <label style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px 12px 56px', background:'#F0FBF7', cursor:'pointer', fontSize:13, color:'#0F6E56', fontWeight:600 }}>
                    📸 Add photo proof
                    <input type="file" accept="image/*" capture="environment" style={{ display:'none' }}
                      onChange={e => { if (e.target.files?.[0]) uploadPhoto(chore.id, e.target.files[0]); }} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  return { props: { kidName: context.params.name } };
};
