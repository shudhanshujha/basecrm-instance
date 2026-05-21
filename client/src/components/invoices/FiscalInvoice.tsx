import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { numberToWords } from '../../lib/numberToWords';

// Define styles to match the EXACT preview format with single-page compression
const styles = StyleSheet.create({
  page: {
    padding: '12mm', // Slightly reduced margins to fit more on one page
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
    padding: 8,
    borderBottom: '1pt solid #000',
    position: 'relative',
    minHeight: 85,
  },
  logoBox: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 65,
    height: 65,
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
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  companySubInfo: {
    fontSize: 9,
    marginBottom: 1,
  },
  gstinLine: {
    marginTop: 5,
    paddingTop: 3,
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
    paddingVertical: 1,
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
    minHeight: 16,
    alignItems: 'center',
  },
  metaRowLast: {
    flexDirection: 'row',
    minHeight: 16,
    alignItems: 'center',
  },
  metaLabel: {
    width: 100,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 7.5,
  },
  metaValue: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 8.5,
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
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 9,
  },
  partyDataGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 70,
  },
  partyDataBox: {
    width: '50%',
    padding: 4,
  },
  partyLine: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  partyLabel: {
    fontWeight: 'bold',
    width: 45,
    fontSize: 8.5,
  },
  partyValue: {
    flex: 1,
    fontSize: 8.5,
  },

  // 5. SERVICE DESCRIPTION
  descHeader: {
    padding: 3,
    fontWeight: 'bold',
    borderBottom: '1pt solid #000',
    fontSize: 8,
  },

  // 6. ITEMS TABLE
  tableHeaderPrimary: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 7,
  },
  tableHeaderSecondary: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #000',
    minHeight: 18,
    alignItems: 'center',
    textAlign: 'center',
  },
  tableTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    minHeight: 18,
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 8,
  },

  // TABLE COLUMNS
  colSNo: { width: 25, borderRight: '1pt solid #000', padding: 2 },
  colDesc: { flex: 1, borderRight: '1pt solid #000', padding: 3, textAlign: 'left' },
  colHSN: { width: 45, borderRight: '1pt solid #000', padding: 2 },
  colQty: { width: 25, borderRight: '1pt solid #000', padding: 2 },
  colRate: { width: 40, borderRight: '1pt solid #000', padding: 2 },
  colAmount: { width: 45, borderRight: '1pt solid #000', padding: 2 },
  colDisc: { width: 35, borderRight: '1pt solid #000', padding: 2 },
  colTaxVal: { width: 55, borderRight: '1pt solid #000', padding: 2 }, // Slightly wider
  colGstGrp: { width: 50, borderRight: '1pt solid #000' }, 
  colGstRate: { width: 20, borderRight: '1pt solid #000', padding: 1 },
  colGstAmt: { width: 30, padding: 1 },
  colTotal: { width: 55, padding: 2, fontWeight: 'bold' },

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
    paddingVertical: 2,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  wordsAmount: {
    padding: 10,
    textAlign: 'center',
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  totalsBox: {
    width: 210,
  },
  totRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 16,
    alignItems: 'center',
  },
  totRowLast: {
    flexDirection: 'row',
    minHeight: 16,
    alignItems: 'center',
  },
  totLabel: {
    width: 135,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    textTransform: 'uppercase',
    fontSize: 7,
  },
  totValue: {
    flex: 1,
    paddingHorizontal: 4,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 8.5,
  },

  // 8. BOTTOM FOOTER
  footerRow: {
    flexDirection: 'row',
    minHeight: 95,
  },
  footerBank: {
    width: 230,
    borderRight: '1pt solid #000',
  },
  footerSeal: {
    flex: 1,
    borderRight: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  footerSign: {
    width: 200,
    padding: 4,
    justifyContent: 'space-between',
  },
  
  bankTitle: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
  },
  bankContent: {
    padding: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankDetailsText: {
    lineHeight: 1.25,
    fontWeight: 'bold',
    fontSize: 8,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  qrCode: {
    width: 45,
    height: 45,
  },
  termsText: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 8,
    marginTop: 'auto',
  },
  sealLabel: {
    fontWeight: 'bold',
    fontSize: 9,
    width: '100%',
    textAlign: 'center',
    borderTop: '1pt solid #000',
    paddingVertical: 1,
  },
  certText: {
    fontSize: 6.5,
    fontStyle: 'italic',
  },
  authCompany: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 8.5,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  signatureImage: {
    width: 80,
    height: 30,
    objectFit: 'contain',
    alignSelf: 'center',
  },
  authLabel: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingTop: 3,
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
  const isNone = invoiceData.gstConfig === 'NONE';
  const totalTaxAmount = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);

  const phoneString = Array.isArray(invoiceData.seller.phone) 
    ? invoiceData.seller.phone.join(', ') 
    : invoiceData.seller.phone;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <View style={styles.logoBox}><Image src="/dvs_logo.jpg" style={styles.logo} /></View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={styles.companySubInfo}>{invoiceData.seller.address}</Text>
              <Text style={styles.companySubInfo}>Phone: {phoneString}</Text>
              <Text style={styles.companySubInfo}>E Mail: {invoiceData.seller.email}</Text>
              <View style={styles.gstinLine}><Text style={styles.gstinText}>GSTIN NUMBER : {invoiceData.seller.gstin}</Text></View>
            </View>
          </View>

          <View style={styles.titleBar}><Text>Invoice</Text></View>

          <View style={styles.metaGrid}>
            <View style={[styles.metaCol, { borderRight: '1pt solid #000' }]}>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Invoice No:</Text><Text style={[styles.metaValue, styles.bold]}>{invoiceData.invoiceNumber}</Text></View>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Invoice Date:</Text><Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text></View>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Reverse Charge:</Text><Text style={styles.metaValue}>{invoiceData.reverseCharge || 'N'}</Text></View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={{ flex: 1, paddingHorizontal: 4 }}>{invoiceData.seller.state}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingHorizontal: 4 }}>Code:</Text>
                  <Text style={{ paddingHorizontal: 4 }}>{invoiceData.seller.stateCode}</Text>
                </View>
              </View>
              <View style={styles.metaRowLast}><Text style={[styles.metaLabel, { fontSize: 7 }]}>MSME REGISTRATION NO.:</Text><Text style={[styles.metaValue, styles.bold]}>{invoiceData.seller.msmeRegNo}</Text></View>
            </View>
            <View style={styles.metaCol}>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Transport Mode:</Text><Text style={styles.metaValue}>{invoiceData.transportMode || '-'}</Text></View>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Vehicle number:</Text><Text style={styles.metaValue}>{invoiceData.vehicleNumber || '-'}</Text></View>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Date of Supply:</Text><Text style={styles.metaValue}>{invoiceData.dateOfSupply}</Text></View>
              <View style={styles.metaRowLast}><Text style={styles.metaLabel}>Place of Supply:</Text><Text style={[styles.metaValue, { textTransform: 'uppercase' }]}>{invoiceData.placeOfSupply}</Text></View>
            </View>
          </View>

          <View style={styles.partyHeaderGrid}>
            <Text style={[styles.partyHeaderCell, { borderRight: '1pt solid #000' }]}>Invoice to Party</Text>
            <Text style={styles.partyHeaderCell}>Ship to Party</Text>
          </View>
          <View style={styles.partyDataGrid}>
            <View style={[styles.partyDataBox, { borderRight: '1pt solid #000' }]}>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={{ flex: 1 }}>{invoiceData.buyer.state || '-'}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingLeft: 4 }}>Code:</Text><Text style={{ paddingLeft: 4 }}>{invoiceData.buyer.stateCode || '-'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.partyDataBox}>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyLine}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyLine}>
                <Text style={styles.partyLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={{ flex: 1 }}>{invoiceData.buyer.state || '-'}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingLeft: 4 }}>Code:</Text><Text style={{ paddingLeft: 4 }}>{invoiceData.buyer.stateCode || '-'}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.descHeader}><Text>{invoiceData.descriptionHeader}</Text></View>

          <View style={styles.table}>
            <View style={styles.tableHeaderPrimary}>
              <Text style={styles.colSNo}></Text><Text style={styles.colDesc}></Text><Text style={styles.colHSN}></Text><Text style={styles.colQty}></Text><Text style={styles.colRate}></Text><Text style={styles.colAmount}></Text><Text style={styles.colDisc}></Text><Text style={styles.colTaxVal}></Text>
              {isIntraState && <><Text style={[styles.colGstGrp, { borderBottom: '1pt solid #000', padding: 2 }]}>CGST</Text><Text style={[styles.colGstGrp, { borderBottom: '1pt solid #000', padding: 2 }]}>SGST</Text></>}
              {isInterState && <Text style={[styles.colGstGrp, { borderBottom: '1pt solid #000', padding: 2 }]}>IGST</Text>}
              <Text style={styles.colTotal}></Text>
            </View>
            <View style={styles.tableHeaderSecondary}>
              <Text style={styles.colSNo}>S.No</Text><Text style={styles.colDesc}>Product Description</Text><Text style={styles.colHSN}>HSN Code</Text><Text style={styles.colQty}>Qty</Text><Text style={styles.colRate}>Rate</Text><Text style={styles.colAmount}>Amount</Text><Text style={styles.colDisc}>Discount</Text><Text style={styles.colTaxVal}>Taxable Val</Text>
              {isIntraState && <><View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text></View><View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text></View></>}
              {isInterState && <View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>Rate</Text><Text style={styles.colGstAmt}>Amt</Text></View>}
              <Text style={styles.colTotal}>Total</Text>
            </View>

            {invoiceData.items.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colSNo}>{index + 1}</Text><Text style={[styles.colDesc, styles.bold]}>{item.description}</Text><Text style={styles.colHSN}>{item.hsn}</Text><Text style={styles.colQty}>{item.qty}</Text><Text style={styles.colRate}>{item.rate}</Text><Text style={styles.colAmount}>{item.amount}</Text><Text style={styles.colDisc}>{item.discount}</Text><Text style={styles.colTaxVal}>{item.taxableValue.toFixed(2)}</Text>
                {isIntraState && <><View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}>{item.cgstRate}%</Text><Text style={styles.colGstAmt}>{item.cgstAmount?.toFixed(2)}</Text></View><View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}>{item.sgstRate}%</Text><Text style={styles.colGstAmt}>{item.sgstAmount?.toFixed(2)}</Text></View></>}
                {isInterState && <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}>{item.igstRate}%</Text><Text style={styles.colGstAmt}>{item.igstAmount?.toFixed(2)}</Text></View>}
                <Text style={[styles.colTotal, { textAlign: 'right' }]}>{item.total.toFixed(2)}</Text>
              </View>
            ))}

            {Array.from({ length: Math.max(0, 8 - invoiceData.items.length) }).map((_, i) => (
              <View key={`filler-${i}`} style={styles.tableRow}>
                <Text style={styles.colSNo}> </Text><Text style={styles.colDesc}> </Text><Text style={styles.colHSN}> </Text><Text style={styles.colQty}> </Text><Text style={styles.colRate}> </Text><Text style={styles.colAmount}> </Text><Text style={styles.colDisc}> </Text><Text style={styles.colTaxVal}> </Text>{isIntraState && <><View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}> </Text><Text style={styles.colGstAmt}> </Text></View><View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}> </Text><Text style={styles.colGstAmt}> </Text></View></>}{isInterState && <View style={[styles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.colGstRate}> </Text><Text style={styles.colGstAmt}> </Text></View>}<Text style={styles.colTotal}> </Text>
              </View>
            ))}

            <View style={styles.tableTotalRow}>
              <Text style={{ flex: 1, borderRight: '1pt solid #000', textAlign: 'center' }}>Total</Text>
              <Text style={styles.colHSN}> </Text>
              <Text style={styles.colQty}>{invoiceData.items.reduce((acc: any, curr: any) => acc + curr.qty, 0)}</Text>
              <Text style={styles.colRate}>###</Text><Text style={styles.colAmount}>####</Text>
              <Text style={styles.colDisc}>{invoiceData.items.reduce((acc: any, curr: any) => acc + curr.discount, 0)}</Text>
              <Text style={styles.colTaxVal}>{invoiceData.subtotal.toFixed(2)}</Text>
              {isIntraState && <><View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>####</Text><Text style={styles.colGstAmt}>###</Text></View><View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>####</Text><Text style={styles.colGstAmt}>###</Text></View></>}
              {isInterState && <View style={[styles.colGstGrp, { flexDirection: 'row' }]}><Text style={styles.colGstRate}>####</Text><Text style={styles.colGstAmt}>###</Text></View>}
              <Text style={[styles.colTotal, { textAlign: 'right' }]}>{Math.round(invoiceData.grandTotal)}</Text>
            </View>
          </View>

          {/* Wrapper to prevent page break between summary and footer */}
          <View wrap={false}>
            <View style={styles.summarySection}>
              <View style={styles.wordsBox}>
                <Text style={styles.wordsTitle}>TOTAL INVOICE AMOUNT IN WORDS</Text>
                <Text style={styles.wordsAmount}>{numberToWords(Math.round(invoiceData.grandTotal))}</Text>
              </View>
              <View style={styles.totalsBox}>
                <View style={styles.totRow}><Text style={styles.totLabel}>TOTAL AMOUNT BEFORE TAX</Text><Text style={styles.totValue}>{invoiceData.subtotal.toFixed(2)}</Text></View>
                {isIntraState && <><View style={styles.totRow}><Text style={styles.totLabel}>ADD: CGST</Text><Text style={styles.totValue}>{invoiceData.cgstTotal.toFixed(2)}</Text></View><View style={styles.totRow}><Text style={styles.totLabel}>ADD: SGST</Text><Text style={styles.totValue}>{invoiceData.sgstTotal.toFixed(2)}</Text></View></>}
                {isInterState && <View style={styles.totRow}><Text style={styles.totLabel}>ADD: IGST</Text><Text style={styles.totValue}>{invoiceData.igstTotal.toFixed(2)}</Text></View>}
                <View style={styles.totRow}><Text style={styles.totLabel}>TOTAL TAX AMOUNT</Text><Text style={styles.totValue}>{totalTaxAmount.toFixed(2)}</Text></View>
                <View style={[styles.totRow, { backgroundColor: '#f2f2f2' }]}><Text style={styles.totLabel}>TOTAL AMOUNT AFTER TAX</Text><Text style={styles.totValue}>{invoiceData.grandTotal.toFixed(2)}</Text></View>
                <View style={styles.totRowLast}><Text style={styles.totLabel}>GST ON REVERSE CHARGE</Text><Text style={styles.totValue}>0.00</Text></View>
              </View>
            </View>

            <View style={styles.footerRow}>
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
                      <Text style={{ fontSize: 5, fontWeight: 'bold', marginTop: 1 }}>SCAN TO PAY</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.termsText}>Terms & Conditions Apply</Text>
              </View>
              <View style={styles.footerSeal}><Text style={styles.sealLabel}>Common Seal</Text></View>
              <View style={styles.footerSign}>
                <Text style={styles.certText}>Certified that the particulars given above are true and correct.</Text>
                <Text style={styles.authCompany}>FOR {invoiceData.seller.name}</Text>
                {invoiceData.showDigitalSignature && <Image src={invoiceData.signatureUrl} style={styles.signatureImage} />}
                <Text style={styles.authLabel}>AUTHORISED SIGNATORY</Text>
              </View>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
};

export default FiscalInvoice;
