import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { numberToWords } from '../../lib/numberToWords';

// Define styles to match the EXACT preview format
const styles = StyleSheet.create({
  page: {
    padding: '15mm', // 15mm margins on all sides
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#000',
    backgroundColor: '#fff',
  },
  container: {
    border: '1pt solid #000',
    flexDirection: 'column',
    width: '100%',
  },
  
  // 1. COMPANY HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottom: '1pt solid #000',
    position: 'relative',
    minHeight: 90,
  },
  logoBox: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 70,
    height: 70,
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  companySubInfo: {
    fontSize: 9,
    marginBottom: 2,
  },
  gstinLine: {
    marginTop: 6,
    paddingTop: 4,
    borderTop: '0.5pt solid #000',
  },
  gstinText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  // 2. INVOICE TITLE BAR
  titleBar: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 10,
  },

  // 3. INVOICE METADATA GRID
  metaGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  metaCol: {
    width: '50%',
  },
  metaRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 18,
    alignItems: 'center',
  },
  metaRowLast: {
    flexDirection: 'row',
    minHeight: 18,
    alignItems: 'center',
  },
  metaLabel: {
    width: 90,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
  },
  metaValue: {
    flex: 1,
    paddingHorizontal: 4,
  },

  // 4. PARTY DETAILS
  partyHeaderGrid: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
  },
  partyHeaderCell: {
    width: '50%',
    textAlign: 'center',
    paddingVertical: 3,
    fontWeight: 'bold',
    fontSize: 9,
  },
  partyDataGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 80,
  },
  partyDataBox: {
    width: '50%',
    padding: 4,
  },
  partyLine: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  partyLabel: {
    fontWeight: 'bold',
    width: 45,
  },
  partyValue: {
    flex: 1,
  },

  // 5. SERVICE DESCRIPTION
  descHeader: {
    padding: 4,
    fontWeight: 'bold',
    borderBottom: '1pt solid #000',
    fontSize: 8.5,
  },

  // 6. ITEMS TABLE
  tableHeaderPrimary: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableHeaderSecondary: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  tableTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    minHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // TABLE COLUMNS (Fixed widths for perfect alignment)
  colSNo: { width: 25, borderRight: '1pt solid #000', padding: 2 },
  colDesc: { flex: 1, borderRight: '1pt solid #000', padding: 4, textAlign: 'left' },
  colHSN: { width: 45, borderRight: '1pt solid #000', padding: 2 },
  colQty: { width: 25, borderRight: '1pt solid #000', padding: 2 },
  colRate: { width: 40, borderRight: '1pt solid #000', padding: 2 },
  colAmount: { width: 45, borderRight: '1pt solid #000', padding: 2 },
  colDisc: { width: 35, borderRight: '1pt solid #000', padding: 2 },
  colTaxVal: { width: 50, borderRight: '1pt solid #000', padding: 2 },
  colGstGrp: { width: 50, borderRight: '1pt solid #000' }, // For CGST/SGST parent
  colGstRate: { width: 20, borderRight: '1pt solid #000', padding: 2 },
  colGstAmt: { width: 30, padding: 2 },
  colTotal: { width: 50, padding: 2, fontWeight: 'bold' },

  // 7. TOTALS SUMMARY
  summarySection: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  wordsBox: {
    flex: 1,
    borderRight: '1pt solid #000',
  },
  wordsTitle: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 3,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  wordsAmount: {
    padding: 15,
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  totalsBox: {
    width: 200,
  },
  totRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 18,
    alignItems: 'center',
  },
  totRowLast: {
    flexDirection: 'row',
    minHeight: 18,
    alignItems: 'center',
  },
  totLabel: {
    width: 130,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    textTransform: 'uppercase',
    fontSize: 7.5,
  },
  totValue: {
    flex: 1,
    paddingHorizontal: 4,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 9,
  },

  // 8. BOTTOM FOOTER
  footerRow: {
    flexDirection: 'row',
    minHeight: 110,
  },
  footerBank: {
    width: 220,
    borderRight: '1pt solid #000',
    justifyContent: 'space-between',
  },
  footerSeal: {
    flex: 1,
    borderRight: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSign: {
    width: 200,
    padding: 6,
    justifyContent: 'space-between',
  },
  
  // Bank elements
  bankTitle: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 3,
    fontWeight: 'bold',
  },
  bankContent: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankDetailsText: {
    lineHeight: 1.4,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 50,
    height: 50,
  },
  qrLabel: {
    fontSize: 6,
    fontWeight: 'bold',
    marginTop: 2,
  },
  termsText: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 4,
    fontWeight: 'bold',
  },

  // Seal elements
  sealLabel: {
    fontWeight: 'bold',
    fontSize: 10,
  },

  // Signature elements
  certText: {
    fontSize: 7,
    fontStyle: 'italic',
    textAlign: 'justify',
  },
  authCompany: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 9,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  signatureImage: {
    width: 90,
    height: 35,
    objectFit: 'contain',
    alignSelf: 'center',
    marginVertical: 4,
  },
  authLabel: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingTop: 4,
    fontWeight: 'bold',
    fontSize: 8,
  },

  // Utilities
  bold: { fontWeight: 'bold' },
  uppercase: { textTransform: 'uppercase' },
});

interface InvoiceItem {
  id?: any;
  sNo?: number;
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
      phone: string | string[];
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
  const isNone = invoiceData.gstConfig === 'NONE';
  const totalTaxAmount = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);

  const phoneString = Array.isArray(invoiceData.seller.phone) 
    ? invoiceData.seller.phone.join(', ') 
    : invoiceData.seller.phone;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          
          {/* 1. COMPANY HEADER */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Image src="/dvs_logo.jpg" style={styles.logo} />
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={styles.companySubInfo}>{invoiceData.seller.address}</Text>
              <Text style={styles.companySubInfo}>Phone: {phoneString}</Text>
              <Text style={styles.companySubInfo}>E Mail: {invoiceData.seller.email}</Text>
              <View style={styles.gstinLine}>
                <Text style={styles.gstinText}>GSTIN NUMBER : {invoiceData.seller.gstin}</Text>
              </View>
            </View>
          </View>

          {/* 2. TITLE BAR */}
          <View style={styles.titleBar}>
            <Text>Invoice</Text>
          </View>

          {/* 3. METADATA GRID */}
          <View style={styles.metaGrid}>
            <View style={[styles.metaCol, { borderRight: '1pt solid #000' }]}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice No:</Text>
                <Text style={[styles.metaValue, styles.bold]}>{invoiceData.invoiceNumber}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice Date:</Text>
                <Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Reverse Charge:</Text>
                <Text style={styles.metaValue}>{invoiceData.reverseCharge || 'N'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={{ flex: 1, paddingHorizontal: 4 }}>{invoiceData.seller.state}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingHorizontal: 4 }}>Code:</Text>
                  <Text style={{ paddingHorizontal: 4 }}>{invoiceData.seller.stateCode}</Text>
                </View>
              </View>
              <View style={styles.metaRowLast}>
                <Text style={[styles.metaLabel, { fontSize: 8 }]}>MSME REGISTRATION NO.:</Text>
                <Text style={[styles.metaValue, styles.bold]}>{invoiceData.seller.msmeRegNo}</Text>
              </View>
            </View>
            
            <View style={styles.metaCol}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Transport Mode:</Text>
                <Text style={styles.metaValue}>{invoiceData.transportMode || '-'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Vehicle number:</Text>
                <Text style={styles.metaValue}>{invoiceData.vehicleNumber || '-'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date of Supply:</Text>
                <Text style={styles.metaValue}>{invoiceData.dateOfSupply}</Text>
              </View>
              <View style={styles.metaRowLast}>
                <Text style={styles.metaLabel}>Place of Supply:</Text>
                <Text style={[styles.metaValue, styles.uppercase]}>{invoiceData.placeOfSupply}</Text>
              </View>
            </View>
          </View>

          {/* 4. PARTY DETAILS */}
          <View style={styles.partyHeaderGrid}>
            <Text style={[styles.partyHeaderCell, { borderRight: '1pt solid #000' }]}>Invoice to Party</Text>
            <Text style={styles.partyHeaderCell}>Ship to Party</Text>
          </View>
          
          <View style={styles.partyDataGrid}>
            <View style={[styles.partyDataBox, { borderRight: '1pt solid #000' }]}>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>Name:</Text>
                <Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text>
              </View>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>Address:</Text>
                <Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text>
              </View>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>GSTIN:</Text>
                <Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text>
              </View>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={{ flex: 1 }}>{invoiceData.buyer.state || '-'}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingLeft: 4 }}>Code:</Text>
                  <Text style={{ paddingLeft: 4 }}>{invoiceData.buyer.stateCode || '-'}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.partyDataBox}>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>Name:</Text>
                <Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text>
              </View>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>Address:</Text>
                <Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text>
              </View>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>GSTIN:</Text>
                <Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text>
              </View>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={{ flex: 1 }}>{invoiceData.buyer.state || '-'}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingLeft: 4 }}>Code:</Text>
                  <Text style={{ paddingLeft: 4 }}>{invoiceData.buyer.stateCode || '-'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 5. SERVICE DESCRIPTION */}
          <View style={styles.descHeader}>
            <Text>{invoiceData.descriptionHeader}</Text>
          </View>

          {/* 6. ITEMS TABLE */}
          {/* Table Header Row 1 */}
          <View style={styles.tableHeaderPrimary}>
            <Text style={[styles.colSNo, { paddingVertical: 6 }]}></Text>
            <Text style={[styles.colDesc, { paddingVertical: 6 }]}></Text>
            <Text style={[styles.colHSN, { paddingVertical: 6 }]}></Text>
            <Text style={[styles.colQty, { paddingVertical: 6 }]}></Text>
            <Text style={[styles.colRate, { paddingVertical: 6 }]}></Text>
            <Text style={[styles.colAmount, { paddingVertical: 6 }]}></Text>
            <Text style={[styles.colDisc, { paddingVertical: 6 }]}></Text>
            <Text style={[styles.colTaxVal, { paddingVertical: 6 }]}></Text>
            {isIntraState && (
              <>
                <View style={[styles.colGstGrp, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 2 }}>CGST</Text></View>
                <View style={[styles.colGstGrp, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 2 }}>SGST</Text></View>
              </>
            )}
            {isInterState && (
              <View style={[styles.colGstGrp, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 2 }}>IGST</Text></View>
            )}
            {isNone && (
              <View style={[styles.colGstGrp, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 2 }}>Tax (0%)</Text></View>
            )}
            <Text style={[styles.colTotal, { paddingVertical: 6 }]}></Text>
          </View>

          {/* Table Header Row 2 */}
          <View style={styles.tableHeaderSecondary}>
            <Text style={styles.colSNo}>S.No</Text>
            <Text style={styles.colDesc}>Product Description</Text>
            <Text style={styles.colHSN}>HSN Code</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
            <Text style={styles.colDisc}>Discount</Text>
            <Text style={styles.colTaxVal}>Taxable Value</Text>
            {isIntraState && (
              <>
                <View style={[styles.colGstGrp, { flexDirection: 'row' }]}>
                  <Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text>
                </View>
                <View style={[styles.colGstGrp, { flexDirection: 'row' }]}>
                  <Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text>
                </View>
              </>
            )}
            {isInterState && (
              <View style={[styles.colGstGrp, { flexDirection: 'row' }]}>
                <Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text>
              </View>
            )}
            {isNone && (
              <View style={[styles.colGstGrp, { flexDirection: 'row' }]}>
                <Text style={styles.colGstAmt}>Amt</Text>
              </View>
            )}
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {/* Table Data Rows */}
          {invoiceData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colSNo}>{index + 1}</Text>
              <Text style={[styles.colDesc, styles.bold]}>{item.description}</Text>
              <Text style={styles.colHSN}>{item.hsn}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colRate}>{item.rate}</Text>
              <Text style={styles.colAmount}>{item.amount}</Text>
              <Text style={styles.colDisc}>{item.discount}</Text>
              <Text style={styles.colTaxVal}>{item.taxableValue.toFixed(2)}</Text>
              {isIntraState && (
                <>
                  <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}>
                    <Text style={styles.colGstRate}>{item.cgstRate}%</Text><Text style={styles.colGstAmt}>{item.cgstAmount?.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}>
                    <Text style={styles.colGstRate}>{item.sgstRate}%</Text><Text style={styles.colGstAmt}>{item.sgstAmount?.toFixed(2)}</Text>
                  </View>
                </>
              )}
              {isInterState && (
                <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}>
                  <Text style={styles.colGstRate}>{item.igstRate}%</Text><Text style={styles.colGstAmt}>{item.igstAmount?.toFixed(2)}</Text>
                </View>
              )}
              {isNone && (
                <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}>
                  <Text style={styles.colGstAmt}>0.00</Text>
                </View>
              )}
              <Text style={[styles.colTotal, { textAlign: 'right' }]}>{item.total.toFixed(2)}</Text>
            </View>
          ))}

          {/* Filler Rows (Fixed 10 rows to force full page look) */}
          {Array.from({ length: Math.max(0, 10 - invoiceData.items.length) }).map((_, i) => (
            <View key={`filler-${i}`} style={styles.tableRow}>
              <Text style={styles.colSNo}> </Text><Text style={styles.colDesc}> </Text><Text style={styles.colHSN}> </Text><Text style={styles.colQty}> </Text><Text style={styles.colRate}> </Text><Text style={styles.colAmount}> </Text><Text style={styles.colDisc}> </Text><Text style={styles.colTaxVal}> </Text>
              {isIntraState && <><View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}> </Text><Text style={styles.colGstAmt}> </Text></View><View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}> </Text><Text style={styles.colGstAmt}> </Text></View></>}
              {isInterState && <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}> </Text><Text style={styles.colGstAmt}> </Text></View>}
              {isNone && <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstAmt}> </Text></View>}
              <Text style={styles.colTotal}> </Text>
            </View>
          ))}

          {/* Table Totals Row */}
          <View style={styles.tableTotalRow}>
            <Text style={{ width: 25 + 45 + 2, borderRight: '1pt solid #000', padding: 2, flex: 1, textAlign: 'center' }}>Total</Text>
            <Text style={styles.colHSN}> </Text>
            <Text style={styles.colQty}>{invoiceData.items.reduce((acc, curr) => acc + curr.qty, 0)}</Text>
            <Text style={styles.colRate}>###</Text>
            <Text style={styles.colAmount}>####</Text>
            <Text style={styles.colDisc}>{invoiceData.items.reduce((acc, curr) => acc + curr.discount, 0)}</Text>
            <Text style={styles.colTaxVal}>{invoiceData.subtotal.toFixed(2)}</Text>
            {isIntraState && (
              <><View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>####</Text><Text style={styles.colGstAmt}>###</Text></View>
                <View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>####</Text><Text style={styles.colGstAmt}>###</Text></View></>
            )}
            {isInterState && (
              <View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>####</Text><Text style={styles.colGstAmt}>###</Text></View>
            )}
            {isNone && (
              <View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstAmt}>###</Text></View>
            )}
            <Text style={[styles.colTotal, { textAlign: 'right' }]}>{Math.round(invoiceData.grandTotal)}</Text>
          </View>

          {/* 7. TOTALS SUMMARY */}
          <View style={styles.summarySection}>
            <View style={styles.wordsBox}>
              <Text style={styles.wordsTitle}>TOTAL INVOICE AMOUNT IN WORDS</Text>
              <Text style={styles.wordsAmount}>{numberToWords(Math.round(invoiceData.grandTotal))} ONLY</Text>
            </View>
            <View style={styles.totalsBox}>
              <View style={styles.totRow}>
                <Text style={styles.totLabel}>TOTAL AMOUNT BEFORE TAX</Text>
                <Text style={styles.totValue}>{invoiceData.subtotal.toFixed(2)}</Text>
              </View>
              {isIntraState && (
                <>
                  <View style={styles.totRow}>
                    <Text style={styles.totLabel}>ADD: CGST</Text>
                    <Text style={styles.totValue}>{invoiceData.cgstTotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.totRow}>
                    <Text style={styles.totLabel}>ADD: SGST</Text>
                    <Text style={styles.totValue}>{invoiceData.sgstTotal.toFixed(2)}</Text>
                  </View>
                </>
              )}
              {isInterState && (
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>ADD: IGST</Text>
                  <Text style={styles.totValue}>{invoiceData.igstTotal.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.totRow}>
                <Text style={styles.totLabel}>TOTAL TAX AMOUNT</Text>
                <Text style={styles.totValue}>{totalTaxAmount.toFixed(2)}</Text>
              </View>
              <View style={[styles.totRow, { backgroundColor: '#f2f2f2' }]}>
                <Text style={styles.totLabel}>TOTAL AMOUNT AFTER TAX</Text>
                <Text style={styles.totValue}>{invoiceData.grandTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.totRowLast}>
                <Text style={styles.totLabel}>GST ON REVERSE CHARGE</Text>
                <Text style={styles.totValue}>0.00</Text>
              </View>
            </View>
          </View>

          {/* 8. BOTTOM FOOTER */}
          <View style={styles.footerRow}>
            {/* Left: Bank Details */}
            <View style={styles.footerBank}>
              <Text style={styles.bankTitle}>Bank Details</Text>
              <View style={styles.bankContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bankDetailsText}>Bank Name: {invoiceData.seller.bank.name}</Text>
                  <Text style={styles.bankDetailsText}>Branch Name: {invoiceData.seller.bank.branch}</Text>
                  <Text style={styles.bankDetailsText}>Account No: {invoiceData.seller.bank.accountNo}</Text>
                  <Text style={styles.bankDetailsText}>Bank IFSC: {invoiceData.seller.bank.ifsc}</Text>
                </View>
                {invoiceData.upiId && invoiceData.showUpiQr && (
                  <View style={styles.qrContainer}>
                    <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${invoiceData.upiId}&pn=${encodeURIComponent(invoiceData.seller.name)}&am=${invoiceData.grandTotal.toFixed(2)}&cu=INR`)}`} style={styles.qrCode} />
                    <Text style={styles.qrLabel}>SCAN TO PAY</Text>
                  </View>
                )}
              </View>
              <Text style={styles.termsText}>Terms & Conditions Apply</Text>
            </View>

            {/* Center: Common Seal */}
            <View style={styles.footerSeal}>
              <Text style={styles.sealLabel}>Common Seal</Text>
            </View>

            {/* Right: Authorised Signatory */}
            <View style={styles.footerSign}>
              <Text style={styles.certText}>Certified that the particulars given above are true and correct.</Text>
              <Text style={styles.authCompany}>FOR {invoiceData.seller.name}</Text>
              {invoiceData.showDigitalSignature ? (
                <Image src={invoiceData.signatureUrl || "https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Snow_Signature.png"} style={styles.signatureImage} />
              ) : (
                <View style={{ height: 35, marginVertical: 4 }}></View>
              )}
              <Text style={styles.authLabel}>AUTHORISED SIGNATORY</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
};

export default FiscalInvoice;