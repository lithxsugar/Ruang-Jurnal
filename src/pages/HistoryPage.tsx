import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { format, isSameDay } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { JOURNAL_TYPES } from '../constants/journalTypes';
import { Calendar, Search, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HistoryPage({ onEdit }: { onEdit: (id: string, type: string) => void }) {
  const entries = useLiveQuery(() => db.entries.orderBy('createdAt').reverse().toArray());
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!entries) return <div className="p-4 text-center">Memuat...</div>;

  const filteredEntries = entries.filter(e => {
    let matchType = filterType === 'all' || e.type === filterType;
    let matchSearch = search.trim() === '' || JSON.stringify(e.content).toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleDelete = async (id: string) => {
    await db.entries.delete(id);
    setDeletingId(null);
  };

  return (
    <div className="pb-6 animate-fade-in">
      <header className="pt-4 mb-6">
        <h1 className="text-3xl font-bold font-serif mb-1">Riwayat.</h1>
        <p className="text-sky-text-muted">Lihat kembali perjalananmu.</p>
      </header>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari kata di jurnal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-button"
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white dark:bg-slate-800 rounded-xl px-3 border border-slate-200 dark:border-slate-700 outline-none max-w-[140px]"
        >
          <option value="all">Semua Tipe</option>
          {JOURNAL_TYPES.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-sky-text-muted">
            <p>Belum ada jurnal yang sesuai.</p>
          </div>
        ) : (
          filteredEntries.map(entry => {
            const typeInfo = JOURNAL_TYPES.find(t => t.id === entry.type);
            const dateStr = format(entry.createdAt, 'dd MMMM yyyy HH:mm', { locale: idLocale });
            const isDeleting = deletingId === entry.id;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={entry.id} 
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${typeInfo?.color.split(' ')[0]}`} />
                
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${typeInfo?.color}`}>
                      {typeInfo?.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {dateStr}
                    </span>
                  </div>
                  {entry.editCount > 0 && <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded italic whitespace-nowrap">Diedit {entry.editCount}x</span>}
                </div>

                <div className="mt-3 text-sm text-sky-800 dark:text-sky-200 font-serif leading-relaxed line-clamp-4">
                  {entry.type === 'freewriting' && entry.content.text}
                  {entry.type === 'thoughts' && `Topik: ${entry.content.situation}`}
                  {entry.type === 'gratitude' && entry.content.items?.map((i:any) => i.what).join(', ')}
                  {entry.type === 'mood' && `Merasa ${entry.content.level2 || entry.mood?.level1} (${entry.mood?.intensity}/10)`}
                  {entry.type === 'self_compassion' && entry.content.hardThing}
                  {entry.type === 'solution' && `Fokus: ${entry.content.nextSmallStep}`}
                  {entry.type === 'narrative' && entry.content.newChapter}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-end">
                  {isDeleting ? (
                    <div className="flex items-center gap-3 animate-fade-in">
                      <span className="text-xs text-slate-500">Yakin hapus?</span>
                      <button 
                        onClick={() => handleDelete(entry.id!)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                      >
                        Ya, Hapus
                      </button>
                      <button 
                        onClick={() => setDeletingId(null)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setDeletingId(entry.id!)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button 
                        onClick={() => onEdit(entry.id!, entry.type)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-sky-button hover:text-sky-600 transition-colors bg-sky-50 dark:bg-sky-900/20 px-3 py-1.5 rounded-lg"
                      >
                        <Edit3 size={14} />
                        Edit Jurnal
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            )
          })
        )}
      </div>

    </div>
  );
}
