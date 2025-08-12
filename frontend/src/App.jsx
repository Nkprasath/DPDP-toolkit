import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import ConsentBanner from './components/ConsentBanner';
import ManageConsent from './pages/ManageConsent';
import DsarSubmit from './pages/DsarSubmit';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import ConsentRights from './pages/ConsentRights';
import SelfAssessment from './pages/SelfAssessment';
import PolicyGenerator from './pages/PolicyGenerator';
import ComplianceTasks from './pages/ComplianceTasks';
import BreachChecklist from './pages/BreachChecklist';
import GrievanceInbox from './pages/GrievanceInbox';
import TransferTracker from './pages/TransferTracker';
import DataFlowMap from './pages/DataFlowMap';
import Customization from './pages/Customization';
import LayoutWrapper from './components/LayoutWrapper';

export default function App(){
  return (
    <HashRouter>
      <header className="border-b border-gray-200">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4 text-sm text-gray-700">
          <Link className="hover:text-black" to="/">Home</Link>
          <Link className="hover:text-black" to="/manage-consent">Manage Consent</Link>
          <Link className="hover:text-black" to="/dsar">DSAR</Link>
          <Link className="hover:text-black" to="/admin">Admin</Link>
        </nav>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <div className="mx-auto max-w-6xl px-4 py-8">
              <h1 className="text-2xl font-semibold text-gray-900">DPDP Consent MVP</h1>
              <p className="mt-2 text-gray-600">Welcome — this is a demo app.</p>
            </div>
          }
        />
        <Route path="/manage-consent" element={<ManageConsent />} />
        <Route path="/dsar" element={<DsarSubmit />} />
        <Route path="/admin" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
        <Route path="/admin/consent-rights" element={<LayoutWrapper><ConsentRights /></LayoutWrapper>} />
        <Route path="/admin/dsar" element={<LayoutWrapper><div className="text-gray-900"><h1 className="text-xl font-semibold">DSAR Requests</h1></div></LayoutWrapper>} />
        <Route path="/admin/self-assessment" element={<LayoutWrapper><SelfAssessment /></LayoutWrapper>} />
        <Route path="/admin/policy-generator" element={<LayoutWrapper><PolicyGenerator /></LayoutWrapper>} />
        <Route path="/admin/compliance-tasks" element={<LayoutWrapper><ComplianceTasks /></LayoutWrapper>} />
        <Route path="/admin/breach-checklist" element={<LayoutWrapper><BreachChecklist /></LayoutWrapper>} />
        <Route path="/admin/grievance" element={<LayoutWrapper><GrievanceInbox /></LayoutWrapper>} />
        <Route path="/admin/transfers" element={<LayoutWrapper><TransferTracker /></LayoutWrapper>} />
        <Route path="/admin/data-flow" element={<LayoutWrapper><DataFlowMap /></LayoutWrapper>} />
        <Route path="/admin/customization" element={<LayoutWrapper><Customization /></LayoutWrapper>} />
      </Routes>
      <ConsentBanner />
    </HashRouter>
  );
}

