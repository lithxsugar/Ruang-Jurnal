import { useState } from 'react';
import { db, generateId } from '../../db/db';

export default function GratitudeForm({ onSaved }: { onSaved: () => void }) {
  const [items, setItems] = useState([
    { what: '', why: '' },
    { what: '', why: '' },
    { what: '', why: '' }
  ]);

  const handleSave = async () => {
    if (items[0].what.trim() === '') return;
    await db.entries.add({
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      editCount: 0,
      type: 'gratitude',
      content: { items: items.filter(i => i.what.trim()) }
    });
    onSaved();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl mb-2 border border-amber-100 dark:border-amber-900/30">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Tulis 3 hal yang kamu syukuri hari ini, sekecil apapun itu. Jangan lupa tuliskan <b>kenapa</b> hal itu berarti buatmu.
        </p>
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-sky-primary dark:text-sky-dark-accent mb-3">Hal baik #{idx + 1}</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-sky-text-muted mb-1">Apa yang kamu syukuri?</p>
              <input 
                type="text"
                value={item.what}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[idx].what = e.target.value;
                  setItems(newItems);
                }}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                placeholder="Contoh: Secangkir kopi hangat pagi ini"
              />
            </div>
            <div>
              <p className="text-sm text-sky-text-muted mb-1">Kenapa ini berarti buat kamu?</p>
              <textarea 
                value={item.why}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[idx].why = e.target.value;
                  setItems(newItems);
                }}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none resize-none h-24"
                placeholder="Contoh: Karena membuatku lebih tenang sebelum mulai kerja..."
              />
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={handleSave}
        disabled={!items[0].what.trim()}
        className="w-full py-4 rounded-2xl font-bold bg-amber-400 dark:bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
      >
        Simpan Jurnal Syukur
      </button>
    </div>
  );
}
