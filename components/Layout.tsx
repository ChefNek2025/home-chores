import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface Props { title: string; avatarLabel: string; avatarClass: string; children: ReactNode; }

export default function Layout({ title, avatarLabel, avatarClass, children }: Props) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${avatarClass}`}>{avatarLabel}</div>
            <span className="font-semibold text-gray-900">{title}</span>
          </div>
          <button onClick={() => router.push('/app')} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Switch
          </button>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-5 pb-20">{children}</div>
    </div>
  );
}