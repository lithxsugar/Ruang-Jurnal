import { useState } from 'react';
import { db, generateId } from '../../db/db';

export default function NarrativeForm({ onSaved }: { onSaved: () => void }) {
  const [data, setData] = useState({
    problemName: '',
    wins: '',
    newChapter: ''
  });

  const handleSave = async () => {
    if (!data.problemName.trim()) return;
    await db.entries.add({
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      editCount: 0,
      type: 'narrative',
      content: data
    });
    onSaved();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-violet-50 dark:bg-violet-900/10 p-4 rounded-2xl mb-2 border border-violet-100 dark:border-violet-900/30 text-violet-800 dark:text-violet-200">
        <p className="text-sm font-medium">Kamu bukanlah masalahmu. Mari pisahkan dirimu dari masalah dengan merangkai ulang ceritamu.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block font-bold mb-2">Beri nama masalahmu</label>
          <p className="text-sm text-sky-text-muted mb-3">Anggap masalahmu adalah karakter atau benda di luar dirimu. (contoh: "Si Keraguan", "Awan Gelap")</p>
          <input 
            type="text"
            value={data.problemName}
            onChange={(e) => setData({ ...data, problemName: e.target.value })}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none"
            placeholder="Ketik nama di sini..."
          />
        </div>

        {data.problemName && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in">
            <label className="block font-bold mb-2">Kapan kamu menang melawan "{data.problemName}"?</label>
            <p className="text-sm text-sky-text-muted mb-3">Ingat momen kecil di mana masalah ini rasanya tidak terlalu kuat atau kamu berhasil mengabaikannya.</p>
            <textarea 
              value={data.wins}
              onChange={(e) => setData({ ...data, wins: e.target.value })}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none resize-none h-24"
              placeholder={`Kemarin saat aku sibuk memasak, aku sama sekali lupa tentang ${data.problemName}...`}
            />
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block font-bold mb-2">Tulis ulang ceritamu</label>
          <p className="text-sm text-sky-text-muted mb-3">Bagaimana kamu ingin bab dari hidupmu ini berakhir? Tuliskan dengan harapan.</p>
          <textarea 
            value={data.newChapter}
            onChange={(e) => setData({ ...data, newChapter: e.target.value })}
            className="w-full p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl focus:ring-2 focus:ring-violet-400 outline-none resize-none h-40 font-serif text-lg text-violet-900 dark:text-violet-100"
            placeholder="Meski sulit, aku memutuskan untuk..."
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={!data.problemName.trim()}
        className="w-full py-4 rounded-2xl font-bold bg-violet-500 hover:bg-violet-600 text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
      >
        Simpan Cerita
      </button>
    </div>
  );
}
