'use client';

import { useState } from 'react';
import useSWR from 'swr';

// --- ICONS ---
const SchoolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="M18 10V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6"/><path d="M18 10a2 2 0 1 1 0 4h-1v2a2 2 0 1 1 0 4H7a2 2 0 1 1 0-4V14a2 2 0 1 1 0-4H7Z"/><path d="M12 6h.01"/><path d="M12 10h.01"/></svg>;
const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 1.11L8.09 9.91a16 16 0 0 0 6 6l2.25-1.51a2 2 0 0 1 1.11-.45 12.84 12.84 0 0 0 2.81.72 2 2 0 0 1 1.72 2z"/></svg>;
const OutboundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'rotate(135deg)'}}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

const fetcher = (url: string) => {
  const token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.json());
};

const NavItem = ({ Icon, label, active = false }: { Icon: any; label: string; active?: boolean }) => (
  <div className={`flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-medium transition-colors cursor-pointer ${active ? 'bg-[#ea580c] text-white shadow-lg' : 'text-[#f97316] hover:bg-[#ea580c]/10'}`}>
    <Icon /> {label}
  </div>
);

export default function DashboardPage() {
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const tableId = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID;
  const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  const { data, isLoading } = useSWR(baseId && tableId ? apiUrl : null, fetcher, { refreshInterval: 5000 });
  const records = data?.records || [];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex text-slate-900 font-sans">
      {/* Sidebar - Matching Gemini_Generated_Image_4qs3dn4qs3dn4qs3.jpg */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 flex flex-col">
        <div className="flex items-center gap-3 text-2xl font-bold text-[#ea580c] mb-12 uppercase tracking-tighter">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ea580c] text-white shadow-lg">
            <SchoolIcon />
          </div>
          Uplog
        </div>
        <nav className="space-y-3 flex-1">
          <NavItem Icon={LayoutGridIcon} label="Dashboard" active />
          <NavItem Icon={PhoneIcon} label="Calls" />
        </nav>
        <div className="mt-auto p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-200" />
          <div className="text-sm font-semibold">Sarah J. <span className="text-xs block text-slate-400 font-normal">Admin</span></div>
        </div>
      </aside>

      <main className="flex-1">
        <header className="px-12 py-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <h1 className="text-3xl font-extrabold tracking-tight">Communication Hub</h1>
          <div className="text-xs font-mono text-slate-400">Live Connection: {records.length} Leads found</div>
        </header>

        <div className="p-12 space-y-10">
          {/* Action Buttons from Uplog design */}
          <div className="grid gap-6 grid-cols-2">
            <button className="h-16 flex items-center justify-center gap-3 rounded-2xl border-2 border-[#f97316] text-[#f97316] font-bold hover:bg-orange-50 transition-all">
              <PhoneIcon /> Log Inbound Call
            </button>
            <button className="h-16 flex items-center justify-center gap-3 rounded-2xl bg-[#f97316] text-white font-bold shadow-lg shadow-orange-100 hover:bg-[#ea580c] transition-all">
              <OutboundIcon /> Start Outbound Call
            </button>
          </div>

          {/* Key Stats Row - New Section */}
          <div className="grid grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Calls Today</p>
                <p className="text-2xl font-black">{records.length} / 35</p>
                <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full" style={{width: `${(records.length/35)*100}%`}}></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Success Rate</p>
                <p className="text-2xl font-black">92%</p>
                <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{width: '92%'}}></div>
                </div>
             </div>
             <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 shadow-sm">
                <p className="text-xs font-bold text-orange-700 uppercase mb-2">Status</p>
                <p className="text-sm font-semibold text-orange-900 leading-tight">Sarah AI is currently handling inbound school inquiries.</p>
             </div>
          </div>

          {/* Table Container - Inspired by Uplog Activity Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
              <div className="flex gap-4">
                 <input type="text" placeholder="Search leads..." className="text-xs border border-slate-100 rounded-xl px-4 py-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-200" />
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[11px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-10 py-5">Parent Name</th>
                  <th className="px-10 py-5">Phone</th>
                  <th className="px-10 py-5">Grade</th>
                  <th className="px-10 py-5">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-10 py-6 font-bold text-slate-700">{r.fields['Parent Name']}</td>
                    <td className="px-10 py-6 text-sm text-slate-500">{r.fields['Parent Phone']}</td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-orange-100 text-[#ea580c] rounded-lg text-xs font-black">
                        {r.fields['Student Grade'] || 'N/A'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-xs text-slate-400 max-w-xs truncate">
                      {r.fields['Call Summary'] || 'Processing call logs...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isLoading && <div className="p-20 text-center text-slate-400 animate-pulse font-bold">Syncing AI Conversations...</div>}
          </div>
        </div>
      </main>
    </div>
  );
}