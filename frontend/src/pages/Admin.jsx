import React, { useEffect, useState } from 'react';

export default function Admin(){
  const [consents, setConsents] = useState([]);
  const [dsars, setDsars] = useState([]);
  const [dsarOverrides, setDsarOverrides] = useState(() => readDsarOverrides());
  const [dsarSearch, setDsarSearch] = useState('');
  const [dsarStatusFilter, setDsarStatusFilter] = useState('all');
  const [theme, setTheme] = useState(readTheme());

  useEffect(() => {
    fetch('http://localhost:4000/api/consent').then(r=>r.json()).then(d=>{ if(d.ok) setConsents(mergeWithLocalConsent(d.data)) });
    fetch('http://localhost:4000/api/dsar').then(r=>r.json()).then(d=>{ if(d.ok) setDsars(d.data) });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-900">Admin</h2>
      <Metrics consents={consents} dsars={mergeDsarsWithOverrides(dsars, dsarOverrides)} />
      <Branding theme={theme} onChange={(t)=>{ setTheme(t); saveTheme(t); }} />
      <section className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Recent Consents</h3>
        <div className="mt-2 flex items-center gap-2">
          <button onClick={() => exportConsentsCsv(consents)} className="inline-flex items-center rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black">Export CSV</button>
          <button onClick={() => exportConsentsPdf(consents)} className="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50">Export PDF</button>
        </div>
        <ConsentBreakdown consents={consents} />
        <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>ID</Th>
                  <Th>Action</Th>
                  <Th>Necessary</Th>
                  <Th>Functional</Th>
                  <Th>Analytics</Th>
                  <Th>Marketing</Th>
                  <Th>Updated</Th>
                  <Th>IP</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {consents && consents.length > 0 ? consents.slice(0, 50).map((c, i) => {
                  const id = firstDefined(c, ['id','_id','uuid']) ?? String(i+1);
                  const action = c?.action ?? 'custom';
                  const cats = c?.categories || c?.preferences || {};
                  const necessary = cats.necessary ?? cats.essential ?? true;
                  const functional = !!cats.functional;
                  const analytics = !!cats.analytics;
                  const marketing = !!cats.marketing;
                  const when = firstDefined(c, ['updatedAt','createdAt','ts','timestamp']);
                  const ip = firstDefined(c, ['ip','clientIp','request_ip','remote_addr']);
                  return (
                    <tr key={id} className="hover:bg-gray-50/60">
                      <Td mono>{truncate(id)}</Td>
                      <Td>{action}</Td>
                      <Td>{boolPill(necessary)}</Td>
                      <Td>{boolPill(functional)}</Td>
                      <Td>{boolPill(analytics)}</Td>
                      <Td>{boolPill(marketing)}</Td>
                      <Td>{formatDate(when)}</Td>
                      <Td mono>{ip ?? '-'}</Td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <Td colSpan={8} className="text-gray-600">No records</Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-gray-700">Raw data</summary>
          <pre className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded-md p-3 max-h-80 overflow-auto">{JSON.stringify(consents, null, 2)}</pre>
        </details>
      </section>

      <section className="mt-8">
        <h3 className="text-sm font-medium text-gray-900">Recent DSARs</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input value={dsarSearch} onChange={e=>setDsarSearch(e.target.value)} placeholder="Search by ID, email, principal" className="w-64 rounded-md border px-3 py-1.5 text-sm" />
          <select value={dsarStatusFilter} onChange={e=>setDsarStatusFilter(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm">
            <option value="all">All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>ID</Th>
                  <Th>Type</Th>
                  <Th>Principal</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Note</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filterDsars(mergeDsarsWithOverrides(dsars, dsarOverrides), dsarSearch, dsarStatusFilter).slice(0, 50).map((d, i) => {
                  const id = firstDefined(d, ['id','_id','uuid']) ?? String(i+1);
                  const type = d?.type ?? '-';
                  const principal = d?.principal_identifier ?? '-';
                  const email = d?.contact?.email ?? '-';
                  const status = d?.status ?? '-';
                  const note = d?.note ?? '';
                  const created = firstDefined(d, ['createdAt','created_at','ts','timestamp']);
                  return (
                    <tr key={id} className="hover:bg-gray-50/60">
                      <Td mono>{truncate(id)}</Td>
                      <Td>{type}</Td>
                      <Td>{principal}</Td>
                      <Td>{email}</Td>
                      <Td>
                        <select value={status} onChange={(e)=>updateDsarOverride(id, { status: e.target.value }, dsarOverrides, setDsarOverrides)} className="rounded border px-2 py-1 text-sm">
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </Td>
                      <Td>
                        <input value={note} onChange={(e)=>updateDsarOverride(id, { note: e.target.value }, dsarOverrides, setDsarOverrides)} placeholder="Add note" className="w-56 rounded border px-2 py-1 text-sm" />
                      </Td>
                      <Td>{formatDate(created)}</Td>
                      <Td>
                        <button onClick={()=>persistDsarOverride(id, dsarOverrides)} className="rounded bg-gray-900 px-2 py-1 text-xs text-white hover:bg-black">Save</button>
                      </Td>
                    </tr>
                  );
                })}
                {filterDsars(mergeDsarsWithOverrides(dsars, dsarOverrides), dsarSearch, dsarStatusFilter).length === 0 && (
                  <tr>
                    <Td colSpan={8} className="text-gray-600">No records</Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-gray-700">Raw data</summary>
          <pre className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded-md p-3 max-h-80 overflow-auto">{JSON.stringify(dsars, null, 2)}</pre>
        </details>
      </section>
    </div>
  );
}

function Th({ children }) {
  return (
    <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
      {children}
    </th>
  );
}

function Td({ children, colSpan, className = '', mono = false }) {
  return (
    <td colSpan={colSpan} className={`px-4 py-2 text-sm text-gray-800 ${mono ? 'font-mono' : ''} ${className}`}>
      {children}
    </td>
  );
}

function firstDefined(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

function truncate(val, n = 8) {
  const s = String(val);
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function formatDate(v) {
  if (!v) return '-';
  try {
    const d = typeof v === 'number' ? new Date(v) : new Date(String(v));
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  } catch { return '-'; }
}

function boolPill(v) {
  const on = !!v;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        on ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
      }`}
    >
      {on ? 'On' : 'Off'}
    </span>
  );
}

// ---------- Consents helpers ----------
function exportConsentsCsv(consents) {
  if (!consents || consents.length === 0) return;
  const headers = ['id','action','necessary','functional','analytics','marketing','updatedAt','ip'];
  const rows = consents.map((c, i) => {
    const id = firstDefined(c, ['id','_id','uuid']) ?? String(i+1);
    const action = c?.action ?? 'custom';
    const cats = c?.categories || c?.preferences || {};
    const necessary = cats.necessary ?? cats.essential ?? true;
    const functional = !!cats.functional;
    const analytics = !!cats.analytics;
    const marketing = !!cats.marketing;
    const when = firstDefined(c, ['updatedAt','createdAt','ts','timestamp']);
    const ip = firstDefined(c, ['ip','clientIp','request_ip','remote_addr']) ?? '';
    return [id, action, necessary, functional, analytics, marketing, when ? new Date(when).toISOString() : '', ip];
  });
  const csv = [headers, ...rows].map(r => r.map(v => typeof v === 'string' ? `"${v.replaceAll('"','""')}"` : String(v)).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `consents_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportConsentsPdf(consents) {
  // Print-friendly PDF using browser print dialog
  const win = window.open('', '_blank');
  if (!win) return;
  const rows = consents.map((c, i) => {
    const id = firstDefined(c, ['id','_id','uuid']) ?? String(i+1);
    const action = c?.action ?? 'custom';
    const cats = c?.categories || c?.preferences || {};
    const necessary = cats.necessary ?? cats.essential ?? true;
    const functional = !!cats.functional;
    const analytics = !!cats.analytics;
    const marketing = !!cats.marketing;
    const when = firstDefined(c, ['updatedAt','createdAt','ts','timestamp']);
    const ip = firstDefined(c, ['ip','clientIp','request_ip','remote_addr']) ?? '';
    return { id, action, necessary, functional, analytics, marketing, when: when ? new Date(when).toLocaleString() : '-', ip };
  });
  win.document.write(`<!doctype html><html><head><title>Consent Logs</title>
    <style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial}table{border-collapse:collapse;width:100%}th,td{border:1px solid #E5E7EB;padding:6px 8px;font-size:12px}th{background:#F9FAFB;text-align:left}</style>
  </head><body><h3>Consent Logs</h3><table><thead><tr>
    <th>ID</th><th>Action</th><th>Necessary</th><th>Functional</th><th>Analytics</th><th>Marketing</th><th>Updated</th><th>IP</th>
  </tr></thead><tbody>
  ${rows.map(r => `<tr><td>${r.id}</td><td>${r.action}</td><td>${r.necessary}</td><td>${r.functional}</td><td>${r.analytics}</td><td>${r.marketing}</td><td>${r.when}</td><td>${r.ip}</td></tr>`).join('')}
  </tbody></table><script>window.onload=()=>window.print()</script></body></html>`);
  win.document.close();
}

function ConsentBreakdown({ consents }) {
  const total = consents?.length || 0;
  const counts = { functional: 0, analytics: 0, marketing: 0 };
  consents?.forEach(c => {
    const cats = c?.categories || c?.preferences || {};
    if (cats.functional) counts.functional++;
    if (cats.analytics) counts.analytics++;
    if (cats.marketing) counts.marketing++;
  });
  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {Object.entries(counts).map(([k, v]) => (
        <div key={k} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">{k} opted-in</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">{v}</div>
          <div className="mt-1 text-xs text-gray-600">{total ? Math.round((v/total)*100) : 0}% of {total}</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-green-500" style={{ width: `${total ? (v/total)*100 : 0}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- DSAR helpers ----------
function readDsarOverrides(){
  try{ const raw = localStorage.getItem('dpdp_admin_dsar_overrides'); return raw ? JSON.parse(raw) : {}; }catch{ return {}; }
}
function saveDsarOverrides(data){
  localStorage.setItem('dpdp_admin_dsar_overrides', JSON.stringify(data));
}
function mergeDsarsWithOverrides(dsars, overrides){
  return (dsars||[]).map(d => {
    const id = firstDefined(d, ['id','_id','uuid']);
    if (!id) return d;
    return { ...d, ...(overrides[id]||{}) };
  });
}
function updateDsarOverride(id, patch, overrides, setOverrides){
  const next = { ...overrides, [id]: { ...(overrides[id]||{}), ...patch } };
  setOverrides(next);
}
function persistDsarOverride(id, overrides){
  const next = { ...(readDsarOverrides()), [id]: { ...(overrides[id]||{}), updatedAt: Date.now() } };
  saveDsarOverrides(next);
  alert('Saved locally');
}
function filterDsars(dsars, q, status){
  const s = (q||'').toLowerCase();
  return (dsars||[]).filter(d => {
    const statusOk = status==='all' ? true : (d?.status===status);
    if (!s) return statusOk;
    const hay = [d?.id, d?._id, d?.uuid, d?.contact?.email, d?.principal_identifier].map(x=>String(x||'').toLowerCase()).join(' ');
    return statusOk && hay.includes(s);
  });
}

// ---------- Metrics ----------
function Metrics({ consents, dsars }){
  const consentSeries = bucketByDay(consents, ['updatedAt','createdAt','ts','timestamp']);
  const dsarSeries = bucketByDay(dsars, ['createdAt','created_at','ts','timestamp']);
  const compliance = computeComplianceScore(dsars);
  return (
    <section className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <MetricCard title="Consents (7d)" value={sumLastNDays(consentSeries, 7)} series={consentSeries} />
      <MetricCard title="DSARs (7d)" value={sumLastNDays(dsarSeries, 7)} series={dsarSeries} />
      <MetricCard title="Opt-in % (avg)" value={`${Math.round(averageOptIn(consents))}%`} />
      <MetricCard title="Compliance Score" value={`${compliance}`} hint="Based on DSAR resolution speed" />
    </section>
  );
}
function MetricCard({ title, value, series = [], hint }){
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
      {series.length>0 && <MiniSparkline data={series} />}
    </div>
  );
}
function MiniSparkline({ data }){
  // data: [{date: 'YYYY-MM-DD', count}]
  const w=160, h=38, pad=4;
  const max = Math.max(1, ...data.map(d=>d.count));
  const step = (w - pad*2) / Math.max(1, data.length-1);
  const points = data.map((d,i)=>`${pad + i*step},${h - pad - (d.count/max)*(h-pad*2)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full h-10">
      <polyline fill="none" stroke="#10B981" strokeWidth="2" points={points} />
    </svg>
  );
}
function bucketByDay(items, dateKeys){
  const map = new Map();
  (items||[]).forEach(it => {
    const when = firstDefined(it, dateKeys);
    if (!when) return;
    const d = new Date(when);
    if (Number.isNaN(d.getTime())) return;
    const key = d.toISOString().slice(0,10);
    map.set(key, (map.get(key)||0)+1);
  });
  return Array.from(map.entries()).sort((a,b)=>a[0]>b[0]?1:-1).map(([date,count])=>({date,count}));
}
function sumLastNDays(series, n){
  const cut = new Date(Date.now()- (n-1)*24*3600*1000).toISOString().slice(0,10);
  return series.filter(s=>s.date>=cut).reduce((a,b)=>a+b.count,0);
}
function averageOptIn(consents){
  if (!consents || consents.length===0) return 0;
  let total=0, opted=0;
  consents.forEach(c=>{
    const cats = c?.categories || c?.preferences || {};
    ['functional','analytics','marketing'].forEach(k=>{ total++; if (cats[k]) opted++; });
  });
  return total? (opted/total)*100 : 0;
}
function computeComplianceScore(dsars){
  // Very simple heuristic: 100 if completed within 7 days on average, lower otherwise
  const completed = (dsars||[]).filter(d=> (d?.status||'').toLowerCase()==='completed');
  if (completed.length===0) return 50;
  const avgDays = completed.reduce((acc,d)=>{
    const c = new Date(firstDefined(d,['createdAt','created_at','ts','timestamp'])||Date.now());
    const r = new Date(firstDefined(d,['resolvedAt','resolved_at','completedAt'])||Date.now());
    return acc + Math.max(0,(r-c))/86400000;
  },0)/completed.length;
  const score = Math.max(10, Math.min(100, 100 - (avgDays-7)*10));
  return Math.round(score);
}

 // ---------- Local consent merge for demo ----------
 function mergeWithLocalConsent(serverConsents){
   const list = Array.isArray(serverConsents) ? [...serverConsents] : [];
   try{
     const raw = localStorage.getItem('dpdp_consent_prefs_v1');
     if (raw) {
       const parsed = JSON.parse(raw);
       const localRow = {
         id: 'local',
         action: 'saved',
         preferences: parsed.preferences,
         categories: parsed.preferences,
         updatedAt: parsed.updatedAt,
         ip: parsed.ip,
       };
       list.unshift(localRow);
     }
   }catch{}
   return list;
 }

 // ---------- Branding / Theming ----------
 function readTheme(){
   try{ return JSON.parse(localStorage.getItem('dpdp_admin_theme')) || { primaryColor: '#111827', logoUrl: '', texts: { en: {}, hi: {} } }; }catch{ return { primaryColor: '#111827', logoUrl: '', texts: { en: {}, hi: {} } }; }
 }
 function saveTheme(t){ localStorage.setItem('dpdp_admin_theme', JSON.stringify(t)); }

 function Branding({ theme, onChange }){
   const [form, setForm] = useState(theme);
   useEffect(()=>{ setForm(theme); }, [theme]);
   function update(path, value){
     const next = { ...form };
     const segs = path.split('.');
     let obj = next; for (let i=0;i<segs.length-1;i++){ obj[segs[i]] = obj[segs[i]]||{}; obj = obj[segs[i]]; }
     obj[segs[segs.length-1]] = value;
     setForm(next);
   }
   return (
     <section className="mt-6">
       <h3 className="text-sm font-medium text-gray-900">Branding & Theming</h3>
       <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
           <div>
             <label className="block text-xs font-medium text-gray-700">Primary Color</label>
             <input type="color" value={form.primaryColor} onChange={e=>update('primaryColor', e.target.value)} className="mt-1 h-9 w-16 cursor-pointer rounded-md border" />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-700">Logo URL</label>
             <input type="url" value={form.logoUrl} onChange={e=>update('logoUrl', e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm" />
           </div>
           <div className="flex items-center gap-2">
             <button onClick={()=>onChange(form)} className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black">Save</button>
             <button onClick={()=>{ const def={ primaryColor:'#111827', logoUrl:'', texts:{en:{},hi:{}} }; setForm(def); onChange(def); }} className="rounded-md border px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50">Reset</button>
           </div>
         </div>
         <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
           <h4 className="text-xs font-medium text-gray-700">Custom Text (English)</h4>
           <TextInput label="Banner Title" value={form.texts?.en?.bannerTitle||''} onChange={v=>update('texts.en.bannerTitle', v)} />
           <TextInput label="Banner Description" value={form.texts?.en?.bannerDesc||''} onChange={v=>update('texts.en.bannerDesc', v)} />
           <TextInput label="Accept Button" value={form.texts?.en?.acceptAll||''} onChange={v=>update('texts.en.acceptAll', v)} />
           <TextInput label="Manage Button" value={form.texts?.en?.manage||''} onChange={v=>update('texts.en.manage', v)} />
         </div>
         <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
           <h4 className="text-xs font-medium text-gray-700">Custom Text (Hindi)</h4>
           <TextInput label="Banner Title" value={form.texts?.hi?.bannerTitle||''} onChange={v=>update('texts.hi.bannerTitle', v)} />
           <TextInput label="Banner Description" value={form.texts?.hi?.bannerDesc||''} onChange={v=>update('texts.hi.bannerDesc', v)} />
           <TextInput label="Accept Button" value={form.texts?.hi?.acceptAll||''} onChange={v=>update('texts.hi.acceptAll', v)} />
           <TextInput label="Manage Button" value={form.texts?.hi?.manage||''} onChange={v=>update('texts.hi.manage', v)} />
         </div>
       </div>
       <p className="mt-2 text-xs text-gray-500">These settings are stored locally and used by the consent banner for theming and text.</p>
     </section>
   );
 }

 function TextInput({ label, value, onChange }){
   return (
     <div>
       <label className="block text-xs font-medium text-gray-700">{label}</label>
       <input value={value} onChange={e=>onChange(e.target.value)} className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm" />
     </div>
   );
 }
