import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, 
  Clock, ArrowRight, TrendingUp, Download,
  CheckCircle2, Building, Plus, Loader2, Save, Trash2
} from 'lucide-react';
import KPICard from '../../components/ui/KPICard';
import ExportButton from '../../components/ui/ExportButton';
import api from '../../lib/axios';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

const CampaignDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [roiNotes, setRoiNotes] = useState('');
  
  // Milestone state
  const [milestones, setMilestones] = useState<any[]>([]);
  const [newMilestone, setNewMilestone] = useState({ label: '', date: '', status: 'upcoming' });

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/campaigns/${id}`);
      setCampaign(res.data);
      setRoiNotes(res.data.roiNotes || '');
      setMilestones(JSON.parse(res.data.milestones || '[]'));
    } catch (error) {
      toast.error('Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoi = async () => {
    try {
      setIsSaving(true);
      await api.put(`/campaigns/${id}`, { roiNotes });
      toast.success('Contractor ROI notes updated');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMilestones = async (newMilestonesArray: any[]) => {
    try {
      setMilestones(newMilestonesArray);
      await api.put(`/campaigns/${id}`, { milestones: JSON.stringify(newMilestonesArray) });
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

  if (!campaign) {
    return <div className="text-center py-20">Campaign not found</div>;
  }

  const daysLeft = Math.max(0, differenceInDays(new Date(campaign.endDate), new Date()));
  const totalBudget = campaign.totalBudget || 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/campaigns')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
               <Building size={16} className="text-accent-blue" />
               <h1 className="text-2xl font-bold text-text-primary">{campaign.campaignName}</h1>
               <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white ${campaign.status === 'ACTIVE' ? 'bg-success' : 'bg-text-muted'}`}>{campaign.status}</span>
            </div>
            <p className="text-[11px] text-text-muted uppercase tracking-widest font-black mt-1">Partner: {campaign.client?.name} · {format(new Date(campaign.startDate), 'dd MMM yyyy')} - {format(new Date(campaign.endDate), 'dd MMM yyyy')}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <ExportButton 
             data={(campaign.campaignSites || []).map((cs: any) => ({
               'Site ID': cs.site?.id || '',
               'Site Name': cs.site?.siteName || '',
               'Location': `${cs.site?.city}, ${cs.site?.state}`,
               'Site Type': cs.site?.siteType || '',
               'Agreed Rate': cs.agreedRate,
               'Mounting Status': cs.mounted ? 'Mounted' : 'Pending',
               'Start Date': cs.startDate ? new Date(cs.startDate).toLocaleDateString() : '',
               'End Date': cs.endDate ? new Date(cs.endDate).toLocaleDateString() : ''
             }))} 
             filename={`${(campaign.campaignName || 'campaign').replace(/[^a-z0-9]/gi, '_')}_sites`} 
           />
           <button onClick={() => navigate('/invoices')} className="btn-primary flex items-center gap-2 text-[12px]">
             View Billing
           </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <KPICard label="Total Contract Value" value={`₹${(totalBudget / 100000).toFixed(1)}L`} />
         <KPICard label="Sites Reserved" value={(campaign.campaignSites?.length || 0).toString()} />
         <div className="card border-border/40 flex flex-col justify-center">
            <div className="text-[10px] text-text-muted uppercase font-black tracking-widest">Invoices Generated</div>
            <div className="text-xl font-black text-text-primary mt-1">{campaign.invoices?.length || 0}</div>
         </div>
         <div className="card bg-accent-blue/5 border-accent-blue/20 flex flex-col justify-center">
            <div className="text-[10px] text-accent-blue uppercase font-black tracking-widest">Time Remaining</div>
            <div className="text-2xl font-black text-text-primary mt-1">{daysLeft} Days</div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 space-y-6">
            <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
               <div className="p-4 border-b border-border bg-bg-surface-2 flex justify-between items-center">
                  <h3 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                     <MapPin size={14} className="text-accent-orange" /> Allocated Site Locations
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => navigate('/sites')} className="bg-bg-surface border border-border text-[9px] font-black text-accent-orange px-3 py-1 rounded-full hover:border-accent-orange transition-all uppercase tracking-tighter flex items-center gap-1.5">
                       <Plus size={12} /> Add Site to Campaign
                    </button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-bg-surface-2/30 border-b border-border text-[9px] text-text-muted uppercase font-black tracking-widest">
                           <th className="px-6 py-4">Hoarding Identification / Location</th>
                           <th className="px-6 py-4">Specs</th>
                           <th className="px-6 py-4">Rate</th>
                           <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {campaign.campaignSites?.length > 0 ? campaign.campaignSites.map((cs: any, i: number) => (
                           <tr key={i} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group" onClick={() => navigate(`/sites/${cs.siteId}`)}>
                              <td className="px-6 py-4">
                                 <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{cs.site?.siteName}</div>
                                 <div className="text-[10px] text-text-muted font-bold uppercase tracking-tighter mt-1">{cs.site?.city}, {cs.site?.state}</div>
                              </td>
                              <td className="px-6 py-4 text-[11px] font-medium text-text-primary">{cs.site?.siteType}</td>
                              <td className="px-6 py-4 font-mono text-[11px] font-black text-accent-blue">₹{cs.agreedRate?.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-text-primary">
                                    <div className={`w-1.5 h-1.5 rounded-full ${cs.mounted ? 'bg-success shadow-[0_0_8px_#22c55e]' : 'bg-warning shadow-[0_0_8px_#eab308]'}`}></div>
                                    {cs.mounted ? 'Mounted' : 'Pending'}
                                 </div>
                              </td>
                           </tr>
                        )) : (
                          <tr><td colSpan={4} className="text-center py-10 text-text-muted text-[12px] italic">No sites allocated to this campaign yet.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card">
               <h3 className="text-[13px] font-black text-text-primary uppercase tracking-widest mb-6 border-b border-border pb-3">Dynamic Milestones</h3>
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
                             <p className="text-[12px] font-bold text-text-primary">{m.label}</p>
                             <p className="text-[10px] text-text-muted font-bold mt-0.5 uppercase">{m.date}</p>
                           </div>
                           <button onClick={() => removeMilestone(m.id)} className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                             <Trash2 size={14} />
                           </button>
                        </div>
                     </div>
                  )) : (
                    <div className="text-[11px] text-text-muted italic">No milestones defined.</div>
                  )}
               </div>

               <div className="mt-6 pt-4 border-t border-border flex gap-2">
                 <input type="text" placeholder="Task name..." className="flex-1 bg-bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-[11px] outline-none focus:border-accent-blue" value={newMilestone.label} onChange={e => setNewMilestone({...newMilestone, label: e.target.value})} />
                 <input type="date" className="bg-bg-surface-2 border border-border rounded-lg px-2 py-1.5 text-[11px] outline-none w-28" value={newMilestone.date} onChange={e => setNewMilestone({...newMilestone, date: e.target.value})} />
                 <button onClick={addMilestone} className="p-2 bg-accent-blue text-white rounded-lg"><Plus size={14} /></button>
               </div>
            </div>

            <div className="card bg-bg-surface-2 border-dashed border-border/60 flex flex-col">
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent-orange" />
                    <span className="text-[11px] font-black uppercase text-accent-orange tracking-widest">Contractual ROI Notes</span>
                  </div>
                  <button onClick={handleSaveRoi} disabled={isSaving} className="text-[10px] font-bold text-accent-blue hover:underline flex items-center gap-1">
                    {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                  </button>
               </div>
               <textarea 
                 rows={6}
                 value={roiNotes}
                 onChange={e => setRoiNotes(e.target.value)}
                 className="w-full flex-1 bg-bg-surface border border-border rounded-xl p-3 text-[12px] text-text-primary resize-none outline-none focus:border-accent-orange transition-colors"
                 placeholder="Enter ROI details, contractual obligations, or client-specific notes here..."
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

