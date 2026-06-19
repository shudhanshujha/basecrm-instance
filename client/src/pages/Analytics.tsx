import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, Legend, ComposedChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import ExportButton from '../components/ui/ExportButton';

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a78bfa', '#ec4899', '#6b7280'];

const EmptyChart: React.FC<{ message?: string }> = ({ message = 'No data yet for this period' }) => (
  <div className="h-full flex items-center justify-center text-text-muted text-[11px] italic">{message}</div>
);

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [mainAnalytics, setMainAnalytics] = useState<any>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;
      const [dashRes, analyticsRes] = await Promise.all([
        api.get('/analytics/dashboard', { params: { range: period, breakdown: 'client' } }),
        api.get('/analytics'),
      ]);
      setData(dashRes.data);
      setMainAnalytics(analyticsRes.data);
    } catch (err) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [period]);

  // Derived analytics KPIs from real data
  const revTrend = data?.revenue || [];
  const totalRev = revTrend.reduce((s: number, m: any) => s + (m.revenue || 0), 0);
  const totalExp = revTrend.reduce((s: number, m: any) => s + (m.expenses || 0), 0);
  const totalProfit = totalRev - totalExp;
  const marginPct = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : '—';
  const avgYield = revTrend.length > 0 ? (totalRev / revTrend.length).toFixed(2) : '0';

  // Expense breakdown from main analytics
  const plReport = mainAnalytics?.plReport;
  const gstReport = mainAnalytics?.gstReport;

  const expBreakdown = plReport ? [
    { name: 'Vendor Payouts', value: plReport.expenses?.direct || 0, color: '#f97316' },
    { name: 'Indirect Expenses', value: plReport.expenses?.indirect || 0, color: '#3b82f6' },
  ].filter(e => e.value > 0) : [];

  const tooltip = { contentStyle: { backgroundColor: '#181c27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '10px' } };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Intelligence Dashboard</h1>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-widest font-black">
            Live Performance Analytics · {period === '3m' ? 'Last 3 Months' : period === '6m' ? 'Last 6 Months' : 'Last 12 Months'}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <ExportButton data={revTrend} filename={`financial_report_${period}`} />
          <div className="flex bg-bg-surface p-1 rounded-xl border border-border shadow-lg">
            {(['3m', '6m', '1y'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-semibold uppercase transition-all ${period === p ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(88,166,255,0.3)]' : 'text-text-muted hover:text-text-primary'}`}
              >{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card border-border/40">
          <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Gross Margin</div>
          <div className="text-2xl font-black text-text-primary mt-2">{loading ? '—' : `${marginPct}%`}</div>
          <div className="flex items-center gap-1 text-[10px] text-success font-bold mt-2"><TrendingUp size={12} /> Revenue / Expenses</div>
        </div>
        <div className="card border-border/40">
          <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Total Revenue ({period})</div>
          <div className="text-2xl font-black text-text-primary mt-2">{loading ? '—' : `₹${totalRev.toFixed(2)}L`}</div>
          <div className="text-[10px] text-text-muted font-bold mt-2 uppercase">Invoiced in period</div>
        </div>
        <div className="card border-border/40">
          <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Avg Monthly Revenue</div>
          <div className="text-2xl font-black text-accent-blue mt-2">{loading ? '—' : `₹${avgYield}L`}</div>
          <div className="text-[10px] text-accent-blue/60 font-bold mt-2 uppercase">Per Month</div>
        </div>
        <div className="card bg-accent-purple/5 border-accent-purple/20">
          <div className="text-[10px] text-accent-purple font-semibold uppercase tracking-tighter">Net Profit ({period})</div>
          <div className={`text-2xl font-bold mt-2 ${totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
            {loading ? '—' : `₹${totalProfit.toFixed(2)}L`}
          </div>
          <div className="flex items-center gap-1 text-[10px] mt-2">
            {totalProfit >= 0
              ? <><TrendingUp size={12} className="text-success" /><span className="text-success font-bold">Profitable</span></>
              : <><TrendingDown size={12} className="text-danger" /><span className="text-danger font-bold">Loss</span></>}
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card h-[400px] flex flex-col border-border/40 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Revenue vs Expenses ({period})</h3>
              <p className="text-[10px] text-text-muted italic">Monthly breakdown in Lakhs (₹L)</p>
            </div>
            <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_#58a6ff]"></div> Revenue</div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_#3b82f6]"></div> Expenses</div>
            </div>
          </div>
          <div className="flex-1 relative">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/60 z-10 rounded-xl"><Loader2 size={20} className="animate-spin text-accent-blue" /></div>}
            {!loading && revTrend.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} tickFormatter={v => `₹${v}L`} />
                  <Tooltip {...tooltip} formatter={(v: any, name: any) => [`₹${v}L`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]} />
                  <Bar dataKey="revenue" fill="#f97316" radius={[4,4,0,0]} barSize={period === '1y' ? 14 : 32} />
                  <Bar dataKey="expenses" fill="#3b82f6" radius={[4,4,0,0]} barSize={period === '1y' ? 14 : 32} opacity={0.7} />
                  <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card h-[400px] flex flex-col border-border/40 shadow-xl">
          <div className="mb-8">
            <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Expense Distribution</h3>
            <p className="text-[10px] text-text-muted italic">Vendor payouts vs indirect costs</p>
          </div>
          <div className="flex-1 relative">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/60 z-10 rounded-xl"><Loader2 size={20} className="animate-spin text-accent-blue" /></div>}
            {!loading && expBreakdown.length === 0 ? <EmptyChart message="No expense data yet" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expBreakdown} cx="50%" cy="40%" innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                    {expBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip {...tooltip} formatter={(v: any) => `₹${Number(v).toLocaleString('en-IN')}`} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card h-[360px] flex flex-col border-border/40 shadow-xl">
          <div className="mb-8 font-black uppercase tracking-widest text-[11px] text-text-muted">
            Top Client Revenue ({period})
          </div>
          <div className="flex-1 relative">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/60 z-10 rounded-xl"><Loader2 size={20} className="animate-spin text-accent-blue" /></div>}
            {!loading && (data?.breakdown || []).length === 0 ? <EmptyChart message="No client invoice data yet" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.breakdown || []} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#e8eaf0', fontSize: 11, fontWeight: 'bold'}} width={90} />
                  <Tooltip {...tooltip} formatter={(v: any) => `₹${Number(v).toLocaleString('en-IN')}`} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {(data?.breakdown || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card h-[360px] flex flex-col border-border/40 overflow-hidden relative shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue to-accent-purple"></div>
          <div className="mb-8 font-black uppercase tracking-widest text-[11px] text-text-muted">
            GST Collected vs Paid (All-time)
          </div>
          <div className="flex-1 relative">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/60 z-10 rounded-xl"><Loader2 size={20} className="animate-spin text-accent-blue" /></div>}
            {!loading && !gstReport ? <EmptyChart message="No GST data yet" /> : (() => {
              const gstData = [
                { name: 'CGST', collected: gstReport?.collected?.cgst || 0, paid: gstReport?.paid?.cgst || 0, balance: gstReport?.balance?.cgst || 0 },
                { name: 'SGST', collected: gstReport?.collected?.sgst || 0, paid: gstReport?.paid?.sgst || 0, balance: gstReport?.balance?.sgst || 0 },
                { name: 'IGST', collected: gstReport?.collected?.igst || 0, paid: gstReport?.paid?.igst || 0, balance: gstReport?.balance?.igst || 0 },
              ];
              return (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gstData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} tickFormatter={(v: any) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip {...tooltip} formatter={(v: any) => `₹${Number(v).toLocaleString('en-IN')}`} />
                    <Bar dataKey="collected" fill="#22c55e" radius={[4,4,0,0]} barSize={28} name="Collected" />
                    <Bar dataKey="paid" fill="#f97316" radius={[4,4,0,0]} barSize={28} name="Input Credit" opacity={0.7} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Revenue Area Chart */}
      <div className="card h-[300px] flex flex-col border-border/40 shadow-xl">
        <div className="mb-6">
          <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-tighter">Profit Trend ({period})</h3>
          <p className="text-[10px] text-text-muted italic">Net profit per month in Lakhs</p>
        </div>
        <div className="flex-1 relative">
          {loading && <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/60 z-10 rounded-xl"><Loader2 size={20} className="animate-spin text-accent-orange" /></div>}
          {!loading && revTrend.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revTrend}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} tickFormatter={v => `₹${v}L`} />
                <Tooltip {...tooltip} formatter={(v: any) => [`₹${v}L`, 'Net Profit']} />
                <Area type="monotone" dataKey="profit" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
