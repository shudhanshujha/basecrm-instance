import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { TemplateProps } from './types.js';
import { getAccentColor, getLightBg } from './colors.js';

const baseStyles = StyleSheet.create({
  page: { padding: '14mm 12mm', fontSize: 8, fontFamily: 'Helvetica', color: '#1E293B', backgroundColor: '#FFFFFF' },
  container: { flexDirection: 'column', width: '100%' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 2 },
  leftGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox: { width: 48, height: 48 },
  logo: { width: 48, height: 48, objectFit: 'contain', borderRadius: 24 },
  logoPlaceholder: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  nameGroup: {},
  freelancerName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 1 },
  freelancerTag: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  rightInvoice: { alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 24, fontWeight: 'bold', letterSpacing: 4, textTransform: 'uppercase' },
  invoiceNum: { fontSize: 8, color: '#64748B', marginTop: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 4 },
  metaItem: {},
  metaLabel: { fontSize: 6, color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1 },
  metaValue: { fontSize: 8, fontWeight: 'bold', color: '#1E293B' },
  clientBox: { marginBottom: 20, padding: 12, borderLeftWidth: 3, backgroundColor: '#F8FAFC' },
  clientLabel: { fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  clientName: { fontSize: 12, fontWeight: 'bold', color: '#0F172A', marginBottom: 2 },
  clientDetail: { fontSize: 7, color: '#64748B', marginBottom: 1, lineHeight: 1.4 },
  table: { flexDirection: 'column', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1.5, paddingBottom: 4, marginBottom: 2 },
  tableHeaderText: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0' },
  tableCell: { fontSize: 7, color: '#475569' },
  tableCellBold: { fontSize: 7, fontWeight: 'bold', color: '#0F172A' },
  tableCellRight: { fontSize: 7, color: '#475569', textAlign: 'right' },
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  totalsBox: { width: '50%', padding: 10, borderRadius: 4, backgroundColor: '#F8FAFC' },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, paddingVertical: 1 },
  totalsLabel: { fontSize: 7, color: '#64748B' },
  totalsValue: { fontSize: 7, fontWeight: 'bold', color: '#1E293B' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, paddingTop: 4, marginTop: 4 },
  grandTotalLabel: { fontSize: 10, fontWeight: 'bold' },
  grandTotalValue: { fontSize: 10, fontWeight: 'bold' },
  wordsBox: { padding: 8, borderRadius: 4, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  wordsLabel: { fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginRight: 6 },
  wordsText: { fontSize: 7, fontStyle: 'italic', color: '#475569', flex: 1 },
  footer: { flexDirection: 'row', borderTop: '1pt solid #E2E8F0', paddingTop: 10 },
  footerCol: { flex: 1 },
  footerTitle: { fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  footerText: { fontSize: 6, color: '#64748B', marginBottom: 1, lineHeight: 1.4 },
  signArea: { alignItems: 'flex-end', justifyContent: 'flex-end' },
  signLine: { width: 100, borderTop: '1.5pt solid #1E293B', marginTop: 20, marginBottom: 3 },
  signLabel: { fontSize: 7, fontWeight: 'bold', color: '#0F172A' },
});

const colW = { desc: '50%', qty: '12%', rate: '18%', total: '20%' };

const Freelancer: React.FC<TemplateProps> = ({ invoiceData }) => {
  const accentColor = getAccentColor(invoiceData);
  const lightBg = getLightBg(accentColor);
  const cur = invoiceData.currency || '$';
  const phoneStr = Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone;
  const formatCur = (val: number) => `${cur}${val.toFixed(2)}`;

  const d = {
    topBar: { borderBottomColor: accentColor },
    logoPlaceholder: { backgroundColor: accentColor },
    freelancerTag: { color: accentColor },
    invoiceTitle: { color: accentColor },
    metaValue: { color: accentColor },
    clientBox: { borderLeftColor: accentColor },
    clientLabel: { color: accentColor },
    tableHeader: { borderBottomColor: accentColor },
    tableHeaderText: { color: accentColor },
    grandTotalRow: { borderTopColor: accentColor },
    grandTotalLabel: { color: accentColor },
    grandTotalValue: { color: accentColor },
    wordsBox: { backgroundColor: lightBg },
    wordsLabel: { color: accentColor },
    footerTitle: { color: accentColor },
  };

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <View style={baseStyles.container}>
          <View style={[baseStyles.topBar, d.topBar]}>
            <View style={baseStyles.leftGroup}>
              <View style={baseStyles.logoBox}>
                {invoiceData.seller.logoUrl ? (
                  <Image src={invoiceData.seller.logoUrl} style={baseStyles.logo} />
                ) : (
                  <View style={[baseStyles.logoPlaceholder, d.logoPlaceholder]}>
                    <Text style={baseStyles.logoPlaceholderText}>{invoiceData.seller.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <View style={baseStyles.nameGroup}>
                <Text style={baseStyles.freelancerName}>{invoiceData.seller.name}</Text>
                <Text style={[baseStyles.freelancerTag, d.freelancerTag]}>Independent Consultant</Text>
              </View>
            </View>
            <View style={baseStyles.rightInvoice}>
              <Text style={[baseStyles.invoiceTitle, d.invoiceTitle]}>Invoice</Text>
              <Text style={baseStyles.invoiceNum}>{invoiceData.invoiceNumber}</Text>
            </View>
          </View>

          <View style={baseStyles.metaRow}>
            <View style={baseStyles.metaItem}>
              <Text style={baseStyles.metaLabel}>Date</Text>
              <Text style={baseStyles.metaValue}>{invoiceData.invoiceDate}</Text>
            </View>
            <View style={baseStyles.metaItem}>
              <Text style={baseStyles.metaLabel}>Status</Text>
              <Text style={[baseStyles.metaValue, d.metaValue]}>Pending</Text>
            </View>
            <View style={baseStyles.metaItem}>
              <Text style={baseStyles.metaLabel}>Payment Due</Text>
              <Text style={baseStyles.metaValue}>15 Days</Text>
            </View>
            {invoiceData.billingType && (
              <View style={baseStyles.metaItem}>
                <Text style={baseStyles.metaLabel}>Billing Type</Text>
                <Text style={baseStyles.metaValue}>{invoiceData.billingType}</Text>
              </View>
            )}
          </View>

          <View style={[baseStyles.clientBox, d.clientBox]}>
            <Text style={[baseStyles.clientLabel, d.clientLabel]}>Bill To</Text>
            <Text style={baseStyles.clientName}>{invoiceData.buyer.name || 'Client'}</Text>
            <Text style={baseStyles.clientDetail}>{invoiceData.buyer.address}</Text>
            {invoiceData.buyer.gstin && <Text style={baseStyles.clientDetail}>GSTIN: {invoiceData.buyer.gstin}</Text>}
            {invoiceData.projectScope && <Text style={baseStyles.clientDetail}>Scope: {invoiceData.projectScope}</Text>}
          </View>

          <View style={baseStyles.table}>
            <View style={[baseStyles.tableHeader, d.tableHeader]}>
              <Text style={[baseStyles.tableHeaderText, { width: colW.desc }]}>Service</Text>
              <Text style={[baseStyles.tableHeaderText, { width: colW.qty, textAlign: 'center' }]}>Hours</Text>
              <Text style={[baseStyles.tableHeaderText, { width: colW.rate, textAlign: 'right' }]}>Rate</Text>
              <Text style={[baseStyles.tableHeaderText, { width: colW.total, textAlign: 'right' }]}>Amount</Text>
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={baseStyles.tableRow}>
                <View style={{ width: colW.desc, flexDirection: 'column' }}>
                  <Text style={[baseStyles.tableCellBold, { marginBottom: 1 }]}>{item.name || item.description}</Text>
                  {item.name && item.description && <Text style={baseStyles.tableCell}>{item.description}</Text>}
                </View>
                <Text style={[baseStyles.tableCell, { width: colW.qty, textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[baseStyles.tableCell, { width: colW.rate, textAlign: 'right' }]}>{formatCur(item.rate)}</Text>
                <Text style={[baseStyles.tableCellBold, { width: colW.total, textAlign: 'right' }]}>{formatCur(item.total)}</Text>
              </View>
            ))}
          </View>

          <View style={baseStyles.totalsSection}>
            <View style={baseStyles.totalsBox}>
              <View style={baseStyles.totalsRow}>
                <Text style={baseStyles.totalsLabel}>Subtotal</Text>
                <Text style={baseStyles.totalsValue}>{formatCur(invoiceData.subtotal)}</Text>
              </View>
              {(invoiceData.cgstTotal > 0 || invoiceData.igstTotal > 0) && (
                <View style={baseStyles.totalsRow}>
                  <Text style={baseStyles.totalsLabel}>Tax</Text>
                  <Text style={baseStyles.totalsValue}>{formatCur((invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0))}</Text>
                </View>
              )}
              <View style={[baseStyles.grandTotalRow, d.grandTotalRow]}>
                <Text style={[baseStyles.grandTotalLabel, d.grandTotalLabel]}>Total</Text>
                <Text style={[baseStyles.grandTotalValue, d.grandTotalValue]}>{formatCur(invoiceData.grandTotal)}</Text>
              </View>
            </View>
          </View>

          <View style={[baseStyles.wordsBox, d.wordsBox]}>
            <Text style={[baseStyles.wordsLabel, d.wordsLabel]}>In Words:</Text>
            <Text style={baseStyles.wordsText}>{formatCur(invoiceData.grandTotal)}</Text>
          </View>

          <View style={baseStyles.footer}>
            <View style={baseStyles.footerCol}>
              <Text style={[baseStyles.footerTitle, d.footerTitle]}>Payment</Text>
              {invoiceData.seller.bank.name && (
                <><Text style={baseStyles.footerText}>{invoiceData.seller.bank.name} | {invoiceData.seller.bank.branch}</Text>
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
            <View style={[baseStyles.footerCol, baseStyles.signArea]}>
              <Text style={baseStyles.signLine}></Text>
              <Text style={baseStyles.signLabel}>{invoiceData.seller.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Freelancer;
