import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Tag, Box, Info,
  ArrowRight, Edit3, X, Check, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const AssetDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [asset, setAsset] = useState<any>({
    name: '',
    category: '',
    description: '',
    status: '',
    activityLogs: []
  });

  useEffect(() => {
    fetchAsset();
  }, [id]);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/assets/${id}`);
      setAsset(res.data);
    } catch (error) {
      console.error('Failed to fetch asset:', error);
      toast.error('Failed to load asset information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/assets/${id}`, {
        name: asset.name,
        category: asset.category,
        description: asset.description,
        status: asset.status
      });
      setIsEditing(false);
      toast.success('Asset information updated successfully!');
      fetchAsset();
    } catch (error) {
      console.error('Failed to update asset:', error);
      toast.error('Failed to save changes.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
      try {
        await api.delete(`/assets/${id}`);
        toast.success('Asset deleted');
        navigate('/assets');
      } catch (error) {
        console.error('Failed to delete asset:', error);
        toast.error('Failed to delete asset. It may have active dependencies.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Loading asset data...</div>;

  const bgMap: any = {
    'ACTIVE': 'bg-success',
    'INACTIVE': 'bg-text-muted',
    'RESERVED': 'bg-warning'
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/assets')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    className="bg-bg-surface-2 border border-accent-orange rounded-lg px-3 py-1 text-2xl font-bold text-text-primary outline-none"
                    value={asset.name}
                    onChange={(e) => setAsset({...asset, name: e.target.value})}
                  />
                  <select 
                    className="bg-bg-surface-2 border border-border rounded-lg px-2 py-1 text-[13px] font-black uppercase outline-none"
                    value={asset.status}
                    onChange={(e) => setAsset({...asset, status: e.target.value})}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">{asset.name}</h1>
                  <span className={`text-[12px] font-black uppercase px-2.5 py-0.5 rounded-full text-white shadow-sm ${bgMap[asset.status] || 'bg-text-muted'}`}>
                    {asset.status}
                  </span>
                </>
              )}
            </div>
            <p className="text-[14px] text-text-muted uppercase tracking-widest font-black mt-1">
              {asset.category || 'General Asset'} · ID: {id?.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           {isEditing ? (
             <>
               <button onClick={() => setIsEditing(false)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[15px]"><X size={14} /> Cancel</button>
               <button onClick={handleSave} className="btn-primary px-6 py-1.5 flex items-center gap-2 text-[15px]"><Check size={14} /> Save Changes</button>
             </>
           ) : (
             <>
               <button onClick={handleDelete} className="p-2.5 text-text-muted hover:text-danger hover:bg-danger/10 border border-border rounded-xl transition-all"><Trash2 size={18} /></button>
               <button onClick={() => setIsEditing(true)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[15px] hover:text-accent-orange"><Edit3 size={14} /> Edit Asset Info</button>
             </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
               <div className="card bg-bg-surface border-border/40">
                  <h3 className="text-[14px] font-black text-text-muted uppercase tracking-widest mb-4 border-b border-border pb-2">Asset Information</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[15px]">
                        <span className="flex items-center gap-2 text-text-muted"><Tag size={14} /> Category</span>
                        {isEditing ? (
                          <input 
                            className="bg-bg-surface-2 border border-border rounded px-2 py-0.5 text-right font-bold w-48 outline-none focus:border-accent-orange"
                            value={asset.category || ''}
                            onChange={(e) => setAsset({...asset, category: e.target.value})}
                          />
                        ) : (
                          <span className="font-bold text-accent-blue uppercase">{asset.category || 'General'}</span>
                        )}
                     </div>
                     <div className="space-y-2">
                        <span className="flex items-center gap-2 text-[15px] text-text-muted"><Info size={14} /> Description</span>
                        {isEditing ? (
                          <textarea 
                            className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none resize-none focus:border-accent-orange"
                            rows={4}
                            value={asset.description || ''}
                            onChange={(e) => setAsset({...asset, description: e.target.value})}
                          />
                        ) : (
                          <p className="text-[16px] text-text-primary bg-bg-surface-2 p-4 rounded-xl border border-border">
                            {asset.description || 'No description provided for this asset.'}
                          </p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card">
               <h3 className="text-[17px] font-bold text-text-primary mb-6 uppercase tracking-tight">Recent Activity</h3>
               <div className="space-y-4">
                  {asset.activityLogs && asset.activityLogs.length > 0 ? (
                    asset.activityLogs.map((log: any, i: number) => (
                       <div key={i} className="flex gap-3 items-start border-l-2 border-border pl-4 pb-4">
                          <div className="flex-1">
                             <p className="text-[15px] font-bold text-text-primary">{log.activityType}</p>
                             <p className="text-[13px] text-text-muted mt-0.5">{log.description}</p>
                             <p className="text-[12px] text-text-muted mt-1 italic">{new Date(log.timestamp).toLocaleDateString()}</p>
                          </div>
                          <ArrowRight size={14} className="text-text-muted" />
                       </div>
                    ))
                  ) : (
                    <div className="text-[14px] text-text-muted italic">No activity recorded yet.</div>
                  )}
               </div>
               <button 
                 onClick={() => navigate('/analytics')}
                 className="w-full mt-4 py-2 text-[14px] font-bold text-accent-blue hover:underline"
               >
                 View Full Analytics
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AssetDetails;
