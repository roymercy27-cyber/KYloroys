import { PhoneCall, School2, Sparkles, Users2 } from "lucide-react";
import { AutoRefresh } from "./AutoRefresh";

type AirtableRecord = {
  id: string;
  fields: Record<string, any>;
};

type Lead = {
  id: string;
  parentName: string;
  phone: string;
  grade: string;
  summary: string;
};

function truncate(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return text.slice(0, Math.max(0, maxLen - 1)).trimEnd() + "…";
}

const GRADE_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

function normalizeGradeField(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;

  // Common direct values
  if (/^(k|kindergarten)$/i.test(s)) return "Kindergarten";
  if (/^pre[-\s]?k$/i.test(s)) return "Pre-K";

  // "3" -> "Grade 3"
  if (/^[0-9]{1,2}$/.test(s)) return `Grade ${s}`;

  // "grade 3", "grade seven"
  const m = s.match(/\bgrade\s*([0-9]{1,2}|k|kindergarten|pre[-\s]?k|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/i);
  if (m?.[1]) {
    const v = String(m[1]).toLowerCase();
    if (v === "k" || v === "kindergarten") return "Kindergarten";
    if (v.startsWith("pre")) return "Pre-K";
    if (/^\d+$/.test(v)) return `Grade ${v}`;
    if (v in GRADE_WORDS) return `Grade ${GRADE_WORDS[v]}`;
  }

  // "3rd grade"
  const m2 = s.match(/\b([0-9]{1,2})(st|nd|rd|th)\s*grade\b/i);
  if (m2?.[1]) return `Grade ${m2[1]}`;

  return null;
}

function extractGradeFromText(text: string): string | null {
  const t = text.toLowerCase();
  const m = t.match(/\bgrade\s*([0-9]{1,2}|k|kindergarten|pre[-\s]?k|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/i);
  if (m?.[1]) return normalizeGradeField(`grade ${m[1]}`);
  const m2 = t.match(/\b([0-9]{1,2})(st|nd|rd|th)\s*grade\b/i);
  if (m2?.[0]) return normalizeGradeField(m2[0]);
  return null;
}

function isSystemPromptLike(message: string): boolean {
  const t = message.toLowerCase();
  // Generic filter for embedded system prompts inside transcripts
  return (
    t.includes("you are") &&
    (t.includes("ai") || t.includes("assistant") || t.includes("receptionist")) &&
    message.length > 60
  );
}

function extractStudentName(text: string): string | null {
  const patterns: RegExp[] = [
    /\b(?:my|our)\s+(?:son|daughter|child)\s+(?:is\s+named|named|is)\s+([A-Z][a-z]+)\b/,
    /\b(?:student|child)\s+(?:name\s+is|is)\s+([A-Z][a-z]+)\b/i,
    /\bfor\s+([A-Z][a-z]+)\s+(?:in|for)\s+grade\b/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

function detectIntent(text: string): string {
  const t = text.toLowerCase();
  const intents: Array<{ re: RegExp; label: string }> = [
    { re: /\b(tour|visit|campus|walk[-\s]?through|open house)\b/, label: "wants a school tour" },
    { re: /\b(enroll|enrollment|register|admission|admissions)\b/, label: "is interested in enrolling" },
    { re: /\b(apply|application)\b/, label: "asked about applying" },
    { re: /\b(tuition|cost|pricing|fees|financial aid|scholarship)\b/, label: "asked about tuition and financial aid" },
    { re: /\b(after[-\s]?school|extended care)\b/, label: "asked about after-school care" },
    { re: /\b(transport|bus|busing)\b/, label: "asked about transportation" },
  ];
  for (const it of intents) if (it.re.test(t)) return it.label;
  return "called with questions";
}

function detectTiming(text: string): string | null {
  const day = text.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i)?.[1];
  const time = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (day && time) return `${day} at ${time[1]}${time[2] ? ":" + time[2] : ""} ${time[3].toUpperCase()}`;
  if (day) return day;
  if (time) return `${time[1]}${time[2] ? ":" + time[2] : ""} ${time[3].toUpperCase()}`;
  return null;
}

function detectWhen(text: string): string | null {
  const day = text.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i)?.[1];
  const rel = text.match(/\b(next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  const time = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);

  const dayLabel = rel ? `${rel[1].toLowerCase()} ${rel[2]}` : day;
  const timeLabel = time ? `${time[1]}${time[2] ? ":" + time[2] : ""} ${time[3].toUpperCase()}` : null;

  if (dayLabel && timeLabel) return `${dayLabel} at ${timeLabel}`;
  if (dayLabel) return dayLabel;
  if (timeLabel) return timeLabel;
  if (/\b(asap|urgent|right away|immediately)\b/i.test(text)) return "as soon as possible";
  if (/\b(today)\b/i.test(text)) return "today";
  if (/\b(tomorrow)\b/i.test(text)) return "tomorrow";
  return null;
}

function detectUrgencyPhrase(text: string): string | null {
  const t = text.toLowerCase();
  const when = detectWhen(text);

  if (/\b(call back|callback|call me|reach me|follow up)\b/.test(t)) {
    return when ? `requested a callback ${when}` : "requested a callback";
  }
  if (
    /\b(tour|visit|campus|walk[-\s]?through|open house)\b/.test(t) &&
    /\b(schedule|book|set up|arrange|come in|visit)\b/.test(t)
  ) {
    return when ? `requested a campus visit ${when}` : "requested a campus visit";
  }
  if (when && /\b(schedule|book|set up|arrange)\b/.test(t)) return `requested scheduling ${when}`;
  if (/\b(asap|urgent|right away|immediately)\b/.test(t)) return "needs a quick follow-up";
  return null;
}

function detectNextStep(text: string): string | null {
  const t = text.toLowerCase();
  const timing = detectTiming(text);
  if (/\b(call back|callback|call me|reach me|follow up)\b/.test(t)) {
    return timing ? `Needs a callback ${timing}.` : "Needs a callback.";
  }
  if (/\b(tour|visit|campus|walk[-\s]?through|open house)\b/.test(t) && /\b(schedule|book|set up|arrange)\b/.test(t)) {
    return "Next, schedule a tour.";
  }
  if (/\b(apply|application)\b/.test(t)) return "Next, share the application steps.";
  if (/\b(tuition|cost|pricing|fees|financial aid|scholarship)\b/.test(t)) return "Next, share tuition and aid information.";
  return null;
}

function detectEnrollmentTerm(text: string): string | null {
  const t = text.toLowerCase();
  if (/\bfall\b/.test(t)) return "They’re interested in fall enrollment.";
  if (/\bspring\b/.test(t)) return "They’re interested in spring enrollment.";
  return null;
}

function collectMessagesDeep(node: unknown, out: string[]) {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((item) => collectMessagesDeep(item, out));
    return;
  }
  if (typeof node === "object") {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (k === "message" && typeof v === "string") out.push(v);
      collectMessagesDeep(v, out);
    }
  }
}

function formatAISummary(
  summaryField: unknown,
  parentNameFromRow?: string,
  gradeFromRow?: string,
): { text: string; raw?: string } {
  if (!summaryField) return { text: "No summary yet." };

  const raw =
    typeof summaryField === "string"
      ? summaryField
      : (() => {
          try {
            return JSON.stringify(summaryField);
          } catch {
            return "";
          }
        })();

  const looksLikeJson = raw.trim().startsWith("{") || raw.trim().startsWith("[");

  try {
    const data = JSON.parse(raw) as any;

    // Transcript-like structures first (this is usually what Airtable stores)
    const turns: any[] | null = Array.isArray(data)
      ? data
      : Array.isArray(data?.messages)
      ? data.messages
      : null;

    let combinedUserText = "";
    if (turns) {
      combinedUserText = turns
        .filter(
          (t) =>
            t &&
            typeof t === "object" &&
            (((t as any).role as string) === "user" ||
              ((t as any).role as string) === "parent"),
        )
        .map((t) => (typeof (t as any).message === "string" ? (t as any).message : ""))
        .join(" ");
    } else {
      const deep: string[] = [];
      collectMessagesDeep(data, deep);
      combinedUserText = deep.filter((m) => !isSystemPromptLike(m)).join(" ");
    }

    // If it's the summaryPlan type, it isn't a summary yet.
    if (data?.summaryPlan) {
      const who =
        parentNameFromRow && parentNameFromRow !== "—"
          ? `Parent ${parentNameFromRow}`
          : "Parent";
      return {
        text: `${who} called, but a summary isn’t available yet. Please follow up soon.`,
        raw,
      };
    }

    // Prefer direct natural language if it exists (but keep it short)
    const direct =
      data?.summary ??
      data?.call_summary ??
      data?.callSummary ??
      data?.ai_summary ??
      data?.aiSummary;
    if (typeof direct === "string" && direct.trim() && !direct.trim().startsWith("{")) {
      const sentences = direct.trim().split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2);
      return { text: sentences.join(" "), raw };
    }

    // Human-readable, high-value summary (<= 2 sentences)
    const who =
      parentNameFromRow && parentNameFromRow !== "—"
        ? `Parent ${parentNameFromRow}`
        : "Parent";

    const intent = detectIntent(combinedUserText);
    const grade =
      (gradeFromRow && gradeFromRow !== "—" ? normalizeGradeField(gradeFromRow) : null) ??
      extractGradeFromText(combinedUserText);
    const urgency = detectUrgencyPhrase(combinedUserText);

    const studentDetails = grade ? `${grade} student` : "student";
    const text = `${who} ${intent} for a ${studentDetails}${urgency ? ` and ${urgency}.` : "."}`;

    const clipped = text.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2).join(" ");
    return { text: clipped, raw };
  } catch {
    // Not JSON; keep it human and short
    const who =
      parentNameFromRow && parentNameFromRow !== "—"
        ? `Parent ${parentNameFromRow}`
        : "Parent";
    const intent = detectIntent(raw);
    const grade =
      (gradeFromRow && gradeFromRow !== "—" ? normalizeGradeField(gradeFromRow) : null) ??
      extractGradeFromText(raw);
    const urgency = detectUrgencyPhrase(raw);
    const studentDetails = grade ? `${grade} student` : "student";
    const text = `${who} ${intent} for a ${studentDetails}${urgency ? ` and ${urgency}.` : "."}`;
    const clipped = text.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2).join(" ");
    return { text: clipped };
  }
}

async function getLeads(): Promise<Lead[]> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID ?? "appy8XTZJNKIQ6S7W";
  const tableId = process.env.AIRTABLE_TABLE_ID ?? "tblJGsNuJklpANEhw";

  if (!token) {
    // If no token is configured, return an empty list and let the UI show a hint.
    return [];
  }

  const url = `https://api.airtable.com/v0/${baseId}/${tableId}?pageSize=100`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Airtable request failed", response.status, response.statusText);
    return [];
  }

  const data = (await response.json()) as { records?: AirtableRecord[] };
  const records = data.records ?? [];

  return records.map((record) => {
    const fields = record.fields ?? {};

    // Match your requested columns / field names
    const parentName =
      (fields["Parent Name"] as string | undefined) ??
      (fields["Parent"] as string | undefined) ??
      "—";
    const phone =
      (fields["Phone"] as string | undefined) ??
      (fields["Parent Phone"] as string | undefined) ??
      "—";
    const gradeFromField =
      (fields["Grade"] as string | undefined) ??
      (fields["Student Grade"] as string | undefined) ??
      "";
    const grade = normalizeGradeField(gradeFromField) ?? (gradeFromField || "—");
    const rawSummary =
      (fields["AI Call Summary"] as string | undefined) ??
      (fields["Call Summary"] as string | undefined) ??
      "";
    const formatted = formatAISummary(rawSummary, parentName, grade);
    const summary = formatted.text;

    return {
      id: record.id,
      parentName,
      phone,
      grade,
      summary,
    };
  });
}

export default async function Home() {
  const leads = await getLeads();
  const totalLeads = leads.length;

  return (
    <div className="min-h-screen text-slate-900">
      <AutoRefresh intervalMs={30000} />
      {/* Warm orange background */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-r from-orange-100 via-orange-50 to-white" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.35),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.3),transparent_55%)]" />

      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-white/95 text-orange-500 shadow-lg shadow-orange-500/25">
              <School2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">
                Private School Lead Dashboard
              </h1>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                Admissions · Enrollment Pipeline
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs text-slate-600 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">
                <Sparkles className="h-3 w-3" />
              </span>
              <span className="font-medium">AI Call Insights</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 pb-10">
        {/* Stat cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="col-span-1 flex items-center justify-between rounded-[1.75rem] bg-white/95 p-5 shadow-[0_22px_55px_rgba(15,23,42,0.22)] ring-1 ring-white/70 backdrop-blur">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Total Leads
              </p>
              <p className="text-3xl font-semibold tracking-tight text-slate-900">
                {totalLeads}
              </p>
              <p className="text-xs text-slate-500">
                {totalLeads === 0
                  ? "Connect Airtable to see leads."
                  : totalLeads === 1
                  ? "1 active lead in your funnel."
                  : `${totalLeads} active leads in your funnel.`}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.4rem] bg-orange-500 text-white shadow-lg shadow-orange-500/40">
              <Users2 className="h-5 w-5" />
            </div>
          </article>
        </section>

        {/* Leads table */}
        <section className="overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_22px_55px_rgba(15,23,42,0.22)] ring-1 ring-white/70 backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-white via-white to-orange-50/80 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Lead Details
                </h2>
                <p className="text-xs text-slate-500">
                  Parent contact info, grade interest, and AI call summaries
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {process.env.AIRTABLE_TOKEN
                  ? "Connected to Airtable"
                  : "Add Airtable env vars"}
              </span>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-5 py-3 text-left">Parent Name</th>
                  <th className="px-5 py-3 text-left">Phone</th>
                  <th className="px-5 py-3 text-left">Grade</th>
                  <th className="px-5 py-3 text-left">AI Call Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/90 text-slate-800">
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-6 text-center text-xs text-slate-500"
                    >
                      {process.env.AIRTABLE_TOKEN
                        ? "No leads found in this Airtable table yet."
                        : "Set AIRTABLE_TOKEN, AIRTABLE_BASE_ID, and AIRTABLE_TABLE_ID in .env.local to load leads."}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="transition-colors duration-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-3 align-top">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {lead.parentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 align-top">
                        <span className="text-sm text-slate-700">
                          {lead.phone}
                        </span>
                      </td>
                      <td className="px-5 py-3 align-top">
                        <span className="inline-flex items-center rounded-full bg-orange-500/5 px-2 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-orange-500/20">
                          {lead.grade}
                        </span>
                      </td>
                      <td className="max-w-xl px-5 py-3 align-top">
                        <p className="text-sm leading-snug text-slate-700">
                          {lead.summary}
                        </p>
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
