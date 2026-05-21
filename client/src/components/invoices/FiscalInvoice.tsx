import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { numberToWords } from '../../lib/numberToWords';

// Bug 1: Force fit on 1 single A4 page
const styles = StyleSheet.create({
  page: {
    padding: '8mm', // 8mm margins on all sides
    fontSize: 7,    // Base font size 7pt
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
    minHeight: 70,
  },
  logoBox: {
    width: 60,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    textAlign: 'center',
    paddingRight: 60, 
  },
  companyName: {
    fontSize: 22, // Large bold
    fontWeight: 'bold',
    marginBottom: 1,
    textTransform: 'uppercase',
  },
  companySubInfo: {
    fontSize: 8,
    marginBottom: 0.5,
  },
  gstinLine: {
    marginTop: 2,
    paddingTop: 2,
    borderTop: '0.5pt solid #000',
    alignSelf: 'center',
    width: '60%',
  },
  gstinText: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // 2. INVOICE TITLE BAR
  titleBar: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 1.5,
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
    height: 14, // Bug 6 & 7: Equal row heights
    alignItems: 'center',
  },
  metaItemLastRow: {
    flexDirection: 'row',
    height: 14,
    alignItems: 'center',
  },
  metaLabel: {
    width: 90,
    paddingHorizontal: 2,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 7,
  },
  metaValue: {
    flex: 1,
    paddingHorizontal: 2,
    fontSize: 7,
  },
  msmeRow: {
    flexDirection: 'row',
    height: 14,
    alignItems: 'center',
    borderBottom: '1pt solid #000',
  },
  msmeLabel: {
    width: 140, // Bug 3: Full label width
    paddingHorizontal: 2,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 7,
  },

  // 4. PARTY SECTION
  partyHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
    fontSize: 8,
  },
  partyHeaderBox: {
    width: '50%',
    textAlign: 'center',
    paddingVertical: 1.5,
  },
  partyGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 50,
  },
  partyBox: {
    width: '50%',
    padding: 3,
  },
  partyRow: {
    flexDirection: 'row',
    marginBottom: 1,
    fontSize: 7,
  },
  partyLabel: {
    fontWeight: 'bold',
    width: 35,
  },
  partyValue: {
    flex: 1,
  },

  // 5. SERVICE DESCRIPTION
  descLine: {
    padding: 2,
    fontWeight: 'bold',
    borderBottom: '1pt solid #000',
    fontSize: 7,
  },

  // 6. ITEMS TABLE
  tableHeader: {
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
    height: 12, // Bug 1: Minimal height
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 7,
  },
  emptyRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #000',
    height: 10, // Bug 1: 10px empty rows
    alignItems: 'center',
  },
  tableTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    height: 14,
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 7,
  },

  // Bug 4: Specified Percentage Column Widths
  c1: { width: '4%', borderRight: '1pt solid #000', padding: 1 }, // S.No
  c2: { width: '20%', borderRight: '1pt solid #000', padding: 2, textAlign: 'left' }, // Prod Desc (adj to 20)
  c3: { width: '7%', borderRight: '1pt solid #000', padding: 1 }, // HSN
  c4: { width: '5%', borderRight: '1pt solid #000', padding: 1 }, // Qty
  c5: { width: '7%', borderRight: '1pt solid #000', padding: 1 }, // Rate
  c6: { width: '7%', borderRight: '1pt solid #000', padding: 1 }, // Amt
  c7: { width: '6%', borderRight: '1pt solid #000', padding: 1 }, // Disc
  c8: { width: '8%', borderRight: '1pt solid #000', padding: 1 }, // TaxVal
  c9_grp: { width: '10%', borderRight: '1pt solid #000' }, // CGST Parent (4% + 6%)
  c9_sub: { width: '40%', borderRight: '0.5pt solid #000', height: '100%', justifyContent: 'center' }, // Rate sub
  c9_amt: { width: '60%', height: '100%', justifyContent: 'center' }, // Amt sub
  c10_grp: { width: '10%', borderRight: '1pt solid #000' }, // SGST Parent (4% + 6%)
  c11: { width: '6%', padding: 1, fontWeight: 'bold' }, // Total

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
    fontSize: 7.5,
  },
  wordsContent: {
    padding: 6,
    textAlign: 'center',
    fontSize: 11, // Large italic bold
    fontStyle: 'italic',
    fontWeight: 'bold',
    justifyContent: 'center',
    flex: 1,
  },
  totalsContainer: {
    width: 180,
  },
  totRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    height: 12,
    alignItems: 'center',
  },
  totRowLast: {
    flexDirection: 'row',
    height: 12,
    alignItems: 'center',
  },
  totLabel: {
    width: 120,
    paddingHorizontal: 3,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
    fontSize: 6.5,
  },
  totValue: {
    flex: 1,
    paddingHorizontal: 3,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 7,
  },

  // 8. BOTTOM FOOTER
  footerRow: {
    flexDirection: 'row',
    minHeight: 70, // Compressed
  },
  footerBank: {
    width: 200,
    borderRight: '1pt solid #000',
  },
  footerCenter: {
    flex: 1,
    borderRight: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRight: {
    width: 180,
    padding: 3,
    justifyContent: 'space-between',
  },

  bankHeader: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 1,
    fontWeight: 'bold',
  },
  bankContent: {
    padding: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankDetailsText: {
    fontSize: 6.5,
    lineHeight: 1.2,
    fontWeight: 'bold',
  },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  qrImage: {
    width: 35,
    height: 35,
  },
  termsLine: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingVertical: 1.5,
    fontWeight: 'bold',
    fontSize: 6.5,
    marginTop: 'auto',
  },
  sealText: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  certText: {
    fontSize: 6,
    fontStyle: 'italic',
  },
  authFor: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 7.5,
    textTransform: 'uppercase',
  },
  signatureImg: {
    width: 60,
    height: 20,
    objectFit: 'contain',
    alignSelf: 'center',
  },
  authLabel: {
    borderTop: '1pt solid #000',
    textAlign: 'center',
    paddingTop: 2,
    fontWeight: 'bold',
    fontSize: 7,
  },
  bold: { fontWeight: 'bold' },
});

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
    items: any[];
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
              <View style={styles.metaItemLastRow}>
                <Text style={styles.metaLabel}>State:</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  {/* Bug 5: Compact alignment */}
                  <Text style={{ flex: 1, paddingLeft: 4 }}>{invoiceData.seller.state}</Text>
                  <Text style={{ width: 40, fontWeight: 'bold', borderLeft: '1pt solid #000', paddingLeft: 4 }}>Code:</Text>
                  <Text style={{ paddingLeft: 4 }}>{invoiceData.seller.stateCode}</Text>
                </View>
              </View>
            </View>
            <View style={styles.metaCol}>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Transport Mode:</Text><Text style={styles.metaValue}>{invoiceData.transportMode || '-'}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Vehicle number:</Text><Text style={styles.metaValue}>{invoiceData.vehicleNumber || '-'}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Date of Supply:</Text><Text style={styles.metaValue}>{invoiceData.dateOfSupply}</Text></View>
              <View style={styles.metaItemLastRow}><Text style={styles.metaLabel}>Place of Supply:</Text><Text style={[styles.metaValue, { textTransform: 'uppercase' }]}>{invoiceData.placeOfSupply}</Text></View>
            </View>
          </View>
          <View style={styles.msmeRow}>
            {/* Bug 3: Full Label */}
            <Text style={styles.msmeLabel}>MSME REGISTRATION NO.:</Text>
            <Text style={[styles.metaValue, styles.bold]}>{invoiceData.seller.msmeRegNo}</Text>
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
              {/* Bug 5: State & Code on same line */}
              <View style={styles.partyRow}><Text style={styles.partyLabel}>State:</Text><Text style={styles.partyValue}>{invoiceData.buyer.state || '-'}   <Text style={styles.bold}>Code:</Text> {invoiceData.buyer.stateCode || '-'}</Text></View>
            </View>
            <View style={styles.partyBox}>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Name:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>Address:</Text><Text style={styles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>GSTIN:</Text><Text style={[styles.partyValue, styles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={styles.partyRow}><Text style={styles.partyLabel}>State:</Text><Text style={styles.partyValue}>{invoiceData.buyer.state || '-'}   <Text style={styles.bold}>Code:</Text> {invoiceData.buyer.stateCode || '-'}</Text></View>
            </View>
          </View>

          {/* 5. SERVICE DESCRIPTION */}
          <View style={styles.descLine}><Text>{invoiceData.descriptionHeader}</Text></View>

          {/* 6. ITEMS TABLE */}
          <View style={styles.table}>
            {/* Header Row 1 */}
            <View style={styles.tableHeader}>
              <Text style={styles.c1}></Text><Text style={styles.c2}></Text><Text style={styles.c3}></Text><Text style={styles.c4}></Text><Text style={styles.c5}></Text><Text style={styles.c6}></Text><Text style={styles.c7}></Text><Text style={styles.c8}></Text>
              {isIntraState && <><View style={[styles.c9_grp, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 1 }}>CGST</Text></View><View style={[styles.c10_grp, { borderBottom: '1pt solid #000' }]}><Text style={{ padding: 1 }}>SGST</Text></View></>}
              {isInterState && <View style={[styles.c9_grp, { borderBottom: '1pt solid #000', width: '20%' }]}><Text style={{ padding: 1 }}>IGST</Text></View>}
              <Text style={styles.c11}></Text>
            </View>
            {/* Header Row 2 */}
            <View style={styles.tableHeader}>
              <Text style={styles.c1}>S.No</Text><Text style={styles.c2}>Product Description</Text><Text style={styles.c3}>HSN</Text><Text style={styles.c4}>Qty</Text><Text style={styles.c5}>Rate</Text><Text style={styles.c6}>Amt</Text><Text style={styles.c7}>Disc</Text><Text style={styles.c8}>TaxVal</Text>
              {isIntraState && <><View style={[styles.c9_grp, { flexDirection: 'row' }]}><Text style={styles.c9_sub}>R</Text><Text style={styles.c9_amt}>Amt</Text></View><View style={[styles.c10_grp, { flexDirection: 'row' }]}><Text style={styles.c9_sub}>R</Text><Text style={styles.c9_amt}>Amt</Text></View></>}
              {isInterState && <View style={[styles.c9_grp, { flexDirection: 'row', width: '20%' }]}><Text style={styles.c9_sub}>Rate</Text><Text style={styles.c9_amt}>Amt</Text></View>}
              <Text style={styles.c11}>Total</Text>
            </View>

            {/* Data Rows */}
            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.c1}>{i + 1}</Text><Text style={[styles.c2, styles.bold]}>{item.description}</Text><Text style={styles.c3}>{item.hsn}</Text><Text style={styles.c4}>{item.qty}</Text><Text style={styles.c5}>{item.rate}</Text><Text style={styles.c6}>{item.amount}</Text><Text style={styles.c7}>{item.discount}</Text><Text style={styles.c8}>{item.taxableValue.toFixed(2)}</Text>
                {isIntraState && <><View style={[styles.c9_grp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.c9_sub}>{item.cgstRate}%</Text><Text style={styles.c9_amt}>{item.cgstAmount?.toFixed(2)}</Text></View><View style={[styles.c10_grp, { flexDirection: 'row', height: '100%' }]}><Text style={styles.c9_sub}>{item.sgstRate}%</Text><Text style={styles.c9_amt}>{item.sgstAmount?.toFixed(2)}</Text></View></>}
                {isInterState && <View style={[styles.c9_grp, { flexDirection: 'row', height: '100%', width: '20%' }]}><Text style={styles.c9_sub}>{item.igstRate}%</Text><Text style={styles.c9_amt}>{item.igstAmount?.toFixed(2)}</Text></View>}
                <Text style={[styles.c11, { textAlign: 'right' }]}>{item.total.toFixed(2)}</Text>
              </View>
            ))}

            {/* Empty filler rows - Bug 1: 10px each */}
            {Array.from({ length: Math.max(0, 10 - invoiceData.items.length) }).map((_, i) => (
              <View key={`f-${i}`} style={styles.emptyRow}>
                <Text style={styles.c1}> </Text><Text style={styles.c2}> </Text><Text style={styles.c3}> </Text><Text style={styles.c4}> </Text><Text style={styles.c5}> </Text><Text style={styles.c6}> </Text><Text style={styles.c7}> </Text><Text style={styles.c8}> </Text>{isIntraState && <><View style={[styles.c9_grp, { height: '100%' }]}></View><View style={[styles.c10_grp, { height: '100%' }]}></View></>}{isInterState && <View style={[styles.c9_grp, { height: '100%', width: '20%' }]}></View>}<Text style={styles.c11}> </Text>
              </View>
            ))}

            {/* Total Row */}
            <View style={styles.tableTotalRow}>
              <Text style={{ width: '24%', borderRight: '1pt solid #000', padding: 1, textAlign: 'center' }}>Total</Text>
              <Text style={styles.c3}></Text><Text style={styles.c4}>{invoiceData.items.reduce((acc: any, c: any) => acc + c.qty, 0)}</Text><Text style={styles.c5}></Text><Text style={styles.c6}></Text><Text style={styles.c7}>{invoiceData.items.reduce((acc: any, c: any) => acc + c.discount, 0)}</Text><Text style={styles.c8}>{invoiceData.subtotal.toFixed(2)}</Text>
              {isIntraState && <><View style={styles.c9_grp}></View><View style={styles.c10_grp}></View></>}
              {isInterState && <View style={[styles.c9_grp, {width: '20%'}]}></View>}
              <Text style={[styles.c11, { textAlign: 'right' }]}>{Math.round(invoiceData.grandTotal)}</Text>
            </View>
          </View>

          {/* Wrapper to prevent page break between summary and footer */}
          <View wrap={false}>
            {/* 7. TOTALS SUMMARY */}
            <View style={styles.summarySection}>
              <View style={styles.wordsContainer}>
                <Text style={styles.wordsHeader}>TOTAL INVOICE AMOUNT IN WORDS</Text>
                {/* Bug 2: Fixed duplicate ONLY - using numberToWords without appending */}
                <Text style={styles.wordsContent}>{numberToWords(Math.round(invoiceData.grandTotal))}</Text>
              </View>
              <View style={styles.totalsContainer}>
                <View style={styles.totRow}><Text style={styles.totLabel}>TOTAL AMOUNT BEFORE TAX</Text><Text style={styles.totValue}>{invoiceData.subtotal.toFixed(2)}</Text></View>
                {isIntraState && <><View style={styles.totRow}><Text style={styles.totLabel}>ADD: CGST</Text><Text style={styles.totValue}>{invoiceData.cgstTotal.toFixed(2)}</Text></View><View style={styles.totRow}><Text style={styles.totLabel}>ADD: SGST</Text><Text style={styles.totValue}>{invoiceData.sgstTotal.toFixed(2)}</Text></View></>}
                {isInterState && <View style={styles.totRow}><Text style={styles.totLabel}>ADD: IGST</Text><Text style={styles.totValue}>{invoiceData.igstTotal.toFixed(2)}</Text></View>}
                <View style={styles.totRow}><Text style={styles.totLabel}>TOTAL TAX AMOUNT</Text><Text style={styles.totValue}>{totalTaxAmt.toFixed(2)}</Text></View>
                <View style={[styles.totRow, { backgroundColor: '#f2f2f2' }]}><Text style={styles.totLabel}>TOTAL AMOUNT AFTER TAX</Text><Text style={styles.totValue}>{invoiceData.grandTotal.toFixed(2)}</Text></View>
                <View style={styles.totRowLast}><Text style={styles.totLabel}>GST ON REVERSE CHARGE</Text><Text style={styles.totValue}>0.00</Text></View>
              </View>
            </View>

            {/* 8. BOTTOM FOOTER */}
            <View style={styles.footerRow}>
              <View style={styles.footerBank}>
                <View style={styles.bankHeader}><Text>Bank Details</Text></View>
                <View style={styles.bankContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankDetailsText}>{invoiceData.seller.bank.name}</Text>
                    <Text style={styles.bankDetailsText}>{invoiceData.seller.bank.branch}</Text>
                    <Text style={styles.bankDetailsText}>{invoiceData.seller.bank.accountNo}</Text>
                    <Text style={styles.bankDetailsText}>{invoiceData.seller.bank.ifsc}</Text>
                  </View>
                  {invoiceData.upiId && invoiceData.showUpiQr && (
                    <View style={styles.qrBox}>
                      <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${invoiceData.upiId}&pn=${encodeURIComponent(invoiceData.seller.name)}&am=${invoiceData.grandTotal.toFixed(2)}&cu=INR`)}`} style={styles.qrImage} />
                      <Text style={{ fontSize: 5, fontWeight: 'bold', marginTop: 1 }}>SCAN TO PAY</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.termsLine}>Terms & Conditions Apply</Text>
              </View>
              <View style={styles.footerCenter}>
                <Text style={styles.sealText}>Common Seal</Text>
              </View>
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
