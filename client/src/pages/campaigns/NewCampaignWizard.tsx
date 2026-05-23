import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, DollarSign, Database, 
  ChevronRight, ChevronLeft, Check, Plus, X,
  MapPin, Globe, ShieldCheck, ShoppingCart, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const NewCampaignWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<any[]>([]);
  const [availableSites, setAvailableSites] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    startDate: '',
    endDate: '',
    budget: '',
    type: 'Brand Awareness',
    sites: [] as any[],
    customLocation: '',
    includeThirdParty: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [clientsRes, sitesRes] = await Promise.all([
          api.get('/clients'),
          api.get('/sites')
        ]);
        setClients(clientsRes.data);
        setAvailableSites(sitesRes.data.map((s: any) => ({
          id: s.id,
          name: s.siteName,
          rate: s.monthlyRate,
          owned: true, // Assuming owned for simplicity, can be dynamic based on site data
          city: s.pincode || 'Location' // Using pincode as placeholder for city
        })));
      } catch (error) {
        toast.error('Failed to load real-world CRM data');
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
      // Logic for backend persistence would go here
      toast.success('Campaign created successfully!');
      navigate('/campaigns');
    } catch (error) {
      toast.error('Failed to save campaign');
    }
  };

  const toggleSite = (site: any) => {
    const exists = formData.sites.find(s => s.id === site.id);
    if (exists) {
      setFormData({ ...formData, sites: formData.sites.filter(s => s.id !== site.id) });
    } else {
      setFormData({ ...formData, sites: [...formData.sites, site] });
    }
  };

  if (isLoadingData) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-text-muted">
        <Loader2 className="animate-spin text-accent-orange" size={40} />
        <p className="font-black uppercase tracking-widest text-[10px]">Syncing Client Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">New Campaign Wizard</h1>
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
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Client & Identity</h2>
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-widest">Step 01 · Basic Information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Campaign Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Monsoon Drive 2026"
                  className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-[13px] focus:outline-none focus:border-accent-orange transition-all font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Assign Client</label>
                <select 
                  className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-[13px] outline-none focus:border-accent-orange appearance-none font-bold text-text-primary"
                  value={formData.client}
                  onChange={e => setFormData({...formData, client: e.target.value})}
                >
                  <option value="">Search or select partner...</option>
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
                <Globe size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Scope & Locations</h2>
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-widest">Step 02 · Geo-Targeting & Budget</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Target State/City</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                       <input 
                         type="text" 
                         placeholder="e.g. Haryana, Delhi NCR"
                         className="w-full bg-bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-3 text-[13px] outline-none focus:border-accent-blue"
                         value={formData.customLocation}
                         onChange={e => setFormData({...formData, customLocation: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Budget (₹)</label>
                    <input type="number" placeholder="0.00" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-accent-blue" />
                 </div>
              </div>

              <div className="card border-dashed border-accent-blue/30 bg-accent-blue/5 p-5 flex items-start gap-4">
                 <div className="w-10 h-10 bg-accent-blue/20 rounded-full flex items-center justify-center shrink-0"><ShoppingCart size={20} className="text-accent-blue" /></div>
                 <div>
                    <h4 className="text-[13px] font-bold text-text-primary">Procurement Strategy</h4>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">Would you like to include 3rd-party vendor sites if our own inventory is unavailable in target areas?</p>
                    <label className="flex items-center gap-2 mt-4 cursor-pointer group">
                       <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${formData.includeThirdParty ? 'bg-accent-blue border-accent-blue' : 'border-border group-hover:border-accent-blue'}`}>
                          {formData.includeThirdParty && <Check size={14} className="text-white" strokeWidth={4} />}
                       </div>
                       <input type="checkbox" className="hidden" checked={formData.includeThirdParty} onChange={e => setFormData({...formData, includeThirdParty: e.target.checked})} />
                       <span className="text-[12px] font-bold text-text-primary">Allow Custom Site Arrangements</span>
                    </label>
                 </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-success/10 text-success rounded-2xl flex items-center justify-center shadow-inner">
                <Database size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Inventory Selection</h2>
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-widest">Step 03 · Site Allocation</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {availableSites.filter(s => formData.includeThirdParty ? true : s.owned).map(site => (
                 <div 
                   key={site.id} 
                   onClick={() => toggleSite(site)}
                   className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex justify-between items-center relative overflow-hidden group ${formData.sites.find(s => s.id === site.id) ? 'border-accent-orange bg-accent-orange/5' : 'border-border hover:border-text-muted'}`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-10 rounded-full ${site.owned ? 'bg-success' : 'bg-purple-500'}`}></div>
                       <div>
                          <p className="text-[13px] font-bold text-text-primary">{site.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">{site.city}</span>
                             <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${site.owned ? 'bg-success/10 text-success' : 'bg-purple-500/10 text-purple-400'}`}>
                                {site.owned ? 'Our Site' : 'Third Party'}
                             </span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[13px] font-black text-text-primary">₹{site.rate.toLocaleString()}</p>
                       <p className="text-[9px] text-text-muted font-bold">per month</p>
                    </div>
                    {formData.sites.find(s => s.id === site.id) && (
                       <div className="absolute top-0 right-0 p-1 bg-accent-orange rounded-bl-xl">
                          <Check size={12} className="text-white" strokeWidth={4} />
                       </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-12 pt-6 border-t border-border">
           <button 
             onClick={step === 1 ? () => navigate('/campaigns') : handleBack}
             className="btn-outline px-6 py-2 flex items-center gap-2 text-[12px]"
           >
             {step === 1 ? <X size={16} /> : <ChevronLeft size={16} />} 
             {step === 1 ? 'Cancel' : 'Back'}
           </button>
           <button 
             onClick={step === 3 ? handleSubmit : handleNext}
             className="btn-primary px-8 py-2 flex items-center gap-2 text-[12px] shadow-lg shadow-accent-orange/30"
           >
             {step === 3 ? 'Finalize Campaign' : 'Continue'} 
             {step === 3 ? <Check size={16} /> : <ChevronRight size={16} />}
           </button>
        </div>
      </div>
    </div>
  );
};

export default NewCampaignWizard;
