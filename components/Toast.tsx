import { useState, useCallback } from 'react';

export function useToast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const show = useCallback((message: string) => {
    setMsg(message); setVisible(true);
    setTimeout(() => setVisible(false), 2500);
  }, []);
  return { msg, visible, show };
}

export function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 z-50 whitespace-nowrap ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
      {msg}
    </div>
  );
}