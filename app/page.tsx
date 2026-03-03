'use client';

import { useState } from 'react';
import useSWR from 'swr';

// --- ICONS (Styled to match design) ---
const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 1.11L8.09 9.91a16 16 0 0 0 6 6l2.25-1.51a2 2 0 0 1 1.11-.45 12.84 12.84 0 0 0 2.81.72 2 2 0 0 1 1.72 2z"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;

const fetcher = (url: string) => {
  const token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json());
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [view, setView] = useState('main'); 

  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const tableId = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID;
  const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  const { data, isLoading } = useSWR(baseId && tableId ? apiUrl : null, fetcher, { refreshInterval: 5000 });
  const records = data?.records || [];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans text-slate-900 antialiased">
      
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-10 z-50">
        <div className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter text-[#EA580C]">
          <div className="bg-[#EA580C] text-white p-2 rounded-xl shadow-lg shadow-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          Uplog
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'Dashboard', icon: <LayoutGridIcon />, label: 'Dashboard' },
            { id: 'Calls', icon: <PhoneIcon />, label: 'Calls' },
            { id: 'Contacts', icon: <UsersIcon />, label: 'Contacts' },
            { id: 'Settings', icon: <SettingsIcon />, label: 'Settings' },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setView('main'); }}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all font-bold ${activeTab === item.id ? 'bg-[#EA580C] text-white shadow-lg shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-12">
        <header className="mb-12 flex justify-between items-end">
            <div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900">Communication Hub</h1>
                <p className="text-slate-500 font-medium mt-2">Manage your school inbound and outbound leads.</p>
            </div>
            <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-[0.15em] border border-emerald-100 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Live Sync Active
            </div>
        </header>

        {activeTab === 'Dashboard' && (
          <div className="space-y-12">
            
            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-8">
              <button 
                onClick={() => setView('main')}
                className="flex items-center justify-center gap-4 h-24 bg-white border-2 border-[#EA580C] text-[#EA580C] rounded-[2rem] font-black text-xl hover:bg-orange-50 transition-all shadow-xl shadow-orange-500/5"
              >
                <PhoneIcon /> Log Inbound Call
              </button>
              <button 
                onClick={() => setView('outbound_call')}
                className="flex items-center justify-center gap-4 h-24 bg-[#EA580C] text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Start Outbound Call →
              </button>
            </div>

            {/* Quick Message Bar */}
            <div className="w-full bg-white border border-slate-200 p-6 rounded-3xl text-center text-[#C05621] font-bold text-lg shadow-sm cursor-pointer hover:border-[#EA580C] transition-colors">
                Quick Message Parent
            </div>

            {view === 'outbound_call' ? (
              <div className="bg-white p-24 rounded-[3.5rem] border-4 border-dashed border-slate-100 text-center space-y-6">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <PhoneIcon />
                </div>
                <h2 className="text-4xl font-black text-slate-300 tracking-tight">0 Outbound Calls</h2>
                <p className="text-slate-400 max-w-sm mx-auto font-medium">Vapi Outbound triggers have not been configured for this environment yet.</p>
                <button onClick={() => setView('main')} className="text-[#EA580C] font-black text-lg underline decoration-2 underline-offset-8">Return to Dashboard</button>
              </div>
            ) : (
              <>
                {/* STATS */}
                <div className="grid grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Calls Today</p>
                    <p className="text-5xl font-black text-slate-900">{records.length} <span className="text-slate-200 text-3xl">/ 35</span></p>
                    <div className="w-full bg-slate-50 h-4 mt-8 rounded-full overflow-hidden">
                        <div className="bg-[#EA580C] h-full transition-all duration-1000" style={{ width: `${(records.length/35)*100}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Success Rate</p>
                    <p className="text-5xl font-black text-slate-900">92%</p>
                    <div className="w-full bg-slate-50 h-4 mt-8 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[92%]"></div>
                    </div>
                  </div>

                  <div className="bg-[#FFF7ED] p-10 rounded-[2.5rem] border border-[#FFEDD5] flex flex-col justify-center">
                    <p className="text-xs font-black text-[#EA580C] uppercase tracking-[0.2em] mb-3 italic">Sarah AI Status</p>
                    <p className="font-bold text-[#7C2D12] text-lg leading-snug italic">"Sarah is currently booking tours for the upcoming semester via phone."</p>
                  </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-3xl font-black tracking-tight">Recent Activity</h2>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-10 py-6 text-center w-20">#</th>
                        <th className="px-6 py-6">Parent Name</th>
                        <th className="px-6 py-6">Phone Number</th>
                        <th className="px-6 py-6">Student Grade</th>
                        <th className="px-10 py-6">AI Summary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.map((r: any, idx: number) => (
                        <tr key={r.id} className="hover:bg-orange-50/30 transition-all group">
                          <td className="px-10 py-8 text-center font-bold text-slate-300">{idx + 1}</td>
                          <td className="px-6 py-8 font-black text-slate-900 text-lg">{r.fields['Parent Name']}</td>
                          <td className="px-6 py-8 text-slate-400 font-bold italic">{r.fields['Parent Phone']}</td>
                          <td className="px-6 py-8">
                            <span className="px-4 py-2 bg-[#FFEDD5] text-[#EA580C] text-xs font-black rounded-full uppercase tracking-tighter shadow-sm">
                              {r.fields['Student Grade']}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-sm text-slate-500 max-w-md leading-relaxed italic font-medium">
                            {r.fields['Call Summary'] || "Sarah is processing the transcript..."}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isLoading && (
                    <div className="p-20 text-center font-black text-slate-200 text-3xl animate-pulse">
                        SYNCING DATABASE...
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* OTHER SCREENS */}
        {activeTab === 'Calls' && (
            <div className="bg-white p-24 rounded-[3rem] border border-slate-100 shadow-xl text-center space-y-4">
                <h2 className="text-3xl font-black">Inbound Call Logs</h2>
                <p className="text-slate-400 font-medium">Detailed call recordings and AI transcripts will appear here shortly.</p>
            </div>
        )}

        {activeTab === 'Settings' && (
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl">
                <h2 className="text-3xl font-black mb-10 underline decoration-[#EA580C] underline-offset-[12px] decoration-4">System Configuration</h2>
                <div className="space-y-6 max-w-md">
                    <div className="p-6 bg-slate-50 rounded-[1.5rem] flex justify-between items-center border border-slate-100">
                        <span className="font-black text-lg text-slate-700">Airtable Sync</span>
                        <span className="bg-emerald-100 text-emerald-600 px-4 py-1 rounded-full font-black text-xs tracking-widest">ACTIVE</span>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[1.5rem] flex justify-between items-center border border-slate-100">
                        <span className="font-black text-lg text-slate-700">AI Voice (Sarah)</span>
                        <span className="bg-emerald-100 text-emerald-600 px-4 py-1 rounded-full font-black text-xs tracking-widest">READY</span>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}