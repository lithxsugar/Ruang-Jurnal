import { useState } from 'react';
import { db, generateId } from '../../db/db';

export default function SolutionForm({ onSaved }: { onSaved: () => void }) {
  const [data, setData] = useState({
    miracle: '',
    scale: 5,
    reasonNotOne: '',
    nextSmallStep: '',
    exception: ''
  });

  const handleSave = async () => {
    await db.entries.add({
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      editCount: 0,
      type: 'solution',
      content: data
    });
    onSaved();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl mb-2 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-200">
        <p className="text-sm font-medium">Geser fokus dari "masalah" ke "bagaimana menyelesaikannya" dengan langkah paling kecil.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block font-bold mb-2">1. Pertanyaan Ajaib</label>
          <p className="text-sm text-sky-text-muted mb-3 italic">"Kalau malam ini saat kamu tidur ada keajaiban yang menyelesaikan masalahmu... besok pagi, apa tanda pertama yang membuatmu sadar kalau masalahnya sudah hilang?"</p>
          <textarea 
            value={data.miracle}
            onChange={(e) => setData({ ...data, miracle: e.target.value })}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none resize-none h-24"
            placeholder="Contoh: Aku bangun dengan perasaan lega dan langsung ingin menyapa temanku..."
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block font-bold pb-2">2. Skala (1-10)</label>
          <p className="text-sm text-sky-text-muted mb-3">Di angka berapa perasaan atau masalahmu hari ini? (1 = sangat buruk, 10 = sangat baik)</p>
          <input 
            type="range" min="1" max="10" 
            value={data.scale}
            onChange={(e) => setData({ ...data, scale: parseInt(e.target.value) })}
            className="w-full accent-emerald-500 mb-4"
          />
          <div className="text-center font-bold text-lg mb-4">{data.scale}</div>

          <p className="text-sm text-sky-text-muted mb-2">Kenapa kamu memilih angka {data.scale} dan bukan 1?</p>
          <textarea 
            value={data.reasonNotOne}
            onChange={(e) => setData({ ...data, reasonNotOne: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none resize-none h-20 mb-4"
          />

          <p className="text-sm text-sky-text-muted mb-2">Apa satu hal kecil yang bisa kamu lakukan agar poinnya naik 1 angka saja?</p>
          <textarea 
            value={data.nextSmallStep}
            onChange={(e) => setData({ ...data, nextSmallStep: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none resize-none h-20"
            placeholder="Contoh: Minum air putih dan jalan di luar 5 menit..."
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full py-4 rounded-2xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all active:scale-[0.98]"
      >
        Simpan Jurnal
      </button>
    </div>
  );
}
