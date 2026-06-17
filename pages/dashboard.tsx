import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('families').select('*').eq('id', user.id).single();
      setFamily(data);
      setLoading(false);
    }
    load();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
        <p style={{ color: '#666' }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F0FBF7' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🏠</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#0D1117' }}>Seru Chores</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: '#666' }}>{family?.name}</span>
          <button onClick={logout} style={{ background: 'none', border: '1px solid #E0E0E0', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', color: '#666' }}>
            Log out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #EBEBEB', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0D1117', marginBottom: 8 }}>
            Welcome, {family?.name}!
          </h2>
          <p style={{ color: '#666', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
            Your account is set up and ready. Next step — add your kids and start assigning chores!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '👧', label: 'Add your kids', desc: 'Set up profiles for each child' },
              { icon: '📋', label: 'Assign chores', desc: 'Create daily jobs and pay rates' },
              { icon: '📱', label: 'Share their link', desc: 'Kids check in on their phones' },
              { icon: '💵', label: 'Pay weekly', desc: 'Track earnings and pay out' },
            ].map(s => (
              <div key={s.label} style={{ background: '#F7F7F5', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0D1117', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#E1F5EE', borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: '#0F6E56', fontWeight: 600, marginBottom: 4 }}>🚀 Coming very soon!</div>
            <div style={{ fontSize: 13, color: '#0F6E56' }}>Full dashboard with kids, chores, and payments is being built right now.</div>
          </div>

          <button
            onClick={() => router.push('/app')}
            style={{ background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Go to the app →
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#AAA', marginTop: 20 }}>
          Plan: {family?.plan === 'free' ? '🆓 Free' : '⭐ Pro'} · {family?.email}
        </p>
      </div>
    </div>
  );
}