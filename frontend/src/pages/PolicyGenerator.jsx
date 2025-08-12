import React, { useMemo, useRef, useState } from 'react';

export default function PolicyGenerator(){
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('SaaS');
  const [jurisdiction, setJurisdiction] = useState('Global');
  const [dataTypes, setDataTypes] = useState([]);
  const [otherData, setOtherData] = useState('');
  const [language, setLanguage] = useState('English');
  const [policy, setPolicy] = useState('');
  const [copied, setCopied] = useState(false);
  const printWinRef = useRef(null);

  const businessTypes = useMemo(() => ['E-commerce','SaaS','Healthcare','Education','Finance','Other'], []);
  const jurisdictions = useMemo(() => ['India - DPDP','EU - GDPR','US - CCPA','Global'], []);
  const allDataTypes = useMemo(() => ['Name','Email','Phone Number','Payment Info','Location Data','Health Data','Cookies & Tracking','Other'], []);

  function onToggleDataType(item){
    setDataTypes(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  }

  function buildPolicy(){
    const name = company || 'Your Company';
    const site = website || 'https://example.com';
    const contact = email || 'privacy@example.com';
    const bt = type || 'Business';
    const j = jurisdiction;
    const dt = dataTypes.includes('Other') && otherData.trim() ? [...dataTypes.filter(d=>d!=='Other'), otherData.trim()] : dataTypes;
    const today = new Date().toLocaleDateString();
    const list = (arr) => arr.length === 0 ? 'basic account information' : arr.join(', ');
    const isGDPRorDPDP = j === 'EU - GDPR' || j === 'India - DPDP';

    if (language === 'Hindi'){
      return (
`गोपनीयता नीति\n\nअंतिम अद्यतन: ${today}\n\n${name} ("हम") ${site} संचालित करता है। यह गोपनीयता नीति बताती है कि हम अपने ${bt.toLowerCase()} सेवाओं के संदर्भ में व्यक्तिगत डेटा कैसे एकत्र, उपयोग और सुरक्षित करते हैं।\n\nपरिचय\nयह दस्तावेज़ आपके डेटा के बारे में पारदर्शी जानकारी प्रदान करता है और लागू कानून (${j}) के अनुरूप है।\n\nहम कौन सी जानकारी एकत्र करते हैं\nहम आपके द्वारा प्रदान की गई जानकारी (उदा. नाम, ईमेल) और स्वतः एकत्रित डेटा (उदा. डिवाइस/आईपी/उपयोग) एकत्र कर सकते हैं। हमारे लिए प्रासंगिक श्रेणियाँ: ${list(dt)}।\n\nहम आपके डेटा का उपयोग कैसे करते हैं\nसेवाओं का संचालन और सुधार, ग्राहक सहायता, सुरक्षा, संचार, भुगतान/लेनदेन प्रसंस्करण, और कानूनी अनुपालन हेतु।\n\n${isGDPRorDPDP ? 'प्रसंस्करण का वैध आधार\nहम निम्न वैध आधारों पर डेटा संसाधित करते हैं: सहमति, अनुबंध का निष्पादन, कानूनी दायित्व, और वैध हित।' : ''}\n\nडेटा भंडारण\nहम डेटा को आवश्यकतानुसार और लागू कानूनों के अनुरूप रखते हैं।\n\nआपके अधिकार\nआप एक्सेस, सुधार, मिटाने, पोर्टेबिलिटी और आपत्ति जैसे अधिकारों का प्रयोग कर सकते हैं (कानून के अनुसार)। अनुरोध के लिए ' + contact + ' पर संपर्क करें।\n\nहमसे कैसे संपर्क करें\nयदि आपके कोई प्रश्न हैं, कृपया ' + contact + ' पर लिखें।`);
    }

    let rightsBlock = 'You may exercise rights available under applicable law. To submit a request, contact us at ' + contact + '.';
    if (j === 'EU - GDPR') rightsBlock = 'Under GDPR, you may request access, rectification, erasure, restriction, portability, or object to processing. Contact: ' + contact + '.';
    if (j === 'India - DPDP') rightsBlock = 'Under India DPDP, you may seek access, correction, erasure, grievance redressal, and consent withdrawal. Contact: ' + contact + '.';
    if (j === 'US - CCPA') rightsBlock = 'Under CCPA, you may request to know, delete, correct, and opt-out of sale/share. We do not discriminate for exercising your rights. Contact: ' + contact + '.';

    const legalBasis = isGDPRorDPDP ? '\nLegal Basis for Processing\nWe process personal data where one or more of the following apply: consent, performance of a contract, compliance with legal obligations, or our legitimate interests, balanced against your rights.' : '';

    return (
`Privacy Policy\n\nLast updated: ${today}\n\n${name} ("we", "us") operates ${site}. This Privacy Policy explains how we collect, use, and safeguard personal data in connection with our ${bt.toLowerCase()} services in accordance with ${j}.\n\nIntroduction\nThis document provides transparent information about our data practices.\n\nInformation We Collect\nWe collect information you provide (e.g., account and contact details) and data collected automatically (e.g., device, IP, usage). Relevant categories for our services include: ${list(dt)}.\n\nHow We Use Your Data\nWe use data to operate and improve our services, provide support, secure our platform, personalize experiences, process payments, communicate updates, and comply with laws.\n${legalBasis}\n\nData Retention\nWe retain personal data only for as long as necessary for the purposes described or as required by law.\n\nYour Rights\n${rightsBlock}\n\nHow to Contact Us\nIf you have questions or requests, contact us at ${contact}.`);
  }

  function generatePolicy(e){
    e.preventDefault();
    setPolicy(buildPolicy());
    setCopied(false);
  }

  async function onCopy(){
    try{
      await navigator.clipboard.writeText(policy);
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    }catch{
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = policy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    }
  }

  function onDownloadPdf(){
    if(!policy) return;
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>Privacy Policy</title>
      <style>body{font-family:Inter,system-ui,Segoe UI,Arial,sans-serif;line-height:1.6;padding:24px;color:#111827} pre{white-space:pre-wrap;word-wrap:break-word}</style>
    </head><body><h1 style=\"font-size:20px;margin:0 0 12px\">Privacy Policy</h1><pre>${escapeHtml(policy)}</pre></body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    printWinRef.current = win;
    // Give it a tick to render, then print
    setTimeout(()=>{
      try { win.focus(); win.print(); } catch {}
    }, 200);
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Policy Generator</h1>
        <p className="mt-1 text-sm text-gray-600">Fill in the details to generate a structured, realistic privacy policy.</p>
      </div>

      {/* Form */}
      <form onSubmit={generatePolicy} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="company">Company Name</label>
            <input id="company" value={company} onChange={e=>setCompany(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Acme Inc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="website">Website URL</label>
            <input id="website" value={website} onChange={e=>setWebsite(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="https://acme.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Contact Email</label>
            <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="privacy@acme.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="type">Business Type</label>
            <select id="type" value={type} onChange={e=>setType(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="jurisdiction">Jurisdiction</label>
            <select id="jurisdiction" value={jurisdiction} onChange={e=>setJurisdiction(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="language">Policy Language</label>
            <select id="language" value={language} onChange={e=>setLanguage(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              {['English','Hindi'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Data Types Collected</label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {allDataTypes.map(item => (
                <label key={item} className="flex items-center gap-2 text-sm text-gray-800">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" checked={dataTypes.includes(item)} onChange={()=>onToggleDataType(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {dataTypes.includes('Other') && (
              <input value={otherData} onChange={e=>setOtherData(e.target.value)} placeholder="Specify other data types" className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            )}
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <button type="submit" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Generate Policy</button>
          {policy && <span className="text-xs text-gray-500">Regenerate to update with new details</span>}
        </div>
      </form>

      {/* Output */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Generated Policy</h2>
          <div className="flex items-center gap-2">
            <button onClick={()=>{ setPolicy(buildPolicy()); setCopied(false); }} disabled={!policy && !(company||website||email)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">Regenerate</button>
            <button onClick={onCopy} disabled={!policy} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">{copied ? 'Copied' : 'Copy to Clipboard'}</button>
            <button onClick={onDownloadPdf} disabled={!policy} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">Download as PDF</button>
          </div>
        </div>
        <div className="mt-3 max-h-72 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-3">
          {policy ? (
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{policy}</pre>
          ) : (
            <div className="text-sm text-gray-500">No policy generated yet. Fill the form and click Generate.</div>
          )}
        </div>
      </div>
    </div>
  );
}
