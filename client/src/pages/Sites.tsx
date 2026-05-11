import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Database, Map as MapIcon, 
  Table, Download, Upload, Info, ExternalLink,
  ChevronRight, ArrowRight, X, LayoutGrid, List,
  Truck, ShieldCheck, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

interface Site {
  id: string;
  name: string;
  location: string;
  type: string;
  size: string;
  ownership: string;
  rate: string;
  status: string;
  bg: string;
}

const Sites: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'table' | 'pamphlet'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newSiteType, setNewSiteType] = useState<'owned' | 'rented'>('owned');

  const [sites] = useState<Site[]>([
    { id: '1', name: 'GT Road, Panipat KM 87', location: 'Panipat', type: 'Unipole', size: '20×10 ft', ownership: 'Owned', rate: '₹28,000', status: 'Occupied', bg: 'bg-success' },
    { id: '2', name: 'Sector 12, Karnal Bus Stand', location: 'Karnal', type: 'Gantry', size: '40×10 ft', ownership: 'Rented', rate: '₹22,000', status: 'Available', bg: 'bg-warning' },
    { id: '3', name: 'NH-44 Flyover, Ambala', location: 'Ambala', type: 'Billboard', size: '30×15 ft', ownership: 'Owned', rate: '₹45,000', status: 'Occupied', bg: 'bg-success' },
    { id: '4', name: 'Railway Road, Kurukshetra', location: 'Kurukshetra', type: 'Flex', size: '15×10 ft', ownership: 'Owned', rate: '₹12,000', status: 'Maintenance', bg: 'bg-danger' },
    { id: '5', name: 'Connaught Place, Delhi', location: 'Delhi', type: 'Digital', size: '10×10 ft', ownership: 'Rented', rate: '₹1,50,000', status: 'Available', bg: 'bg-warning' },
  ]);

  // Advanced Filter States
  const [advFilters, setAdvFilters] = useState({
    city: 'All',
    type: 'All',
    minRate: '',
    maxRate: ''
  });

  const cities = ['All', ...Array.from(new Set(sites.map(s => s.location)))];
  const types = ['All', ...Array.from(new Set(sites.map(s => s.type)))];

  const filteredSites = sites.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuickFilter = filterType === 'All' || 
                         (filterType === 'Owned' && s.ownership === 'Owned') ||
                         (filterType === 'Leased' && s.ownership === 'Rented') ||
                         (filterType === 'Available' && s.status === 'Available');
    
    const matchesCity = advFilters.city === 'All' || s.location === advFilters.city;
    const matchesType = advFilters.type === 'All' || s.type === advFilters.type;
    
    const rateValue = parseInt(s.rate.replace(/[^\d]/g, ''));
    const matchesMinRate = !advFilters.minRate || rateValue >= parseInt(advFilters.minRate);
    const matchesMaxRate = !advFilters.maxRate || rateValue <= parseInt(advFilters.maxRate);

    return matchesSearch && matchesQuickFilter && matchesCity && matchesType && matchesMinRate && matchesMaxRate;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Pan-India Inventory</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase font-black tracking-widest">Site Management · Real-time availability</p>
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
          <ExportButton data={filteredSites} filename="drishtivision_inventory" />
        </div>

        {showFilters && (
          <div className="p-4 bg-bg-surface-2 border border-border rounded-xl grid grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase">City Filter</label>
              <select 
                className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-[11px] outline-none"
                value={advFilters.city}
                onChange={(e) => setAdvFilters({...advFilters, city: e.target.value})}
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase">Structure Type</label>
              <select 
                className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-[11px] outline-none"
                value={advFilters.type}
                onChange={(e) => setAdvFilters({...advFilters, type: e.target.value})}
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase">Min Rate (₹)</label>
              <input 
                type="number" 
                placeholder="Min"
                className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-[11px] outline-none"
                value={advFilters.minRate}
                onChange={(e) => setAdvFilters({...advFilters, minRate: e.target.value})}
              />
            </div>
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-black text-text-muted uppercase">Max Rate (₹)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Max"
                  className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-[11px] outline-none"
                  value={advFilters.maxRate}
                  onChange={(e) => setAdvFilters({...advFilters, maxRate: e.target.value})}
                />
                <button 
                  onClick={() => setAdvFilters({city: 'All', type: 'All', minRate: '', maxRate: ''})}
                  className="p-2 text-text-muted hover:text-danger"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {view === 'table' ? (
        <div className="card p-0 overflow-hidden border-border/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface-2 border-b border-border text-[10px] font-black text-text-muted uppercase tracking-widest">
                <th className="px-4 py-3">Site Details</th>
                <th className="px-4 py-3">Ownership</th>
                <th className="px-4 py-3">Technical Specs</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSites.map((site) => (
                <tr key={site.id} onClick={() => navigate(`/sites/${site.id}`)} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                  <td className="px-4 py-4">
                    <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{site.name}</div>
                    <div className="text-[10px] text-text-muted mt-0.5 font-bold uppercase tracking-widest">{site.location}, India</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${site.ownership === 'Owned' ? 'border-success text-success bg-success/5' : 'border-purple-500 text-purple-400 bg-purple-500/5'}`}>{site.ownership}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[11px] font-medium text-text-primary">{site.type} · {site.size}</div>
                    <div className="text-[11px] font-black text-accent-blue mt-0.5">{site.rate}</div>
                  </td>
                  <td className="px-4 py-4 text-right">
                     <span className={`status-tag ${site.bg}`}>{site.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredSites.map(site => (
            <div key={site.id} onClick={() => navigate(`/sites/${site.id}`)} className="card bg-bg-surface hover:border-accent-orange transition-all cursor-pointer group flex flex-col p-0 overflow-hidden relative shadow-lg">
               <div className="h-36 bg-bg-surface-2 flex items-center justify-center relative border-b border-border">
                  <Database size={40} className="text-border group-hover:text-accent-orange/20 transition-colors" />
                  <div className="absolute top-3 left-3 flex gap-2">
                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-white ${site.bg}`}>{site.status}</span>
                  </div>
                  <div className="absolute bottom-2 right-2"><div className={`w-2 h-2 rounded-full ${site.status === 'Occupied' ? 'bg-success shadow-[0_0_8px_#22c55e]' : 'bg-warning shadow-[0_0_8px_#eab308]'}`}></div></div>
               </div>
               <div className="p-4">
                  <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors line-clamp-1">{site.name}</h3>
                  <p className="text-[10px] text-text-muted mt-1 uppercase font-bold tracking-widest">{site.location}</p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                     <div className="text-[13px] font-black text-accent-blue">{site.rate}</div>
                     <span className="text-[9px] font-black text-text-muted uppercase border border-border px-1.5 py-0.5 rounded-md">{site.ownership}</span>
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
              <div className="p-8 space-y-8">
                 <div className="flex gap-4 p-1 bg-bg-surface-2 border border-border rounded-2xl">
                    <button 
                      onClick={() => setNewSiteType('owned')}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-widest transition-all ${newSiteType === 'owned' ? 'bg-bg-surface text-accent-orange shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                    >
                       <Home size={16} /> DV Owned Site
                    </button>
                    <button 
                      onClick={() => setNewSiteType('rented')}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-widest transition-all ${newSiteType === 'rented' ? 'bg-bg-surface text-purple-400 shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                    >
                       <Truck size={16} /> Rented / Vendor Site
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Hoarding / Site Identification</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-[13px] outline-none font-bold focus:border-accent-orange" placeholder="e.g. MG Road Gantry A-1" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">City / Hub</label>
                       <input type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none" placeholder="e.g. Gurugram" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Structure Type</label>
                       <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none appearance-none font-bold">
                          <option>Unipole</option><option>Gantry</option><option>Billboard</option><option>Digital</option>
                       </select>
                    </div>

                    {newSiteType === 'rented' && (
                       <div className="col-span-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl flex flex-col gap-4">
                             <div className="flex items-center gap-2 text-purple-400 font-black text-[10px] uppercase tracking-widest"><ShieldCheck size={14} /> Vendor Linkage Required</div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                   <label className="text-[9px] font-black text-purple-400 uppercase">Select Vendor</label>
                                   <select className="w-full bg-bg-surface border border-purple-500/20 rounded-xl px-3 py-2.5 text-[12px] outline-none text-text-primary font-bold">
                                      <option>Haryana Outdoor Media</option><option>North India Hoardings</option>
                                   </select>
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[9px] font-black text-purple-400 uppercase">Lease End Date</label>
                                   <input type="date" className="w-full bg-bg-surface border border-purple-500/20 rounded-xl px-3 py-2.5 text-[12px] outline-none text-text-primary" />
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    <div className="col-span-2 space-y-2 pt-2 border-t border-border">
                       <label className="text-[10px] font-black text-text-muted uppercase ml-1">Monthly Billing Rate (₹)</label>
                       <input type="number" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-[16px] font-black text-accent-blue outline-none" placeholder="0.00" />
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2">
                 <button onClick={() => setShowAddModal(false)} className="btn-outline px-8 py-2.5 text-[12px]">Discard</button>
                 <button onClick={() => { toast.success('Site added to database!'); setShowAddModal(false); }} className={`px-10 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest text-white shadow-xl transition-all ${newSiteType === 'owned' ? 'bg-accent-orange shadow-accent-orange/20' : 'bg-purple-600 shadow-purple-600/20'}`}>Save Site</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Sites;
