import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, Legend, ComposedChart
} from 'recharts';
import { 
  TrendingUp, Users, Target, DollarSign, 
  ArrowUpRight, ArrowDownRight, Briefcase, 
  PieChart as PieIcon, BarChart3, LineChart as LineIcon
} from 'lucide-react';
import AIInsightPanel from '../components/ai/AIInsightPanel';

const revenueData = [
  { month: 'Jan', revenue: 45, expenses: 32, profit: 13, sites: 84 },
  { month: 'Feb', monthNum: 2, revenue: 52, expenses: 35, profit: 17, sites: 92 },
  { month: 'Mar', monthNum: 3, revenue: 48, expenses: 38, profit: 10, sites: 88 },
  { month: 'Apr', monthNum: 4, revenue: 61, expenses: 42, profit: 19, sites: 105 },
  { month: 'May', monthNum: 5, revenue: 55, expenses: 40, profit: 15, sites: 114 },
  { month: 'Jun', monthNum: 6, revenue: 72, expenses: 45, profit: 27, sites: 128 },
];

const clientPerformance = [
  { name: 'Reliance', revenue: 850000, margin: 62 },
  { name: 'Axis Bank', revenue: 420000, margin: 58 },
  { name: 'Havells', revenue: 310000, margin: 55 },
  { name: 'LG', revenue: 280000, margin: 60 },
  { name: 'Others', revenue: 190000, margin: 48 },
];

const expenseBreakdown = [
  { name: 'Site Lease', value: 480000, color: '#f97316' },
  { name: 'Production', value: 120000, color: '#3b82f6' },
  { name: 'Salaries', value: 190000, color: '#22c55e' },
  { name: 'Marketing', value: 45000, color: '#a78bfa' },
  { name: 'Misc', value: 25000, color: '#6b7280' },
];

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m');

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Operational Intelligence</h1>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-widest font-black">Performance Overhaul · FY 2025-26</p>
        </div>
        <div className="flex bg-bg-surface p-1 rounded-xl border border-border shadow-lg">
          {['3m', '6m', '1y'].map((p: any) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${period === p ? 'bg-accent-orange text-white shadow-md' : 'text-text-muted hover:text-text-primary'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card border-border/40">
           <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Gross Margin Avg</div>
           <div className="text-2xl font-black text-text-primary mt-2">58.4%</div>
           <div className="flex items-center gap-1 text-[10px] text-success font-bold mt-2"><TrendingUp size={12} /> +2.4% vs LY</div>
        </div>
        <div className="card border-border/40">
           <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Customer Acquisition</div>
           <div className="text-2xl font-black text-text-primary mt-2">₹12,400</div>
           <div className="text-[10px] text-text-muted font-bold mt-2">Per Premium Lead</div>
        </div>
        <div className="card border-border/40">
           <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Revenue per Site</div>
           <div className="text-2xl font-black text-accent-blue mt-2">₹34,800</div>
           <div className="text-[10px] text-accent-blue/60 font-bold mt-2">Monthly Yield</div>
        </div>
        <div className="card bg-accent-orange/5 border-accent-orange/20">
           <div className="text-[10px] text-accent-orange font-black uppercase tracking-tighter">Vendor Cost Ratio</div>
           <div className="text-2xl font-black text-text-primary mt-2">1:4.2</div>
           <div className="text-[10px] text-text-muted font-bold mt-2">Spend vs Revenue</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {/* Profit & Site Number Trend */}
         <div className="col-span-2 card h-[400px] flex flex-col border-border/40">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Growth Matrix</h3>
                  <p className="text-[10px] text-text-muted italic">Net Profit (₹L) vs Inventory Count (Sites)</p>
               </div>
               <div className="flex gap-4 text-[9px] font-black uppercase">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-accent-orange rounded-full shadow-[0_0_8px_#f97316]"></div> Net Profit</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_#3b82f6]"></div> Total Sites</div>
               </div>
            </div>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                     <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} tickFormatter={v => `₹${v}L`} />
                     <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                     <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                     <Bar yAxisId="left" dataKey="profit" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
                     <Line yAxisId="right" type="monotone" dataKey="sites" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Expense Breakdown */}
         <div className="card h-[400px] flex flex-col border-border/40">
            <div className="mb-8">
               <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Expense Distribution</h3>
               <p className="text-[10px] text-text-muted italic">Fiscal outgoings by category</p>
            </div>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={expenseBreakdown} cx="50%" cy="40%" innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                        {expenseBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '10px' }} formatter={(v: any) => `₹${v.toLocaleString()}`} />
                     <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         {/* Client Revenue vs Margin */}
         <div className="card h-[360px] flex flex-col border-border/40">
            <div className="mb-8">
               <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Client Contribution Map</h3>
               <p className="text-[10px] text-text-muted italic">Revenue vs Average Profit Margin %</p>
            </div>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientPerformance} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#e8eaf0', fontSize: 11, fontWeight: 'bold'}} />
                     <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                     <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Occupancy Area Chart */}
         <div className="card h-[360px] flex flex-col border-border/40 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-orange to-purple-500"></div>
            <div className="mb-8">
               <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Inventory Density</h3>
               <p className="text-[10px] text-text-muted italic">Active Hoarding Occupancy (%)</p>
            </div>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                     <defs>
                        <linearGradient id="colorSites" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                     <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                     <Area type="monotone" dataKey="sites" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSites)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
