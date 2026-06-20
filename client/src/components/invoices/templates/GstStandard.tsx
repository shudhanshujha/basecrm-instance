import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { numberToWords } from '../../../lib/numberToWords.js';
import type { TemplateProps } from './types.js';
import { getAccentColor, getLightBg } from './colors.js';

const baseStyles = StyleSheet.create({
  page: { padding: '10mm', fontSize: 7, fontFamily: 'Helvetica', color: '#000000', backgroundColor: '#FFFFFF' },
  container: { border: '1pt solid #000000', flexDirection: 'column', width: '100%' },
  header: { padding: 6, flexDirection: 'row', alignItems: 'center', minHeight: 85 },
  logoBox: { width: 60, alignItems: 'center' },
  logo: { width: 55, height: 55, objectFit: 'contain' },
  logoPlaceholder: { width: 55, height: 55, backgroundColor: '#f0f0f0', borderRadius: 4 },
  companyInfo: { flex: 1, textAlign: 'center', paddingRight: 60 },
  companyName: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' },
  companySubInfo: { fontSize: 9, marginBottom: 0.5 },
  gstinLineContainer: { marginTop: 2, paddingTop: 3, borderTop: '0.5pt solid #000000', alignSelf: 'center', width: '100%' },
  gstinText: { fontSize: 9, fontWeight: 'bold', textAlign: 'center' },
  invoiceTitleBar: { borderBottom: '1pt solid #000000', textAlign: 'center', paddingVertical: 1.5, fontWeight: 'bold', fontSize: 8, textTransform: 'uppercase' },
  metaGrid: { flexDirection: 'column', borderBottom: '1pt solid #000000' },
  metaInnerRow: { flexDirection: 'row', borderBottom: '1pt solid #000000' },
  metaCol: { width: '50%' },
  metaItem: { flexDirection: 'row', borderBottom: '1pt solid #000000', height: 14, alignItems: 'center' },
  metaItemLast: { flexDirection: 'row', height: 14, alignItems: 'center' },
  metaLabel: { width: 90, paddingHorizontal: 4, fontWeight: 'bold', borderRight: '1pt solid #000000', fontSize: 8 },
  metaValue: { flex: 1, paddingHorizontal: 4, fontSize: 8 },
  msmeFullRow: { flexDirection: 'row', height: 15, alignItems: 'center' },
  msmeLabel: { paddingHorizontal: 4, fontWeight: 'bold', borderRight: '1pt solid #000000', fontSize: 8, width: 150 },
  partyHeaderGrid: { flexDirection: 'row', borderBottom: '1pt solid #000000' },
  partyHeaderCell: { width: '50%', textAlign: 'center', paddingVertical: 2, fontWeight: 'bold', fontSize: 8 },
  partyDataGrid: { flexDirection: 'row', borderBottom: '1pt solid #000000', minHeight: 65 },
  partyBox: { width: '50%', padding: 4 },
  partyLine: { flexDirection: 'row', marginBottom: 1, fontSize: 8 },
  partyLabel: { fontWeight: 'bold', width: 45 },
  partyValue: { flex: 1 },
  descHeaderLine: { padding: 3, fontSize: 7, borderBottom: '1pt solid #000000' },
  table: { flexDirection: 'column' },
  tableHeader: { flexDirection: 'row', borderBottom: '1pt solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: 7 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #000000', height: 12, alignItems: 'center', textAlign: 'center', fontSize: 7 },
  tableTotalRow: { flexDirection: 'row', borderBottom: '1pt solid #000000', height: 16, alignItems: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 7 },
  col1: { width: '4%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center' },
  col2: { width: '25%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center', textAlign: 'left', paddingLeft: 3 },
  col3: { width: '7%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center' },
  col4: { width: '5%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center' },
  col5: { width: '6%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center' },
  col6: { width: '7%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center' },
  col7: { width: '7%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center' },
  col8: { width: '8%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center' },
  colGstGrp: { width: '12%', borderRight: '1pt solid #000000', height: '100%' },
  colGstRate: { width: '50%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center' },
  colGstAmt: { width: '50%', height: '100%', justifyContent: 'center' },
  col11: { width: '7%', height: '100%', justifyContent: 'center', fontWeight: 'bold' },
  summaryHeaderRow: { flexDirection: 'row', borderBottom: '1pt solid #000000' },
  summaryHeaderLeft: { width: '65%', textAlign: 'center', paddingVertical: 2, fontWeight: 'bold', fontSize: 8, borderRight: '1pt solid #000000' },
  summaryDataGrid: { flexDirection: 'row', borderBottom: '1pt solid #000000' },
  summaryWordsBox: { width: '65%', borderRight: '1pt solid #000000', justifyContent: 'center', alignItems: 'center', padding: 10 },
  summaryWordsText: { fontSize: 11, fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center' },
  summaryTotalsBox: { width: '35%' },
  totalsRow: { flexDirection: 'row', borderBottom: '1pt solid #000000', height: 14, alignItems: 'center' },
  totalsLabel: { width: '65%', paddingHorizontal: 4, fontWeight: 'bold', borderRight: '1pt solid #000000', fontSize: 7 },
  totalsValue: { width: '35%', paddingHorizontal: 4, textAlign: 'right', fontWeight: 'bold', fontSize: 7.5 },
  footerRow: { flexDirection: 'row', minHeight: 100 },
  footerBankBox: { width: '35%', borderRight: '1pt solid #000000' },
  footerSealBox: { width: '20%', borderRight: '1pt solid #000000', justifyContent: 'center', alignItems: 'center' },
  footerSignBox: { width: '45%', padding: 5, justifyContent: 'space-between' },
  bankHeader: { borderBottom: '1pt solid #000000', textAlign: 'center', paddingVertical: 1.5, fontWeight: 'bold', fontSize: 8 },
  bankContent: { padding: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bankText: { fontSize: 8, lineHeight: 1.4, fontWeight: 'bold' },
  qrWrap: { alignItems: 'center', width: 50 },
  qrImg: { width: 40, height: 40 },
  qrLabel: { fontSize: 6, fontWeight: 'bold', textAlign: 'center', marginTop: 1 },
  termsBox: { borderTop: '1pt solid #000000', textAlign: 'center', paddingVertical: 2, fontWeight: 'bold', fontSize: 7, marginTop: 'auto' },
  sealText: { fontWeight: 'bold', fontSize: 9 },
  certText: { fontSize: 7, fontStyle: 'italic' },
  authForCompany: { textAlign: 'center', fontWeight: 'bold', fontSize: 9, textTransform: 'uppercase' },
  signatureHLine: { marginTop: 20, borderTop: '1pt solid #000000', width: '80%', alignSelf: 'center' },
  authSignLabel: { textAlign: 'center', paddingTop: 2, fontWeight: 'bold', fontSize: 8 },
  bold: { fontWeight: 'bold' },
});

const GstStandard: React.FC<TemplateProps> = ({ invoiceData }) => {
  const accentColor = getAccentColor(invoiceData);
  const headerBg = getLightBg(accentColor);
  const isIntraState = invoiceData.gstConfig === 'INTRA';
  const isInterState = invoiceData.gstConfig === 'INTER';
  const totalTaxAmountValue = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);
  const cur = invoiceData.currency || '₹';

  const dynamic = {
    invoiceTitleBar: { backgroundColor: headerBg },
    partyHeaderGrid: { backgroundColor: headerBg },
    tableHeader: { backgroundColor: headerBg },
    tableTotalRow: { backgroundColor: headerBg },
    bankHeader: { backgroundColor: headerBg },
    summaryHeaderRow: { backgroundColor: headerBg },
    summaryHeaderLeft: { borderRight: '1pt solid #000000' },
    summaryTotalsBox: {},
  };

  const phoneStr = Array.isArray(invoiceData.seller.phone)
    ? invoiceData.seller.phone.join(', ')
    : invoiceData.seller.phone;

  const formatCur = (val: number) => `${cur}${val.toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <View style={baseStyles.container}>
          <View style={baseStyles.header}>
            <View style={baseStyles.logoBox}>
              {invoiceData.seller.logoUrl ? (
                <Image src={invoiceData.seller.logoUrl} style={baseStyles.logo} />
              ) : (
                <View style={baseStyles.logoPlaceholder} />
              )}
            </View>
            <View style={baseStyles.companyInfo}>
              <Text style={baseStyles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={baseStyles.companySubInfo}>{invoiceData.seller.address}</Text>
              <Text style={baseStyles.companySubInfo}>Phone: {phoneStr}</Text>
              <Text style={baseStyles.companySubInfo}>E Mail: {invoiceData.seller.email}</Text>
              <View style={baseStyles.gstinLineContainer}>
                <Text style={baseStyles.gstinText}>GSTIN NUMBER : {invoiceData.seller.gstin}</Text>
              </View>
            </View>
          </View>

          <View style={[baseStyles.invoiceTitleBar, dynamic.invoiceTitleBar]}><Text>Invoice</Text></View>
          <View style={baseStyles.metaGrid}>
            <View style={baseStyles.metaInnerRow}>
              <View style={[baseStyles.metaCol, { borderRight: '1pt solid #000000' }]}>
                <View style={baseStyles.metaItem}><Text style={baseStyles.metaLabel}>Invoice No:</Text><Text style={baseStyles.metaValue}>{invoiceData.invoiceNumber}</Text></View>
                <View style={baseStyles.metaItem}><Text style={baseStyles.metaLabel}>Invoice Date:</Text><Text style={baseStyles.metaValue}>{invoiceData.invoiceDate}</Text></View>
                <View style={baseStyles.metaItem}><Text style={baseStyles.metaLabel}>Reverse Charge:</Text><Text style={baseStyles.metaValue}>{invoiceData.reverseCharge || 'N'}</Text></View>
                <View style={baseStyles.metaItemLast}><Text style={baseStyles.metaLabel}>State:</Text><Text style={baseStyles.metaValue}>{invoiceData.seller.state} | Code: {invoiceData.seller.stateCode}</Text></View>
              </View>
              <View style={baseStyles.metaCol}>
                <View style={baseStyles.metaItem}><Text style={baseStyles.metaLabel}>Transport Mode:</Text><Text style={baseStyles.metaValue}>{invoiceData.transportMode || '-'}</Text></View>
                <View style={baseStyles.metaItem}><Text style={baseStyles.metaLabel}>Vehicle number:</Text><Text style={baseStyles.metaValue}>{invoiceData.vehicleNumber || '-'}</Text></View>
                <View style={baseStyles.metaItem}><Text style={baseStyles.metaLabel}>Date of Supply:</Text><Text style={baseStyles.metaValue}>{invoiceData.dateOfSupply}</Text></View>
                <View style={baseStyles.metaItemLast}><Text style={baseStyles.metaLabel}>Place of Supply:</Text><Text style={[baseStyles.metaValue, { textTransform: 'uppercase' }]}>{invoiceData.placeOfSupply}</Text></View>
              </View>
            </View>
            <View style={baseStyles.msmeFullRow}>
              <Text style={baseStyles.msmeLabel}>MSME REGISTRATION NO.:</Text>
              <Text style={[baseStyles.metaValue, baseStyles.bold]}>{invoiceData.seller.msmeRegNo}</Text>
            </View>
          </View>

          <View style={[baseStyles.partyHeaderGrid, dynamic.partyHeaderGrid]}>
            <Text style={[baseStyles.partyHeaderCell, { borderRight: '1pt solid #000000' }]}>Invoice to Party</Text>
            <Text style={baseStyles.partyHeaderCell}>Ship to Party</Text>
          </View>
          <View style={baseStyles.partyDataGrid}>
            <View style={[baseStyles.partyBox, { borderRight: '1pt solid #000000' }]}>
              <View style={baseStyles.partyLine}><Text style={baseStyles.partyLabel}>Name:</Text><Text style={[baseStyles.partyValue, baseStyles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={baseStyles.partyLine}><Text style={baseStyles.partyLabel}>Address:</Text><Text style={baseStyles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={baseStyles.partyLine}><Text style={baseStyles.partyLabel}>GSTIN:</Text><Text style={[baseStyles.partyValue, baseStyles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={baseStyles.partyLine}><Text style={baseStyles.partyLabel}>State:</Text><Text style={baseStyles.partyValue}>{invoiceData.buyer.state || '-'} | Code: {invoiceData.buyer.stateCode || '-'}</Text></View>
            </View>
            <View style={baseStyles.partyBox}>
              <View style={baseStyles.partyLine}><Text style={baseStyles.partyLabel}>Name:</Text><Text style={[baseStyles.partyValue, baseStyles.bold]}>{invoiceData.buyer.name || '-'}</Text></View>
              <View style={baseStyles.partyLine}><Text style={baseStyles.partyLabel}>Address:</Text><Text style={baseStyles.partyValue}>{invoiceData.buyer.address || '-'}</Text></View>
              <View style={baseStyles.partyLine}><Text style={baseStyles.partyLabel}>GSTIN:</Text><Text style={[baseStyles.partyValue, baseStyles.bold]}>{invoiceData.buyer.gstin || '-'}</Text></View>
              <View style={baseStyles.partyLine}><Text style={baseStyles.partyLabel}>State:</Text><Text style={baseStyles.partyValue}>{invoiceData.buyer.state || '-'} | Code: {invoiceData.buyer.stateCode || '-'}</Text></View>
            </View>
          </View>

          <View style={baseStyles.descHeaderLine}><Text>{invoiceData.descriptionHeader}</Text></View>

          <View style={baseStyles.table}>
            <View style={[baseStyles.tableHeader, dynamic.tableHeader]}>
              <View style={baseStyles.col1}></View><View style={baseStyles.col2}></View><View style={baseStyles.col3}></View><View style={baseStyles.col4}></View><View style={baseStyles.col5}></View><View style={baseStyles.col6}></View><View style={baseStyles.col7}></View><View style={baseStyles.col8}></View>
              {isIntraState && <><View style={[baseStyles.colGstGrp, { borderBottom: '1pt solid #000000' }]}><Text style={{ padding: 1 }}>CGST</Text></View><View style={[baseStyles.colGstGrp, { borderBottom: '1pt solid #000000' }]}><Text style={{ padding: 1 }}>SGST</Text></View></>}
              {isInterState && <View style={[baseStyles.colGstGrp, { borderBottom: '1pt solid #000000', width: '24%' }]}><Text style={{ padding: 1 }}>IGST</Text></View>}
              <View style={baseStyles.col11}></View>
            </View>
            <View style={[baseStyles.tableHeader, dynamic.tableHeader]}>
              <Text style={baseStyles.col1}>S.No</Text><Text style={baseStyles.col2}>Product Description</Text><Text style={baseStyles.col3}>HSN</Text><Text style={baseStyles.col4}>Qty</Text><Text style={baseStyles.col5}>Rate</Text><Text style={baseStyles.col6}>Amount</Text><Text style={baseStyles.col7}>Discount</Text><Text style={baseStyles.col8}>TaxVal</Text>
              {isIntraState && <><View style={[baseStyles.colGstGrp, { flexDirection: 'row' }]}><Text style={baseStyles.colGstRate}>Rate</Text><Text style={baseStyles.colGstAmt}>Amt</Text></View><View style={[baseStyles.colGstGrp, { flexDirection: 'row' }]}><Text style={baseStyles.colGstRate}>Rate</Text><Text style={baseStyles.colGstAmt}>Amt</Text></View></>}
              {isInterState && <View style={[baseStyles.colGstGrp, { flexDirection: 'row', width: '24%' }]}><Text style={baseStyles.colGstRate}>Rate</Text><Text style={baseStyles.colGstAmt}>Amt</Text></View>}
              <Text style={baseStyles.col11}>Total</Text>
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={baseStyles.tableRow}>
                <Text style={baseStyles.col1}>{i + 1}</Text>                <View style={[baseStyles.col2, { flexDirection: 'column', height: '100%', justifyContent: 'center', paddingLeft: 3 }]}>
                  <Text style={{ fontSize: 7.5, fontWeight: 'bold' }}>{item.name || item.description}</Text>
                  {item.name && item.description && <Text style={{ fontSize: 6, color: '#4B5563' }}>{item.description}</Text>}
                </View><Text style={baseStyles.col3}>{item.hsn}</Text><Text style={baseStyles.col4}>{item.qty}</Text><Text style={baseStyles.col5}>{formatCur(item.rate)}</Text><Text style={baseStyles.col6}>{formatCur(item.amount)}</Text><Text style={baseStyles.col7}>{formatCur(item.discount)}</Text><Text style={baseStyles.col8}>{formatCur(item.taxableValue)}</Text>
                {isIntraState && <><View style={[baseStyles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={baseStyles.colGstRate}>{item.cgstRate}%</Text><Text style={baseStyles.colGstAmt}>{formatCur(item.cgstAmount)}</Text></View><View style={[baseStyles.colGstGrp, { flexDirection: 'row', height: '100%' }]}><Text style={baseStyles.colGstRate}>{item.sgstRate}%</Text><Text style={baseStyles.colGstAmt}>{formatCur(item.sgstAmount)}</Text></View></>}
                {isInterState && <View style={[baseStyles.colGstGrp, { flexDirection: 'row', height: '100%', width: '24%' }]}><Text style={baseStyles.colGstRate}>{item.igstRate}%</Text><Text style={baseStyles.colGstAmt}>{formatCur(item.igstAmount)}</Text></View>}
                <Text style={[baseStyles.col11, { textAlign: 'right' }]}>{formatCur(item.total)}</Text>
              </View>
            ))}

            {Array.from({ length: Math.max(0, 10 - invoiceData.items.length) }).map((_, i) => (
              <View key={`f-${i}`} style={baseStyles.tableRow}>
                <Text style={baseStyles.col1}> </Text><Text style={baseStyles.col2}> </Text><Text style={baseStyles.col3}> </Text><Text style={baseStyles.col4}> </Text><Text style={baseStyles.col5}> </Text><Text style={baseStyles.col6}> </Text><Text style={baseStyles.col7}> </Text><Text style={baseStyles.col8}> </Text>{isIntraState && <><View style={baseStyles.colGstGrp}></View><View style={baseStyles.colGstGrp}></View></>}{isInterState && <View style={[baseStyles.colGstGrp, {width: '24%'}]}></View>}<Text style={baseStyles.col11}> </Text>
              </View>
            ))}

            <View style={[baseStyles.tableTotalRow, dynamic.tableTotalRow]}>
              <Text style={{ width: '36%', borderRight: '1pt solid #000000', height: '100%', justifyContent: 'center', textAlign: 'center' }}>Total</Text>
              <Text style={baseStyles.col4}>{invoiceData.items.reduce((acc: any, c: any) => acc + (parseFloat(c.qty) || 0), 0)}</Text>
              <Text style={baseStyles.col5}></Text>
              <Text style={baseStyles.col6}></Text>
              <Text style={baseStyles.col7}>{formatCur(invoiceData.items.reduce((acc: any, c: any) => acc + (parseFloat(c.discount) || 0), 0))}</Text>
              <Text style={baseStyles.col8}>{formatCur(invoiceData.subtotal)}</Text>
              {isIntraState && <><View style={baseStyles.colGstGrp}></View><View style={baseStyles.colGstGrp}></View></>}
              {isInterState && <View style={[baseStyles.colGstGrp, {width: '24%'}]}></View>}
              <Text style={[baseStyles.col11, { textAlign: 'right' }]}>{formatCur(Math.round(invoiceData.grandTotal))}</Text>
            </View>
          </View>

          <View wrap={false}>
            <View style={[baseStyles.summaryHeaderRow, dynamic.summaryHeaderRow]}>
               <Text style={baseStyles.summaryHeaderLeft}>TOTAL INVOICE AMOUNT IN WORDS</Text>
               <View style={baseStyles.summaryTotalsBox}></View>
            </View>
            <View style={baseStyles.summaryDataGrid}>
              <View style={baseStyles.summaryWordsBox}>
                <Text style={baseStyles.summaryWordsText}>{numberToWords(Math.round(invoiceData.grandTotal))}</Text>
              </View>
              <View style={baseStyles.summaryTotalsBox}>
                <View style={baseStyles.totalsRow}><Text style={baseStyles.totalsLabel}>TOTAL AMOUNT BEFORE TAX</Text><Text style={baseStyles.totalsValue}>{formatCur(invoiceData.subtotal)}</Text></View>
                {isIntraState && <><View style={baseStyles.totalsRow}><Text style={baseStyles.totalsLabel}>Add: CGST</Text><Text style={baseStyles.totalsValue}>{formatCur(invoiceData.cgstTotal)}</Text></View><View style={baseStyles.totalsRow}><Text style={baseStyles.totalsLabel}>Add: SGST</Text><Text style={baseStyles.totalsValue}>{formatCur(invoiceData.sgstTotal)}</Text></View></>}
                {isInterState && <View style={baseStyles.totalsRow}><Text style={baseStyles.totalsLabel}>Add: IGST</Text><Text style={baseStyles.totalsValue}>{formatCur(invoiceData.igstTotal)}</Text></View>}
                <View style={baseStyles.totalsRow}><Text style={baseStyles.totalsLabel}>Total Tax Amount</Text><Text style={baseStyles.totalsValue}>{formatCur(totalTaxAmountValue)}</Text></View>
                <View style={[baseStyles.totalsRow, { backgroundColor: '#FFFFFF' }]}><Text style={baseStyles.totalsLabel}>Total Amount After Tax</Text><Text style={baseStyles.totalsValue}>{formatCur(invoiceData.grandTotal)}</Text></View>
                <View style={{ flexDirection: 'row', height: 14, alignItems: 'center' }}><Text style={baseStyles.totalsLabel}>GST ON REVERSE CHARGE</Text><Text style={baseStyles.totalsValue}>0.00</Text></View>
              </View>
            </View>

            <View style={baseStyles.footerRow}>
              <View style={baseStyles.footerBankBox}>
                <View style={[baseStyles.bankHeader, dynamic.bankHeader]}><Text>Bank Details</Text></View>
                <View style={baseStyles.bankContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={baseStyles.bankText}>Bank Name: {invoiceData.seller.bank.name}</Text>
                    <Text style={baseStyles.bankText}>Branch Name: {invoiceData.seller.bank.branch}</Text>
                    <Text style={baseStyles.bankText}>Account No: {invoiceData.seller.bank.accountNo}</Text>
                    <Text style={baseStyles.bankText}>Bank IFSC: {invoiceData.seller.bank.ifsc}</Text>
                  </View>
                  {invoiceData.upiId && invoiceData.showUpiQr && (
                    <View style={baseStyles.qrWrap}>
                      <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${invoiceData.upiId}&pn=${encodeURIComponent(invoiceData.seller.name)}&am=${invoiceData.grandTotal.toFixed(2)}&cu=INR`)}`} style={baseStyles.qrImg} />
                      <Text style={baseStyles.qrLabel}>SCAN TO PAY</Text>
                    </View>
                  )}
                </View>
                <Text style={baseStyles.termsBox}>Terms & Conditions Apply</Text>
              </View>
              <View style={baseStyles.footerSealBox}>
                <Text style={baseStyles.sealText}>Common Seal</Text>
              </View>
              <View style={baseStyles.footerSignBox}>
                <Text style={baseStyles.certText}>Certified that the particulars given above are true and correct.</Text>
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                  <Text style={baseStyles.authForCompany}>FOR {invoiceData.seller.name}</Text>
                  {invoiceData.showDigitalSignature && <Image src={invoiceData.signatureUrl} style={{ width: 80, height: 30, objectFit: 'contain' }} />}
                </View>
                <View style={baseStyles.signatureHLine}></View>
                <Text style={baseStyles.authSignLabel}>AUTHORISED SIGNATORY</Text>
              </View>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
};

export default GstStandard;
