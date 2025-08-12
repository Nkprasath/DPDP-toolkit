import React, { useMemo, useState } from 'react';

export default function ConsentRights(){
  const [tab, setTab] = useState('consents');

  // Dummy data
  const consentRows = [
    { name: 'Aarav Sharma', email: 'aarav@example.com', status: 'Accepted', ts: '2025-08-06T10:15:00Z' },
    { name: 'Isha Verma', email: 'isha@example.com', status: 'Custom', ts: '2025-08-05T14:22:00Z' },
    { name: 'Rohan Mehta', email: 'rohan@example.com', status: 'Accepted', ts: '2025-08-04T09:10:00Z' },
    { name: 'Kavya Nair', email: 'kavya@example.com', status: 'Declined', ts: '2025-08-03T18:44:00Z' },
    { name: 'Dev Patel', email: 'dev@example.com', status: 'Accepted', ts: '2025-08-03T08:01:00Z' },
  ];

  const [dsarRows, setDsarRows] = useState([
    { id: 'DSAR-2001', email: 'isha@example.com', type: 'Access', status: 'Pending', submitted: '2025-08-06T12:00:00Z', details: 'User requested a copy of all personal data associated with their account.' },
    { id: 'DSAR-2002', email: 'rohan@example.com', type: 'Erasure', status: 'In Progress', submitted: '2025-08-05T09:30:00Z', details: 'User requested deletion of account data. Verification pending.' },
    { id: 'DSAR-2003', email: 'aarav@example.com', type: 'Rectification', status: 'Completed', submitted: '2025-08-04T15:10:00Z', details: 'User requested correction of contact number. Update completed.' },
    { id: 'DSAR-2004', email: 'kavya@example.com', type: 'Portability', status: 'Pending', submitted: '2025-08-04T10:05:00Z', details: 'User requested machine-readable export of profile data.' },
    { id: 'DSAR-2005', email: 'dev@example.com', type: 'Access', status: 'Rejected', submitted: '2025-08-03T07:00:00Z', details: 'Request rejected due to identity verification failure.' },
  ]);

  // Search & filters
  const [consentSearch, setConsentSearch] = useState('');
  const [consentStatus, setConsentStatus] = useState('All');

  const [dsarSearch, setDsarSearch] = useState('');
  const [dsarStatus, setDsarStatus] = useState('All');
  const [dsarType, setDsarType] = useState('All');
  const [dsarFrom, setDsarFrom] = useState(''); // YYYY-MM-DD
  const [dsarTo, setDsarTo] = useState('');     // YYYY-MM-DD
  const [viewDsar, setViewDsar] = useState(null);
  const onChangeDsarStatus = (id, status) => {
    setDsarRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filteredConsents = useMemo(() => {
    const q = consentSearch.trim().toLowerCase();
    return consentRows.filter(r => {
      const statusOk = consentStatus === 'All' ? true : r.status === consentStatus;
      const textOk = !q || `${r.name} ${r.email} ${r.status}`.toLowerCase().includes(q);
      return statusOk && textOk;
    });
  }, [consentRows, consentSearch, consentStatus]);

  const filteredDsars = useMemo(() => {
    const q = dsarSearch.trim().toLowerCase();
    const fromTs = dsarFrom ? new Date(dsarFrom).getTime() : null;
    const toTs = dsarTo ? new Date(dsarTo).getTime() + 24*60*60*1000 - 1 : null; // inclusive end of day
    return dsarRows.filter(r => {
      const statusOk = dsarStatus === 'All' ? true : r.status === dsarStatus;
      const typeOk = dsarType === 'All' ? true : r.type === dsarType;
      const textOk = !q || `${r.id} ${r.email}`.toLowerCase().includes(q);
      const t = new Date(r.submitted).getTime();
      const fromOk = fromTs == null || t >= fromTs;
      const toOk = toTs == null || t <= toTs;
      return statusOk && typeOk && textOk && fromOk && toOk;
    });
  }, [dsarRows, dsarSearch, dsarStatus, dsarType, dsarFrom, dsarTo]);

  return (
    <div className="space-y-6 text-gray-900">
      {/* Heading & Tabs */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Consent & Rights</h1>
          <p className="mt-1 text-sm text-gray-600">Manage consent records and DSAR workflows</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2">
          <TabButton active={tab==='consents'} onClick={()=>setTab('consents')}>Consents</TabButton>
          <TabButton active={tab==='dsars'} onClick={()=>setTab('dsars')}>DSARs</TabButton>
        </div>
      </div>

      {tab === 'consents' ? (
        <section className="space-y-3">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              </span>
              <input
                value={consentSearch}
                onChange={e=>setConsentSearch(e.target.value)}
                placeholder="Search name, email, or status"
                className="w-64 rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <select value={consentStatus} onChange={e=>setConsentStatus(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              {['All','Accepted','Custom','Declined'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Consent Status</Th>
                    <Th>Timestamp</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredConsents.map(r => (
                    <tr key={r.email + r.ts} className="hover:bg-gray-50/60">
                      <Td>{r.name}</Td>
                      <Td mono>{r.email}</Td>
                      <Td>{pill(r.status)}</Td>
                      <Td>{formatDateTime(r.ts)}</Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">View</button>
                          <button className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100">Revoke</button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                  {filteredConsents.length === 0 && (
                    <tr>
                      <Td colSpan={5} className="text-gray-600">No records</Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-3">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              </span>
              <input
                value={dsarSearch}
                onChange={e=>setDsarSearch(e.target.value)}
                placeholder="Search email or ID"
                className="w-72 rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <select value={dsarStatus} onChange={e=>setDsarStatus(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              {['All','Pending','In Progress','Completed','Rejected'].map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={dsarType} onChange={e=>setDsarType(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              {['All','Access','Erasure','Rectification','Portability'].map(o => <option key={o}>{o}</option>)}
            </select>
            <input type="date" value={dsarFrom} onChange={e=>setDsarFrom(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="date" value={dsarTo} onChange={e=>setDsarTo(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Request ID</Th>
                    <Th>Email</Th>
                    <Th>Request Type</Th>
                    <Th>Status</Th>
                    <Th>Submitted On</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDsars.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/60">
                      <Td mono>{r.id}</Td>
                      <Td mono>{r.email}</Td>
                      <Td>{r.type}</Td>
                      <Td>{pill(r.status)}</Td>
                      <Td>{formatDateTime(r.submitted)}</Td>
                      <Td>
                        <div className="flex flex-wrap items-center gap-2">
                          <button onClick={()=>setViewDsar(r)} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">View</button>
                          <select value={r.status} onChange={e=>onChangeDsarStatus(r.id, e.target.value)} className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600">
                            {['Pending','In Progress','Completed','Rejected'].map(s => <option key={s}>{s}</option>)}
                          </select>
                          <button onClick={()=>onDownloadDsar(r)} className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">Download</button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                  {filteredDsars.length === 0 && (
                    <tr>
                      <Td colSpan={6} className="py-10">
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                          <div className="text-4xl">🗂️</div>
                          <div className="text-sm font-medium text-gray-900">No DSAR requests found</div>
                          <div className="text-xs text-gray-600">Try clearing filters or adjusting the date range</div>
                        </div>
                      </Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* View Modal */}
          {viewDsar && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true">
              <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">DSAR {viewDsar.id}</h3>
                  <button onClick={()=>setViewDsar(null)} className="rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M6 6l12 12M6 18L18 6"/></svg>
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <Row label="Email" value={viewDsar.email} mono />
                  <Row label="Request Type" value={viewDsar.type} />
                  <Row label="Status" value={viewDsar.status} />
                  <Row label="Submitted" value={formatDateTime(viewDsar.submitted)} />
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-800">
                    {viewDsar.details}
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={()=>onDownloadDsar(viewDsar)} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Download</button>
                  <button onClick={()=>setViewDsar(null)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">Close</button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function TabButton({ active, children, onClick }){
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
        active ? 'bg-blue-600 text-white shadow-sm' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

function Th({ children }){
  return (
    <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
      {children}
    </th>
  );
}
function Td({ children, mono=false, colSpan, className='' }){
  return (
    <td colSpan={colSpan} className={`px-4 py-2 text-sm text-gray-800 ${mono ? 'font-mono' : ''} ${className}`}>
      {children}
    </td>
  );
}

function pill(status){
  const map = {
    Accepted: 'bg-green-100 text-green-800 ring-green-200',
    Completed: 'bg-green-100 text-green-800 ring-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 ring-blue-200',
    Declined: 'bg-red-100 text-red-700 ring-red-200',
    Custom: 'bg-gray-100 text-gray-700 ring-gray-200',
    Rejected: 'bg-red-100 text-red-700 ring-red-200',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-700 ring-gray-200';
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cls}`}>{status}</span>;
}

function formatDateTime(v){
  try { return new Date(v).toLocaleString(); } catch { return String(v); }
}

function Row({ label, value, mono=false }){
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-1 text-gray-500">{label}</div>
      <div className={`col-span-2 ${mono ? 'font-mono text-gray-800' : 'text-gray-800'}`}>{value}</div>
    </div>
  );
}

function onDownloadDsar(r){
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>DSAR ${escapeHtml(r.id)}</title>
    <style>body{font-family:Inter,system-ui,Segoe UI,Arial,sans-serif;line-height:1.6;padding:24px;color:#111827}</style>
  </head><body>
    <h1 style="font-size:20px;margin:0 0 12px">DSAR ${escapeHtml(r.id)}</h1>
    <div>Email: <strong>${escapeHtml(r.email)}</strong></div>
    <div>Type: <strong>${escapeHtml(r.type)}</strong></div>
    <div>Status: <strong>${escapeHtml(r.status)}</strong></div>
    <div>Submitted: <strong>${escapeHtml(formatDateTime(r.submitted))}</strong></div>
    <h2 style="margin-top:12px;font-size:16px">Details</h2>
    <div>${escapeHtml(r.details || '')}</div>
  </body></html>`;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(()=>{ try{ win.focus(); win.print(); }catch{} }, 200);
}

function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;');
}
