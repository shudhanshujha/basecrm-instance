import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Target } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down';
}

const KPICard: React.FC<KPICardProps> = ({ label, value, trend, trendType }) => {
  const getIcon = () => {
    const l = label.toLowerCase();
    if (l.includes('revenue') || l.includes('profit')) return <DollarSign size={16} className="text-accent-blue" />;
    if (l.includes('deal') || l.includes('campaign')) return <Target size={16} className="text-accent-purple" />;
    if (l.includes('outstanding')) return <Activity size={16} className="text-warning" />;
    return <BarChart3 size={16} className="text-success" />;
  };

  return (
    <div className="card group relative overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-bg-surface-2 rounded-lg border border-border">
          {getIcon()}
        </div>
        {trend && (
          <div className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
            trendType === 'up' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}>
            {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend.split(' ')[0]}
          </div>
        )}
      </div>

      <div>
        <div className="text-[11px] text-text-muted font-medium tracking-wide mb-1 uppercase">{label}</div>
        <div className="text-xl font-bold text-text-primary tracking-tight">{value}</div>
        {trend && (
           <div className="text-[11px] text-text-muted mt-1.5">
             {trend.split(' ').slice(1).join(' ')}
           </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
