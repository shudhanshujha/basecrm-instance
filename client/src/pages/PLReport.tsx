import React, { useState, useEffect } from 'react';
import { 
  Download, FileSpreadsheet, Printer, 
  ShieldCheck, ArrowUpRight, TrendingUp,
  FileText, Loader2
} from 'lucide-react';
import ExportButton from '../components/ui/ExportButton';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const PLReport: React.FC = () => {
  const [period, setPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchPLData();
  }, []);

  const fetchPLData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics');
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load financial records');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-accent-orange" /></div>;

  const pl = data?.plReport || { income: {}, expenses: {} };
  const gst = data?.gstReport || { collected: {}, paid: {} };

  return (
    <div className="space-y-6 print:p-0 print:space-y-4">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Financial P&L Intelligence</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Fiscal Tracking · Consolidated OOH</p>
        </div>
        <div className="flex gap-2">
          <ExportButton 
            data={[
              { Category: 'Hoarding / Billboard Revenue', Type: 'Income', Amount: pl.income.hoarding || 0 },
              { Category: 'Site Lease Costs (Vendors)', Type: 'Expense', Amount: pl.expenses.lease || 0 },
              { Category: 'Mounting & Labour Costs', Type: 'Expense', Amount: pl.expenses.mounting || 0 },
              { Category: 'Operating Expenses', Type: 'Expense', Amount: pl.expenses.operating || 0 },
              { Category: 'Net Profit', Type: 'Final', Amount: (pl.income.total - pl.expenses.total) || 0 }
            ]} 
            filename={`drishtivision_pl_detailed`} 
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card flex flex-col justify-center border-border/40 min-h-[100px]">
           <div className="text-[10px] text-text-muted uppercase tracking-widest font-black">Gross Income</div>
           <div className="text-xl font-black text-text-primary mt-2">₹{pl.income.total?.toLocaleString() || 0}</div>
        </div>
        <div className="card flex flex-col justify-center border-border/40 text-white min-h-[100px]">
           <div className="text-[10px] text-text-muted uppercase tracking-widest font-black">Total Operating Costs</div>
           <div className="text-xl font-black text-white mt-2">₹{pl.expenses.total?.toLocaleString() || 0}</div>
        </div>
        <div className="card flex flex-col justify-center border-border/40 min-h-[100px]">
           <div className="text-[10px] text-text-muted uppercase tracking-widest font-black">GST Output Liability</div>
           <div className="text-xl font-black text-warning mt-2">₹{(gst.collected.cgst + gst.collected.sgst + gst.collected.igst)?.toLocaleString() || 0}</div>
        </div>
        <div className="card bg-success border-success shadow-lg shadow-success/10 flex flex-col justify-center min-h-[100px]">
           <div className="text-[10px] text-white/70 uppercase tracking-widest font-black">Net Profit (Before Tax)</div>
           <div className="text-2xl font-black text-white mt-2">₹{(pl.income.total - pl.expenses.total)?.toLocaleString() || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 card border-border/40">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Detailed Operating Statement</h3>
              <button onClick={handlePrint} className="p-2 bg-bg-surface-2 border border-border rounded-lg text-text-muted hover:text-accent-orange transition-colors print:hidden">
                <Printer size={16} />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center py-2.5 border-b border-border text-[12px]">
                <span className="text-text-muted font-bold">Hoarding / Billboard Revenue</span>
                <span className="font-black text-success">₹{pl.income.hoarding?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-3 text-[11px] font-black uppercase tracking-widest text-text-primary bg-bg-surface-2 px-3 rounded-lg mt-2">
                <span>Gross Revenue</span>
                <span className="underline decoration-double decoration-accent-orange">₹{pl.income.total?.toLocaleString() || 0}</span>
              </div>
              
              <div className="h-6"></div>

              <div className="flex justify-between items-center py-2 border-b border-border text-[12px]">
                <span className="text-text-muted font-bold">Site Lease Costs (Vendors)</span>
                <span className="font-bold text-danger">- ₹{pl.expenses.lease?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border text-[12px]">
                <span className="text-text-muted font-bold">Mounting & Labour Costs</span>
                <span className="font-bold text-danger">- ₹{pl.expenses.mounting?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border text-[12px]">
                <span className="text-text-muted font-bold">Operating Expenses (Admin/Salaries)</span>
                <span className="font-bold text-danger">- ₹{pl.expenses.operating?.toLocaleString() || 0}</span>
              </div>

              <div className="h-6"></div>

              <div className="flex justify-between items-center p-4 bg-bg-surface-2 rounded-xl border border-border">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-primary uppercase font-black tracking-widest">Net Operating Profit</span>
                  <span className="text-xs text-white mt-1 italic opacity-70">Before GST provisions</span>
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">₹{(pl.income.total - pl.expenses.total)?.toLocaleString() || 0}</span>
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card border-border/40">
               <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="text-accent-blue" size={18} />
                  <h3 className="text-[13px] font-bold text-text-primary uppercase">GST Net Blanket</h3>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-border pb-3">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted font-bold uppercase">CGST (9%)</span>
                        <span className="text-[12px] font-medium text-text-primary mt-1">Output Collected</span>
                     </div>
                     <span className="text-[13px] font-black text-warning">₹{gst.collected.cgst?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border pb-3">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted font-bold uppercase">SGST (9%)</span>
                        <span className="text-[12px] font-medium text-text-primary mt-1">Output Collected</span>
                     </div>
                     <span className="text-[13px] font-black text-warning">₹{gst.collected.sgst?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border pb-3">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted font-bold uppercase">IGST (18%)</span>
                        <span className="text-[12px] font-medium text-text-primary mt-1">Inter-state Sales</span>
                     </div>
                     <span className="text-[13px] font-black text-warning">₹{gst.collected.igst?.toLocaleString() || 0}</span>
                  </div>
                  
                  <div className="p-3 bg-bg-surface-2 rounded-lg mt-4">
                     <div className="flex justify-between text-[11px] font-black text-text-primary uppercase tracking-tighter">
                        <span>Total Net Liability</span>
                        <span>₹{(gst.collected.cgst + gst.collected.sgst + gst.collected.igst)?.toLocaleString() || 0}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="card bg-accent-blue text-white shadow-xl shadow-accent-blue/20">
               <div className="text-[10px] text-white/80 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                 <TrendingUp size={14} /> Final Bottom Line
               </div>
               <div className="text-3xl font-black text-white tracking-tighter">₹{(pl.income.total - pl.expenses.total)?.toLocaleString() || 0}</div>
               <p className="text-[10px] text-white/70 mt-3 italic font-medium leading-tight">Consolidated Fiscal Performance</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PLReport;
