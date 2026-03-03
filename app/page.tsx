'use client';

import { useState } from 'react';
import useSWR from 'swr';

// --- ICONS ---
// Replaced generic SchoolIcon with your custom emblem image below in the component
const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 1.11L8.09 9.91a16 16 0 0 0 6 6l2.25-1.51a2 2 0 0 1 1.11-.45 12.84 12.84 0 0 0 2.81.72 2 2 0 0 1 1.72 2z"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const ContactIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

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

  const { data } = useSWR(baseId && tableId ? apiUrl : null, fetcher, { refreshInterval: 5000 });
  const records = data?.records || [];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-orange-600 text-white p-6 flex flex-col gap-6 shadow-2xl z-50">
        
        {/* UPDATED LOGO CONTAINER WITH ACTUAL EMBLEM */}
        <div className="flex flex-col items-center mb-4">
          <div className="bg-white rounded-2xl p-2 shadow-lg w-full aspect-square flex flex-col items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Kylo Roys Emblem" 
              className="w-4/5 h-4/5 object-contain"
              /* Optional: Ensure you have your emblem saved as logo.png in the /public folder */
            />
          </div>
          <p className="mt-3 text-white text-center font-black text-sm uppercase tracking-widest">Kylo Roys</p>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { name: 'Dashboard', icon: <LayoutGridIcon /> },
            { name: 'Calls', icon: <PhoneIcon /> },
            { name: 'Contacts', icon: <ContactIcon /> },
            { name: 'Settings', icon: <SettingsIcon /> }
          ].map((item) => (
            <button 
              key={item.name}
              onClick={() => { setActiveTab(item.name); setView('main'); }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all w-full text-left ${activeTab === item.name ? 'bg-white/20 font-bold shadow-inner' : 'hover:bg-white/10'}`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-12">
        <header className="mb-10 flex justify-between items-center">
            <h1 className="text-4xl font-black tracking-tight">{activeTab}</h1>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse border border-emerald-100">
                ● Live Data Active
            </div>
        </header>

        {activeTab === 'Dashboard' && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => setView('main')}
                className="flex items-center justify-center gap-3 h-20 bg-white border-2 border-orange-500 text-orange-500 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all shadow-sm"
              >
                <PhoneIcon /> Log Inbound Call
              </button>
              <button 
                onClick={() => setView('outbound_call')}
                className="flex items-center justify-center gap-3 h-20 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:scale-[1.01] active:scale-95 transition-all"
              >
                Start Outbound Call →
              </button>
            </div>

            {view === 'outbound_call' ? (
              <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-200 text-center space-y-4">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <PhoneIcon />
                </div>
                <h2 className="text-2xl font-black text-slate-400">0 Outbound Calls</h2>
                <p className="text-slate-400 max-w-xs mx-auto">Vapi Outbound triggers have not been configured for this environment yet.</p>
                <button onClick={() => setView('main')} className="text-orange-500 font-bold underline">Back to Dashboard</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Calls Today</p>
                    <p className="text-4xl font-black">{records.length} <span className="text-slate-300">/ 35</span></p>
                    <div className="w-full bg-slate-100 h-3 mt-6 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${Math.min((records.length/35)*100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Success Rate</p>
                    <p className="text-4xl font-black">92%</p>
                    <div className="w-full bg-slate-100 h-3 mt-6 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[92%]"></div>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-orange-700 uppercase mb-2 italic">Sarah AI Status</p>
                    <p className="font-bold text-orange-900 leading-tight">Sarah is currently booking tours for the upcoming semester.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50">
                    <h2 className="text-2xl font-black">Recent Activity</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <tr>
                          <th className="px-10 py-5">Parent Name</th>
                          <th className="px-10 py-5">Phone</th>
                          <th className="px-10 py-5">Grade</th>
                          <th className="px-10 py-5">AI Summary</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {records.map((r: any) => (
                          <tr key={r.id} className="hover:bg-orange-50/30 transition-all cursor-default">
                            <td className="px-10 py-6 font-extrabold text-slate-800">{r.fields['Parent Name']}</td>
                            <td className="px-10 py-6 text-sm font-medium text-slate-400 italic">{r.fields['Parent Phone']}</td>
                            <td className="px-10 py-6">
                              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black rounded-lg uppercase">
                                {r.fields['Student Grade']}
                              </span>
                            </td>
                            <td className="px-10 py-6 text-xs text-slate-500 max-w-md leading-relaxed">
                              {r.fields['Call Summary'] || "Lead captured. Sarah is analyzing the transcript..."}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'Calls' && (
            <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-xl text-center">
                <h2 className="text-2xl font-black mb-4">Inbound Call Logs</h2>
                <p className="text-slate-400">Detailed call recordings and AI transcripts will appear here.</p>
            </div>
        )}

        {activeTab === 'Contacts' && (
            <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-xl text-center">
                <h2 className="text-2xl font-black mb-4">Contact Management</h2>
                <p className="text-slate-400">Manage your lead directory and parent information here.</p>
            </div>
        )}

        {activeTab === 'Settings' && (
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl">
                <h2 className="text-2xl font-black mb-8 underline decoration-orange-500 underline-offset-8">System Configuration</h2>
                <div className="space-y-6 max-w-md">
                    <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                        <span className="font-bold">Airtable Sync</span>
                        <span className="text-emerald-500 font-bold">ACTIVE</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                        <span className="font-bold">AI Voice (Sarah)</span>
                        <span className="text-emerald-500 font-bold">READY</span>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}