import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AssetDetails from './pages/assets/AssetDetails';
import Analytics from './pages/Analytics';
import PLReport from './pages/PLReport';
import Deals from './pages/Deals';
import NewDealWizard from './pages/deals/NewDealWizard';
import DealDetails from './pages/deals/DealDetails';
import Clients from './pages/Clients';
import ClientDetails from './pages/clients/ClientDetails';
import ExpenseTracker from './pages/ExpenseTracker';
import Payments from './pages/Payments';
import GSTBalance from './pages/GSTBalance';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import Settings from './pages/Settings';
import Invoices from './pages/Invoices';
import InvoiceGenerator from './pages/invoices/InvoiceGenerator';
import InvoiceDetails from './pages/invoices/InvoiceDetails';

import api from './lib/axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('bc_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Fast-guard locally against expired JWT to avoid layout flicker or redundant API queries
      try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          console.warn('Session expired (local check)');
          localStorage.removeItem('bc_token');
          localStorage.removeItem('bc_auth');
          setIsAuthenticated(false);
          return;
        }
      } catch (e) {
        // Clear session on malformed token
        localStorage.removeItem('bc_token');
        localStorage.removeItem('bc_auth');
        setIsAuthenticated(false);
        return;
      }

      try {
        await api.get('/auth/me');
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Session verification failed:', err);
        localStorage.removeItem('bc_token');
        localStorage.removeItem('bc_auth');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = async () => {
    localStorage.removeItem('bc_token');
    localStorage.removeItem('bc_auth');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#181c27', color: '#e8eaf0', border: '1px solid rgba(255,255,255,0.08)', fontSize: '15px' }
        }} />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#181c27', color: '#e8eaf0', border: '1px solid rgba(255,255,255,0.08)', fontSize: '15px' }
      }} />
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:id" element={<DealDetails />} />
          <Route path="/deals/new" element={<NewDealWizard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<VendorDetails />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:id" element={<AssetDetails />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/new" element={<InvoiceGenerator />} />
          <Route path="/invoices/edit/:id" element={<InvoiceGenerator />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/expenses" element={<ExpenseTracker />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/pl-report" element={<PLReport />} />
          <Route path="/gst" element={<GSTBalance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
