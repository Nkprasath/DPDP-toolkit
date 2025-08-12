import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', to: '/admin', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M3 13h8V3H3v10zM13 21h8v-8h-8v8z"/><path d="M3 21h8v-6H3v6zM13 3v6h8V3h-8z"/></svg>
  )},
  { name: 'Consent & Rights', to: '/admin/consent-rights', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M12 3l9 6-9 6-9-6 9-6z"/><path d="M3 18l9 6 9-6"/></svg>
  )},
  { name: 'Self-Assessment', to: '/admin/self-assessment', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  )},
  { name: 'Policy Generator', to: '/admin/policy-generator', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M14 2v6h6"/></svg>
  )},
  { name: 'Customization', to: '/admin/customization', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
  )},
  { name: 'Compliance Tasks', to: '/admin/compliance-tasks', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M21 10H3"/><path d="M7 6h14"/><path d="M7 14h14"/><path d="M3 18h18"/></svg>
  )},
  { name: 'Breach Checklist', to: '/admin/breach-checklist', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M12 2l9 4-9 4-9-4 9-4z"/><path d="M3 10l9 4 9-4M3 18l9 4 9-4"/></svg>
  )},
  { name: 'Grievance Inbox', to: '/admin/grievance', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/></svg>
  )},
  { name: 'Transfer Tracker', to: '/admin/transfers', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M3 7h13l-3-3M3 17h13l-3 3M11 7v10"/></svg>
  )},
  { name: 'Data Flow Map', to: '/admin/data-flow', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h6M6 9v6M15 18h3M18 9v6"/></svg>
  )},
];

export default function Sidebar({ open, setOpen }){
  return (
    <>
      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={()=>setOpen(false)} />
      {/* Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-gray-900 text-gray-100 transition-transform md:static md:translate-x-0 md:w-64 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex h-14 items-center gap-2 px-4 border-b border-white/10">
          <div className="h-8 w-8 rounded bg-blue-600" />
          <div className="text-sm font-semibold tracking-wide">DPDP Admin</div>
        </div>
        <nav className="px-2 py-3 space-y-1 overflow-y-auto h-[calc(100%-3.5rem)]">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-blue-400' : 'text-gray-200'}`}
              onClick={()=>setOpen(false)}
            >
              <span className="text-gray-400 group-hover:text-gray-300">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
