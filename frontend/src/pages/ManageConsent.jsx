import React, { useEffect, useState } from 'react';

export default function ManageConsent() {
  const [current, setCurrent] = useState(null);
  const NEW_KEY = 'dpdp_consent_prefs_v1';
  const LEGACY_KEY = 'dpdp_consent';

  useEffect(() => {
    // Prefer new key, fall back to legacy
    const v1 = localStorage.getItem(NEW_KEY);
    if (v1) {
      try {
        const parsed = JSON.parse(v1);
        setCurrent({
          source: 'v1',
          preferences: parsed.preferences || {},
          updatedAt: parsed.updatedAt || null,
        });
        return;
      } catch {}
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        const prefs = parsed.categories || {};
        setCurrent({
          source: 'legacy',
          action: parsed.action,
          updatedAt: parsed.ts || null,
          preferences: {
            necessary: true,
            functional: !!prefs.functional,
            analytics: !!prefs.analytics,
            marketing: false,
          },
        });
      } catch {}
    }
  }, []);

  function withdraw() {
    localStorage.removeItem(NEW_KEY);
    localStorage.removeItem(LEGACY_KEY);
    setCurrent(null);
    alert('Consent withdrawn locally');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-900">Manage Consent</h2>
      {current ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-600">Source: <span className="font-medium text-gray-900">{current.source}</span></div>
            {current.updatedAt ? (
              <div className="text-sm text-gray-600">Updated: {new Date(current.updatedAt).toLocaleString()}</div>
            ) : null}
            <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['necessary','functional','analytics','marketing'].map(key => (
                <div key={key} className="rounded-md border border-gray-200 p-3 text-center">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">{key}</dt>
                  <dd className={`mt-1 text-sm font-medium ${current.preferences?.[key] ? 'text-green-700' : 'text-gray-700'}`}>
                    {current.preferences?.[key] ? 'On' : 'Off'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-700">Raw data</summary>
            <pre className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded-md p-3 max-h-80 overflow-auto">{JSON.stringify(current, null, 2)}</pre>
          </details>
          <button
            onClick={withdraw}
            className="inline-flex items-center px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black"
          >
            Withdraw Consent
          </button>
        </div>
      ) : (
        <div className="mt-3 text-gray-600">No consent recorded yet. Open the site to see the banner.</div>
      )}
    </div>
  );
}
