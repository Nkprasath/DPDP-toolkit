import React, { useMemo, useState } from 'react';

export default function ComplianceTasks(){
  const [tasks, setTasks] = useState([
    { id: 't1', name: 'Update Privacy Policy', category: 'Policy', status: 'Pending', due: '2025-08-15' },
    { id: 't2', name: 'Implement Consent Banner', category: 'Consent', status: 'In Progress', due: '2025-08-12' },
    { id: 't3', name: 'Define DSAR Workflow & SLAs', category: 'DSAR', status: 'Done', due: '2025-08-05' },
    { id: 't4', name: 'Vendor Assessment: Payments', category: 'Vendor', status: 'Pending', due: '2025-08-20' },
    { id: 't5', name: 'Security Incident Runbook', category: 'Security', status: 'In Progress', due: '2025-08-18' },
    { id: 't6', name: 'Employee Privacy Training', category: 'Training', status: 'Pending', due: '2025-08-25' },
  ]);

  const categories = useMemo(() => ['All','Policy','Consent','DSAR','Vendor','Security','Training'], []);
  const statuses = useMemo(() => ['All','Pending','In Progress','Done'], []);

  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = useMemo(() => {
    return tasks
      .filter(t => (filterCat === 'All' || t.category === filterCat))
      .filter(t => (filterStatus === 'All' || t.status === filterStatus))
      .sort((a,b) => new Date(a.due) - new Date(b.due));
  }, [tasks, filterCat, filterStatus]);

  // Compliance Score: Done=1, In Progress=0.5, Pending=0
  const scorePct = useMemo(() => {
    if (tasks.length === 0) return 0;
    const score = tasks.reduce((acc,t) => acc + (t.status === 'Done' ? 1 : t.status === 'In Progress' ? 0.5 : 0), 0);
    return Math.round((score / tasks.length) * 100);
  }, [tasks]);

  function setStatus(id, status){
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  function toCsv(rows){
    const head = ['Task Name','Category','Status','Due Date'];
    const lines = [head.join(',')];
    for (const r of rows){
      const vals = [r.name, r.category, r.status, r.due].map(v => `"${String(v).replaceAll('"','""')}"`);
      lines.push(vals.join(','));
    }
    return lines.join('\n');
  }

  function exportCsv(){
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compliance_tasks.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">Compliance Tasks</h1>
        <p className="text-sm text-gray-600">Track tasks, filter by status/category, and export to CSV</p>
      </div>

      {/* Compliance Score */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>Compliance Score</span>
          <span>{scorePct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${scorePct}%` }} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Export as CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Task Name</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Due Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/60">
                  <Td>{r.name}</Td>
                  <Td>{r.category}</Td>
                  <Td>{statusPill(r.status)}</Td>
                  <Td>{formatDate(r.due)}</Td>
                  <Td>
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={()=>setStatus(r.id,'Pending')} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Pending</button>
                      <button onClick={()=>setStatus(r.id,'In Progress')} className="rounded-md bg-yellow-600 px-2 py-1 text-xs text-white hover:bg-yellow-700">In Progress</button>
                      <button onClick={()=>setStatus(r.id,'Done')} className="rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700">Done</button>
                    </div>
                  </Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <Td colSpan={5} className="text-gray-600">No tasks</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
function Td({ children, colSpan, className='' }){
  return (
    <td colSpan={colSpan} className={`px-4 py-2 text-sm text-gray-800 ${className}`}>
      {children}
    </td>
  );
}

function statusPill(status){
  const map = {
    Done: 'bg-green-100 text-green-800 ring-green-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    Pending: 'bg-gray-100 text-gray-700 ring-gray-200',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-700 ring-gray-200';
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cls}`}>{status}</span>;
}

function formatDate(v){
  try { return new Date(v).toLocaleDateString(); } catch { return String(v); }
}
