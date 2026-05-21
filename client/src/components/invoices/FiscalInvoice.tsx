import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { numberToWords } from '../../lib/numberToWords';

// Define styles for an extremely compact, single-page A4 layout
const styles = StyleSheet.create({
  page: {
    padding: '8mm', // Bug 1: Reduced margins to 8mm
    fontSize: 7.5,   // Bug 1: Reduced font size for body
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
    padding: 4,
    borderBottom: '1pt solid #000',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  logoBox: {
    width: 70,
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
    paddingRight: 70, 
  },
  companyName: {
    fontSize: 20, // Reduced from 22 for space
    fontWeight: 'bold',
    marginBottom: 1,
    textTransform: 'uppercase',
  },
  companySubInfo: {
    fontSize: 8.5,
    fontWeight: 'bold',
    marginBottom: 0.5,
  },
  gstinLine: {
    marginTop: 3,
    paddingTop: 2,
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
    paddingVertical: 1,
    fontWeight: 'bold',
    fontSize: 9,
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
    minHeight: 14, // Bug 6: Reduced row heights
    alignItems: 'center',
  },
  metaItemLastRow: {
    flexDirection: 'row',
    minHeight: 14, // Bug 6: Reduced row heights
    alignItems: 'center',
  },
  metaLabel: {
    width: 115, // Bug 3: Increased width to 115pt for MSME label
    paddingHorizontal: 3,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 7.5,
  },
  metaValue: {
    flex: 1,
    paddingHorizontal: 3,
    fontSize: 7.5,
  },

  // 4. PARTY SECTION
  partyHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
    fontSize: 8.5,
  },
  partyHeaderBox: {
    width: '50%',
    textAlign: 'center',
    paddingVertical: 1.5,
  },
  partyGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 65,
  },
  partyBox: {
    width: '50%',
    padding: 3,
  },
  partyRow: {
    flexDirection: 'row',
    marginBottom: 1,
    fontSize: 8,
  },
  partyLabel: {
    fontWeight: 'bold',
    width: 40,
  },
  partyValue: {
    flex: 1,
  },

  // 5. SERVICE DESCRIPTION LINE
  descLine: {
    padding: 2.5,
    fontWeight: 'bold',
    borderBottom: '1pt solid #000',
    fontSize: 7.5,
    backgroundColor: '#fff',
  },

  // 6. ITEMS TABLE
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 6.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #000',
    minHeight: 14, // Bug 1: Minimal row height
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 7.5,
  },
  tableTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    minHeight: 16,
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 7.5,
  },

  // FIXED COLUMN WIDTHS (Optimized for Bug 4)
  c1: { width: 22, borderRight: '1pt solid #000', padding: 1 }, // S.No
  c2: { flex: 1, borderRight: '1pt solid #000', padding: 2, textAlign: 'left' }, // Desc
  c3: { width: 45, borderRight: '1pt solid #000', padding: 1 }, // HSN
  c4: { width: 22, borderRight: '1pt solid #000', padding: 1 }, // Qty
  c5: { width: 40, borderRight: '1pt solid #000', padding: 1 }, // Rate
  c6: { width: 48, borderRight: '1pt solid #000', padding: 1 }, // Amount (Widened for Bug 4)
  c7: { width: 38, borderRight: '1pt solid #000', padding: 1 }, // Disc
  c8: { width: 55, borderRight: '1pt solid #000', padding: 1 }, // Taxable (Widened for Bug 4)
  c9: { width: 58, borderRight: '1pt solid #000' }, // GST Group (Widened for Bug 4)
  c10: { width: 55, padding: 1, fontWeight: 'bold' }, // Total (Widened for Bug 4)

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
    paddingVertical: 1.5,
    fontWeight: 'bold',
    fontSize: 8.5,
  },
  wordsContent: {
    padding: 8,
    textAlign: 'center',
    fontSize: 12, // Reduced for space
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
    minHeight: 14,
    alignItems: 'center',
  },
  totalsLabel: {
    width: 145,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 7,
    textTransform: 'uppercase',
  },
  totalsValue: {
    flex: 1,
    paddingHorizontal: 4,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 8,
  },

  // 8. BOTTOM FOOTER
  footerRow: {
    flexDirection: 'row',
    minHeight: 90, // Compressed height
  },
  footerBank: {
    width: 230,
    borderRight: '1pt solid #000',
  },
  footerCenter: {
    flex: 1,
    borderRight: '1pt solid #000',
    padding: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerRight: {
    width: 200,
    padding: 4,
    justifyContent: 'space-between',
  },

  bankDetailsText: {
    fontSize: 7.5,
    lineHeight: 1.25,
    fontWeight: 'bold',
  },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },
  termsLine: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 1.5,
    fontWeight: 'bold',
    fontSize: 7.5,
    marginTop: 'auto',
  },
  certText: {
    fontSize: 6,
    fontStyle: 'italic',
    textAlign: 'justify',
  },
  authFor: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 8.5,
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
    fontSize: 7.5,
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
          <View style={styles.titleBar}><Text>Invoice</Text></View>

          {/* 3. METADATA GRID */}
          <View style={styles.metaGrid}>
            <View style={[styles.metaCol, { borderRight: '1pt solid #000' }]}>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Invoice No:</Text><Text style={[styles.metaValue, styles.bold]}>{invoiceData.invoiceNumber}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Invoice Date:</Text><Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Reverse Charge:</Text><Text style={styles.metaValue}>{invoiceData.reverseCharge || 'N'}</Text></View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  {/* Bug 5: Compact alignment */}
                  <Text style={{ flex: 1, paddingLeft: 4 }}>{invoiceData.seller.state}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingLeft: 4 }}>Code:</Text>
                  <Text style={{ paddingLeft: 4 }}>{invoiceData.seller.stateCode}</Text>
                </View>
              </View>
              <View style={styles.metaItemLastRow}>
                {/* Bug 3: Full Label */}
                <Text style={styles.metaLabel}>MSME REGISTRATION NO.:</Text>
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

          {/* 4. PARTY SECTION */}
          <View style={styles.partyHeader}>
            <View style={[styles.partyHeaderBox, { borderRight: '1pt solid #000' }]}><Text>Invoice to Party</Text></View>
            <View style={styles.partyHeaderBox}><Text>Ship to Party</Text></View>
          </View>
          <View style={styles.partyGrid}>
            <View style={[styles.partyBox, { borderRight: '1pt solid #000' }]}>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>State:</Text>
                {/* Bug 5: Compact alignment */}
                <Text style={styles.partyValue}>{invoiceData.buyer.state || '-'}  <Text style={styles.bold}>Code:</Text> {invoiceData.buyer.stateCode || '-'}</Text>
              </View>
            </View>
            <View style={styles.partyBox}>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>State:</Text>
                <Text style={styles.partyValue}>{invoiceData.buyer.state || '-'}  <Text style={styles.bold}>Code:</Text> {invoiceData.buyer.stateCode || '-'}</Text>
              </View>
            </View>
          </View>

          {/* 5. SERVICE DESCRIPTION */}
          <View style={styles.descLine}><Text>{invoiceData.descriptionHeader}</Text></View>

          {/* 6. ITEMS TABLE */}
          <View style={styles.table}>
            {/* Header Row 1 */}
            <View style={styles.tableHeaderRow}>
              <Text style={styles.c1}></Text><Text style={styles.c2}></Text><Text style={styles.c3}></Text><Text style={styles.c4}></Text><Text style={styles.c5}></Text><Text style={styles.c6}></Text><Text style={styles.c7}></Text><Text style={styles.c8}></Text>
              {isIntraState && <><View style={[styles.c9, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 1.5 }}>CGST</Text></View><View style={[styles.c9, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 1.5 }}>SGST</Text></View></>}
              {isInterState && <View style={[styles.c9, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 1.5 }}>IGST</Text></View>}
              <Text style={styles.c10}></Text>
            </View>
            {/* Header Row 2 */}
            <View style={styles.tableHeaderRow}>
              <Text style={styles.c1}>S.No</Text><Text style={styles.c2}>Product Description</Text><Text style={styles.c3}>HSN Code</Text><Text style={styles.c4}>Qty</Text><Text style={styles.c5}>Rate</Text><Text style={styles.c6}>Amount</Text><Text style={styles.c7}>Discount</Text><Text style={styles.c8}>Taxable Value</Text>
              {isIntraState && <><View style={[styles.c9, { flexDirection: 'row' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>Rate</Text><Text style={{ flex: 1 }}>Amt</Text></View><View style={[styles.c9, { flexDirection: 'row' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>Rate</Text><Text style={{ flex: 1 }}>Amt</Text></View></>}
              {isInterState && <View style={[styles.c9, { flexDirection: 'row' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>Rate</Text><Text style={{ flex: 1 }}>Amt</Text></View>}
              <Text style={styles.c10}>Total</Text>
            </View>

            {/* Data Rows */}
            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.c1}>{i + 1}</Text><Text style={[styles.c2, styles.bold]}>{item.description}</Text><Text style={styles.c3}>{item.hsn}</Text><Text style={styles.c4}>{item.qty}</Text><Text style={styles.c5}>{item.rate}</Text><Text style={styles.c6}>{item.amount}</Text><Text style={styles.c7}>{item.discount}</Text><Text style={styles.c8}>{item.taxableValue.toFixed(2)}</Text>
                {isIntraState && <><View style={[styles.c9, { flexDirection: 'row', height: '100%' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>{item.cgstRate}%</Text><Text style={{ flex: 1 }}>{item.cgstAmount?.toFixed(2)}</Text></View><View style={[styles.c9, { flexDirection: 'row', height: '100%' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>{item.sgstRate}%</Text><Text style={{ flex: 1 }}>{item.sgstAmount?.toFixed(2)}</Text></View></>}
                {isInterState && <View style={[styles.c9, { flexDirection: 'row', height: '100%' }]}><Text style={{ width: '40%', borderRight: '1pt solid #000' }}>{item.igstRate}%</Text><Text style={{ flex: 1 }}>{item.igstAmount?.toFixed(2)}</Text></View>}
                <Text style={[styles.c10, { textAlign: 'right' }]}>{item.total.toFixed(2)}</Text>
              </View>
            ))}

            {/* Bug 1: Reduced filler rows to 5 to save space */}
            {Array.from({ length: Math.max(0, 5 - invoiceData.items.length) }).map((_, i) => (
              <View key={`f-${i}`} style={styles.tableRow}>
                <Text style={styles.c1}> </Text><Text style={styles.c2}> </Text><Text style={styles.c3}> </Text><Text style={styles.c4}> </Text><Text style={styles.c5}> </Text><Text style={styles.c6}> </Text><Text style={styles.c7}> </Text><Text style={styles.c8}> </Text>{isIntraState && <><View style={[styles.c9, { height: '100%' }]}></View><View style={[styles.c9, { height: '100%' }]}></View></>}{isInterState && <View style={[styles.c9, { height: '100%' }]}></View>}<Text style={styles.c10}> </Text>
              </View>
            ))}

            {/* Bug 4: Widened columns in total row to avoid ### */}
            <View style={styles.tableTotalRow}>
              <Text style={{ width: 22 + 45 + 2, borderRight: '1pt solid #000', padding: 2, flex: 1, textAlign: 'center' }}>Total</Text>
              <Text style={styles.c3}></Text><Text style={styles.c4}>{invoiceData.items.reduce((acc: any, c: any) => acc + c.qty, 0)}</Text><Text style={styles.c5}>###</Text><Text style={styles.c6}>####</Text><Text style={styles.c7}>{invoiceData.items.reduce((acc: any, c: any) => acc + c.discount, 0)}</Text><Text style={styles.c8}>{invoiceData.subtotal.toFixed(2)}</Text>
              {isIntraState && <><View style={styles.c9}><Text style={{fontSize: 6.5}}>#### ###</Text></View><View style={styles.c9}><Text style={{fontSize: 6.5}}>#### ###</Text></View></>}
              {isInterState && <View style={styles.c9}><Text style={{fontSize: 6.5}}>#### ###</Text></View>}
              <Text style={[styles.c10, { textAlign: 'right' }]}>{Math.round(invoiceData.grandTotal)}</Text>
            </View>
          </View>

          {/* Bug 1 & 7: Force footer to stay on page 1 */}
          <View wrap={false}>
            {/* 7. TOTALS SUMMARY */}
            <View style={styles.summarySection}>
              <View style={styles.wordsContainer}>
                <Text style={styles.wordsHeader}>TOTAL INVOICE AMOUNT IN WORDS</Text>
                {/* Bug 2: Fixed duplicate ONLY */}
                <Text style={styles.wordsContent}>{numberToWords(Math.round(invoiceData.grandTotal))}</Text>
              </View>
              <View style={styles.totalsContainer}>
                <View style={styles.totalsRow}><Text style={styles.totalsLabel}>TOTAL AMOUNT BEFORE TAX</Text><Text style={styles.totalsValue}>{invoiceData.subtotal.toFixed(2)}</Text></View>
                {isIntraState && <><View style={styles.totalsRow}><Text style={styles.totalsLabel}>ADD: CGST</Text><Text style={styles.totalsValue}>{invoiceData.cgstTotal.toFixed(2)}</Text></View><View style={styles.totalsRow}><Text style={styles.totalsLabel}>ADD: SGST</Text><Text style={styles.totalsValue}>{invoiceData.sgstTotal.toFixed(2)}</Text></View></>}
                {isInterState && <View style={styles.totalsRow}><Text style={styles.totalsLabel}>ADD: IGST</Text><Text style={styles.totalsValue}>{invoiceData.igstTotal.toFixed(2)}</Text></View>}
                <View style={styles.totalsRow}><Text style={styles.totalsLabel}>TOTAL TAX AMOUNT</Text><Text style={styles.totalsValue}>{totalTaxAmt.toFixed(2)}</Text></View>
                <View style={[styles.totalsRow, { backgroundColor: '#f2f2f2' }]}><Text style={styles.totalsLabel}>TOTAL AMOUNT AFTER TAX</Text><Text style={styles.totalsValue}>{invoiceData.grandTotal.toFixed(2)}</Text></View>
                <View style={{ flexDirection: 'row', minHeight: 14, alignItems: 'center' }}><Text style={styles.totalsLabel}>GST ON REVERSE CHARGE</Text><Text style={styles.totalsValue}>0.00</Text></View>
              </View>
            </View>

            {/* 8. BOTTOM FOOTER */}
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
                      <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${invoiceData.upiId}&pn=${encodeURIComponent(invoiceData.seller.name)}&am=${invoiceData.grandTotal.toFixed(2)}&cu=INR`)}`} style={{ width: 40, height: 40 }} />
                      <Text style={{ fontSize: 5, fontWeight: 'bold', marginTop: 1 }}>SCAN TO PAY</Text>
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
