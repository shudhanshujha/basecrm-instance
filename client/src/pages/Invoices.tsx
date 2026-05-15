import React, { useState } from 'react';
import { 
  FileText, Search, Plus, Filter, 
  ArrowRight, Download, Eye, ExternalLink,
  ChevronRight, Calendar, Building, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const invoices = [
    { id: '1', number: 'DV-2026-0041', client: 'Reliance Retail Ltd', campaign: 'Haryana Roads Q2', date: '10 May 2026', amount: '₹3,20,400', status: 'Paid', bg: 'bg-success' },
    { id: '2', number: 'DV-2026-0039', client: 'Axis Bank Ltd', campaign: 'ATM Network May', date: '08 May 2026', amount: '₹1,80,000', status: 'Pending', bg: 'bg-warning' },
    { id: '3', number: 'DV-2026-0037', client: 'Havells India', campaign: 'Summer Push', date: '05 May 2026', amount: '₹90,000', status: 'Overdue', bg: 'bg-danger' },
    { id: '4', number: 'DV-2026-0035', client: 'LG Electronics', campaign: 'Q1 Branding', date: '28 Apr 2026', amount: '₹12,40,000', status: 'Paid', bg: 'bg-success' },
  ];

  const filteredInvoices = invoices.filter(inv => 
    inv.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Financial Invoicing</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Fiscal Billing · GST Compliance Ledger</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredInvoices} filename="drishtivision_invoices" />
          <button 
            onClick={() => navigate('/invoices/new')} 
            className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30"
          >
            <Plus size={16} /> Generate Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Total Billed (MTD)</div>
            <div className="text-xl font-black text-text-primary mt-2">₹18.4L</div>
         </div>
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Pending Collections</div>
            <div className="text-xl font-black text-warning mt-2">₹6.2L</div>
         </div>
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">GST Collected</div>
            <div className="text-xl font-black text-accent-blue mt-2">₹3.3L</div>
         </div>
         <div className="card bg-success/5 border-success/20">
            <div className="text-[9px] text-success uppercase font-black tracking-widest">Settlement Rate</div>
            <div className="text-xl font-black text-text-primary mt-2">94.2%</div>
         </div>
      </div>

      <div className="card">
        <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
           <input 
             type="text" 
             placeholder="Search by invoice number or client..." 
             className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[12px] focus:outline-none focus:border-accent-orange transition-colors"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-bg-surface-2 border-b border-border text-[10px] text-text-muted uppercase font-black tracking-widest">
                  <th className="px-6 py-4">Invoice Details</th>
                  <th className="px-6 py-4">Campaign Partner</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                     <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{inv.number}</div>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted mt-1 uppercase font-black tracking-tighter">
                           <Calendar size={12} className="text-accent-blue" /> {inv.date}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-[12px] font-bold text-text-primary">{inv.client}</div>
                        <div className="text-[10px] text-text-muted mt-0.5 font-medium uppercase tracking-widest">{inv.campaign}</div>
                     </td>
                     <td className="px-6 py-4 text-center">
                        <span className={`status-tag ${inv.bg}`}>{inv.status}</span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                           <div className="text-[14px] font-black text-text-primary">{inv.amount}</div>
                           <button onClick={(e) => { e.stopPropagation(); navigate('/invoices/new'); }} className="p-2 text-text-muted hover:text-accent-orange border border-transparent hover:border-border rounded-lg transition-all">
                              <Eye size={16} />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default Invoices;
