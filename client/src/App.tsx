import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Assets = lazy(() => import('./pages/Assets'));
const AssetDetails = lazy(() => import('./pages/assets/AssetDetails'));
const Analytics = lazy(() => import('./pages/Analytics'));
const PLReport = lazy(() => import('./pages/PLReport'));
const Deals = lazy(() => import('./pages/Deals'));
const NewDealWizard = lazy(() => import('./pages/deals/NewDealWizard'));
const DealDetails = lazy(() => import('./pages/deals/DealDetails'));
const Clients = lazy(() => import('./pages/Clients'));
const ClientDetails = lazy(() => import('./pages/clients/ClientDetails'));
const ExpenseTracker = lazy(() => import('./pages/ExpenseTracker'));
const Payments = lazy(() => import('./pages/Payments'));
const GSTBalance = lazy(() => import('./pages/GSTBalance'));
const Vendors = lazy(() => import('./pages/Vendors'));
const VendorDetails = lazy(() => import('./pages/VendorDetails'));
const Settings = lazy(() => import('./pages/Settings'));
const Invoices = lazy(() => import('./pages/Invoices'));
const InvoiceGenerator = lazy(() => import('./pages/invoices/InvoiceGenerator'));
const InvoiceDetails = lazy(() => import('./pages/invoices/InvoiceDetails'));
const Tasks = lazy(() => import('./pages/Tasks'));

import api from './lib/axios';

type AppState = 'loading' | 'unauthenticated' | 'onboarding' | 'authenticated';

const toastOptions = {
  style: { background: '#181c27', color: '#e8eaf0', border: '1px solid rgba(255,255,255,0.08)', fontSize: '15px' }
};

function App() {
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    const ac = new AbortController();
    const checkAuth = async () => {
      const token = localStorage.getItem('bc_token');
      if (!token) {
        setAppState('unauthenticated');
        return;
      }

      try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          clearSession();
          return;
        }
      } catch {
        clearSession();
        return;
      }

      try {
        const { data } = await api.get('/auth/me', { signal: ac.signal });
        const needsOnboarding =
          data.onboardingCompleted === false ||
          localStorage.getItem('bc_needs_onboarding') === 'true';

        if (needsOnboarding) {
          setAppState('onboarding');
        } else {
          setAppState('authenticated');
        }
      } catch (err: any) {
        if (err?.name !== 'CanceledError') {
          console.error('Session verification failed:', err);
          clearSession();
        }
      }
    };

    checkAuth();
    return () => ac.abort();
  }, []);

  const clearSession = () => {
    localStorage.removeItem('bc_token');
    localStorage.removeItem('bc_auth');
    localStorage.removeItem('bc_needs_onboarding');
    setAppState('unauthenticated');
  };

  const handleLogin = () => {
    const needsOnboarding = localStorage.getItem('bc_needs_onboarding') === 'true';
    setAppState(needsOnboarding ? 'onboarding' : 'authenticated');
  };

  const handleOnboardingComplete = () => {
    localStorage.removeItem('bc_needs_onboarding');
    setAppState('authenticated');
  };

  const handleLogout = async () => {
    clearSession();
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (appState === 'unauthenticated') {
    return (
      <>
        <Toaster position="bottom-right" toastOptions={toastOptions} />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  if (appState === 'onboarding') {
    return (
      <>
        <Toaster position="bottom-right" toastOptions={toastOptions} />
        <OnboardingPage onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={toastOptions} />
        <Layout onLogout={handleLogout}>
          <Suspense fallback={
            <div className="flex items-center justify-center py-40">
              <div className="w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full animate-spin" />
            </div>
          }>
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
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
