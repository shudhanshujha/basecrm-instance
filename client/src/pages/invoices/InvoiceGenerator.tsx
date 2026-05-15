import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Printer, Download, Plus, Trash2, 
  ChevronDown, Building, User, FileText, IndianRupee,
  ShieldCheck, MapPin, Phone, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- MOCK CRM DATA ---
const CRM_MOCK = {
  seller: {
    name: "DRISHTI VISION SOLUTION",
    address: "2/182, Arya Nagar, Sonepat, 131001, Haryana",
    phone: ["7015177522", "8307096269"],
    email: "drishtivisionad@gmail.com",
    gstin: "06AONPP6480J1ZB",
    msme_reg_no: "UDYAM-HR-18-0006940",
    state: "Haryana",
    state_code: "6",
    bank: {
      name: "Punjab National Bank",
      branch: "Mission Chowk Sonepat",
      account_no: "00561132000617",
      ifsc: "PUNB0005610"
    }
  },
  lastInvoiceNumber: 332,
  clients: [
    {
      id: "c001",
      name: "GPB Trading LLP",
      address: "P P Green City-2, V.P.O Kamaspur, opp. Omaxe City, Sonipat",
      gstin: "06AAUFG6384R1Z8",
      state: "Haryana",
      state_code: "6"
    },
    {
      id: "c002",
      name: "Sample Client Pvt Ltd",
      address: "123, Industrial Area, Phase 2, Chandigarh",
      gstin: "04AABCS1234D1Z5",
      state: "Chandigarh",
      state_code: "4"
    }
  ],
  catalog: [
    { id: "p001", description: "Hoarding Display", sub_description: "Per Month", hsn_code: "9983", default_rate: 12000, cgst_rate: 9, sgst_rate: 9 },
    { id: "p002", description: "LED Billboard Display", sub_description: "Per Month", hsn_code: "9983", default_rate: 18000, cgst_rate: 9, sgst_rate: 9 },
    { id: "p003", description: "Transit Media Ad", sub_description: "Per Campaign", hsn_code: "9983", default_rate: 25000, cgst_rate: 9, sgst_rate: 9 }
  ]
};

// --- UTILS ---
const amountToWords = (num: number) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convert_thousands = (n: number): string => {
    if (n >= 1000) return convert_thousands(Math.floor(n / 1000)) + " Thousand " + convert_thousands(n % 1000);
    if (n >= 100) return ones[Math.floor(n / 100)] + " Hundred " + convert_thousands(n % 100);
    if (n >= 20) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    if (n >= 10) return teens[n - 10];
    return ones[n];
  };

  const convert_indian = (n: number): string => {
    if (n === 0) return "Zero";
    let str = "";
    if (n >= 10000000) {
      str += convert_thousands(Math.floor(n / 10000000)) + " Crore ";
      n %= 10000000;
    }
    if (n >= 100000) {
      str += convert_thousands(Math.floor(n / 100000)) + " Lakh ";
      n %= 100000;
    }
    str += convert_thousands(n);
    return str.trim();
  };

  const whole = Math.floor(num);
  const paise = Math.round((num - whole) * 100);
  let res = convert_indian(whole) + " Rupees";
  if (paise > 0) res += " and " + convert_indian(paise) + " Paise";
  return res + " Only";
};

const InvoiceGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNumber: (CRM_MOCK.lastInvoiceNumber + 1).toString(),
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceType: "Tax Invoice - Intra State",
    reverseCharge: "N",
    transportMode: "",
    vehicleNumber: "",
    dateOfSupply: new Date().toISOString().split('T')[0],
    placeOfSupply: "HARYANA (06)",
    descriptionHeader: "Advertising Hoarding Site Display in Pan India Sites for the period of May 2026",
    seller: { ...CRM_MOCK.seller },
    buyer: {
      name: "",
      address: "",
      gstin: "",
      state: "",
      state_code: ""
    },
    items: [
      { id: Date.now(), description: "", hsn: "", qty: 1, rate: 0, discount: 0, cgstRate: 9, sgstRate: 9, igstRate: 0 }
    ],
    terms: "1. Payment should be made by Cheque/DD/NEFT in favor of DRISHTI VISION SOLUTION.\n2. Interest @18% p.a. will be charged if payment is not made within due date."
  });

  const totals = useMemo(() => {
    const isInterState = formData.invoiceType.includes("Inter State");
    let taxableTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    const itemsWithCalc = formData.items.map(item => {
      const amount = item.qty * item.rate;
      const taxable = amount - item.discount;
      const cgst = isInterState ? 0 : taxable * (item.cgstRate / 100);
      const sgst = isInterState ? 0 : taxable * (item.sgstRate / 100);
      const igst = isInterState ? taxable * (18 / 100) : 0;
      
      taxableTotal += taxable;
      cgstTotal += cgst;
      sgstTotal += sgst;
      igstTotal += igst;

      return { ...item, amount, taxable, cgst, sgst, igst, total: taxable + cgst + sgst + igst };
    });

    return {
      items: itemsWithCalc,
      taxableTotal,
      cgstTotal,
      sgstTotal,
      igstTotal,
      grandTotal: taxableTotal + cgstTotal + sgstTotal + igstTotal
    };
  }, [formData]);

  const handleClientSelect = (clientId: string) => {
    const client = CRM_MOCK.clients.find(c => c.id === clientId);
    if (client) {
      setFormData({
        ...formData,
        buyer: {
          name: client.name,
          address: client.address,
          gstin: client.gstin,
          state: client.state,
          state_code: client.state_code
        }
      });
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = CRM_MOCK.catalog.find(p => p.id === productId);
    if (product) {
      const newItems = [...formData.items];
      newItems[index] = {
        ...newItems[index],
        description: product.description,
        hsn: product.hsn_code,
        rate: product.default_rate,
        cgstRate: product.cgst_rate,
        sgstRate: product.sgst_rate
      };
      setFormData({ ...formData, items: newItems });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: Date.now(), description: "", hsn: "", qty: 1, rate: 0, discount: 0, cgstRate: 9, sgstRate: 9, igstRate: 0 }]
    });
  };

  const removeItem = (id: number) => {
    if (formData.items.length === 1) return;
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden print:bg-white">
      {/* Top Header */}
      <div className="h-14 bg-bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/invoices')} className="p-2 hover:bg-bg-surface-2 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-black uppercase tracking-widest text-text-primary">Invoice Intelligence Generator</h1>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-accent-orange text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-accent-orange/20"
        >
          <Printer size={16} /> Generate & Print PDF
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden print:block">
        {/* Left Side: Form */}
        <div className="w-1/2 overflow-y-auto p-8 border-r border-border bg-bg-primary custom-scrollbar print:hidden">
          <div className="space-y-8 max-w-2xl mx-auto">
            
            {/* Section 1: Meta */}
            <div className="card space-y-6">
              <h2 className="text-[11px] font-black text-accent-orange uppercase tracking-[2px] border-b border-border pb-3">01. Invoice Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase">Invoice Number</label>
                  <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none" value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase">Invoice Date</label>
                  <input type="date" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[12px] outline-none" value={formData.invoiceDate} onChange={e => setFormData({...formData, invoiceDate: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase">Invoice Type</label>
                  <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none" value={formData.invoiceType} onChange={e => setFormData({...formData, invoiceType: e.target.value})}>
                    <option>Tax Invoice - Intra State</option>
                    <option>Tax Invoice - Inter State</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase">Campaign Description Header</label>
                  <textarea rows={2} className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[12px] outline-none" value={formData.descriptionHeader} onChange={e => setFormData({...formData, descriptionHeader: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Section 2: Buyer */}
            <div className="card space-y-6">
              <h2 className="text-[11px] font-black text-accent-blue uppercase tracking-[2px] border-b border-border pb-3">02. Buyer (Bill To)</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase">Select Client</label>
                  <select 
                    className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none"
                    onChange={(e) => handleClientSelect(e.target.value)}
                  >
                    <option value="">Manual Entry...</option>
                    {CRM_MOCK.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase">Client Name</label>
                  <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none font-bold" value={formData.buyer.name} onChange={e => setFormData({...formData, buyer: {...formData.buyer, name: e.target.value}})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase">Address</label>
                  <textarea rows={2} className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[12px] outline-none" value={formData.buyer.address} onChange={e => setFormData({...formData, buyer: {...formData.buyer, address: e.target.value}})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase">GSTIN</label>
                    <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none font-mono" value={formData.buyer.gstin} onChange={e => setFormData({...formData, buyer: {...formData.buyer, gstin: e.target.value}})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase">State Code</label>
                    <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none" value={formData.buyer.state_code} onChange={e => setFormData({...formData, buyer: {...formData.buyer, state_code: e.target.value}})} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Line Items */}
            <div className="card space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h2 className="text-[11px] font-black text-success uppercase tracking-[2px]">03. Line Items</h2>
                <button onClick={addItem} className="text-xs font-bold text-accent-orange flex items-center gap-1 hover:underline">
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="space-y-6">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="p-4 bg-bg-surface-2 rounded-xl border border-border relative group">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-4 space-y-1.5">
                        <label className="text-[9px] font-black text-text-muted uppercase">Description</label>
                        <select 
                          className="w-full bg-bg-surface border border-border rounded-lg px-2 py-1.5 text-[12px] outline-none mb-2"
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                        >
                          <option value="">Choose Catalog...</option>
                          {CRM_MOCK.catalog.map(p => <option key={p.id} value={p.id}>{p.description}</option>)}
                        </select>
                        <input type="text" className="w-full bg-bg-surface border border-border rounded-lg px-2 py-1.5 text-[12px] outline-none" value={item.description} onChange={e => {
                          const newItems = [...formData.items];
                          newItems[index].description = e.target.value;
                          setFormData({...formData, items: newItems});
                        }} />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[9px] font-black text-text-muted uppercase">HSN</label>
                        <input type="text" className="w-full bg-bg-surface border border-border rounded-lg px-2 py-1.5 text-[12px] outline-none" value={item.hsn} onChange={e => {
                          const newItems = [...formData.items];
                          newItems[index].hsn = e.target.value;
                          setFormData({...formData, items: newItems});
                        }} />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[9px] font-black text-text-muted uppercase">Qty</label>
                        <input type="number" className="w-full bg-bg-surface border border-border rounded-lg px-2 py-1.5 text-[12px] outline-none" value={item.qty} onChange={e => {
                          const newItems = [...formData.items];
                          newItems[index].qty = parseFloat(e.target.value) || 0;
                          setFormData({...formData, items: newItems});
                        }} />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[9px] font-black text-text-muted uppercase">Rate (₹)</label>
                        <input type="number" className="w-full bg-bg-surface border border-border rounded-lg px-2 py-1.5 text-[12px] outline-none font-bold" value={item.rate} onChange={e => {
                          const newItems = [...formData.items];
                          newItems[index].rate = parseFloat(e.target.value) || 0;
                          setFormData({...formData, items: newItems});
                        }} />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[9px] font-black text-text-muted uppercase">Discount (₹)</label>
                        <input type="number" className="w-full bg-bg-surface border border-border rounded-lg px-2 py-1.5 text-[12px] outline-none" value={item.discount} onChange={e => {
                          const newItems = [...formData.items];
                          newItems[index].discount = parseFloat(e.target.value) || 0;
                          setFormData({...formData, items: newItems});
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="card space-y-4">
              <h2 className="text-[11px] font-black text-text-muted uppercase tracking-[2px] border-b border-border pb-3">Terms & Conditions</h2>
              <textarea rows={3} className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[11px] outline-none italic" value={formData.terms} onChange={e => setFormData({...formData, terms: e.target.value})} />
            </div>

          </div>
        </div>

        {/* Right Side: A4 Live Preview */}
        <div className="w-1/2 overflow-y-auto bg-[#525659] flex justify-center p-12 custom-scrollbar print:bg-white print:p-0 print:block">
          <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-10 text-black font-serif flex flex-col print:shadow-none print:w-full">
            
            {/* INVOICE HEADER */}
            <div className="text-center space-y-1 mb-8">
              <h1 className="text-2xl font-bold tracking-tight">{formData.seller.name}</h1>
              <p className="text-[10px] font-medium">{formData.seller.address}</p>
              <div className="flex justify-center gap-4 text-[10px]">
                <span>Ph: {formData.seller.phone.join(', ')}</span>
                <span>Email: {formData.seller.email}</span>
              </div>
              <div className="text-[10px] font-bold mt-2">
                GSTIN: {formData.seller.gstin} | MSME REG NO: {formData.seller.msme_reg_no}
              </div>
              <div className="border-t border-b border-black py-1 mt-4">
                <span className="text-sm font-bold uppercase">{formData.invoiceType}</span>
              </div>
            </div>

            {/* META INFO */}
            <div className="grid grid-cols-2 border border-black text-[10px] mb-6">
              <div className="border-r border-black p-2 space-y-1">
                <p><span className="font-bold">Invoice No:</span> {formData.invoiceNumber}</p>
                <p><span className="font-bold">Invoice Date:</span> {formData.invoiceDate}</p>
                <p><span className="font-bold">Reverse Charge (Y/N):</span> {formData.reverseCharge}</p>
                <p><span className="font-bold">State:</span> {formData.seller.state} <span className="ml-4 font-bold">Code:</span> {formData.seller.state_code}</p>
              </div>
              <div className="p-2 space-y-1">
                <p><span className="font-bold">Transport Mode:</span> {formData.transportMode}</p>
                <p><span className="font-bold">Vehicle Number:</span> {formData.vehicleNumber}</p>
                <p><span className="font-bold">Date of Supply:</span> {formData.dateOfSupply}</p>
                <p><span className="font-bold">Place of Supply:</span> {formData.placeOfSupply}</p>
              </div>
            </div>

            {/* PARTY DETAILS */}
            <div className="grid grid-cols-2 border border-black border-t-0 text-[10px] mb-6">
              <div className="border-r border-black p-3 space-y-1 min-h-[100px]">
                <p className="font-bold underline uppercase mb-2">Invoice to Party:</p>
                <p className="font-bold text-sm">{formData.buyer.name || '-'}</p>
                <p className="leading-tight">{formData.buyer.address || '-'}</p>
                <p><span className="font-bold">GSTIN:</span> {formData.buyer.gstin || '-'}</p>
                <p><span className="font-bold">State:</span> {formData.buyer.state} <span className="ml-4 font-bold">Code:</span> {formData.buyer.state_code}</p>
              </div>
              <div className="p-3 space-y-1 min-h-[100px]">
                <p className="font-bold underline uppercase mb-2">Ship to Party:</p>
                <p className="font-bold text-sm">{formData.buyer.name || '-'}</p>
                <p className="leading-tight">{formData.buyer.address || '-'}</p>
                <p><span className="font-bold">GSTIN:</span> {formData.buyer.gstin || '-'}</p>
                <p><span className="font-bold">State:</span> {formData.buyer.state} <span className="ml-4 font-bold">Code:</span> {formData.buyer.state_code}</p>
              </div>
            </div>

            {/* CAMPAIGN DESC */}
            <div className="bg-gray-100 p-2 border border-black border-t-0 mb-6 italic text-[9px]">
              {formData.descriptionHeader}
            </div>

            {/* LINE ITEMS TABLE */}
            <div className="flex-1 border border-black border-t-0 border-b-0">
               <table className="w-full text-left border-collapse text-[9px]">
                  <thead className="bg-gray-50">
                     <tr className="border-b border-black">
                        <th className="border-r border-black p-2 text-center w-8">S.N.</th>
                        <th className="border-r border-black p-2">Product Description</th>
                        <th className="border-r border-black p-2 text-center">HSN</th>
                        <th className="border-r border-black p-2 text-center">Qty</th>
                        <th className="border-r border-black p-2 text-right">Rate</th>
                        <th className="border-r border-black p-2 text-right">Amount</th>
                        <th className="border-r border-black p-2 text-right">Disc.</th>
                        <th className="border-r border-black p-2 text-right font-bold">Taxable</th>
                        <th className="border-r border-black p-2 text-center">GST%</th>
                        <th className="p-2 text-right font-bold">Total</th>
                     </tr>
                  </thead>
                  <tbody>
                     {totals.items.map((item, i) => (
                        <tr key={item.id} className="border-b border-black/10 h-12">
                           <td className="border-r border-black p-2 text-center">{i + 1}</td>
                           <td className="border-r border-black p-2">
                              <div className="font-bold">{item.description}</div>
                           </td>
                           <td className="border-r border-black p-2 text-center">{item.hsn}</td>
                           <td className="border-r border-black p-2 text-center">{item.qty}</td>
                           <td className="border-r border-black p-2 text-right">{item.rate.toLocaleString()}</td>
                           <td className="border-r border-black p-2 text-right">{item.amount.toLocaleString()}</td>
                           <td className="border-r border-black p-2 text-right">{item.discount.toLocaleString()}</td>
                           <td className="border-r border-black p-2 text-right font-bold">{item.taxable.toLocaleString()}</td>
                           <td className="border-r border-black p-2 text-center">{formData.invoiceType.includes("Inter") ? "18%" : "9+9%"}</td>
                           <td className="p-2 text-right font-bold">{item.total.toLocaleString()}</td>
                        </tr>
                     ))}
                     {/* Filler rows */}
                     {[...Array(Math.max(0, 10 - totals.items.length))].map((_, i) => (
                        <tr key={`filler-${i}`} className="h-10 border-b border-black/5">
                           <td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* TOTALS SUMMARY */}
            <div className="border border-black flex">
               <div className="flex-1 p-3 border-r border-black">
                  <p className="text-[9px] font-bold uppercase underline">Amount in Words:</p>
                  <p className="text-[11px] font-bold mt-1 leading-tight">{amountToWords(totals.grandTotal)}</p>
               </div>
               <div className="w-64">
                  <div className="flex justify-between p-2 border-b border-black text-[10px]">
                     <span>Taxable Value:</span>
                     <span className="font-bold">₹{totals.taxableTotal.toLocaleString()}</span>
                  </div>
                  {!formData.invoiceType.includes("Inter") ? (
                    <>
                      <div className="flex justify-between p-2 border-b border-black text-[10px]">
                        <span>Add: CGST (9%):</span>
                        <span className="font-bold">₹{totals.cgstTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 border-b border-black text-[10px]">
                        <span>Add: SGST (9%):</span>
                        <span className="font-bold">₹{totals.sgstTotal.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between p-2 border-b border-black text-[10px]">
                      <span>Add: IGST (18%):</span>
                      <span className="font-bold">₹{totals.igstTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 bg-gray-50 text-[12px] font-black">
                     <span>Grand Total:</span>
                     <span>₹{Math.round(totals.grandTotal).toLocaleString()}</span>
                  </div>
               </div>
            </div>

            {/* FOOTER */}
            <div className="grid grid-cols-2 border border-black border-t-0 text-[9px]">
               <div className="border-r border-black p-4 space-y-4">
                  <div className="space-y-1">
                     <p className="font-bold underline uppercase">Bank Settlement Details:</p>
                     <p><span className="font-bold">Bank:</span> {formData.seller.bank.name}</p>
                     <p><span className="font-bold">Branch:</span> {formData.seller.bank.branch}</p>
                     <p><span className="font-bold">A/C No:</span> {formData.seller.bank.account_no}</p>
                     <p><span className="font-bold">IFSC:</span> {formData.seller.bank.ifsc}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="font-bold underline uppercase">Terms & Conditions:</p>
                     <p className="whitespace-pre-line leading-tight">{formData.terms}</p>
                  </div>
               </div>
               <div className="p-4 flex flex-col justify-between items-center text-center">
                  <p className="font-bold">Certified that the particulars given above are true and correct.</p>
                  <div className="space-y-1">
                    <p className="font-bold uppercase">For {formData.seller.name}</p>
                    <div className="h-16"></div>
                    <p className="font-bold border-t border-black pt-1 w-48">Authorised Signatory</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
