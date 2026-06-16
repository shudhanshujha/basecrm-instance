import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Phone, Mail, MapPin, 
  ArrowRight, X, ExternalLink, ShieldCheck,
  Briefcase, IndianRupee, Download, Loader2, Edit2, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const PayoutWizard: React.FC<{ vendor: any; onClose: () => void; onSuccess: () => void }> = ({ vendor, onClose, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    paymentMode: 'NEFT',
    referenceNumber: '',
    purpose: '',
    notes: ''
  });

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post(`/vendors/${vendor.id}/payments`, {
        ...form,
        amount: parseFloat(form.amount) || 0,
        month: parseInt(form.month as any),
        year: parseInt(form.year as any)
      });
      toast.success(`Payout to ${vendor.vendorName} processed successfully!`);
      onSuccess();
    } catch {
      toast.error('Failed to process payout');
    } finally {
      setSaving(false);
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-surface-2 shrink-0">
          <div>
            <h2 className="font-black text-[14px] uppercase tracking-widest text-text-primary flex items-center gap-2">
              <IndianRupee size={16} className="text-accent-blue" /> Vendor Payout Wizard
            </h2>
            <p className="text-[10px] text-text-muted mt-0.5">Payee: {vendor.vendorName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface border border-transparent hover:border-border rounded-xl transition-colors"><X size={18} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-wider ml-1">Payout Amount (₹) *</label>
                  <input type="number" required autoFocus className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-[15px] outline-none focus:border-accent-blue font-black" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase ml-1">Payment Date *</label>
                  <input type="date" required className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[12px] outline-none focus:border-accent-blue" value={form.paymentDate} onChange={e => setForm({...form, paymentDate: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase ml-1">Payment Mode *</label>
                  <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[12px] outline-none focus:border-accent-blue font-bold" value={form.paymentMode} onChange={e => setForm({...form, paymentMode: e.target.value})}>
                    <option value="NEFT">NEFT / RTGS</option>
                    <option value="UPI">UPI</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] font-black text-text-muted uppercase ml-1">Reference Number</label>
                  <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[12px] outline-none focus:border-accent-blue" placeholder="UTR / Transaction ID" value={form.referenceNumber} onChange={e => setForm({...form, referenceNumber: e.target.value})} />
                </div>
              </div>

              <div className="p-4 border border-border rounded-xl bg-bg-surface-2 space-y-4">
                <div className="text-[11px] font-black text-text-primary uppercase">Billing Period</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase ml-1">Month</label>
                    <select className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-accent-blue" value={form.month} onChange={e => setForm({...form, month: parseInt(e.target.value)})}>
                      {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase ml-1">Year</label>
                    <input type="number" className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-accent-blue" value={form.year} onChange={e => setForm({...form, year: parseInt(e.target.value)})} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-muted uppercase ml-1">Purpose / Notes</label>
                <textarea rows={2} className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[12px] outline-none focus:border-accent-blue resize-none" placeholder="e.g. Monthly Professional Services Fee" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} />
              </div>
            </>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="p-5 bg-accent-blue/10 border border-accent-blue/30 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-1">Confirm Payout</div>
                <div className="text-3xl font-black text-accent-blue">₹{parseFloat(form.amount || '0').toLocaleString()}</div>
                <div className="text-[12px] text-text-primary font-bold mt-2">To: {vendor.vendorName}</div>
              </div>

              <div className="space-y-2 px-2">
                {[
                  { label: 'Date', value: new Date(form.paymentDate).toLocaleDateString() },
                  { label: 'Mode', value: form.paymentMode },
                  { label: 'Reference', value: form.referenceNumber || 'N/A' },
                  { label: 'Period', value: `${months[form.month - 1]} ${form.year}` },
                  { label: 'Purpose', value: form.purpose || 'Vendor Payout' }
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center text-[12px] border-b border-border/50 pb-2 last:border-0">
                    <span className="text-text-muted font-bold">{row.label}</span>
                    <span className="text-text-primary font-black text-right max-w-[60%]">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 bg-bg-surface-2 border border-border rounded-xl mt-4">
                <ShieldCheck size={14} className="text-success mt-0.5 shrink-0" />
                <p className="text-[10px] text-text-muted">This payout will be recorded in the vendor's ledger and automatically added to the P&L Expenses.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-bg-surface-2 shrink-0">
          <button
            onClick={step === 0 ? onClose : () => setStep(0)}
            className="px-4 py-2 text-[12px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
          >
            {step === 0 ? 'Cancel' : '← Edit Details'}
          </button>
          {step === 0 ? (
            <button
              onClick={() => setStep(1)}
              disabled={!form.amount || parseFloat(form.amount) <= 0}
              className="bg-accent-blue text-white px-6 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 hover:bg-accent-blue/90 transition-all disabled:opacity-50"
            >
              Review Payout <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-success text-white px-6 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 hover:bg-success/90 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              {saving ? 'Processing...' : 'Confirm & Process'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [payoutVendor, setPayoutVendor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vendorName: '',
    contactPerson: '',
    phone: '',
    email: '',
    vendorType: 'SUPPLIER',
    gstin: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/vendors');
      setVendors(res.data);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/vendors/${id}/status`, { status: newStatus.toUpperCase() });
      toast.success(`Status updated to ${newStatus}`);
      fetchVendors();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove all associated contract data and payout records.`)) {
      try {
        await api.delete(`/vendors/${id}`);
        toast.success('Vendor record deleted');
        fetchVendors();
      } catch (error) {
        console.error('Failed to delete vendor:', error);
        toast.error('Failed to delete vendor. Ensure they have no active contracts linked.');
      }
    }
  };

  const getStatusBg = (status: string) => {
    const bgMap: any = { 
      'ACTIVE': 'bg-success', 
      'INACTIVE': 'bg-danger'
    };
    return bgMap[status?.toUpperCase()] || 'bg-text-muted';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVendorId) {
        await api.put(`/vendors/${editingVendorId}`, formData);
        toast.success('Vendor updated successfully!');
      } else {
        await api.post('/vendors', formData);
        toast.success('Vendor added successfully!');
      }
      setShowAddModal(false);
      setEditingVendorId(null);
      fetchVendors();
      setFormData({
        vendorName: '', contactPerson: '', phone: '', email: '',
        vendorType: 'SUPPLIER', gstin: '', address: '', city: ''
      });
    } catch (error) {
      toast.error('Failed to save vendor');
    }
  };

  const openEditModal = (vendor: any) => {
    setFormData({
      vendorName: vendor.vendorName || '',
      contactPerson: vendor.contactPerson || '',
      phone: vendor.phone || '',
      email: vendor.email || '',
      vendorType: vendor.vendorType || 'SUPPLIER',
      gstin: vendor.gstin || '',
      address: vendor.address || '',
      city: vendor.city || ''
    });
    setEditingVendorId(vendor.id);
    setShowAddModal(true);
  };

  const filteredVendors = vendors.filter(v => 
    (v.vendorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (v.vendorType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Vendor Management</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Strategic Partners · Service Providers</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredVendors} filename="business_vendors" />
          <button onClick={() => {
            setFormData({
              vendorName: '', contactPerson: '', phone: '', email: '',
              vendorType: 'SUPPLIER', gstin: '', address: '', city: ''
            });
            setEditingVendorId(null);
            setShowAddModal(true);
          }} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Plus size={16} /> Add Vendor
          </button>
        </div>
      </div>

      <div className="card">
        <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
           <input 
             type="text" 
             placeholder="Search by vendor name, type or city..." 
             className="w-full bg-bg-surface-2 border border-border rounded-lg pl-9 pr-3 py-2 text-[12px] focus:outline-none focus:border-accent-orange transition-colors"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {isLoading ? (
          <div className="card flex justify-center py-20"><Loader2 className="animate-spin text-accent-blue" /></div>
        ) : filteredVendors.map((vendor) => (
          <div key={vendor.id} onClick={() => navigate(`/vendors/${vendor.id}`)} className="card hover:border-accent-orange transition-all cursor-pointer group flex items-center justify-between bg-bg-surface border-border/50">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-bg-surface-2 rounded-xl border border-border flex items-center justify-center font-black text-accent-blue text-[16px] shadow-sm group-hover:scale-105 transition-transform">
                  {vendor.vendorName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'V'}
               </div>
               <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors uppercase tracking-tight">{vendor.vendorName}</h3>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-bg-surface-2 text-text-muted border border-border">{vendor.vendorType}</span>
                    <div className="relative group/status" onClick={(e) => e.stopPropagation()}>
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white cursor-pointer ${getStatusBg(vendor.status || 'ACTIVE')}`}>
                         {vendor.status || 'ACTIVE'}
                       </span>
                       <div className="absolute hidden group-hover/status:flex flex-col gap-1 bg-bg-surface border border-border p-2 rounded-lg shadow-2xl z-10 top-5 left-0 min-w-[100px]">
                          {['Active', 'Inactive'].map(s => (
                             <button key={s} onClick={() => updateStatus(vendor.id, s)} className="text-[10px] text-left hover:text-accent-orange text-text-primary font-bold py-1 uppercase">{s}</button>
                          ))}
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-text-muted font-bold">
                     <div className="flex items-center gap-1"><Phone size={10} className="text-accent-orange" /> {vendor.phone}</div>
                     <div className="flex items-center gap-1 border-l border-border pl-3"><Mail size={10} className="text-accent-blue" /> {vendor.email || 'N/A'}</div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-6 text-right pr-2">
               <div>
                  <div className="text-[14px] font-black text-text-primary">{vendor.vendorContracts?.length || 0}</div>
                  <div className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Active Contracts</div>
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); setPayoutVendor(vendor); }}
                 className="px-3 py-1.5 bg-bg-surface-2 border border-border rounded-lg text-[10px] font-black text-accent-blue hover:border-accent-blue transition-all"
               >
                 NEW PAYOUT
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); openEditModal(vendor); }}
                 className="px-3 py-1.5 bg-bg-surface-2 border border-border rounded-lg text-[10px] font-black text-text-muted hover:border-text-primary transition-all flex items-center gap-1"
               >
                 <Edit2 size={12} /> EDIT
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); handleDelete(vendor.id, vendor.vendorName); }}
                 className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-lg transition-all"
               >
                 <Trash2 size={14} />
               </button>
               <div className="pl-2">
                  <button className="p-2 text-text-muted group-hover:text-accent-orange transition-colors border border-transparent group-hover:border-border rounded-lg">
                    <ArrowRight size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
        {!isLoading && filteredVendors.length === 0 && (
          <div className="card text-center py-20 text-text-muted italic text-[12px]">No vendors found.</div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-bg-primary/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-bg-surface border border-border rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-blue/10 text-accent-blue rounded-2xl flex items-center justify-center shadow-inner"><Briefcase size={20} /></div>
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-tighter">
                      {editingVendorId ? 'Edit Vendor / Partner' : 'Add Vendor / Partner'}
                    </h2>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-surface border border-transparent hover:border-border rounded-xl transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Vendor / Business Name</label>
                         <input type="text" required className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-[13px] outline-none focus:border-accent-orange transition-colors font-bold" placeholder="e.g. Global Supplies Ltd" value={formData.vendorName} onChange={e => setFormData({...formData, vendorName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Contact Person</label>
                         <input type="text" required className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none" placeholder="Full Name" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Phone</label>
                         <input type="text" required className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none" placeholder="Primary contact" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Vendor Type</label>
                         <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none font-bold" value={formData.vendorType} onChange={e => setFormData({...formData, vendorType: e.target.value})}>
                            <option value="SUPPLIER">Supplier</option>
                            <option value="CONTRACTOR">Contractor</option>
                            <option value="SERVICE_PROVIDER">Service Provider</option>
                            <option value="CONSULTANT">Consultant</option>
                            <option value="OTHER">Other Partner</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Tax ID / GSTIN</label>
                         <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none font-mono" placeholder="Tax Registration No" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} />
                      </div>
                   </div>
                </div>
                <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2 rounded-b-2xl">
                   <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline px-8 py-2.5 text-[12px]">Discard</button>
                   <button type="submit" className="px-10 py-2.5 bg-accent-blue text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-accent-blue/20 hover:scale-105 transition-transform">
                     {editingVendorId ? 'Save Changes' : 'Register Partner'}
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}

      {payoutVendor && (
        <PayoutWizard 
          vendor={payoutVendor} 
          onClose={() => setPayoutVendor(null)} 
          onSuccess={() => { setPayoutVendor(null); fetchVendors(); }} 
        />
      )}
    </div>
  );
};

export default Vendors;
