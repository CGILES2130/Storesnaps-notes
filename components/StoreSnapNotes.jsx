'use client';
import { useEffect, useMemo, useState } from "react";

const DEFAULT_SECTIONS = [
  "Entrance & Signage",
  "Food Hall",
  "Bakery",
  "Deli",
  "Seasonal",
  "Stockroom",
  "COOK Freezers",
  "Freezers",
  "Themed Stories",
  "Drinks",
  "Snacks",
  "Chillers",
  "Till Que",
];

const TEMPLATE_KEY = "storesnap.template.sections";
const LOGO_KEY = "storesnap.brand.logo";
const DEFAULT_CC = ["chris.giles@bluediamond.gg"];

function getTemplateSectionTitles() {
  if (typeof window === "undefined") return DEFAULT_SECTIONS;
  try {
    const raw = window.localStorage.getItem(TEMPLATE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_SECTIONS;
  } catch {
    return DEFAULT_SECTIONS;
  }
}
function saveTemplateSectionTitles(titles) {
  try { window.localStorage.setItem(TEMPLATE_KEY, JSON.stringify(titles)); } catch {}
}
function mapTitlesToSectionObjs(titles) {
  return titles.map((t) => ({ id: crypto.randomUUID(), title: t, notes: [] }));
}

const STORES = [
  { id: "3shires", name: "3 Shires Garden Centre", email_to: "ian.griffiths@bluediamond.gg", email_cc: [] },
  { id: "beckworth", name: "Beckworth Emporium", email_to: "robert.harradine@bluediamond.gg", email_cc: [] },
  { id: "bicester", name: "Bicester Garden Centre", email_to: "jonny.boyle@bluediamond.gg", email_cc: [] },
  { id: "blackdown", name: "Blackdown Garden Centre", email_to: "toni.cox@bluediamond.gg", email_cc: [] },
  { id: "brambridge", name: "Brambridge Park Garden Centre", email_to: "becky.pettigrew@bluediamond.gg", email_cc: [] },
  { id: "bridgemere", name: "Bridgemere Garden Centre", email_to: "simon.cannell@bluediamond.gg", email_cc: [] },
  { id: "cadbury", name: "Cadbury Garden Centre", email_to: "kirsty.membery@bluediamond.gg", email_cc: [] },
  { id: "canterbury", name: "Canterbury Garden Centre", email_to: "melisa.cole@bluediamond.gg", email_cc: [] },
  { id: "cardiff", name: "Cardiff Garden Centre", email_to: "jo.nicholls@bluediamond.gg", email_cc: [] },
  { id: "chatsworth", name: "Chatsworth Garden Centre", email_to: "Joanne.Clarke@bluediamond.gg", email_cc: [] },
  { id: "coton", name: "Coton Orchard Garden Centre", email_to: "jo.sparkes@bluediamond.gg", email_cc: [] },
  { id: "derby", name: "Derby Garden Centre", email_to: "trevor.adams@bluediamond.gg", email_cc: [] },
  { id: "eastbridgford", name: "East Bridgford Garden Centre", email_to: "mark.russell@bluediamond.gg", email_cc: [] },
  { id: "endsleigh", name: "Endsleigh Garden Centre", email_to: "jane.glanville@bluediamond.gg", email_cc: [] },
  { id: "evesham", name: "Evesham Garden Centre", email_to: "sian.gisbourne@bluediamond.gg", email_cc: [] },
  { id: "fermoys", name: "Fermoys Garden Centre", email_to: "julie.hearne@bluediamond.gg", email_cc: [] },
  { id: "fosseway", name: "Fosseway Garden Centre", email_to: "carla.smith@bluediamond.gg", email_cc: [] },
  { id: "fryers", name: "Fryers Garden Centre", email_to: "tori.ford@bluediamond.gg", email_cc: [] },
  { id: "grosvenor", name: "Grosvenor Garden Centre", email_to: "sarah.savage@bluediamond.gg", email_cc: [] },
  { id: "harlow", name: "Harlow Garden Centre", email_to: "susan.cavey@bluediamond.gg", email_cc: [] },
  { id: "hereford", name: "Hereford Garden Centre", email_to: "steven.hatch@bluediamond.gg", email_cc: [] },
  { id: "lefriquet", name: "Le Friquet Garden Centre", email_to: "cassandra.molver@bluediamond.gg", email_cc: [] },
  { id: "lowermorden", name: "Lower Morden Garden Centre", email_to: "rebecca.smith@bluediamond.gg", email_cc: [] },
  { id: "matlock", name: "Matlock Garden Centre", email_to: "gemma.bunting@bluediamond.gg", email_cc: [] },
  { id: "melbicks", name: "Melbicks Garden Centre", email_to: "Claire.Smith@bluediamond.gg", email_cc: [] },
  { id: "merepark", name: "Mere Park Garden Centre", email_to: "paul.moir@bluediamond.gg", email_cc: [] },
  { id: "nailsworth", name: "Nailsworth Garden Centre", email_to: "felipe.ferrera@bluediamond.gg", email_cc: [] },
  { id: "newbridge", name: "Newbridge Garden Centre", email_to: "joanna.fautly@bluediamond.gg", email_cc: [] },
  { id: "orchardpark", name: "Orchard Park Garden Centre", email_to: "claire.harris@bluediamond.gg", email_cc: [] },
  { id: "percythrowers", name: "Percy Throwers Garden Centre", email_to: "alex.ball@bluediamond.gg", email_cc: [] },
  { id: "rake", name: "Rake Garden Centre", email_to: "shelly.reid@bluediamond.gg,tom.driscoll@bluediamond.gg", email_cc: [] },
  { id: "redfields", name: "Redfields Garden Centre", email_to: "sylwia.matthews@bluediamond.gg", email_cc: [] },
  { id: "sanders", name: "Sanders Garden Centre", email_to: "holly.bailey@bluediamond.gg", email_cc: [] },
  { id: "springfields", name: "Springfields Garden Centre", email_to: "helen.cunningham@bluediamond.gg,jane.mcglinchey@bluediamond.gg", email_cc: [] },
  { id: "stpeters", name: "St Peters Garden Centre", email_to: "alexandra.robson@bluediamond.gg", email_cc: [] },
  { id: "trelawney", name: "Trelawney Garden Centre", email_to: "lee.auburn@bluediamond.gg", email_cc: [] },
  { id: "trentham", name: "Trentham Garden Centre", email_to: "michelle.o'toole@bluediamond.gg", email_cc: [] },
  { id: "tunbridgewells", name: "Tunbridge Wells Garden Centre", email_to: "karen.webb@bluediamond.gg", email_cc: [] },
  { id: "greatamwell", name: "Great Amwell Garden Centre", email_to: "Wendy.Dedman@bluediamond.gg", email_cc: [] },
  { id: "chenies", name: "Chenies Garden Centre", email_to: "mandy.cox@bluediamond.gg", email_cc: [] },
  { id: "peterborough", name: "Peterborough Garden Centre", email_to: "helen.cunningham@bluediamond.gg", email_cc: [] },
  { id: "weybridge", name: "Weybridge Garden Centre", email_to: "claire.esmith@bluediamond.gg", email_cc: [] },
  { id: "wilton", name: "Wilton House Garden Centre", email_to: "sam.kettle@bluediamond.gg", email_cc: [] },
  { id: "woburnsands", name: "Woburn Sands Garden Centre", email_to: "jane.boyle@bluediamond.gg", email_cc: [] },
  { id: "worcester", name: "Worcester Garden Centre", email_to: "Jonathan.Mower@bluediamond.gg,laura.mulley@bluediamond.gg", email_cc: [] },
  { id: "willington", name: "Willington Garden Centre", email_to: "Jane.Smith@bluediamond.gg", email_cc: [] },
  { id: "huntingdon", name: "Huntingdon Garden Centre", email_to: "jo.whitefoot@bluediamond.gg", email_cc: [] },
  { id: "harlestone", name: "Harlestone Heath Garden Centre", email_to: "naomi.davies@bluediamond.gg", email_cc: [] },
  { id: "yarton", name: "Yarton Home & Garden", email_to: "", email_cc: [] },
  { id: "worldsend", name: "Worlds End Garden Centre", email_to: "", email_cc: [] },
  { id: "bartongrange", name: "Barton Grange Garden Centre", email_to: "", email_cc: [] },
];

function formatDate(d) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(d);
  } catch { return d.toLocaleString(); }
}
function bytesToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function escapeHtml(str) {
  return (str || "").replace(/[&<>\"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch]));
}

export default function StoreSnapNotes() {
  const [storeId, setStoreId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [sections, setSections] = useState(() => mapTitlesToSectionObjs(getTemplateSectionTitles()));
  const [customSectionTitle, setCustomSectionTitle] = useState("");
  const [summary, setSummary] = useState("Overall standards: steady. Key gaps in POS & chillers. See P1 actions below.");
  const [visitorName, setVisitorName] = useState("Chris Giles");
  const [includeInternal, setIncludeInternal] = useState(false);
  const [logo, setLogo] = useState(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOGO_KEY);
      if (raw) setLogo(raw);
    } catch {}
  }, []);

  const store = useMemo(() => STORES.find((s) => s.id === storeId) || null, [storeId]);
  const startedAt = useMemo(() => new Date(), []);

  function addSection() {
    if (!customSectionTitle.trim()) return;
    setSections((prev) => [...prev, { id: crypto.randomUUID(), title: customSectionTitle.trim(), notes: [] }]);
    setCustomSectionTitle("");
  }
  function addNote(sectionId) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              notes: [
                ...s.notes,
                { id: crypto.randomUUID(), text: "", tags: [], priority: "P2", owner: store ? store.name + " Team" : "Store Team", due: "", internal: false, photos: [] },
              ],
            }
          : s
      )
    );
  }
  function removeNote(sectionId, noteId) {
    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, notes: s.notes.filter((n) => n.id !== noteId) } : s)));
  }

  async function handlePhotos(sectionId, noteId, files) {
    const dataUrls = await Promise.all([...files].slice(0, 10).map((f) => bytesToDataUrl(f)));
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, notes: s.notes.map((n) => (n.id === noteId ? { ...n, photos: [...n.photos, ...dataUrls] } : n)) } : s
      )
    );
  }

  const actions = useMemo(() => {
    const list = [];
    sections.forEach((s) =>
      s.notes.forEach((n) => {
        if (!n.text.trim()) return;
        list.push({ id: n.id, title: n.text, priority: n.priority, owner: n.owner, due: n.due });
      })
    );
    return list.sort((a, b) => a.priority.localeCompare(b.priority));
  }, [sections]);

  function buildReportHTML() {
    const dateStr = formatDate(new Date());
    const storeName = store ? store.name : "(No store selected)";
    const actionsRows = actions
      .map(
        (a) => `
        <tr>
          <td>${a.priority}</td>
          <td>${escapeHtml(a.title)}</td>
          <td>${escapeHtml(a.owner || "")}</td>
          <td>${escapeHtml(a.due || "")}</td>
          <td>Open</td>
        </tr>`
      )
      .join("");

    const sectionBlocks = sections
      .map((s) => {
        const visibleNotes = s.notes.filter((n) => includeInternal || !n.internal);
        if (visibleNotes.length === 0) return "";
        const notesHtml = visibleNotes
          .map(
            (n) => `
            <div class="note">
              <div class="meta">
                <span class="badge">${n.priority}</span>
                <span class="owner">${escapeHtml(n.owner || "")}</span>
                <span class="due">${escapeHtml(n.due || "")}</span>
                ${n.internal ? '<span class="internal">Internal</span>' : ""}
              </div>
              <div class="text">${escapeHtml(n.text)}</div>
              <div class="photos">
                ${n.photos.map((p) => `<div class="photo"><img src="${p}"/></div>`).join("")}
              </div>
            </div>`
          )
          .join("");
        return `<h2>${escapeHtml(s.title)}</h2>${notesHtml}`;
      })
      .join("");

    return `
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Visit Report — ${escapeHtml(storeName)} — ${dateStr}</title>
        <style>
          body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:24px;}
          header{display:flex;align-items:center;gap:12px;margin-bottom:8px}
          header img{height:40px}
          h1{font-size:22px;margin:8px 0}
          h2{font-size:16px;margin:16px 0 8px}
          table{width:100%;border-collapse:collapse;margin-top:8px}
          th,td{border:1px solid #eee;padding:8px;text-align:left}
          .badge{padding:2px 8px;border-radius:12px;border:1px solid #ddd;font-size:12px;margin-right:8px}
          .note{border:1px solid #eee;border-radius:8px;padding:8px;margin:8px 0}
          .meta{font-size:12px;color:#555;display:flex;gap:8px;align-items:center;margin-bottom:6px}
          .internal{border:1px dashed #f99;color:#b00;padding:2px 6px;border-radius:8px}
          .photos{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-top:6px}
          .photo{border:1px solid #eee;border-radius:6px;padding:4px}
          .photo img{width:120px;height:120px;object-fit:cover;border-radius:4px;display:block}
        </style>
      </head>
      <body>
        <header>
          ${logo ? `<img src="${logo}" alt="Local Larder Food Hall" />` : ''}
          <div>
            <div><strong>${escapeHtml(storeName)}</strong></div>
            <div style="font-size:12px;color:#555">${dateStr} • Visitor: ${escapeHtml(visitorName)}</div>
          </div>
        </header>
        <h1>Store Visit Report</h1>
        <h2>Executive Summary</h2>
        <div>${escapeHtml(summary)}</div>
        <h2>Actions</h2>
        <table>
          <tr><th>Priority</th><th>Action</th><th>Owner</th><th>Due</th><th>Status</th></tr>
          ${actionsRows}
        </table>
        ${sectionBlocks}
      </body>
      </html>`;
  }

  async function downloadPdf() {
    const html = buildReportHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) alert("Please allow pop-ups to preview the report.");
  }

  function dataUrlToParts(d) {
    const match = /^data:(.+);base64,(.*)$/.exec(d);
    if (!match) return null;
    return { type: match[1], content: match[2] };
  }
  async function sendEmailWithAttachment() {
    if (!store || !store.email_to) {
      alert("Please select a store with a manager email address.");
      return;
    }
    const html = buildReportHTML();
    const photoData = [];
    sections.forEach((s) =>
      s.notes.forEach((n) =>
        n.photos.forEach((p, idx) => {
          const parts = dataUrlToParts(p);
          if (parts) {
            photoData.push({
              filename: `${s.title.replace(/\s+/g, "_").toLowerCase()}-${idx + 1}.${parts.type.includes("png") ? "png" : "jpg"}`,
              type: parts.type,
              content: parts.content,
            });
          }
        })
      )
    );
    const subject = `Store Visit — ${store ? store.name : "(Store)"} — ${new Date().toLocaleDateString("en-GB")}`;
    const to = store?.email_to || "";
    const ccList = [...(store?.email_cc || []), ...DEFAULT_CC].filter(Boolean);
    const cc = ccList.join(",");

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, cc, subject, html, photos: photoData }),
    });
    const data = await res.json();
    if (data.ok) alert("Email sent with PDF + photos attached.");
    else alert("Email send failed: " + (data.error || "unknown error"));
  }

  function buildMailto() {
    const subject = `Store Visit — ${store ? store.name : "(Store)"} — ${new Date().toLocaleDateString("en-GB")}`;
    const topP1 = actions.filter((a) => a.priority === "P1").slice(0, 5);
    const body = encodeURIComponent(
      `Hi ${store ? store.name + " Manager" : "Team"},\n\nThanks for today. I've attached the visit report.\n\nKey P1 actions:\n${
        topP1.length ? topP1.map((a) => `- ${a.title} — Owner: ${a.owner}, Due: ${a.due || "TBC"}`).join("\n") : "- None raised"
      }\n\nSummary:\n${summary}\n\nBest,\n${visitorName}`
    );
    const to = store?.email_to || "";
    const ccList = [...(store?.email_cc || []), ...DEFAULT_CC].filter(Boolean);
    const cc = ccList.join(",");
    return `mailto:${to}?subject=${encodeURIComponent(subject)}${cc ? `&cc=${encodeURIComponent(cc)}` : ""}&body=${body}`;
  }

  function newVisitFromTemplate() {
    setSections(mapTitlesToSectionObjs(getTemplateSectionTitles()));
    setPurpose("");
    setSummary("Overall standards: steady. Key gaps in POS & chillers. See P1 actions below.");
    setIncludeInternal(false);
  }
  function saveCurrentAsDefault() {
    const titles = sections.map((s) => s.title);
    saveTemplateSectionTitles(titles);
    alert("Saved current sections as your default template.");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white shadow-sm border rounded-xl">
          <div className="border-b px-4 py-3 flex items-center gap-3">
            {logo ? <img src={logo} alt="Logo" className="h-8" /> : <span className="text-slate-400 text-sm">(Add your logo below)</span>}
            <span className="text-slate-900 font-medium">StoreSnap Notes</span>
          </div>
          <div className="p-4 space-y-3">
            <label className="text-sm font-medium">Store</label>
            <select className="w-full border rounded-md px-3 py-2" value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              <option value="">Select a store</option>
              {STORES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <label className="text-sm font-medium">Purpose</label>
            <input className="w-full border rounded-md px-3 py-2" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g., Monthly audit, Seasonal changeover" />

            <label className="text-sm font-medium">Visitor name</label>
            <input className="w-full border rounded-md px-3 py-2" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} />

            <div className="text-xs text-slate-500">Started: {formatDate(startedAt)}</div>

            <button onClick={newVisitFromTemplate} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
              New visit from default template
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm border rounded-xl">
          <div className="border-b px-4 py-3">
            <h2 className="text-lg font-semibold">Branding</h2>
          </div>
          <div className="p-4 space-y-3">
            <label className="text-sm font-medium">Upload logo (PNG/JPG/SVG)</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              bytesToDataUrl(file).then((d) => { setLogo(d); try { window.localStorage.setItem(LOGO_KEY, d); } catch {} });
            }} />
            {logo && (
              <div className="flex items-center gap-3">
                <img src={logo} className="h-10 border rounded-md" />
                <button onClick={() => { setLogo(null); try { window.localStorage.removeItem(LOGO_KEY); } catch {} }} className="text-sm text-slate-600 underline">Clear</button>
              </div>
            )}
            <div className="text-xs text-slate-500">Your logo is saved to this browser and will be embedded at the top of the PDF/email.</div>
          </div>
        </div>

        <div className="bg-white shadow-sm border rounded-xl">
          <div className="border-b px-4 py-3">
            <h2 className="text-lg font-semibold">Sections</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => <span key={s.id} className="rounded-2xl bg-slate-100 text-slate-700 px-3 py-1 text-xs">{s.title}</span>)}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 border rounded-md px-3 py-2" value={customSectionTitle} onChange={(e) => setCustomSectionTitle(e.target.value)} placeholder="Add custom section" />
              <button onClick={addSection} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">Add</button>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={saveCurrentAsDefault} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">Save as default template</button>
              <button onClick={() => setSections(mapTitlesToSectionObjs(getTemplateSectionTitles()))} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">Load default</button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border rounded-xl">
          <div className="border-b px-4 py-3">
            <h2 className="text-lg font-semibold">Review & Send</h2>
          </div>
          <div className="p-4 space-y-3">
            <label className="text-sm font-medium">Executive Summary</label>
            <textarea rows={5} className="w-full border rounded-md px-3 py-2" value={summary} onChange={(e) => setSummary(e.target.value)} />

            <label className="inline-flex gap-2 items-center text-sm">
              <input type="checkbox" checked={includeInternal} onChange={(e) => setIncludeInternal(e.target.checked)} />
              Include internal-only notes in report
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button onClick={downloadPdf} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">Preview/Download PDF</button>
              <a href={buildMailto()} className="rounded-md border px-3 py-2 text-sm text-center hover:bg-slate-50">Open Email</a>
              <button onClick={sendEmailWithAttachment} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">Send with attachments</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: Notes capture */}
      <div className="lg:col-span-2 space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white shadow-sm border rounded-xl">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <button onClick={() => addNote(section.id)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">Add note</button>
            </div>
            <div className="p-4 space-y-4">
              {section.notes.length === 0 && <div className="text-sm text-slate-500">No notes yet.</div>}
              {section.notes.map((note) => (
                <div key={note.id} className="border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Note</label>
                      <textarea className="w-full border rounded-md px-3 py-2" value={note.text}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? { ...s, notes: s.notes.map((n) => (n.id === note.id ? { ...n, text: e.target.value } : n)) }
                                : s
                            )
                          )
                        }
                        placeholder="e.g., POS missing on Local Larder aisle end"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <select className="w-full border rounded-md px-3 py-2" value={note.priority}
                          onChange={(e) =>
                            setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, notes: s.notes.map((n) => (n.id === note.id ? { ...n, priority: e.target.value } : n)) } : s))
                          }>
                          <option value="P1">P1</option>
                          <option value="P2">P2</option>
                          <option value="P3">P3</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Owner</label>
                        <input className="w-full border rounded-md px-3 py-2" value={note.owner}
                          onChange={(e) =>
                            setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, notes: s.notes.map((n) => (n.id === note.id ? { ...n, owner: e.target.value } : n)) } : s))
                          } />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Due date</label>
                        <input type="date" className="w-full border rounded-md px-3 py-2" value={note.due}
                          onChange={(e) =>
                            setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, notes: s.notes.map((n) => (n.id === note.id ? { ...n, due: e.target.value } : n)) } : s))
                          } />
                      </div>
                      <label className="inline-flex items-center gap-2 pt-6 text-sm">
                        <input type="checkbox" checked={note.internal}
                          onChange={(e) =>
                            setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, notes: s.notes.map((n) => (n.id === note.id ? { ...n, internal: e.target.checked } : n)) } : s))
                          } />
                        Internal only
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Photos</label>
                    <input type="file" multiple accept="image/*" onChange={(e) => handlePhotos(section.id, note.id, e.target.files)} />
                    {!!note.photos.length and (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {note.photos.map((p, idx) => (
                          <button key={idx} type="button" onClick={() => setViewer(p)} className="group relative">
                            <img src={p} alt="thumbnail" className="w-24 h-24 object-cover rounded-xl border shadow-sm" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {viewer && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setViewer(null)}>
          <img src={viewer} alt="preview" className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
