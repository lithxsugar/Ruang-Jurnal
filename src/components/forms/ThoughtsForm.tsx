import { useState, useEffect } from 'react';
import { db, generateId } from '../../db/db';

type Emotion = 'Sedih' | 'Cemas' | 'Marah' | 'Takut' | 'Malu' | 'Kecewa' | 'Bersalah' | 'Kesepian';
const EMOTIONS: Emotion[] = ['Sedih', 'Cemas', 'Marah', 'Takut', 'Malu', 'Kecewa', 'Bersalah', 'Kesepian'];

type ThoughtTrap = 'Semua atau Tidak Sama Sekali' | 'Membaca Pikiran Orang' | 'Meramal Masa Depan' | 'Memperbesar Masalah' | 'Menyalahkan Diri Sendiri' | 'Mengabaikan yang Baik';
const THOUGHT_TRAPS: { name: ThoughtTrap, desc: string }[] = [
  { name: 'Semua atau Tidak Sama Sekali', desc: 'Kalau tidak sempurna berarti gagal total' },
  { name: 'Membaca Pikiran Orang', desc: 'Pasti mereka menganggap saya...' },
  { name: 'Meramal Masa Depan', desc: 'Besok pasti berantakan' },
  { name: 'Memperbesar Masalah', desc: 'Ini bencana besar' },
  { name: 'Menyalahkan Diri Sendiri', desc: 'Semua ini salah saya' },
  { name: 'Mengabaikan yang Baik', desc: 'Yang baik cuma kebetulan' }
];

export default function ThoughtsForm({ onSaved, editId }: { onSaved: () => void, editId?: string | null }) {
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [isEditing, setIsEditing] = useState(false);

  const [data, setData] = useState({
    situation: '',
    firstThought: '',
    traps: [] as ThoughtTrap[],
    emotionBefore: { name: '' as Emotion | '', intensity: 5 },
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
    emotionAfter: { name: '' as Emotion | '', intensity: 5 }
  });

  useEffect(() => {
    if (editId) {
      db.entries.get(editId).then(entry => {
        if (entry && entry.type === 'thoughts') {
          setData(entry.content);
          setIsEditing(true);
        }
      });
    }
  }, [editId]);

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSave();
  };

  const handleSave = async () => {
    if (isEditing && editId) {
      await db.entries.update(editId, {
        updatedAt: Date.now(),
        content: data,
        editCount: (await db.entries.get(editId))!.editCount + 1
      });
    } else {
      await db.entries.add({
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        editCount: 0,
        type: 'thoughts',
        content: data
      });
    }
    onSaved();
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-sky-button h-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[400px] flex flex-col">
        
        {step === 1 && (
          <div className="flex-1 space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold">Apa yang terjadi?</h3>
            <p className="text-sky-text-muted">Tulis situasi yang bikin kamu merasa tidak enak.</p>
            <textarea 
              value={data.situation}
              onChange={(e) => setData({ ...data, situation: e.target.value })}
              className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-button outline-none font-serif text-lg resize-none"
              placeholder="Contoh: Teman saya tidak balas chat saya seharian..."
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold">Apa yang langsung terlintas di pikiranmu?</h3>
            <p className="text-sky-text-muted">Tulis pikiran pertama yang muncul, apa adanya.</p>
            <textarea 
              value={data.firstThought}
              onChange={(e) => setData({ ...data, firstThought: e.target.value })}
              className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-button outline-none font-serif text-lg resize-none"
              placeholder="Contoh: Dia pasti marah sama saya..."
            />
            
            <div className="mt-6">
              <p className="font-semibold mb-3">Apakah ini termasuk "Jebakan Pikiran"? (Pilih kalau ada)</p>
              <div className="flex flex-wrap gap-2">
                {THOUGHT_TRAPS.map(trap => (
                  <button
                    key={trap.name}
                    onClick={() => {
                      const newTraps = data.traps.includes(trap.name) 
                        ? data.traps.filter(t => t !== trap.name)
                        : [...data.traps, trap.name];
                      setData({ ...data, traps: newTraps });
                    }}
                    className={`text-left p-3 rounded-xl border transition-all text-sm ${data.traps.includes(trap.name) ? 'bg-sky-100 border-sky-300 dark:bg-sky-900/40 dark:border-sky-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                  >
                    <span className="font-semibold block">{trap.name}</span>
                    <span className="text-xs opacity-70">{trap.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold">Apa yang kamu rasakan?</h3>
            
            <div>
              <p className="mb-3 text-sky-text-muted">Pilih emosi utama:</p>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map(emo => (
                  <button
                    key={emo}
                    onClick={() => setData({ ...data, emotionBefore: { ...data.emotionBefore, name: emo } })}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${data.emotionBefore.name === emo ? 'bg-sky-button text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-sky-text dark:text-sky-dark-text'}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            {data.emotionBefore.name && (
              <div className="pt-4 animate-fade-in">
                <p className="mb-3 text-sky-text-muted">Seberapa kuat perasaan ini? ({data.emotionBefore.intensity}/10)</p>
                <input 
                  type="range" min="1" max="10" 
                  value={data.emotionBefore.intensity}
                  onChange={(e) => setData({ ...data, emotionBefore: { ...data.emotionBefore, intensity: parseInt(e.target.value) } })}
                  className="w-full accent-sky-button"
                />
                <div className="flex justify-between text-xs text-sky-text-muted mt-1 px-1">
                  <span>Ringan</span>
                  <span>Sangat Kuat</span>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold">Bukti yang mendukung pikiran itu</h3>
            <div className="bg-sky-50 dark:bg-slate-900/50 p-4 rounded-xl border border-sky-100 dark:border-slate-700">
              <p className="text-sm font-medium">Bantu jawab:</p>
              <ul className="list-disc pl-5 text-sm text-sky-text-muted mt-1">
                <li>Apa fakta nyata yang bikin kamu berpikir begitu?</li>
                <li>Apakah ada bukti konkrit?</li>
              </ul>
            </div>
            <textarea 
              value={data.evidenceFor}
              onChange={(e) => setData({ ...data, evidenceFor: e.target.value })}
              className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-button outline-none font-serif text-lg resize-none"
              placeholder="Tulis buktinya di sini..."
            />
          </div>
        )}

        {step === 5 && (
          <div className="flex-1 space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold">Bukti yang menentang pikiran itu</h3>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <p className="text-sm font-medium">Coba renungkan:</p>
              <ul className="list-disc pl-5 text-sm text-sky-text-muted mt-1">
                <li>Apakah ada penjelasan lain yang mungkin?</li>
                <li>Kalau sahabatmu mengalami ini, apa yang akan kamu bilang?</li>
                <li>Apakah ini pernah terjadi sebelumnya dan ternyata baik-baik saja?</li>
              </ul>
            </div>
            <textarea 
              value={data.evidenceAgainst}
              onChange={(e) => setData({ ...data, evidenceAgainst: e.target.value })}
              className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-serif text-lg resize-none"
              placeholder="Tulis sudut pandang lain di sini..."
            />
          </div>
        )}

        {step === 6 && (
          <div className="flex-1 space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold">Pikiran yang lebih seimbang</h3>
            <p className="text-sky-text-muted">Rangkum pikiran yang lebih adil dan realistis berdasarkan bukti-bukti tadi.</p>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 opacity-70 italic text-sm">
              Pikiran awal: "{data.firstThought}"
            </div>
            <textarea 
              value={data.balancedThought}
              onChange={(e) => setData({ ...data, balancedThought: e.target.value })}
              className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-button outline-none font-serif text-lg resize-none font-medium text-sky-800 dark:text-sky-200"
              placeholder="Contoh: Dia mungkin sedang sibuk bekerja, ini bukan berarti dia marah padaku."
            />
          </div>
        )}

        {step === 7 && (
          <div className="flex-1 space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold">Bagaimana perasaanmu sekarang?</h3>
            <p className="text-sky-text-muted">Setelah melihat situasinya secara lebih seimbang.</p>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <p className="text-xs text-sky-text-muted">Sebelumnya</p>
                <p className="font-bold text-lg">{data.emotionBefore.name} ({data.emotionBefore.intensity})</p>
              </div>
              <div className="text-2xl opacity-50">→</div>
              <div className="text-center">
                <p className="text-xs text-sky-text-muted">Sekarang</p>
                <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                  {data.emotionAfter.name || '?'} {data.emotionAfter.intensity ? `(${data.emotionAfter.intensity})` : ''}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sky-text-muted">Pilih emosi saat ini:</p>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map(emo => (
                  <button
                    key={emo}
                    onClick={() => setData({ ...data, emotionAfter: { ...data.emotionAfter, name: emo } })}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${data.emotionAfter.name === emo ? 'bg-sky-button text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-sky-text dark:text-sky-dark-text'}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

             {data.emotionAfter.name && (
              <div className="pt-4 animate-fade-in">
                <p className="mb-3 text-sky-text-muted">Seberapa kuat perasaan ini? ({data.emotionAfter.intensity}/10)</p>
                <input 
                  type="range" min="1" max="10" 
                  value={data.emotionAfter.intensity}
                  onChange={(e) => setData({ ...data, emotionAfter: { ...data.emotionAfter, intensity: parseInt(e.target.value) } })}
                  className="w-full accent-emerald-500"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => setStep(step > 1 ? step - 1 : 1)}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            Kembali
          </button>
          
          <button 
            onClick={nextStep}
            className="px-6 py-3 rounded-xl font-medium bg-sky-button hover:bg-sky-500 text-white shadow-sm transition-all active:scale-95"
          >
            {step === totalSteps ? 'Simpan Jurnal' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}
