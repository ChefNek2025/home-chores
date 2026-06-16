interface Tab { id: string; label: string; icon: string; }
interface Props { tabs: Tab[]; active: string; onChange: (id: string) => void; }

export default function TabBar({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${active === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <span>{tab.icon}</span><span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}