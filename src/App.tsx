import { useState, useEffect } from 'react';
import { Home, PenLine, Clock, BarChart2, Lock } from 'lucide-react';
import { cn } from './lib/utils';
import { db } from './db/db';
import { useLiveQuery } from 'dexie-react-hooks';

// Placeholder Pages
import HomePage from './pages/HomePage';
import WritePage from './pages/WritePage';
import HistoryPage from './pages/HistoryPage';
import InsightPage from './pages/InsightPage';
import PWAPrompt from './components/PWAPrompt';

type Tab = 'home' | 'write' | 'history' | 'insight';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [writeType, setWriteType] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  
  // Hardcoded pin for the sake of presentation (usually would be set by user)
  const REQUIRED_PIN = '1234'; 

  useEffect(() => {
    // Check if user has turned off lock or similar in local storage... we assume always locked for now unless bypassed
    const storedPin = localStorage.getItem('journal_pin');
    // If no pin is set, we just let them in (or default 1234) for UX
    if (!storedPin) {
      localStorage.setItem('journal_pin', REQUIRED_PIN);
    }
  }, []);

  const handlePin = (digit: string) => {
    if (pinInput.length < 4) {
      const newPin = pinInput + digit;
      setPinInput(newPin);
      if (newPin.length === 4) {
        if (newPin === (localStorage.getItem('journal_pin') || REQUIRED_PIN)) {
          setTimeout(() => setIsLocked(false), 200);
        } else {
          setTimeout(() => setPinInput(''), 400); // clear on wrong
        }
      }
    }
  };

  const navigateToWrite = (type?: string, id?: string) => {
    if (type) setWriteType(type);
    else setWriteType(null);
    
    if (id) setEditId(id);
    else setEditId(null);
    
    setActiveTab('write');
  };

  if (isLocked) {
    return (
      <div className="fixed inset-0 bg-sky-bg dark:bg-sky-dark-bg z-[100] flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-6 text-sky-button">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold font-serif mb-2">Ruang Jurnal</h2>
        <p className="text-sky-text-muted mb-8 text-center text-sm">Masukkan PIN (1234) untuk menjaga privasimu.</p>
        
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full transition-colors duration-200 ${pinInput.length > i ? 'bg-sky-button' : 'bg-slate-300 dark:bg-slate-700'}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[280px]">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button key={num} onClick={() => handlePin(num.toString())} className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-sm text-2xl font-semibold active:bg-slate-50 transition-colors">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handlePin('0')} className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-sm text-2xl font-semibold active:bg-slate-50 transition-colors">
            0
          </button>
          <button onClick={() => setPinInput(pinInput.slice(0, -1))} className="w-20 h-20 flex items-center justify-center text-red-400 font-bold active:scale-95 transition-transform">
            Del
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 md:pl-20">
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
        {activeTab === 'home' && <HomePage onNavigateToWrite={navigateToWrite} />}
        {activeTab === 'write' && <WritePage initialType={writeType} editId={editId} onBack={() => { setActiveTab('home'); setEditId(null); }} />}
        {activeTab === 'history' && <HistoryPage onEdit={(id, type) => navigateToWrite(type, id)} />}
        {activeTab === 'insight' && <InsightPage />}
      </main>

      {/* Bottom Navigation for Mobile / Side Nav for Desktop */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-sky-dark-bg/90 backdrop-blur-md border-t border-sky-bg-alt dark:border-sky-dark-accent/20 z-50 md:top-0 md:right-auto md:w-20 md:border-t-0 md:border-r">
        <ul className="flex flex-row md:flex-col justify-around md:justify-center md:gap-8 items-center h-16 md:h-full max-w-md mx-auto md:w-full">
          <NavItem 
            icon={<Home />} 
            label="Beranda" 
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <NavItem 
            icon={<PenLine />} 
            label="Tulis" 
            isActive={activeTab === 'write'} 
            onClick={() => { setWriteType(null); setActiveTab('write'); }} 
          />
          <NavItem 
            icon={<Clock />} 
            label="Riwayat" 
            isActive={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <NavItem 
            icon={<BarChart2 />} 
            label="Insight" 
            isActive={activeTab === 'insight'} 
            onClick={() => setActiveTab('insight')} 
          />
        </ul>
      </nav>
      
      <PWAPrompt />
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <li className="flex-1 md:flex-none w-full">
      <button 
        onClick={onClick}
        className={cn(
          "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
          isActive 
            ? "text-sky-button dark:text-sky-dark-accent" 
            : "text-sky-text-muted hover:text-sky-text dark:hover:text-white"
        )}
      >
        <div className={cn(
          "p-1.5 rounded-full transition-all duration-200",
          isActive && "bg-sky-bg dark:bg-sky-dark-bg"
        )}>
          {icon}
        </div>
        <span className="text-[10px] sm:text-xs font-bold">{label}</span>
      </button>
    </li>
  );
}

