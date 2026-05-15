import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Database, 
  Ruler, Lightbulb, Truck, Clock,
  Calendar, ExternalLink, Camera,
  TrendingUp, Tag, ArrowRight, Edit3, X, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const SiteDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [site, setSite] = useState<any>({
    siteName: '',
    address: '',
    city: '',
    district: '',
    state: '',
    siteType: '',
    ownershipType: '',
    widthFt: 0,
    heightFt: 0,
    monthlyRate: 0,
    status: '',
    facingSide: '',
    trafficDensity: '',
    illuminated: false,
    photos: '[]'
  });

  useEffect(() => {
    fetchSite();
  }, [id]);

  const fetchSite = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/sites/${id}`);
      setSite(res.data);
    } catch (error) {
      console.error('Failed to fetch site:', error);
      toast.error('Failed to load site information.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSite({ ...site, photos: JSON.stringify([base64String]) });
        toast.success('Site media updated locally. Save to persist changes.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/sites/${id}`, {
        siteName: site.siteName,
        address: site.address,
        widthFt: parseFloat(site.widthFt),
        heightFt: parseFloat(site.heightFt),
        facingSide: site.facingSide,
        photos: site.photos
      });
      setIsEditing(false);
      toast.success('Site information updated successfully!');
      fetchSite();
    } catch (error) {
      console.error('Failed to update site:', error);
      toast.error('Failed to save changes.');
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Loading site data...</div>;

  const bgMap: any = {
    'AVAILABLE': 'bg-success',
    'OCCUPIED': 'bg-warning',
    'MAINTENANCE': 'bg-danger'
  };

  const currentPhotos = site.photos ? JSON.parse(site.photos) : [];

  return (
    <div className="space-y-8 pb-12">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange} 
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/sites')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <input 
                  className="bg-bg-surface-2 border border-accent-orange rounded-lg px-3 py-1 text-2xl font-bold text-text-primary outline-none"
                  value={site.siteName}
                  onChange={(e) => setSite({...site, siteName: e.target.value})}
                />
              ) : (
                <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">{site.siteName}</h1>
              )}
              <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white shadow-sm ${bgMap[site.status] || 'bg-text-muted'}`}>
                {site.status}
              </span>
            </div>
            {isEditing ? (
              <input 
                className="mt-2 bg-bg-surface-2 border border-border rounded-lg px-3 py-1 text-[11px] text-text-muted outline-none w-full"
                value={site.address}
                onChange={(e) => setSite({...site, address: e.target.value})}
              />
            ) : (
              <p className="text-[11px] text-text-muted uppercase tracking-widest font-black mt-1">{site.address} · {site.city} · ID: {id?.toUpperCase()}</p>
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
               <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30"><Camera size={16} /> Update Media</button>
             </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 space-y-6">
            <div className="card h-96 bg-bg-surface-2 relative overflow-hidden flex items-center justify-center border-dashed group text-text-primary shadow-2xl">
               {currentPhotos.length > 0 ? (
                 <img src={currentPhotos[0]} className="absolute inset-0 w-full h-full object-cover" alt="Hoarding Preview" />
               ) : (
                 <div className="text-center space-y-4">
                    <Camera size={64} className="text-border mx-auto" />
                    <p className="text-[11px] text-text-muted uppercase font-black tracking-widest">No Media Uploaded</p>
                 </div>
               )}
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10 text-white">
                  <p className="font-bold text-sm">Site Photo Live Preview</p>
                  <p className="text-white/60 text-[10px] mt-1 uppercase tracking-widest font-black">Last Sync: {new Date(site.updatedAt).toLocaleString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="card bg-bg-surface border-border/40">
                  <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-4 border-b border-border pb-2">Technical Specs</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="flex items-center gap-2 text-text-muted"><Ruler size={14} /> Dimensions (W×H)</span>
                        {isEditing ? (
                          <div className="flex gap-1 items-center">
                            <input 
                              type="number"
                              className="bg-bg-surface-2 border border-border rounded px-2 py-0.5 text-right font-bold w-16 outline-none focus:border-accent-orange"
                              value={site.widthFt}
                              onChange={(e) => setSite({...site, widthFt: e.target.value})}
                            />
                            <span>×</span>
                            <input 
                              type="number"
                              className="bg-bg-surface-2 border border-border rounded px-2 py-0.5 text-right font-bold w-16 outline-none focus:border-accent-orange"
                              value={site.heightFt}
                              onChange={(e) => setSite({...site, heightFt: e.target.value})}
                            />
                            <span className="text-[10px]">ft</span>
                          </div>
                        ) : (
                          <span className="font-bold text-text-primary">{site.widthFt} × {site.heightFt} ft</span>
                        )}
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="flex items-center gap-2 text-text-muted"><Lightbulb size={14} /> Site Facing</span>
                        {isEditing ? (
                          <input 
                            className="bg-bg-surface-2 border border-border rounded px-2 py-0.5 text-right font-bold w-32 outline-none focus:border-accent-orange"
                            value={site.facingSide || ''}
                            onChange={(e) => setSite({...site, facingSide: e.target.value})}
                          />
                        ) : (
                          <span className="font-bold text-accent-orange">{site.facingSide || 'Not Set'}</span>
                        )}
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="flex items-center gap-2 text-text-muted"><Truck size={14} /> Structure</span>
                        <span className="font-bold text-text-primary uppercase">{site.ownershipType}</span>
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="flex items-center gap-2 text-text-muted"><MapPin size={14} /> Traffic Density</span>
                        <span className="font-bold text-success uppercase">{site.trafficDensity || 'MEDIUM'}</span>
                     </div>
                  </div>
               </div>

               <div className="card bg-bg-surface border-border/40">
                  <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-4 border-b border-border pb-2">Financial Status</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="text-text-muted">Inventory Type</span>
                        <span className="font-bold text-accent-blue uppercase">{site.siteType}</span>
                     </div>
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="text-text-muted">Vendor Partner</span>
                        <span className="font-bold text-text-primary">{site.vendor?.vendorName || 'DIRECT'}</span>
                     </div>
                     <div className="p-2 bg-bg-surface-2 rounded-lg mt-2 flex justify-between items-center">
                        <span className="text-[10px] text-text-muted font-bold uppercase">Monthly Billing</span>
                        <span className="text-[14px] font-black text-text-primary">₹{site.monthlyRate?.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card">
               <h3 className="text-[14px] font-bold text-text-primary mb-6 uppercase tracking-tight">Campaign History</h3>
               <div className="space-y-4">
                  {site.campaignSites && site.campaignSites.length > 0 ? (
                    site.campaignSites.map((h: any, i: number) => (
                       <div key={i} className="flex gap-3 items-start border-l-2 border-border pl-4 pb-4">
                          <div className="flex-1">
                             <p className="text-[12px] font-bold text-text-primary">Campaign Reservation</p>
                             <p className="text-[10px] text-text-muted mt-0.5">Rate: ₹{h.agreedRate?.toLocaleString()}</p>
                          </div>
                          <ArrowRight size={14} className="text-text-muted" />
                       </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-text-muted italic">No campaign bookings yet.</div>
                  )}
               </div>
               <button className="w-full mt-4 py-2 text-[11px] font-bold text-accent-blue hover:underline">View Full Logs</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SiteDetails;
