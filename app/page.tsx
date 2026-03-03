'use client';

import { useState } from 'react';
// Note: useSWR is commented out for now. Reactivate it once your
// Airtable tokens are verified and the visual UI is confirmed.
// import useSWR from 'swr';

// --- SVGs for Icons ---
// These are simple vectors so the code has zero extra dependencies.
const SchoolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="M18 10V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6"/><path d="M18 10a2 2 0 1 1 0 4h-1v2a2 2 0 1 1 0 4H7a2 2 0 1 1 0-4V14a2 2 0 1 1 0-4H7Z"/></svg>;
const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 1.11L8.09 9.91a16 16 0 0 0 6 6l2.25-1.51a2 2 0 0 1 1.11-.45 12.84 12.84 0 0 0 2.81.72 2 2 0 0 1 1.72 2z"/></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;

// --- Helper Components ---
const NavItem = ({ Icon, label, active = false }: { Icon: any; label: string; active?: boolean }) => (
  <div className={`flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-medium transition-colors cursor-pointer ${active ? 'bg-orange-600 text-white shadow-lg' : 'text-white/80 hover:bg-orange-600/50'}`}>
    <Icon />
    {label}
  </div>
);

// StatCard builds the 'Calls Today' and 'Messages Today' boxes
const StatCard = ({ label, current, goal }: { label: string; current: number; goal: number }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold text-slate-950">{current}</p>
            <p className="text-sm font-medium text-slate-400">/ {goal}</p>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            {/* The style={{ width: ... }} fills the orange bar */}
            <div className="h-full bg-orange-500 rounded-full" style={{width: `${(current / goal) * 100}%`}}></div>
        </div>
    </div>
);

// --- Main Page ---
export default function DashboardPage() {
  // Placeholder data to match the image. Reactivate useSWR to use Airtable later.
  const records = [
    { id: '1123325', timestamp: 'Jun 24, 9:42 PM', contact: 'David L.', type: 'Inbound', duration: '02:30 Min', status: 'Call Completed' },
    { id: '1123327', timestamp: 'Jun 24, 3:37 PM', contact: 'Maria S.', type: 'Outbound', duration: '02:37 Min', status: 'Message Sent' },
    { id: '1123323', timestamp: 'Jun 24, 7:37 PM', contact: 'Maria B.', type: 'Outbound', duration: '02:00 min', status: 'Call Completed' },
    { id: '1123326', timestamp: 'Jun 24, 7:38 PM', contact: 'David L.', type: 'Outbound', duration: '00:00 min', status: 'Message Sent' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex text-slate-900 font-sans">
      
      {/* 1. SIDEBAR - Matching image_7's full orange theme */}
      <aside className="w-72 bg-orange-500 p-8 flex flex-col justify-between text-white">
        <div className="space-y-12">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 text-2xl font-bold uppercase tracking-tighter">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-lg">
                <SchoolIcon />
            </div>
            Uplog
          </div>

          {/* Navigation Section */}
          <nav className="space-y-3">
            <NavItem Icon={LayoutGridIcon} label="Dashboard" active />
            <NavItem Icon={PhoneIcon} label="Calls" />
            <NavItem Icon={SchoolIcon} label="Contacts" />
            <NavItem Icon={SchoolIcon} label="Messages" />
            <NavItem Icon={SchoolIcon} label="Settings" />
          </nav>
        </div>

        {/* User Info / Logout Button */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/10 border border-white/10 hover:bg-black/20 cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-orange-100 border-2 border-white/50" />
          <div>
            <p className="font-semibold text-white">Sarah J.</p>
            <p className="text-xs text-white/70">(Admin)</p>
          </div>
          <button className="ml-auto text-white/50 hover:text-white">
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 ml-4 p-12 space-y-12">
        
        {/* Header matching image_7 */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">Communication Hub</h1>
            <p className="text-sm font-medium text-slate-400 mt-2">Active connection: Syncing AI log data</p>
          </div>
        </header>

        {/* Action Buttons Row */}
        <div className="grid gap-6 grid-cols-2">
            <button className="h-16 flex items-center justify-center gap-3 rounded-2xl border-2 border-orange-200 text-orange-600 font-bold text-lg hover:bg-orange-50 transition-all shadow-inner-sm">
                <PhoneIcon /> Log Inbound Call
            </button>
            <button className="h-16 flex items-center justify-center gap-3 rounded-2xl bg-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-100 hover:bg-orange-600 hover:scale-[1.01] active:scale-95 transition-all">
                <OutboundIcon /> Start Outbound Call →
            </button>
        </div>

        {/* Quick Message Bar */}
        <div className="p-4 rounded-xl border border-orange-100 bg-orange-50 text-orange-950 font-medium text-center text-sm shadow-inner-sm">
            Quick Message Parent
        </div>

        {/* KEY STATS - Build Cards that match the style */}
        <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Key Stats</h2>
            <div className="grid gap-6 grid-cols-3">
                <StatCard label="Calls Today" current={28} goal={35} />
                <StatCard label="Messages Today" current={15} goal={20} />
                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 space-y-2 shadow-inner-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-700">Admissions Status</p>
                    <p className="text-2xl font-bold text-orange-950 leading-snug">Follow-ups Required</p>
                    <p className="text-sm text-orange-700">AI handling incoming inquiries.</p>
                </div>
            </div>
        </section>

        {/* RECENT ACTIVITY TABLE - Staging the data as the image */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Recent Activity</h2>
            <button className="flex items-center gap-2.5 rounded-full border border-slate-100 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="px-8 py-5">Call ID</th>
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-8 py-5">Contact Name</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5">Duration</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs text-slate-500">#{r.id}</td>
                    <td className="px-8 py-5 font-medium">{r.timestamp}</td>
                    <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100" />
                            <span className="font-semibold text-slate-900">{r.contact}</span>
                        </div>
                    </td>
                    <td className="px-8 py-5 font-medium">{r.type}</td>
                    <td className="px-8 py-5 font-medium">{r.duration}</td>
                    <td className="px-8 py-5">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            r.status === 'Call Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
                        }`}>
                            {r.status}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

// Simple OutboundIcon SVG component
const OutboundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'rotate(135deg)'}}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;