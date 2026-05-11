import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down';
}

const KPICard: React.FC<KPICardProps> = ({ label, value, trend, trendType }) => {
  return (
    <div className="card">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      {trend && (
        <div className={`text-[10px] mt-2 flex items-center gap-1 font-medium ${
          trendType === 'up' ? 'text-success' : 'text-danger'
        }`}>
          {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      )}
    </div>
  );
};

export default KPICard;
