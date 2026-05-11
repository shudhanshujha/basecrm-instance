import React, { useState } from 'react';
import { 
  Plus, Search, Phone, Mail, MapPin, 
  ArrowRight, X, ExternalLink, ShieldCheck,
  Briefcase, IndianRupee, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const vendors = [
    { id: '1', name: 'Haryana Outdoor Media', contact: 'Rakesh Yadav', phone: '9876543210', email: 'rakesh@hom.com', sites: 24, status: 'Active', bg: 'bg-success', type: 'Site Owner' },
    { id: '2', name: 'Digital Flex Printers', contact: 'Anita Singh', phone: '9988776655', email: 'billing@dfp.in', sites: 0, status: 'Active', bg: 'bg-success', type: 'Printing' },
    { id: '3', name: 'North India Hoardings', contact: 'Vikas Khanna', phone: '9112233445', email: 'vikas@nih.com', sites: 12, status: 'On Hold', bg: 'bg-warning', type: 'Site Owner' },
  ];

  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Vendor Management</h1>
          <p className="text-[11px] text-text-muted mt-1">Partners, Site Owners & Production Agencies</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredVendors} filename="drishtivision_vendors" />
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
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
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} onClick={() => navigate(`/vendors/${vendor.id}`)} className="card hover:border-accent-orange transition-all cursor-pointer group flex items-center justify-between bg-bg-surface border-border/50">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-bg-surface-2 rounded-xl border border-border flex items-center justify-center font-black text-accent-blue text-[16px] shadow-sm group-hover:scale-105 transition-transform">
                  {vendor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
               </div>
               <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{vendor.name}</h3>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-bg-surface-2 text-text-muted border border-border">{vendor.type}</span>
                    <span className={`status-tag ${vendor.bg}`}>
                      {vendor.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-text-muted font-bold">
                     <div className="flex items-center gap-1"><Phone size={10} className="text-accent-orange" /> {vendor.phone}</div>
                     <div className="flex items-center gap-1 border-l border-border pl-3"><Mail size={10} className="text-accent-blue" /> {vendor.email}</div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-6 text-right pr-2">
               <div>
                  <div className="text-[14px] font-black text-text-primary">{vendor.sites}</div>
                  <div className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Leased Sites</div>
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); toast.success('Payout wizard initiated...'); }}
                 className="px-3 py-1.5 bg-bg-surface-2 border border-border rounded-lg text-[10px] font-black text-accent-blue hover:border-accent-blue transition-all"
               >
                 NEW PAYOUT
               </button>
               <div className="pl-4">
                  <button className="p-2 text-text-muted group-hover:text-accent-orange transition-colors border border-transparent group-hover:border-border rounded-lg">
                    <ArrowRight size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface-2">
                 <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary"><Plus size={18} className="text-accent-orange" /> Add Vendor / Partner</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-surface border border-transparent hover:border-border rounded-lg transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase flex items-center gap-1.5"><Briefcase size={10} /> Business Name</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none" placeholder="e.g. Haryana Outdoor Media" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase">Contact Person</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none" placeholder="Full Name" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase">Phone</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none" placeholder="+91..." />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase">Vendor Type</label>
                       <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none">
                          <option>Site Owner</option>
                          <option>Printing Agency</option>
                          <option>Mounting Team</option>
                          <option>Electrician</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase">GSTIN (Optional)</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[12px] outline-none font-mono" placeholder="15-digit GSTIN" />
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2">
                 <button onClick={() => setShowAddModal(false)} className="btn-outline px-6 py-2 text-[12px]">Cancel</button>
                 <button onClick={() => { toast.success('Vendor added successfully!'); setShowAddModal(false); }} className="btn-primary px-8 py-2 text-[12px] shadow-lg shadow-accent-orange/30">Save Vendor</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
