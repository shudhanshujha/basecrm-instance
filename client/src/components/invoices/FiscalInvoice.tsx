import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { numberToWords } from '../../lib/numberToWords';

// Define styles to match the HTML preview exactly
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#000',
    backgroundColor: '#fff',
  },
  container: {
    border: '1pt solid #000',
    flexDirection: 'column',
    width: '100%',
  },
  // Header Section
  header: {
    borderBottom: '1pt solid #000',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  },
  logoBox: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 65,
    height: 65,
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    textAlign: 'center',
    paddingRight: 80, 
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  companySubInfo: {
    fontSize: 9.5,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  gstinBox: {
    marginTop: 6,
    paddingTop: 4,
    borderTop: '0.5pt solid #ccc',
    alignSelf: 'center',
  },
  gstinText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  // Title Bar
  titleBar: {
    backgroundColor: '#d9e5f3',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 1,
    fontWeight: 'bold',
    fontSize: 11,
  },
  // Metadata Grid
  metaGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  metaCol: {
    width: '50%',
  },
  metaItem: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 17,
    alignItems: 'center',
  },
  metaItemLast: {
    flexDirection: 'row',
    minHeight: 17,
    alignItems: 'center',
  },
  metaLabel: {
    width: 100,
    padding: 2,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 9,
  },
  metaValue: {
    flex: 1,
    padding: 2,
    fontSize: 9,
  },
  // Party Section
  partyHeader: {
    flexDirection: 'row',
    backgroundColor: '#d9e5f3',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
    fontSize: 10,
  },
  partyHeaderBox: {
    width: '50%',
    textAlign: 'center',
    paddingVertical: 1.5,
  },
  partyGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  partyBox: {
    width: '50%',
    padding: 4,
    minHeight: 70,
  },
  partyRow: {
    flexDirection: 'row',
    marginBottom: 1,
    fontSize: 9.5,
  },
  labelBold: {
    fontWeight: 'bold',
    width: 45,
  },
  valueBold: {
    fontWeight: 'bold',
    flex: 1,
  },
  // Table Section
  descHeaderBar: {
    padding: 3,
    fontWeight: 'bold',
    fontSize: 8.5,
    borderBottom: '1pt solid #000',
  },
  table: {
    flex: 1,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#d9e5f3',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 7.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #eee',
    minHeight: 17,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 8.5,
  },
  tableFooterRow: {
    flexDirection: 'row',
    backgroundColor: '#d9e5f3',
    borderTop: '1pt solid #000',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 8.5,
    minHeight: 18,
    alignItems: 'center',
  },
  // Optimized Column Widths to prevent wrapping
  c1: { width: '4%', borderRight: '1pt solid #000', padding: 2 }, // S.No
  c2: { flex: 1, borderRight: '1pt solid #000', padding: 2, textAlign: 'left' }, // Description
  c3: { width: '8%', borderRight: '1pt solid #000', padding: 2 }, // HSN
  c4: { width: '4%', borderRight: '1pt solid #000', padding: 2 }, // Qty
  c5: { width: '7%', borderRight: '1pt solid #000', padding: 2 }, // Rate
  c6: { width: '9%', borderRight: '1pt solid #000', padding: 2 }, // Amount
  c7: { width: '6%', borderRight: '1pt solid #000', padding: 2 }, // Discount
  c8: { width: '9%', borderRight: '1pt solid #000', padding: 2 }, // Taxable Val
  c9: { width: '13%', borderRight: '1pt solid #000' }, // GST Group
  c10: { width: '11%', padding: 2, fontWeight: 'bold' }, // Total

  // Bottom Grid (Summary & Words)
  summaryGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 80,
  },
  wordsBox: {
    flex: 1,
    borderRight: '1pt solid #000',
  },
  wordsHeader: {
    backgroundColor: '#d9e5f3',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  wordsContent: {
    padding: 10,
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
    justifyContent: 'center',
    flex: 1,
  },
  totalsBox: {
    width: 200,
  },
  totalsRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 16,
    alignItems: 'center',
  },
  totalsLabel: {
    width: 120,
    padding: 3,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 7.5,
    textTransform: 'uppercase',
  },
  totalsValue: {
    flex: 1,
    padding: 3,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 9,
  },
  // Final Row (Bank/Seal/Auth)
  bottomGrid: {
    flexDirection: 'row',
    minHeight: 90,
  },
  bankCol: {
    width: 200,
    borderRight: '1pt solid #000',
  },
  bankHeader: {
    backgroundColor: '#d9e5f3',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 1.5,
    fontWeight: 'bold',
    fontSize: 10,
  },
  bankContent: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankText: {
    fontSize: 8,
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
  qrImage: {
    width: 48,
    height: 48,
  },
  sealCol: {
    flex: 1,
    borderRight: '1pt solid #000',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5,
  },
  authCol: {
    width: 200,
    padding: 4,
    justifyContent: 'space-between',
  },
  certText: {
    fontSize: 7,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  authFor: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  authLabel: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingTop: 4,
    fontWeight: 'bold',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  signatureImage: {
    width: 80,
    height: 25,
    objectFit: 'contain',
    alignSelf: 'center',
    marginVertical: 4,
  },
  bold: {
    fontWeight: 'bold',
  }
});

interface InvoiceItem {
  id: any;
  sNo: number;
  description: string;
  subDescription?: string;
  hsn: string;
  qty: number;
  rate: number;
  amount: number;
  discount: number;
  taxableValue: number;
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  total: number;
}

interface FiscalInvoiceProps {
  invoiceData: {
    invoiceNumber: string;
    invoiceDate: string;
    reverseCharge: string;
    transportMode?: string;
    vehicleNumber?: string;
    dateOfSupply: string;
    placeOfSupply: string;
    descriptionHeader?: string;
    seller: {
      name: string;
      address: string;
      phone: string[];
      email: string;
      gstin: string;
      msmeRegNo: string;
      state: string;
      stateCode: string;
      bank: {
        name: string;
        branch: string;
        accountNo: string;
        ifsc: string;
      }
    };
    buyer: {
      name: string;
      address: string;
      gstin: string;
      state: string;
      stateCode: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    gstConfig: string;
    cgstTotal: number;
    sgstTotal: number;
    igstTotal: number;
    grandTotal: number;
    upiId?: string;
    showUpiQr?: boolean;
    showDigitalSignature?: boolean;
    signatureUrl?: string;
  };
}

const FiscalInvoice: React.FC<FiscalInvoiceProps> = ({ invoiceData }) => {
  const isIntraState = invoiceData.gstConfig === 'INTRA';
  const isInterState = invoiceData.gstConfig === 'INTER';
  const totalTax = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Image src="/dvs_logo.jpg" style={styles.logo} />
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={styles.companySubInfo}>{invoiceData.seller.address}</Text>
              <Text style={styles.companySubInfo}>Phone: {invoiceData.seller.phone.join(', ')}</Text>
              <Text style={styles.companySubInfo}>E Mail: {invoiceData.seller.email}</Text>
              <View style={styles.gstinBox}>
                <Text style={styles.gstinText}>GSTIN Number : {invoiceData.seller.gstin}</Text>
              </View>
            </View>
          </View>

          <View style={styles.titleBar}><Text>Invoice</Text></View>

          {/* Metadata */}
          <View style={styles.metaGrid}>
            <View style={[styles.metaCol, { borderRight: '1pt solid #000' }]}>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Invoice No:</Text><Text style={[styles.metaValue, styles.bold]}>{invoiceData.invoiceNumber}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Invoice Date:</Text><Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Reverse Charge:</Text><Text style={styles.metaValue}>{invoiceData.reverseCharge}</Text></View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={[styles.metaValue, { borderRight: '0.5pt solid #000' }]}>{invoiceData.seller.state}</Text>
                  <Text style={[styles.metaLabel, { width: 35 }]}>Code:</Text>
                  <Text style={styles.metaValue}>{invoiceData.seller.stateCode}</Text>
                </View>
              </View>
              <View style={styles.metaItemLast}><Text style={[styles.metaLabel, { fontSize: 7, textTransform: 'uppercase' }]}>MSME REGISTRATION NO.:</Text><Text style={[styles.metaValue, styles.bold]}>{invoiceData.seller.msmeRegNo}</Text></View>
            </View>
            <View style={styles.metaCol}>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Transport Mode:</Text><Text style={styles.metaValue}>{invoiceData.transportMode || '-'}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Vehicle number:</Text><Text style={styles.metaValue}>{invoiceData.vehicleNumber || '-'}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Date of Supply:</Text><Text style={styles.metaValue}>{invoiceData.dateOfSupply}</Text></View>
              <View style={styles.metaItemLast}><Text style={styles.metaLabel}>Place of Supply:</Text><Text style={[styles.metaValue, { textTransform: 'uppercase' }]}>{invoiceData.placeOfSupply}</Text></View>
            </View>
          </View>

          {/* Party Grid */}
          <View style={styles.partyHeader}>
            <View style={[styles.partyHeaderBox, { borderRight: '1pt solid #000' }]}><Text>Invoice to Party</Text></View>
            <View style={styles.partyHeaderBox}><Text>Ship to Party</Text></View>
          </View>
          <View style={styles.partyGrid}>
            <View style={[styles.partyBox, { borderRight: '1pt solid #000' }]}>
              <View style={styles.partyRow}><Text style={styles.labelBold}>Name:</Text><Text style={styles.valueBold}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.labelBold}>Address:</Text><Text style={{ flex: 1 }}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.labelBold}>GSTIN:</Text><Text style={styles.valueBold}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyRow}>
                <Text style={styles.labelBold}>State:</Text><Text style={{ borderRight: '0.5pt solid #000', paddingRight: 5, marginRight: 5 }}>{invoiceData.buyer.state || '-'}</Text>
                <Text style={styles.labelBold}>Code:</Text><Text>{invoiceData.buyer.stateCode || '-'}</Text>
              </View>
            </View>
            <View style={styles.partyBox}>
              <View style={styles.partyRow}><Text style={styles.labelBold}>Name:</Text><Text style={styles.valueBold}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.labelBold}>Address:</Text><Text style={{ flex: 1 }}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.labelBold}>GSTIN:</Text><Text style={styles.valueBold}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyRow}>
                <Text style={styles.labelBold}>State:</Text><Text style={{ borderRight: '0.5pt solid #000', paddingRight: 5, marginRight: 5 }}>{invoiceData.buyer.state || '-'}</Text>
                <Text style={styles.labelBold}>Code:</Text><Text>{invoiceData.buyer.stateCode || '-'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.descHeaderBar}><Text>{invoiceData.descriptionHeader}</Text></View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.c1}></Text><Text style={styles.c2}></Text><Text style={styles.c3}></Text><Text style={styles.c4}></Text><Text style={styles.c5}></Text><Text style={styles.c6}></Text><Text style={styles.c7}></Text><Text style={styles.c8}></Text>
              {isIntraState && <><Text style={[styles.c9, { borderBottom: '0.5pt solid #000' }]}>CGST</Text><Text style={[styles.c9, { borderBottom: '0.5pt solid #000' }]}>SGST</Text></>}
              {isInterState && <Text style={[styles.c9, { borderBottom: '0.5pt solid #000' }]}>IGST</Text>}
              <Text style={styles.c10}></Text>
            </View>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.c1}>S. No.</Text><Text style={styles.c2}>Product Description</Text><Text style={styles.c3}>HSN code</Text><Text style={styles.c4}>Qty</Text><Text style={styles.c5}>Rate</Text><Text style={styles.c6}>Amount</Text><Text style={styles.c7}>Discount</Text><Text style={styles.c8}>Taxable Value</Text>
              {isIntraState && (
                <><View style={{ width: '13%', flexDirection: 'row', borderRight: '1pt solid #000' }}><Text style={{ flex: 1, borderRight: '0.5pt solid #000' }}>Rate</Text><Text style={{ flex: 1.2 }}>Amt</Text></View>
                  <View style={{ width: '13%', flexDirection: 'row', borderRight: '1pt solid #000' }}><Text style={{ flex: 1, borderRight: '0.5pt solid #000' }}>Rate</Text><Text style={{ flex: 1.2 }}>Amt</Text></View></>
              )}
              {isInterState && (
                <View style={{ width: '13%', flexDirection: 'row', borderRight: '1pt solid #000' }}><Text style={{ flex: 1, borderRight: '0.5pt solid #000' }}>Rate</Text><Text style={{ flex: 1.2 }}>Amt</Text></View>
              )}
              <Text style={styles.c10}>Total</Text>
            </View>

            {invoiceData.items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.c1}>{i + 1}</Text><Text style={[styles.c2, styles.bold]}>{item.description}</Text><Text style={styles.c3}>{item.hsn}</Text><Text style={styles.c4}>{item.qty}</Text><Text style={styles.c5}>{item.rate}</Text><Text style={styles.c6}>{item.amount}</Text><Text style={styles.c7}>{item.discount}</Text><Text style={styles.c8}>{item.taxableValue.toFixed(2)}</Text>
                {isIntraState && (
                  <><View style={{ width: '13%', flexDirection: 'row', borderRight: '1pt solid #000', height: '100%' }}><Text style={{ flex: 1, borderRight: '0.5pt solid #000' }}>{item.cgstRate}%</Text><Text style={{ flex: 1.2 }}>{item.cgstAmount?.toFixed(2)}</Text></View>
                    <View style={{ width: '13%', flexDirection: 'row', borderRight: '1pt solid #000', height: '100%' }}><Text style={{ flex: 1, borderRight: '0.5pt solid #000' }}>{item.sgstRate}%</Text><Text style={{ flex: 1.2 }}>{item.sgstAmount?.toFixed(2)}</Text></View></>
                )}
                {isInterState && (
                  <View style={{ width: '13%', flexDirection: 'row', borderRight: '1pt solid #000', height: '100%' }}><Text style={{ flex: 1, borderRight: '0.5pt solid #000' }}>{item.igstRate}%</Text><Text style={{ flex: 1.2 }}>{item.igstAmount?.toFixed(2)}</Text></View>
                )}
                <Text style={[styles.c10, { textAlign: 'right' }]}>{item.total.toFixed(2)}</Text>
              </View>
            ))}

            {/* Optimized filler count to prevent page overflow */}
            {Array.from({ length: Math.max(0, 12 - invoiceData.items.length) }).map((_, i) => (
              <View key={i} style={[styles.tableRow, { borderBottom: '0.5pt solid #eee' }]}><Text style={styles.c1}> </Text><Text style={styles.c2}> </Text><Text style={styles.c3}> </Text><Text style={styles.c4}> </Text><Text style={styles.c5}> </Text><Text style={styles.c6}> </Text><Text style={styles.c7}> </Text><Text style={styles.c8}> </Text>{isIntraState && <><View style={{ width: '13%', borderRight: '1pt solid #000' }}><Text> </Text></View><View style={{ width: '13%', borderRight: '1pt solid #000' }}><Text> </Text></View></>}{isInterState && <View style={{ width: '13%', borderRight: '1pt solid #000' }}><Text> </Text></View>}<Text style={styles.c10}> </Text></View>
            ))}

            <View style={styles.tableFooterRow}>
              <Text style={{ width: '12%', borderRight: '1pt solid #000' }}>Total</Text><Text style={{ flex: 1, borderRight: '1pt solid #000' }}></Text><Text style={styles.c3}></Text><Text style={styles.c4}>{invoiceData.items.reduce((acc, curr) => acc + curr.qty, 0)}</Text><Text style={styles.c5}>###</Text><Text style={styles.c6}>####</Text><Text style={styles.c7}>{invoiceData.items.reduce((acc, curr) => acc + curr.discount, 0)}</Text><Text style={styles.c8}>{invoiceData.subtotal.toFixed(2)}</Text>{isIntraState && <><Text style={{ width: '13%', borderRight: '1pt solid #000' }}>####</Text><Text style={{ width: '13%', borderRight: '1pt solid #000' }}>###</Text></>}{isInterState && <Text style={{ width: '13%', borderRight: '1pt solid #000' }}>####</Text>}<Text style={[styles.c10, { textAlign: 'right' }]}>{Math.round(invoiceData.grandTotal)}</Text>
            </View>
          </View>

          {/* Summary Section */}
          <View style={styles.summaryGrid}>
            <View style={styles.wordsBox}>
              <Text style={styles.wordsHeader}>Total Invoice Amount in Words</Text>
              <View style={styles.wordsContent}>
                <Text>{numberToWords(Math.round(invoiceData.grandTotal))}</Text>
              </View>
            </View>
            <View style={styles.totalsBox}>
              <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Total Amount Before Tax</Text><Text style={styles.totalsValue}>{invoiceData.subtotal.toFixed(2)}</Text></View>
              {isIntraState && <><View style={styles.totalsRow}><Text style={styles.totalsLabel}>Add: CGST</Text><Text style={styles.totalsValue}>{invoiceData.cgstTotal.toFixed(2)}</Text></View><View style={styles.totalsRow}><Text style={styles.totalsLabel}>Add: SGST</Text><Text style={styles.totalsValue}>{invoiceData.sgstTotal.toFixed(2)}</Text></View></>}
              {isInterState && <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Add: IGST</Text><Text style={styles.totalsValue}>{invoiceData.igstTotal.toFixed(2)}</Text></View>}
              <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Total Tax Amount</Text><Text style={styles.totalsValue}>{totalTax.toFixed(2)}</Text></View>
              <View style={[styles.totalsRow, { backgroundColor: '#f3f4f6' }]}><Text style={styles.totalsLabel}>Total Amount After Tax</Text><Text style={styles.totalsValue}>{invoiceData.grandTotal.toFixed(2)}</Text></View>
              <View style={[styles.totalsRow, { borderBottom: 'none' }]}><Text style={styles.totalsLabel}>GST on Reverse Charge</Text><Text style={styles.totalsValue}>0.00</Text></View>
            </View>
          </View>

          {/* Bottom Grid */}
          <View style={styles.bottomGrid}>
            <View style={styles.bankCol}>
              <Text style={styles.bankHeader}>Bank Details</Text>
              <View style={styles.bankContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bankText}>Bank Name: {invoiceData.seller.bank.name}</Text>
                  <Text style={styles.bankText}>Branch Name: {invoiceData.seller.bank.branch}</Text>
                  <Text style={styles.bankText}>Account No: {invoiceData.seller.bank.accountNo}</Text>
                  <Text style={styles.bankText}>Bank IFSC: {invoiceData.seller.bank.ifsc}</Text>
                </View>
                {invoiceData.upiId && invoiceData.showUpiQr && (
                  <View style={{ alignItems: 'center' }}>
                    <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${invoiceData.upiId}&pn=${encodeURIComponent(invoiceData.seller.name)}&am=${invoiceData.grandTotal.toFixed(2)}&cu=INR`)}`} style={styles.qrImage} />
                    <Text style={{ fontSize: 6, fontWeight: 'bold', marginTop: 1 }}>SCAN TO PAY</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 7, textAlign: 'center', borderTop: '0.5pt solid #000', marginTop: 2, fontWeight: 'bold' }}>Terms & Conditions Apply</Text>
            </View>
            <View style={styles.sealCol}>
              <Text style={{ borderTop: '1pt solid #000', width: '100%', textAlign: 'center', fontWeight: 'bold', paddingVertical: 1 }}>Common Seal</Text>
            </View>
            <View style={styles.authCol}>
              <Text style={styles.certText}>Certified that the particulars given above are true and correct.</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.authFor}>For {invoiceData.seller.name}</Text>
                {invoiceData.showDigitalSignature && <Image src={invoiceData.signatureUrl} style={styles.signatureImage} />}
              </View>
              <Text style={styles.authLabel}>Authorised Signatory</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
};

export default FiscalInvoice;
