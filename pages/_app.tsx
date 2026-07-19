import type { AppProps } from 'next/app';
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
      <style>{`
        * { transition: background-color 0.2s, color 0.2s, border-color 0.2s; }
        body { background: ${theme.bg} !important; color: ${theme.text} !important; }
      `}</style>
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
