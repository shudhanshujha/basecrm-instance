import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Briefcase, CreditCard, 
  CheckCircle2, Clock, AlertCircle,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'DEAL' | 'INVOICE' | 'PAYMENT';
  title: string;
  status: string;
  value: number;
  date: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'DEAL': return <Briefcase size={16} />;
      case 'INVOICE': return <FileText size={16} />;
      case 'PAYMENT': return <CreditCard size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'DEAL': return 'bg-accent-blue text-accent-blue';
      case 'INVOICE': return 'bg-accent-orange text-accent-orange';
      case 'PAYMENT': return 'bg-success text-success';
      default: return 'bg-text-muted text-text-muted';
    }
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:via-white/5 before:to-transparent">
      {activities.map((activity, idx) => (
        <motion.div 
          key={activity.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="relative flex items-start gap-8 group"
        >
          {/* Timeline Dot & Icon */}
          <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 shadow-2xl transition-all group-hover:scale-110 ${getColor(activity.type).split(' ')[0]} bg-opacity-10 ${getColor(activity.type).split(' ')[1]}`}>
            {getIcon(activity.type)}
          </div>

          {/* Content Card */}
          <div className="flex-1 bg-white/5 border border-white/5 p-5 rounded-2xl group-hover:border-white/10 transition-all">
            <div className="flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black uppercase tracking-[2px] opacity-40">{activity.type}</span>
                     <span className="text-[9px] font-black uppercase tracking-[2px] opacity-40">·</span>
                     <span className="text-[9px] font-black uppercase tracking-[2px] opacity-40">{format(new Date(activity.date), 'dd MMM yyyy')}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-white mt-1 tracking-tight">{activity.title}</h4>
               </div>
               <div className="text-right">
                  <div className="text-[14px] font-black text-white">₹{activity.value.toLocaleString()}</div>
                  <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded mt-2 inline-block ${
                    activity.status === 'PAID' || activity.status === 'WON' || activity.status === 'COMPLETED'
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-warning/10 text-warning border border-warning/20'
                  }`}>
                    {activity.status}
                  </div>
               </div>
            </div>
            
            <div className="mt-4 flex justify-end">
               <button className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white flex items-center gap-2 transition-all">
                  Inspect Node <ArrowRight size={12} />
               </button>
            </div>
          </div>
        </motion.div>
      ))}

      {activities.length === 0 && (
        <div className="py-10 text-center text-text-muted italic text-[12px]">
          No activity logs found for this system entity.
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;