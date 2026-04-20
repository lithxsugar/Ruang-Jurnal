import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { JOURNAL_TYPES } from '../constants/journalTypes';

// Import forms
import ThoughtsForm from '../components/forms/ThoughtsForm';
import FreewritingForm from '../components/forms/FreewritingForm';
import GratitudeForm from '../components/forms/GratitudeForm';
import MoodForm from '../components/forms/MoodForm';
import SelfCompassionForm from '../components/forms/SelfCompassionForm';
import SolutionForm from '../components/forms/SolutionForm';
import NarrativeForm from '../components/forms/NarrativeForm';

export default function WritePage({ initialType, editId, onBack }: { initialType: string | null, editId: string | null, onBack: () => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(initialType);

  useEffect(() => {
    if (initialType) setSelectedType(initialType);
  }, [initialType]);

  const handleBack = () => {
    if (selectedType && !editId && !initialType) {
      setSelectedType(null); // Keep in Write tab, just show list
    } else {
      onBack(); // Go back to where it came from
    }
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'thoughts': return <ThoughtsForm editId={editId} onSaved={onBack} />;
      case 'freewriting': return <FreewritingForm editId={editId} onSaved={onBack} />;
      case 'gratitude': return <GratitudeForm editId={editId} onSaved={onBack} />;
      case 'mood': return <MoodForm editId={editId} onSaved={onBack} />;
      case 'self_compassion': return <SelfCompassionForm editId={editId} onSaved={onBack} />;
      case 'solution': return <SolutionForm editId={editId} onSaved={onBack} />;
      case 'narrative': return <NarrativeForm editId={editId} onSaved={onBack} />;
      default: return null;
    }
  };

  return (
    <div className="pb-6">
      <header className="pt-2 pb-4 flex items-center gap-3 sticky top-0 bg-sky-bg/80 dark:bg-sky-dark-bg/80 backdrop-blur-md z-10">
        <button 
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">
          {selectedType ? (editId ? 'Edit Jurnal' : JOURNAL_TYPES.find(t => t.id === selectedType)?.title) : 'Pilih Jurnal'}
        </h2>
      </header>

      <AnimatePresence mode="wait">
        {!selectedType ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 pt-2"
          >
            <p className="text-sky-text-muted mb-4">Pilih jenis jurnal yang paling pas untuk perasaanmu saat ini.</p>
            {JOURNAL_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className="w-full text-left bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-start gap-4 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className={`p-4 rounded-xl mt-1 ${type.color}`}>
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{type.title}</h3>
                  <p className="text-sm text-sky-text-muted leading-relaxed">{type.description}</p>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pt-2 h-full"
          >
            {renderForm()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
