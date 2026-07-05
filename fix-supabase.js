const fs = require('fs');

const newLib = `import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => {
      try { const v = localStorage.getItem(key); if (v) return v; } catch {}
      try { const v = sessionStorage.getItem(key); if (v) return v; } catch {}
      try {
        const match = document.cookie.match('(^|;)\\s*' + key + '=([^;]+)');
        if (match) return decodeURIComponent(match[2]);
      } catch {}
      return store[key] ?? null;
    },
    setItem: (key: string, value: string) => {
      try { localStorage.setItem(key, value); } catch {}
      try { sessionStorage.setItem(key, value); } catch {}
      try { document.cookie = key + '=' + encodeURIComponent(value) + '; path=/; max-age=31536000; SameSite=Lax'; } catch {}
      store[key] = value;
    },
    removeItem: (key: string) => {
      try { localStorage.removeItem(key); } catch {}
      try { sessionStorage.removeItem(key); } catch {}
      try { document.cookie = key + '=; path=/; max-age=0'; } catch {}
      delete store[key];
    },
  };
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'seru-auth-token',
    storage: getStorage(),
  },
});
`;

fs.writeFileSync('lib/supabase.ts', newLib);
console.log('done! size:', newLib.length);