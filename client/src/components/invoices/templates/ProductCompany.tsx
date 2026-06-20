import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { TemplateProps } from './types.js';
import { getAccentColor, getLightBg } from './colors.js';

const baseStyles = StyleSheet.create({
  page: { padding: '10mm', fontSize: 8, fontFamily: 'Helvetica', color: '#1F2937', backgroundColor: '#FFFFFF' },
  container: { flexDirection: 'column', width: '100%' },
  headerBar: { marginHorizontal: -20, paddingHorizontal: 20, paddingVertical: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  logoBox: { width: 60, height: 60, marginRight: 16 },
  logo: { width: 60, height: 60, objectFit: 'contain' },
  logoPlaceholder: { width: 60, height: 60, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  headerText: { flex: 1 },
  companyName: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 2 },
  companyDetail: { fontSize: 7, color: 'rgba(255,255,255,0.8)', marginBottom: 1, lineHeight: 1.4 },
  invoiceBadge: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  invoiceBadgeText: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  infoGrid: { flexDirection: 'row', marginBottom: 16, borderRadius: 6, padding: 12 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 6, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  infoValue: { fontSize: 8, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  partiesSection: { flexDirection: 'row', marginBottom: 16, gap: 12 },
  partyCard: { flex: 1, border: '1pt solid #E5E7EB', borderRadius: 6, padding: 10, backgroundColor: '#FFFFFF' },
  partyTitle: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 4 },
  partyText: { fontSize: 7, color: '#374151', marginBottom: 1, lineHeight: 1.4 },
  partyName: { fontSize: 9, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  table: { flexDirection: 'column', marginBottom: 16, border: '1pt solid #E5E7EB', borderRadius: 6, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 6 },
  tableHeaderText: { color: '#FFFFFF', fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB' },
  tableCell: { fontSize: 7, color: '#374151' },
  tableCellBold: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  tableCellRight: { fontSize: 7, color: '#374151', textAlign: 'right' },
  totalRow: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 6 },
  totalCell: { fontSize: 8, fontWeight: 'bold', color: '#1F2937', textAlign: 'right' },
  summarySection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  summaryBox: { width: '50%', padding: 12, borderRadius: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, paddingVertical: 1 },
  summaryLabel: { fontSize: 7, color: '#6B7280' },
  summaryValue: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  summaryGrand: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, paddingTop: 4, marginTop: 4 },
  summaryGrandLabel: { fontSize: 9, fontWeight: 'bold' },
  summaryGrandValue: { fontSize: 9, fontWeight: 'bold' },
  wordsSection: { padding: 8, borderRadius: 4, marginBottom: 12, flexDirection: 'row', backgroundColor: '#F9FAFB' },
  wordsText: { fontSize: 7, fontStyle: 'italic', color: '#6B7280', flex: 1 },
  footer: { flexDirection: 'row', borderTop: '1pt solid #E5E7EB', paddingTop: 10 },
  footerCol: { flex: 1 },
  footerTitle: { fontSize: 7, fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  footerText: { fontSize: 6, color: '#6B7280', marginBottom: 1, lineHeight: 1.4 },
  signArea: { alignItems: 'flex-end', justifyContent: 'flex-end' },
  signLine: { width: 100, borderTop: '1pt solid #374151', marginTop: 16, marginBottom: 3 },
  signLabel: { fontSize: 7, fontWeight: 'bold', color: '#1F2937', textTransform: 'uppercase' },
});

const col = { desc: '30%', hsn: '8%', qty: '8%', rate: '12%', disc: '10%', taxable: '12%', tax: '10%', total: '10%' };

const ProductCompany: React.FC<TemplateProps> = ({ invoiceData }) => {
  const accentColor = getAccentColor(invoiceData);
  const lightBg = getLightBg(accentColor);
  const cur = invoiceData.currency || '$';
  const phoneStr = Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone;
  const showGst = invoiceData.gstConfig !== 'NONE';
  const totalTax = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);
  const formatCur = (val: number) => `${cur}${val.toFixed(2)}`;

  const d = {
    headerBar: { backgroundColor: accentColor },
    logoPlaceholder: { backgroundColor: 'rgba(255,255,255,0.2)' },
    invoiceBadgeText: { color: accentColor },
    infoGrid: { backgroundColor: lightBg },
    partyTitle: { color: accentColor },
    tableHeader: { backgroundColor: accentColor },
    totalRow: { backgroundColor: lightBg },
    summaryBox: { backgroundColor: lightBg },
    summaryGrand: { borderTopColor: accentColor },
    summaryGrandLabel: { color: accentColor },
    summaryGrandValue: { color: accentColor },
    footerTitle: { color: accentColor },
  };

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <View style={baseStyles.container}>
          <View style={[baseStyles.headerBar, d.headerBar]}>
            <View style={baseStyles.logoBox}>
              {invoiceData.seller.logoUrl ? (
                <Image src={invoiceData.seller.logoUrl} style={baseStyles.logo} />
              ) : (
                <View style={[baseStyles.logoPlaceholder, d.logoPlaceholder]}>
                  <Text style={baseStyles.logoPlaceholderText}>{invoiceData.seller.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            <View style={baseStyles.headerText}>
              <Text style={baseStyles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={baseStyles.companyDetail}>{invoiceData.seller.address}</Text>
              <Text style={baseStyles.companyDetail}>Phone: {phoneStr} | Email: {invoiceData.seller.email}</Text>
              {invoiceData.seller.gstin && <Text style={baseStyles.companyDetail}>GSTIN: {invoiceData.seller.gstin}</Text>}
            </View>
            <View style={baseStyles.invoiceBadge}>
              <Text style={[baseStyles.invoiceBadgeText, d.invoiceBadgeText]}>Invoice</Text>
              <Text style={{ fontSize: 7, color: accentColor, marginTop: 2, fontWeight: 'bold' }}>{invoiceData.invoiceNumber}</Text>
            </View>
          </View>

          <View style={[baseStyles.infoGrid, d.infoGrid]}>
            <View style={baseStyles.infoCol}>
              <Text style={baseStyles.infoLabel}>Invoice Date</Text>
              <Text style={baseStyles.infoValue}>{invoiceData.invoiceDate}</Text>
              <Text style={baseStyles.infoLabel}>Place of Supply</Text>
              <Text style={baseStyles.infoValue}>{invoiceData.placeOfSupply}</Text>
            </View>
            <View style={baseStyles.infoCol}>
              <Text style={baseStyles.infoLabel}>Transport Mode</Text>
              <Text style={baseStyles.infoValue}>{invoiceData.transportMode || 'N/A'}</Text>
              <Text style={baseStyles.infoLabel}>Vehicle Number</Text>
              <Text style={baseStyles.infoValue}>{invoiceData.vehicleNumber || 'N/A'}</Text>
            </View>
            <View style={baseStyles.infoCol}>
              <Text style={baseStyles.infoLabel}>Date of Supply</Text>
              <Text style={baseStyles.infoValue}>{invoiceData.dateOfSupply}</Text>
              {invoiceData.seller.msmeRegNo && (
                <><Text style={baseStyles.infoLabel}>MSME Reg No</Text><Text style={baseStyles.infoValue}>{invoiceData.seller.msmeRegNo}</Text></>
              )}
            </View>
          </View>

          <View style={baseStyles.partiesSection}>
            <View style={baseStyles.partyCard}>
              <Text style={[baseStyles.partyTitle, d.partyTitle]}>Buyer (Bill To)</Text>
              <Text style={baseStyles.partyName}>{invoiceData.buyer.name || 'Customer'}</Text>
              <Text style={baseStyles.partyText}>{invoiceData.buyer.address}</Text>
              {invoiceData.buyer.gstin && <Text style={baseStyles.partyText}>GSTIN: {invoiceData.buyer.gstin}</Text>}
              <Text style={baseStyles.partyText}>State: {invoiceData.buyer.state || '-'}</Text>
            </View>
            <View style={baseStyles.partyCard}>
              <Text style={[baseStyles.partyTitle, d.partyTitle]}>Seller (Ship From)</Text>
              <Text style={baseStyles.partyName}>{invoiceData.seller.name}</Text>
              <Text style={baseStyles.partyText}>{invoiceData.seller.address}</Text>
              {invoiceData.seller.gstin && <Text style={baseStyles.partyText}>GSTIN: {invoiceData.seller.gstin}</Text>}
            </View>
          </View>

          <View style={baseStyles.table}>
            <View style={[baseStyles.tableHeader, d.tableHeader]}>
              <Text style={[baseStyles.tableHeaderText, { width: col.desc }]}>Product</Text>
              <Text style={[baseStyles.tableHeaderText, { width: col.hsn, textAlign: 'center' }]}>HSN</Text>
              <Text style={[baseStyles.tableHeaderText, { width: col.qty, textAlign: 'center' }]}>Qty</Text>
              <Text style={[baseStyles.tableHeaderText, { width: col.rate, textAlign: 'right' }]}>Rate</Text>
              <Text style={[baseStyles.tableHeaderText, { width: col.disc, textAlign: 'right' }]}>Disc</Text>
              <Text style={[baseStyles.tableHeaderText, { width: col.taxable, textAlign: 'right' }]}>Taxable</Text>
              {showGst && <Text style={[baseStyles.tableHeaderText, { width: col.tax, textAlign: 'right' }]}>Tax</Text>}
              <Text style={[baseStyles.tableHeaderText, { width: col.total, textAlign: 'right' }]}>Total</Text>
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={baseStyles.tableRow}>
                <Text style={[baseStyles.tableCellBold, { width: col.desc }]}>{item.description}</Text>
                <Text style={[baseStyles.tableCell, { width: col.hsn, textAlign: 'center' }]}>{item.hsn || '-'}</Text>
                <Text style={[baseStyles.tableCell, { width: col.qty, textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[baseStyles.tableCell, { width: col.rate, textAlign: 'right' }]}>{formatCur(item.rate)}</Text>
                <Text style={[baseStyles.tableCell, { width: col.disc, textAlign: 'right' }]}>{formatCur(item.discount)}</Text>
                <Text style={[baseStyles.tableCell, { width: col.taxable, textAlign: 'right' }]}>{formatCur(item.taxableValue)}</Text>
                {showGst && (
                  <Text style={[baseStyles.tableCell, { width: col.tax, textAlign: 'right' }]}>
                    {formatCur((item.cgstAmount || 0) + (item.sgstAmount || 0) + (item.igstAmount || 0))}
                  </Text>
                )}
                <Text style={[baseStyles.tableCellBold, { width: col.total, textAlign: 'right' }]}>{formatCur(item.total)}</Text>
              </View>
            ))}
          </View>

          <View style={baseStyles.summarySection}>
            <View style={[baseStyles.summaryBox, d.summaryBox]}>
              <View style={baseStyles.summaryRow}>
                <Text style={baseStyles.summaryLabel}>Subtotal (Taxable)</Text>
                <Text style={baseStyles.summaryValue}>{formatCur(invoiceData.subtotal)}</Text>
              </View>
              {showGst && (
                <View style={baseStyles.summaryRow}>
                  <Text style={baseStyles.summaryLabel}>Tax ({invoiceData.gstConfig === 'INTRA' ? 'CGST+SGST' : 'IGST'})</Text>
                  <Text style={baseStyles.summaryValue}>{formatCur(totalTax)}</Text>
                </View>
              )}
              <View style={[baseStyles.summaryGrand, d.summaryGrand]}>
                <Text style={[baseStyles.summaryGrandLabel, d.summaryGrandLabel]}>Total Amount</Text>
                <Text style={[baseStyles.summaryGrandValue, d.summaryGrandValue]}>{formatCur(invoiceData.grandTotal)}</Text>
              </View>
            </View>
          </View>

          <View style={baseStyles.wordsSection}>
            <Text style={baseStyles.wordsText}>Amount: {formatCur(invoiceData.grandTotal)}</Text>
          </View>

          <View style={baseStyles.footer}>
            <View style={baseStyles.footerCol}>
              <Text style={[baseStyles.footerTitle, d.footerTitle]}>Bank Details</Text>
              {invoiceData.seller.bank.name && (
                <><Text style={baseStyles.footerText}>{invoiceData.seller.bank.name} - {invoiceData.seller.bank.branch}</Text>
                <Text style={baseStyles.footerText}>A/C: {invoiceData.seller.bank.accountNo}</Text>
                <Text style={baseStyles.footerText}>IFSC: {invoiceData.seller.bank.ifsc}</Text></>
              )}
            </View>
            <View style={baseStyles.footerCol}>
              <Text style={[baseStyles.footerTitle, d.footerTitle]}>Terms</Text>
              <Text style={baseStyles.footerText}>Payment due within 15 days from invoice date</Text>
              <Text style={baseStyles.footerText}>Goods once sold cannot be returned</Text>
            </View>
            <View style={[baseStyles.footerCol, baseStyles.signArea]}>
              <Text style={baseStyles.signLine}></Text>
              <Text style={baseStyles.signLabel}>Authorized Signatory</Text>
              <Text style={{ fontSize: 6, color: '#6B7280' }}>For {invoiceData.seller.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ProductCompany;
