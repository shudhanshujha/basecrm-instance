import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowLeft, Loader2, Download, Printer } from 'lucide-react';
import FiscalInvoice from '../../components/invoices/FiscalInvoice';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const InvoiceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

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

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-orange" /></div>;
  }

  if (!invoice) {
    return <div className="text-center py-20 text-text-muted">Invoice not found</div>;
  }

  // Parse invoice details JSON from DB if stored as string, otherwise use directly
  const invoiceData = typeof invoice.details === 'string' ? JSON.parse(invoice.details) : invoice.details;

  // Fallback map to ensure FiscalInvoice receives the correct structure if details is null
  const formattedInvoiceData = invoiceData || {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString('en-IN'),
    reverseCharge: 'No',
    dateOfSupply: new Date(invoice.invoiceDate).toLocaleDateString('en-IN'),
    placeOfSupply: 'Haryana (06)',
    seller: {
      name: 'DRISHTI VISION',
      address: 'Panipat, Haryana',
      phone: '+91 9999999999',
      email: 'contact@drishtivision.in',
      gstin: '06AABCD1234E1Z5',
      msmeRegNo: 'UDYAM-HR-14-0000000',
      bank: {
        name: 'HDFC Bank',
        branch: 'Panipat Main',
        accountNo: '50200000000000',
        ifsc: 'HDFC0000000'
      }
    },
    buyer: {
      name: invoice.client?.name || 'Client',
      address: 'Address',
      gstin: '00AABCD1234E1Z5',
      state: 'Haryana',
      stateCode: '06'
    },
    items: [
      {
        sNo: 1,
        description: 'Advertising Services',
        hsn: '998361',
        qty: 1,
        rate: invoice.totalAmount / 1.18, // Rough reverse calc
        amount: invoice.totalAmount / 1.18,
        discount: 0,
        taxableValue: invoice.totalAmount / 1.18,
        total: invoice.totalAmount
      }
    ],
    subtotal: invoice.totalAmount / 1.18,
    gstConfig: 'INTRA',
    cgstTotal: (invoice.totalAmount / 1.18) * 0.09,
    sgstTotal: (invoice.totalAmount / 1.18) * 0.09,
    igstTotal: 0,
    grandTotal: invoice.totalAmount,
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
