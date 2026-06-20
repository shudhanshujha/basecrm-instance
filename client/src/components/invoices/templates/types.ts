export interface TemplateProps {
  invoiceData: {
    invoiceNumber: string;
    invoiceDate: string;
    gstConfig: string;
    reverseCharge: string;
    transportMode: string;
    vehicleNumber: string;
    dateOfSupply: string;
    placeOfSupply: string;
    descriptionHeader: string;
    subtotal: number;
    cgstTotal: number;
    sgstTotal: number;
    igstTotal: number;
    grandTotal: number;
    upiId: string;
    showUpiQr: boolean;
    showDigitalSignature: boolean;
    signatureUrl: string;
    seller: {
      name: string;
      address: string;
      phone: string[] | string;
      email: string;
      gstin: string;
      msmeRegNo: string;
      state: string;
      stateCode: string;
      logoUrl?: string;
      accentColor?: string;
      bank: {
        name: string;
        branch: string;
        accountNo: string;
        ifsc: string;
      };
    };
    buyer: {
      name: string;
      address: string;
      gstin: string;
      state: string;
      stateCode: string;
    };
    items: Array<{
      name: string;
      description: string;
      hsn: string;
      qty: number;
      rate: number;
      amount: number;
      discount: number;
      taxableValue: number;
      cgstRate: number;
      sgstRate: number;
      igstRate: number;
      cgstAmount: number;
      sgstAmount: number;
      igstAmount: number;
      total: number;
    }>;
    templateConfig?: {
      accentColor?: string;
      fontFamily?: string;
      showLogo?: boolean;
      showBorder?: boolean;
      showTerms?: boolean;
      showBankDetails?: boolean;
      headerStyle?: 'centered' | 'left-aligned' | 'split';
      [key: string]: any;
    };
    [key: string]: any;
  };
}
