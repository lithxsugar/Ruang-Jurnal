import { useState, useEffect } from 'react';
import { db, generateId } from '../../db/db';

export default function FreewritingForm({ onSaved, editId }: { onSaved: () => void, editId?: string | null }) {
  const [content, setContent] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editId) {
      db.entries.get(editId).then(entry => {
        if (entry && entry.type === 'freewriting') {
          setContent(entry.content.text || '');
          setIsEditing(true);
        }
      });
    }
  }, [editId]);

  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    if (isEditing && editId) {
      await db.entries.update(editId, {
        updatedAt: Date.now(),
        content: { text: content },
        editCount: (await db.entries.get(editId))!.editCount + 1
      });
    } else {
      await db.entries.add({
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        editCount: 0,
        type: 'freewriting',
        content: { text: content }
      });
    }
    onSaved();
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] animate-fade-in relative">
      <div className="bg-sky-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-4 border border-sky-100 dark:border-slate-700/50">
        <p className="text-center text-sm font-medium text-sky-800 dark:text-sky-200">
          "Ini ruang aman milikmu. Tidak ada yang akan membaca ini selain kamu. Tulis apa saja yang kamu rasakan — tidak perlu rapi."
        </p>
      </div>

      <div className="flex justify-between items-center mb-4 px-2">
        <button 
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className={`px-4 py-2 rounded-full font-mono text-sm font-medium transition-colors ${isTimerRunning ? 'bg-sky-100 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'} dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300`}
        >
          {isTimerRunning ? '⏸ JEDA' : '▶ MULAI'} {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
        </button>
        
        <button 
          onClick={handleSave}
          disabled={!content.trim()}
          className="px-6 py-2 rounded-full font-medium bg-sky-button hover:bg-sky-500 disabled:opacity-50 text-white shadow-sm transition-all"
        >
          Selesai
        </button>
      </div>

      <textarea 
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (!isTimerRunning && e.target.value.length > 5) setIsTimerRunning(true);
        }}
        spellCheck={false}
        className="flex-1 w-full bg-transparent border-0 focus:ring-0 outline-none font-serif text-lg leading-relaxed resize-none p-2 placeholder-slate-300 dark:placeholder-slate-700"
        placeholder="Mulai menulis di sini..."
      />
    </div>
  );
}
