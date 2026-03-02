export default function Dashboard() {
  return (
    <div 
      style={{ minHeight: '100vh' }}
      dangerouslySetInnerHTML={{ __html: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Private School Lead Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74",
                400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c"
              },
              surface: { 50: "#fffaf3", 100: "#fff3e0" }
            }
          }
        }
      };
    </script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; margin: 0; }
    </style>
  </head>
  <body class="min-h-screen text-slate-900">
    <div class="fixed inset-0 -z-20 bg-gradient-to-r from-brand-100 via-surface-50 to-white"></div>
    <div class="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.35),transparent_60%)]"></div>

    <header class="relative overflow-hidden">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 pt-8 pb-6">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-3xl bg-white/95 text-brand-600 shadow-lg">
            <i data-lucide="school-2" class="h-5 w-5"></i>
          </div>
          <div class="space-y-1">
            <h1 class="text-xl font-semibold tracking-tight text-slate-900">Private School Lead Dashboard</h1>
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-600">Admissions · Enrollment Pipeline</p>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl space-y-6 px-6 pb-10">
      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article class="col-span-1 flex items-center justify-between rounded-[1.75rem] bg-white/95 p-5 shadow-xl ring-1 ring-white/70 backdrop-blur">
          <div class="space-y-1">
            <p class="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Total Leads</p>
            <p id="total-leads" class="text-3xl font-semibold tracking-tight text-slate-900">0</p>
            <p id="lead-subtext" class="text-xs text-slate-500">Pulling data...</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-[1.4rem] bg-brand-500 text-white shadow-lg">
            <i data-lucide="users-2" class="h-5 w-5"></i>
          </div>
        </article>
      </section>

      <section class="overflow-hidden rounded-[2rem] bg-white/95 shadow-xl ring-1 ring-white/70 backdrop-blur">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
              <i data-lucide="phone-call" class="h-4 w-4"></i>
            </div>
            <h2 class="text-sm font-semibold text-slate-900">Lead Details</h2>
          </div>
          <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Live Data
          </span>
        </div>

        <div class="relative overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-slate-50/80 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                <th class="px-5 py-3 text-left">Parent Name</th>
                <th class="px-5 py-3 text-left">Phone</th>
                <th class="px-5 py-3 text-left">Grade</th>
                <th class="px-5 py-3 text-left">Parent Message</th>
              </tr>
            </thead>
            <tbody id="leads-body" class="divide-y divide-slate-100"></tbody>
          </table>
          <div id="loading-state" class="p-10 text-center text-xs text-slate-500 italic">Fetching leads...</div>
          <div id="error-state" class="hidden p-5 text-center text-xs text-red-600 bg-red-50"></div>
        </div>
      </section>
    </main>

    <script>
      const AIRTABLE_TOKEN = "${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}"; 
      const AIRTABLE_BASE_ID = 'appy8XTZJNKIQ6S7W';
      const AIRTABLE_TABLE_ID = 'tblJGsNuJklpANEhw';
      const AIRTABLE_API_URL = "https://api.airtable.com/v0/" + AIRTABLE_BASE_ID + "/" + AIRTABLE_TABLE_ID;

      function escapeHtml(v) { return String(v || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

      async function fetchLeads() {
        if (!AIRTABLE_TOKEN || AIRTABLE_TOKEN === "undefined") return;
        
        const bodyEl = document.getElementById('leads-body');
        try {
            const res = await fetch(AIRTABLE_API_URL, {
                headers: { Authorization: "Bearer " + AIRTABLE_TOKEN }
            });
            const data = await res.json();
            const records = data.records || [];
            
            document.getElementById('total-leads').textContent = records.length;
            document.getElementById('lead-subtext').textContent = "active leads in your funnel.";
            document.getElementById('loading-state').classList.add('hidden');
            bodyEl.innerHTML = '';

            records.forEach(r => {
                const f = r.fields;
                
                // --- SMART MESSAGE CLEANER ---
                let summaryDisplay = "No messages from parent.";
                let rawData = (f['Call Summary'] || '').trim();

                // If data looks like a JSON array of messages
                if (rawData.includes('"role"')) {
                  try {
                    // Normalize JSON
                    if (!rawData.startsWith('[')) rawData = '[' + rawData + ']';
                    
                    const transcript = JSON.parse(rawData);
                    
                    // 1. FILTER: Only get 'user' role
                    // 2. CLEAN: Ignore any message starting with '{' (system configs)
                    const parentTexts = transcript
                      .filter(item => item.role === 'user') 
                      .map(item => item.message)
                      .filter(msg => msg && !msg.trim().startsWith('{')); 
                    
                    if (parentTexts.length > 0) {
                      summaryDisplay = parentTexts.join(' • ');
                    }
                  } catch (e) {
                    // Fallback: Regex to find parent messages if JSON is malformed
                    const matches = rawData.match(/"role":"user","message":"([^"]+)"/g);
                    if (matches) {
                      summaryDisplay = matches
                        .map(m => m.split('"message":"')[1].replace('"', ''))
                        .filter(txt => !txt.startsWith('{'))
                        .join(' • ');
                    }
                  }
                } else if (rawData && !rawData.startsWith('{')) {
                  // If it's just plain text and not a config object
                  summaryDisplay = rawData;
                }

                const row = '<tr class="hover:bg-slate-50 transition-colors">' +
                            '<td class="px-5 py-3 font-semibold text-slate-800">' + escapeHtml(f['Parent Name']) + '</td>' +
                            '<td class="px-5 py-3 text-slate-500 font-mono text-xs">' + escapeHtml(f['Parent Phone']) + '</td>' +
                            '<td class="px-5 py-3"><span class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">' + escapeHtml(f['Student Grade'] || '—') + '</span></td>' +
                            '<td class="px-5 py-3 text-slate-600 text-xs leading-relaxed max-w-md">' + escapeHtml(summaryDisplay) + '</td>' +
                            '</tr>';
                bodyEl.insertAdjacentHTML('beforeend', row);
            });
        } catch (e) {
            document.getElementById('error-state').classList.remove('hidden');
            document.getElementById('error-state').textContent = "Connection Error.";
        }
      }

      function init() {
        if (window.lucide) lucide.createIcons();
        fetchLeads();
      }
      
      window.addEventListener('load', init);
      setInterval(fetchLeads, 30000);
    </script>
  </body>
</html>
      ` }} 
    />
  );
}