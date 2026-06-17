import { useRouter } from 'next/router';
import { KIDS } from '../lib/types';

export default function LoginPage() {
  const router = useRouter();
  function enter(user: string) {
    sessionStorage.setItem('hc_user', user);
    if (user === 'admin') router.push('/admin');
    else router.push(`/kid/${user}`);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🏠</div>
          <h1 className="text-3xl font-bold text-gray-900">Seru Chores</h1>
          <p className="text-gray-500 mt-1 text-sm">Who is logging in?</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => enter('admin')} className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-brand-400 hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">🛡️</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Parent / Admin</div>
              <div className="text-sm text-gray-500">Manage jobs, track progress, pay out</div>
            </div>
          </button>
          {KIDS.map(kid => (
            <button key={kid.id} onClick={() => enter(kid.id)} className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-brand-400 hover:shadow-md transition-all text-left group">
              <div className={`w-12 h-12 rounded-xl ${kid.bg} flex items-center justify-center text-xl font-bold ${kid.color} flex-shrink-0`}>{kid.name[0]}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{kid.name}</div>
                <div className="text-sm text-gray-500">Age {kid.age} · Check in your chores</div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">All data saved on this device · Works offline</p>
      </div>
    </div>
  );
}