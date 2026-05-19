import React, { useState, useRef, useEffect } from 'react';
import { FileDown, FileSpreadsheet, FileText, ChevronDown, File, Calendar } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../../lib/export';
import { format, subDays, isAfter, startOfYear } from 'date-fns';

interface ExportButtonProps {
  data: any[];
  filename: string;
}

type TimeRange = 'all' | '30d' | '90d' | '6m' | 'ytd';

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
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

  const getFilteredData = () => {
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item.date || item.invoiceDate || item.createdAt || item.paymentDate || now);
      switch (timeRange) {
        case '30d': return isAfter(itemDate, subDays(now, 30));
        case '90d': return isAfter(itemDate, subDays(now, 90));
        case '6m': return isAfter(itemDate, subDays(now, 180));
        case 'ytd': return isAfter(itemDate, startOfYear(now));
        default: return true;
      }
    });
  };

  const dataMapper = (rawData: any[]) => {
    return rawData.map(item => {
      const flattened: Record<string, any> = {};
      
      // ENTITY-SPECIFIC MAPPING (Professional Auditor Grade)
      if (filename.includes('inventory')) {
        flattened['SITE NAME'] = item.siteName || 'N/A';
        flattened['LOCATION'] = item.city || 'N/A';
        flattened['STATE'] = item.state || 'N/A';
        flattened['FACING'] = item.facingSide || 'N/A';
        flattened['TYPE'] = item.siteType || 'N/A';
        flattened['WIDTH (FT)'] = item.widthFt || 0;
        flattened['HEIGHT (FT)'] = item.heightFt || 0;
        flattened['AREA (SQFT)'] = (item.widthFt || 0) * (item.heightFt || 0);
        flattened['RATE (MONTHLY)'] = item.monthlyRate || 0;
        flattened['OWNERSHIP'] = item.ownershipType || 'N/A';
        flattened['VENDOR'] = item.vendor?.vendorName || 'DIRECT';
        flattened['STATUS'] = item.status || 'N/A';
        flattened['LEASE START'] = item.leaseStartDate ? format(new Date(item.leaseStartDate), 'dd MMM yyyy') : 'N/A';
        flattened['LEASE END'] = item.leaseEndDate ? format(new Date(item.leaseEndDate), 'dd MMM yyyy') : 'N/A';
        return flattened;
      }

      if (filename.includes('invoice')) {
        flattened['INVOICE NO'] = item.invoiceNumber || 'N/A';
        flattened['CLIENT'] = item.client?.name || 'N/A';
        flattened['GSTIN'] = item.client?.gstin || 'N/A';
        flattened['DATE'] = item.invoiceDate ? format(new Date(item.invoiceDate), 'dd MMM yyyy') : 'N/A';
        flattened['DUE DATE'] = item.dueDate ? format(new Date(item.dueDate), 'dd MMM yyyy') : 'N/A';
        flattened['TAXABLE AMOUNT'] = item.taxableAmount || 0;
        flattened['CGST'] = item.cgstAmount || 0;
        flattened['SGST'] = item.sgstAmount || 0;
        flattened['IGST'] = item.igstAmount || 0;
        flattened['TOTAL'] = item.totalAmount || 0;
        flattened['STATUS'] = item.status || 'N/A';
        flattened['PAYMENT REF'] = item.referenceNumber || 'N/A';
        return flattened;
      }

      if (filename.includes('ledger')) {
        flattened['DATE'] = (item.paymentDate || item.date) ? format(new Date(item.paymentDate || item.date), 'dd MMM yyyy') : 'N/A';
        flattened['ENTITY'] = item.client?.name || item.vendor?.vendorName || item.client || item.vendor || 'N/A';
        flattened['REFERENCE'] = item.invoice?.invoiceNumber || item.referenceNumber || item.inv || 'N/A';
        flattened['MODE'] = item.paymentMode || item.method || 'N/A';
        flattened['BANK/CHEQUE DETAILS'] = `${item.bankName || ''} ${item.chequeNumber || ''}`.trim() || 'N/A';
        flattened['AMOUNT'] = item.amount || 0;
        flattened['STATUS'] = item.status || 'SETTLED';
        flattened['NOTES'] = item.notes || item.purpose || '';
        return flattened;
      }

      if (filename.includes('campaign')) {
        flattened['CAMPAIGN NAME'] = item.campaignName || 'N/A';
        flattened['CLIENT'] = item.client?.name || 'N/A';
        flattened['START DATE'] = item.startDate ? format(new Date(item.startDate), 'dd MMM yyyy') : 'N/A';
        flattened['END DATE'] = item.endDate ? format(new Date(item.endDate), 'dd MMM yyyy') : 'N/A';
        flattened['TOTAL BUDGET'] = item.totalBudget || 0;
        flattened['SITES COUNT'] = item.campaignSites?.length || 0;
        flattened['STATUS'] = item.status || 'N/A';
        return flattened;
      }

      // GENERIC MAPPING (Fallback)
      const processValue = (key: string, value: any, prefix = '') => {
        const columnKey = prefix ? `${prefix} ${key}`.trim().toUpperCase() : key.toUpperCase();
        if (value === null || value === undefined) flattened[columnKey] = 'N/A';
        else if (typeof value === 'boolean') flattened[columnKey] = value ? 'Yes' : 'No';
        else if (typeof value === 'object' && !(value instanceof Date)) {
          Object.entries(value).forEach(([subKey, subVal]) => {
            if (typeof subVal !== 'object') processValue(subKey, subVal, key);
          });
        } else if (typeof value === 'string' && !isNaN(Date.parse(value)) && value.includes('-')) {
          try { flattened[columnKey] = format(new Date(value), 'dd MMM yyyy'); } catch { flattened[columnKey] = value; }
        } else flattened[columnKey] = value;
      };

      Object.entries(item).forEach(([key, value]) => {
        if (['bg', 'color', 'id', 'orgId', 'createdAt', 'updatedAt', '_count'].includes(key)) return;
        processValue(key, value);
      });

      return flattened;
    });
  };

  const getSummary = (mappedData: any[]) => {
    const summary: Record<string, string | number> = {
      'Total Records': mappedData.length,
    };

    // Calculate totals for currency fields
    const amountKeys = Object.keys(mappedData[0] || {}).filter(k => 
      k.toLowerCase().includes('amount') || k.toLowerCase().includes('total') || k.toLowerCase().includes('rate')
    );

    amountKeys.forEach(key => {
      const total = mappedData.reduce((sum, row) => {
        const val = typeof row[key] === 'string' ? parseFloat(row[key].replace(/[^0-9.]/g, '')) : row[key];
        return sum + (typeof val === 'number' && !isNaN(val) ? val : 0);
      }, 0);
      if (total > 0) {
        summary[`Sum of ${key}`] = `INR ${total.toLocaleString()}`;
      }
    });

    return summary;
  };

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    const filtered = getFilteredData();
    if (filtered.length === 0) {
      alert('No data found for the selected time range');
      return;
    }

    const mappedData = dataMapper(filtered);
    const reportTitle = `${filename.replace(/_/g, ' ').toUpperCase()} - ${timeRange.toUpperCase()}`;
    const summary = getSummary(mappedData);

    const keys = Object.keys(mappedData[0]);
    const headers = keys.map(h => h.toUpperCase());
    const rows = mappedData.map(row => keys.map(key => row[key]?.toString() || ''));
    
    const options = { headers, data: rows, filename, title: reportTitle, summary };

    if (type === 'csv') {
      exportToCSV(options);
    } else if (type === 'excel') {
      exportToExcel(options);
    } else {
      exportToPDF(options);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn-outline text-[12px] py-1.5 flex items-center gap-2 hover:border-accent-orange transition-colors"
      >
        <FileDown size={14} /> Export Data <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-3 border-b border-border bg-bg-surface-2">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
              <Calendar size={10} /> Select Report Duration
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { id: 'all', label: 'All Time' },
                { id: '30d', label: 'Last 30 Days' },
                { id: '90d', label: 'Last 90 Days' },
                { id: '6m', label: 'Last 6 Months' },
                { id: 'ytd', label: 'FY (YTD)' }
              ].map(range => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as TimeRange)}
                  className={`text-[9px] font-bold px-2 py-1 rounded transition-colors ${timeRange === range.id ? 'bg-accent-orange text-white' : 'hover:bg-bg-surface text-text-muted border border-transparent hover:border-border'}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-1">
            <button 
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-text-primary hover:bg-bg-surface-2 transition-colors rounded-lg"
            >
              <FileText size={14} className="text-accent-blue" /> Export as CSV
            </button>
            <button 
              onClick={() => handleExport('excel')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-text-primary hover:bg-bg-surface-2 transition-colors rounded-lg"
            >
              <FileSpreadsheet size={14} className="text-success" /> Export as Excel
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-text-primary hover:bg-bg-surface-2 transition-colors rounded-lg"
            >
              <File size={14} className="text-danger" /> Export as Professional PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
