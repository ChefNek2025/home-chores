const fs = require('fs');

// Fix login page - don't auto-login if user just logged out
let login = fs.readFileSync('pages/login.tsx', 'utf8');

login = login.replace(
  `  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { router.replace('/dashboard'); return; }
      // Try auto-login with saved credentials
      const savedEmail = (() => { try { return localStorage.getItem('seru_email') || sessionStorage.getItem('seru_email'); } catch { return null; } })();
      const savedPassword = (() => { try { return localStorage.getItem('seru_password') || sessionStorage.getItem('seru_password'); } catch { return null; } })();
      if (savedEmail && savedPassword) {
        supabase.auth.signInWithPassword({ email: savedEmail, password: savedPassword }).then(({ data, error }) => {
          if (data?.session && !error) router.replace('/dashboard');
        });
      }
    });
  }, []);`,
  `  useEffect(() => {
    const justLoggedOut = (() => { try { return localStorage.getItem('seru_logged_out') === 'true'; } catch { return false; } })();
    if (justLoggedOut) {
      try { localStorage.removeItem('seru_logged_out'); } catch {}
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { router.replace('/dashboard'); return; }
      const savedEmail = (() => { try { return localStorage.getItem('seru_email') || sessionStorage.getItem('seru_email'); } catch { return null; } })();
      const savedPassword = (() => { try { return localStorage.getItem('seru_password') || sessionStorage.getItem('seru_password'); } catch { return null; } })();
      if (savedEmail && savedPassword) {
        supabase.auth.signInWithPassword({ email: savedEmail, password: savedPassword }).then(({ data, error }) => {
          if (data?.session && !error) router.replace('/dashboard');
        });
      }
    });
  }, []);`
);

fs.writeFileSync('pages/login.tsx', login);
console.log('login fixed!');

// Fix dashboard - set logout flag when logging out
let dashboard = fs.readFileSync('pages/dashboard.tsx', 'utf8');

dashboard = dashboard.replace(
  `  async function logout() {
    await supabase.auth.signOut();
    router.push('/login');
  }`,
  `  async function logout() {
    try { localStorage.setItem('seru_logged_out', 'true'); } catch {}
    try { localStorage.removeItem('seru_email'); } catch {}
    try { localStorage.removeItem('seru_password'); } catch {}
    try { sessionStorage.removeItem('seru_email'); } catch {}
    try { sessionStorage.removeItem('seru_password'); } catch {}
    await supabase.auth.signOut();
    router.push('/login');
  }`
);

fs.writeFileSync('pages/dashboard.tsx', dashboard);
console.log('dashboard fixed! logout:', dashboard.indexOf('seru_logged_out'));
