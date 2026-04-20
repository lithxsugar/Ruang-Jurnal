import Dexie, { type Table } from 'dexie';

export type JournalType = 
  | 'thoughts' 
  | 'freewriting' 
  | 'gratitude' 
  | 'mood' 
  | 'self_compassion' 
  | 'solution' 
  | 'narrative';

export interface JournalEntry {
  id?: string;
  createdAt: number;
  updatedAt: number;
  editCount: number;
  type: JournalType;
  content: any;
  tags?: string[];
  mood?: { level1: string; level2?: string; intensity?: number };
  isDraft?: boolean;
  linkedEntryId?: string;
}

export interface UserStats {
  id?: number;
  streak: number;
  lastJournalDate: number;
  totalEntries: number;
}

export class JournalDB extends Dexie {
  entries!: Table<JournalEntry, string>;
  stats!: Table<UserStats, number>;
  
  constructor() {
    super('RuangJurnalDB');
    this.version(1).stores({
      entries: 'id, createdAt, type, isDraft, linkedEntryId',
      stats: 'id'
    });
  }
}

export const db = new JournalDB();

// Helper to generate IDs
export const generateId = () => crypto.randomUUID();
