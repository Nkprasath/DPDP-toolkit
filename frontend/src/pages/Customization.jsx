import React, { useEffect, useMemo, useState } from 'react';

function readTheme(){
  try{ return JSON.parse(localStorage.getItem('dpdp_admin_theme')) || { primaryColor: '#111827', logoUrl: '', texts: { en: {}, hi: {} } }; }catch{ return { primaryColor: '#111827', logoUrl: '', texts: { en: {}, hi: {} } }; }
}

export default function Customization(){
  const [theme, setTheme] = useState(readTheme());
  const [lang, setLang] = useState(()=>{ try{ return localStorage.getItem('dpdp_lang') || 'en'; }catch{ return 'en'; } });
  const [position, setPosition] = useState(()=>{ try{ return localStorage.getItem('dpdp_banner_position') || 'bottom'; }catch{ return 'bottom'; } });
  const [preview, setPreview] = useState(()=>{ try{ return localStorage.getItem('dpdp_banner_preview') === '1'; }catch{ return false; } });

  const texts = useMemo(()=>({
    keys: [
      { key: 'bannerTitle', label: 'Banner Title', fallback: 'We use cookies to improve your experience' },
      { key: 'bannerDesc', label: 'Banner Description', fallback: 'Necessary cookies are always on. You can manage other categories.' },
      { key: 'acceptAll', label: 'Accept All Button', fallback: 'Accept All' },
      { key: 'manage', label: 'Manage Button', fallback: 'Manage Preferences' },
    ]
  }),[]);

  function saveTheme(next){
    const t = typeof next === 'function' ? next(theme) : next;
    setTheme(t);
    try{ localStorage.setItem('dpdp_admin_theme', JSON.stringify(t)); }catch{}
    dispatchPreviewEvent();
  }

  function saveLang(val){
    setLang(val);
    try{ localStorage.setItem('dpdp_lang', val); }catch{}
    dispatchPreviewEvent();
  }

  function savePosition(val){
    setPosition(val);
    try{ localStorage.setItem('dpdp_banner_position', val); }catch{}
    dispatchPreviewEvent();
  }

  function togglePreview(val){
    const next = typeof val === 'boolean' ? val : !preview;
    setPreview(next);
    try{ localStorage.setItem('dpdp_banner_preview', next ? '1' : '0'); }catch{}
    dispatchPreviewEvent();
  }

  function resetConsent(){
    try{ localStorage.removeItem('dpdp_consent_prefs_v1'); }catch{}
    dispatchPreviewEvent();
  }

  function dispatchPreviewEvent(){
    try{ window.dispatchEvent(new Event('dpdp-preview-updated')); }catch{}
  }

  useEffect(()=>{
    // Ensure defaults exist
    if (!theme.texts?.en) saveTheme(prev => ({ ...prev, texts: { ...(prev.texts||{}), en: {} } }));
    if (!theme.texts?.hi) saveTheme(prev => ({ ...prev, texts: { ...(prev.texts||{}), hi: {} } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const activeTexts = theme.texts?.[lang] || {};

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold text-gray-900">Consent Banner Customization</h1>
        <p className="mt-2 text-gray-600">Configure branding, language, and banner placement. Toggle preview to see the banner immediately.</p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="col-span-2 rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Branding</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <div className="mt-2 flex items-center gap-3">
                  <input type="color" value={theme.primaryColor || '#111827'} onChange={(e)=>saveTheme({ ...theme, primaryColor: e.target.value })} className="h-10 w-14 cursor-pointer rounded border" />
                  <input type="text" value={theme.primaryColor || ''} onChange={(e)=>saveTheme({ ...theme, primaryColor: e.target.value })} className="flex-1 rounded-md border px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                <input type="url" placeholder="https://..." value={theme.logoUrl || ''} onChange={(e)=>saveTheme({ ...theme, logoUrl: e.target.value })} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" />
              </div>
            </div>

            <h3 className="mt-6 text-sm font-semibold text-gray-900">Texts ({lang.toUpperCase()})</h3>
            <div className="mt-3 grid grid-cols-1 gap-4">
              {texts.keys.map(k => (
                <div key={k.key}>
                  <label className="block text-sm font-medium text-gray-700">{k.label}</label>
                  <input
                    type="text"
                    placeholder={k.fallback}
                    value={activeTexts[k.key] || ''}
                    onChange={(e)=>{
                      const val = e.target.value;
                      saveTheme(prev => ({
                        ...prev,
                        texts: {
                          ...prev.texts,
                          [lang]: { ...(prev.texts?.[lang]||{}), [k.key]: val }
                        }
                      }));
                    }}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select value={lang} onChange={(e)=>saveLang(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Banner Position</label>
                <select value={position} onChange={(e)=>savePosition(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
                  <option value="bottom">Bottom (center)</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top">Top (center)</option>
                </select>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Preview Mode</p>
                  <p className="text-xs text-gray-600">Show the banner regardless of saved consent.</p>
                </div>
                <button
                  type="button"
                  onClick={()=>togglePreview()}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-white ${preview ? 'bg-blue-600' : 'bg-gray-400'}`}
                >{preview ? 'On' : 'Off'}</button>
              </div>
              <button type="button" onClick={resetConsent} className="w-full rounded-md border px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">Reset Saved Consent</button>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">How to preview</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li><strong>Enable Preview Mode</strong> to force the banner to show.</li>
            <li><strong>Change Position</strong> to move the banner.</li>
            <li><strong>Edit Texts/Branding</strong> to see updates immediately.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
