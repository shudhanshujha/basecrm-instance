import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Users, 
  Box, CreditCard, ArrowRight,
  Plus, Calendar, BarChart3, Loader2, Target, Activity, FileText
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('6m');
  const [breakdownType, setBreakdownType] = useState<'client' | 'deal' | 'asset'>('client');

  useEffect(() => {
    fetchDashboardStats();
  }, [period, breakdownType]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/analytics/dashboard', { 
        params: { range: period, breakdown: breakdownType } 
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#6e8efb', '#8b7fe8', '#4caf82', '#e05c6e', '#c9934a'];

  if (isLoading && !stats) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-accent-blue" size={32} />
        <p className="text-[13px] text-text-muted">Loading dashboard...</p>
      </div>
    );
  }

  const kpis = stats?.kpis || { revenue: '—', deals: '—', outstanding: '—', profit: '—' };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-1.5 h-1.5 bg-success rounded-full" />
             <p className="text-[12px] text-text-muted">Live · Updated now</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/deals/new')} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> New Deal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <KPICard label="Revenue" value={kpis.revenue} trend={kpis.revenueTrend} trendType={kpis.revenueTrendType} />
        <KPICard label="Active Deals" value={kpis.deals} trend={kpis.dealsTrend} trendType={kpis.dealsTrendType} />
        <KPICard label="Outstanding" value={kpis.outstanding} trend={kpis.outstandingTrend} trendType={kpis.outstandingTrendType} />
        <KPICard label="Net Profit" value={kpis.profit} trend={kpis.profitTrend} trendType={kpis.profitTrendType} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card relative">
          {isLoading && <div className="absolute inset-0 bg-bg-surface/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl"><Loader2 className="animate-spin text-accent-blue" size={22} /></div>}
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-[14px] font-semibold text-text-primary">Revenue Overview</h3>
               <p className="text-[12px] text-text-muted mt-0.5">Monthly · INR Lakhs</p>
            </div>
            <div className="flex bg-bg-surface-2 p-1 rounded-lg border border-border">
              {['1m', '3m', '6m', '1y'].map((r) => (
                <button 
                  key={r} 
                  onClick={() => setPeriod(r as any)}
                  className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${period === r ? 'bg-accent-blue text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenue || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6e8efb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6e8efb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} dx={-10} />
                <Tooltip 
                  cursor={{stroke: 'rgba(110, 142, 251, 0.15)', strokeWidth: 1}}
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6e8efb" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col relative">
          {isLoading && <div className="absolute inset-0 bg-bg-surface/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl"><Loader2 className="animate-spin text-accent-blue" size={22} /></div>}
          <h3 className="text-[14px] font-semibold text-text-primary mb-5">Performance Breakdown</h3>
          <div className="flex-1 flex flex-col gap-5">
             <div className="flex bg-bg-surface-2 p-1 rounded-lg border border-border">
                {['client', 'asset', 'deal'].map((type) => (
                   <button 
                     key={type} 
                     onClick={() => setBreakdownType(type as any)}
                     className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-all capitalize ${breakdownType === type ? 'bg-accent-blue text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
                   >
                     {type}
                   </button>
                ))}
             </div>
             <div className="h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={stats?.performanceMix || []}
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                         {(stats?.performanceMix || []).map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '13px' }}
                         itemStyle={{ color: 'var(--color-text-primary)' }}
                      />
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-[11px] text-text-muted capitalize">{breakdownType}</span>
                    <span className="text-lg font-bold text-text-primary mt-0.5">{stats?.performanceMix?.length || 0}</span>
                </div>
             </div>
             <div className="space-y-1.5 mt-auto overflow-y-auto max-h-[110px] pr-1">
                {(stats?.performanceMix || []).map((item: any, idx: number) => (
                   <div key={idx} className="flex justify-between items-center px-3 py-2 bg-bg-surface-2 rounded-lg hover:bg-border/40 transition-all">
                      <div className="flex items-center gap-2.5">
                         <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-[12px] text-text-primary truncate max-w-[120px]">{item.name}</span>
                       </div>
                       <span className="text-[12px] text-text-muted">₹{(item.value / 100000).toFixed(1)}L</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2.5">
             <div className="p-1.5 bg-accent-blue/10 text-accent-blue rounded-lg">
                <FileText size={14} />
             </div>
             <h3 className="text-[14px] font-semibold text-text-primary">Recent Invoices</h3>
          </div>
          <button onClick={() => navigate('/invoices')} className="text-[12px] text-text-muted flex items-center gap-1.5 hover:text-text-primary transition-colors">View all <ArrowRight size={12} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] text-text-muted uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Invoice</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {stats?.invoices?.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-bg-surface-2 transition-all cursor-pointer group" onClick={() => navigate(`/invoices/${inv.id}`)}>
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-semibold text-text-primary group-hover:text-accent-blue transition-colors">#{inv.invoiceNumber}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-1">
                       <Calendar size={10} /> {new Date(inv.invoiceDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] text-text-primary">{inv.client?.name}</div>
                    <div className="text-[12px] text-text-muted mt-0.5">{inv.deal?.title || 'General Billing'}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-[14px] font-semibold text-text-primary">₹{inv.totalAmount?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                       inv.status === 'PAID' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-warning/10 text-warning border-warning/20'
                     }`}>
                        {inv.status}
                     </span>
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
