import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { numberToWords } from '../../lib/numberToWords';

// Define styles for a strictly sequential, compact single-page A4 layout
const styles = StyleSheet.create({
  page: {
    padding: '10mm', // Reduced margins to ensure single-page fit
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
    padding: 6,
    borderBottom: '1pt solid #000',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 85,
  },
  logoBox: {
    width: 75,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    textAlign: 'center',
    paddingRight: 75, 
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  companySubInfo: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  gstinLine: {
    marginTop: 4,
    paddingTop: 3,
    borderTop: '0.5pt solid #000',
    alignSelf: 'center',
  },
  gstinText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // 2. INVOICE TITLE BAR
  titleBar: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 1.5,
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },

  // 3. INVOICE METADATA GRID
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
    minHeight: 15,
    alignItems: 'center',
  },
  metaItemLastRow: {
    flexDirection: 'row',
    minHeight: 15,
    alignItems: 'center',
  },
  metaLabel: {
    width: 110, // Increased to prevent MSME hyphenation
    padding: 2,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 7.5,
  },
  metaValue: {
    flex: 1,
    padding: 2,
    fontSize: 8,
  },

  // 4. PARTY SECTION
  partyHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
    fontSize: 9,
  },
  partyHeaderBox: {
    width: '50%',
    textAlign: 'center',
    paddingVertical: 2,
  },
  partyGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 70,
  },
  partyBox: {
    width: '50%',
    padding: 4,
  },
  partyRow: {
    flexDirection: 'row',
    marginBottom: 1.5,
    fontSize: 8.5,
  },
  partyLabel: {
    fontWeight: 'bold',
    width: 45,
  },
  partyValue: {
    flex: 1,
  },

  // 5. SERVICE DESCRIPTION LINE
  descLine: {
    padding: 3,
    fontWeight: 'bold',
    borderBottom: '1pt solid #000',
    fontSize: 8,
    backgroundColor: '#fff',
  },

  // 6. ITEMS TABLE
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #000',
    minHeight: 16,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 8,
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

  // FIXED COLUMN WIDTHS
  c1: { width: 25, borderRight: '1pt solid #000', padding: 2 }, 
  c2: { flex: 1, borderRight: '1pt solid #000', padding: 3, textAlign: 'left' }, 
  c3: { width: 45, borderRight: '1pt solid #000', padding: 2 }, 
  c4: { width: 25, borderRight: '1pt solid #000', padding: 2 }, 
  c5: { width: 40, borderRight: '1pt solid #000', padding: 2 }, 
  c6: { width: 45, borderRight: '1pt solid #000', padding: 2 }, 
  c7: { width: 40, borderRight: '1pt solid #000', padding: 2 }, 
  c8: { width: 55, borderRight: '1pt solid #000', padding: 2 }, 
  c9: { width: 55, borderRight: '1pt solid #000' }, 
  c10: { width: 55, padding: 2, fontWeight: 'bold' }, 

  // 7. TOTALS SUMMARY
  summarySection: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  wordsContainer: {
    flex: 1,
    borderRight: '1pt solid #000',
  },
  wordsHeader: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 9,
  },
  wordsContent: {
    padding: 8,
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
    justifyContent: 'center',
    flex: 1,
  },
  totalsContainer: {
    width: 230,
  },
  totalsRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 15,
    alignItems: 'center',
  },
  totalsLabel: {
    width: 140,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 7.5,
    textTransform: 'uppercase',
  },
  totalsValue: {
    flex: 1,
    paddingHorizontal: 4,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 8.5,
  },

  // 8. BOTTOM FOOTER
  footerRow: {
    flexDirection: 'row',
    minHeight: 90,
  },
  footerBank: {
    width: 230,
    borderRight: '1pt solid #000',
  },
  footerCenter: {
    flex: 1,
    borderRight: '1pt solid #000',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRight: {
    width: 200,
    padding: 4,
    justifyContent: 'space-between',
  },

  bankDetailsText: {
    fontSize: 8,
    lineHeight: 1.3,
    fontWeight: 'bold',
  },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsLine: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 8,
    marginTop: 'auto',
  },
  certText: {
    fontSize: 6.5,
    fontStyle: 'italic',
  },
  authFor: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  signatureImg: {
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
  const totalTaxAmt = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);

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
              <Text style={styles.companySubInfo}>Phone: {Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone}</Text>
              <Text style={styles.companySubInfo}>E Mail: {invoiceData.seller.email}</Text>
              <View style={styles.gstinLine}>
                <Text style={styles.gstinText}>GSTIN NUMBER : {invoiceData.seller.gstin}</Text>
              </View>
            </View>
          </View>

          <View style={styles.titleBar}><Text>Invoice</Text></View>

          {/* 2. METADATA GRID */}
          <View style={styles.metaGrid}>
            <View style={[styles.metaCol, { borderRight: '1pt solid #000' }]}>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Invoice No:</Text><Text style={[styles.metaValue, styles.bold]}>{invoiceData.invoiceNumber}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Invoice Date:</Text><Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Reverse Charge:</Text><Text style={styles.metaValue}>{invoiceData.reverseCharge || 'N'}</Text></View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={{ flex: 1, paddingLeft: 4 }}>{invoiceData.seller.state}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingLeft: 4 }}>Code:</Text>
                  <Text style={{ paddingLeft: 4 }}>{invoiceData.seller.stateCode}</Text>
                </View>
              </View>
              <View style={styles.metaItemLastRow}>
                <Text style={[styles.metaLabel, { fontSize: 7 }]}>MSME REGISTRATION NO.:</Text>
                <Text style={[styles.metaValue, styles.bold]}>{invoiceData.seller.msmeRegNo}</Text>
              </View>
            </View>
            <View style={styles.metaCol}>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Transport Mode:</Text><Text style={styles.metaValue}>{invoiceData.transportMode || '-'}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Vehicle number:</Text><Text style={styles.metaValue}>{invoiceData.vehicleNumber || '-'}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Date of Supply:</Text><Text style={styles.metaValue}>{invoiceData.dateOfSupply}</Text></View>
              <View style={styles.metaItemLastRow}><Text style={styles.metaLabel}>Place of Supply:</Text><Text style={[styles.metaValue, { textTransform: 'uppercase' }]}>{invoiceData.placeOfSupply}</Text></View>
            </View>
          </View>

          {/* 3. PARTY SECTION */}
          <View style={styles.partyHeader}>
            <View style={[styles.partyHeaderBox, { borderRight: '1pt solid #000' }]}><Text>Invoice to Party</Text></View>
            <View style={styles.partyHeaderBox}><Text>Ship to Party</Text></View>
          </View>
          <View style={styles.partyGrid}>
            <View style={[styles.partyBox, { borderRight: '1pt solid #000' }]}>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>State:</Text><Text style={styles.partyValue}>{invoiceData.buyer.state || '-'}   <Text style={styles.bold}>Code:</Text> {invoiceData.buyer.stateCode || '-'}</Text></View>
            </View>
            <View style={styles.partyBox}>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>State:</Text><Text style={styles.partyValue}>{invoiceData.buyer.state || '-'}   <Text style={styles.bold}>Code:</Text> {invoiceData.buyer.stateCode || '-'}</Text></View>
            </View>
          </View>

          {/* 4. SERVICE DESCRIPTION */}
          <View style={styles.descLine}><Text>{invoiceData.descriptionHeader}</Text></View>

          {/* 5. ITEMS TABLE */}
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.c1}></Text><Text style={styles.c2}></Text><Text style={styles.c3}></Text><Text style={styles.c4}></Text><Text style={styles.c5}></Text><Text style={styles.c6}></Text><Text style={styles.c7}></Text><Text style={styles.c8}></Text>
              {isIntraState && <><View style={[styles.c9, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 2 }}>CGST</Text></View><View style={[styles.c9, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 2 }}>SGST</Text></View></>}
              {isInterState && <View style={[styles.c9, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 2 }}>IGST</Text></View>}
              <Text style={styles.c10}></Text>
            </View>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.c1}>S.No</Text><Text style={styles.c2}>Product Description</Text><Text style={styles.colHSN}>HSN Code</Text><Text style={styles.c4}>Qty</Text><Text style={styles.c5}>Rate</Text><Text style={styles.c6}>Amount</Text><Text style={styles.c7}>Discount</Text><Text style={styles.c8}>Taxable Val</Text>
              {isIntraState && <><View style={[styles.c9, { flexDirection: 'row' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>Rate</Text><Text style={{ flex: 1 }}>Amt</Text></View><View style={[styles.c9, { flexDirection: 'row' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>Rate</Text><Text style={{ flex: 1 }}>Amt</Text></View></>}
              {isInterState && <View style={[styles.c9, { flexDirection: 'row' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>Rate</Text><Text style={{ flex: 1 }}>Amt</Text></View>}
              <Text style={styles.c10}>Total</Text>
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.c1}>{i + 1}</Text><Text style={[styles.c2, styles.bold]}>{item.description}</Text><Text style={styles.c3}>{item.hsn}</Text><Text style={styles.c4}>{item.qty}</Text><Text style={styles.c5}>{item.rate}</Text><Text style={styles.c6}>{item.amount}</Text><Text style={styles.c7}>{item.discount}</Text><Text style={styles.c8}>{item.taxableValue.toFixed(2)}</Text>
                {isIntraState && <><View style={[styles.c9, { flexDirection: 'row', height: '100%' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>{item.cgstRate}%</Text><Text style={{ flex: 1 }}>{item.cgstAmount?.toFixed(2)}</Text></View><View style={[styles.c9, { flexDirection: 'row', height: '100%' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>{item.sgstRate}%</Text><Text style={{ flex: 1 }}>{item.sgstAmount?.toFixed(2)}</Text></View></>}
                {isInterState && <View style={[styles.c9, { flexDirection: 'row', height: '100%' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>{item.igstRate}%</Text><Text style={{ flex: 1 }}>{item.igstAmount?.toFixed(2)}</Text></View>}
                <Text style={[styles.c10, { textAlign: 'right' }]}>{item.total.toFixed(2)}</Text>
              </View>
            ))}

            {/* Reduced filler count to ensure single page */}
            {Array.from({ length: Math.max(0, 5 - invoiceData.items.length) }).map((_, i) => (
              <View key={`f-${i}`} style={styles.tableRow}>
                <Text style={styles.c1}> </Text><Text style={styles.c2}> </Text><Text style={styles.c3}> </Text><Text style={styles.c4}> </Text><Text style={styles.c5}> </Text><Text style={styles.c6}> </Text><Text style={styles.c7}> </Text><Text style={styles.c8}> </Text>{isIntraState && <><View style={[styles.c9, { height: '100%' }]}></View><View style={[styles.c9, { height: '100%' }]}></View></>}{isInterState && <View style={[styles.c9, { height: '100%' }]}></View>}<Text style={styles.c10}> </Text>
              </View>
            ))}

            <View style={styles.tableTotalRow}>
              <Text style={{ width: 25 + 45 + 2, borderRight: '1pt solid #000', padding: 2, flex: 1, textAlign: 'center' }}>Total</Text>
              <Text style={styles.c3}></Text><Text style={styles.c4}>{invoiceData.items.reduce((acc: any, c: any) => acc + c.qty, 0)}</Text><Text style={styles.c5}>###</Text><Text style={styles.c6}>####</Text><Text style={styles.c7}>{invoiceData.items.reduce((acc: any, c: any) => acc + c.discount, 0)}</Text><Text style={styles.c8}>{invoiceData.subtotal.toFixed(2)}</Text>{isIntraState && <><View style={styles.c9}><Text>#### ###</Text></View><View style={styles.c9}><Text>#### ###</Text></View></>}{isInterState && <View style={styles.c9}><Text>#### ###</Text></View>}<Text style={[styles.c10, { textAlign: 'right' }]}>{Math.round(invoiceData.grandTotal)}</Text>
            </View>
          </View>

          {/* FORCE NO WRAP TO PREVENT FOOTER SPLIT */}
          <View wrap={false}>
            <View style={styles.summarySection}>
              <View style={styles.wordsContainer}>
                <Text style={styles.wordsHeader}>TOTAL INVOICE AMOUNT IN WORDS</Text>
                <Text style={styles.wordsContent}>{numberToWords(Math.round(invoiceData.grandTotal))}</Text>
              </View>
              <View style={styles.totalsContainer}>
                <View style={styles.totalsRow}><Text style={styles.totalsLabel}>TOTAL AMOUNT BEFORE TAX</Text><Text style={styles.totalsValue}>{invoiceData.subtotal.toFixed(2)}</Text></View>
                {isIntraState && <><View style={styles.totalsRow}><Text style={styles.totalsLabel}>ADD: CGST</Text><Text style={styles.totalsValue}>{invoiceData.cgstTotal.toFixed(2)}</Text></View><View style={styles.totalsRow}><Text style={styles.totalsLabel}>ADD: SGST</Text><Text style={styles.totalsValue}>{invoiceData.sgstTotal.toFixed(2)}</Text></View></>}
                {isInterState && <View style={styles.totalsRow}><Text style={styles.totalsLabel}>ADD: IGST</Text><Text style={styles.totalsValue}>{invoiceData.igstTotal.toFixed(2)}</Text></View>}
                <View style={styles.totalsRow}><Text style={styles.totalsLabel}>TOTAL TAX AMOUNT</Text><Text style={styles.totalsValue}>{totalTaxAmt.toFixed(2)}</Text></View>
                <View style={[styles.totalsRow, { backgroundColor: '#f2f2f2' }]}><Text style={styles.totalsLabel}>TOTAL AMOUNT AFTER TAX</Text><Text style={styles.totalsValue}>{invoiceData.grandTotal.toFixed(2)}</Text></View>
                <View style={{ flexDirection: 'row', minHeight: 15, alignItems: 'center' }}><Text style={styles.totalsLabel}>GST ON REVERSE CHARGE</Text><Text style={styles.totalsValue}>0.00</Text></View>
              </View>
            </View>

            <View style={styles.footerRow}>
              <View style={styles.footerBank}>
                <View style={{ backgroundColor: '#f2f2f2', borderBottom: '1pt solid #000', textAlign: 'center', paddingVertical: 1.5 }}><Text style={{ fontWeight: 'bold' }}>Bank Details</Text></View>
                <View style={styles.bankContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankDetailsText}>Bank Name: {invoiceData.seller.bank.name}</Text>
                    <Text style={styles.bankDetailsText}>Branch Name: {invoiceData.seller.bank.branch}</Text>
                    <Text style={styles.bankDetailsText}>Account No: {invoiceData.seller.bank.accountNo}</Text>
                    <Text style={styles.bankDetailsText}>Bank IFSC: {invoiceData.seller.bank.ifsc}</Text>
                  </View>
                  {invoiceData.upiId && invoiceData.showUpiQr && (
                    <View style={styles.qrBox}>
                      <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${invoiceData.upiId}&pn=${encodeURIComponent(invoiceData.seller.name)}&am=${invoiceData.grandTotal.toFixed(2)}&cu=INR`)}`} style={{ width: 42, height: 42 }} />
                      <Text style={{ fontSize: 5, fontWeight: 'bold', marginTop: 0.5 }}>SCAN TO PAY</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.termsLine}>Terms & Conditions Apply</Text>
              </View>
              <View style={styles.footerCenter}><Text style={{ fontWeight: 'bold', fontSize: 10, borderTop: '1pt solid #000', width: '100%', textAlign: 'center', paddingVertical: 1.5 }}>Common Seal</Text></View>
              <View style={styles.footerRight}>
                <Text style={styles.certText}>Certified that the particulars given above are true and correct.</Text>
                <View>
                  <Text style={styles.authFor}>FOR {invoiceData.seller.name}</Text>
                  {invoiceData.showDigitalSignature && <Image src={invoiceData.signatureUrl} style={styles.signatureImg} />}
                </View>
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
