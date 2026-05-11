import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, ExternalLink, MapPin, X, Building, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [clients, setClients] = useState([
    { id: '1', name: 'Reliance Retail Ltd', gstin: '06AAACR5055K1ZZ', campaigns: 12, sitesCount: 45, revenue: '₹28L', type: 'Premium', color: 'bg-success' },
    { id: '2', name: 'Axis Bank Ltd', gstin: '06AAACC2415M1ZF', campaigns: 8, sitesCount: 22, revenue: '₹18L', type: 'Premium', color: 'bg-success' },
    { id: '3', name: 'Havells India', gstin: '07AAACH1989D1Z8', campaigns: 5, sitesCount: 12, revenue: '₹9L', type: 'Regular', color: 'bg-warning' },
    { id: '4', name: 'Local Business A', gstin: '06XXXXX1234X1Z0', campaigns: 1, sitesCount: 2, revenue: '₹45k', type: 'One-time', color: 'bg-text-muted' },
  ]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Client Database</h1>
          <p className="text-[11px] text-text-muted mt-1">38 Active Partnerships · Pan-India Network</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredClients} filename="drishtivision_clients_database" />
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Plus size={16} /> Add Client
          </button>
        </div>
      </div>

      <div className="card">
        <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
           <input 
             type="text" 
             placeholder="Search by client name, GSTIN, or city..." 
             className="w-full bg-bg-surface-2 border border-border rounded-lg pl-9 pr-3 py-2 text-[12px] focus:outline-none focus:border-accent-orange transition-colors"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredClients.map((client) => (
          <div key={client.id} onClick={() => navigate(`/clients/${client.id}`)} className="card hover:border-accent-orange transition-all cursor-pointer group flex items-center justify-between bg-bg-surface border-border/50">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-bg-surface-2 rounded-xl border border-border flex items-center justify-center font-black text-accent-orange text-[16px] shadow-sm group-hover:scale-105 transition-transform">
                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
               </div>
               <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{client.name}</h3>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white shadow-sm ${client.color}`}>
                      {client.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                     <div className="text-[10px] text-text-muted font-mono uppercase tracking-tighter bg-bg-surface-2 px-1.5 rounded">GST: {client.gstin}</div>
                     <div className="flex items-center gap-1 text-[10px] text-text-muted font-bold">
                        <MapPin size={10} className="text-accent-blue" /> Pan-India
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-10 text-right pr-2">
               <div>
                  <div className="text-[14px] font-black text-text-primary">{client.campaigns}</div>
                  <div className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Campaigns</div>
               </div>
               <div>
                  <div className="text-[14px] font-black text-accent-orange">{client.sitesCount}</div>
                  <div className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Sites Booked</div>
               </div>
               <div>
                  <div className="text-[14px] font-black text-accent-blue">{client.revenue}</div>
                  <div className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Total Revenue</div>
               </div>
               <div className="pl-4">
                  <button className="p-2 text-text-muted group-hover:text-accent-orange transition-colors border border-transparent group-hover:border-border rounded-lg">
                    <ExternalLink size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface-2">
                 <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary"><Plus size={18} className="text-accent-orange" /> Register New Client</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-surface border border-transparent hover:border-border rounded-lg transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase flex items-center gap-1.5"><Building size={10} /> Client / Company Name</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-accent-orange transition-colors font-medium" placeholder="e.g. Havells India Pvt Ltd" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase flex items-center gap-1.5"><User size={10} /> Contact Person</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none" placeholder="Full Name" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase flex items-center gap-1.5"><MapPin size={10} /> State</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none" placeholder="e.g. Haryana" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase">GSTIN Number</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none font-mono" placeholder="15-digit GSTIN" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-text-muted uppercase">Client Category</label>
                       <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none">
                          <option>Regular</option>
                          <option>Premium</option>
                          <option>One-time</option>
                       </select>
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2">
                 <button onClick={() => setShowAddModal(false)} className="btn-outline px-6 py-2 text-[12px]">Cancel</button>
                 <button onClick={() => { toast.success('Client registered successfully!'); setShowAddModal(false); }} className="btn-primary px-8 py-2 text-[12px] shadow-lg shadow-accent-orange/30">Save Partner</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
