import React, { useState } from 'react';
import { 
  Plus, Search, IndianRupee, Calendar, 
  Tag, Download, Trash2, Filter,
  ArrowUpRight, ArrowDownRight, Briefcase,
  CheckCircle2, Clock, AlertCircle, X,
  ChevronDown
} from 'lucide-react';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const ExpenseTracker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [expenses, setExpenses] = useState([
    { id: '1', date: '2026-05-10', category: 'Printing', description: 'Flex printing for Reliance campaign', amount: '₹45,000', vendor: 'Digital Flex Printers', status: 'Paid', bg: 'bg-success' },
    { id: '2', date: '2026-05-08', category: 'Lease', description: 'Monthly rent for Ambala site', amount: '₹22,000', vendor: 'Haryana Outdoor Media', status: 'Pending', bg: 'bg-warning' },
    { id: '3', date: '2026-05-05', category: 'Salaries', description: 'May staff salaries', amount: '₹1,20,000', vendor: 'Internal', status: 'Paid', bg: 'bg-success' },
  ]);

  const toggleStatus = (id: string) => {
    setExpenses(expenses.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'Paid' ? 'Pending' : 'Paid';
        const nextBg = nextStatus === 'Paid' ? 'bg-success' : 'bg-warning';
        return { ...e, status: nextStatus, bg: nextBg };
      }
      return e;
    }));
    toast.success('Expense status updated locally.');
  };

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Expense Ledger</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Fiscal Outgoings · Operational Costs</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredExpenses} filename="drishtivision_expenses" />
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Plus size={16} /> Log Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div className="card bg-danger/5 border-danger/10">
            <div className="text-[9px] text-danger uppercase font-black tracking-widest">Total Monthly Outflow</div>
            <div className="text-xl font-black text-text-primary mt-2">₹1,87,000</div>
         </div>
         <div className="card bg-accent-blue/5 border-accent-blue/10">
            <div className="text-[9px] text-accent-blue uppercase font-black tracking-widest">Pending Payouts</div>
            <div className="text-xl font-black text-text-primary mt-2">₹22,000</div>
         </div>
         <div className="card bg-success/5 border-success/10">
            <div className="text-[9px] text-success uppercase font-black tracking-widest">Verified GST Input</div>
            <div className="text-xl font-black text-text-primary mt-2">₹33,660</div>
         </div>
      </div>

      <div className="card">
        <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
           <input 
             type="text" 
             placeholder="Search by vendor, category or description..." 
             className="w-full bg-bg-surface-2 border border-border rounded-lg pl-9 pr-3 py-2 text-[12px] focus:outline-none focus:border-accent-orange transition-colors"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-bg-surface-2 border-b border-border text-[10px] text-text-muted uppercase font-black tracking-widest">
                  <th className="px-6 py-4">Date / Category</th>
                  <th className="px-6 py-4">Description / Vendor</th>
                  <th className="px-6 py-4 text-center">Settlement Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-bg-surface-2 transition-colors group">
                     <td className="px-6 py-4">
                        <div className="text-[12px] font-bold text-text-primary">{exp.date}</div>
                        <div className="text-[9px] text-text-muted font-black uppercase tracking-tighter mt-1">{exp.category}</div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-[12px] font-medium text-text-primary">{exp.description}</div>
                        <div className="text-[10px] text-accent-blue font-bold mt-0.5 uppercase flex items-center gap-1"><Briefcase size={10} /> {exp.vendor}</div>
                     </td>
                     <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleStatus(exp.id)}
                          className={`status-tag ${exp.bg} cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5 mx-auto`}
                        >
                           {exp.status === 'Paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                           {exp.status}
                           <ChevronDown size={10} />
                        </button>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="text-[14px] font-black text-danger">{exp.amount}</div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface-2">
                 <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary uppercase tracking-tighter"><Plus size={18} className="text-accent-orange" /> Record New Outgoing</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-surface-2 rounded-lg transition-colors"><X size={18} /></button>
              </div>
              <div className="p-8 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-text-muted uppercase">Amount (₹)</label><input type="number" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[14px] font-black text-danger outline-none" placeholder="0.00" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-text-muted uppercase">Date</label><input type="date" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none" /></div>
                    <div className="col-span-2 space-y-1.5"><label className="text-[10px] font-black text-text-muted uppercase">Description</label><input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none" placeholder="Purpose of expense" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-text-muted uppercase">Category</label><select className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none"><option>Printing</option><option>Lease</option><option>Salaries</option><option>Admin</option></select></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-text-muted uppercase">Vendor / Payee</label><select className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none"><option>Haryana Outdoor Media</option><option>Digital Flex Printers</option><option>Internal</option></select></div>
                 </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2 rounded-b-2xl">
                 <button onClick={() => setShowAddModal(false)} className="btn-outline px-8 py-2.5 text-[12px]">Cancel</button>
                 <button onClick={() => { toast.success('Expense recorded and logged to P&L!'); setShowAddModal(false); }} className="btn-primary px-10 py-2.5 text-[12px]">Confirm Log</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
