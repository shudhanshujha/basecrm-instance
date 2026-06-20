import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { TemplateProps } from './types.js';

const accentColor = '#8B5CF6';
const styles = StyleSheet.create({
  page: { padding: '14mm', fontSize: 8, fontFamily: 'Helvetica', color: '#1F2937', backgroundColor: '#FFFFFF' },
  container: { flexDirection: 'column', width: '100%' },
  headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  brandGroup: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logoBox: { width: 56, height: 56 },
  logo: { width: 56, height: 56, objectFit: 'contain' },
  logoPlaceholder: { width: 56, height: 56, backgroundColor: accentColor, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  brandText: {},
  companyName: { fontSize: 20, fontWeight: 'bold', color: '#111827', letterSpacing: -0.5 },
  companySub: { fontSize: 7, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3, marginTop: 2 },
  titleGroup: { alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 32, fontWeight: 'black', color: accentColor, letterSpacing: -1, opacity: 0.15, marginBottom: -4 },
  invoiceNumber: { fontSize: 10, fontWeight: 'bold', color: '#374151', letterSpacing: 1 },
  divider: { height: 2, backgroundColor: accentColor, marginBottom: 24, opacity: 0.6 },
  grid2col: { flexDirection: 'row', marginBottom: 24, gap: 20 },
  gridCol: { flex: 1 },
  sectionLabel: { fontSize: 6, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  metaBlock: { flexDirection: 'row', marginBottom: 3 },
  metaLabel: { width: 80, fontSize: 7, color: '#9CA3AF', fontWeight: 'bold' },
  metaValue: { flex: 1, fontSize: 7, color: '#374151', fontWeight: 'bold' },
  addressBlock: { backgroundColor: '#F9FAFB', padding: 10, borderRadius: 2 },
  buyerName: { fontSize: 9, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  addressText: { fontSize: 7, color: '#6B7280', lineHeight: 1.5, marginBottom: 1 },
  table: { flexDirection: 'column', marginBottom: 24 },
  tableHeader: { flexDirection: 'row', borderBottom: '2pt solid ' + accentColor, paddingBottom: 6, marginBottom: 0 },
  tableHeaderText: { fontSize: 7, fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: 1.5 },
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
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, marginTop: 2, borderTopWidth: 2, borderTopColor: accentColor },
  grandTotalLabel: { fontSize: 10, fontWeight: 'bold', color: accentColor },
  grandTotalValue: { fontSize: 10, fontWeight: 'bold', color: accentColor },
  wordsBox: { marginBottom: 24, padding: 10, backgroundColor: '#F5F3FF', flexDirection: 'row', alignItems: 'center' },
  wordsIcon: { width: 24, height: 24, backgroundColor: accentColor, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  wordsIconText: { fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' },
  wordsText: { fontSize: 7, fontStyle: 'italic', color: '#6B7280', flex: 1 },
  footer: { flexDirection: 'row', borderTop: '1pt solid #E5E7EB', paddingTop: 12 },
  footerCol: { flex: 1 },
  footerTitle: { fontSize: 7, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  footerText: { fontSize: 6, color: '#6B7280', marginBottom: 1, lineHeight: 1.4 },
  signBox: { alignItems: 'flex-end', justifyContent: 'flex-end' },
  signLine: { width: 100, borderTop: '1.5pt solid #374151', marginTop: 20, marginBottom: 3 },
  signLabel: { fontSize: 7, fontWeight: 'bold', color: '#111827' },
  signSub: { fontSize: 6, color: '#9CA3AF' },
});

const colW = { desc: '40%', qty: '12%', rate: '16%', amount: '16%', tax: '16%' };

const ModernMinimal: React.FC<TemplateProps> = ({ invoiceData }) => {
  const phoneStr = Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone;
  const showGst = invoiceData.gstConfig !== 'NONE';
  const totalTax = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <View style={styles.brandGroup}>
              <View style={styles.logoBox}>
                {invoiceData.seller.logoUrl ? (
                  <Image src={invoiceData.seller.logoUrl} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoPlaceholderText}>{invoiceData.seller.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <View style={styles.brandText}>
                <Text style={styles.companyName}>{invoiceData.seller.name}</Text>
                <Text style={styles.companySub}>Invoice</Text>
              </View>
            </View>
            <View style={styles.titleGroup}>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>{invoiceData.invoiceNumber}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.grid2col}>
            <View style={styles.gridCol}>
              <Text style={styles.sectionLabel}>Dates</Text>
              <View style={styles.metaBlock}><Text style={styles.metaLabel}>Invoice Date</Text><Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text></View>
              <View style={styles.metaBlock}><Text style={styles.metaLabel}>Date of Supply</Text><Text style={styles.metaValue}>{invoiceData.dateOfSupply}</Text></View>
              <View style={[styles.metaBlock, { marginTop: 4 }]}><Text style={styles.metaLabel}>Place</Text><Text style={styles.metaValue}>{invoiceData.placeOfSupply}</Text></View>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.sectionLabel}>Bill To</Text>
              <View style={styles.addressBlock}>
                <Text style={styles.buyerName}>{invoiceData.buyer.name || 'Client'}</Text>
                <Text style={styles.addressText}>{invoiceData.buyer.address}</Text>
                {invoiceData.buyer.gstin && <Text style={styles.addressText}>GSTIN: {invoiceData.buyer.gstin}</Text>}
                <Text style={styles.addressText}>State: {invoiceData.buyer.state || '-'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: colW.desc }]}>Description</Text>
              <Text style={[styles.tableHeaderText, { width: colW.qty, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.tableHeaderText, { width: colW.rate, textAlign: 'right' }]}>Rate</Text>
              <Text style={[styles.tableHeaderText, { width: colW.amount, textAlign: 'right' }]}>Amount</Text>
              {showGst && <Text style={[styles.tableHeaderText, { width: colW.tax, textAlign: 'right' }]}>Tax</Text>}
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCellBold, { width: colW.desc }]}>{item.description}</Text>
                <Text style={[styles.tableCell, { width: colW.qty, textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[styles.tableCellRight, { width: colW.rate }]}>${item.rate.toFixed(2)}</Text>
                <Text style={[styles.tableCellRight, { width: colW.amount }]}>${item.amount.toFixed(2)}</Text>
                {showGst && (
                  <Text style={[styles.tableCellRight, { width: colW.tax }]}>
                    ${((item.cgstAmount || 0) + (item.sgstAmount || 0) + (item.igstAmount || 0)).toFixed(2)}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.totalsSection}>
            <View style={styles.totalsBox}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Subtotal</Text>
                <Text style={styles.totalsValue}>${invoiceData.subtotal.toFixed(2)}</Text>
              </View>
              {showGst && (
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Tax</Text>
                  <Text style={styles.totalsValue}>${totalTax.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>${invoiceData.grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.wordsBox}>
            <View style={styles.wordsIcon}>
              <Text style={styles.wordsIconText}>$</Text>
            </View>
            <Text style={styles.wordsText}>{invoiceData.grandTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerCol}>
              <Text style={styles.footerTitle}>Payment</Text>
              {invoiceData.seller.bank.name && (
                <>
                  <Text style={styles.footerText}>{invoiceData.seller.bank.name} - {invoiceData.seller.bank.branch}</Text>
                  <Text style={styles.footerText}>A/C: {invoiceData.seller.bank.accountNo}</Text>
                  <Text style={styles.footerText}>IFSC: {invoiceData.seller.bank.ifsc}</Text>
                </>
              )}
              {invoiceData.upiId && <Text style={styles.footerText}>UPI: {invoiceData.upiId}</Text>}
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerTitle}>Contact</Text>
              <Text style={styles.footerText}>{invoiceData.seller.email}</Text>
              <Text style={styles.footerText}>{phoneStr}</Text>
            </View>
            <View style={[styles.footerCol, styles.signBox]}>
              <Text style={styles.signLine}></Text>
              <Text style={styles.signLabel}>Authorized Signature</Text>
              <Text style={styles.signSub}>{invoiceData.seller.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernMinimal;
