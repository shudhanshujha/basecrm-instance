import React, { useState } from 'react';
import { 
  CreditCard, ArrowUpRight, ArrowDownRight, 
  Search, Filter, CheckCircle2, Clock, 
  Plus, Download, IndianRupee, Building, Truck, X,
  Calendar, CreditCard as MethodIcon, Loader2
} from 'lucide-react';
import api from '../lib/axios';
import { format } from 'date-fns';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collections' | 'payouts'>('collections');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [collections, setCollections] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<any>({ netCollections: 0, totalPayouts: 0, netCashFlow: 0 });

  React.useEffect(() => {
    fetchPayments();
    fetchEntities();
    fetchSummary();
  }, [activeTab]);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/analytics/payments-summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary');
    }
  };

  const fetchEntities = async () => {
    try {
      const [clientsRes, vendorsRes] = await Promise.all([
        api.get('/clients'),
        api.get('/vendors')
      ]);
      setClients(clientsRes.data);
      setVendors(vendorsRes.data);
    } catch (error) {
      console.error('Failed to fetch entities', error);
    }
  };

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      if (activeTab === 'collections') {
        const res = await api.get('/payments/clients');
        setCollections(res.data);
      } else {
        const res = await api.get('/payments/vendors');
        setPayouts(res.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load ledger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      if (activeTab === 'collections') {
        await api.post('/payments/clients', {
          ...data,
          amount: parseFloat(data.amount as string),
          paymentDate: new Date(data.paymentDate as string).toISOString()
        });
      } else {
        await api.post('/payments/vendors', {
          ...data,
          amount: parseFloat(data.amount as string),
          paymentDate: new Date(data.paymentDate as string).toISOString(),
          month: new Date(data.paymentDate as string).getMonth() + 1,
          year: new Date(data.paymentDate as string).getFullYear()
        });
      }
      toast.success(`${activeTab === 'collections' ? 'Collection' : 'Payout'} recorded!`);
      setShowModal(false);
      fetchPayments();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to record payment');
    }
  };

  const currentData = (activeTab === 'collections' ? collections : payouts).filter(p => 
    (p.client?.name || p.vendor?.vendorName || p.client || p.vendor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.invoice?.invoiceNumber || p.purpose || p.inv || p.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Payments & Ledger</h1>
          <p className="text-[14px] text-text-muted mt-1 uppercase tracking-widest font-black">Settlement History · Cash Flow tracking</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={activeTab === 'collections' ? collections : payouts} filename={`basecrm_${activeTab}_ledger`} />
          <button onClick={() => setShowModal(true)} className="btn-primary text-[15px] py-1.5 flex items-center gap-2">
            <Plus size={16} /> Record {activeTab === 'collections' ? 'Collection' : 'Payout'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         <div className="card border-border/40 shadow-sm">
            <div className="text-[12px] text-success uppercase font-black tracking-widest">Net Collections (MTD)</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{summary.netCollections.toLocaleString()}</div>
         </div>
         <div className="card border-border/40 shadow-sm">
            <div className="text-[12px] text-danger uppercase font-black tracking-widest">Total Payouts (MTD)</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{summary.totalPayouts.toLocaleString()}</div>
         </div>
         <div className="card border-border/40 shadow-sm">
            <div className="text-[12px] text-accent-blue uppercase font-black tracking-widest">Net Cash Flow</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{summary.netCashFlow.toLocaleString()}</div>
         </div>
      </div>

      <div className="card p-0 overflow-hidden border-border/40 shadow-xl">
         <div className="flex border-b border-border bg-bg-surface-2">
            <button 
              onClick={() => setActiveTab('collections')}
              className={`flex-1 py-4 text-[14px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative ${activeTab === 'collections' ? 'text-success bg-success/5' : 'text-text-muted hover:text-text-primary'}`}
            >
              <ArrowUpRight size={14} /> Client Collections
              {activeTab === 'collections' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-success"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('payouts')}
              className={`flex-1 py-4 text-[14px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative ${activeTab === 'payouts' ? 'text-danger bg-danger/5' : 'text-text-muted hover:text-text-primary'}`}
            >
              <ArrowDownRight size={14} /> Vendor Payouts
              {activeTab === 'payouts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-danger"></div>}
            </button>
         </div>

         <div className="p-4 border-b border-border bg-bg-surface-2/50">
            <div className="relative max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
               <input 
                 type="text" 
                 placeholder={`Search by ${activeTab === 'collections' ? 'client or invoice' : 'vendor or type'}...`}
                 className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-[15px] outline-none focus:border-accent-orange"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-bg-surface-2/30 border-b border-border text-[12px] text-text-muted uppercase font-black tracking-widest">
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">{activeTab === 'collections' ? 'Entity / Reference' : 'Vendor / Service'}</th>
                     <th className="px-6 py-4">Method</th>
                     <th className="px-6 py-4 text-center">Status</th>
                     <th className="px-6 py-4 text-right">Settlement Amount</th>
                  </tr>
               </thead>
                <tbody className="divide-y divide-border">
                   {isLoading ? (
                      <tr><td colSpan={5} className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-accent-orange" /></td></tr>
                   ) : currentData.map((p) => (
                      <tr key={p.id} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                         <td className="px-6 py-4 text-[15px] font-medium text-text-muted">{format(new Date(p.paymentDate || p.date), 'dd MMM yyyy')}</td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded flex items-center justify-center border border-border ${activeTab === 'collections' ? 'text-success' : 'text-danger'}`}>
                                  {activeTab === 'collections' ? <Building size={14} /> : <Truck size={14} />}
                               </div>
                               <div>
                                  <div className="text-[16px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{p.client?.name || p.vendor?.vendorName || p.client || p.vendor}</div>
                                  <div className="text-[13px] text-text-muted font-bold mt-0.5">{p.invoice?.invoiceNumber || p.purpose || p.inv || p.type}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-[14px] font-bold text-text-primary">{p.paymentMode || p.method}</td>
                         <td className="px-6 py-4 text-center">
                            <span className={`status-tag ${
                              p.status === 'Settled' || p.status === 'Paid' || p.status === 'PAID' ? 'bg-success' : 
                              p.status === 'Pending' || p.status === 'PENDING' ? 'bg-warning' : 
                              activeTab === 'collections' ? 'bg-success' : 'bg-warning'
                            }`}>
                               {p.status || 'Settled'}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className={`text-[17px] font-black ${activeTab === 'collections' ? 'text-text-primary' : 'text-danger'}`}>₹{p.amount?.toLocaleString()}</div>
                         </td>
                      </tr>
                   ))}
                </tbody>
            </table>
         </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-bg-primary/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-bg-surface border border-border rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface-2">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${activeTab === 'collections' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                       <CreditCard size={20} />
                    </div>
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-tighter">
                       {activeTab === 'collections' ? 'Record Client Collection' : 'Record Vendor Payout'}
                    </h2>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-2 hover:bg-bg-surface border border-transparent hover:border-border rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSavePayment}>
              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                       <label className="text-[13px] font-black text-text-muted uppercase ml-1">
                          {activeTab === 'collections' ? 'Select Client' : 'Select Vendor'}
                       </label>
                       <select name={activeTab === 'collections' ? 'clientId' : 'vendorId'} required className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-[16px] outline-none font-bold">
                          <option value="">Select Entity</option>
                          {activeTab === 'collections' 
                            ? clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                            : vendors.map(v => <option key={v.id} value={v.id}>{v.vendorName}</option>)
                          }
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[13px] font-black text-text-muted uppercase ml-1">Reference (Invoice/PO)</label>
                       <input name={activeTab === 'collections' ? 'invoiceId' : 'purpose'} type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none font-mono" placeholder="INV-0000" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[13px] font-black text-text-muted uppercase ml-1">Date of Settlement</label>
                       <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                          <input name="paymentDate" type="date" required className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-4 py-3 text-[15px] outline-none" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[13px] font-black text-text-muted uppercase ml-1">Payment Method</label>
                       <select name="paymentMode" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none appearance-none font-bold">
                          <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                          <option value="UPI">UPI / QR Scan</option>
                          <option value="CHEQUE">Cheque / Draft</option>
                          <option value="CASH">Cash Ledger</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[13px] font-black text-text-muted uppercase ml-1">Settlement Amount (₹)</label>
                       <input name="amount" type="number" required className={`w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[19px] font-black outline-none ${activeTab === 'collections' ? 'text-success' : 'text-danger'}`} placeholder="0.00" />
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2">
                 <button type="button" onClick={() => setShowModal(false)} className="btn-outline px-8 py-2.5 text-[15px]">Discard</button>
                 <button type="submit" className={`px-10 py-2.5 rounded-xl text-[15px] font-black uppercase tracking-widest text-white shadow-xl transition-all ${activeTab === 'collections' ? 'bg-success shadow-success/20' : 'bg-danger shadow-danger/20'}`}>
                    Confirm Settlement
                 </button>
              </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
