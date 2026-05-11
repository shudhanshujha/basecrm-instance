import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, MapPin, 
  Target, BarChart3, Clock, ArrowRight,
  TrendingUp, DollarSign, Download, Database,
  CheckCircle2, Building, ExternalLink, Plus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import KPICard from '../../components/ui/KPICard';

const data = [
  { day: 'Day 1', reach: 12000, interactions: 450 },
  { day: 'Day 5', reach: 45000, interactions: 1200 },
  { day: 'Day 10', reach: 89000, interactions: 2800 },
  { day: 'Day 15', reach: 145000, interactions: 4100 },
  { day: 'Day 20', reach: 210000, interactions: 5900 },
];

const CampaignDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const campaign = {
    name: 'Haryana Roads Q2',
    client: 'Reliance Retail Ltd',
    budget: '₹42,50,000',
    spent: '₹12,80,000',
    sitesCount: 12,
    start: '01 Apr 2026',
    end: '30 Jun 2026',
    status: 'Active',
    locations: [
      { name: 'GT Road Panipat KM 87', city: 'Panipat', state: 'Haryana', type: 'Unipole', status: 'Live', owned: true, rate: '₹28k' },
      { name: 'Sector 12 Karnal Stand', city: 'Karnal', state: 'Haryana', type: 'Gantry', status: 'Live', owned: true, rate: '₹22k' },
      { name: 'NH-44 Ambala Flyover', city: 'Ambala', state: 'Haryana', type: 'Billboard', status: 'Maintenance', owned: false, rate: '₹45k' },
      { name: 'Railway Road Kurukshetra', city: 'Kurukshetra', state: 'Haryana', type: 'Flex', status: 'Live', owned: true, rate: '₹12k' },
      { name: 'Connaught Place Circle', city: 'Delhi', state: 'Delhi', type: 'Digital', status: 'Live', owned: false, rate: '₹150k' },
    ]
  };

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
               <h1 className="text-2xl font-bold text-text-primary">{campaign.name}</h1>
            </div>
            <p className="text-[11px] text-text-muted uppercase tracking-widest font-black mt-1">Partner: {campaign.client} · {campaign.start} - {campaign.end}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="btn-outline flex items-center gap-2 text-[12px]">
             <Download size={16} /> Performance Report
           </button>
           <button onClick={() => navigate('/invoices')} className="btn-primary flex items-center gap-2 text-[12px]">
             View Billing
           </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <KPICard label="Total Contract" value={campaign.budget} />
         <KPICard label="Invoiced Amount" value={campaign.spent} trend="30.1% Billed" trendType="up" />
         <KPICard label="Site Allocation" value={campaign.sitesCount.toString()} trend="Across 5 Cities" trendType="up" />
         <div className="card bg-accent-blue/5 border-accent-blue/20 flex flex-col justify-center">
            <div className="text-[10px] text-accent-blue uppercase font-black tracking-widest">Time Remaining</div>
            <div className="text-2xl font-black text-text-primary mt-1">52 Days</div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 space-y-6">
            <div className="card h-[340px] flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[12px] font-bold text-text-primary uppercase tracking-wider">Campaign Engagement Trend</h3>
                  <div className="flex gap-3 text-[9px] font-black uppercase tracking-tighter">
                     <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-accent-orange rounded-full shadow-[0_0_8px_#f97316]"></div> Reach</div>
                     <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_#3b82f6]"></div> Impressions</div>
                  </div>
               </div>
               <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                        <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="reach" stroke="#f97316" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="interactions" stroke="#3b82f6" strokeWidth={3} dot={false} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
               <div className="p-4 border-b border-border bg-bg-surface-2 flex justify-between items-center">
                  <h3 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                     <MapPin size={14} className="text-accent-orange" /> Allocated Site Locations
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => navigate('/sites')} className="bg-bg-surface border border-border text-[9px] font-black text-accent-orange px-3 py-1 rounded-full hover:border-accent-orange transition-all uppercase tracking-tighter flex items-center gap-1.5">
                       <Plus size={12} /> Add Site to Campaign
                    </button>
                    <span className="bg-bg-surface text-[10px] font-bold text-accent-blue px-3 py-1 rounded-full border border-border">{campaign.locations.length} Sites Reserved</span>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-bg-surface-2/30 border-b border-border text-[9px] text-text-muted uppercase font-black tracking-widest">
                           <th className="px-6 py-4">Hoarding Identification / Location</th>
                           <th className="px-6 py-4">Specs</th>
                           <th className="px-6 py-4">Procurement</th>
                           <th className="px-6 py-4">Rate</th>
                           <th className="px-6 py-4 text-right">Activity</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {campaign.locations.map((loc, i) => (
                           <tr key={i} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                              <td className="px-6 py-4">
                                 <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{loc.name}</div>
                                 <div className="text-[10px] text-text-muted font-bold uppercase tracking-tighter mt-1">{loc.city}, {loc.state}</div>
                              </td>
                              <td className="px-6 py-4 text-[11px] font-medium text-text-primary">{loc.type}</td>
                              <td className="px-6 py-4">
                                 <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${loc.owned ? 'border-success/30 text-success bg-success/5' : 'border-purple-500/30 text-purple-400 bg-purple-500/5'}`}>
                                    {loc.owned ? 'Internal' : 'External'}
                                 </span>
                              </td>
                              <td className="px-6 py-4 font-mono text-[11px] font-black text-accent-blue">{loc.rate}</td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-text-primary">
                                    <div className={`w-1.5 h-1.5 rounded-full ${loc.status === 'Live' ? 'bg-success shadow-[0_0_8px_#22c55e]' : 'bg-warning shadow-[0_0_8px_#eab308]'}`}></div>
                                    {loc.status}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="card">
               <h3 className="text-[13px] font-black text-text-primary uppercase tracking-widest mb-6 border-b border-border pb-3">Milestone Progress</h3>
               <div className="space-y-6">
                  {[
                     { label: 'Client Approvals', date: 'Mar 15', status: 'done' },
                     { label: 'Vendor Procurement', date: 'Mar 25', status: 'done' },
                     { label: 'Site Execution', date: 'Apr 01', status: 'done' },
                     { label: 'Monthly Performance Audit', date: 'May 15', status: 'pending' },
                     { label: 'Campaign Wrap', date: 'Jun 30', status: 'upcoming' },
                  ].map((m, i) => (
                     <div key={i} className="flex gap-4 relative">
                        {i !== 4 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-border"></div>}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                           m.status === 'done' ? 'bg-success border-success text-white shadow-[0_0_10px_#22c55e]' : 
                           m.status === 'pending' ? 'bg-warning border-warning text-white shadow-[0_0_10px_#eab308]' : 
                           'bg-bg-surface border-border text-text-muted'
                        }`}>
                           {m.status === 'done' && <CheckCircle2 size={14} />}
                           {m.status === 'pending' && <Clock size={14} className="animate-spin text-white" />}
                           {m.status === 'upcoming' && <div className="w-1.5 h-1.5 bg-text-muted rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                           <p className="text-[12px] font-bold text-text-primary">{m.label}</p>
                           <p className="text-[10px] text-text-muted font-bold mt-0.5 uppercase">{m.date}, 2026</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="card bg-bg-surface-2 border-dashed border-border/60">
               <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={18} className="text-accent-orange" />
                  <span className="text-[11px] font-black uppercase text-accent-orange tracking-widest">Contractual ROI</span>
               </div>
               <p className="text-[12px] text-text-primary font-medium leading-relaxed italic">The client has requested <span className="text-accent-blue font-bold">Pan-India coverage</span>. Current site allocation is tracking at <span className="text-success font-black">100% capacity</span> vs request.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
