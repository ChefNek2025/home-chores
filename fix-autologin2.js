const fs = require('fs');

// Fix login page - save credentials and auto-login
let login = fs.readFileSync('pages/login.tsx', 'utf8');

// Replace the handleSubmit to save credentials
login = login.replace(
  'async function handleSubmit() {',
  `async function handleSubmit() {
    // Save credentials for auto-login
    try { localStorage.setItem('seru_email', email); } catch {}
    try { localStorage.setItem('seru_password', password); } catch {}
    try { sessionStorage.setItem('seru_email', email); } catch {}
    try { sessionStorage.setItem('seru_password', password); } catch {}`
);

// Add auto-login logic in useEffect
login = login.replace(
  `  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, []);`,
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
  }, []);`
);

fs.writeFileSync('pages/login.tsx', login);
console.log('done! auto-login:', login.indexOf('seru_email'));

// Fix landing page - also try auto-login
let index = fs.readFileSync('pages/index.tsx', 'utf8');

index = index.replace(
  `  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, []);`,
  `  useEffect(() => {
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

fs.writeFileSync('pages/index.tsx', index);
console.log('index done! seru_email:', index.indexOf('seru_email'));