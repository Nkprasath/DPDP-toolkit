import React, { useMemo, useState } from 'react';

export default function BreachChecklist(){
  // Dummy checklist
  const initial = useMemo(() => ([
    { id: 'c1', text: 'Identify and contain the incident', done: false },
    { id: 'c2', text: 'Assemble incident response team', done: false },
    { id: 'c3', text: 'Assess impact and affected data subjects', done: false },
    { id: 'c4', text: 'Notify internal stakeholders and leadership', done: false },
    { id: 'c5', text: 'Engage legal and compliance for obligations', done: false },
    { id: 'c6', text: 'Prepare regulator and data subject notifications', done: false },
    { id: 'c7', text: 'Secure evidence and preserve logs', done: false },
    { id: 'c8', text: 'Remediate vulnerabilities and monitor', done: false },
    { id: 'c9', text: 'Document post-incident review and actions', done: false },
  ]), []);

  const [items, setItems] = useState(initial);

  const total = items.length;
  const doneCount = items.filter(i => i.done).length;
  const pct = Math.round((doneCount / total) * 100);

  function toggle(id){
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }

  function setAll(v){
    setItems(prev => prev.map(i => ({ ...i, done: v })));
  }

  function onDownloadPdf(){
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>Breach Checklist</title>
      <style>
        body{font-family:Inter,system-ui,Segoe UI,Arial,sans-serif;line-height:1.6;padding:24px;color:#111827}
        h1{font-size:20px;margin:0 0 12px}
        .meta{color:#6b7280;font-size:12px;margin-bottom:12px}
        ul{padding-left:20px}
        li{margin:6px 0}
        .done{color:#065f46}
      </style>
    </head><body>
      <h1>Breach Checklist</h1>
      <div class=\"meta\">Completion: ${pct}% (${doneCount}/${total})</div>
      <ul>
        ${items.map(i => `<li class=\"${i.done ? 'done' : ''}\">${i.done ? '☑' : '☐'} ${escapeHtml(i.text)}</li>`).join('')}
      </ul>
    </body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(()=>{ try{ win.focus(); win.print(); }catch{} }, 200);
  }

  function escapeHtml(str){
    return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">Breach Checklist</h1>
        <p className="text-sm text-gray-600">Track incident response steps and export progress</p>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>Completed</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={()=>setAll(true)} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">Mark all done</button>
        <button onClick={()=>setAll(false)} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">Reset</button>
        <button onClick={onDownloadPdf} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Download as PDF</button>
      </div>

      {/* Checklist */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <ul className="grid grid-cols-1 gap-2">
          {items.map((i, idx) => {
            const inputId = `chk_${i.id}`;
            return (
              <li key={i.id} className="">
                <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={i.done}
                    onChange={()=>toggle(i.id)}
                    className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-600"
                  />
                  <span className={`text-sm ${i.done ? 'text-gray-700 line-through' : 'text-gray-800'}`}>{idx+1}. {i.text}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
