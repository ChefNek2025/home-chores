import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    setMessage('');

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { family_name: familyName } }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from('families').insert({
          id: data.user.id,
          name: familyName,
          email: email,
          plan: 'free'
        });
        setMessage('Account created! Please check your email to confirm, then log in.');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
     if (data.user) router.push('/dashboard');
    }
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F0FBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0D1117', letterSpacing: '-1px' }}>Seru Chores</h1>
          <p style={{ color: '#666', marginTop: 6 }}>{isSignup ? 'Create your family account' : 'Welcome back!'}</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #EBEBEB', boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
          {isSignup && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6, fontWeight: 500 }}>Family name</label>
              <input
                value={familyName}
                onChange={e => setFamilyName(e.target.value)}
                placeholder="e.g. The Johnson Family"
                style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6, fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 10, padding: '10px 14px', color: '#C00', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ background: '#F0FBF7', border: '1px solid #9FE1CB', borderRadius: 10, padding: '10px 14px', color: '#0F6E56', fontSize: 13, marginBottom: 16 }}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#ccc' : '#1D9E75', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer' }}
          >
            {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setIsSignup(!isSignup); setError(''); setMessage(''); }}
              style={{ color: '#1D9E75', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
              {isSignup ? 'Log in' : 'Sign up free'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#AAA', marginTop: 20 }}>
          Free forever for one family · No credit card needed
        </p>
      </div>
    </div>
  );
}