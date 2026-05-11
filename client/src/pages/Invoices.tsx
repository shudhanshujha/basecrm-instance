import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Invoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  const handleExportPDF = (invoice: any) => {
    const doc = new jsPDF();
    doc.text(`Invoice #${invoice.invoiceNumber}`, 14, 20);
    doc.text(`Total Amount: Rs. ${invoice.totalAmount}`, 14, 30);
    doc.text(`Status: ${invoice.status}`, 14, 40);
    // (doc as any).autoTable({
    //   startY: 50,
    //   head: [['Description', 'Amount']],
    //   body: JSON.parse(invoice.lineItems || '[]').map((item: any) => [item.description, item.amount]),
    // });
    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  const handleGenerateInvoice = async () => {
    try {
      // Mock generate
      await api.post('/invoices', {
        invoiceNumber: `INV-${Date.now()}`,
        clientId: 'mock-client-id', // Assuming you have proper relations in actual app
        subtotal: 1000,
        taxableAmount: 1000,
        cgstAmount: 90,
        sgstAmount: 90,
        igstAmount: 0,
        totalAmount: 1180,
        dueDate: new Date().toISOString(),
        lineItems: '[]'
      });
      fetchInvoices();
    } catch (e) {
      console.error(e);
      alert('Ensure valid Client ID exists in backend before creating an invoice');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button onClick={handleGenerateInvoice} className="bg-blue-600 text-white px-4 py-2 rounded">
          Generate Invoice
        </button>
      </div>
      <div className="bg-white rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-4">Invoice #</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b">
                <td className="p-4">{inv.invoiceNumber}</td>
                <td className="p-4">Rs. {inv.totalAmount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleExportPDF(inv)} className="text-blue-600 hover:underline">
                    Export as PDF
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
