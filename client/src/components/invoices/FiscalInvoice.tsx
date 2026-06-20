import React from 'react';
import { getTemplateComponent } from './templates/index.js';

interface FiscalInvoiceProps {
  invoiceData: any;
}

const FiscalInvoice: React.FC<FiscalInvoiceProps> = ({ invoiceData }) => {
  const templateId = invoiceData.templateId || 'gst-standard';
  const TemplateComponent = getTemplateComponent(templateId);
  return <TemplateComponent invoiceData={invoiceData} />;
};

export default FiscalInvoice;
