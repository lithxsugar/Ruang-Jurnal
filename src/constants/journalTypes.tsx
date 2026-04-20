import { Heart, Brain, PenTool, Sun, Smile, Focus, BookOpen } from 'lucide-react';
import { JournalType } from '../db/db';

export const JOURNAL_TYPES: { id: JournalType; title: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'thoughts',
    title: 'Jurnal Pikiran',
    description: 'Bantu uraikan pikiran negatif dan cari sudut pandang baru yang lebih adil.',
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'freewriting',
    title: 'Menulis Bebas',
    description: 'Tumpahkan semua yang ada di pikiran tanpa aturan. Lepaskan bebanmu.',
    icon: <PenTool className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'gratitude',
    title: 'Jurnal Syukur',
    description: 'Latih diri menemukan hal baik sekecil apa pun hari ini.',
    icon: <Sun className="w-5 h-5" />,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'mood',
    title: 'Cek Perasaan',
    description: 'Kenali dan sadari emosi apa yang sedang dominan hari ini.',
    icon: <Smile className="w-5 h-5" />,
    color: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'self_compassion',
    title: 'Baik ke Diri Sendiri',
    description: 'Berhenti menghakimi, mulai peluk dirimu seperti kamu memeluk sahabatmu.',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'solution',
    title: 'Jurnal Solusi',
    description: 'Geser fokus dari masalah ke kemungkinan dan kekuatan yang kamu miliki.',
    icon: <Focus className="w-5 h-5" />,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'narrative',
    title: 'Cerita Hidupku',
    description: 'Pisahkan dirimu dari masalah. Kamu BUKAN masalahmu.',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-violet-100 text-violet-700',
  }
];
