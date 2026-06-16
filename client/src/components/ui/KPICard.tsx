import React from 'react';
import { TrendingUp, TrendingDown, Zap, BarChart3, Activity, Target } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down';
}

const KPICard: React.FC<KPICardProps> = ({ label, value, trend, trendType }) => {
  const getIcon = () => {
    const l = label.toLowerCase();
    if (l.includes('revenue') || l.includes('profit')) return <Zap size={20} className="text-accent-orange animate-pulse" />;
    if (l.includes('deal') || l.includes('campaign')) return <Target size={20} className="text-accent-blue" />;
    if (l.includes('outstanding')) return <Activity size={20} className="text-danger" />;
    return <BarChart3 size={20} className="text-success" />;
  };

  const getGlow = () => {
    const l = label.toLowerCase();
    if (l.includes('revenue')) return 'shadow-[0_0_15px_rgba(255,107,0,0.2)] border-accent-orange/20';
    if (l.includes('deal')) return 'shadow-[0_0_15px_rgba(0,242,255,0.2)] border-accent-blue/20';
    if (l.includes('outstanding')) return 'shadow-[0_0_15px_rgba(255,0,85,0.2)] border-danger/20';
    return 'shadow-[0_0_15px_rgba(0,255,136,0.2)] border-success/20';
  };

  return (
    <div className={`card group relative overflow-hidden ${getGlow()}`}>
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-inner">
          {getIcon()}
        </div>
        {trend && (
          <div className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter flex items-center gap-1 ${
            trendType === 'up' ? 'bg-success/10 text-success glow-green' : 'bg-danger/10 text-danger glow-red'
          }`}>
            {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend.split(' ')[0]}
          </div>
        )}
      </div>

      <div>
        <div className="text-[10px] text-text-muted uppercase font-black tracking-[2px] mb-1 opacity-70 group-hover:text-text-primary transition-colors">{label}</div>
        <div className="text-2xl font-black text-white tracking-tight group-hover:translate-x-1 transition-transform duration-300">{value}</div>
        {trend && (
           <div className="text-[8px] text-text-muted mt-2 font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
             {trend.split(' ').slice(1).join(' ')}
           </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
