import React, { useEffect, useRef, useState } from 'react';

export default function Topbar({ onMenu }){
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDoc(e){ if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex h-14 items-center gap-3 px-3 md:px-4">
        <button onClick={onMenu} className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </span>
          <input
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-2 rounded-full p-1.5 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
            <img src={`https://api.dicebear.com/9.x/identicon/svg?seed=dpdp`} alt="avatar" className="h-8 w-8 rounded-full ring-2 ring-blue-600/20" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-gray-500"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
              <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50">Profile</button>
              <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50">Settings</button>
              <div className="my-1 border-t border-gray-100" />
              <button className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
