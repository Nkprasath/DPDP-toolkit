import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function ConsentBanner() {
  const STORAGE_KEY = 'dpdp_consent_prefs_v1';
  const LEGACY_KEY = 'dpdp_consent';
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState({ necessary: true, functional: false, analytics: false, marketing: false });
  const [lang, setLang] = useState(readLang());
  const [ip, setIp] = useState('');
  const theme = readTheme();
  const modalRef = useRef(null);
  const [version, setVersion] = useState(0); // force rerender on customization changes
  // Banner preview & position (from localStorage)
  const preview = (typeof window !== 'undefined') && localStorage.getItem('dpdp_banner_preview') === '1';
  const position = (typeof window !== 'undefined') && (localStorage.getItem('dpdp_banner_position') || 'bottom');

  useEffect(() => {
    // Show banner if preview is on, else only if preferences not set. Respect legacy key too.
    if (preview) {
      setVisible(true);
      return;
    }
    const savedNew = localStorage.getItem(STORAGE_KEY);
    const savedLegacy = localStorage.getItem(LEGACY_KEY);
    if (!savedNew && !savedLegacy) {
      setVisible(true);
    } else if (savedNew) {
      try {
        const parsed = JSON.parse(savedNew);
        if (parsed?.preferences) setPrefs({ ...prefs, ...parsed.preferences, necessary: true });
      } catch {}
    } else if (savedLegacy) {
      try {
        const parsed = JSON.parse(savedLegacy);
        if (parsed?.categories) setPrefs({ necessary: true, functional: !!parsed.categories.functional, analytics: !!parsed.categories.analytics, marketing: false });
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Fetch client IP for audit trail (best-effort)
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => setIp(d?.ip || ''))
      .catch(() => {});
  }, []);

  // Listen to customization change events to update visibility/position/theme in-place
  useEffect(() => {
    function recomputeVisibility(){
      const isPreview = localStorage.getItem('dpdp_banner_preview') === '1';
      if (isPreview) {
        setVisible(true);
      } else {
        const savedNew = localStorage.getItem(STORAGE_KEY);
        const savedLegacy = localStorage.getItem(LEGACY_KEY);
        setVisible(!savedNew && !savedLegacy);
      }
      setVersion(v => v + 1);
    }
    const onStorage = (e) => {
      if (!e || !e.key || ['dpdp_banner_preview','dpdp_banner_position','dpdp_admin_theme', STORAGE_KEY, LEGACY_KEY, 'dpdp_lang'].includes(e.key)) {
        recomputeVisibility();
      }
    };
    const onCustom = () => recomputeVisibility();
    window.addEventListener('storage', onStorage);
    window.addEventListener('dpdp-preview-updated', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('dpdp-preview-updated', onCustom);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    // Focus trap & ESC close
    const modalEl = modalRef.current;
    if (!modalEl) return;
    const selectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(modalEl.querySelectorAll(selectors)).filter(el => !el.hasAttribute('disabled'));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
      if (e.key === 'Tab' && focusables.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  function savePreferences(nextPrefs) {
    const toSave = nextPrefs ?? prefs;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ preferences: { ...toSave, necessary: true }, updatedAt: Date.now(), ip, lang })
    );
    setVisible(false);
    setOpen(false);
  }

  function acceptAll() {
    const all = { necessary: true, functional: true, analytics: true, marketing: true };
    setPrefs(all);
    savePreferences(all);
  }

  if (!visible) return null;

  // Compute position-based classes
  function getWrapperClasses(pos){
    switch(pos){
      case 'top':
        return 'fixed inset-x-0 top-4 z-40 flex justify-center px-4';
      case 'bottom-left':
        return 'fixed left-4 bottom-4 z-40 flex justify-start px-0';
      case 'bottom-right':
        return 'fixed right-4 bottom-4 z-40 flex justify-end px-0';
      default:
        return 'fixed inset-x-0 bottom-4 z-40 flex justify-center px-4';
    }
  }
  const wrapperCls = getWrapperClasses(position);
  const innerWidth = (position === 'bottom-left' || position === 'bottom-right') ? 'max-w-md' : 'max-w-3xl';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="consent-banner"
          role="region"
          aria-label="Cookie consent"
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className={wrapperCls}
        >
          <div className={`w-full ${innerWidth} rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-xl ring-1 ring-black/5`}>
            <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3 text-sm md:text-base text-gray-700">
                {theme.logoUrl ? (
                  <img src={theme.logoUrl} alt="Logo" className="h-8 w-8 rounded-md object-contain ring-1 ring-black/10" />
                ) : null}
                <div>
                  <p className="font-semibold text-gray-900">{t(theme, lang, 'bannerTitle', 'We use cookies to improve your experience')}</p>
                  <p className="mt-1 text-gray-600">{t(theme, lang, 'bannerDesc', 'Necessary cookies are always on. You can manage other categories.')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                  onClick={acceptAll}
                  style={{ backgroundColor: theme.primaryColor || undefined }}
                >
                  {t(theme, lang, 'acceptAll', 'Accept All')}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-white/30 bg-white/60 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                  onClick={() => setOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={open}
                  aria-controls="consent-modal"
                >
                  {t(theme, lang, 'manage', 'Manage Preferences')}
                </button>
                <select
                  aria-label="Select language"
                  value={lang}
                  onChange={(e)=>{ setLang(e.target.value); saveLang(e.target.value); }}
                  className="rounded-md border bg-white/80 px-2 py-1 text-xs text-gray-900 hover:bg-white"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="consent-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-labelledby="consent-modal-title"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.div
              key="consent-modal"
              id="consent-modal"
              ref={modalRef}
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative z-10 w-full max-w-xl mx-4 rounded-2xl border border-white/20 bg-white/80 backdrop-blur-xl p-6 shadow-2xl ring-1 ring-black/5"
            >
              <h2 id="consent-modal-title" className="text-lg sm:text-xl font-semibold text-gray-900">Manage preferences</h2>
              <p className="mt-1 text-sm text-gray-600">Choose which cookies we can use. Necessary cookies are always enabled.</p>

              <div className="mt-5 divide-y divide-gray-200/60">
                <PrefRow
                  title={t(theme, lang, 'necessaryTitle', 'Necessary Cookies')}
                  description={t(theme, lang, 'necessaryDesc', 'Required for core functionality like security and network management.')}
                  checked={true}
                  disabled
                  onChange={() => {}}
                />
                <PrefRow
                  title={t(theme, lang, 'functionalTitle', 'Functional Cookies')}
                  description={t(theme, lang, 'functionalDesc', 'Remember settings and preferences to enhance your experience.')}
                  checked={prefs.functional}
                  onChange={(val) => setPrefs(p => ({ ...p, functional: val }))}
                />
                <PrefRow
                  title={t(theme, lang, 'analyticsTitle', 'Analytics Cookies')}
                  description={t(theme, lang, 'analyticsDesc', 'Help us understand how the site is used to improve it.')}
                  checked={prefs.analytics}
                  onChange={(val) => setPrefs(p => ({ ...p, analytics: val }))}
                />
                <PrefRow
                  title={t(theme, lang, 'marketingTitle', 'Marketing Cookies')}
                  description={t(theme, lang, 'marketingDesc', 'Personalize content and measure the effectiveness of campaigns.')}
                  checked={prefs.marketing}
                  onChange={(val) => setPrefs(p => ({ ...p, marketing: val }))}
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                  onClick={() => savePreferences()}
                  style={{ backgroundColor: theme.primaryColor || undefined }}
                >
                  Save preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

export default ConsentBanner;

function PrefRow({ title, description, checked, onChange, disabled }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} ariaLabel={title} activeColor={readTheme().primaryColor} />
    </div>
  );
}

function ToggleSwitch({ checked, onChange, disabled, ariaLabel, activeColor }) {
  function handleKeyDown(e) {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange?.(!checked);
    }
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
        disabled ? 'opacity-50 cursor-not-allowed border-gray-300' : checked ? 'border-transparent' : 'bg-gray-200 border-gray-300'
      }`}
      style={{ backgroundColor: checked ? (activeColor || undefined) : undefined }}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// -------- Theming & i18n helpers --------
function readTheme(){
  try{ return JSON.parse(localStorage.getItem('dpdp_admin_theme')) || { primaryColor: '#111827', logoUrl: '', texts: { en: {}, hi: {} } }; }catch{ return { primaryColor: '#111827', logoUrl: '', texts: { en: {}, hi: {} } }; }
}
function readLang(){
  try{ return localStorage.getItem('dpdp_lang') || 'en'; }catch{ return 'en'; }
}
function saveLang(l){
  try{ localStorage.setItem('dpdp_lang', l); }catch{}
}
function t(theme, lang, key, fallback){
  const val = theme?.texts?.[lang]?.[key];
  return val && String(val).trim().length > 0 ? val : fallback;
}
