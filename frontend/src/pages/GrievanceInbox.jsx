import React, { useMemo, useState } from 'react';

export default function GrievanceInbox(){
  // Dummy data
  const [rows, setRows] = useState([
    { id: 'G-1024', email: 'aarav@example.com', subject: 'Unable to withdraw consent', priority: 'High', status: 'Pending', submitted: '2025-08-06T10:20:00Z' },
    { id: 'G-1025', email: 'isha@example.com', subject: 'Data rectification request', priority: 'Medium', status: 'In Progress', submitted: '2025-08-05T12:05:00Z' },
    { id: 'G-1026', email: 'rohan@example.com', subject: 'Marketing emails after opt-out', priority: 'High', status: 'Pending', submitted: '2025-08-05T08:45:00Z' },
    { id: 'G-1027', email: 'kavya@example.com', subject: 'Incorrect address on file', priority: 'Low', status: 'Closed', submitted: '2025-08-03T16:30:00Z' },
    { id: 'G-1028', email: 'dev@example.com', subject: 'Unable to access data copy', priority: 'Medium', status: 'Pending', submitted: '2025-08-04T09:15:00Z' },
  ]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [viewItem, setViewItem] = useState(null);

  const statuses = ['All','Pending','In Progress','Closed'];
  const priorities = ['All','Low','Medium','High'];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter(r => status === 'All' ? true : r.status === status)
      .filter(r => priority === 'All' ? true : r.priority === priority)
      .filter(r => !q || `${r.id} ${r.email} ${r.subject}`.toLowerCase().includes(q))
      .sort((a,b) => new Date(b.submitted) - new Date(a.submitted));
  }, [rows, status, priority, search]);

  function onAssign(r){
    const name = prompt('Assign to (name or email):');
    if (!name) return;
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, status: 'In Progress', assignee: name } : x));
  }

  function onClose(r){
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, status: 'Closed' } : x));
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">Grievance Inbox</h1>
        <p className="text-sm text-gray-600">Manage incoming grievances with filters and quick actions</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </span>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search by ID, email, or subject"
            className="w-72 rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={priority} onChange={e=>setPriority(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
            {priorities.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>ID</Th>
                <Th>Email</Th>
                <Th>Subject</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>Submitted On</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/60">
                  <Td mono>{r.id}</Td>
                  <Td mono>{r.email}</Td>
                  <Td className="max-w-[280px] truncate" title={r.subject}>{r.subject}</Td>
                  <Td>{priorityPill(r.priority)}</Td>
                  <Td>{statusPill(r.status)}</Td>
                  <Td>{formatDateTime(r.submitted)}</Td>
                  <Td>
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={()=>setViewItem(r)} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">View</button>
                      <button onClick={()=>onAssign(r)} className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">Assign</button>
                      <button onClick={()=>onClose(r)} className="rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700">Close</button>
                    </div>
                  </Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <Td colSpan={7} className="text-gray-600">No grievances</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple modal for View */}
      {viewItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Grievance {viewItem.id}</h3>
              <button onClick={()=>setViewItem(null)} className="rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M6 6l12 12M6 18L18 6"/></svg>
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
              <Row label="Email" value={viewItem.email} mono />
              <Row label="Subject" value={viewItem.subject} />
              <Row label="Priority" value={viewItem.priority} />
              <Row label="Status" value={viewItem.status} />
              <Row label="Submitted" value={formatDateTime(viewItem.submitted)} />
              {viewItem.assignee && <Row label="Assignee" value={viewItem.assignee} />}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setViewItem(null)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
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

function Row({ label, value, mono=false }){
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-1 text-gray-500">{label}</div>
      <div className={`col-span-2 ${mono ? 'font-mono text-gray-800' : 'text-gray-800'}`}>{value}</div>
    </div>
  );
}

function statusPill(status){
  const map = {
    Closed: 'bg-green-100 text-green-800 ring-green-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    Pending: 'bg-gray-100 text-gray-700 ring-gray-200',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-700 ring-gray-200';
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cls}`}>{status}</span>;
}

function priorityPill(priority){
  const map = {
    High: 'bg-red-100 text-red-700 ring-red-200',
    Medium: 'bg-orange-100 text-orange-700 ring-orange-200',
    Low: 'bg-blue-100 text-blue-800 ring-blue-200',
  };
  const cls = map[priority] || 'bg-gray-100 text-gray-700 ring-gray-200';
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cls}`}>{priority}</span>;
}

function formatDateTime(v){
  try { return new Date(v).toLocaleString(); } catch { return String(v); }
}
