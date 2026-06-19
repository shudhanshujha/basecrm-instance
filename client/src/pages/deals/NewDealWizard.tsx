import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, DollarSign, Box, 
  ChevronRight, ChevronLeft, Check, Plus, X,
  Tag, Info, Loader2, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const NewDealWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<any[]>([]);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    startDate: '',
    endDate: '',
    value: '',
    category: 'General',
    assets: [] as any[],
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [clientsRes, assetsRes] = await Promise.all([
          api.get('/clients'),
          api.get('/assets')
        ]);
        setClients(clientsRes.data);
        setAvailableAssets(assetsRes.data.map((a: any) => ({
          id: a.id,
          name: a.name,
          category: a.category || 'General',
          status: a.status
        })));
      } catch (error) {
        toast.error('Failed to load CRM data');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      setIsLoadingData(true);
      await api.post('/deals', {
        ...formData,
        value: parseFloat(formData.value) || 0
      });
      toast.success('Deal created successfully!');
      navigate('/deals');
    } catch (error) {
      console.error('Save deal error:', error);
      toast.error('Failed to save deal. Ensure all fields are valid.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const toggleAsset = (asset: any) => {
    const exists = formData.assets.find(a => a.id === asset.id);
    if (exists) {
      setFormData({ ...formData, assets: formData.assets.filter(a => a.id !== asset.id) });
    } else {
      setFormData({ ...formData, assets: [...formData.assets, asset] });
    }
  };

  if (isLoadingData) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-text-muted">
        <Loader2 className="animate-spin text-accent-orange" size={40} />
        <p className="font-black uppercase tracking-widest text-[13px]">Syncing Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">New Deal Wizard</h1>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-12 h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-accent-orange' : 'bg-bg-surface-2'}`}></div>
          ))}
        </div>
      </div>

      <div className="card p-8 bg-bg-surface border-border/50 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-accent-orange"></div>
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-accent-orange/10 text-accent-orange rounded-2xl flex items-center justify-center shadow-inner">
                <Briefcase size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Deal Identity</h2>
                <p className="text-[14px] text-text-muted font-medium uppercase tracking-widest">Step 01 · Basic Information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Deal Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Q3 Consulting Engagement"
                  className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-[16px] focus:outline-none focus:border-accent-orange transition-all font-bold"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Assign Client</label>
                <select 
                  className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-[16px] outline-none focus:border-accent-orange appearance-none font-bold text-text-primary"
                  value={formData.clientId}
                  onChange={e => setFormData({...formData, clientId: e.target.value})}
                >
                  <option value="">Search or select client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-accent-blue/10 text-accent-blue rounded-2xl flex items-center justify-center shadow-inner">
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Timeline & Value</h2>
                <p className="text-[14px] text-text-muted font-medium uppercase tracking-widest">Step 02 · Schedule & Financials</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none focus:border-accent-blue"
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">End Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none focus:border-accent-blue"
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Category</label>
                    <input 
                      type="text" 
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none focus:border-accent-blue font-bold"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Estimated Value (₹)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none focus:border-accent-blue font-bold" 
                      value={formData.value}
                      onChange={e => setFormData({...formData, value: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Initial Notes</label>
                 <textarea 
                   rows={4}
                   className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] outline-none focus:border-accent-blue resize-none"
                   placeholder="Enter any preliminary deal notes..."
                   value={formData.notes}
                   onChange={e => setFormData({...formData, notes: e.target.value})}
                 />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-success/10 text-success rounded-2xl flex items-center justify-center shadow-inner">
                <Box size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Asset Allocation</h2>
                <p className="text-[14px] text-text-muted font-medium uppercase tracking-widest">Step 03 · Resource Assignment</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {availableAssets.length > 0 ? availableAssets.map(asset => (
                 <div 
                   key={asset.id} 
                   onClick={() => toggleAsset(asset)}
                   className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex justify-between items-center relative overflow-hidden group ${formData.assets.find(a => a.id === asset.id) ? 'border-accent-orange bg-accent-orange/5' : 'border-border hover:border-text-muted'}`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-10 rounded-full ${asset.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}></div>
                       <div>
                          <p className="text-[16px] font-bold text-text-primary uppercase">{asset.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[13px] text-text-muted font-bold uppercase tracking-tighter">{asset.category}</span>
                             <span className={`text-[11px] font-black uppercase px-1.5 py-0.5 rounded-md ${asset.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                {asset.status}
                             </span>
                          </div>
                       </div>
                    </div>
                    {formData.assets.find(a => a.id === asset.id) && (
                       <div className="p-1 bg-accent-orange rounded-full">
                          <Check size={16} className="text-white" strokeWidth={4} />
                       </div>
                    )}
                 </div>
               )) : (
                 <div className="text-center py-10 text-text-muted italic">No assets available.</div>
               )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-12 pt-6 border-t border-border">
           <button 
             onClick={step === 1 ? () => navigate('/deals') : handleBack}
             className="btn-outline px-6 py-2 flex items-center gap-2 text-[15px]"
           >
             {step === 1 ? <X size={16} /> : <ChevronLeft size={16} />} 
             {step === 1 ? 'Cancel' : 'Back'}
           </button>
           <button 
             onClick={step === 3 ? handleSubmit : handleNext}
             className="btn-primary px-8 py-2 flex items-center gap-2 text-[15px] shadow-lg shadow-accent-orange/30"
           >
             {step === 3 ? 'Finalize Deal' : 'Continue'} 
             {step === 3 ? <Check size={16} /> : <ChevronRight size={16} />}
           </button>
        </div>
      </div>
    </div>
  );
};

export default NewDealWizard;
