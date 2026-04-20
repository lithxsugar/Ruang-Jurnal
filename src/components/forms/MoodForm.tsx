import { useState } from 'react';
import { db, generateId } from '../../db/db';

const FEELINGS = {
  'Senang': ['Damai', 'Bersyukur', 'Bangga', 'Optimis'],
  'Sedih': ['Kesepian', 'Hampa', 'Kecewa', 'Rindu'],
  'Marah': ['Frustrasi', 'Kesal', 'Merasa Tidak Dihargai'],
  'Takut': ['Khawatir', 'Panik', 'Tegang', 'Overwhelmed'],
  'Kaget': ['Bingung', 'Terpukul', 'Tidak Percaya'],
  'Muak': ['Bosan', 'Terganggu', 'Muak pada diri sendiri']
};

export default function MoodForm({ onSaved }: { onSaved: () => void }) {
  const [level1, setLevel1] = useState<keyof typeof FEELINGS | null>(null);
  const [level2, setLevel2] = useState<string>('');
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [bodyPart, setBodyPart] = useState('');

  const BODY_PARTS = ['Kepala', 'Dada', 'Perut', 'Tenggorokan', 'Bahu', 'Tangan', 'Seluruh tubuh', 'Tidak terasa'];

  const handleSave = async () => {
    if (!level1) return;
    await db.entries.add({
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      editCount: 0,
      type: 'mood',
      mood: { level1, level2, intensity },
      content: { trigger, bodyPart }
    });
    onSaved();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {!level1 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-xl mb-4 text-center">Apa perasaan utamamu saat ini?</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(FEELINGS).map(f => (
              <button
                key={f}
                onClick={() => setLevel1(f as keyof typeof FEELINGS)}
                className="py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-sky-900/30 font-medium transition-all"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Lebih spesifiknya?</h3>
              <button onClick={() => setLevel1(null)} className="text-sm text-sky-button">Ubah</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {FEELINGS[level1].map(f => (
                <button
                  key={f}
                  onClick={() => setLevel2(f)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${level2 === f ? 'bg-sky-button text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-sky-text dark:text-sky-dark-text'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <p className="mb-3 font-medium">Seberapa kuat perasaan ini? ({intensity}/10)</p>
              <input 
                type="range" min="1" max="10" 
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full accent-sky-button"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
            <div>
              <p className="font-bold mb-2">Apa yang memicu perasaan ini?</p>
              <textarea 
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-button outline-none resize-none h-24"
                placeholder="Contoh: Tadi saat rapat..."
              />
            </div>
            <div>
              <p className="font-bold mb-3">Di bagian tubuh mana kamu paling merasakannya?</p>
              <div className="flex flex-wrap gap-2">
                {BODY_PARTS.map(part => (
                  <button
                    key={part}
                    onClick={() => setBodyPart(part)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${bodyPart === part ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700'} border`}
                  >
                    {part}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-4 rounded-2xl font-bold bg-sky-button hover:bg-sky-500 text-white shadow-md transition-all active:scale-[0.98]"
          >
            Simpan Perasaan
          </button>
        </div>
      )}
    </div>
  );
}
