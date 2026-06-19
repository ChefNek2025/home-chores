import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setMessage('✅ Password updated! Redirecting...');
    setTimeout(() => router.push('/dashboard'), 2000);
    setLoading(false);
  }

  return (
    <div style={{ fontFamily:'Inter,system-ui,sans-serif', minHeight:'100vh', background:'#F0FBF7', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#0D1117' }}>Reset your password</h1>
          <p style={{ color:'#666', marginTop:6 }}>Enter your new password below</p>
        </div>
        <div style={{ background:'#fff', borderRadius:20, padding:32, border:'1px solid #EBEBEB' }}>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, color:'#555', display:'block', marginBottom:6, fontWeight:500 }}>New password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ width:'100%', border:'1.5px solid #E0E0E0', borderRadius:10, padding:'10px 14px', fontSize:14, boxSizing:'border-box' as any }} />
          </div>
          {error && <div style={{ background:'#FFF0F0', border:'1px solid #FFD0D0', borderRadius:10, padding:'10px 14px', color:'#C00', fontSize:13, marginBottom:16 }}>{error}</div>}
          {message && <div style={{ background:'#F0FBF7', border:'1px solid #9FE1CB', borderRadius:10, padding:'10px 14px', color:'#0F6E56', fontSize:13, marginBottom:16 }}>{message}</div>}
          <button onClick={handleReset} disabled={loading}
            style={{ width:'100%', background: loading ? '#ccc' : '#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:13, fontSize:15, fontWeight:700, cursor: loading ? 'default' : 'pointer' }}>
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </div>
    </div>
  );
}