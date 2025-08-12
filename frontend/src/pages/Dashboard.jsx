import React from 'react';

export default function Dashboard(){
  // Dummy data
  const stats = [
    { title: 'Total Consents Collected', value: '1,248', sub: '+32 this week' },
    { title: 'Pending DSAR Requests', value: '7', sub: '3 due soon' },
    { title: 'Compliance Score', value: '92%', sub: 'Stable' },
    { title: 'Cross-Border Transfers (30d)', value: '12', sub: '2 high-risk' },
  ];

  const recentConsents = [
    { name: 'Aarav Sharma', email: 'aarav@example.com', status: 'Accepted', date: '2025-08-05' },
    { name: 'Isha Verma', email: 'isha@example.com', status: 'Custom', date: '2025-08-05' },
    { name: 'Rohan Mehta', email: 'rohan@example.com', status: 'Accepted', date: '2025-08-04' },
    { name: 'Kavya Nair', email: 'kavya@example.com', status: 'Declined', date: '2025-08-03' },
    { name: 'Dev Patel', email: 'dev@example.com', status: 'Accepted', date: '2025-08-03' },
  ];

  const recentDsars = [
    { email: 'isha@example.com', type: 'Access', status: 'Pending', date: '2025-08-06' },
    { email: 'rohan@example.com', type: 'Deletion', status: 'In Progress', date: '2025-08-05' },
    { email: 'aarav@example.com', type: 'Rectification', status: 'Completed', date: '2025-08-04' },
    { email: 'kavya@example.com', type: 'Portability', status: 'Pending', date: '2025-08-04' },
    { email: 'dev@example.com', type: 'Access', status: 'Completed', date: '2025-08-03' },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Privacy compliance overview</p>
      </div>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{s.title}</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">{s.value}</div>
                <div className="mt-1 text-xs text-gray-500">{s.sub}</div>
              </div>
              <span className="h-10 w-10 rounded-full bg-blue-50 ring-1 ring-blue-100 inline-flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6v12M6 12h12"/>
                </svg>
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Tables */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Consents */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">Recent Consents</h2>
            <a className="text-sm text-blue-600 hover:text-blue-700" href="#">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentConsents.map((c) => (
                  <tr key={c.email + c.date} className="hover:bg-gray-50/60">
                    <Td>{c.name}</Td>
                    <Td mono>{c.email}</Td>
                    <Td>{pill(c.status)}</Td>
                    <Td>{formatDate(c.date)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent DSAR Requests */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">Recent DSAR Requests</h2>
            <a className="text-sm text-blue-600 hover:text-blue-700" href="#">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Email</Th>
                  <Th>Request Type</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentDsars.map((d) => (
                  <tr key={d.email + d.date} className="hover:bg-gray-50/60">
                    <Td mono>{d.email}</Td>
                    <Td>{d.type}</Td>
                    <Td>{pill(d.status)}</Td>
                    <Td>{formatDate(d.date)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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
function Td({ children, mono=false }){
  return (
    <td className={`px-4 py-2 text-sm text-gray-800 ${mono ? 'font-mono' : ''}`}>
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
  };
  const cls = map[status] || 'bg-gray-100 text-gray-700 ring-gray-200';
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cls}`}>{status}</span>;
}

function formatDate(v){
  try { return new Date(v).toLocaleDateString(); } catch { return String(v); }
}
