import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Sites from './pages/Sites';
import SiteDetails from './pages/sites/SiteDetails';
import Analytics from './pages/Analytics';
import PLReport from './pages/PLReport';
import Campaigns from './pages/Campaigns';
import NewCampaignWizard from './pages/campaigns/NewCampaignWizard';
import CampaignDetails from './pages/campaigns/CampaignDetails';
import Clients from './pages/Clients';
import ClientDetails from './pages/clients/ClientDetails';
import ExpenseTracker from './pages/ExpenseTracker';
import Payments from './pages/Payments';
import GSTBalance from './pages/GSTBalance';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import RecurringSites from './pages/RecurringSites';
import Settings from './pages/Settings';

const Placeholder = ({ title }: { title: string }) => (
  <div className="card min-h-[400px] flex flex-col items-center justify-center border-dashed">
    <div className="w-16 h-16 bg-bg-surface-2 rounded-full flex items-center justify-center mb-4 border border-border">
       <div className="w-8 h-8 bg-accent-orange/20 rounded-full animate-pulse"></div>
    </div>
    <h1 className="text-xl font-bold mb-2 text-text-primary">{title}</h1>
    <p className="text-text-muted italic max-w-xs text-center text-[12px]">This core module is being optimized for Pan-India operations. Detailed view coming soon.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#181c27', color: '#e8eaf0', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }
      }} />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/campaigns/new" element={<NewCampaignWizard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<VendorDetails />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/sites/:id" element={<SiteDetails />} />
          <Route path="/invoices" element={<Placeholder title="Smart Invoicing" />} />
          <Route path="/expenses" element={<ExpenseTracker />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/pl-report" element={<PLReport />} />
          <Route path="/gst" element={<GSTBalance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/recurring" element={<RecurringSites />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
