import { PhoneCall, School2, Sparkles, Users2, LayoutGrid, Settings, ArrowRight, MessageSquare } from "lucide-react";
import { AutoRefresh } from "./AutoRefresh";

// --- DATA TYPES ---
type AirtableRecord = { id: string; fields: Record<string, any>; };
type Lead = { id: string; parentName: string; phone: string; grade: string; summary: string; };

const GRADE_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };

// --- LOGIC FUNCTIONS (Your Data Processing) ---
function normalizeGradeField(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (/^(k|kindergarten)$/i.test(s)) return "Kindergarten";
  if (/^pre[-\s]?k$/i.test(s)) return "Pre-K";
  if (/^[0-9]{1,2}$/.test(s)) return `Grade ${s}`;
  const m = s.match(/\bgrade\s*([0-9]{1,2}|k|kindergarten|pre[-\s]?k|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/i);
  if (m?.[1]) {
    const v = String(m[1]).toLowerCase();
    if (v === "k" || v === "kindergarten") return "Kindergarten";
    if (v.startsWith("pre")) return "Pre-K";
    if (/^\d+$/.test(v)) return `Grade ${v}`;
    if (v in GRADE_WORDS) return `Grade ${GRADE_WORDS[v]}`;
  }
  return null;
}

function detectIntent(text: string): string {
  const t = text.toLowerCase();
  const intents = [
    { re: /\b(tour|visit|campus|walk[-\s]?through)\b/, label: "wants a tour" },
    { re: /\b(enroll|register|admission)\b/, label: "wants to enroll" },
    { re: /\b(tuition|cost|fees|price)\b/, label: "asked about fees" },
  ];
  for (const it of intents) if (it.re.test(t)) return it.label;
  return "called with questions";
}

function formatAISummary(summaryField: unknown, parentName?: string, grade?: string): { text: string } {
  if (!summaryField) return { text: "Sarah is currently parsing the transcript..." };
  const raw = typeof summaryField === "string" ? summaryField : JSON.stringify(summaryField);
  const intent = detectIntent(raw);
  const studentGrade = grade && grade !== "—" ? grade : "student";
  return { text: `Parent ${parentName || ""} ${intent} for a ${studentGrade}.` };
}

async function getLeads(): Promise<Lead[]> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID || "appy8XTZJNKIQ6S7W";
  const tableId = process.env.AIRTABLE_TABLE_ID || "tblJGsNuJklpANEhw";

  if (!token) return [];
  
  try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?sort%5B0%5D%5Bfield%5D=Created&sort%5B0%5D%5Bdirection%5D=desc`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 10 } 
    });

    if (!response.ok) return [];
    const data = await response.json();
    return (data.records || []).map((record: AirtableRecord) => {
      const f = record.fields;
      const parentName = f["Parent Name"] || f["Parent"] || "—";
      const grade = normalizeGradeField(f["Grade"] || f["Student Grade"]) || "—";
      const summary = formatAISummary(f["Call Summary"] || f["AI Call Summary"], parentName, grade).text;
      return { id: record.id, parentName, phone: f["Phone"] || f["Parent Phone"] || "—", grade, summary };
    });
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const leads = await getLeads();

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans text-slate-900 antialiased">
      <AutoRefresh intervalMs={20000} />
      
      {/* SIDEBAR: Matches Design Exactly */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-10">
        <div className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter text-[#EA580C]">
          <div className="bg-[#EA580C] text-white p-2 rounded-xl shadow-lg shadow-orange-200">
            <School2 className="h-6 w-6" strokeWidth={3} />
          </div>
          Uplog
        </div>

        <nav className="flex flex-col gap-2">
          <div className="flex items-center gap-4 p-4 rounded-2xl font-bold bg-[#EA580C] text-white shadow-lg shadow-orange-100 cursor-pointer">
            <LayoutGrid className="h-5 w-5" /> Dashboard
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-all">
            <PhoneCall className="h-5 w-5" /> Calls
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-all">
            <Users2 className="h-5 w-5" /> Contacts
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-all">
            <MessageSquare className="h-5 w-5" /> Messages
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-all mt-auto">
            <Settings className="h-5 w-5" /> Settings
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">Communication Hub</h1>
            <p className="text-slate-500 font-medium mt-2">Connecting Airtable data to your school admissions desk.</p>
          </div>
          <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 flex items-center gap-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync: Active
          </div>
        </header>

        {/* TOP ACTION CARDS */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <button className="flex items-center justify-center gap-4 h-24 bg-white border-2 border-[#EA580C] text-[#EA580C] rounded-[2rem] font-black text-xl hover:bg-orange-50 transition-all shadow-xl shadow-orange-500/5">
            <PhoneCall className="h-6 w-6" /> Log Inbound Call
          </button>
          <button className="flex items-center justify-center gap-4 h-24 bg-[#EA580C] text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all">
            Start Outbound Call <ArrowRight className="h-6 w-6" />
          </button>
        </div>

        {/* SECONDARY ACTION */}
        <div className="w-full bg-white border border-slate-200 p-6 rounded-3xl text-center text-[#C05621] font-bold text-lg mb-12 shadow-sm hover:border-[#EA580C] transition-colors cursor-pointer">
          Quick Message Parent
        </div>

        {/* KEY STATS */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pipeline Leads</p>
            <p className="text-5xl font-black">{leads.length} <span className="text-slate-200 text-3xl">/ 100</span></p>
            <div className="w-full bg-slate-50 h-3.5 mt-8 rounded-full overflow-hidden">
              <div className="bg-[#EA580C] h-full" style={{ width: `${Math.min(leads.length, 100)}%` }} />
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Admissions Sync</p>
            <p className="text-5xl font-black text-emerald-500">100%</p>
            <p className="text-slate-400 font-bold mt-4 text-sm uppercase tracking-tighter italic">Database Linked</p>
          </div>
          <div className="bg-[#FFF7ED] p-10 rounded-[2.5rem] border border-[#FFEDD5] flex flex-col justify-center shadow-lg shadow-orange-100/50">
            <p className="text-xs font-black text-[#EA580C] uppercase tracking-widest mb-3 italic flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> Sarah AI Status
            </p>
            <p className="font-bold text-[#7C2D12] text-lg leading-snug italic">
              "Sarah is currently updating grade interests and tour preferences."
            </p>
          </div>
        </div>

        {/* RECENT ACTIVITY TABLE */}
        <section className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-orange-50/30">
            <h2 className="text-3xl font-black tracking-tight">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-10 py-6">Parent Name</th>
                  <th className="px-6 py-6">Phone Number</th>
                  <th className="px-6 py-6">Student Grade</th>
                  <th className="px-10 py-6">AI Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center font-black text-slate-200 text-2xl uppercase tracking-widest italic">
                      Checking Airtable...
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-orange-50/30 transition-all group">
                      <td className="px-10 py-8 font-black text-slate-900 text-lg">{lead.parentName}</td>
                      <td className="px-6 py-8 text-slate-400 font-bold italic">{lead.phone}</td>
                      <td className="px-6 py-8">
                        <span className="px-4 py-2 bg-[#FFEDD5] text-[#EA580C] text-xs font-black rounded-full uppercase tracking-tighter shadow-sm border border-orange-200/50">
                          {lead.grade}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-sm text-slate-500 max-w-md leading-relaxed italic font-medium">
                        {lead.summary}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}