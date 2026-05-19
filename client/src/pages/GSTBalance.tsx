import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowUpRight, ArrowDownRight, 
  Search, Filter, CheckCircle2, Download,
  IndianRupee, Building, Truck, FileText,
  Calculator, Receipt
} from 'lucide-react';
import ExportButton from '../components/ui/ExportButton';

const GSTBalance: React.FC = () => {
  const [period, setPeriod] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');

  const gstDataByQuarter: any = {
    Q1: {
      output: [],
      input: [],
      totals: { collected: 0, paid: 0, net: 0 }
    },
    Q2: { output: [], input: [], totals: { collected: 0, paid: 0, net: 0 } },
    Q3: { output: [], input: [], totals: { collected: 0, paid: 0, net: 0 } },
    Q4: { output: [], input: [], totals: { collected: 0, paid: 0, net: 0 } }
  };

  const currentQuarter = gstDataByQuarter[period];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">GST Balance Sheet</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Fiscal Compliance · Input Tax Credit Ledger</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={[...currentQuarter.output, ...currentQuarter.input]} filename={`drishtivision_gst_ledger_${period}`} />
          <div className="flex bg-bg-surface p-1 rounded-xl border border-border shadow-lg">
            {['Q1', 'Q2', 'Q3', 'Q4'].map((q: any) => (
              <button
                key={q}
                onClick={() => setPeriod(q)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${period === q ? 'bg-accent-orange text-white shadow-md' : 'text-text-muted hover:text-text-primary'}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Output GST ({period})</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{currentQuarter.totals.collected.toLocaleString()}</div>
            <p className="text-[9px] text-success font-bold mt-2 uppercase tracking-tighter">Tax from Sales</p>
         </div>
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Available ITC</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{currentQuarter.totals.paid.toLocaleString()}</div>
            <p className="text-[9px] text-accent-blue font-bold mt-2 uppercase tracking-tighter">Tax on Purchases</p>
         </div>
         <div className="card bg-accent-orange border-accent-orange shadow-lg shadow-accent-orange/20">
            <div className="text-[9px] text-white/80 uppercase font-black tracking-widest">Net Payable</div>
            <div className="text-xl font-black text-white mt-2">₹{currentQuarter.totals.net.toLocaleString()}</div>
            <p className="text-[9px] text-white/60 mt-2 font-bold italic uppercase tracking-tighter">Final Liability</p>
         </div>
         <div className="card border-border/40 bg-bg-surface-2/50">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Filing Readiness</div>
            <div className="text-xl font-black text-warning mt-2">Verified</div>
            <p className="text-[9px] text-text-muted font-bold mt-2 uppercase tracking-tighter">Audit Ready</p>
         </div>
      </div>

      <div className="space-y-6 text-[13px]">
         {/* Output GST Table */}
         <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
            <div className="p-4 border-b border-border bg-bg-surface-2 flex items-center gap-2">
               <ArrowUpRight size={16} className="text-success" />
               <h3 className="text-[11px] font-black text-text-primary uppercase tracking-widest">Output Tax Ledger (Sales)</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-bg-surface-2/30 border-b border-border text-[9px] text-text-muted uppercase font-black">
                        <th className="px-6 py-3">Client Identification</th>
                        <th className="px-6 py-3 text-right">Taxable Val</th>
                        <th className="px-6 py-3 text-right">CGST (9%)</th>
                        <th className="px-6 py-3 text-right">SGST (9%)</th>
                        <th className="px-6 py-3 text-right">IGST (18%)</th>
                        <th className="px-6 py-3 text-right">Gross Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {currentQuarter.output.length === 0 ? (
                        <tr><td colSpan={6} className="p-12 text-center text-text-muted italic">No sales recorded for this quarter.</td></tr>
                     ) : currentQuarter.output.map((row: any) => (
                        <tr key={row.id} className="hover:bg-bg-surface-2 transition-colors">
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-bold text-text-primary">{row.entity}</div>
                              <div className="text-[10px] text-text-muted font-mono mt-0.5 tracking-tighter">{row.gstin}</div>
                           </td>
                           <td className="px-6 py-4 text-right font-medium text-text-muted">₹{row.taxable.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-black text-text-primary">₹{row.cgst.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-black text-text-primary">₹{row.sgst.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-black text-text-muted">₹{row.igst.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-black text-accent-blue font-mono">₹{row.total.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Input Tax Credit Table */}
         <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
            <div className="p-4 border-b border-border bg-bg-surface-2 flex items-center gap-2">
               <ArrowDownRight size={16} className="text-accent-blue" />
               <h3 className="text-[11px] font-black text-text-primary uppercase tracking-widest">Input Credit Ledger (Procurement)</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-bg-surface-2/30 border-b border-border text-[9px] text-text-muted uppercase font-black">
                        <th className="px-6 py-3">Vendor Identification</th>
                        <th className="px-6 py-3 text-right">Procurement Val</th>
                        <th className="px-6 py-3 text-right">CGST (9%)</th>
                        <th className="px-6 py-3 text-right">SGST (9%)</th>
                        <th className="px-6 py-3 text-right">IGST (18%)</th>
                        <th className="px-6 py-3 text-right">Total Payout</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {currentQuarter.input.length === 0 ? (
                        <tr><td colSpan={6} className="p-12 text-center text-text-muted italic">No procurement recorded for this quarter.</td></tr>
                     ) : currentQuarter.input.map((row: any) => (
                        <tr key={row.id} className="hover:bg-bg-surface-2 transition-colors">
                           <td className="px-6 py-4">
                              <div className="text-[13px] font-bold text-text-primary">{row.entity}</div>
                              <div className="text-[10px] text-text-muted font-mono mt-0.5 tracking-tighter">{row.gstin}</div>
                           </td>
                           <td className="px-6 py-4 text-right font-medium text-text-muted">₹{row.taxable.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-black text-text-primary">₹{row.cgst.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-black text-text-primary">₹{row.sgst.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-black text-text-muted">₹{row.igst.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-black text-purple-400 font-mono">₹{row.total.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GSTBalance;
