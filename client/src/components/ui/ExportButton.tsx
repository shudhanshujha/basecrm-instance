import React, { useState, useRef, useEffect } from 'react';
import { FileDown, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { exportToCSV, exportToExcel } from '../../lib/export';

interface ExportButtonProps {
  data: any[];
  filename: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn-outline text-[12px] py-1.5 flex items-center gap-2 hover:border-accent-orange transition-colors"
      >
        <FileDown size={14} /> Export Data <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <button 
            onClick={() => { exportToCSV(data, filename); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-text-primary hover:bg-bg-surface-2 transition-colors border-b border-border"
          >
            <FileText size={14} className="text-accent-blue" /> Export as CSV
          </button>
          <button 
            onClick={() => { exportToExcel(data, filename); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-text-primary hover:bg-bg-surface-2 transition-colors"
          >
            <FileSpreadsheet size={14} className="text-success" /> Export as Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
