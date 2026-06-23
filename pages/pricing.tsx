import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      console.log('Session user:', session?.user?.email);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      console.log('Auth change:', session?.user?.email);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkout(priceId: string, plan: string) {
    setLoading(plan);
    console.log('Current user:', user);
    
    if (!user) {
      alert('You are not logged in! Please log in first.');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email: user.email }),
      });
      const data = await res.json();
      console.log('Stripe response:', data);
      if (data.url) {
        window.open(data.url, '_self');
      } else {
        alert('Stripe error: ' + JSON.stringify(data));
        setLoading('');
      }
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
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {user ? (
            <span style={{ fontSize:13, color:'#666' }}>✅ {user.email}</span>
          ) : (
            <button onClick={() => router.push('/login')}
              style={{ background:'#1D9E75', color:'#fff', border:'none', borderRadius:10, padding:'8px 18px', fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Log in
            </button>
          )}
        </div>
      </div>

      <div style={{ textAlign:'center', padding:'56px 24px 40px' }}>
        <h1 style={{ fontSize:'clamp(28px,5vw,44px)', fontWeight:800, color:'#0D1117', letterSpacing:'-1.5px', marginBottom:12 }}>
          Simple, honest pricing
        </h1>
        <p style={{ fontSize:17, color:'#666' }}>14 days free · Cancel anytime · No hidden fees</p>
        {!user && (
          <div style={{ marginTop:16, background:'#FFF0F0', border:'1px solid #FFD0D0', borderRadius:12, padding:'12px 20px', display:'inline-block' }}>
            <span style={{ color:'#C00', fontSize:14, fontWeight:600 }}>⚠️ Please log in before subscribing</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'0 24px 80px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
        <div style={{ background:'#fff', borderRadius:24, padding:32, border:'1.5px solid #EBEBEB' }}>
          <div style={{ fontWeight:800, fontSize:18, color:'#0D1117', marginBottom:4 }}>Starter</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:8 }}>
            <span style={{ fontSize:42, fontWeight:800, color:'#0D1117' }}>$1.99</span>
            <span style={{ fontSize:14, color:'#888' }}>/month</span>
          </div>
          <div style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:99, display:'inline-block', marginBottom:20 }}>
            14 days free trial
          </div>
          <ul style={{ listStyle:'none', marginBottom:28 }}>
            {['1 family account','Up to 4 kids ages 6-17','Unlimited chores','Weekly pay tracking','Works on any phone'].map(f => (
              <li key={f} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', fontSize:14, color:'#444' }}>
                <span style={{ color:'#1D9E75', fontWeight:700 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <button onClick={() => checkout('price_1Tjllk5T5WOtD5yfzHCMzAal', 'starter')}
            disabled={loading !== ''}
            style={{ width:'100%', background: loading==='starter' ? '#ccc' : '#1D9E75', color:'#fff', border:'none', borderRadius:14, padding:'14px', fontSize:15, fontWeight:700, cursor: loading!=='' ? 'default' : 'pointer' }}>
            {loading === 'starter' ? 'Loading...' : 'Start free trial →'}
          </button>
          <p style={{ textAlign:'center', fontSize:12, color:'#AAA', marginTop:10 }}>Card required · charged after 14 days</p>
        </div>

        <div style={{ background:'#0D1117', borderRadius:24, padding:32, border:'1.5px solid #1D9E75', position:'relative' }}>
          <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#1D9E75', color:'#fff', fontSize:11, fontWeight:700, padding:'4px 14px', borderRadius:99, whiteSpace:'nowrap' as any }}>
            MOST POPULAR
          </div>
          <div style={{ fontWeight:800, fontSize:18, color:'#fff', marginBottom:4 }}>Family Pro</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:8 }}>
            <span style={{ fontSize:42, fontWeight:800, color:'#fff' }}>$4.99</span>
            <span style={{ fontSize:14, color:'#888' }}>/month</span>
          </div>
          <div style={{ background:'#1D9E75', color:'#fff', fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:99, display:'inline-block', marginBottom:20 }}>
            14 days free trial
          </div>
          <ul style={{ listStyle:'none', marginBottom:28 }}>
            {['Everything in Starter','Photo proof of chores','Parent approval required','Savings goals for kids','Streak and badge rewards','Weekly email summary'].map(f => (
              <li key={f} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', fontSize:14, color:'#ccc' }}>
                <span style={{ color:'#1D9E75', fontWeight:700 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <button onClick={() => checkout('price_1Tjlmz5T5WOtD5yfSDDkQofp', 'pro')}
            disabled={loading !== ''}
            style={{ width:'100%', background: loading==='pro' ? '#ccc' : '#1D9E75', color:'#fff', border:'none', borderRadius:14, padding:'14px', fontSize:15, fontWeight:700, cursor: loading!=='' ? 'default' : 'pointer' }}>
            {loading === 'pro' ? 'Loading...' : 'Start free trial →'}
          </button>
          <p style={{ textAlign:'center', fontSize:12, color:'#555', marginTop:10 }}>Card required · charged after 14 days</p>
        </div>
      </div>
    </div>
  );
}