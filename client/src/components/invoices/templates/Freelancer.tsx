import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { TemplateProps } from './types';

const accentColor = '#2563EB';
const styles = StyleSheet.create({
  page: { padding: '14mm 12mm', fontSize: 8, fontFamily: 'Helvetica', color: '#1E293B', backgroundColor: '#FFFFFF' },
  container: { flexDirection: 'column', width: '100%' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: accentColor },
  leftGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox: { width: 48, height: 48 },
  logo: { width: 48, height: 48, objectFit: 'contain', borderRadius: 24 },
  logoPlaceholder: { width: 48, height: 48, backgroundColor: accentColor, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  nameGroup: {},
  freelancerName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 1 },
  freelancerTag: { fontSize: 7, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  rightInvoice: { alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 24, fontWeight: 'bold', color: accentColor, letterSpacing: 4, textTransform: 'uppercase' },
  invoiceNum: { fontSize: 8, color: '#64748B', marginTop: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 4 },
  metaItem: {},
  metaLabel: { fontSize: 6, color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1 },
  metaValue: { fontSize: 8, fontWeight: 'bold', color: '#1E293B' },
  clientBox: { marginBottom: 20, padding: 12, borderLeft: '3pt solid ' + accentColor, backgroundColor: '#F8FAFC' },
  clientLabel: { fontSize: 6, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  clientName: { fontSize: 12, fontWeight: 'bold', color: '#0F172A', marginBottom: 2 },
  clientDetail: { fontSize: 7, color: '#64748B', marginBottom: 1, lineHeight: 1.4 },
  table: { flexDirection: 'column', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', borderBottom: '1.5pt solid ' + accentColor, paddingBottom: 4, marginBottom: 2 },
  tableHeaderText: { fontSize: 7, fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0' },
  tableCell: { fontSize: 7, color: '#475569' },
  tableCellBold: { fontSize: 7, fontWeight: 'bold', color: '#0F172A' },
  tableCellRight: { fontSize: 7, color: '#475569', textAlign: 'right' },
  emptyRow: { height: 10 },
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  totalsBox: { width: '50%', padding: 10, backgroundColor: '#F8FAFC', borderRadius: 4 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, paddingVertical: 1 },
  totalsLabel: { fontSize: 7, color: '#64748B' },
  totalsValue: { fontSize: 7, fontWeight: 'bold', color: '#1E293B' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, borderTopColor: accentColor, paddingTop: 4, marginTop: 4 },
  grandTotalLabel: { fontSize: 10, fontWeight: 'bold', color: accentColor },
  grandTotalValue: { fontSize: 10, fontWeight: 'bold', color: accentColor },
  wordsBox: { padding: 8, backgroundColor: '#EFF6FF', borderRadius: 4, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  wordsLabel: { fontSize: 6, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginRight: 6 },
  wordsText: { fontSize: 7, fontStyle: 'italic', color: '#475569', flex: 1 },
  footer: { flexDirection: 'row', borderTop: '1pt solid #E2E8F0', paddingTop: 10 },
  footerCol: { flex: 1 },
  footerTitle: { fontSize: 6, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  footerText: { fontSize: 6, color: '#64748B', marginBottom: 1, lineHeight: 1.4 },
  signArea: { alignItems: 'flex-end', justifyContent: 'flex-end' },
  signLine: { width: 100, borderTop: '1.5pt solid #1E293B', marginTop: 20, marginBottom: 3 },
  signLabel: { fontSize: 7, fontWeight: 'bold', color: '#0F172A' },
  contactRow: { marginTop: 4 },
});

const colW = { desc: '50%', qty: '12%', rate: '18%', total: '20%' };

const Freelancer: React.FC<TemplateProps> = ({ invoiceData }) => {
  const phoneStr = Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <View style={styles.leftGroup}>
              <View style={styles.logoBox}>
                {invoiceData.seller.logoUrl ? (
                  <Image src={invoiceData.seller.logoUrl} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoPlaceholderText}>{invoiceData.seller.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <View style={styles.nameGroup}>
                <Text style={styles.freelancerName}>{invoiceData.seller.name}</Text>
                <Text style={styles.freelancerTag}>Independent Consultant</Text>
              </View>
            </View>
            <View style={styles.rightInvoice}>
              <Text style={styles.invoiceTitle}>Invoice</Text>
              <Text style={styles.invoiceNum}>{invoiceData.invoiceNumber}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{invoiceData.invoiceDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={[styles.metaValue, { color: accentColor }]}>Pending</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Payment Due</Text>
              <Text style={styles.metaValue}>15 Days</Text>
            </View>
          </View>

          <View style={styles.clientBox}>
            <Text style={styles.clientLabel}>Bill To</Text>
            <Text style={styles.clientName}>{invoiceData.buyer.name || 'Client'}</Text>
            <Text style={styles.clientDetail}>{invoiceData.buyer.address}</Text>
            {invoiceData.buyer.gstin && <Text style={styles.clientDetail}>GSTIN: {invoiceData.buyer.gstin}</Text>}
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: colW.desc }]}>Service / Item</Text>
              <Text style={[styles.tableHeaderText, { width: colW.qty, textAlign: 'center' }]}>Hours</Text>
              <Text style={[styles.tableHeaderText, { width: colW.rate, textAlign: 'right' }]}>Rate</Text>
              <Text style={[styles.tableHeaderText, { width: colW.total, textAlign: 'right' }]}>Amount</Text>
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCellBold, { width: colW.desc }]}>{item.description}</Text>
                <Text style={[styles.tableCell, { width: colW.qty, textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[styles.tableCell, { width: colW.rate, textAlign: 'right' }]}>${item.rate.toFixed(2)}</Text>
                <Text style={[styles.tableCellBold, { width: colW.total, textAlign: 'right' }]}>${item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsSection}>
            <View style={styles.totalsBox}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Subtotal</Text>
                <Text style={styles.totalsValue}>${invoiceData.subtotal.toFixed(2)}</Text>
              </View>
              {(invoiceData.cgstTotal > 0 || invoiceData.igstTotal > 0) && (
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Tax</Text>
                  <Text style={styles.totalsValue}>
                    ${((invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0)).toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>${invoiceData.grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.wordsBox}>
            <Text style={styles.wordsLabel}>In Words:</Text>
            <Text style={styles.wordsText}>{invoiceData.grandTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerCol}>
              <Text style={styles.footerTitle}>Payment</Text>
              {invoiceData.seller.bank.name && (
                <>
                  <Text style={styles.footerText}>{invoiceData.seller.bank.name} | {invoiceData.seller.bank.branch}</Text>
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
            <View style={[styles.footerCol, styles.signArea]}>
              <Text style={styles.signLine}></Text>
              <Text style={styles.signLabel}>{invoiceData.seller.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Freelancer;
