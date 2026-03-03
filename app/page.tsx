'use client';

import { useState, useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// --- ICONS ---
const DashboardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm0 10h8v8H3zm10-10h8v8h-8zm0 10h8v8h-8z"/></svg>;
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 1.11L8.09 9.91a16 16 0 0 0 6 6l2.25-1.51a2 2 0 0 1 1.11-.45 12.84 12.84 0 0 0 2.81.72 2 2 0 0 1 1.72 2z"/></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MessageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;

// --- CONFIG ---
const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const tableId = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID;
const token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.error('Airtable Error:', errorData);
    throw new Error(errorData.error.message);
  }
  return res.json();
};

export default function UplogDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeCallType, setActiveCallType] = useState<'inbound' | 'outbound' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useSWR(baseId && tableId && token ? apiUrl : null, fetcher, {
    refreshInterval: 5000,
  });

  const records = useMemo(() => {
    if (!data?.records) return [];
    return data.records.map((r: any) => ({
      id: r.id,
      name: r.fields['Parent Name'] || '---',
      phone: r.fields['Parent Phone'] || '---',
      grade: r.fields['Student Grade'] || '---',
      status: 'New Lead',
      date: new Date(r.createdTime).toLocaleDateString(),
    }));
  }, [data]);

  const filteredRecords = records.filter((r: any) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogCall = async (type: 'inbound' | 'outbound') => {
    setActiveCallType(type);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Parent Name': 'New Lead',
            'Parent Phone': 'Pending...',
            'Student Grade': 'N/A',
          },
        }),
      });
      if (response.ok) mutate(apiUrl);
    } catch (err) {
      console.error('Logging failed:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-slate-800 font-sans antialiased">
      <aside className="w-64 bg-[#F15A24] text-white flex flex-col fixed inset-y-0">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-white p-1 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#F15A24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Uplog</span>
        </div>
        <nav className="mt-4 flex-1">
          {[
            { id: 'Dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
            { id: 'Calls', icon: <PhoneIcon />, label: 'Calls' },
            { id: 'Contacts', icon: <UserIcon />, label: 'Contacts' },
            { id: 'Messages', icon: <MessageIcon />, label: 'Messages' },
            { id: 'Settings', icon: <SettingsIcon />, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-black/10 border-l-4 border-white' : 'hover:bg-black/5 opacity-80'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 gap-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 rounded-full py-1.5 px-10 text-sm focus:outline-none"
            />
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'Dashboard' ? (
            <>
              <h1 className="text-3xl font-bold text-slate-800">Communication Hub</h1>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleLogCall('inbound')}
                  className={`flex items-center justify-center gap-2 py-4 border-2 border-[#C05621] rounded-xl font-bold transition-all ${
                    activeCallType === 'inbound' ? 'bg-[#F15A24] text-white' : 'text-[#C05621] bg-white hover:bg-orange-50'
                  }`}
                >
                  <span className="rotate-[135deg] scale-x-[-1]"><PhoneIcon /></span> Log Inbound Call
                </button>
                <button
                  onClick={() => handleLogCall('outbound')}
                  className={`flex items-center justify-center gap-2 py-4 border-2 border-[#C05621] rounded-xl font-bold transition-all ${
                    activeCallType === 'outbound' ? 'bg-[#F15A24] text-white shadow-lg shadow-orange-100' : 'text-[#C05621] bg-white hover:bg-orange-50'
                  }`}
                >
                  <PhoneIcon /> Start Outbound Call →
                </button>
              </div>

              <button className="w-full py-3 border-2 border-[#C05621]/30 text-[#C05621] rounded-xl font-semibold bg-white hover:bg-orange-50 transition-colors">
                Quick Message Parent
              </button>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Key Stats</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-sm font-semibold opacity-70">Calls Today</span>
                      <span className="text-2xl font-bold">0/35</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#F15A24] h-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-sm font-semibold opacity-70">Messages Today</span>
                      <span className="text-2xl font-bold">0/20</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#F15A24] h-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                    <span className="text-sm font-semibold opacity-70">Follow-ups Required</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold">Recent Leads Activity</h3>
                  {isLoading && <span className="text-[10px] text-orange-500 font-bold animate-pulse">SYNCING LIVE...</span>}
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                    <tr>
                      <th className="px-6 py-3">Parent Name</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Grade</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredRecords.map((record: any) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold">{record.name}</td>
                        <td className="px-6 py-4 font-medium opacity-70">{record.phone}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">{record.grade}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#FFEDD5] text-[#C05621]">{record.status}</span>
                        </td>
                        <td className="px-6 py-4 font-medium opacity-60">{record.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!isLoading && filteredRecords.length === 0 && (
                  <div className="p-10 text-center text-slate-400">No records found.</div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <h2 className="text-2xl font-bold">{activeTab} View</h2>
               <button onClick={() => setActiveTab('Dashboard')} className="text-[#F15A24] font-bold underline mt-4">Back to Dashboard</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}