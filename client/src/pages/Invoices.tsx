import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Plus, Filter, 
  ArrowRight, Download, Eye, ExternalLink,
  ChevronRight, Calendar, Building, DollarSign, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { format } from 'date-fns';

const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/invoices/${id}/status`, { status: newStatus.toUpperCase() });
      toast.success(`Invoice status updated to ${newStatus}`);
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBg = (status: string) => {
    const bgMap: any = { 
      'PAID': 'bg-success', 
      'PENDING': 'bg-warning', 
      'OVERDUE': 'bg-danger',
      'DRAFT': 'bg-text-muted',
      'CANCELLED': 'bg-bg-surface-2 text-text-muted border border-border'
    };
    return bgMap[status?.toUpperCase()] || 'bg-text-muted';
  };

  const filteredInvoices = invoices.filter(inv => 
    (inv.invoiceNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (inv.client?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const mtdBilled = invoices.filter(i => i.status !== 'CANCELLED' && i.status !== 'DRAFT').reduce((acc, i) => acc + (i.totalAmount || 0), 0);
  const pendingCollection = invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((acc, i) => acc + (i.totalAmount || 0), 0);
  const gstCollected = invoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + (i.cgstAmount + i.sgstAmount + i.igstAmount || 0), 0);
  const settlementRate = mtdBilled > 0 ? ((mtdBilled - pendingCollection) / mtdBilled) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Financial Invoicing</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Fiscal Billing · GST Compliance Ledger</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={invoices} filename="drishtivision_invoices" />
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
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Total Billed</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{(mtdBilled / 100000).toFixed(1)}L</div>
         </div>
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Pending Collections</div>
            <div className="text-xl font-black text-warning mt-2">₹{(pendingCollection / 100000).toFixed(1)}L</div>
         </div>
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">GST Collected</div>
            <div className="text-xl font-black text-accent-blue mt-2">₹{(gstCollected / 100000).toFixed(1)}L</div>
         </div>
         <div className="card bg-success/5 border-success/20">
            <div className="text-[9px] text-success uppercase font-black tracking-widest">Settlement Rate</div>
            <div className="text-xl font-black text-text-primary mt-2">{settlementRate.toFixed(1)}%</div>
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
               {isLoading ? (
                 <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-accent-orange" /></td></tr>
               ) : filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                     <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{inv.invoiceNumber}</div>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted mt-1 uppercase font-black tracking-tighter">
                           <Calendar size={12} className="text-accent-blue" /> {inv.invoiceDate ? format(new Date(inv.invoiceDate), 'dd MMM yyyy') : 'N/A'}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-[12px] font-bold text-text-primary">{inv.client?.name || 'N/A'}</div>
                        <div className="text-[10px] text-text-muted mt-0.5 font-medium uppercase tracking-widest">{inv.campaign?.campaignName || 'General Billing'}</div>
                     </td>
                      <td className="px-6 py-4 text-center">
                         <div className="inline-block" onClick={(e) => e.stopPropagation()}>
                            <select 
                              value={inv.status?.toUpperCase()} 
                              onChange={(e) => updateStatus(inv.id, e.target.value)}
                              className={`appearance-none text-center text-[9px] font-black uppercase px-2.5 !h-[18px] min-h-[18px] leading-[18px] !py-0 rounded-full text-white cursor-pointer outline-none border border-transparent focus:border-border transition-all ${getStatusBg(inv.status)}`}
                            >
                               {['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].map(s => (
                                  <option key={s} value={s} className="bg-bg-surface text-text-primary uppercase font-bold text-[10px]">{s}</option>
                               ))}
                            </select>
                         </div>
                      </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                           <div className="text-[14px] font-black text-text-primary">₹{(inv.totalAmount || 0).toLocaleString()}</div>
                           <button onClick={(e) => { e.stopPropagation(); navigate(`/invoices/${inv.id}`); }} className="p-2 text-text-muted hover:text-accent-orange border border-transparent hover:border-border rounded-lg transition-all">
                              <Eye size={16} />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
               {!isLoading && filteredInvoices.length === 0 && (
                 <tr><td colSpan={4} className="py-20 text-center text-text-muted text-[12px] italic">No invoices found</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default Invoices;
