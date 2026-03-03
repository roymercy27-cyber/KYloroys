'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';

// --- ICONS ---
const DashboardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm0 10h8v8H3zm10-10h8v8h-8zm0 10h8v8h-8z"/></svg>;
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 1.11L8.09 9.91a16 16 0 0 0 6 6l2.25-1.51a2 2 0 0 1 1.11-.45 12.84 12.84 0 0 0 2.81.72 2 2 0 0 1 1.72 2z"/></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MessageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;

const fetcher = (url: string) => {
  const token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json());
};

export default function UplogDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const tableId = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID;
  
  // Use 'Grid view' by default to ensure we see the same thing as your screenshot
  const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableId}?view=Grid%20view`;

  const { data, isLoading, error } = useSWR(baseId && tableId ? apiUrl : null, fetcher, { refreshInterval: 5000 });

  const processedRecords = useMemo(() => {
    if (!data?.records) return [];
    
    return data.records.map((record: any) => ({
      id: record.id,
      // Mapping based on your screenshot!
      name: record.fields['Parent Name'] || 'Unknown',
      phone: record.fields['Parent Phone'] || 'No Phone',
      grade: record.fields['Student Grade'] || 'N/A',
      summary: record.fields['Call Summary'] || '',
      // Fallbacks for fields not visible in your screenshot
      type: record.fields['Type'] || 'Inbound', 
      status: record.fields['Status'] || 'New Lead',
      date: record.fields['Timestamp'] || new Date(record.createdTime).toLocaleDateString()
    }));
  }, [data]);

  const filteredRecords = processedRecords.filter((r: any) => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-slate-800 font-sans antialiased">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#F15A24] text-white flex flex-col fixed inset-y-0">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-white p-1 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#F15A24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Uplog</span>
        </div>

        <nav className="mt-4 flex-1">
          {['Dashboard', 'Calls', 'Contacts', 'Messages', 'Settings'].map((id) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === id ? 'bg-black/10 border-l-4 border-white' : 'hover:bg-black/5 opacity-80'
              }`}
            >
              {id === 'Dashboard' && <DashboardIcon />}
              {id === 'Calls' && <PhoneIcon />}
              {id === 'Contacts' && <UserIcon />}
              {id === 'Messages' && <MessageIcon />}
              {id === 'Settings' && <SettingsIcon />}
              {id}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
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

        <div className="p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'Dashboard' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <h1 className="text-3xl font-bold text-slate-800">Communication Hub</h1>
                {error && <span className="text-red-500 text-xs font-mono">Connection Error!</span>}
              </div>

              {/* Activity Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold">Recent Leads Activity</h3>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Live Sync</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                    <tr>
                      <th className="px-6 py-3">Parent Name</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Grade</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredRecords.map((record: any) => (
                      <tr key={record.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{record.name}</td>
                        <td className="px-6 py-4 font-medium text-slate-500">{record.phone}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                            {record.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-md text-xs font-bold bg-orange-100 text-[#C05621]">
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium opacity-60">{record.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {isLoading && (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F15A24] border-t-transparent"></div>
                    <p className="mt-4 text-slate-400 font-medium">Fetching from Airtable...</p>
                  </div>
                )}

                {!isLoading && filteredRecords.length === 0 && (
                  <div className="p-20 text-center">
                    <p className="text-slate-400">No records found. Check if your Base ID and Table ID are correct.</p>
                    <p className="text-[10px] text-slate-300 mt-2 font-mono">Base: {baseId} | Table: {tableId}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-slate-100 text-center space-y-4">
                  <div className="w-16 h-16 bg-orange-50 text-[#F15A24] rounded-full flex items-center justify-center mx-auto mb-4">
                    <SettingsIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{activeTab} View</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    The <strong>{activeTab}</strong> module is currently under maintenance. Please use the Dashboard to view live records.
                  </p>
                  <button 
                    onClick={() => setActiveTab('Dashboard')}
                    className="mt-4 px-6 py-2 bg-[#F15A24] text-white rounded-full font-bold hover:bg-[#d44d1d] transition-colors"
                  >
                    Return to Dashboard
                  </button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}