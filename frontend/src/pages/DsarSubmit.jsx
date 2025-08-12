import React, { useState } from 'react';

export default function DsarSubmit() {
  const [form, setForm] = useState({ principal_identifier: '', contactEmail: '', type: 'access', details: '' });
  async function submit(e) {
    e.preventDefault();
    const payload = {
      principal_identifier: form.principal_identifier,
      contact: { email: form.contactEmail },
      type: form.type,
      details: form.details
    };
    const res = await fetch('http://localhost:4000/api/dsar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.ok) alert('DSAR submitted: ' + data.id);
    else alert('Error');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h3 className="text-xl font-semibold text-gray-900">Submit a Data Request</h3>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="principal" className="block text-sm font-medium text-gray-700">Your email or ID</label>
          <input
            id="principal"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="you@example.com"
            value={form.principal_identifier}
            onChange={e => setForm({ ...form, principal_identifier: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact email</label>
          <input
            id="contactEmail"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="optional"
            value={form.contactEmail}
            onChange={e => setForm({ ...form, contactEmail: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Request type</label>
          <select
            id="type"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="access">Access</option>
            <option value="delete">Delete</option>
            <option value="rectify">Rectify</option>
          </select>
        </div>
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details (optional)</label>
          <textarea
            id="details"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Provide any extra context"
            rows={4}
            value={form.details}
            onChange={e => setForm({ ...form, details: e.target.value })}
          />
        </div>
        <div className="pt-2">
          <button type="submit" className="inline-flex items-center px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
