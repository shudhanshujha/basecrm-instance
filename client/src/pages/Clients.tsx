import React, { useState, useEffect } from 'react';
import { Plus, Search, ExternalLink, MapPin, X, Building, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    state: 'General',
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

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove all associated records.`)) {
      try {
        await api.delete(`/clients/${id}`);
        toast.success('Client deleted');
        fetchClients();
      } catch (error) {
        toast.error('Failed to delete client. They may have active dependencies.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // prevent duplicate submissions
    setIsSubmitting(true);
    try {
      await api.post('/clients', formData);
      toast.success('Client added successfully!');
      setShowAddModal(false);
      fetchClients();
      setFormData({
        name: '', contactPerson: '', state: 'General', gstin: '',
        clientType: 'REGULAR', phone: '', email: '', address: '', city: ''
      });
    } catch (error) {
      toast.error('Failed to add client');
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-xl font-bold text-text-primary">Clients</h1>
          <p className="text-[12px] text-text-muted mt-1">{clients.length} total clients</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={clients} filename="business_clients" />
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-[14px] flex items-center gap-2">
            <Plus size={15} /> Add Client
          </button>
        </div>
      </div>

      <div className="card">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
          <input
            type="text"
            placeholder="Search by name or GSTIN..."
            className="w-full bg-bg-surface-2 border border-border rounded-lg pl-9 pr-3 py-2 text-[14px] focus:outline-none focus:border-accent-blue/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {isLoading ? (
          <div className="card flex justify-center py-20"><Loader2 className="animate-spin text-accent-blue" size={24} /></div>
        ) : filteredClients.map((client) => (
          <div key={client.id} onClick={() => navigate(`/clients/${client.id}`)} className="card hover:border-accent-blue/30 transition-all cursor-pointer group flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-bg-surface-2 rounded-xl border border-border flex items-center justify-center font-semibold text-accent-blue text-[16px]">
                {client.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-text-primary group-hover:text-accent-blue transition-colors">{client.name}</h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full text-white ${client.clientType === 'PREMIUM' ? 'bg-success' : 'bg-text-muted/60'}`}>
                    {client.clientType}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1 text-[12px] text-text-muted">
                    <MapPin size={10} /> {client.city || '—'}
                  </div>
                  {client.gstin && <div className="text-[12px] text-text-muted font-mono">{client.gstin}</div>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 pr-2">
              <div className="text-right">
                <div className="text-[15px] font-semibold text-text-primary">{client.deals?.length || 0}</div>
                <div className="text-[11px] text-text-muted">Deals</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleDelete(e, client.id, client.name)}
                  className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
                <button className="p-2 text-text-muted group-hover:text-accent-blue transition-colors rounded-lg">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && filteredClients.length === 0 && (
          <div className="card text-center py-16 text-text-muted text-[14px]">No clients found.</div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-accent-blue/10 text-accent-blue rounded-lg flex items-center justify-center"><Building size={16} /></div>
                <h2 className="text-[15px] font-semibold text-text-primary">Add New Client</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-bg-surface-2 rounded-lg transition-colors text-text-muted"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[12px] font-medium text-text-muted">Company / Client Name *</label>
                    <input type="text" required className="input-field" placeholder="e.g. Apex Dynamics" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-text-muted">Contact Person *</label>
                    <input type="text" required className="input-field" placeholder="Full name" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-text-muted">Phone *</label>
                    <input type="text" required className="input-field" placeholder="Contact number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-text-muted">GSTIN</label>
                    <input type="text" className="input-field font-mono" placeholder="Tax registration no." value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-text-muted">Client Type</label>
                    <select className="input-field" value={formData.clientType} onChange={e => setFormData({...formData, clientType: e.target.value})}>
                      <option value="REGULAR">Regular</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="ONE_TIME">One-time</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[12px] font-medium text-text-muted">Address</label>
                    <textarea className="input-field resize-none" rows={2} placeholder="Full address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline px-6">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary px-8 flex items-center gap-2 disabled:opacity-60">
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                  ) : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
