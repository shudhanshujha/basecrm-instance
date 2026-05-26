import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { numberToWords } from '../../lib/numberToWords';

// Colors — EXACT values as per source of truth
const COLORS = {
  headerBg: '#BDD7EE', // light steel blue
  black: '#000000',
  white: '#FFFFFF',
  border: '#000000',
};

const styles = StyleSheet.create({
  page: {
    padding: '10mm', // Spec: 10mm margins
    fontSize: 7,     // Spec: 7pt body text
    fontFamily: 'Helvetica',
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  container: {
    border: '1pt solid ' + COLORS.border,
    flexDirection: 'column',
    width: '100%',
  },
  
  // 1. COMPANY HEADER
  header: {
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 85,
  },
  logoBox: {
    width: 60,
    alignItems: 'center',
  },
  logo: {
    width: 55,
    height: 55,
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    textAlign: 'center',
    paddingRight: 60, 
  },
  companyName: {
    fontSize: 22, // Spec: 22pt bold
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  companySubInfo: {
    fontSize: 9, 
    marginBottom: 0.5,
  },
  gstinLineContainer: {
    marginTop: 2,
    paddingTop: 3,
    borderTop: '0.5pt solid ' + COLORS.border,
    alignSelf: 'center',
    width: '100%',
  },
  gstinText: {
    fontSize: 9, 
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // 2. INVOICE TITLE BAR
  invoiceTitleBar: {
    backgroundColor: COLORS.headerBg,
    borderBottom: '1pt solid ' + COLORS.border,
    textAlign: 'center',
    paddingVertical: 1.5,
    fontWeight: 'bold',
    fontSize: 8,
    textTransform: 'uppercase',
  },

  // 3. INVOICE METADATA GRID
  metaGrid: {
    flexDirection: 'column',
    borderBottom: '1pt solid ' + COLORS.border,
  },
  metaInnerRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid ' + COLORS.border,
  },
  metaCol: {
    width: '50%',
  },
  metaItem: {
    flexDirection: 'row',
    borderBottom: '1pt solid ' + COLORS.border,
    height: 14, 
    alignItems: 'center',
  },
  metaItemLast: {
    flexDirection: 'row',
    height: 14,
    alignItems: 'center',
  },
  metaLabel: {
    width: 90,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid ' + COLORS.border,
    fontSize: 8,
  },
  metaValue: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 8,
  },
  msmeFullRow: {
    flexDirection: 'row',
    height: 15,
    alignItems: 'center',
  },
  msmeLabel: {
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid ' + COLORS.border,
    fontSize: 8,
    width: 150,
  },

  // 4. PARTY SECTION
  partyHeaderGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.headerBg,
    borderBottom: '1pt solid ' + COLORS.border,
  },
  partyHeaderCell: {
    width: '50%',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 8,
  },
  partyDataGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid ' + COLORS.border,
    minHeight: 65,
  },
  partyBox: {
    width: '50%',
    padding: 4,
  },
  partyLine: {
    flexDirection: 'row',
    marginBottom: 1,
    fontSize: 8,
  },
  partyLabel: {
    fontWeight: 'bold',
    width: 45,
  },
  partyValue: {
    flex: 1,
  },

  // 5. SERVICE DESCRIPTION
  descHeaderLine: {
    padding: 3,
    fontSize: 7, 
    borderBottom: '1pt solid ' + COLORS.border,
  },

  // 6. ITEMS TABLE
  table: {
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.headerBg,
    borderBottom: '1pt solid ' + COLORS.border,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid ' + COLORS.border,
    height: 12, 
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 7,
  },
  tableTotalRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.headerBg,
    borderBottom: '1pt solid ' + COLORS.border,
    height: 16,
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 7,
  },

  // SPECIFIC COLUMN WIDTHS
  col1: { width: '4%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center' },
  col2: { width: '25%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center', textAlign: 'left', paddingLeft: 3 },
  col3: { width: '7%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center' },
  col4: { width: '5%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center' },
  col5: { width: '6%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center' },
  col6: { width: '7%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center' },
  col7: { width: '7%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center' },
  col8: { width: '8%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center' },
  colGstGrp: { width: '12%', borderRight: '1pt solid ' + COLORS.border, height: '100%' }, 
  colGstRate: { width: '50%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center' }, 
  colGstAmt: { width: '50%', height: '100%', justifyContent: 'center' }, 
  col11: { width: '7%', height: '100%', justifyContent: 'center', fontWeight: 'bold' },

  // 7. TOTALS SUMMARY
  summaryHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.headerBg,
    borderBottom: '1pt solid ' + COLORS.border,
  },
  summaryHeaderLeft: {
    width: '65%',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 8,
    borderRight: '1pt solid ' + COLORS.border,
  },
  summaryDataGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid ' + COLORS.border,
  },
  summaryWordsBox: {
    width: '65%',
    borderRight: '1pt solid ' + COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  summaryWordsText: {
    fontSize: 11, // Spec: 11pt bold italic centered
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summaryTotalsBox: {
    width: '35%',
  },
  totalsRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid ' + COLORS.border,
    height: 14,
    alignItems: 'center',
  },
  totalsLabel: {
    width: '65%',
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid ' + COLORS.border,
    fontSize: 7,
  },
  totalsValue: {
    width: '35%',
    paddingHorizontal: 4,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 7.5,
  },

  // 8. BOTTOM FOOTER
  footerRow: {
    flexDirection: 'row',
    minHeight: 100,
  },
  footerBankBox: {
    width: '35%',
    borderRight: '1pt solid ' + COLORS.border,
  },
  footerSealBox: {
    width: '20%',
    borderRight: '1pt solid ' + COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerSignBox: {
    width: '45%',
    padding: 5,
    justifyContent: 'space-between',
  },

  bankHeader: {
    backgroundColor: COLORS.headerBg,
    borderBottom: '1pt solid ' + COLORS.border,
    textAlign: 'center',
    paddingVertical: 1.5,
    fontWeight: 'bold',
    fontSize: 8,
  },
  bankContent: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankText: {
    fontSize: 8,
    lineHeight: 1.4,
    fontWeight: 'bold',
  },
  qrWrap: {
    alignItems: 'center',
    width: 50,
  },
  qrImg: {
    width: 40,
    height: 40,
  },
  qrLabel: {
    fontSize: 6,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 1,
  },
  termsBox: {
    borderTop: '1pt solid ' + COLORS.border,
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 7,
    marginTop: 'auto',
  },
  sealText: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  certText: {
    fontSize: 7,
    fontStyle: 'italic',
  },
  authForCompany: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  signatureHLine: {
    marginTop: 20,
    borderTop: '1pt solid ' + COLORS.border,
    width: '80%',
    alignSelf: 'center',
  },
  authSignLabel: {
    textAlign: 'center',
    paddingTop: 2,
    fontWeight: 'bold',
    fontSize: 8,
  },
  bold: { fontWeight: 'bold' },
});

interface FiscalInvoiceProps {
  invoiceData: any;
}

const FiscalInvoice: React.FC<FiscalInvoiceProps> = ({ invoiceData }) => {
  const isIntraState = invoiceData.gstConfig === 'INTRA';
  const isInterState = invoiceData.gstConfig === 'INTER';
  const totalTaxAmountValue = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);

  const phoneStr = Array.isArray(invoiceData.seller.phone) 
    ? invoiceData.seller.phone.join(', ') 
    : invoiceData.seller.phone;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          
          {/* SECTION 1: COMPANY HEADER */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Image src="/dvs_logo.jpg" style={styles.logo} />
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={styles.companySubInfo}>{invoiceData.seller.address}</Text>
              <Text style={styles.companySubInfo}>Phone: {phoneStr}</Text>
              <Text style={styles.companySubInfo}>E Mail: {invoiceData.seller.email}</Text>
              <View style={styles.gstinLineContainer}>
                <Text style={styles.gstinText}>GSTIN NUMBER : {invoiceData.seller.gstin}</Text>
              </View>
            </View>
          </View>

          {/* SECTION 2: METADATA GRID */}
          <View style={styles.invoiceTitleBar}><Text>Invoice</Text></View>
          <View style={styles.metaGrid}>
            <View style={styles.metaInnerRow}>
              <View style={[styles.metaCol, { borderRight: '1pt solid ' + COLORS.border }]}>
                <View style={styles.metaItem}><Text style={styles.metaLabel}>Invoice No:</Text><Text style={styles.metaValue}>{invoiceData.invoiceNumber}</Text></View>
                <View style={styles.metaItem}><Text style={styles.metaLabel}>Invoice Date:</Text><Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text></View>
                <View style={styles.metaItem}><Text style={styles.metaLabel}>Reverse Charge:</Text><Text style={styles.metaValue}>{invoiceData.reverseCharge || 'N'}</Text></View>
                <View style={styles.metaItemLast}>
                  <Text style={styles.metaLabel}>State:</Text>
                  <Text style={styles.metaValue}>{invoiceData.seller.state} | Code: {invoiceData.seller.stateCode}</Text>
                </View>
              </View>
              <View style={styles.metaCol}>
                <View style={styles.metaItem}><Text style={styles.metaLabel}>Transport Mode:</Text><Text style={styles.metaValue}>{invoiceData.transportMode || '-'}</Text></View>
                <View style={styles.metaItem}><Text style={styles.metaLabel}>Vehicle number:</Text><Text style={styles.metaValue}>{invoiceData.vehicleNumber || '-'}</Text></View>
                <View style={styles.metaItem}><Text style={styles.metaLabel}>Date of Supply:</Text><Text style={styles.metaValue}>{invoiceData.dateOfSupply}</Text></View>
                <View style={styles.metaItemLast}><Text style={styles.metaLabel}>Place of Supply:</Text><Text style={[styles.metaValue, { textTransform: 'uppercase' }]}>{invoiceData.placeOfSupply}</Text></View>
              </View>
            </View>
            <View style={styles.msmeFullRow}>
              <Text style={styles.msmeLabel}>MSME REGISTRATION NO.:</Text>
              <Text style={[styles.metaValue, styles.bold]}>{invoiceData.seller.msmeRegNo}</Text>
            </View>
          </View>

          {/* SECTION 3: PARTY DETAILS */}
          <View style={styles.partyHeaderGrid}>
            <Text style={[styles.partyHeaderCell, { borderRight: '1pt solid ' + COLORS.border }]}>Invoice to Party</Text>
            <Text style={styles.partyHeaderCell}>Ship to Party</Text>
          </View>
          <View style={styles.partyDataGrid}>
            <View style={[styles.partyBox, { borderRight: '1pt solid ' + COLORS.border }]}>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>State:</Text><Text style={styles.partyValue}>{invoiceData.buyer.state || '-'} | Code: {invoiceData.buyer.stateCode || '-'}</Text></View>
            </View>
            <View style={styles.partyBox}>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>State:</Text><Text style={styles.partyValue}>{invoiceData.buyer.state || '-'} | Code: {invoiceData.buyer.stateCode || '-'}</Text></View>
            </View>
          </View>

          {/* SECTION 4: SERVICE DESCRIPTION */}
          <View style={styles.descHeaderLine}><Text>{invoiceData.descriptionHeader}</Text></View>

          {/* SECTION 5: ITEMS TABLE */}
          <View style={styles.table}>
            {/* Header Row 1 */}
            <View style={styles.tableHeader}>
              <View style={styles.col1}></View><View style={styles.col2}></View><View style={styles.col3}></View><View style={styles.col4}></View><View style={styles.col5}></View><View style={styles.col6}></View><View style={styles.col7}></View><View style={styles.col8}></View>
              {isIntraState && <><View style={[styles.colGstGrp, { borderBottom: '1pt solid ' + COLORS.border }]}><Text style={{ padding: 1 }}>CGST</Text></View><View style={[styles.colGstGrp, { borderBottom: '1pt solid ' + COLORS.border }]}><Text style={{ padding: 1 }}>SGST</Text></View></>}
              {isInterState && <View style={[styles.colGstGrp, { borderBottom: '1pt solid ' + COLORS.border, width: '24%' }]}><Text style={{ padding: 1 }}>IGST</Text></View>}
              <View style={styles.col11}></View>
            </View>
            {/* Header Row 2 */}
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>S.No</Text><Text style={styles.col2}>Product Description</Text><Text style={styles.col3}>HSN</Text><Text style={styles.col4}>Qty</Text><Text style={styles.col5}>Rate</Text><Text style={styles.col6}>Amount</Text><Text style={styles.col7}>Discount</Text><Text style={styles.col8}>TaxVal</Text>
              {isIntraState && <><View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text></View><View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text></View></>}
              {isInterState && <View style={[styles.colGstGrp, { flexDirection: 'row', width: '24%' }]}><Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text></View>}
              <Text style={styles.col11}>Total</Text>
            </View>

            {/* Data Rows */}
            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.col1}>{i + 1}</Text><Text style={[styles.col2, styles.bold]}>{item.description}</Text><Text style={styles.col3}>{item.hsn}</Text><Text style={styles.col4}>{item.qty}</Text><Text style={styles.col5}>{item.rate}</Text><Text style={styles.col6}>{item.amount}</Text><Text style={styles.col7}>{item.discount}</Text><Text style={styles.col8}>{item.taxableValue.toFixed(2)}</Text>
                {isIntraState && <><View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}>{item.cgstRate}%</Text><Text style={styles.colGstAmt}>{item.cgstAmount?.toFixed(2)}</Text></View><View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}>{item.sgstRate}%</Text><Text style={styles.colGstAmt}>{item.sgstAmount?.toFixed(2)}</Text></View></>}
                {isInterState && <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%', width: '24%' }]}><Text style={styles.colGstRate}>{item.igstRate}%</Text><Text style={styles.colGstAmt}>{item.igstAmount?.toFixed(2)}</Text></View>}
                <Text style={[styles.col11, { textAlign: 'right' }]}>{item.total.toFixed(2)}</Text>
              </View>
            ))}

            {/* Filler rows - Spec: 10 rows at 12px */}
            {Array.from({ length: 10 }).map((_, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.col1}> </Text><Text style={styles.col2}> </Text><Text style={styles.col3}> </Text><Text style={styles.col4}> </Text><Text style={styles.col5}> </Text><Text style={styles.col6}> </Text><Text style={styles.col7}> </Text><Text style={styles.col8}> </Text>{isIntraState && <><View style={styles.colGstGrp}></View><View style={styles.colGstGrp}></View></>}{isInterState && <View style={[styles.colGstGrp, {width: '24%'}]}></View>}<Text style={styles.col11}> </Text>
              </View>
            ))}

            {/* Total Row */}
            <View style={styles.tableTotalRow}>
              <Text style={{ width: '36%', borderRight: '1pt solid ' + COLORS.border, height: '100%', justifyContent: 'center', textAlign: 'center' }}>Total</Text>
              <Text style={styles.col4}>{invoiceData.items.reduce((acc: any, c: any) => acc + (parseFloat(c.qty) || 0), 0)}</Text>
              <Text style={styles.col5}></Text>
              <Text style={styles.col6}></Text>
              <Text style={styles.col7}>{invoiceData.items.reduce((acc: any, c: any) => acc + (parseFloat(c.discount) || 0), 0)}</Text>
              <Text style={styles.col8}>{invoiceData.subtotal.toFixed(2)}</Text>
              {isIntraState && <><View style={styles.colGstGrp}></View><View style={styles.colGstGrp}></View></>}
              {isInterState && <View style={[styles.colGstGrp, {width: '24%'}]}></View>}
              <Text style={[styles.col11, { textAlign: 'right' }]}>{Math.round(invoiceData.grandTotal)}</Text>
            </View>
          </View>

          <View wrap={false}>
            {/* SECTION 6: SUMMARY */}
            <View style={styles.summaryHeaderRow}>
               <Text style={styles.summaryHeaderLeft}>TOTAL INVOICE AMOUNT IN WORDS</Text>
               <View style={styles.summaryTotalsBox}></View>
            </View>
            <View style={styles.summaryDataGrid}>
              <View style={styles.summaryWordsBox}>
                <Text style={styles.summaryWordsText}>{numberToWords(Math.round(invoiceData.grandTotal))}</Text>
              </View>
              <View style={styles.summaryTotalsBox}>
                <View style={styles.totalsRow}><Text style={styles.totalsLabel}>TOTAL AMOUNT BEFORE TAX</Text><Text style={styles.totalsValue}>{invoiceData.subtotal.toFixed(2)}</Text></View>
                {isIntraState && <><View style={styles.totalsRow}><Text style={styles.totalsLabel}>Add: CGST</Text><Text style={styles.totalsValue}>{invoiceData.cgstTotal.toFixed(2)}</Text></View><View style={styles.totalsRow}><Text style={styles.totalsLabel}>Add: SGST</Text><Text style={styles.totalsValue}>{invoiceData.sgstTotal.toFixed(2)}</Text></View></>}
                {isInterState && <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Add: IGST</Text><Text style={styles.totalsValue}>{invoiceData.igstTotal.toFixed(2)}</Text></View>}
                <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Total Tax Amount</Text><Text style={styles.totalsValue}>{totalTaxAmountValue.toFixed(2)}</Text></View>
                <View style={[styles.totalsRow, { backgroundColor: COLORS.white }]}><Text style={styles.totalsLabel}>Total Amount After Tax</Text><Text style={styles.totalsValue}>{invoiceData.grandTotal.toFixed(2)}</Text></View>
                <View style={{ flexDirection: 'row', height: 14, alignItems: 'center' }}><Text style={styles.totalsLabel}>GST ON REVERSE CHARGE</Text><Text style={styles.totalsValue}>0.00</Text></View>
              </View>
            </View>

            {/* SECTION 7: FOOTER */}
            <View style={styles.footerRow}>
              <View style={styles.footerBankBox}>
                <View style={styles.bankHeader}><Text>Bank Details</Text></View>
                <View style={styles.bankContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankText}>Bank Name: {invoiceData.seller.bank.name}</Text>
                    <Text style={styles.bankText}>Branch Name: {invoiceData.seller.bank.branch}</Text>
                    <Text style={styles.bankText}>Account No: {invoiceData.seller.bank.accountNo}</Text>
                    <Text style={styles.bankText}>Bank IFSC: {invoiceData.seller.bank.ifsc}</Text>
                  </View>
                  {invoiceData.upiId && invoiceData.showUpiQr && (
                    <View style={styles.qrWrap}>
                      <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${invoiceData.upiId}&pn=${encodeURIComponent(invoiceData.seller.name)}&am=${invoiceData.grandTotal.toFixed(2)}&cu=INR`)}`} style={styles.qrImg} />
                      <Text style={styles.qrLabel}>SCAN TO PAY</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.termsBox}>Terms & Conditions Apply</Text>
              </View>
              <View style={styles.footerSealBox}>
                <Text style={styles.sealText}>Common Seal</Text>
              </View>
              <View style={styles.footerSignBox}>
                <Text style={styles.certText}>Certified that the particulars given above are true and correct.</Text>
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                  <Text style={styles.authForCompany}>FOR {invoiceData.seller.name}</Text>
                  {invoiceData.showDigitalSignature && <Image src={invoiceData.signatureUrl} style={{ width: 80, height: 30, objectFit: 'contain' }} />}
                </View>
                <View style={styles.signatureHLine}></View>
                <Text style={styles.authSignLabel}>AUTHORISED SIGNATORY</Text>
              </View>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
};

export default FiscalInvoice;
