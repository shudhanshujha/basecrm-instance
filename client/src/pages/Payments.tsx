import React, { useState } from 'react';
import { 
  CreditCard, ArrowUpRight, ArrowDownRight, 
  Search, Filter, CheckCircle2, Clock, 
  Plus, Download, IndianRupee, Building, Truck, X,
  Calendar, CreditCard as MethodIcon
} from 'lucide-react';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collections' | 'payouts'>('collections');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [collections, setCollections] = useState([
    { id: '1', date: '10 May 2026', client: 'Reliance Retail Ltd', inv: 'INV-0041', amount: '₹3,20,000', method: 'Bank Transfer', status: 'Settled' },
    { id: '2', date: '08 May 2026', client: 'Axis Bank Ltd', inv: 'INV-0039', amount: '₹1,80,000', method: 'UPI / Razorpay', status: 'Pending' },
    { id: '3', date: '02 May 2026', client: 'Havells India', inv: 'INV-0035', amount: '₹90,000', method: 'Cheque', status: 'Settled' },
  ]);

  const [payouts, setPayouts] = useState([
    { id: '1', date: '09 May 2026', vendor: 'Haryana Outdoor Media', type: 'Site Lease', amount: '₹45,000', method: 'NEFT', status: 'Paid' },
    { id: '2', date: '05 May 2026', vendor: 'Digital Flex Printers', type: 'Production', amount: '₹22,000', method: 'Bank Transfer', status: 'Paid' },
    { id: '3', date: '01 May 2026', vendor: 'North India Hoardings', type: 'Site Lease', amount: '₹12,000', method: 'Bank Transfer', status: 'Processing' },
  ]);

  const currentData = activeTab === 'collections' ? collections : payouts;

  const handleSavePayment = () => {
    toast.success(`${activeTab === 'collections' ? 'Collection' : 'Payout'} recorded successfully!`);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Payments & Ledger</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Settlement History · Cash Flow tracking</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={currentData} filename={`drishtivision_${activeTab}_ledger`} />
          <button onClick={() => setShowModal(true)} className="btn-primary text-[12px] py-1.5 flex items-center gap-2">
            <Plus size={16} /> Record {activeTab === 'collections' ? 'Collection' : 'Payout'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div className="card border-success/20 bg-success/5">
            <div className="text-[9px] text-success uppercase font-black tracking-widest">Net Collections (MTD)</div>
            <div className="text-xl font-black text-text-primary mt-2">₹5,90,000</div>
         </div>
         <div className="card border-danger/20 bg-danger/5">
            <div className="text-[9px] text-danger uppercase font-black tracking-widest">Total Payouts (MTD)</div>
            <div className="text-xl font-black text-text-primary mt-2">₹79,000</div>
         </div>
         <div className="card border-accent-blue/20 bg-accent-blue/5">
            <div className="text-[9px] text-accent-blue uppercase font-black tracking-widest">Net Cash Flow</div>
            <div className="text-xl font-black text-text-primary mt-2">₹5,11,000</div>
         </div>
      </div>

      <div className="card p-0 overflow-hidden border-border/40 shadow-xl">
         <div className="flex border-b border-border bg-bg-surface-2">
            <button 
              onClick={() => setActiveTab('collections')}
              className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative ${activeTab === 'collections' ? 'text-success bg-success/5' : 'text-text-muted hover:text-text-primary'}`}
            >
              <ArrowUpRight size={14} /> Client Collections
              {activeTab === 'collections' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-success"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('payouts')}
              className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative ${activeTab === 'payouts' ? 'text-danger bg-danger/5' : 'text-text-muted hover:text-text-primary'}`}
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
                 className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-[12px] outline-none focus:border-accent-orange"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-bg-surface-2/30 border-b border-border text-[9px] text-text-muted uppercase font-black tracking-widest">
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">{activeTab === 'collections' ? 'Entity / Reference' : 'Vendor / Service'}</th>
                     <th className="px-6 py-4">Method</th>
                     <th className="px-6 py-4 text-center">Status</th>
                     <th className="px-6 py-4 text-right">Settlement Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {currentData.map((p) => (
                     <tr key={p.id} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{p.date}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded flex items-center justify-center border border-border ${activeTab === 'collections' ? 'text-success' : 'text-danger'}`}>
                                 {activeTab === 'collections' ? <Building size={14} /> : <Truck size={14} />}
                              </div>
                              <div>
                                 <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{(p as any).client || (p as any).vendor}</div>
                                 <div className="text-[10px] text-text-muted font-bold mt-0.5">{(p as any).inv || (p as any).type}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-[11px] font-bold text-text-primary">{(p as any).method}</td>
                        <td className="px-6 py-4 text-center">
                           <span className={`status-tag ${p.status === 'Settled' || p.status === 'Paid' ? 'bg-success' : p.status === 'Pending' ? 'bg-warning' : 'bg-accent-blue'}`}>
                              {p.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className={`text-[14px] font-black ${activeTab === 'collections' ? 'text-text-primary' : 'text-danger'}`}>{p.amount}</div>
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
              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">
                          {activeTab === 'collections' ? 'Client Name' : 'Vendor Name'}
                       </label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-[13px] outline-none font-bold" placeholder={activeTab === 'collections' ? 'e.g. Reliance Retail' : 'e.g. Haryana Media'} />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Reference (Invoice/PO)</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none font-mono" placeholder="INV-0000" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Date of Settlement</label>
                       <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                          <input type="date" className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-4 py-3 text-[12px] outline-none" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Payment Method</label>
                       <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none appearance-none font-bold">
                          <option>Bank Transfer / NEFT</option><option>UPI / QR Scan</option><option>Cheque / Draft</option><option>Cash Ledger</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Settlement Amount (₹)</label>
                       <input type="number" className={`w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-black outline-none ${activeTab === 'collections' ? 'text-success' : 'text-danger'}`} placeholder="0.00" />
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2">
                 <button onClick={() => setShowModal(false)} className="btn-outline px-8 py-2.5 text-[12px]">Discard</button>
                 <button onClick={handleSavePayment} className={`px-10 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest text-white shadow-xl transition-all ${activeTab === 'collections' ? 'bg-success shadow-success/20' : 'bg-danger shadow-danger/20'}`}>
                    Confirm Settlement
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
