import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Box, 
  Clock, ArrowRight, TrendingUp, Download,
  CheckCircle2, Building, Plus, Loader2, Save, Trash2, Briefcase
} from 'lucide-react';
import KPICard from '../../components/ui/KPICard';
import ExportButton from '../../components/ui/ExportButton';
import api from '../../lib/axios';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

const DealDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dealNotes, setDealNotes] = useState('');
  
  // Milestone state
  const [milestones, setMilestones] = useState<any[]>([]);
  const [newMilestone, setNewMilestone] = useState({ label: '', date: '', status: 'upcoming' });

  useEffect(() => {
    fetchDeal();
  }, [id]);

  const fetchDeal = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/deals/${id}`);
      setDeal(res.data);
      setDealNotes(res.data.notes || '');
      setMilestones(JSON.parse(res.data.milestones || '[]'));
    } catch (error) {
      toast.error('Failed to load deal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      await api.put(`/deals/${id}`, { notes: dealNotes });
      toast.success('Deal notes updated');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMilestones = async (newMilestonesArray: any[]) => {
    try {
      setMilestones(newMilestonesArray);
      await api.put(`/deals/${id}`, { milestones: JSON.stringify(newMilestonesArray) });
      toast.success('Milestones updated');
    } catch (error) {
      toast.error('Failed to update milestones');
    }
  };

  const addMilestone = () => {
    if (!newMilestone.label || !newMilestone.date) return toast.error('Fill milestone details');
    const updated = [...milestones, { ...newMilestone, id: Date.now() }];
    handleSaveMilestones(updated);
    setNewMilestone({ label: '', date: '', status: 'upcoming' });
  };

  const removeMilestone = (milestoneId: number) => {
    const updated = milestones.filter(m => m.id !== milestoneId);
    handleSaveMilestones(updated);
  };

  const toggleMilestoneStatus = (milestoneId: number) => {
    const statusOrder = ['upcoming', 'pending', 'done'];
    const updated = milestones.map(m => {
      if (m.id === milestoneId) {
        const nextIndex = (statusOrder.indexOf(m.status) + 1) % 3;
        return { ...m, status: statusOrder[nextIndex] };
      }
      return m;
    });
    handleSaveMilestones(updated);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-orange" /></div>;
  }

  if (!deal) {
    return <div className="text-center py-20">Deal not found</div>;
  }

  const daysLeft = Math.max(0, differenceInDays(new Date(deal.endDate), new Date()));
  const dealValue = deal.value || 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/deals')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
               <Briefcase size={16} className="text-accent-blue" />
               <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">{deal.title}</h1>
               <span className={`text-[12px] font-black uppercase px-2.5 py-0.5 rounded-full text-white ${deal.status === 'ACTIVE' ? 'bg-success' : 'bg-text-muted'}`}>{deal.status}</span>
            </div>
            <p className="text-[14px] text-text-muted uppercase tracking-widest font-black mt-1">Client: {deal.client?.name} · {format(new Date(deal.startDate), 'dd MMM yyyy')} - {format(new Date(deal.endDate), 'dd MMM yyyy')}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <ExportButton 
             data={(deal.activityLogs || []).map((log: any) => ({
               'Activity ID': log.id || '',
               'Type': log.activityType || '',
               'Description': log.description || '',
               'Asset': log.asset?.name || '',
               'Date': log.timestamp ? new Date(log.timestamp).toLocaleDateString() : ''
             }))} 
             filename={`${(deal.title || 'deal').replace(/[^a-z0-9]/gi, '_')}_activities`} 
           />
           <button onClick={() => navigate('/invoices')} className="btn-primary flex items-center gap-2 text-[15px]">
             View Billing
           </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <KPICard label="Total Deal Value" value={`₹${(dealValue / 100000).toFixed(1)}L`} />
         <KPICard label="Activities Logged" value={(deal.activityLogs?.length || 0).toString()} />
         <div className="card border-border/40 flex flex-col justify-center">
            <div className="text-[13px] text-text-muted uppercase font-black tracking-widest">Invoices Generated</div>
            <div className="text-xl font-black text-text-primary mt-1">{deal.invoices?.length || 0}</div>
         </div>
         <div className="card bg-accent-blue/5 border-accent-blue/20 flex flex-col justify-center">
            <div className="text-[13px] text-accent-blue uppercase font-black tracking-widest">Time Remaining</div>
            <div className="text-2xl font-black text-text-primary mt-1">{daysLeft} Days</div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 space-y-6">
            <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
               <div className="p-4 border-b border-border bg-bg-surface-2 flex justify-between items-center">
                  <h3 className="text-[14px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                     <Box size={14} className="text-accent-orange" /> Associated Activities & Assets
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => navigate('/assets')} className="bg-bg-surface border border-border text-[12px] font-black text-accent-orange px-3 py-1 rounded-full hover:border-accent-orange transition-all uppercase tracking-tighter flex items-center gap-1.5">
                       <Plus size={12} /> Add Activity/Asset
                    </button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-bg-surface-2/30 border-b border-border text-[12px] text-text-muted uppercase font-black tracking-widest">
                           <th className="px-6 py-4">Activity / Description</th>
                           <th className="px-6 py-4">Asset Involved</th>
                           <th className="px-6 py-4 text-right">Timestamp</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {deal.activityLogs?.length > 0 ? deal.activityLogs.map((log: any, i: number) => (
                           <tr key={i} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group" onClick={() => log.assetId && navigate(`/assets/${log.assetId}`)}>
                              <td className="px-6 py-4">
                                 <div className="text-[16px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{log.activityType}</div>
                                 <div className="text-[13px] text-text-muted font-bold mt-1">{log.description}</div>
                              </td>
                              <td className="px-6 py-4 text-[14px] font-medium text-text-primary uppercase">{log.asset?.name || 'N/A'}</td>
                              <td className="px-6 py-4 text-right font-mono text-[14px] text-text-muted">
                                 {new Date(log.timestamp).toLocaleDateString()}
                              </td>
                           </tr>
                        )) : (
                          <tr><td colSpan={3} className="text-center py-10 text-text-muted text-[15px] italic">No activities recorded for this deal yet.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card">
               <h3 className="text-[16px] font-black text-text-primary uppercase tracking-widest mb-6 border-b border-border pb-3">Deal Milestones</h3>
               <div className="space-y-6">
                  {milestones.length > 0 ? milestones.map((m, i) => (
                     <div key={m.id} className="flex gap-4 relative group">
                        {i !== milestones.length - 1 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-border"></div>}
                        <button 
                          onClick={() => toggleMilestoneStatus(m.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                           m.status === 'done' ? 'bg-success border-success text-white shadow-[0_0_10px_#22c55e]' : 
                           m.status === 'pending' ? 'bg-warning border-warning text-white shadow-[0_0_10px_#eab308]' : 
                           'bg-bg-surface border-border text-text-muted'
                        }`}>
                           {m.status === 'done' && <CheckCircle2 size={14} />}
                           {m.status === 'pending' && <Clock size={14} className="animate-spin text-white" />}
                           {m.status === 'upcoming' && <div className="w-1.5 h-1.5 bg-text-muted rounded-full"></div>}
                        </button>
                        <div className="flex-1 flex justify-between items-start">
                           <div>
                             <p className="text-[15px] font-bold text-text-primary">{m.label}</p>
                             <p className="text-[13px] text-text-muted font-bold mt-0.5 uppercase">{m.date}</p>
                           </div>
                           <button onClick={() => removeMilestone(m.id)} className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                             <Trash2 size={14} />
                           </button>
                        </div>
                     </div>
                  )) : (
                    <div className="text-[14px] text-text-muted italic">No milestones defined.</div>
                  )}
               </div>

               <div className="mt-6 pt-4 border-t border-border flex gap-2">
                 <input type="text" placeholder="Task name..." className="flex-1 bg-bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-[14px] outline-none focus:border-accent-blue" value={newMilestone.label} onChange={e => setNewMilestone({...newMilestone, label: e.target.value})} />
                 <input type="date" className="bg-bg-surface-2 border border-border rounded-lg px-2 py-1.5 text-[14px] outline-none w-28" value={newMilestone.date} onChange={e => setNewMilestone({...newMilestone, date: e.target.value})} />
                 <button onClick={addMilestone} className="p-2 bg-accent-blue text-white rounded-lg"><Plus size={14} /></button>
               </div>
            </div>

            <div className="card bg-bg-surface-2 border-dashed border-border/60 flex flex-col">
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent-orange" />
                    <span className="text-[14px] font-black uppercase text-accent-orange tracking-widest">Deal Notes</span>
                  </div>
                  <button onClick={handleSaveNotes} disabled={isSaving} className="text-[13px] font-bold text-accent-blue hover:underline flex items-center gap-1">
                    {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                  </button>
               </div>
               <textarea 
                 rows={6}
                 value={dealNotes}
                 onChange={e => setDealNotes(e.target.value)}
                 className="w-full flex-1 bg-bg-surface border border-border rounded-xl p-3 text-[15px] text-text-primary resize-none outline-none focus:border-accent-orange transition-colors"
                 placeholder="Enter deal details, progress notes, or client-specific information here..."
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default DealDetails;
