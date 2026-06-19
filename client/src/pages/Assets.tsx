import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Database, 
  Table, Download, Upload, Info, ExternalLink,
  ChevronRight, ArrowRight, X, LayoutGrid, List,
  Loader2, Trash2, Tag, Box
} from 'lucide-react';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const Assets: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/assets');
      setAssets(res.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/assets/${id}`);
        toast.success('Asset deleted');
        fetchAssets();
      } catch (error) {
        console.error('Failed to delete asset:', error);
        toast.error('Failed to delete asset. It may have active dependencies.');
      }
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/assets/${id}/status`, { status: newStatus.toUpperCase() });
      toast.success(`Status updated to ${newStatus}`);
      fetchAssets();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBg = (status: string) => {
    const bgMap: any = { 
      'ACTIVE': 'bg-success', 
      'INACTIVE': 'bg-text-muted', 
      'RESERVED': 'bg-warning' 
    };
    return bgMap[status?.toUpperCase()] || 'bg-text-muted';
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await api.post('/assets', {
        ...data,
        status: 'ACTIVE'
      });
      toast.success('Asset added successfully');
      setShowAddModal(false);
      fetchAssets();
    } catch (error) {
      console.error('Save asset error:', error);
      toast.error('Failed to save asset');
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = (a.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (a.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || a.status === filterStatus.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Business Assets</h1>
          <p className="text-[14px] text-text-muted mt-1 uppercase font-black tracking-widest">Asset Inventory · Resource Management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-[15px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Plus size={16} /> Add New Asset
          </button>
        </div>
      </div>

      <div className="card space-y-4 border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['All', 'Active', 'Inactive', 'Reserved'].map(t => (
              <button 
                key={t}
                onClick={() => setFilterStatus(t)}
                className={`text-[14px] font-bold px-4 py-1.5 rounded-lg border transition-all ${filterStatus === t ? 'bg-accent-orange text-white border-accent-orange shadow-lg' : 'bg-bg-surface-2 text-text-muted border-border hover:text-text-primary'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex bg-bg-surface-2 p-1 rounded-lg border border-border">
            <button onClick={() => setView('table')} className={`p-1.5 rounded-md transition-all ${view === 'table' ? 'bg-bg-surface text-accent-orange shadow-sm' : 'text-text-muted'}`}><List size={16} /></button>
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-bg-surface text-accent-orange shadow-sm' : 'text-text-muted'}`}><LayoutGrid size={16} /></button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[15px] focus:outline-none focus:border-accent-orange transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ExportButton data={assets} filename="business_assets" />
        </div>
      </div>

      {view === 'table' ? (
        <div className="card p-0 border-border/50 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface-2 border-b border-border text-[13px] font-black text-text-muted uppercase tracking-widest">
                <th className="px-4 py-3 rounded-tl-xl">Asset Details</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-accent-orange" /></td></tr>
              ) : filteredAssets.map((asset) => (
                <tr key={asset.id} onClick={() => navigate(`/assets/${asset.id}`)} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                  <td className="px-4 py-4">
                    <div className="text-[16px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{asset.name}</div>
                    <div className="text-[13px] text-text-muted mt-0.5 font-bold uppercase tracking-tighter">ID: {asset.id.split('-')[0]}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-[14px] font-bold text-text-primary uppercase">
                       <Tag size={12} className="text-accent-blue" /> {asset.category || 'General'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[14px] text-text-muted line-clamp-1">{asset.description || 'No description'}</div>
                  </td>
                  <td className="px-4 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <div className="relative group/status inline-block text-left" onClick={(e) => e.stopPropagation()}>
                           <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full text-white cursor-pointer ${getStatusBg(asset.status)}`} style={{ fontSize: '11px', lineHeight: '12px' }}>
                             {asset.status}
                           </span>
                           <div className="absolute hidden group-hover/status:flex flex-col gap-1 bg-bg-surface border border-border p-2 rounded-lg shadow-2xl z-[100] top-full right-0 mt-1 min-w-[120px]">
                              {['ACTIVE', 'INACTIVE', 'RESERVED'].map(s => (
                                 <button key={s} onClick={() => updateStatus(asset.id, s)} className="text-[12px] text-left hover:text-accent-orange text-text-primary font-bold py-1.5 uppercase transition-colors" style={{ fontSize: '12px' }}>{s}</button>
                              ))}
                           </div>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(e, asset.id, asset.name)}
                          className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-lg transition-all"
                          title="Delete Asset"
                        >
                          <Trash2 size={14} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredAssets.map(asset => (
            <div key={asset.id} onClick={() => navigate(`/assets/${asset.id}`)} className="card bg-bg-surface hover:border-accent-orange transition-all cursor-pointer group flex flex-col p-4 relative shadow-lg border-border/50">
               <div className="flex justify-between items-start">
                  <h3 className="text-[17px] font-bold text-text-primary group-hover:text-accent-orange transition-colors line-clamp-1 uppercase">{asset.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${asset.status === 'RESERVED' ? 'bg-warning shadow-[0_0_8px_#eab308]' : asset.status === 'ACTIVE' ? 'bg-success shadow-[0_0_8px_#22c55e]' : 'bg-danger shadow-[0_0_8px_#ef4444]'}`}></div>
               </div>
               <div className="flex items-center gap-1.5 text-[13px] text-text-muted mt-1 uppercase font-bold tracking-widest">
                  <Tag size={10} /> {asset.category || 'General'}
               </div>
               <div className="mt-2 relative group/status inline-block" onClick={(e) => e.stopPropagation()}>
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full text-white cursor-pointer ${getStatusBg(asset.status)}`} style={{ fontSize: '10px', lineHeight: '10px' }}>
                    {asset.status}
                  </span>
                  <div className="absolute hidden group-hover/status:flex flex-col gap-1 bg-bg-surface border border-border p-2 rounded-lg shadow-2xl z-[100] top-full left-0 mt-1 min-w-[120px]">
                     {['ACTIVE', 'INACTIVE', 'RESERVED'].map(s => (
                        <button key={s} onClick={() => updateStatus(asset.id, s)} className="text-[12px] text-left hover:text-accent-orange text-text-primary font-bold py-1.5 uppercase transition-colors" style={{ fontSize: '12px' }}>{s}</button>
                     ))}
                  </div>
               </div>
               <div className="mt-3 text-[14px] text-text-muted line-clamp-2 min-h-[32px]">
                  {asset.description || 'No description provided for this asset.'}
               </div>
               <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={(e) => handleDelete(e, asset.id, asset.name)}
                       className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-lg transition-all"
                       title="Delete Asset"
                     >
                       <Trash2 size={12} />
                     </button>
                     <div className="p-1.5 bg-bg-surface-2 rounded-lg text-text-muted group-hover:text-accent-orange transition-colors border border-border"><ArrowRight size={12} /></div>
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
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-tighter">Add New Asset</h2>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-surface border border-transparent hover:border-border rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveAsset}>
              <div className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase ml-1">Asset Name</label>
                    <input name="name" type="text" required className="w-full bg-bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-[16px] outline-none font-bold focus:border-accent-orange" placeholder="e.g. Premium Package, Dedicated Server, etc." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase ml-1">Category</label>
                    <input name="category" type="text" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none" placeholder="e.g. Service, Hardware, Software" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase ml-1">Description</label>
                    <textarea name="description" rows={3} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none resize-none" placeholder="Enter asset details..."></textarea>
                 </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-surface-2 rounded-b-2xl">
                 <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline px-8 py-2.5 text-[15px]">Discard</button>
                 <button type="submit" className="px-10 py-2.5 rounded-xl text-[15px] font-black uppercase tracking-widest text-white shadow-xl bg-accent-orange shadow-accent-orange/20 transition-all">Save Asset</button>
              </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
