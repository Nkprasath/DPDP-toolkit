import React, { useMemo, useState } from 'react';

export default function TransferTracker(){
  const [risk, setRisk] = useState('All');
  const riskLevels = ['All', 'Low', 'Medium', 'High'];

  const [rows] = useState([
    { id: 1, country: 'United States', dataType: 'Customer PII', volume: '12k records / month', risk: 'Medium', last: '2025-08-06' },
    { id: 2, country: 'Germany', dataType: 'Telemetry', volume: '2.4M events / day', risk: 'Low', last: '2025-08-07' },
    { id: 3, country: 'India', dataType: 'Support Tickets', volume: '1.2k tickets / month', risk: 'Medium', last: '2025-08-05' },
    { id: 4, country: 'Brazil', dataType: 'Marketing Analytics', volume: '450k events / day', risk: 'Low', last: '2025-08-04' },
    { id: 5, country: 'Singapore', dataType: 'Payments Metadata', volume: '85k records / month', risk: 'High', last: '2025-08-03' },
    { id: 6, country: 'United Kingdom', dataType: 'Employee HR', volume: '3.2k records / quarter', risk: 'High', last: '2025-08-02' },
  ]);

  const filtered = useMemo(() => {
    return rows
      .filter(r => risk === 'All' ? true : r.risk === risk)
      .sort((a,b) => new Date(b.last) - new Date(a.last));
  }, [rows, risk]);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">Transfer Tracker</h1>
        <p className="text-sm text-gray-600">Monitor cross-border data transfers with risk visibility</p>
      </div>

      {/* Map Placeholder */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="text-sm font-medium text-gray-900">Global Transfer Map</div>
          <div className="text-xs text-gray-500">Static preview</div>
        </div>
        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png"
              alt="World map placeholder"
              className="h-56 w-full object-cover sm:h-64 md:h-80"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-600">Showing {filtered.length} transfers</div>
        <div>
          <select value={risk} onChange={e=>setRisk(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
            {riskLevels.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Country</Th>
                <Th>Data Type</Th>
                <Th>Volume</Th>
                <Th>Risk Level</Th>
                <Th>Last Transfer Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/60">
                  <Td>{r.country}</Td>
                  <Td>{r.dataType}</Td>
                  <Td>{r.volume}</Td>
                  <Td>{riskPill(r.risk)}</Td>
                  <Td>{formatDate(r.last)}</Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <Td colSpan={5} className="text-gray-600">No transfers</Td>
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

function riskPill(risk){
  const map = {
    High: 'bg-red-100 text-red-700 ring-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    Low: 'bg-green-100 text-green-800 ring-green-200',
  };
  const cls = map[risk] || 'bg-gray-100 text-gray-700 ring-gray-200';
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cls}`}>{risk}</span>;
}

function formatDate(v){
  try { return new Date(v).toLocaleDateString(); } catch { return String(v); }
}
