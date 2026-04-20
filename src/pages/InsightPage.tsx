import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { format, subDays, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { JOURNAL_TYPES } from '../constants/journalTypes';

export default function InsightPage() {
  const entries = useLiveQuery(() => db.entries.toArray());

  if (!entries) return <div className="p-4 text-center">Memuat...</div>;

  const totalEntries = entries.length;
  
  // Mood / Emotion Trends
  const moodEntries = entries.filter(e => e.type === 'mood').slice(-7);
  const moodData = moodEntries.map(e => ({
    date: format(e.createdAt, 'EE', { locale: id }), 
    intensity: e.mood?.intensity || 0,
    emotion: e.mood?.level1
  }));

  // Heatmap consistency (last 14 days)
  const today = new Date();
  const last14Days = Array.from({ length: 14 }).map((_, i) => subDays(today, 13 - i));
  
  const heatmapData = last14Days.map(date => ({
    date,
    count: entries.filter(e => isSameDay(new Date(e.createdAt), date)).length
  }));

  // Journal Type Distribution
  const typeCount = entries.reduce((acc, current) => {
    acc[current.type] = (acc[current.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(typeCount).map(([key, value]) => ({
    name: JOURNAL_TYPES.find(t => t.id === key)?.title || key,
    value
  }));
  const PIE_COLORS = ['#87CEEB', '#5BA4CF', '#a5c8e1', '#b3d4e8', '#c9e2f0', '#dcf0fa', '#a1b4c2'];

  // Time of Day
  const timeOfDay = entries.reduce((acc, current) => {
    const hour = new Date(current.createdAt).getHours();
    if (hour >= 5 && hour < 12) acc.Pagi++;
    else if (hour >= 12 && hour < 15) acc.Siang++;
    else if (hour >= 15 && hour < 18) acc.Sore++;
    else acc.Malam++;
    return acc;
  }, { Pagi: 0, Siang: 0, Sore: 0, Malam: 0 });

  const bestTime = Object.entries(timeOfDay)
    .filter(([_, val]) => val > 0)
    .sort((a, b) => b[1] - a[1])[0];

  // Most common emotions (from thoughts and mood)
  const emotionCounts = entries.reduce((acc, current) => {
    let emo: string | undefined;
    if (current.type === 'mood') emo = current.content.level2 || current.mood?.level1;
    if (current.type === 'thoughts') emo = current.content.emotionBefore?.name;
    
    if (emo) {
      acc[emo] = (acc[emo] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="pb-6 animate-fade-in space-y-6">
      <header className="pt-4">
        <h1 className="text-3xl font-bold font-serif mb-1 text-sky-text dark:text-sky-dark-text">Insight.</h1>
        <p className="text-sky-text-muted">Mengenal dirimu lebih baik melalui data.</p>
      </header>

      {totalEntries === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-sky-300 dark:border-sky-700 text-sky-text-muted">
          <p>Mulai menulis jurnal untuk melihat insight tentang dirimu.</p>
        </div>
      ) : (
        <>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-sky-primary text-white rounded-[24px] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <span className="text-xs uppercase tracking-widest opacity-90 mb-2 block">Total Jurnal</span>
              <p className="text-3xl font-bold font-serif">{totalEntries}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-5 shadow-sm border border-sky-50 dark:border-slate-700">
              <span className="text-xs uppercase tracking-widest text-sky-text-muted mb-2 block">Waktu Favorit</span>
              <p className="text-xl font-bold text-sky-button dark:text-sky-dark-accent">{bestTime ? bestTime[0] : '-'}</p>
              <p className="text-xs text-sky-text-muted mt-1">{bestTime ? `${bestTime[1]} entri` : ''}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-5 shadow-sm border border-sky-50 dark:border-slate-700 col-span-2">
              <span className="text-xs uppercase tracking-widest text-sky-text-muted mb-2 block">Emosi Paling Sering Muncul</span>
              <div className="flex gap-2 mt-2">
                {topEmotions.length > 0 ? topEmotions.map(([emo, count]) => (
                  <div key={emo} className="bg-sky-50 dark:bg-sky-900/40 text-sky-button dark:text-sky-dark-accent px-3 py-1 rounded-lg text-sm font-medium border border-sky-100 dark:border-sky-800">
                    {emo} <span className="opacity-50 text-xs ml-1">({count})</span>
                  </div>
                )) : <span className="text-sm text-sky-text-muted">Belum cukup data emosi</span>}
              </div>
            </div>
          </div>

          {/* Konsistensi */}
          <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-sky-50 dark:border-slate-700">
            <h3 className="font-bold font-serif text-lg mb-4 text-sky-text dark:text-sky-dark-text flex items-center justify-between">
              Konsistensi Menulis
              <span className="text-xs font-sans font-normal text-sky-text-muted bg-sky-bg dark:bg-sky-dark-bg px-3 py-1 rounded-full">14 Hari Terakhir</span>
            </h3>
            <div className="flex justify-between items-end h-32 gap-1 pb-2">
              {heatmapData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 relative group">
                  <div 
                    className={`w-full rounded-md transition-all min-h-[4px] ${day.count > 0 ? 'bg-sky-button dark:bg-sky-dark-accent' : 'bg-slate-100 dark:bg-slate-700'}`}
                    style={{ height: day.count > 0 ? `${Math.min(100, Math.max(15, day.count * 25))}%` : '4px' }}
                  />
                  <span className="text-[10px] text-sky-text-muted font-mono">{format(day.date, 'dd')}</span>
                  
                  {/* Tooltip */}
                  {day.count > 0 && (
                    <div className="absolute -top-8 bg-sky-800 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-opacity">
                      {day.count} jurnal
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Graphs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Journal Type Pie Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-sky-50 dark:border-slate-700">
              <h3 className="font-bold font-serif text-lg mb-4 text-sky-text dark:text-sky-dark-text">Distribusi Jenis Jurnal</h3>
              <div className="h-48 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}
                      itemStyle={{color: '#2C3E50', fontWeight: 'bold'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs font-medium text-sky-text-muted">
                 {pieData.map((entry, index) => (
                   <div key={index} className="flex items-center gap-1.5">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                     {entry.name}
                   </div>
                 ))}
              </div>
            </div>

            {/* Mood Trend Line Chart */}
            {moodData.length > 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-sky-50 dark:border-slate-700">
                <h3 className="font-bold font-serif text-lg mb-4 text-sky-text dark:text-sky-dark-text flex justify-between items-center">
                  Intensitas Emosi
                  <span className="text-xs font-sans font-normal text-sky-text-muted bg-sky-bg dark:bg-sky-dark-bg px-3 py-1 rounded-full">7 Entri Terakhir</span>
                </h3>
                <div className="h-48 w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                      <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 10]} hide />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}
                        labelStyle={{fontWeight: 'bold', color: '#2C3E50'}}
                        formatter={(value: any, name: any, props: any) => [props.payload.emotion || `${value}/10`, 'Detail']}
                      />
                      <Line type="monotone" dataKey="intensity" name="Intensitas" stroke="#5BA4CF" strokeWidth={3} dot={{r: 4, fill: '#5BA4CF'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
               <div className="bg-sky-50/50 dark:bg-slate-800 rounded-[24px] p-6 border border-dashed border-sky-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                 <span className="text-4xl mb-3 opacity-50">🧭</span>
                 <p className="text-sm font-medium text-sky-text-muted">Isi "Cek Perasaan" untuk melihat grafik naik turun mood kamu di sini.</p>
               </div>
            )}
          </div>

          <div className="pt-6 flex justify-center border-t border-sky-100 dark:border-slate-700/50 pb-8">
            <button 
              onClick={async () => {
                const allEntries = await db.entries.toArray();
                const blob = new Blob([JSON.stringify(allEntries, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup_ruang_jurnal_${format(new Date(), 'yyyyMMdd')}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="text-sm font-medium text-sky-text-muted hover:text-sky-button transition-colors px-6 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700"
            >
              Export Data (JSON)
            </button>
          </div>
        </>
      )}

    </div>
  );
}
