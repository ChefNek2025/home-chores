const fs = require('fs');

// Fix _app.tsx to add dark mode provider
let app = fs.readFileSync('pages/_app.tsx', 'utf8');
console.log('current _app.tsx:', app);

const newApp = `import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('seru_dark_mode');
    if (saved === 'true') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  function toggleDark() {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem('seru_dark_mode', String(newDark));
    document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
  }

  return (
    <>
      <style>{
        \`
        :root {
          --bg: #FAFAF8;
          --bg2: #F7F7F5;
          --surface: #ffffff;
          --border: #EBEBEB;
          --text: #0D1117;
          --text2: #555;
          --text3: #888;
          --green: #1D9E75;
          --green-light: #E1F5EE;
          --green-dark: #0F6E56;
          --dark-bg: #0D1117;
          --dark-surface: #1A1A1A;
          --toggle-bg: rgba(0,0,0,0.05);
        }
        [data-theme="dark"] {
          --bg: #0D1117;
          --bg2: #111827;
          --surface: #1A1A1A;
          --border: #2D2D2D;
          --text: #F0F0F0;
          --text2: #C9D1D9;
          --text3: #8B949E;
          --green: #1D9E75;
          --green-light: #0F2E22;
          --green-dark: #9FE1CB;
          --dark-bg: #000000;
          --dark-surface: #0D1117;
          --toggle-bg: rgba(255,255,255,0.05);
        }
        body {
          background: var(--bg) !important;
          color: var(--text) !important;
          transition: background 0.3s, color 0.3s;
        }
        \`
      }</style>
      <div style={{ position:'fixed', bottom:20, right:20, zIndex:9999 }}>
        <button
          onClick={toggleDark}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            width:48,
            height:48,
            borderRadius:'50%',
            border:'2px solid #1D9E75',
            background: dark ? '#1A1A1A' : '#fff',
            cursor:'pointer',
            fontSize:22,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
            transition:'all 0.3s',
          }}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
      <Component {...pageProps} />
    </>
  );
}
`;

fs.writeFileSync('pages/_app.tsx', newApp);
console.log('done! dark mode added!');
