import React, { useState } from 'react';
import KPICard from '../components/ui/KPICard';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import ExportButton from '../components/ui/ExportButton';
import { Plus, ArrowRight, ExternalLink, Filter } from 'lucide-react';

const data6m = [
  { name: 'Dec', revenue: 12.5 }, { name: 'Jan', revenue: 14.8 }, { name: 'Feb', revenue: 13.2 }, { name: 'Mar', revenue: 16.5 }, { name: 'Apr', revenue: 15.9 }, { name: 'May', revenue: 18.4 },
];

const data3m = data6m.slice(-3);
const data1m = [{ name: 'Week 1', revenue: 4.2 }, { name: 'Week 2', revenue: 5.1 }, { name: 'Week 3', revenue: 3.9 }, { name: 'Week 4', revenue: 5.2 }];
const data1y = [...data6m, ...data6m];

const clientData = [
  { name: 'Reliance Retail', value: 320000, color: '#f97316' },
  { name: 'Axis Bank', value: 180000, color: '#3b82f6' },
  { name: 'Havells India', value: 90000, color: '#22c55e' },
  { name: 'Others', value: 45000, color: '#a78bfa' },
];

const siteData = [
  { name: 'Panipat GT Rd', value: 150000, color: '#f97316' },
  { name: 'Karnal Stand', value: 120000, color: '#3b82f6' },
  { name: 'Ambala NH44', value: 200000, color: '#22c55e' },
  { name: 'Other Sites', value: 165000, color: '#a78bfa' },
];

const campaignData = [
  { name: 'Roads Q2', value: 280000, color: '#f97316' },
  { name: 'ATM May', value: 140000, color: '#3b82f6' },
  { name: 'Summer Push', value: 215000, color: '#22c55e' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [revenueRange, setRevenueRange] = React.useState<'1m' | '3m' | '6m' | '1y'>('6m');
  const [breakdownType, setBreakdownType] = React.useState<'client' | 'site' | 'campaign'>('client');
  
  const currentRevenueData = revenueRange === '1m' ? data1m : revenueRange === '3m' ? data3m : revenueRange === '1y' ? data1y : data6m;

  const currentChartData = breakdownType === 'client' ? clientData : 
                           breakdownType === 'site' ? siteData : 
                           campaignData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Executive Dashboard</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">May 2026 · Operations Pan-India</p>
        </div>
        <div className="flex gap-2">
          <ExportButton 
            data={[{ Metric: 'Revenue', Value: '₹18.4L' }, { Metric: 'Profit', Value: '₹11.1L' }]} 
            filename="dashboard_snapshot" 
          />
          <button onClick={() => navigate('/campaigns/new')} className="btn-primary text-[12px] py-1.5 flex items-center gap-2">
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Monthly Revenue" value="₹18.4L" trend="↑ 12% vs Apr" trendType="up" />
        <KPICard label="Active Campaigns" value="24" trend="↑ 3 new" trendType="up" />
        <KPICard label="Outstanding" value="₹6.2L" trend="↓ 3 overdue" trendType="down" />
        <KPICard label="Gross Profit" value="₹11.1L" trend="↑ 60.3% margin" trendType="up" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card h-[340px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-[12px] font-bold text-text-primary uppercase tracking-wider">Revenue Trend</h3>
               <p className="text-[10px] text-text-muted mt-0.5">Growth analytics</p>
            </div>
            <div className="flex bg-bg-surface-2 p-1 rounded-lg border border-border scale-90">
               {['1m', '3m', '6m', '1y'].map((range) => (
                 <button key={range} onClick={() => setRevenueRange(range as any)} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${revenueRange === range ? 'bg-accent-orange text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>{range}</button>
               ))}
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} tickFormatter={(val) => `₹${val}L`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} barSize={revenueRange === '1y' ? 12 : 36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card h-[340px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[12px] font-bold text-text-primary uppercase tracking-wider">Market Share</h3>
             <div className="flex bg-bg-surface-2 p-1 rounded-lg border border-border scale-90">
               {['client', 'site', 'campaign'].map((type) => (
                 <button key={type} onClick={() => setBreakdownType(type as any)} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${breakdownType === type ? 'bg-accent-orange text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>{type}</button>
               ))}
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={currentChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                  {currentChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px' }} formatter={(value: any) => `₹${value.toLocaleString()}`} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingLeft: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-border/50">
        <div className="p-4 border-b border-border bg-bg-surface-2 flex justify-between items-center">
          <h3 className="text-[12px] font-black text-text-primary uppercase tracking-widest">Recent Invoices · Real-time Ledger</h3>
          <button onClick={() => navigate('/invoices')} className="text-[10px] font-bold text-accent-blue flex items-center gap-1 hover:underline">View All Ledger <ExternalLink size={12} /></button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-bg-surface-2/50 border-b border-border text-[10px] text-text-muted uppercase font-black tracking-tighter">
                    <th className="px-4 py-3">Client / Campaign</th>
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {[
                   { client: 'Reliance Retail Ltd', campaign: 'Haryana Roads Q2', inv: 'INV-2026-0041', date: '10 May', amount: '₹3,20,000', status: 'Paid', bg: 'bg-success' },
                   { client: 'Axis Bank Ltd', campaign: 'ATM Network May', inv: 'INV-2026-0039', date: '08 May', amount: '₹1,80,000', status: 'Pending', bg: 'bg-warning' },
                   { client: 'Havells India', campaign: 'Summer Push', inv: 'INV-2026-0037', date: '05 May', amount: '₹90,000', status: 'Overdue', bg: 'bg-danger' },
                 ].map((row, i) => (
                   <tr key={i} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group">
                      <td className="px-4 py-4">
                         <div className="text-[12px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{row.client}</div>
                         <div className="text-[10px] text-text-muted mt-0.5">{row.campaign} · {row.date}</div>
                      </td>
                      <td className="px-4 py-4 text-[11px] font-mono text-text-muted tracking-widest uppercase">{row.inv}</td>
                      <td className="px-4 py-4 text-[13px] font-black text-text-primary">{row.amount}</td>
                      <td className="px-4 py-4 text-right">
                         <span className={`status-tag ${row.bg}`}>{row.status}</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
