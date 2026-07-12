const fs = require('fs');

const newApp = `import type { AppProps } from 'next/app';
import { useEffect, useState, createContext, useContext } from 'react';

export const DarkModeContext = createContext({
  dark: false,
  toggleDark: () => {},
  bg: '#FAFAF8',
  bg2: '#F7F7F5',
  surface: '#ffffff',
  border: '#EBEBEB',
  text: '#0D1117',
  text2: '#555555',
  text3: '#888888',
  cardBg: '#ffffff',
  headerBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#E0E0E0',
});

export function useDark() { return useContext(DarkModeContext); }

export default function App({ Component, pageProps }: AppProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('seru_dark_mode');
    if (saved === 'true') setDark(true);
  }, []);

  function toggleDark() {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem('seru_dark_mode', String(newDark));
  }

  const theme = dark ? {
    dark: true,
    toggleDark,
    bg: '#0D1117',
    bg2: '#111827',
    surface: '#1A1A1A',
    border: '#2D2D2D',
    text: '#F0F0F0',
    text2: '#C9D1D9',
    text3: '#8B949E',
    cardBg: '#1A1A1A',
    headerBg: '#111827',
    inputBg: '#1A1A1A',
    inputBorder: '#2D2D2D',
  } : {
    dark: false,
    toggleDark,
    bg: '#FAFAF8',
    bg2: '#F7F7F5',
    surface: '#ffffff',
    border: '#EBEBEB',
    text: '#0D1117',
    text2: '#555555',
    text3: '#888888',
    cardBg: '#ffffff',
    headerBg: '#ffffff',
    inputBg: '#ffffff',
    inputBorder: '#E0E0E0',
  };

  return (
    <DarkModeContext.Provider value={theme}>
      <style>{\`
        * { transition: background-color 0.2s, color 0.2s, border-color 0.2s; }
        body { background: \${theme.bg} !important; color: \${theme.text} !important; }
      \`}</style>
      <div style={{ position:'fixed', bottom:20, right:20, zIndex:9999 }}>
        <button
          onClick={toggleDark}
          title={dark ? 'Light Mode' : 'Dark Mode'}
          style={{
            width:48, height:48, borderRadius:'50%',
            border:'2px solid #1D9E75',
            background: dark ? '#1A1A1A' : '#fff',
            cursor:'pointer', fontSize:22,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
          }}
        >{dark ? '☀️' : '🌙'}</button>
      </div>
      <Component {...pageProps} />
    </DarkModeContext.Provider>
  );
}
`;

fs.writeFileSync('pages/_app.tsx', newApp);
console.log('_app done!');

// Update dashboard to use dark mode context
let dashboard = fs.readFileSync('pages/dashboard.tsx', 'utf8');

// Add import
dashboard = dashboard.replace(
  "import { useEffect, useState } from 'react';",
  "import { useEffect, useState } from 'react';\nimport { useDark } from './_app';"
);

// Add useDark hook after router
dashboard = dashboard.replace(
  'const router = useRouter();',
  'const router = useRouter();\n  const { dark, bg, bg2, surface, border, text, text2, text3, cardBg, headerBg, inputBg, inputBorder } = useDark();'
);

// Replace background colors
dashboard = dashboard.replace(/background:'#F7F7F5'/g, "background:bg2");
dashboard = dashboard.replace(/background:'#fff'/g, "background:surface");
dashboard = dashboard.replace(/background:'#ffffff'/g, "background:surface");
dashboard = dashboard.replace(/color:'#0D1117'/g, "color:text");
dashboard = dashboard.replace(/color:'#555'/g, "color:text2");
dashboard = dashboard.replace(/color:'#888'/g, "color:text3");
dashboard = dashboard.replace(/color:'#666'/g, "color:text2");
dashboard = dashboard.replace(/border:'1px solid #EBEBEB'/g, "border:`1px solid ${border}`");
dashboard = dashboard.replace(/borderBottom:'1px solid #EBEBEB'/g, "borderBottom:`1px solid ${border}`");
dashboard = dashboard.replace(/background:'#F7F7F5', border:'1px/g, "background:bg2, border:`1px");
dashboard = dashboard.replace(/minHeight:'100vh', background:'#F7F7F5'/g, "minHeight:'100vh', background:bg2");
dashboard = dashboard.replace(/background:'#fff', borderBottom:'1px solid #EBEBEB'/g, "background:headerBg, borderBottom:`1px solid ${border}`");

fs.writeFileSync('pages/dashboard.tsx', dashboard);
console.log('dashboard done!');