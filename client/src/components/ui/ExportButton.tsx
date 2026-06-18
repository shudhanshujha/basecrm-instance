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
      if (timeRange === 'all') return true;
      const dateField = item.date || item.invoiceDate || item.paymentDate || item.createdAt;
      if (!dateField) return false;
      const itemDate = new Date(dateField);
      if (isNaN(itemDate.getTime())) return false;
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
      
      // ENTITY-SPECIFIC MAPPING
      if (filename.includes('client')) {
        flattened['CLIENT NAME'] = item.name || 'N/A';
        flattened['CONTACT PERSON'] = item.contactPerson || 'N/A';
        flattened['PHONE'] = item.phone || 'N/A';
        flattened['EMAIL'] = item.email || 'N/A';
        flattened['ADDRESS'] = item.address || 'N/A';
        flattened['CITY'] = item.city || 'N/A';
        flattened['STATE'] = item.state || 'N/A';
        flattened['GSTIN'] = item.gstin || 'N/A';
        flattened['PAN'] = item.panNumber || 'N/A';
        flattened['TYPE'] = item.clientType || 'N/A';
        flattened['NOTES'] = item.notes || '';
        flattened['TOTAL DEALS'] = item.deals?.length || 0;
        flattened['TOTAL INVOICES'] = item.invoices?.length || 0;
        flattened['CREATED AT'] = item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : 'N/A';
        return flattened;
      }

      if (filename.includes('expense')) {
        flattened['DATE'] = item.date ? format(new Date(item.date), 'dd MMM yyyy') : 'N/A';
        flattened['CATEGORY'] = item.category || 'N/A';
        flattened['AMOUNT'] = item.amount || 0;
        flattened['DESCRIPTION'] = item.description || '';
        flattened['PAYMENT MODE'] = item.paymentMode || 'N/A';
        flattened['REFERENCE NO'] = item.referenceNumber || '';
        flattened['GSTIN'] = item.gstin || '';
        flattened['TAXABLE AMOUNT'] = item.taxableAmount || 0;
        flattened['CGST'] = item.cgstAmount || 0;
        flattened['SGST'] = item.sgstAmount || 0;
        flattened['IGST'] = item.igstAmount || 0;
        flattened['CREATED AT'] = item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : 'N/A';
        return flattened;
      }

      if (filename.includes('vendor')) {
        flattened['VENDOR NAME'] = item.vendorName || 'N/A';
        flattened['CONTACT PERSON'] = item.contactPerson || 'N/A';
        flattened['PHONE'] = item.phone || 'N/A';
        flattened['EMAIL'] = item.email || 'N/A';
        flattened['ADDRESS'] = item.address || 'N/A';
        flattened['CITY'] = item.city || 'N/A';
        flattened['GSTIN'] = item.gstin || 'N/A';
        flattened['PAN'] = item.panNumber || 'N/A';
        flattened['TYPE'] = item.vendorType || 'N/A';
        flattened['BANK NAME'] = item.bankName || '';
        flattened['ACCOUNT NO'] = item.accountNumber || '';
        flattened['IFSC'] = item.ifscCode || '';
        flattened['STATUS'] = item.status || 'N/A';
        flattened['NOTES'] = item.notes || '';
        flattened['TOTAL CONTRACTS'] = item.vendorContracts?.length || 0;
        flattened['CREATED AT'] = item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : 'N/A';
        return flattened;
      }

      if (filename.includes('collection')) {
        flattened['PAYMENT DATE'] = item.paymentDate ? format(new Date(item.paymentDate), 'dd MMM yyyy') : 'N/A';
        flattened['AMOUNT'] = item.amount || 0;
        flattened['PAYMENT MODE'] = item.paymentMode || 'N/A';
        flattened['REFERENCE NO'] = item.referenceNumber || '';
        flattened['BANK NAME'] = item.bankName || '';
        flattened['CHEQUE NO'] = item.chequeNumber || '';
        flattened['NOTES'] = item.notes || '';
        flattened['CLIENT NAME'] = item.client?.name || 'N/A';
        flattened['CLIENT GSTIN'] = item.client?.gstin || '';
        flattened['INVOICE NO'] = item.invoice?.invoiceNumber || 'N/A';
        flattened['INVOICE AMOUNT'] = item.invoice?.totalAmount || 0;
        return flattened;
      }

      if (filename.includes('payout')) {
        flattened['PAYMENT DATE'] = item.paymentDate ? format(new Date(item.paymentDate), 'dd MMM yyyy') : 'N/A';
        flattened['AMOUNT'] = item.amount || 0;
        flattened['PAYMENT MODE'] = item.paymentMode || 'N/A';
        flattened['REFERENCE NO'] = item.referenceNumber || '';
        flattened['PURPOSE'] = item.purpose || '';
        flattened['NOTES'] = item.notes || '';
        flattened['VENDOR NAME'] = item.vendor?.vendorName || 'N/A';
        flattened['VENDOR GSTIN'] = item.vendor?.gstin || '';
        flattened['MONTH'] = item.month || '';
        flattened['YEAR'] = item.year || '';
        return flattened;
      }

      if (filename.includes('asset')) {
        flattened['ASSET NAME'] = item.name || 'N/A';
        flattened['CATEGORY'] = item.category || 'N/A';
        flattened['DESCRIPTION'] = item.description || 'N/A';
        flattened['STATUS'] = item.status || 'N/A';
        flattened['CREATED AT'] = item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : 'N/A';
        return flattened;
      }

      if (filename.includes('invoice')) {
        flattened['INVOICE NO'] = item.invoiceNumber || 'N/A';
        flattened['CLIENT NAME'] = item.client?.name || 'N/A';
        flattened['CLIENT GSTIN'] = item.client?.gstin || 'N/A';
        flattened['CLIENT STATE'] = item.client?.state || 'N/A';
        flattened['INVOICE DATE'] = item.invoiceDate ? format(new Date(item.invoiceDate), 'dd MMM yyyy') : 'N/A';
        flattened['DUE DATE'] = item.dueDate ? format(new Date(item.dueDate), 'dd MMM yyyy') : 'N/A';
        flattened['TAXABLE AMOUNT'] = item.taxableAmount || item.subtotal || 0;
        flattened['CGST RATE'] = item.cgstRate ? `${item.cgstRate}%` : (item.cgstAmount > 0 ? '9%' : '0%');
        flattened['CGST AMOUNT'] = item.cgstAmount || 0;
        flattened['SGST RATE'] = item.sgstRate ? `${item.sgstRate}%` : (item.sgstAmount > 0 ? '9%' : '0%');
        flattened['SGST AMOUNT'] = item.sgstAmount || 0;
        flattened['IGST RATE'] = item.igstRate ? `${item.igstRate}%` : (item.igstAmount > 0 ? '18%' : '0%');
        flattened['IGST AMOUNT'] = item.igstAmount || 0;
        flattened['TOTAL TAX'] = (item.cgstAmount || 0) + (item.sgstAmount || 0) + (item.igstAmount || 0);
        flattened['DISCOUNT'] = item.discount || 0;
        flattened['TOTAL AMOUNT'] = item.totalAmount || 0;
        flattened['AMOUNT IN WORDS'] = item.amountInWords || '';
        flattened['LINKED DEAL'] = item.deal?.title || item.dealTitle || 'N/A';
        flattened['STATUS'] = item.status || 'N/A';
        return flattened;
      }

      if (filename.includes('deal')) {
        flattened['DEAL TITLE'] = item.title || 'N/A';
        flattened['CLIENT'] = item.client?.name || 'N/A';
        flattened['START DATE'] = item.startDate ? format(new Date(item.startDate), 'dd MMM yyyy') : 'N/A';
        flattened['END DATE'] = item.endDate ? format(new Date(item.endDate), 'dd MMM yyyy') : 'N/A';
        flattened['VALUE'] = item.value || 0;
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

    const amountKeys = Object.keys(mappedData[0] || {}).filter(k => {
      const key = k.toLowerCase();
      if (key.includes('rate') || key.includes('name') || key.includes('words')) return false;
      return key.includes('amount') || key.includes('total') || key.includes('value');
    });

    amountKeys.forEach(key => {
      const total = mappedData.reduce((sum, row) => {
        const val = typeof row[key] === 'string' ? parseFloat(row[key].replace(/[^0-9.]/g, '')) : row[key];
        return sum + (typeof val === 'number' && !isNaN(val) ? val : 0);
      }, 0);
      if (total > 0) {
        summary[`Sum of ${key}`] = `₹ ${total.toLocaleString()}`;
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
