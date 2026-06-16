import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowLeft, Loader2, Download, Printer, Pencil } from 'lucide-react';
import FiscalInvoice from '../../components/invoices/FiscalInvoice';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const InvoiceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoice = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/invoices/${id}`);
      setInvoice(res.data);
    } catch (error) {
      toast.error('Failed to load invoice details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-orange" /></div>;
  }

  if (!invoice) {
    return <div className="text-center py-20 text-text-muted">Invoice not found</div>;
  }

  // Dynamically map all database fields returned from backend (including the relations, items, and company metadata)
  const formattedInvoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: new Date(invoice.invoiceDate).toISOString().split('T')[0],
    reverseCharge: invoice.reverseCharge || 'N',
    transportMode: invoice.transportMode || '',
    vehicleNumber: invoice.vehicleNumber || '',
    dateOfSupply: invoice.dateOfSupply ? new Date(invoice.dateOfSupply).toISOString().split('T')[0] : new Date(invoice.invoiceDate).toISOString().split('T')[0],
    placeOfSupply: invoice.placeOfSupply || 'HARYANA (06)',
    descriptionHeader: invoice.notes || 'Advertising Services',
    gstConfig: invoice.igstAmount > 0 ? 'INTER' : (invoice.cgstAmount > 0 ? 'INTRA' : 'NONE'),
    upiId: invoice.upiId || 'merchant@bank',
    showUpiQr: invoice.showUpiQr !== null ? invoice.showUpiQr : true,
    showDigitalSignature: invoice.showDigitalSignature !== null ? invoice.showDigitalSignature : false,
    signatureUrl: invoice.signatureUrl || '',
    seller: {
      name: invoice.organization?.name || 'BASE CRM OPERATIONS',
      address: invoice.organization?.address || '123 Business District, Tech Park, 560001, India',
      phone: invoice.organization?.phone ? [invoice.organization.phone] : ['+91 9999999999'],
      email: invoice.organization?.email || 'admin@basecrm.io',
      gstin: invoice.organization?.gstin || '00AAAAA0000A1Z5',
      msmeRegNo: invoice.organization?.msmeRegNo || 'UDYAM-XX-00-0000000',
      state: 'Generic',
      stateCode: '00',
      bank: invoice.bankDetails ? (typeof invoice.bankDetails === 'string' ? JSON.parse(invoice.bankDetails) : invoice.bankDetails) : {
        name: 'Generic Business Bank',
        branch: 'Main Branch',
        accountNo: '000000000000',
        ifsc: 'BANK0000000'
      }
    },
    buyer: {
      name: invoice.client?.name || '-',
      address: invoice.client?.address || '-',
      gstin: invoice.client?.gstin || '-',
      state: invoice.client?.state || '-',
      stateCode: invoice.client?.pincode ? '06' : '06'
    },
    items: invoice.invoiceItems && invoice.invoiceItems.length > 0 ? invoice.invoiceItems.map((item: any, idx: number) => ({
      sNo: idx + 1,
      description: item.description || '',
      hsn: item.hsn || '',
      qty: item.quantity || 1,
      rate: item.rate || 0,
      amount: item.amount || 0,
      discount: item.discount || 0,
      taxableValue: item.amount - (item.discount || 0),
      cgstRate: item.cgstRate || 0,
      sgstRate: item.sgstRate || 0,
      igstRate: item.igstRate || 0,
      cgstAmount: item.cgstAmount || 0,
      sgstAmount: item.sgstAmount || 0,
      igstAmount: item.igstAmount || 0,
      total: item.total || 0
    })) : [
      {
        sNo: 1,
        description: invoice.notes || 'Advertising Services',
        hsn: '9983',
        qty: 1,
        rate: invoice.subtotal || invoice.totalAmount,
        amount: invoice.subtotal || invoice.totalAmount,
        discount: 0,
        taxableValue: invoice.subtotal || invoice.totalAmount,
        cgstRate: invoice.cgstAmount > 0 ? 9 : 0,
        sgstRate: invoice.sgstAmount > 0 ? 9 : 0,
        igstRate: invoice.igstAmount > 0 ? 18 : 0,
        cgstAmount: invoice.cgstAmount || 0,
        sgstAmount: invoice.sgstAmount || 0,
        igstAmount: invoice.igstAmount || 0,
        total: invoice.totalAmount
      }
    ],
    subtotal: invoice.subtotal || 0,
    cgstTotal: invoice.cgstAmount || 0,
    sgstTotal: invoice.sgstAmount || 0,
    igstTotal: invoice.igstAmount || 0,
    grandTotal: invoice.totalAmount || 0
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/invoices')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Invoice {invoice.invoiceNumber}</h1>
            <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">
              {invoice.client?.name} · {invoice.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => navigate(`/invoices/edit/${id}`)}
             className="bg-bg-surface-2 border border-border text-text-primary px-4 py-1.5 rounded-lg font-black text-[12px] uppercase tracking-widest hover:border-accent-orange transition-all flex items-center gap-2"
           >
             <Pencil size={16} />
             Edit Invoice
           </button>
           <PDFDownloadLink 
             document={<FiscalInvoice invoiceData={formattedInvoiceData} />} 
             fileName={`${invoice.invoiceNumber}.pdf`}
           >
             {/* @ts-ignore */}
             {({ loading }) => (
               <button disabled={loading} className="btn-primary text-[12px] py-1.5 flex items-center gap-2">
                 {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                 {loading ? 'Generating...' : 'Download PDF'}
               </button>
             )}
           </PDFDownloadLink>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl overflow-hidden border border-border shadow-xl">
        <PDFViewer width="100%" height="100%" showToolbar={false}>
          <FiscalInvoice invoiceData={formattedInvoiceData} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default InvoiceDetails;
