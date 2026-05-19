import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, ExternalLink, MapPin, X, Building, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    state: 'Haryana',
    gstin: '',
    clientType: 'REGULAR',
    phone: '',
    email: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clients', formData);
      toast.success('Client registered successfully!');
      setShowAddModal(false);
      fetchClients();
      setFormData({
        name: '', contactPerson: '', state: 'Haryana', gstin: '',
        clientType: 'REGULAR', phone: '', email: '', address: '', city: ''
      });
    } catch (error) {
      toast.error('Failed to register client');
    }
  };

  const filteredClients = clients.filter(c => 
    (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (c.gstin?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Client Database</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Strategic Partnerships · Brand Network</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={clients} filename="drishtivision_clients" />
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
        {isLoading ? (
          <div className="card flex justify-center py-20"><Loader2 className="animate-spin text-accent-orange" /></div>
        ) : filteredClients.map((client) => (
          <div key={client.id} onClick={() => navigate(`/clients/${client.id}`)} className="card hover:border-accent-orange transition-all cursor-pointer group flex items-center justify-between bg-bg-surface border-border/50">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-bg-surface-2 rounded-xl border border-border flex items-center justify-center font-black text-accent-orange text-[16px] shadow-sm group-hover:scale-105 transition-transform">
                  {client.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
               </div>
               <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{client.name}</h3>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white shadow-sm ${client.clientType === 'PREMIUM' ? 'bg-success' : 'bg-text-muted'}`}>
                      {client.clientType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                     <div className="text-[10px] text-text-muted font-mono uppercase tracking-tighter bg-bg-surface-2 px-1.5 rounded">GST: {client.gstin || 'N/A'}</div>
                     <div className="flex items-center gap-1 text-[10px] text-text-muted font-bold">
                        <MapPin size={10} className="text-accent-blue" /> {client.city || 'Pan-India'}
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-10 text-right pr-2">
               <div>
                  <div className="text-[14px] font-black text-text-primary">{client.campaigns?.length || 0}</div>
                  <div className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Campaigns</div>
               </div>
               <div className="pl-4">
                  <button className="p-2 text-text-muted group-hover:text-accent-orange transition-colors border border-transparent group-hover:border-border rounded-lg">
                    <ExternalLink size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
        {!isLoading && filteredClients.length === 0 && (
          <div className="card text-center py-20 text-text-muted italic text-[12px]">No clients found matching your search.</div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-bg-primary/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-bg-surface border border-border rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-orange/10 text-accent-orange rounded-2xl flex items-center justify-center shadow-inner"><Building size={20} /></div>
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-tighter">Register New Client</h2>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-surface border border-transparent hover:border-border rounded-xl transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Client / Company Name</label>
                         <input type="text" required className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-[13px] outline-none focus:border-accent-orange transition-colors font-bold" placeholder="e.g. Reliance Retail Ltd" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Contact Person</label>
                         <input type="text" required className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none" placeholder="Full Name" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Phone Number</label>
                         <input type="text" required className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none" placeholder="10-digit mobile" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">GSTIN</label>
                         <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none font-mono" placeholder="15-digit GSTIN" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Client Category</label>
                         <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none font-bold" value={formData.clientType} onChange={e => setFormData({...formData, clientType: e.target.value})}>
                            <option value="REGULAR">Regular</option>
                            <option value="PREMIUM">Premium</option>
                            <option value="ONE_TIME">One-time</option>
                         </select>
                      </div>
                      <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase ml-1">Office Address</label>
                         <textarea className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3 text-[13px] outline-none" rows={2} placeholder="Full correspondence address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                      </div>
                   </div>
                </div>
                <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2 rounded-b-2xl">
                   <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline px-8 py-2.5 text-[12px]">Discard</button>
                   <button type="submit" className="px-10 py-2.5 bg-accent-orange text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-accent-orange/20 hover:scale-105 transition-transform">Save Partnership</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
