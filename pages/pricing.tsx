import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  async function checkout() {
    setLoading('pro');
    try {
      if (!user) { router.push('/login'); return; }
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro', email: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert('Error creating checkout'); setLoading(''); }
    } catch(e: any) {
      alert('Error: ' + e.message);
      setLoading('');
    }
  }

  return (
    <div style={{ fontFamily:'Inter,system-ui,sans-serif', minHeight:'100vh', background:'#F7F7F5' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #EBEBEB', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:24 }}>🏠</span>
          <span style={{ fontWeight:800, fontSize:18, color:'#0D1117' }}>Seru Chores</span>
        </div>
        <a href="/login" style={{ fontSize:14, color:'#1D9E75', fontWeight:600, textDecoration:'none' }}>Log in →</a>
      </div>
      <div style={{ background:'#0D1117', padding:'60px 24px 50px', textAlign:'center' }}>
        <div style={{ fontSize:13, color:'#1D9E75', fontWeight:700, letterSpacing:'2px', marginBottom:12, textTransform:'uppercase' as any }}>Simple pricing</div>
        <h1 style={{ fontSize:42, fontWeight:900, color:'#fff', marginBottom:12, letterSpacing:'-1px', lineHeight:1.1 }}>One plan. <span style={{ color:'#1D9E75' }}>Everything included.</span></h1>
        <p style={{ color:'#666', fontSize:16, lineHeight:1.6 }}>No tiers, no confusion. Get everything for one simple price.</p>
      </div>
      <div style={{ maxWidth:480, margin:'-32px auto 0', padding:'0 24px 80px' }}>
        <div style={{ background:'#fff', borderRadius:28, padding:40, border:'2px solid #1D9E75', boxShadow:'0 20px 60px rgba(0,0,0,.1)', position:'relative' as any }}>
          <div style={{ position:'absolute' as any, top:-16, left:'50%', transform:'translateX(-50%)', background:'#1D9E75', color:'#fff', fontSize:12, fontWeight:800, padding:'6px 20px', borderRadius:99, whiteSpace:'nowrap' as any }}>
            🎉 14 DAYS FREE — NO CARD NEEDED
          </div>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#888', textTransform:'uppercase' as any, letterSpacing:'2px', marginBottom:8 }}>Family Plan</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, justifyContent:'center', marginBottom:8 }}>
              <span style={{ fontSize:72, fontWeight:900, color:'#0D1117', lineHeight:1 }}>$4.99</span>
              <span style={{ fontSize:16, color:'#888' }}>/month</span>
            </div>
            <div style={{ fontSize:14, color:'#666' }}>after your 14-day free trial</div>
          </div>
          <div style={{ height:1, background:'#F0F0F0', marginBottom:24 }} />
          <div style={{ marginBottom:32 }}>
            {[
              {icon:'👨‍👩‍👧‍👦', text:'1 family account — unlimited use'},
              {icon:'👧', text:'Unlimited kids ages 6-17'},
              {icon:'📋', text:'Unlimited chores with search library'},
              {icon:'📸', text:'Photo proof with timestamp'},
              {icon:'✅', text:'Approve or reject chore photos'},
              {icon:'💵', text:'Weekly earnings tracking per kid'},
              {icon:'🏆', text:'Family leaderboard & competition'},
              {icon:'🎯', text:'Savings goals for kids'},
              {icon:'🤖', text:'AI weekly family report'},
              {icon:'📱', text:'PWA — installs like a real app'},
              {icon:'🌍', text:'Works worldwide on any phone'},
              {icon:'💳', text:'Pay kids with Greenlight, Venmo & more'},
            ].map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{f.icon}</div>
                <span style={{ fontSize:14, color:'#333', fontWeight:500 }}>{f.text}</span>
              </div>
            ))}
          </div>
          {!user && (
            <div style={{ background:'#FFF8E1', border:'1px solid #FFE082', borderRadius:12, padding:'12px 16px', marginBottom:16, textAlign:'center' }}>
              <span style={{ color:'#F57F17', fontSize:13, fontWeight:600 }}>⚠️ Please <a href="/login" style={{ color:'#1D9E75', fontWeight:700 }}>log in</a> first</span>
            </div>
          )}
          <button onClick={checkout} disabled={loading !== ''}
            style={{ width:'100%', background: loading ? '#ccc' : '#1D9E75', color:'#fff', border:'none', borderRadius:16, padding:'18px', fontSize:18, fontWeight:800, cursor: loading ? 'default' : 'pointer', marginBottom:12 }}>
            {loading ? 'Loading...' : 'Start free trial →'}
          </button>
          <p style={{ textAlign:'center', fontSize:12, color:'#888', marginTop:4, lineHeight:1.6 }}>14 days free · No card needed · Cancel anytime</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:24 }}>
          {[{icon:'🔒',text:'Secure payments via Stripe'},{icon:'❌',text:'Cancel anytime, no questions'},{icon:'🌍',text:'Works in any country'}].map((b,i) => (
            <div key={i} style={{ background:'#fff', borderRadius:14, padding:'14px 10px', textAlign:'center', border:'1px solid #EBEBEB' }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{b.icon}</div>
              <div style={{ fontSize:11, color:'#555', fontWeight:600, lineHeight:1.4 }}>{b.text}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:24, padding:'16px', background:'#0D1117', borderRadius:16 }}>
          <div style={{ fontSize:22, marginBottom:6 }}>🇪🇹</div>
          <div style={{ fontSize:13, color:'#9FE1CB', fontWeight:600 }}>Built by Chef Nek — an Ethiopian dad in Virginia</div>
          <div style={{ fontSize:11, color:'#555', marginTop:4 }}>ሥሩ — Make it happen · For families everywhere 🌍</div>
        </div>
      </div>
    </div>
  );
}