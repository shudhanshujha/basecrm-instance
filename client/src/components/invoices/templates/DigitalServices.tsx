import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { TemplateProps } from './types';

const accentColor = '#6366F1';
const lightBg = '#F8F8FF';
const styles = StyleSheet.create({
  page: { padding: '12mm', fontSize: 8, fontFamily: 'Helvetica', color: '#1F2937', backgroundColor: '#FFFFFF' },
  container: { flexDirection: 'column', width: '100%' },
  accentBar: { height: 4, backgroundColor: accentColor, marginBottom: 20, borderRadius: 2 },
  headerRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' },
  logoBox: { width: 70, height: 70, marginRight: 16 },
  logo: { width: 70, height: 70, objectFit: 'contain' },
  logoPlaceholder: { width: 70, height: 70, backgroundColor: '#EEF2FF', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { fontSize: 20, fontWeight: 'bold', color: accentColor },
  headerInfo: { flex: 1 },
  companyName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  companyTagline: { fontSize: 7, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  companyDetail: { fontSize: 7, color: '#6B7280', marginBottom: 1, lineHeight: 1.5 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingBottom: 8, borderBottom: '2pt solid ' + accentColor },
  invoiceTitle: { fontSize: 18, fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: 3 },
  invoiceMeta: { alignItems: 'flex-end' },
  metaText: { fontSize: 7, color: '#6B7280', marginBottom: 1 },
  metaValue: { fontSize: 8, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  partiesRow: { flexDirection: 'row', marginBottom: 20, gap: 20 },
  partyBox: { flex: 1, padding: 12, backgroundColor: lightBg, borderRadius: 6 },
  partyLabel: { fontSize: 6, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  partyName: { fontSize: 10, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  partyDetail: { fontSize: 7, color: '#6B7280', marginBottom: 1, lineHeight: 1.5 },
  sectionLabel: { fontSize: 6, color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
  table: { flexDirection: 'column', marginBottom: 20, borderRadius: 6, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: accentColor, paddingVertical: 6, paddingHorizontal: 8 },
  tableHeaderText: { color: '#FFFFFF', fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB' },
  tableRowAlt: { backgroundColor: '#F9FAFB' },
  tableCell: { fontSize: 7, color: '#374151' },
  tableCellBold: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  tableCellRight: { fontSize: 7, color: '#374151', textAlign: 'right' },
  emptyRow: { height: 8 },
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  totalsBox: { width: '45%', backgroundColor: lightBg, borderRadius: 6, padding: 12 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, paddingVertical: 1 },
  totalsLabel: { fontSize: 7, color: '#6B7280' },
  totalsValue: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, borderTopColor: accentColor, paddingTop: 4, marginTop: 4 },
  grandTotalLabel: { fontSize: 9, fontWeight: 'bold', color: accentColor },
  grandTotalValue: { fontSize: 9, fontWeight: 'bold', color: accentColor },
  wordsBox: { marginBottom: 16, padding: 10, backgroundColor: '#EEF2FF', borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  wordsIcon: { fontSize: 14, marginRight: 8, color: accentColor },
  wordsText: { fontSize: 7, fontStyle: 'italic', color: '#374151', flex: 1 },
  footer: { flexDirection: 'row', borderTop: '1pt solid #E5E7EB', paddingTop: 12, marginTop: 4 },
  footerCol: { flex: 1 },
  footerTitle: { fontSize: 6, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  footerText: { fontSize: 6, color: '#6B7280', marginBottom: 1, lineHeight: 1.5 },
  signBox: { alignItems: 'flex-end' },
  signLine: { width: 120, borderTop: '1pt solid #374151', marginTop: 24, marginBottom: 4 },
  signLabel: { fontSize: 7, fontWeight: 'bold', color: '#1F2937', textTransform: 'uppercase' },
});

const DigitalServices: React.FC<TemplateProps> = ({ invoiceData }) => {
  const phoneStr = Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone;
  const totalTax = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);
  const showGst = invoiceData.gstConfig !== 'NONE';

  const colWidths = { desc: '38%', qty: '10%', rate: '15%', amount: '15%', tax: '10%', total: '12%' };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.accentBar} />

          <View style={styles.headerRow}>
            <View style={styles.logoBox}>
              {invoiceData.seller.logoUrl ? (
                <Image src={invoiceData.seller.logoUrl} style={styles.logo} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoPlaceholderText}>{invoiceData.seller.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={styles.companyTagline}>Digital Invoice</Text>
              <Text style={styles.companyDetail}>{invoiceData.seller.address}</Text>
              <Text style={styles.companyDetail}>Phone: {phoneStr} | Email: {invoiceData.seller.email}</Text>
              {invoiceData.seller.gstin && <Text style={styles.companyDetail}>GSTIN: {invoiceData.seller.gstin}</Text>}
            </View>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <View style={styles.invoiceMeta}>
              <Text style={styles.metaText}>Invoice #</Text>
              <Text style={styles.metaValue}>{invoiceData.invoiceNumber}</Text>
              <Text style={[styles.metaText, { marginTop: 2 }]}>Date</Text>
              <Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text>
            </View>
          </View>

          <View style={styles.partiesRow}>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>Bill To</Text>
              <Text style={styles.partyName}>{invoiceData.buyer.name || 'Client'}</Text>
              <Text style={styles.partyDetail}>{invoiceData.buyer.address}</Text>
              {invoiceData.buyer.gstin && <Text style={styles.partyDetail}>GSTIN: {invoiceData.buyer.gstin}</Text>}
              <Text style={styles.partyDetail}>State: {invoiceData.buyer.state || '-'}</Text>
            </View>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>From</Text>
              <Text style={styles.partyName}>{invoiceData.seller.name}</Text>
              <Text style={styles.partyDetail}>{invoiceData.seller.address}</Text>
              {invoiceData.seller.gstin && <Text style={styles.partyDetail}>GSTIN: {invoiceData.seller.gstin}</Text>}
            </View>
          </View>

          <Text style={styles.sectionLabel}>Services Rendered</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: colWidths.desc }]}>Description</Text>
              <Text style={[styles.tableHeaderText, { width: colWidths.qty, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.tableHeaderText, { width: colWidths.rate, textAlign: 'right' }]}>Rate</Text>
              <Text style={[styles.tableHeaderText, { width: colWidths.amount, textAlign: 'right' }]}>Amount</Text>
              {showGst && <Text style={[styles.tableHeaderText, { width: colWidths.tax, textAlign: 'right' }]}>Tax</Text>}
              <Text style={[styles.tableHeaderText, { width: colWidths.total, textAlign: 'right' }]}>Total</Text>
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCellBold, { width: colWidths.desc }]}>{item.description}</Text>
                <Text style={[styles.tableCell, { width: colWidths.qty, textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[styles.tableCell, { width: colWidths.rate, textAlign: 'right' }]}>${item.rate.toFixed(2)}</Text>
                <Text style={[styles.tableCell, { width: colWidths.amount, textAlign: 'right' }]}>${item.amount.toFixed(2)}</Text>
                {showGst && (
                  <Text style={[styles.tableCell, { width: colWidths.tax, textAlign: 'right' }]}>
                    ${((item.cgstAmount || 0) + (item.sgstAmount || 0) + (item.igstAmount || 0)).toFixed(2)}
                  </Text>
                )}
                <Text style={[styles.tableCellBold, { width: colWidths.total, textAlign: 'right' }]}>${item.total.toFixed(2)}</Text>
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
                  <Text style={styles.totalsLabel}>Tax ({invoiceData.gstConfig === 'INTRA' ? 'CGST+SGST' : 'IGST'})</Text>
                  <Text style={styles.totalsValue}>${totalTax.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total Due</Text>
                <Text style={styles.grandTotalValue}>${invoiceData.grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.wordsBox}>
            <Text style={styles.wordsIcon}>&#163;</Text>
            <Text style={styles.wordsText}>Amount in words: {invoiceData.grandTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerCol}>
              <Text style={styles.footerTitle}>Payment Details</Text>
              {invoiceData.seller.bank.name && (
                <>
                  <Text style={styles.footerText}>Bank: {invoiceData.seller.bank.name}</Text>
                  <Text style={styles.footerText}>Account: {invoiceData.seller.bank.accountNo}</Text>
                  <Text style={styles.footerText}>IFSC: {invoiceData.seller.bank.ifsc}</Text>
                </>
              )}
              {invoiceData.upiId && <Text style={styles.footerText}>UPI: {invoiceData.upiId}</Text>}
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerTitle}>Terms</Text>
              <Text style={styles.footerText}>Payment due within 15 days</Text>
              <Text style={styles.footerText}>Late payment may incur interest</Text>
            </View>
            <View style={[styles.footerCol, styles.signBox]}>
              <Text style={styles.signLine}></Text>
              <Text style={styles.signLabel}>Authorized Signature</Text>
              <Text style={[styles.footerText, { marginTop: 2 }]}>For {invoiceData.seller.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DigitalServices;
