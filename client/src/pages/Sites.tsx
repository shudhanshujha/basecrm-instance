import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Database, Map as MapIcon, 
  Table, Download, Upload, Info, ExternalLink,
  ChevronRight, ArrowRight, X, LayoutGrid, List,
  Truck, ShieldCheck, Home, Camera, Ruler, Lightbulb, MapPin, Loader2
} from 'lucide-react';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const Sites: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'table' | 'pamphlet'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newSiteType, setNewSiteType] = useState<'owned' | 'rented'>('owned');

  const [sites, setSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/sites');
      setSites(res.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/sites/${id}/status`, { status: newStatus.toUpperCase() });
      toast.success(`Status updated to ${newStatus}`);
      fetchSites();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBg = (status: string) => {
    const bgMap: any = { 
      'AVAILABLE': 'bg-success', 
      'OCCUPIED': 'bg-warning', 
      'MAINTENANCE': 'bg-danger' 
    };
    return bgMap[status?.toUpperCase()] || 'bg-text-muted';
  };

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await api.post('/sites', {
        ...data,
        monthlyRate: parseFloat(data.monthlyRate as string),
        ownershipType: newSiteType.toUpperCase(),
        status: 'AVAILABLE'
      });
      toast.success('Site added successfully');
      setShowAddModal(false);
      fetchSites();
    } catch (error) {
      toast.error('Failed to save site');
    }
  };

  const filteredSites = sites.filter(s => {
    const matchesSearch = (s.siteName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (s.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (s.state?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || 
                         (filterType === 'Owned' && s.ownershipType === 'OWNED') ||
                         (filterType === 'Leased' && s.ownershipType === 'LEASED') ||
                         (filterType === 'Available' && s.status === 'AVAILABLE');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Pan-India Inventory</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase font-black tracking-widest">Inventory Management · Real-time Status</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.error('CSV Template coming soon.')} className="btn-outline text-[12px] py-1.5 flex items-center gap-2">
            <Upload size={14} /> Import CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Plus size={16} /> Add New Site
          </button>
        </div>
      </div>

      <div className="card space-y-4 border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['All', 'Owned', 'Leased', 'Available'].map(t => (
              <button 
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-[11px] font-bold px-4 py-1.5 rounded-lg border transition-all ${filterType === t ? 'bg-accent-orange text-white border-accent-orange shadow-lg' : 'bg-bg-surface-2 text-text-muted border-border hover:text-text-primary'}`}
              >
                {t === 'All' ? 'Full Database' : t}
              </button>
            ))}
          </div>
          <div className="flex bg-bg-surface-2 p-1 rounded-lg border border-border">
            <button onClick={() => setView('table')} className={`p-1.5 rounded-md transition-all ${view === 'table' ? 'bg-bg-surface text-accent-orange shadow-sm' : 'text-text-muted'}`}><List size={16} /></button>
            <button onClick={() => setView('pamphlet')} className={`p-1.5 rounded-md transition-all ${view === 'pamphlet' ? 'bg-bg-surface text-accent-orange shadow-sm' : 'text-text-muted'}`}><LayoutGrid size={16} /></button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input 
              type="text" 
              placeholder="Search by city, state or hoarding name..." 
              className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[12px] focus:outline-none focus:border-accent-orange transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-outline flex items-center justify-center gap-2 text-[12px] ${showFilters ? 'border-accent-orange text-accent-orange' : ''}`}><Filter size={14} /> Advanced</button>
          <ExportButton data={sites} filename="drishtivision_inventory" />
        </div>
      </div>

      {view === 'table' ? (
        <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface-2 border-b border-border text-[10px] font-black text-text-muted uppercase tracking-widest">
                <th className="px-4 py-3">Site Identification</th>
                <th className="px-4 py-3">Facing / Orientation</th>
                <th className="px-4 py-3 text-center">Procurement</th>
                <th className="px-4 py-3">Specifications</th>
                <th className="px-4 py-3 text-right">Activity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-accent-orange" /></td></tr>
              ) : filteredSites.map((site) => (
                <tr key={site.id} onClick={() => navigate(`/sites/${site.id}`)} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                  <td className="px-4 py-4">
                    <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{site.siteName}</div>
                    <div className="text-[10px] text-text-muted mt-0.5 font-bold uppercase tracking-tighter">{site.city}, {site.state}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-text-primary">
                       <MapPin size={12} className="text-accent-blue" /> {site.facingSide || 'Not Set'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${site.ownershipType === 'OWNED' ? 'border-success text-success bg-success/5' : 'border-purple-500 text-purple-400 bg-purple-500/5'}`}>{site.ownershipType}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[11px] font-medium text-text-primary uppercase tracking-tighter">{site.siteType} · {site.widthFt}x{site.heightFt} ft</div>
                    <div className="text-[11px] font-black text-accent-blue mt-0.5">₹{site.monthlyRate?.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4 text-right">
                     <div className="relative group/status inline-block text-left" onClick={(e) => e.stopPropagation()}>
                        <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white cursor-pointer ${getStatusBg(site.status)}`}>
                          {site.status}
                        </span>
                        <div className="absolute hidden group-hover/status:flex flex-col gap-1 bg-bg-surface border border-border p-2 rounded-lg shadow-2xl z-10 top-6 right-0 min-w-[100px]">
                           {['Available', 'Occupied', 'Maintenance'].map(s => (
                              <button key={s} onClick={() => updateStatus(site.id, s)} className="text-[10px] text-left hover:text-accent-orange text-text-muted font-bold py-1 uppercase">{s}</button>
                           ))}
                        </div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredSites.map(site => (
            <div key={site.id} onClick={() => navigate(`/sites/${site.id}`)} className="card bg-bg-surface hover:border-accent-orange transition-all cursor-pointer group flex flex-col p-0 overflow-hidden relative shadow-lg border-border/50">
               <div className="h-36 bg-bg-surface-2 flex items-center justify-center relative border-b border-border overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=400&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" 
                    alt="Hoarding"
                  />
                  <Camera size={32} className="text-border z-10" />
                  <div className="absolute top-3 left-3 flex gap-2">
                     <div className="relative group/status" onClick={(e) => e.stopPropagation()}>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-white cursor-pointer ${getStatusBg(site.status)}`}>
                          {site.status}
                        </span>
                        <div className="absolute hidden group-hover/status:flex flex-col gap-1 bg-bg-surface border border-border p-2 rounded-lg shadow-2xl z-10 top-5 left-0 min-w-[100px]">
                           {['Available', 'Occupied', 'Maintenance'].map(s => (
                              <button key={s} onClick={() => updateStatus(site.id, s)} className="text-[10px] text-left hover:text-accent-orange text-text-muted font-bold py-1 uppercase">{s}</button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="absolute bottom-2 right-2"><div className={`w-2 h-2 rounded-full ${site.status === 'OCCUPIED' ? 'bg-warning shadow-[0_0_8px_#eab308]' : site.status === 'AVAILABLE' ? 'bg-success shadow-[0_0_8px_#22c55e]' : 'bg-danger shadow-[0_0_8px_#ef4444]'}`}></div></div>
               </div>
               <div className="p-4">
                  <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors line-clamp-1 uppercase">{site.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-1 uppercase font-bold tracking-widest">
                     <MapPin size={10} /> {site.location}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                     <div className="text-[13px] font-black text-accent-blue">₹{site.monthlyRate?.toLocaleString()}</div>
                     <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-text-muted uppercase border border-border px-1.5 py-0.5 rounded-md">{site.ownershipType}</span>
                        <div className="p-1.5 bg-bg-surface-2 rounded-lg text-text-muted group-hover:text-accent-orange transition-colors border border-border"><ArrowRight size={12} /></div>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-bg-primary/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-bg-surface border border-border rounded-3xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-orange/10 text-accent-orange rounded-2xl flex items-center justify-center shadow-inner"><Plus size={20} /></div>
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-tighter">Inventory Procurement</h2>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-surface border border-transparent hover:border-border rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveSite}>
              <div className="p-8 space-y-8">
                 <div className="flex gap-4 p-1 bg-bg-surface-2 border border-border rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => setNewSiteType('owned')}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-widest transition-all ${newSiteType === 'owned' ? 'bg-bg-surface text-accent-orange shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                    >
                       <Home size={16} /> DV Owned Site
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewSiteType('rented')}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-widest transition-all ${newSiteType === 'rented' ? 'bg-bg-surface text-purple-400 shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                    >
                       <Truck size={16} /> Rented / Vendor Site
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Hoarding / Site Identification</label>
                       <input name="siteName" type="text" required className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-[13px] outline-none font-bold focus:border-accent-orange" placeholder="e.g. MG Road Gantry A-1" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Site Facing / orientation</label>
                       <input name="facingSide" type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none" placeholder="e.g. North" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">City / Hub</label>
                       <input name="city" type="text" required className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none" placeholder="e.g. Gurugram" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Structure Dimensions</label>
                       <div className="relative">
                          <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                          <input name="widthFt" type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-4 py-3 text-[13px] outline-none" placeholder="20x10 ft" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Monthly Billing Rate (₹)</label>
                       <input name="monthlyRate" type="number" required className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-black text-accent-blue outline-none" placeholder="0.00" />
                    </div>

                    {newSiteType === 'rented' && (
                       <div className="col-span-2 space-y-4 animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-border border-dashed">
                          <div className="flex items-center gap-2 text-purple-400 font-black text-[10px] uppercase tracking-widest"><ShieldCheck size={14} /> Vendor Linkage Required</div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-purple-400 uppercase">Select Vendor Partner</label>
                                <select name="vendorId" className="w-full bg-bg-surface border border-purple-500/20 rounded-xl px-3 py-2.5 text-[12px] outline-none text-text-primary font-bold"><option value="">Select Vendor</option><option value="1">Haryana Outdoor Media</option><option value="2">North India Hoardings</option></select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-purple-400 uppercase">Vendor Payout Rate</label>
                                <input name="leaseAmount" type="number" className="w-full bg-bg-surface border border-purple-500/20 rounded-xl px-3 py-2.5 text-[12px] outline-none font-bold" placeholder="Vendor Rate" />
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2 rounded-b-2xl">
                 <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline px-8 py-2.5 text-[12px]">Discard</button>
                 <button type="submit" className={`px-10 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest text-white shadow-xl transition-all ${newSiteType === 'owned' ? 'bg-accent-orange shadow-accent-orange/20' : 'bg-purple-600 shadow-purple-600/20'}`}>Save Inventory</button>
              </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Sites;
