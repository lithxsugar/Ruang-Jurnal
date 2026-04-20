import { useState } from 'react';
import { db, generateId } from '../../db/db';

export default function SelfCompassionForm({ onSaved }: { onSaved: () => void }) {
  const [data, setData] = useState({
    hardThing: '',
    sharedHumanity: '',
    selfKindness: ''
  });

  const handleSave = async () => {
    if (!data.hardThing.trim()) return;
    await db.entries.add({
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      editCount: 0,
      type: 'self_compassion',
      content: data
    });
    onSaved();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-pink-50 dark:bg-pink-900/10 p-4 rounded-2xl mb-2 border border-pink-100 dark:border-pink-900/30 text-pink-800 dark:text-pink-200">
        <p className="text-sm font-medium">
          Mari belajar bersikap baik ke diri sendiri, sama seperti saat kamu menenangkan seorang sahabat.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block font-bold mb-2">Apa yang sedang terasa berat buat kamu saat ini?</label>
          <p className="text-sm text-sky-text-muted mb-3">Akui saja perasaanmu, tidak perlu ditahan atau dihakimi.</p>
          <textarea 
            value={data.hardThing}
            onChange={(e) => setData({ ...data, hardThing: e.target.value })}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none resize-none h-32"
            placeholder="Contoh: Aku merasa sangat kewalahan dengan tugas-tugas ini..."
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block font-bold mb-2">Kamu tidak sendirian</label>
          <p className="text-sm text-sky-text-muted mb-3">Siapa lagi yang mungkin pernah merasakan hal serupa? Ingat bahwa ini adalah bagian dari menjadi manusia.</p>
          <textarea 
            value={data.sharedHumanity}
            onChange={(e) => setData({ ...data, sharedHumanity: e.target.value })}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none resize-none h-24"
            placeholder="Contoh: Wajar merasa begini. Banyak orang lain di posisiku pasti juga stres."
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block font-bold mb-2">Apa yang ingin kamu katakan pada dirimu sendiri?</label>
          <p className="text-sm text-sky-text-muted mb-3 italic">Bayangkan sahabatmu yang mengalami ini. Apa yang akan kamu bilang ke dia untuk menenangkannya?</p>
          <textarea 
            value={data.selfKindness}
            onChange={(e) => setData({ ...data, selfKindness: e.target.value })}
            className="w-full p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none resize-none h-32 text-pink-900 dark:text-pink-100 font-medium"
            placeholder="Tuliskan kata-kata yang menenangkan di sini..."
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={!data.hardThing.trim()}
        className="w-full py-4 rounded-2xl font-bold bg-pink-500 hover:bg-pink-600 text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
      >
        Simpan Jurnal
      </button>
    </div>
  );
}
