import { useState, useEffect } from 'react';
import { Sparkles, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { JOURNAL_TYPES } from '../constants/journalTypes';

const QUOTES = [
  "Tidak apa-apa untuk menjeda sebentar dan mengambil napas.",
  "Kamu sudah melakukan yang terbaik hari ini.",
  "Setiap emosi yang kamu rasakan itu valid.",
  "Satu langkah kecil masih dihitung sebagai kemajuan.",
  "Jadilah sahabat terbaik untuk dirimu sendiri hari ini."
];

export default function HomePage({ onNavigateToWrite }: { onNavigateToWrite: (type?: string) => void }) {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 10) setGreeting('Selamat pagi! Mulai harimu pelan-pelan saja ya');
    else if (hour < 15) setGreeting('Halo! Jangan lupa ambil napas dan istirahat sebentar');
    else if (hour < 18) setGreeting('Sore... Gimana hari ini? Berat atau menyenangkan?');
    else setGreeting('Malam. Saatnya merebahkan badan dan pikiranmu');

    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const entriesCount = useLiveQuery(() => db.entries.count()) || 0;
  const recentEntries = useLiveQuery(() => db.entries.orderBy('createdAt').reverse().limit(2).toArray()) || [];
  
  // Quick streak calculation (mocked for simplicity, ideally needs a real daily streak logic based on dates)
  const streak = 1; 

  const getRandomPrompt = () => {
    const types = JOURNAL_TYPES.map(t => t.id);
    const randomType = types[Math.floor(Math.random() * types.length)];
    onNavigateToWrite(randomType);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6"
    >
      <section className="col-span-1 lg:col-span-4 flex flex-col gap-6">
        <header className="pt-4">
          <h1 className="text-2xl sm:text-3xl font-light italic font-serif mb-1 text-sky-button dark:text-sky-dark-accent">{greeting}.</h1>
        </header>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-sky-50 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-text-muted mb-4">Statistik Singkat</h2>
            <div className="flex gap-4">
              <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-sky-100 dark:border-slate-600 flex items-center gap-2">
                <span className="text-orange-400 font-bold">🔥 {streak} Hari</span>
                <span className="text-xs text-sky-text-muted">Streak</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 bg-sky-primary dark:bg-sky-dark-accent rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {entriesCount}
          </div>
        </div>

        {/* Quote Card */}
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-[24px] p-6 border border-white/60 dark:border-slate-700/60">
          <h2 className="text-sm italic font-serif text-sky-button dark:text-sky-dark-accent mb-2">Kutipan Hari Ini</h2>
          <p className="text-sm leading-relaxed italic text-sky-text dark:text-sky-dark-text">"{quote}"</p>
        </div>

        {/* Call to Action */}
        <div className="mt-auto p-4 bg-sky-button/10 dark:bg-sky-dark-accent/10 rounded-[24px] border border-sky-button/20 dark:border-sky-dark-accent/20">
          <p className="text-xs font-medium text-sky-button dark:text-sky-dark-accent mb-2">Butuh bantuan mulai?</p>
          <button 
            onClick={getRandomPrompt}
            className="w-full py-3 bg-sky-button dark:bg-sky-dark-accent text-white rounded-xl text-sm font-semibold shadow-md hover:bg-sky-500 dark:hover:bg-sky-400 transition-all active:scale-[0.98]"
          >
            Bantu saya mulai 🌟
          </button>
        </div>
      </section>

      {/* Right Side */}
      <section className="col-span-1 lg:col-span-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[32px] p-6 md:p-8 border border-white dark:border-slate-700">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-serif text-sky-text dark:text-sky-dark-text">Pilih Cara Bercerita</h2>
          <span className="text-xs text-sky-text-muted">{JOURNAL_TYPES.length} Metode Tersedia</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {JOURNAL_TYPES.map(type => (
            <div
              key={type.id}
              onClick={() => onNavigateToWrite(type.id)}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-sky-100 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.99] flex flex-col h-full"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${type.color} bg-opacity-20`}>
                <div className="scale-[0.8]">{type.icon}</div>
              </div>
              <h3 className="font-bold text-sky-text dark:text-sky-dark-text mb-1">{type.title}</h3>
              <p className="text-xs text-sky-text-muted leading-relaxed mt-auto">{type.description}</p>
            </div>
          ))}
        </div>

        {/* Recent History Preview */}
        {recentEntries.length > 0 && (
          <div className="mt-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-sky-text-muted dark:text-sky-dark-text-muted mb-3">Terakhir Kamu Tulis</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              {recentEntries.map(entry => {
                const typeInfo = JOURNAL_TYPES.find(t => t.id === entry.type);
                return (
                  <div key={entry.id} className="flex-1 bg-white/40 dark:bg-slate-700/40 p-3 rounded-xl border border-white dark:border-slate-600/50 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${typeInfo?.color}`}>
                      <div className="scale-[0.6]">{typeInfo?.icon}</div>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate text-sky-text dark:text-sky-dark-text">{typeInfo?.title}</p>
                      <p className="text-[10px] text-sky-text-muted dark:text-sky-dark-text-muted">
                        {new Date(entry.createdAt).toLocaleDateString()} {entry.editCount > 0 && `• Diedit ${entry.editCount}x`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

    </motion.div>
  );
}
