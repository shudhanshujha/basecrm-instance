import React, { useState } from 'react';
import { 
  Download, FileSpreadsheet, Printer, 
  ShieldCheck, ArrowUpRight, TrendingUp,
  FileText
} from 'lucide-react';
import ExportButton from '../components/ui/ExportButton';

const PLReport: React.FC = () => {
  const [period, setPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');

  const handlePrint = () => {
    window.print();
  };

  const data = {
    Monthly: { income: '₹20.5L', profit: '₹9.3L', costs: '₹7.9L', gst: '₹3.3L' },
    Quarterly: { income: '₹68.2L', profit: '₹31.4L', costs: '₹24.8L', gst: '₹11.2L' },
    Yearly: { income: '₹2.4Cr', profit: '₹1.1Cr', costs: '₹84L', gst: '₹38L' },
  };

  const current = data[period];

  return (
    <div className="space-y-6 print:p-0 print:space-y-4">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Financial P&L Intelligence</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Fiscal Tracking · Consolidated OOH</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={[current]} filename={`drishtivision_pl_${period.toLowerCase()}`} />
          <div className="flex bg-bg-surface p-1 rounded-lg border border-border">
            {['Monthly', 'Quarterly', 'Yearly'].map((r: any) => (
              <button
                key={r}
                onClick={() => setPeriod(r)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                  period === r 
                    ? 'bg-accent-orange text-white shadow-lg shadow-accent-orange/20' 
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card flex flex-col justify-center border-border/40 min-h-[100px]">
           <div className="text-[9px] text-text-muted uppercase tracking-widest font-black">Gross Income ({period})</div>
           <div className="text-xl font-black text-text-primary mt-2">{current.income}</div>
        </div>
        <div className="card flex flex-col justify-center border-border/40 text-white min-h-[100px]">
           <div className="text-[9px] text-text-muted uppercase tracking-widest font-black">Direct Costs</div>
           <div className="text-xl font-black text-white mt-2">{current.costs}</div>
        </div>
        <div className="card flex flex-col justify-center border-border/40 min-h-[100px]">
           <div className="text-[9px] text-text-muted uppercase tracking-widest font-black">GST Liability</div>
           <div className="text-xl font-black text-warning mt-2">{current.gst}</div>
        </div>
        <div className="card bg-success border-success shadow-lg shadow-success/10 flex flex-col justify-center min-h-[100px]">
           <div className="text-[9px] text-white/70 uppercase tracking-widest font-black">Net Profit</div>
           <div className="text-2xl font-black text-white mt-2">{current.profit}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 card border-border/40">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Detailed Operating Statement · {period}</h3>
              <button onClick={handlePrint} className="p-2 bg-bg-surface-2 border border-border rounded-lg text-text-muted hover:text-accent-orange transition-colors print:hidden">
                <Printer size={16} />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center py-2.5 border-b border-border text-[12px]">
                <span className="text-text-muted">Hoarding / Billboard Revenue</span>
                <span className="font-bold text-success">₹18,40,000</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-border text-[12px]">
                <span className="text-text-muted">Printing & Production Charges</span>
                <span className="font-bold text-success">₹2,10,000</span>
              </div>
              <div className="flex justify-between items-center py-3 text-[11px] font-black uppercase tracking-widest text-text-primary bg-bg-surface-2 px-3 rounded-lg mt-2">
                <span>Gross Revenue</span>
                <span className="underline decoration-double decoration-accent-orange">₹20,50,000</span>
              </div>
              
              <div className="h-6"></div>

              <div className="flex justify-between items-center py-2 border-b border-border text-[12px]">
                <span className="text-text-muted">Site Lease Costs (Vendors)</span>
                <span className="font-bold text-danger">- ₹4,80,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border text-[12px]">
                <span className="text-text-muted">Mounting & Labour Costs</span>
                <span className="font-bold text-danger">- ₹1,20,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border text-[12px]">
                <span className="text-text-muted">Operating Expenses (Admin/Salaries)</span>
                <span className="font-bold text-danger">- ₹1,90,000</span>
              </div>

              <div className="h-6"></div>

              <div className="flex justify-between items-center p-4 bg-bg-surface-2 rounded-xl border border-border">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-primary uppercase font-black tracking-widest">Net Operating Profit</span>
                  <span className="text-xs text-white mt-1 italic opacity-70">Before GST provisions</span>
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">₹12,60,000</span>
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card border-border/40">
               <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="text-accent-blue" size={18} />
                  <h3 className="text-[13px] font-bold text-text-primary">GST Net Blanket</h3>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-border pb-3">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted font-bold uppercase">CGST (9%)</span>
                        <span className="text-[12px] font-medium text-text-primary mt-1">Output Collected</span>
                     </div>
                     <span className="text-[13px] font-black text-warning">₹1,65,600</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border pb-3">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted font-bold uppercase">SGST (9%)</span>
                        <span className="text-[12px] font-medium text-text-primary mt-1">Output Collected</span>
                     </div>
                     <span className="text-[13px] font-black text-warning">₹1,65,600</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border pb-3">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted font-bold uppercase">IGST (18%)</span>
                        <span className="text-[12px] font-medium text-text-primary mt-1">Inter-state Sales</span>
                     </div>
                     <span className="text-[13px] font-black text-text-muted italic">₹0.00</span>
                  </div>
                  
                  <div className="p-3 bg-bg-surface-2 rounded-lg mt-4">
                     <div className="flex justify-between text-[11px] font-black text-text-primary uppercase tracking-tighter">
                        <span>Total Net Liability</span>
                        <span>₹3,31,200</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="card bg-accent-blue text-white shadow-xl shadow-accent-blue/20">
               <div className="text-[10px] text-white/80 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                 <TrendingUp size={14} /> Final Bottom Line
               </div>
               <div className="text-3xl font-black text-white tracking-tighter">{current.profit}</div>
               <p className="text-[10px] text-white/70 mt-3 italic font-medium leading-tight">After 18% GST Provision & Costs</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PLReport;
