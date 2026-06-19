import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'begnakitchen2025@gmail.com'; // Change this to YOUR email!

export default function AdminPortal() {
  const router = useRouter();
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, free: 0, paid: 0 });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/');
        return;
      }
      const { data } = await supabase.from('families').select('*').order('created_at', { ascending: false });
      const fams = data || [];
      setFamilies(fams);
      setStats({
        total: fams.length,
        free: fams.filter(f => f.plan === 'free').length,
        paid: fams.filter(f => f.plan !== 'free').length,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,system-ui,sans-serif' }}>
      <p>Loading admin panel...</p>
    </div>
  );

  return (
    <div style={{ fontFamily:'Inter,system-ui,sans-serif', minHeight:'100vh', background:'#F7F7F5' }}>
      {/* Header */}
      <div style={{ background:'#0D1117', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:20 }}>🛡️</span>
          <span style={{ fontWeight:800, fontSize:16, color:'#fff' }}>Seru Chores — Admin</span>
        </div>
        <span style={{ fontSize:13, color:'#666' }}>Secret admin panel</span>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 24px' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
          {[
            { label:'Total families', val:stats.total, icon:'👨‍👩‍👧', color:'#0D1117' },
            { label:'Free trial', val:stats.free, icon:'🆓', color:'#666' },
            { label:'Paying customers', val:stats.paid, icon:'💰', color:'#1D9E75' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:16, padding:24, border:'1px solid #EBEBEB', textAlign:'center' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:36, fontWeight:800, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:13, color:'#888', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue estimate */}
        <div style={{ background:'#0D1117', borderRadius:16, padding:24, marginBottom:32, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:13, color:'#666', marginBottom:4 }}>Estimated monthly revenue</div>
            <div style={{ fontSize:36, fontWeight:800, color:'#1D9E75' }}>${(stats.paid * 1.99).toFixed(2)}</div>
            <div style={{ fontSize:12, color:'#555', marginTop:4 }}>Based on {stats.paid} paying customers at $1.99/mo</div>
          </div>
          <div style={{ fontSize:48 }}>📈</div>
        </div>

        {/* Families list */}
        <div style={{ background:'#fff', borderRadius:20, border:'1px solid #EBEBEB', overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #EBEBEB', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#0D1117' }}>All families ({families.length})</h2>
          </div>
          {families.length === 0 ? (
            <div style={{ padding:32, textAlign:'center', color:'#888' }}>No families signed up yet.</div>
          ) : (
            <div>
              {/* Table header */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', padding:'12px 24px', background:'#F7F7F5', fontSize:12, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                <span>Family name</span>
                <span>Email</span>
                <span>Plan</span>
                <span>Joined</span>
              </div>
              {families.map((f, i) => (
                <div key={f.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', padding:'16px 24px', borderTop:'1px solid #F0F0F0', alignItems:'center', background: i%2===0 ? '#fff' : '#FAFAF8' }}>
                  <span style={{ fontWeight:600, color:'#0D1117' }}>{f.name}</span>
                  <span style={{ fontSize:13, color:'#666' }}>{f.email}</span>
                  <span>
                    <span style={{ background: f.plan==='free' ? '#F0F0F0' : '#E1F5EE', color: f.plan==='free' ? '#666' : '#0F6E56', fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:99 }}>
                      {f.plan === 'free' ? '🆓 Free' : '⭐ Pro'}
                    </span>
                  </span>
                  <span style={{ fontSize:13, color:'#888' }}>{new Date(f.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}