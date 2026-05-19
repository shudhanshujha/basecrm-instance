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
import { Plus, ExternalLink, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [revenueRange, setRevenueRange] = useState<'1m' | '3m' | '6m' | '1y'>('6m');
  const [breakdownType, setBreakdownType] = useState<'client' | 'campaign' | 'site'>('client');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    revenue: [],
    breakdown: [],
    kpis: { revenue: '—', campaigns: '—', outstanding: '—', profit: '—' },
    invoices: []
  });

  React.useEffect(() => {
    fetchDashboardData();
  }, [revenueRange, breakdownType]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/analytics/dashboard', {
        params: { range: revenueRange, breakdown: breakdownType }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Could not load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const kpis = stats.kpis || { revenue: '—', campaigns: '—', outstanding: '—', profit: '—' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Executive Dashboard</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">May 2026 · Operations Pan-India</p>
        </div>
        <div className="flex gap-2">
          <ExportButton 
            data={stats.invoices || []} 
            filename="dashboard_invoice_snapshot" 
          />
          <button onClick={() => navigate('/campaigns/new')} className="btn-primary text-[12px] py-1.5 flex items-center gap-2">
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Monthly Revenue" value={kpis.revenue} trend="↑ 12% vs Apr" trendType="up" />
        <KPICard label="Active Campaigns" value={kpis.campaigns} trend="↑ 3 new" trendType="up" />
        <KPICard label="Outstanding" value={kpis.outstanding} trend="↓ 3 overdue" trendType="down" />
        <KPICard label="Gross Profit" value={kpis.profit} trend="↑ 60.3% margin" trendType="up" />
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
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/60 rounded-xl z-10">
                <Loader2 size={20} className="animate-spin text-accent-orange" />
              </div>
            )}
            {!isLoading && stats.revenue?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-muted text-[11px] italic">No invoice data yet for this period</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} tickFormatter={(val) => `₹${val}L`} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} formatter={(v: any) => [`₹${v}L`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} barSize={revenueRange === '1y' ? 12 : 36} />
                </BarChart>
              </ResponsiveContainer>
            )}
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
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/60 rounded-xl z-10">
                <Loader2 size={20} className="animate-spin text-accent-orange" />
              </div>
            )}
            {!isLoading && stats.breakdown?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-muted text-[11px] italic">No data for this breakdown</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.breakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                    {(stats.breakdown || []).map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px' }} formatter={(value: any) => `₹${value.toLocaleString()}`} />
                  <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingLeft: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
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
                 {stats.invoices?.length > 0 ? stats.invoices.map((row: any, i: number) => (
                   <tr key={i} className="hover:bg-bg-surface-2 transition-colors cursor-pointer group" onClick={() => navigate(`/invoices/${row.id}`)}>
                      <td className="px-4 py-4">
                         <div className="text-[12px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{row.client?.name}</div>
                         <div className="text-[10px] text-text-muted mt-0.5">{row.campaignName || 'General Campaign'} · {new Date(row.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                      </td>
                      <td className="px-4 py-4 text-[11px] font-mono text-text-muted tracking-widest uppercase">{row.invoiceNumber}</td>
                      <td className="px-4 py-4 text-[13px] font-black text-text-primary">₹{row.totalAmount?.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">
                         <span className={`status-tag ${row.status === 'PAID' ? 'bg-success' : row.status === 'OVERDUE' ? 'bg-danger' : 'bg-warning'}`}>{row.status}</span>
                      </td>
                   </tr>
                 )) : (
                   <tr><td colSpan={4} className="py-8 text-center text-text-muted text-[11px] uppercase font-bold">No recent invoices</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
