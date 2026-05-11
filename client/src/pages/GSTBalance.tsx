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

  const gstData = {
    output: [
      { id: '1', date: '10 May', entity: 'Reliance Retail', gstin: '06AAACR5055K1ZZ', taxable: 280000, cgst: 25200, sgst: 25200, igst: 0, total: 330400 },
      { id: '2', date: '08 May', entity: 'Axis Bank Ltd', gstin: '06AAACC2415M1ZF', taxable: 180000, cgst: 16200, sgst: 16200, igst: 0, total: 212400 },
    ],
    input: [
      { id: '1', date: '09 May', entity: 'Haryana Media', gstin: '06BBBCR1234K1Z1', taxable: 45000, cgst: 4050, sgst: 4050, igst: 0, total: 53100 },
      { id: '2', date: '05 May', entity: 'Digital Printers', gstin: '07CCCHR5678D1Z2', taxable: 22000, cgst: 1980, sgst: 1980, igst: 0, total: 25960 },
    ]
  };

  const totals = {
    collected: 82800, // Sum of CGST+SGST output
    paid: 12060,     // Sum of CGST+SGST input
    net: 70740       // Collected - Paid
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">GST Balance Sheet</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Tax Ledger · Input Tax Credit (ITC) tracking</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={[...gstData.output, ...gstData.input]} filename={`drishtivision_gst_ledger_${period}`} />
          <div className="flex bg-bg-surface p-1 rounded-lg border border-border">
            {['Q1', 'Q2', 'Q3', 'Q4'].map((q: any) => (
              <button
                key={q}
                onClick={() => setPeriod(q)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${period === q ? 'bg-accent-orange text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Total Output GST</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{totals.collected.toLocaleString()}</div>
            <p className="text-[9px] text-success font-bold mt-2">Collected from Clients</p>
         </div>
         <div className="card border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Available ITC</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{totals.paid.toLocaleString()}</div>
            <p className="text-[9px] text-accent-blue font-bold mt-2">Paid to Vendors</p>
         </div>
         <div className="card bg-accent-orange border-accent-orange shadow-lg shadow-accent-orange/20">
            <div className="text-[9px] text-white/80 uppercase font-black tracking-widest">Net Tax Payable</div>
            <div className="text-xl font-black text-white mt-2">₹{totals.net.toLocaleString()}</div>
            <p className="text-[9px] text-white/60 mt-2 font-bold italic">Cash Ledger Requirement</p>
         </div>
         <div className="card border-border/40 bg-bg-surface-2/50">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Filing Status</div>
            <div className="text-xl font-black text-warning mt-2">Ready</div>
            <p className="text-[9px] text-text-muted font-bold mt-2">GSTR-1 & GSTR-3B</p>
         </div>
      </div>

      <div className="space-y-6">
         {/* Output GST Table */}
         <div className="card p-0 overflow-hidden border-border/50">
            <div className="p-4 border-b border-border bg-bg-surface-2 flex items-center gap-2">
               <ArrowUpRight size={16} className="text-success" />
               <h3 className="text-[11px] font-black text-text-primary uppercase tracking-widest">Output GST Ledger (Sales)</h3>
            </div>
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-bg-surface-2/30 border-b border-border text-[9px] text-text-muted uppercase font-black">
                     <th className="px-6 py-3">Client / GSTIN</th>
                     <th className="px-6 py-3 text-right">Taxable Val</th>
                     <th className="px-6 py-3 text-right">CGST (9%)</th>
                     <th className="px-6 py-3 text-right">SGST (9%)</th>
                     <th className="px-6 py-3 text-right">IGST (18%)</th>
                     <th className="px-6 py-3 text-right">Total Invoice</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {gstData.output.map(row => (
                     <tr key={row.id} className="hover:bg-bg-surface-2 transition-colors">
                        <td className="px-6 py-4">
                           <div className="text-[12px] font-bold text-text-primary">{row.entity}</div>
                           <div className="text-[9px] text-text-muted font-mono mt-0.5">{row.gstin}</div>
                        </td>
                        <td className="px-6 py-4 text-right text-[11px] font-medium text-text-muted">₹{row.taxable.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-[11px] font-black text-text-primary">₹{row.cgst.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-[11px] font-black text-text-primary">₹{row.sgst.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-[11px] font-black text-text-muted">₹{row.igst.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-[12px] font-black text-accent-blue">₹{row.total.toLocaleString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Input Tax Credit Table */}
         <div className="card p-0 overflow-hidden border-border/50">
            <div className="p-4 border-b border-border bg-bg-surface-2 flex items-center gap-2">
               <ArrowDownRight size={16} className="text-accent-blue" />
               <h3 className="text-[11px] font-black text-text-primary uppercase tracking-widest">Input Tax Credit Ledger (Procurement)</h3>
            </div>
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-bg-surface-2/30 border-b border-border text-[9px] text-text-muted uppercase font-black">
                     <th className="px-6 py-3">Vendor / GSTIN</th>
                     <th className="px-6 py-3 text-right">Purchase Val</th>
                     <th className="px-6 py-3 text-right">CGST (9%)</th>
                     <th className="px-6 py-3 text-right">SGST (9%)</th>
                     <th className="px-6 py-3 text-right">IGST (18%)</th>
                     <th className="px-6 py-3 text-right">Total Paid</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {gstData.input.map(row => (
                     <tr key={row.id} className="hover:bg-bg-surface-2 transition-colors">
                        <td className="px-6 py-4">
                           <div className="text-[12px] font-bold text-text-primary">{row.entity}</div>
                           <div className="text-[9px] text-text-muted font-mono mt-0.5">{row.gstin}</div>
                        </td>
                        <td className="px-6 py-4 text-right text-[11px] font-medium text-text-muted">₹{row.taxable.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-[11px] font-black text-text-primary">₹{row.cgst.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-[11px] font-black text-text-primary">₹{row.sgst.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-[11px] font-black text-text-muted">₹{row.igst.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-[12px] font-black text-purple-400">₹{row.total.toLocaleString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default GSTBalance;
