import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Database, 
  Ruler, Lightbulb, Truck, Clock,
  Calendar, ExternalLink, Camera,
  TrendingUp, Tag, ArrowRight, Edit3, X, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const SiteDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [site, setSite] = useState({
    name: 'GT Road, Panipat KM 87',
    location: 'Panipat, Haryana',
    type: 'Unipole',
    size: '20 × 10 ft',
    ownership: 'Owned',
    rate: '₹28,000',
    status: 'Occupied',
    bg: 'bg-success',
    illuminated: 'Yes (LED)',
    facing: 'North-East',
    traffic: 'Very High',
    currentCampaign: 'Haryana Roads Q2',
    client: 'Reliance Retail Ltd'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Site information updated successfully!');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/sites')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <input 
                  className="bg-bg-surface-2 border border-accent-orange rounded-lg px-3 py-1 text-2xl font-bold text-text-primary outline-none"
                  value={site.name}
                  onChange={(e) => setSite({...site, name: e.target.value})}
                />
              ) : (
                <h1 className="text-2xl font-bold text-text-primary">{site.name}</h1>
              )}
              <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white shadow-sm ${site.bg}`}>
                {site.status}
              </span>
            </div>
            {isEditing ? (
              <input 
                className="mt-2 bg-bg-surface-2 border border-border rounded-lg px-3 py-1 text-[11px] text-text-muted outline-none w-full"
                value={site.location}
                onChange={(e) => setSite({...site, location: e.target.value})}
              />
            ) : (
              <p className="text-[11px] text-text-muted uppercase tracking-widest font-black mt-1">{site.location} · Site ID: {id?.toUpperCase()}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
           {isEditing ? (
             <>
               <button onClick={() => setIsEditing(false)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[12px]"><X size={14} /> Cancel</button>
               <button onClick={handleSave} className="btn-primary px-6 py-1.5 flex items-center gap-2 text-[12px]"><Check size={14} /> Save Changes</button>
             </>
           ) : (
             <>
               <button onClick={() => setIsEditing(true)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[12px] hover:text-accent-orange"><Edit3 size={14} /> Edit Site Info</button>
               <button className="btn-primary text-[12px] py-1.5 flex items-center gap-2"><Camera size={16} /> Update Media</button>
             </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 space-y-6">
            <div className="card h-80 bg-bg-surface-2 relative overflow-hidden flex items-center justify-center border-dashed group">
               <img 
                 src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=1470&auto=format&fit=crop" 
                 className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity" 
                 alt="Hoarding Site"
               />
               <div className="relative z-10 text-center">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                     <Camera className="text-white" size={24} />
                  </div>
                  <p className="text-white font-bold text-sm">Site Photo Live Preview</p>
                  <p className="text-white/60 text-[10px] mt-1 uppercase tracking-widest">Last updated: 02 May, 2026</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="card bg-bg-surface border-border/40">
                  <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-4 border-b border-border pb-2">Technical Specs</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="flex items-center gap-2 text-text-muted"><Ruler size={14} /> Dimensions</span>
                        {isEditing ? (
                          <input 
                            className="bg-bg-surface-2 border border-border rounded px-2 py-0.5 text-right font-bold w-24 outline-none focus:border-accent-orange"
                            value={site.size}
                            onChange={(e) => setSite({...site, size: e.target.value})}
                          />
                        ) : (
                          <span className="font-bold text-text-primary">{site.size}</span>
                        )}
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="flex items-center gap-2 text-text-muted"><Lightbulb size={14} /> Illumination</span>
                        <span className="font-bold text-accent-orange">{site.illuminated}</span>
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="flex items-center gap-2 text-text-muted"><Truck size={14} /> Structure</span>
                        <span className="font-bold text-text-primary">{site.ownership}</span>
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="flex items-center gap-2 text-text-muted"><MapPin size={14} /> Traffic Density</span>
                        <span className="font-bold text-success">{site.traffic}</span>
                     </div>
                  </div>
               </div>

               <div className="card bg-bg-surface border-border/40">
                  <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-4 border-b border-border pb-2">Occupancy Status</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="text-text-muted">Campaign</span>
                        <span className="font-bold text-accent-blue">{site.currentCampaign}</span>
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="text-text-muted">Client</span>
                        <span className="font-bold text-text-primary">{site.client}</span>
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="text-text-muted">Period</span>
                        <span className="font-bold text-text-primary">Apr 01 - Jun 30</span>
                     </div>
                     <div className="p-2 bg-bg-surface-2 rounded-lg mt-2 flex justify-between items-center">
                        <span className="text-[10px] text-text-muted font-bold">Monthly Yield</span>
                        <span className="text-[14px] font-black text-text-primary">{site.rate}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card">
               <h3 className="text-[14px] font-bold text-text-primary mb-6">Booking History</h3>
               <div className="space-y-4">
                  {[
                     { campaign: 'Winter Launch', date: 'Jan 2026', client: 'Havells' },
                     { campaign: 'Diwali Special', date: 'Oct 2025', client: 'Reliance' },
                     { campaign: 'Independence Day', date: 'Aug 2025', client: 'Axis Bank' }
                  ].map((h, i) => (
                     <div key={i} className="flex gap-3 items-start border-l-2 border-border pl-4 pb-4">
                        <div className="flex-1">
                           <p className="text-[12px] font-bold text-text-primary">{h.campaign}</p>
                           <p className="text-[10px] text-text-muted mt-0.5">{h.client} · {h.date}</p>
                        </div>
                        <ArrowRight size={14} className="text-text-muted" />
                     </div>
                  ))}
               </div>
               <button className="w-full mt-4 py-2 text-[11px] font-bold text-accent-blue hover:underline">View Lifetime Records</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SiteDetails;
