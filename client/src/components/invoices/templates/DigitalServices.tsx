import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { TemplateProps } from './types.js';
import { getAccentColor, getLightBg } from './colors.js';

const baseStyles = StyleSheet.create({
  page: { padding: '12mm', fontSize: 8, fontFamily: 'Helvetica', color: '#1F2937', backgroundColor: '#FFFFFF' },
  container: { flexDirection: 'column', width: '100%' },
  accentBar: { height: 4, marginBottom: 20, borderRadius: 2 },
  headerRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' },
  logoBox: { width: 70, height: 70, marginRight: 16 },
  logo: { width: 70, height: 70, objectFit: 'contain' },
  logoPlaceholder: { width: 70, height: 70, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { fontSize: 20, fontWeight: 'bold' },
  headerInfo: { flex: 1 },
  companyName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  companyTagline: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  companyDetail: { fontSize: 7, color: '#6B7280', marginBottom: 1, lineHeight: 1.5 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingBottom: 8, borderBottomWidth: 2 },
  invoiceTitle: { fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 },
  invoiceMeta: { alignItems: 'flex-end' },
  metaText: { fontSize: 7, color: '#6B7280', marginBottom: 1 },
  metaValue: { fontSize: 8, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  partiesRow: { flexDirection: 'row', marginBottom: 20, gap: 20 },
  partyBox: { flex: 1, padding: 12, borderRadius: 6 },
  partyLabel: { fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  partyName: { fontSize: 10, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  partyDetail: { fontSize: 7, color: '#6B7280', marginBottom: 1, lineHeight: 1.5 },
  sectionLabel: { fontSize: 6, color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
  table: { flexDirection: 'column', marginBottom: 20, borderRadius: 6, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8 },
  tableHeaderText: { color: '#FFFFFF', fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB' },
  tableRowAlt: { backgroundColor: '#F9FAFB' },
  tableCell: { fontSize: 7, color: '#374151' },
  tableCellBold: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  tableCellRight: { fontSize: 7, color: '#374151', textAlign: 'right' },
  emptyRow: { height: 8 },
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  totalsBox: { width: '45%', padding: 12, borderRadius: 6 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, paddingVertical: 1 },
  totalsLabel: { fontSize: 7, color: '#6B7280' },
  totalsValue: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, paddingTop: 4, marginTop: 4 },
  grandTotalLabel: { fontSize: 9, fontWeight: 'bold' },
  grandTotalValue: { fontSize: 9, fontWeight: 'bold' },
  wordsBox: { marginBottom: 16, padding: 10, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  wordsIcon: { fontSize: 14, marginRight: 8 },
  wordsText: { fontSize: 7, fontStyle: 'italic', color: '#374151', flex: 1 },
  footer: { flexDirection: 'row', borderTop: '1pt solid #E5E7EB', paddingTop: 12, marginTop: 4 },
  footerCol: { flex: 1 },
  footerTitle: { fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  footerText: { fontSize: 6, color: '#6B7280', marginBottom: 1, lineHeight: 1.5 },
  signBox: { alignItems: 'flex-end' },
  signLine: { width: 120, borderTop: '1pt solid #374151', marginTop: 24, marginBottom: 4 },
  signLabel: { fontSize: 7, fontWeight: 'bold', color: '#1F2937', textTransform: 'uppercase' },
});

const DigitalServices: React.FC<TemplateProps> = ({ invoiceData }) => {
  const accentColor = getAccentColor(invoiceData);
  const lightBg = getLightBg(accentColor);
  const cur = invoiceData.currency || '$';

  const phoneStr = Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone;
  const totalTax = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);
  const showGst = invoiceData.gstConfig !== 'NONE';

  const formatCur = (val: number) => `${cur}${val.toFixed(2)}`;

  const d = {
    accentBar: { backgroundColor: accentColor },
    logoPlaceholder: { backgroundColor: lightBg },
    logoPlaceholderText: { color: accentColor },
    companyTagline: { color: accentColor },
    titleRow: { borderBottomColor: accentColor },
    invoiceTitle: { color: accentColor },
    partyBox: { backgroundColor: lightBg },
    partyLabel: { color: accentColor },
    tableHeader: { backgroundColor: accentColor },
    totalsBox: { backgroundColor: lightBg },
    grandTotalRow: { borderTopColor: accentColor },
    grandTotalLabel: { color: accentColor },
    grandTotalValue: { color: accentColor },
    wordsBox: { backgroundColor: lightBg },
    wordsIcon: { color: accentColor },
    footerTitle: { color: accentColor },
  };

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <View style={baseStyles.container}>
          <View style={[baseStyles.accentBar, d.accentBar]} />

          <View style={baseStyles.headerRow}>
            <View style={baseStyles.logoBox}>
              {invoiceData.seller.logoUrl ? (
                <Image src={invoiceData.seller.logoUrl} style={baseStyles.logo} />
              ) : (
                <View style={[baseStyles.logoPlaceholder, d.logoPlaceholder]}>
                  <Text style={[baseStyles.logoPlaceholderText, d.logoPlaceholderText]}>{invoiceData.seller.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            <View style={baseStyles.headerInfo}>
              <Text style={baseStyles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={[baseStyles.companyTagline, d.companyTagline]}>Digital Invoice</Text>
              <Text style={baseStyles.companyDetail}>{invoiceData.seller.address}</Text>
              <Text style={baseStyles.companyDetail}>Phone: {phoneStr} | Email: {invoiceData.seller.email}</Text>
              {invoiceData.seller.gstin && <Text style={baseStyles.companyDetail}>GSTIN: {invoiceData.seller.gstin}</Text>}
            </View>
          </View>

          <View style={[baseStyles.titleRow, d.titleRow]}>
            <Text style={[baseStyles.invoiceTitle, d.invoiceTitle]}>Invoice</Text>
            <View style={baseStyles.invoiceMeta}>
              <Text style={baseStyles.metaText}>Invoice #</Text>
              <Text style={baseStyles.metaValue}>{invoiceData.invoiceNumber}</Text>
              <Text style={[baseStyles.metaText, { marginTop: 2 }]}>Date</Text>
              <Text style={baseStyles.metaValue}>{invoiceData.invoiceDate}</Text>
            </View>
          </View>

          <View style={baseStyles.partiesRow}>
            <View style={[baseStyles.partyBox, d.partyBox]}>
              <Text style={[baseStyles.partyLabel, d.partyLabel]}>Bill To</Text>
              <Text style={baseStyles.partyName}>{invoiceData.buyer.name || 'Client'}</Text>
              <Text style={baseStyles.partyDetail}>{invoiceData.buyer.address}</Text>
              {invoiceData.buyer.gstin && <Text style={baseStyles.partyDetail}>GSTIN: {invoiceData.buyer.gstin}</Text>}
              <Text style={baseStyles.partyDetail}>State: {invoiceData.buyer.state || '-'}</Text>
            </View>
            <View style={[baseStyles.partyBox, d.partyBox]}>
              <Text style={[baseStyles.partyLabel, d.partyLabel]}>From</Text>
              <Text style={baseStyles.partyName}>{invoiceData.seller.name}</Text>
              <Text style={baseStyles.partyDetail}>{invoiceData.seller.address}</Text>
              {invoiceData.seller.gstin && <Text style={baseStyles.partyDetail}>GSTIN: {invoiceData.seller.gstin}</Text>}
              {invoiceData.projectName && <Text style={baseStyles.partyDetail}>Project: {invoiceData.projectName}</Text>}
              {invoiceData.servicePeriod && <Text style={baseStyles.partyDetail}>Period: {invoiceData.servicePeriod}</Text>}
            </View>
          </View>

          <Text style={baseStyles.sectionLabel}>Services Rendered</Text>

          <View style={baseStyles.table}>
            <View style={[baseStyles.tableHeader, d.tableHeader]}>
              <Text style={{ ...baseStyles.tableHeaderText, width: '38%' }}>Description</Text>
              <Text style={{ ...baseStyles.tableHeaderText, width: '10%', textAlign: 'center' }}>Qty</Text>
              <Text style={{ ...baseStyles.tableHeaderText, width: '15%', textAlign: 'right' }}>Rate</Text>
              <Text style={{ ...baseStyles.tableHeaderText, width: '15%', textAlign: 'right' }}>Amount</Text>
              {showGst && <Text style={{ ...baseStyles.tableHeaderText, width: '10%', textAlign: 'right' }}>Tax</Text>}
              <Text style={{ ...baseStyles.tableHeaderText, width: '12%', textAlign: 'right' }}>Total</Text>
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={[baseStyles.tableRow, i % 2 === 1 ? baseStyles.tableRowAlt : {}]}>
                <Text style={[baseStyles.tableCellBold, { width: '38%' }]}>{item.description}</Text>
                <Text style={[baseStyles.tableCell, { width: '10%', textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[baseStyles.tableCell, { width: '15%', textAlign: 'right' }]}>{formatCur(item.rate)}</Text>
                <Text style={[baseStyles.tableCell, { width: '15%', textAlign: 'right' }]}>{formatCur(item.amount)}</Text>
                {showGst && (
                  <Text style={[baseStyles.tableCell, { width: '10%', textAlign: 'right' }]}>
                    {formatCur((item.cgstAmount || 0) + (item.sgstAmount || 0) + (item.igstAmount || 0))}
                  </Text>
                )}
                <Text style={[baseStyles.tableCellBold, { width: '12%', textAlign: 'right' }]}>{formatCur(item.total)}</Text>
              </View>
            ))}
          </View>

          <View style={baseStyles.totalsSection}>
            <View style={[baseStyles.totalsBox, d.totalsBox]}>
              <View style={baseStyles.totalsRow}>
                <Text style={baseStyles.totalsLabel}>Subtotal</Text>
                <Text style={baseStyles.totalsValue}>{formatCur(invoiceData.subtotal)}</Text>
              </View>
              {showGst && (
                <View style={baseStyles.totalsRow}>
                  <Text style={baseStyles.totalsLabel}>Tax ({invoiceData.gstConfig === 'INTRA' ? 'CGST+SGST' : 'IGST'})</Text>
                  <Text style={baseStyles.totalsValue}>{formatCur(totalTax)}</Text>
                </View>
              )}
              <View style={[baseStyles.grandTotalRow, d.grandTotalRow]}>
                <Text style={[baseStyles.grandTotalLabel, d.grandTotalLabel]}>Total Due</Text>
                <Text style={[baseStyles.grandTotalValue, d.grandTotalValue]}>{formatCur(invoiceData.grandTotal)}</Text>
              </View>
            </View>
          </View>

          <View style={[baseStyles.wordsBox, d.wordsBox]}>
            <Text style={[baseStyles.wordsIcon, d.wordsIcon]}>{cur}</Text>
            <Text style={baseStyles.wordsText}>Amount: {formatCur(invoiceData.grandTotal)}</Text>
          </View>

          <View style={baseStyles.footer}>
            <View style={baseStyles.footerCol}>
              <Text style={[baseStyles.footerTitle, d.footerTitle]}>Payment Details</Text>
              {invoiceData.seller.bank.name && (
                <>
                  <Text style={baseStyles.footerText}>Bank: {invoiceData.seller.bank.name}</Text>
                  <Text style={baseStyles.footerText}>Account: {invoiceData.seller.bank.accountNo}</Text>
                  <Text style={baseStyles.footerText}>IFSC: {invoiceData.seller.bank.ifsc}</Text>
                </>
              )}
              {invoiceData.upiId && <Text style={baseStyles.footerText}>UPI: {invoiceData.upiId}</Text>}
            </View>
            <View style={baseStyles.footerCol}>
              <Text style={[baseStyles.footerTitle, d.footerTitle]}>Terms</Text>
              <Text style={baseStyles.footerText}>Payment due within 15 days</Text>
              <Text style={baseStyles.footerText}>Late payment may incur interest</Text>
            </View>
            <View style={[baseStyles.footerCol, baseStyles.signBox]}>
              <Text style={baseStyles.signLine}></Text>
              <Text style={baseStyles.signLabel}>Authorized Signature</Text>
              <Text style={[baseStyles.footerText, { marginTop: 2 }]}>For {invoiceData.seller.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DigitalServices;
