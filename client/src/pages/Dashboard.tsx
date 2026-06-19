import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Users, 
  Box, CreditCard, ArrowRight,
  Plus, Calendar, BarChart3, Loader2, Zap, Target, Activity, FileText
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

  const COLORS = ['#7000ff', '#00f2ff', '#00ff88', '#ff0055', '#ffaa00'];

  if (isLoading && !stats) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent-blue" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[4px] text-accent-blue animate-pulse">Initializing Interface...</p>
      </div>
    );
  }

  const kpis = stats?.kpis || { revenue: '—', deals: '—', outstanding: '—', profit: '—' };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Executive Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_#00ff88]" />
             <p className="text-[9px] text-text-muted uppercase font-black tracking-[3px]">Global Operations Stream · Live</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/deals/new')} className="btn-primary flex items-center gap-2 px-6">
            <Plus size={16} /> Launch New Deal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <KPICard label="Fiscal Revenue" value={kpis.revenue} trend={kpis.revenueTrend} trendType={kpis.revenueTrendType} />
        <KPICard label="Operational Deals" value={kpis.deals} trend={kpis.dealsTrend} trendType={kpis.dealsTrendType} />
        <KPICard label="Outstanding Credit" value={kpis.outstanding} trend={kpis.outstandingTrend} trendType={kpis.outstandingTrendType} />
        <KPICard label="Net Profit Margin" value={kpis.profit} trend={kpis.profitTrend} trendType={kpis.profitTrendType} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 card border-accent-blue/10 bg-bg-surface/40 relative">
          {isLoading && <div className="absolute inset-0 bg-bg-surface/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-3xl"><Loader2 className="animate-spin text-accent-blue" /></div>}
          <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[3px]">Revenue Projection</h3>
               <p className="text-[9px] text-text-muted uppercase mt-1">Metric: INR Lakhs · Frequency: Monthly</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {['1m', '3m', '6m', '1y'].map((r) => (
                <button 
                  key={r} 
                  onClick={() => setPeriod(r as any)}
                  className={`px-4 py-1 text-[9px] font-semibold uppercase rounded-lg transition-all ${period === r ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(88,166,255,0.3)]' : 'text-text-muted hover:text-text-primary'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenue || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 900}} dx={-15} />
                <Tooltip 
                  cursor={{stroke: 'rgba(0, 242, 255, 0.2)', strokeWidth: 2}}
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid rgba(0, 242, 255, 0.2)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00f2ff" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card border-accent-purple/10 bg-bg-surface/40 flex flex-col relative">
          {isLoading && <div className="absolute inset-0 bg-bg-surface/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-3xl"><Loader2 className="animate-spin text-accent-purple" /></div>}
          <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[3px] mb-8">Performance Mix</h3>
          <div className="flex-1 flex flex-col gap-6">
             <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {['client', 'asset', 'deal'].map((type) => (
                   <button 
                     key={type} 
                     onClick={() => setBreakdownType(type as any)}
                     className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${breakdownType === type ? 'bg-accent-purple text-white shadow-[0_0_15px_rgba(112,0,255,0.3)]' : 'text-text-muted hover:text-text-primary'}`}
                   >
                     {type}
                   </button>
                ))}
             </div>
             <div className="h-[240px] relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={stats?.performanceMix || []}
                        innerRadius={75}
                        outerRadius={95}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                         {(stats?.performanceMix || []).map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid rgba(112, 0, 255, 0.2)', borderRadius: '12px' }}
                         itemStyle={{ color: 'var(--color-text-primary)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                      />
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{breakdownType}</span>
                    <span className="text-xl font-black text-text-primary tracking-tighter mt-1">{stats?.performanceMix?.length || 0} Entities</span>
                </div>
             </div>
             <div className="space-y-2 mt-auto overflow-y-auto max-h-[120px] custom-scrollbar pr-2">
                {(stats?.performanceMix || []).map((item: any, idx: number) => (
                   <div key={idx} className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-[10px] font-black text-text-primary uppercase tracking-wider truncate max-w-[120px]">{item.name}</span>
                       </div>
                       <span className="text-[11px] font-black text-text-muted italic">₹{(item.value / 100000).toFixed(1)}L</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-white/5 bg-bg-surface/30">
        <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-accent-blue/10 text-accent-blue rounded-lg">
                <FileText size={18} />
             </div>
             <h3 className="text-[12px] font-black text-text-primary uppercase tracking-[3px]">Stream: Recent Transactions</h3>
          </div>
          <button onClick={() => navigate('/invoices')} className="text-[10px] font-black text-accent-blue flex items-center gap-2 hover:gap-4 transition-all tracking-widest">VISUALIZE ALL <ArrowRight size={14} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[9px] text-text-muted uppercase font-black tracking-[2px]">
                <th className="px-8 py-5">Invoice Node</th>
                <th className="px-8 py-5">System Entity</th>
                <th className="px-8 py-5 text-right">Value (INR)</th>
                <th className="px-8 py-5 text-right">Node Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats?.invoices?.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-all cursor-pointer group" onClick={() => navigate(`/invoices/${inv.id}`)}>
                  <td className="px-8 py-6">
                    <div className="text-[13px] font-black text-text-primary group-hover:text-accent-blue transition-colors tracking-tight">#{inv.invoiceNumber}</div>
                    <div className="flex items-center gap-2 text-[9px] text-text-muted mt-2 font-bold uppercase tracking-widest">
                       <Calendar size={12} className="text-accent-blue" /> {new Date(inv.invoiceDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[13px] font-bold text-text-primary uppercase tracking-tighter">{inv.client?.name}</div>
                    <div className="text-[10px] text-text-muted mt-1 font-medium">{inv.deal?.title || 'General System Billing'}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-[14px] font-black text-text-primary">₹{inv.totalAmount?.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg border shadow-inner ${
                       inv.status === 'PAID' 
                        ? 'bg-success/10 text-success border-success/30 glow-green' 
                        : 'bg-warning/10 text-warning border-warning/30 glow-yellow'
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
