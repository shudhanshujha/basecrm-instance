import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { TemplateProps } from './types.js';
import { getAccentColor, getLightBg } from './colors.js';

const baseStyles = StyleSheet.create({
  page: { padding: '14mm', fontSize: 8, fontFamily: 'Helvetica', color: '#1F2937', backgroundColor: '#FFFFFF' },
  container: { flexDirection: 'column', width: '100%' },
  headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  brandGroup: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logoBox: { width: 56, height: 56 },
  logo: { width: 56, height: 56, objectFit: 'contain' },
  logoPlaceholder: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  brandText: {},
  companyName: { fontSize: 20, fontWeight: 'bold', color: '#111827', letterSpacing: -0.5 },
  companySub: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3, marginTop: 2 },
  titleGroup: { alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 32, fontWeight: 'black', letterSpacing: -1, marginBottom: -4 },
  invoiceNumber: { fontSize: 10, fontWeight: 'bold', color: '#374151', letterSpacing: 1 },
  divider: { height: 2, marginBottom: 24 },
  grid2col: { flexDirection: 'row', marginBottom: 24, gap: 20 },
  gridCol: { flex: 1 },
  sectionLabel: { fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  metaBlock: { flexDirection: 'row', marginBottom: 3 },
  metaLabel: { width: 80, fontSize: 7, color: '#9CA3AF', fontWeight: 'bold' },
  metaValue: { flex: 1, fontSize: 7, color: '#374151', fontWeight: 'bold' },
  addressBlock: { backgroundColor: '#F9FAFB', padding: 10, borderRadius: 2 },
  buyerName: { fontSize: 9, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  addressText: { fontSize: 7, color: '#6B7280', lineHeight: 1.5, marginBottom: 1 },
  table: { flexDirection: 'column', marginBottom: 24 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 2, paddingBottom: 6, marginBottom: 0 },
  tableHeaderText: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5 },
  tableRow: { flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6' },
  tableRowAlt: { backgroundColor: '#FAFAFA' },
  tableCell: { fontSize: 7, color: '#4B5563' },
  tableCellBold: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  tableCellRight: { fontSize: 7, color: '#4B5563', textAlign: 'right' },
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 24 },
  totalsBox: { width: '45%' },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6' },
  totalsLabel: { fontSize: 7, color: '#6B7280' },
  totalsValue: { fontSize: 7, fontWeight: 'bold', color: '#374151' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, marginTop: 2, borderTopWidth: 2 },
  grandTotalLabel: { fontSize: 10, fontWeight: 'bold' },
  grandTotalValue: { fontSize: 10, fontWeight: 'bold' },
  wordsBox: { marginBottom: 24, padding: 10, flexDirection: 'row', alignItems: 'center' },
  wordsIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  wordsIconText: { fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' },
  wordsText: { fontSize: 7, fontStyle: 'italic', color: '#6B7280', flex: 1 },
  footer: { flexDirection: 'row', borderTop: '1pt solid #E5E7EB', paddingTop: 12 },
  footerCol: { flex: 1 },
  footerTitle: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  footerText: { fontSize: 6, color: '#6B7280', marginBottom: 1, lineHeight: 1.4 },
  signBox: { alignItems: 'flex-end', justifyContent: 'flex-end' },
  signLine: { width: 100, borderTop: '1.5pt solid #374151', marginTop: 20, marginBottom: 3 },
  signLabel: { fontSize: 7, fontWeight: 'bold', color: '#111827' },
  signSub: { fontSize: 6, color: '#9CA3AF' },
});

const colW = { desc: '40%', qty: '12%', rate: '16%', amount: '16%', tax: '16%' };

const ModernMinimal: React.FC<TemplateProps> = ({ invoiceData }) => {
  const accentColor = getAccentColor(invoiceData);
  const lightBg = getLightBg(accentColor);
  const cur = invoiceData.currency || '$';
  const phoneStr = Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone;
  const showGst = invoiceData.gstConfig !== 'NONE';
  const totalTax = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);
  const formatCur = (val: number) => `${cur}${val.toFixed(2)}`;

  const d = {
    logoPlaceholder: { backgroundColor: accentColor },
    companySub: { color: accentColor },
    invoiceTitle: { color: accentColor, opacity: 0.15 },
    divider: { backgroundColor: accentColor },
    sectionLabel: { color: accentColor },
    tableHeader: { borderBottomColor: accentColor },
    tableHeaderText: { color: accentColor },
    grandTotalRow: { borderTopColor: accentColor },
    grandTotalLabel: { color: accentColor },
    grandTotalValue: { color: accentColor },
    wordsBox: { backgroundColor: lightBg },
    wordsIcon: { backgroundColor: accentColor },
    footerTitle: { color: accentColor },
  };

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <View style={baseStyles.container}>
          <View style={baseStyles.headerSection}>
            <View style={baseStyles.brandGroup}>
              <View style={baseStyles.logoBox}>
                {invoiceData.seller.logoUrl ? (
                  <Image src={invoiceData.seller.logoUrl} style={baseStyles.logo} />
                ) : (
                  <View style={[baseStyles.logoPlaceholder, d.logoPlaceholder]}>
                    <Text style={baseStyles.logoPlaceholderText}>{invoiceData.seller.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <View style={baseStyles.brandText}>
                <Text style={baseStyles.companyName}>{invoiceData.seller.name}</Text>
                <Text style={[baseStyles.companySub, d.companySub]}>Invoice</Text>
              </View>
            </View>
            <View style={baseStyles.titleGroup}>
              <Text style={[baseStyles.invoiceTitle, d.invoiceTitle]}>INVOICE</Text>
              <Text style={baseStyles.invoiceNumber}>{invoiceData.invoiceNumber}</Text>
            </View>
          </View>

          <View style={[baseStyles.divider, d.divider]} />

          <View style={baseStyles.grid2col}>
            <View style={baseStyles.gridCol}>
              <Text style={[baseStyles.sectionLabel, d.sectionLabel]}>Dates</Text>
              <View style={baseStyles.metaBlock}><Text style={baseStyles.metaLabel}>Invoice Date</Text><Text style={baseStyles.metaValue}>{invoiceData.invoiceDate}</Text></View>
              <View style={baseStyles.metaBlock}><Text style={baseStyles.metaLabel}>Date of Supply</Text><Text style={baseStyles.metaValue}>{invoiceData.dateOfSupply}</Text></View>
              <View style={[baseStyles.metaBlock, { marginTop: 4 }]}><Text style={baseStyles.metaLabel}>Place</Text><Text style={baseStyles.metaValue}>{invoiceData.placeOfSupply}</Text></View>
            </View>
            <View style={baseStyles.gridCol}>
              <Text style={[baseStyles.sectionLabel, d.sectionLabel]}>Bill To</Text>
              <View style={baseStyles.addressBlock}>
                <Text style={baseStyles.buyerName}>{invoiceData.buyer.name || 'Client'}</Text>
                <Text style={baseStyles.addressText}>{invoiceData.buyer.address}</Text>
                {invoiceData.buyer.gstin && <Text style={baseStyles.addressText}>GSTIN: {invoiceData.buyer.gstin}</Text>}
                <Text style={baseStyles.addressText}>State: {invoiceData.buyer.state || '-'}</Text>
              </View>
            </View>
          </View>

          <View style={baseStyles.table}>
            <View style={[baseStyles.tableHeader, d.tableHeader]}>
              <Text style={[baseStyles.tableHeaderText, { width: colW.desc }]}>Description</Text>
              <Text style={[baseStyles.tableHeaderText, { width: colW.qty, textAlign: 'center' }]}>Qty</Text>
              <Text style={[baseStyles.tableHeaderText, { width: colW.rate, textAlign: 'right' }]}>Rate</Text>
              <Text style={[baseStyles.tableHeaderText, { width: colW.amount, textAlign: 'right' }]}>Amount</Text>
              {showGst && <Text style={[baseStyles.tableHeaderText, { width: colW.tax, textAlign: 'right' }]}>Tax</Text>}
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={[baseStyles.tableRow, i % 2 === 1 ? baseStyles.tableRowAlt : {}]}>
                <View style={{ width: colW.desc, flexDirection: 'column' }}>
                  <Text style={[baseStyles.tableCellBold, { marginBottom: 1 }]}>{item.name || item.description}</Text>
                  {item.name && item.description && <Text style={baseStyles.tableCell}>{item.description}</Text>}
                </View>
                <Text style={[baseStyles.tableCell, { width: colW.qty, textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[baseStyles.tableCellRight, { width: colW.rate }]}>{formatCur(item.rate)}</Text>
                <Text style={[baseStyles.tableCellRight, { width: colW.amount }]}>{formatCur(item.amount)}</Text>
                {showGst && (
                  <Text style={[baseStyles.tableCellRight, { width: colW.tax }]}>
                    {formatCur((item.cgstAmount || 0) + (item.sgstAmount || 0) + (item.igstAmount || 0))}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View style={baseStyles.totalsSection}>
            <View style={baseStyles.totalsBox}>
              <View style={baseStyles.totalsRow}>
                <Text style={baseStyles.totalsLabel}>Subtotal</Text>
                <Text style={baseStyles.totalsValue}>{formatCur(invoiceData.subtotal)}</Text>
              </View>
              {showGst && (
                <View style={baseStyles.totalsRow}>
                  <Text style={baseStyles.totalsLabel}>Tax</Text>
                  <Text style={baseStyles.totalsValue}>{formatCur(totalTax)}</Text>
                </View>
              )}
              <View style={[baseStyles.grandTotalRow, d.grandTotalRow]}>
                <Text style={[baseStyles.grandTotalLabel, d.grandTotalLabel]}>Total</Text>
                <Text style={[baseStyles.grandTotalValue, d.grandTotalValue]}>{formatCur(invoiceData.grandTotal)}</Text>
              </View>
            </View>
          </View>

          <View style={[baseStyles.wordsBox, d.wordsBox]}>
            <View style={[baseStyles.wordsIcon, d.wordsIcon]}>
              <Text style={baseStyles.wordsIconText}>{cur}</Text>
            </View>
            <Text style={baseStyles.wordsText}>{formatCur(invoiceData.grandTotal)}</Text>
          </View>

          <View style={baseStyles.footer}>
            <View style={baseStyles.footerCol}>
              <Text style={[baseStyles.footerTitle, d.footerTitle]}>Payment</Text>
              {invoiceData.seller.bank.name && (
                <><Text style={baseStyles.footerText}>{invoiceData.seller.bank.name} - {invoiceData.seller.bank.branch}</Text>
                <Text style={baseStyles.footerText}>A/C: {invoiceData.seller.bank.accountNo}</Text>
                <Text style={baseStyles.footerText}>IFSC: {invoiceData.seller.bank.ifsc}</Text></>
              )}
              {invoiceData.upiId && <Text style={baseStyles.footerText}>UPI: {invoiceData.upiId}</Text>}
            </View>
            <View style={baseStyles.footerCol}>
              <Text style={[baseStyles.footerTitle, d.footerTitle]}>Contact</Text>
              <Text style={baseStyles.footerText}>{invoiceData.seller.email}</Text>
              <Text style={baseStyles.footerText}>{phoneStr}</Text>
            </View>
            <View style={[baseStyles.footerCol, baseStyles.signBox]}>
              <Text style={baseStyles.signLine}></Text>
              <Text style={baseStyles.signLabel}>Authorized Signature</Text>
              <Text style={baseStyles.signSub}>{invoiceData.seller.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernMinimal;
