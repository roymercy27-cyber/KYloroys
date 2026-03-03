'use client';

import { useState } from 'react';
import useSWR from 'swr';

// --- SVGs for Icons (Zero dependency styling) ---
const SchoolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="M18 10V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6"/><path d="M18 10a2 2 0 1 1 0 4h-1v2a2 2 0 1 1 0 4H7a2 2 0 1 1 0-4V14a2 2 0 1 1 0-4H7Z"/></svg>;
const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 1.11L8.09 9.91a16 16 0 0 0 6 6l2.25-1.51a2 2 0 0 1 1.11-.45 12.84 12.84 0 0 0 2.81.72 2 2 0 0 1 1.72 2z"/></svg>;

const fetcher = (url: string) => {
  const token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.json());
};

export default function DashboardPage() {
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const tableId = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID;
  const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  const { data, isLoading } = useSWR(baseId && tableId ? apiUrl : null, fetcher, { refreshInterval: 5000 });
  const records = data?.records || [];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Uplog Inspired */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#f97316] text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <div className="bg-white text-[#f97316] p-2 rounded-xl"><SchoolIcon /></div>
          Uplog
        </div>
        <nav className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-white/20 p-3 rounded-xl cursor-pointer font-semibold">
            <LayoutGridIcon /> Dashboard
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10">
            <PhoneIcon /> Calls
          </div>
        </nav>
        <div className="mt-auto flex items-center gap-3 bg-black/10 p-4 rounded-2xl">
           <div className="h-10 w-10 bg-orange-200 rounded-full border-2 border-white/50" />
           <div className="text-sm">
             <p className="font-bold">Sarah J.</p>
             <p className="text-white/70 text-xs">(Admin)</p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Communication Hub</h1>
            <p className="text-slate-500 font-medium italic">Live Connection: {records.length} Leads found in Airtable</p>
          </div>
        </header>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <button className="flex items-center justify-center gap-3 h-20 bg-white border-2 border-[#f97316] text-[#f97316] rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all">
             <PhoneIcon /> Log Inbound Call
          </button>
          <button className="flex items-center justify-center gap-3 h-20 bg-[#f97316] text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:scale-[1.01] active:scale-95 transition-all">
             Start Outbound Call →
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Calls Today</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{records.length}</span>
              <span className="text-slate-400 font-bold">/ 35</span>
            </div>
            <div className="w-full bg-slate-100 h-3 mt-4 rounded-full overflow-hidden">
               <div className="bg-[#f97316] h-full" style={{ width: `${(records.length/35)*100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Success Rate</p>
            <span className="text-3xl font-black">92%</span>
            <div className="w-full bg-slate-100 h-3 mt-4 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full w-[92%]"></div>
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
            <p className="text-xs font-black text-orange-700 uppercase mb-2">Sarah AI Status</p>
            <p className="text-sm font-semibold text-orange-900 leading-relaxed italic">Currently monitoring all school inquiries and booking tours via Google Calendar.</p>
          </div>
        </div>

        {/* Table - Rebuilt to look like Image 2 */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h2 className="text-2xl font-black">Recent Activity</h2>
             <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-tighter italic">● Sarah AI Live</div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-10 py-5">Parent Name</th>
                <th className="px-10 py-5">Phone</th>
                <th className="px-10 py-5">Grade</th>
                <th className="px-10 py-5">Call Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r: any) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6 font-bold text-slate-800">{r.fields['Parent Name']}</td>
                  <td className="px-10 py-6 text-sm font-medium text-slate-500">{r.fields['Parent Phone'] || '0721...'}</td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 bg-orange-100 text-[#f97316] text-[10px] font-black rounded-lg uppercase">
                      {r.fields['Student Grade'] || 'Grade 6'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-xs text-slate-400 italic max-w-sm truncate leading-relaxed">
                    {r.fields['Call Summary'] || "The parent called to book a tour. Sarah gathered the name and student details..."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <div className="p-20 text-center font-black text-slate-200 animate-pulse text-4xl italic">SYNCING...</div>}
        </div>
      </main>
    </div>
  );
}