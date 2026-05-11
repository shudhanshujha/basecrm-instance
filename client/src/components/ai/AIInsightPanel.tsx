import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIInsightPanelProps {
  insight: string;
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight }) => {
  return (
    <div className="bg-gradient-to-br from-[rgba(124,58,237,0.1)] to-[rgba(59,130,246,0.08)] border border-[rgba(124,58,237,0.2)] rounded-[10px] p-4 flex gap-3 items-start mb-6">
      <div className="bg-[rgba(124,58,237,0.2)] text-purple-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0 mt-0.5">
        <Sparkles size={10} />
        AI
      </div>
      <div className="text-[13px] text-text-primary leading-relaxed italic">
        {insight}
      </div>
    </div>
  );
};

export default AIInsightPanel;
