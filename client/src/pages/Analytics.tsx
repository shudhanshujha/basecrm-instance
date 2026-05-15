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

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m');

  const analyticsData: any = {
    '3m': {
      kpis: { margin: '61.2%', cac: '₹14,200', yield: '₹38,400', ratio: '1:4.8' },
      revenue: [
        { month: 'Apr', revenue: 61, expenses: 42, profit: 19, sites: 105 },
        { month: 'May', revenue: 55, expenses: 40, profit: 15, sites: 114 },
        { month: 'Jun', revenue: 72, expenses: 45, profit: 27, sites: 128 },
      ],
      clientPerformance: [
        { name: 'Reliance', revenue: 450000 },
        { name: 'Axis Bank', revenue: 210000 },
        { name: 'LG Electronics', revenue: 195000 },
      ]
    },
    '6m': {
      kpis: { margin: '58.4%', cac: '₹12,400', yield: '₹34,800', ratio: '1:4.2' },
      revenue: [
        { month: 'Jan', revenue: 45, expenses: 32, profit: 13, sites: 84 },
        { month: 'Feb', revenue: 52, expenses: 35, profit: 17, sites: 92 },
        { month: 'Mar', revenue: 48, expenses: 38, profit: 10, sites: 88 },
        { month: 'Apr', revenue: 61, expenses: 42, profit: 19, sites: 105 },
        { month: 'May', revenue: 55, expenses: 40, profit: 15, sites: 114 },
        { month: 'Jun', revenue: 72, expenses: 45, profit: 27, sites: 128 },
      ],
      clientPerformance: [
        { name: 'Reliance', revenue: 850000 },
        { name: 'Axis Bank', revenue: 420000 },
        { name: 'Havells', revenue: 310000 },
        { name: 'LG', revenue: 280000 },
        { name: 'Others', revenue: 190000 },
      ]
    },
    '1y': {
      kpis: { margin: '54.1%', cac: '₹10,800', yield: '₹31,200', ratio: '1:3.9' },
      revenue: [
        { month: 'Jul 25', revenue: 40, expenses: 30, profit: 10, sites: 70 },
        { month: 'Aug 25', revenue: 42, expenses: 31, profit: 11, sites: 75 },
        { month: 'Sep 25', revenue: 38, expenses: 29, profit: 9, sites: 72 },
        { month: 'Oct 25', revenue: 45, expenses: 32, profit: 13, sites: 80 },
        { month: 'Nov 25', revenue: 43, expenses: 33, profit: 10, sites: 82 },
        { month: 'Dec 25', revenue: 47, expenses: 34, profit: 13, sites: 84 },
        { month: 'Jan 26', revenue: 45, expenses: 32, profit: 13, sites: 84 },
        { month: 'Feb 26', revenue: 52, expenses: 35, profit: 17, sites: 92 },
        { month: 'Mar 26', revenue: 48, expenses: 38, profit: 10, sites: 88 },
        { month: 'Apr 26', revenue: 61, expenses: 42, profit: 19, sites: 105 },
        { month: 'May 26', revenue: 55, expenses: 40, profit: 15, sites: 114 },
        { month: 'Jun 26', revenue: 72, expenses: 45, profit: 27, sites: 128 },
      ],
      clientPerformance: [
        { name: 'Reliance', revenue: 1450000 },
        { name: 'Axis Bank', revenue: 980000 },
        { name: 'Havells', revenue: 750000 },
        { name: 'LG', revenue: 620000 },
        { name: 'Others', revenue: 450000 },
      ]
    }
  };

  const current = analyticsData[period];

  const expenseBreakdown = [
    { name: 'Site Lease', value: 480000, color: '#f97316' },
    { name: 'Production', value: 120000, color: '#3b82f6' },
    { name: 'Salaries', value: 190000, color: '#22c55e' },
    { name: 'Marketing', value: 45000, color: '#a78bfa' },
    { name: 'Misc', value: 25000, color: '#6b7280' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Intelligence Dashboard</h1>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-widest font-black">Performance Analytics · FY 2025-26</p>
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
           <div className="text-2xl font-black text-text-primary mt-2">{current.kpis.margin}</div>
           <div className="flex items-center gap-1 text-[10px] text-success font-bold mt-2"><TrendingUp size={12} /> Positive Trend</div>
        </div>
        <div className="card border-border/40">
           <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">CAC (Acquisition)</div>
           <div className="text-2xl font-black text-text-primary mt-2">{current.kpis.cac}</div>
           <div className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-tighter">Per Premium Lead</div>
        </div>
        <div className="card border-border/40">
           <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Avg Yield / Site</div>
           <div className="text-2xl font-black text-accent-blue mt-2">{current.kpis.yield}</div>
           <div className="text-[10px] text-accent-blue/60 font-bold mt-2 uppercase tracking-tighter">Monthly Billing</div>
        </div>
        <div className="card bg-accent-orange/5 border-accent-orange/20">
           <div className="text-[10px] text-accent-orange font-black uppercase tracking-tighter">Vendor Cost Ratio</div>
           <div className="text-2xl font-black text-text-primary mt-2">{current.kpis.ratio}</div>
           <div className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-tighter">Spend vs Revenue</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 card h-[400px] flex flex-col border-border/40 shadow-xl">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Core Growth Matrix ({period})</h3>
                  <p className="text-[10px] text-text-muted italic">Net Profit (₹L) vs Inventory Count (Sites)</p>
               </div>
               <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-accent-orange rounded-full shadow-[0_0_8px_#f97316]"></div> Net Profit</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_#3b82f6]"></div> Total Sites</div>
               </div>
            </div>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={current.revenue}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                     <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} tickFormatter={v => `₹${v}L`} />
                     <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                     <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                     <Bar yAxisId="left" dataKey="profit" fill="#f97316" radius={[4, 4, 0, 0]} barSize={period === '1y' ? 14 : 32} />
                     <Line yAxisId="right" type="monotone" dataKey="sites" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card h-[400px] flex flex-col border-border/40 shadow-xl">
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
         <div className="card h-[360px] flex flex-col border-border/40 shadow-xl">
            <div className="mb-8 font-black uppercase tracking-widest text-[11px] text-text-muted">Top Client Contribution ({period})</div>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={current.clientPerformance} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#e8eaf0', fontSize: 11, fontWeight: 'bold'}} />
                     <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                     <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card h-[360px] flex flex-col border-border/40 overflow-hidden relative shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-orange to-purple-500"></div>
            <div className="mb-8 font-black uppercase tracking-widest text-[11px] text-text-muted">Inventory Density Trend</div>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={current.revenue}>
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
