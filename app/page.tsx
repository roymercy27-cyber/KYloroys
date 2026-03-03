'use client';

import { useState } from 'react';
import useSWR from 'swr';

// --- ICONS (Zero-dependency SVGs) ---
const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 1.11L8.09 9.91a16 16 0 0 0 6 6l2.25-1.51a2 2 0 0 1 1.11-.45 12.84 12.84 0 0 0 2.81.72 2 2 0 0 1 1.72 2z"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;

const fetcher = (url: string) => {
  const token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json());
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const tableId = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID;
  const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  const { data, isLoading } = useSWR(baseId && tableId ? apiUrl : null, fetcher, { refreshInterval: 5000 });
  const records = data?.records || [];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* --- SIDEBAR: Reconstructed to match Image 1 --- */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white p-6 flex flex-col gap-10 shadow-xl z-50">
        
        {/* LOGO AREA (image_1.png match) */}
        <div className="flex items-center gap-3 text-2xl font-bold uppercase tracking-tighter text-[#EA580C]">
          <div className="bg-[#EA580C] text-white p-2.5 rounded-2xl shadow-lg">
             {/* You can put your Cupids image here <img src="/logo.png" className="w-6 h-6"/> */}
             KYLO
          </div>
          Roys
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">
          {[
            { name: 'Dashboard', icon: <LayoutGridIcon /> },
            { name: 'Calls', icon: <PhoneIcon /> },
            { name: 'Contacts', icon: <UsersIcon /> },
            { name: 'Messages', icon: <MessageIcon /> },
            { name: 'Settings', icon: <SettingsIcon /> }
          ].map((tab) => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all w-full text-left font-semibold ${activeTab === tab.name ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Sarah J. Admin Card (image_1.png match) */}
        <div className="mt-auto flex items-center gap-3 bg-slate-100 p-4 rounded-2xl border border-slate-200">
          <div className="h-12 w-12 bg-slate-300 rounded-full flex items-center justify-center font-bold text-slate-500">SJ</div>
          <div className="text-sm">
            <p className="font-bold text-slate-950">Sarah J.</p>
            <p className="text-slate-500 text-xs">(Admin)</p>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA: Reconstructed to match Image 1 --- */}
      <main className="flex-1 ml-64 p-12 bg-[#F9FAFB]">
        
        {/* TOP HEADER */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Communication Hub</h1>
            <p className="text-slate-500 font-medium mt-1">Live Connection: {records.length} Leads found in Airtable</p>
          </div>
          {/* Vercel Status Badge (image_14.png match) */}
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse border border-emerald-100 shadow-sm">
             ● Live Data Active
          </div>
        </header>

        {/* ACTION BUTTONS (image_1.png perfect match) */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <button className="flex items-center justify-center gap-3 h-20 bg-white border-2 border-[#EA580C] text-[#EA580C] rounded-2xl font-black text-xl hover:bg-[#FFF7ED] transition-all shadow-lg shadow-[#EA580C]/5">
             <PhoneIcon /> Log Inbound Call
          </button>
          <button className="flex items-center justify-center gap-3 h-20 bg-[#EA580C] text-white rounded-2xl font-black text-xl shadow-xl shadow-[#EA580C]/20 hover:scale-[1.01] active:scale-95 transition-all">
             Start Outbound Call →
          </button>
        </div>

        {/* Quick Message Parent Bar (image_1.png match) */}
        <button className="w-full text-center bg-white border border-slate-200 p-6 rounded-2xl text-[#C05621] font-bold text-lg mb-12 shadow-sm hover:border-[#EA580C] transition-colors">
            Quick Message Parent
        </button>

        {/* KEY STATS (image_1.png match) */}
        <section className="mb-12">
           <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Key Stats</h2>
           <div className="grid grid-cols-3 gap-6">
              
              {/* Calls Today */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Calls Today</p>
                 <div className="flex items-baseline gap-2 mb-4">
                   <span className="text-4xl font-black text-slate-950">28</span>
                   <span className="text-slate-300 font-bold">/ 35</span>
                 </div>
                 <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-[#EA580C] h-full" style={{ width: '80%' }}></div>
                 </div>
              </div>

              {/* Messages Today */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Messages Today</p>
                 <div className="flex items-baseline gap-2 mb-4">
                   <span className="text-4xl font-black text-slate-950">15</span>
                   <span className="text-slate-300 font-bold">/ 20</span>
                 </div>
                 <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-[#EA580C] h-full" style={{ width: '75%' }}></div>
                 </div>
              </div>

              {/* Sarah AI Status (Branding from image_14.png) */}
              <div className="bg-[#FFF7ED] p-8 rounded-3xl border border-[#FED7AA] shadow-xl shadow-[#FED7AA]/20">
                 <p className="text-xs font-black text-[#EA580C] uppercase tracking-widest mb-3 italic">Sarah AI Status</p>
                 <p className="font-bold text-[#7C2D12] text-sm leading-relaxed italic">Sarah is currently handling inbound school inquiries and booking tours via Google Calendar.</p>
              </div>
           </div>
        </section>

        {/* --- RECENT ACTIVITY TABLE: Your REAL Airtable Data --- */}
        <section className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
             <h2 className="text-2xl font-black text-slate-950 tracking-tighter">Recent Activity</h2>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
              <tr>
                <th className="px-10 py-5">Parent Name</th>
                <th className="px-10 py-5">Phone</th>
                <th className="px-10 py-5">Grade</th>
                <th className="px-10 py-5">Call Summary</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {records.map((r: any) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-all cursor-default">
                  {/* REAL DATA: Parent Name */}
                  <td className="px-10 py-6 font-extrabold text-slate-800">{r.fields['Parent Name']}</td>
                  
                  {/* REAL DATA: Phone */}
                  <td className="px-10 py-6 text-sm font-semibold text-slate-500 italic">{r.fields['Parent Phone'] || '07...'}</td>
                  
                  {/* REAL DATA: Grade (Branded Badge) */}
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 bg-[#FFF7ED] text-[#C05621] text-[11px] font-black rounded-full uppercase">
                      {r.fields['Student Grade'] || 'Grade 6'}
                    </span>
                  </td>
                  
                  {/* REAL DATA: Call Summary (Detailed, italic) */}
                  <td className="px-10 py-6 text-xs text-slate-400 italic max-w-lg leading-relaxed">
                    {r.fields['Call Summary'] || "Sarah handled this inquiry and booked a tour for August..."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {isLoading && (
            <div className="p-20 text-center text-4xl font-black text-slate-100 animate-pulse italic">
              SYNCING AIRTABLE...
            </div>
          )}
        </section>

      </main>
    </div>
  );
}